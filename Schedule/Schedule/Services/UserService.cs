using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
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
}