using System.IdentityModel.Tokens.Jwt;
using Google.Apis.Auth;
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
}