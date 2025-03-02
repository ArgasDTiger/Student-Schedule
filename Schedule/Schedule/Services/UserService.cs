using System.IdentityModel.Tokens.Jwt;
using Google.Apis.Auth;
using GreenDonut.Predicates;
using Mapster;
using Microsoft.EntityFrameworkCore;
using Schedule.DTOs;
using Schedule.Entities;
using Schedule.Exceptions;
using Schedule.Interfaces;

namespace Schedule.Services;

public class UserService : IUserService
{
    private readonly IRepository _repository;
    private readonly ICookieService _cookieService;
    private readonly IConfiguration _configuration;
    private readonly ITokenService _tokenService;

    public UserService(IRepository repository, ICookieService cookieService, IConfiguration configuration, ITokenService tokenService)
    {
        _repository = repository;
        _cookieService = cookieService;
        _configuration = configuration;
        _tokenService = tokenService;
    }

    public async Task<UserDTO> Login(string idToken, CancellationToken cancellationToken)
    {
        var clientId = _configuration["GoogleAuth:ClientId"] ?? throw new Exception("Login failed.");

        var settings = new GoogleJsonWebSignature.ValidationSettings
        {
            Audience = new[] { clientId }
        };

        var payload = await GoogleJsonWebSignature.ValidateAsync(idToken, settings);

        // var allowedDomain = configuration["GoogleAuth:AllowedDomain"]
        //                ?? throw new Exception("Allowed Domain is not configured");
        // if (!payload.Email.EndsWith(allowedDomain))
        // {
        //     throw new Exception("Invalid email domain");
        // }

        var user = await _repository.GetAll<User>()
            .SingleOrDefaultAsync(u => u.GoogleId == payload.Subject, cancellationToken);
        if (user is null)
            throw new Exception("User is not found.");

        await _tokenService.CreateJwtToken(user, cancellationToken);
        
        return user.Adapt<UserDTO>();
    }

    public async Task<UserDTO> GetCurrentUser(CancellationToken cancellationToken)
    {
        var token = _cookieService.GetAccessToken();
        
        var handler = new JwtSecurityTokenHandler();

        if (!handler.CanReadToken(token))
            throw new DetailedException("Token is invalid.");

        var jwtToken = handler.ReadJwtToken(token);

        var email = jwtToken.Claims.FirstOrDefault(c => c.Type == "email")?.Value;

        if (string.IsNullOrEmpty(email))
            throw new DetailedException("Token is invalid.");

        var user = await _repository.GetAll<User>().SingleOrDefaultAsync(u => u.Email == email, cancellationToken);

        return user.Adapt<UserDTO>();
    }

    public Task<List<User>> GetStudents(string? search, CancellationToken cancellationToken)
    {
        return _repository.GetAll<User>()
            .Where(u => 
                u.Role == UserRole.Student
                && (search == null 
                    || EF.Functions.Like(u.FirstName, $"%{search}%")
                    || EF.Functions.Like(u.LastName, $"%{search}%")
                    || EF.Functions.Like(u.MiddleName, $"%{search}%")
                    || EF.Functions.Like(u.Email, $"%{search}%")
                    || EF.Functions.Like(u.LastName + " " + u.FirstName, $"%{search}%")
                    || EF.Functions.Like(u.LastName + " " + u.FirstName + " " + u.MiddleName, $"%{search}%")))
            .OrderBy(u => u.LastName)
            .ToListAsync(cancellationToken);
    }

    public Task<List<User>> GetStudentsByGroup(string? search, int groupId, CancellationToken cancellationToken)
    {
        return _repository.GetAll<User>()
            .Where(u => u.Role == UserRole.Student 
                        && u.Groups.Any(g => g.Id == groupId)
                        && (search == null 
                            || EF.Functions.Like(u.FirstName, $"%{search}%")
                            || EF.Functions.Like(u.LastName, $"%{search}%")
                            || EF.Functions.Like(u.MiddleName, $"%{search}%")
                            || EF.Functions.Like(u.Email, $"%{search}%")
                            || EF.Functions.Like(u.LastName + " " + u.FirstName, $"%{search}%")
                            || EF.Functions.Like(u.LastName + " " + u.FirstName + " " + u.MiddleName, $"%{search}%")))
            .OrderBy(u => u.LastName)
            .ToListAsync(cancellationToken);
    }

    public Task<List<User>> GetStudentsOutsideGroup(string? search, int groupId, CancellationToken cancellationToken)
    {
        return _repository.GetAll<User>()
            .Where(u => u.Role == UserRole.Student 
                        && (u.Groups.All(g => g.Id != groupId) || u.Groups.Count == 0)
                        && (search == null 
                            || EF.Functions.Like(u.FirstName, $"%{search}%")
                            || EF.Functions.Like(u.LastName, $"%{search}%")
                            || EF.Functions.Like(u.MiddleName, $"%{search}%")
                            || EF.Functions.Like(u.Email, $"%{search}%")
                            || EF.Functions.Like(u.LastName + " " + u.FirstName, $"%{search}%")
                            || EF.Functions.Like(u.LastName + " " + u.FirstName + " " + u.MiddleName, $"%{search}%")))
            .OrderBy(u => u.LastName)
            .ToListAsync(cancellationToken);
    }

    public async Task<bool> PromoteUserToModerator(int userId, CancellationToken cancellationToken)
    {
        var user = await _repository.GetAll<User>().Where(u => u.Id == userId).SingleOrDefaultAsync(cancellationToken);
        if (user is null)
            throw new UserIsNotFoundException();

        if (user.Role == UserRole.Moderator || user.Role == UserRole.Admin)
            throw new DetailedException("User cannot be promoted.");

        user.Role = UserRole.Moderator;

        return await _repository.SaveChangesAsync(cancellationToken);
    }

    public async Task<bool> DemoteUserFromModerator(int userId, CancellationToken cancellationToken)
    {
        var user = await _repository.GetAll<User>().Where(u => u.Id == userId).SingleOrDefaultAsync(cancellationToken);
        if (user is null)
            throw new UserIsNotFoundException();

        if (user.Role != UserRole.Moderator)
            throw new DetailedException("User cannot be demoted.");

        user.Role = UserRole.Student;

        return await _repository.SaveChangesAsync(cancellationToken);
    }

    public async Task<bool> AddUserToGroup(int userId, int groupId, CancellationToken cancellationToken)
    {
        var user = await _repository.GetAll<User>().Where(u => u.Id == userId).SingleOrDefaultAsync(cancellationToken);
        if (user is null)
            throw new UserIsNotFoundException();
        
        var group = await _repository.GetAll<Group>().Where(g => g.Id == groupId).SingleOrDefaultAsync(cancellationToken);
        if (group is null)
            throw new DetailedException("Group is not found.");
        
        if (user.Groups.Any(g => g.Id == groupId))
            throw new DetailedException("User is already in this group.");
        
        user.Groups.Add(group);

        return await _repository.SaveChangesAsync(cancellationToken);
    }

    public async Task<bool> RemoveUserFromGroup(int userId, int groupId, CancellationToken cancellationToken)
    {
        var user = await _repository.GetAll<User>().Where(u => u.Id == userId).SingleOrDefaultAsync(cancellationToken);
        if (user is null)
            throw new UserIsNotFoundException();
        
        var group = await _repository.GetAll<Group>().Where(g => g.Id == groupId).SingleOrDefaultAsync(cancellationToken);
        if (group is null)
            throw new DetailedException("Group is not found.");
        
        if (user.Groups.All(g => g.Id != groupId))
            throw new DetailedException("User is not included in this group.");
        
        user.Groups.Remove(group);
        
        return await _repository.SaveChangesAsync(cancellationToken);
    }

    public async Task<User> AddStudent(User user, CancellationToken cancellationToken)
    {
        var existingStudent = await _repository.GetAllAsNoTracking<User>().Where(u => u.Email == user.Email)
            .SingleOrDefaultAsync(cancellationToken);
        if (existingStudent is not null)
            throw new DetailedException("User already exists.");

        user.Role = UserRole.Student;
        var addedUser = _repository.Add(user);
        await _repository.SaveChangesAsync(cancellationToken);
        return addedUser;
    }

    public async Task<bool> UpdateStudent(User user, CancellationToken cancellationToken)
    {
        var existingStudent = await _repository.GetAllAsNoTracking<User>().Where(u => u.Id == user.Id)
            .SingleOrDefaultAsync(cancellationToken);
        if (existingStudent is null)
            throw new UserIsNotFoundException();

        var usersWithEmail = await _repository.GetAllAsNoTracking<User>().Where(u => u.Email == user.Email)
            .ToListAsync(cancellationToken);

        if (usersWithEmail.Count > 1)
            throw new DetailedException("Can't update user to use this email.");

        _repository.Update(user);
        return await _repository.SaveChangesAsync(cancellationToken);
    }

    public async Task<bool> RemoveStudent(int userId, CancellationToken cancellationToken)
    {
        var existingStudent = await _repository.GetAll<User>().Where(u => u.Id == userId)
            .SingleOrDefaultAsync(cancellationToken);
        if (existingStudent is null)
            throw new UserIsNotFoundException();
        
        _repository.Remove(existingStudent);
        return await _repository.SaveChangesAsync(cancellationToken);
    }

    public async Task<bool> AddModeratorToFaculty(int userId, int facultyId, CancellationToken cancellationToken)
    {
        var user = await _repository.GetAll<User>().Where(u => u.Id == userId)
            .SingleOrDefaultAsync(cancellationToken);
        if (user is null)
            throw new UserIsNotFoundException();

        if (user.Faculties.Any(f => f.Id == facultyId))
            throw new DetailedException("User already has access to this faculty.");

        if (user.Groups.Count != 0)
            user.Groups = [];

        if (user.Role != UserRole.Moderator)
            user.Role = UserRole.Moderator;

        var faculty = await _repository.GetAll<Faculty>().Where(f => f.Id == facultyId)
            .SingleOrDefaultAsync(cancellationToken);

        if (faculty is null)
            throw new DetailedException("Faculty does not exist.");
        
        user.Faculties.Add(faculty);
        return await _repository.SaveChangesAsync(cancellationToken);
    }

    public async Task<bool> RemoveModeratorFromFaculty(int userId, int facultyId, CancellationToken cancellationToken)
    {
        var user = await _repository.GetAll<User>().Where(u => u.Id == userId)
            .SingleOrDefaultAsync(cancellationToken);
        if (user is null)
            throw new UserIsNotFoundException();

        if (user.Faculties.All(f => f.Id != facultyId))
            throw new DetailedException("User does not belong to this faculty.");

        var faculty = await _repository.GetAll<Faculty>().Where(f => f.Id == facultyId)
            .SingleOrDefaultAsync(cancellationToken);

        if (faculty is null)
            throw new DetailedException("Faculty does not exist.");

        if (user.Faculties.Count == 1)
            user.Role = UserRole.Moderator;
        
        user.Faculties.Remove(faculty);
        return await _repository.SaveChangesAsync(cancellationToken);
    }

    public Task<List<User>> GetUsers(string? search, CancellationToken cancellationToken)
    {
        return _repository
            .GetAll<User>()
            .Where(
                u => u.Role != UserRole.Admin
                     && (search == null 
                         || EF.Functions.Like(u.FirstName, $"%{search}%")
                         || EF.Functions.Like(u.LastName, $"%{search}%")
                         || EF.Functions.Like(u.MiddleName, $"%{search}%")
                         || EF.Functions.Like(u.Email, $"%{search}%")
                         || EF.Functions.Like(u.LastName + " " + u.FirstName, $"%{search}%")
                         || EF.Functions.Like(u.LastName + " " + u.FirstName + " " + u.MiddleName, $"%{search}%")))
            .ToListAsync(cancellationToken);
    }

    public Task<List<User>> GetModerators(string? search, int facultyId, CancellationToken cancellationToken)
    {
        return _repository
            .GetAll<User>()
            .Where(
                u => u.Role == UserRole.Moderator && u.Faculties.Any(f => f.Id == facultyId)
                                                  && (search == null 
                                                      || EF.Functions.Like(u.FirstName, $"%{search}%")
                                                      || EF.Functions.Like(u.LastName, $"%{search}%")
                                                      || EF.Functions.Like(u.MiddleName, $"%{search}%")
                                                      || EF.Functions.Like(u.Email, $"%{search}%")
                                                      || EF.Functions.Like(u.LastName + " " + u.FirstName, $"%{search}%")
                                                      || EF.Functions.Like(u.LastName + " " + u.FirstName + " " + u.MiddleName, $"%{search}%")))
            .ToListAsync(cancellationToken);
    }
}