using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Schedule.Entities;
using Schedule.Interfaces;

namespace Schedule.Services;

public class TokenService : ITokenService
{
    private readonly IConfiguration _configuration;
    private readonly SymmetricSecurityKey _key;
    private readonly IRepository _repository;
    private readonly ICookieService _cookieService;

    public TokenService(IConfiguration config, IRepository repository, ICookieService cookieService)
    {
        _configuration = config;
        _repository = repository;
        _cookieService = cookieService;
        _key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["GoogleAuth:JWT:Key"]!));
    }

    public async Task CreateJwtToken(User user, CancellationToken cancellationToken)
    {
        var claims = new List<Claim>
        {
            new(ClaimTypes.Email, user.Email),
            new(ClaimTypes.Role, user.Role.ToString())
        };

        var credentials = new SigningCredentials(_key, SecurityAlgorithms.HmacSha512Signature);

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(claims),
            Expires = DateTime.UtcNow.AddDays(7),
            SigningCredentials = credentials,
            Issuer = _configuration["GoogleAuth:Jwt:Issuer"],
            Audience = _configuration["GoogleAuth:Jwt:Audience"]
        };

        var tokenHandler = new JwtSecurityTokenHandler();
        var token = tokenHandler.WriteToken(tokenHandler.CreateToken(tokenDescriptor));

        _cookieService.AddAccessToken(token);
        await SetRefreshToken(user, cancellationToken);
    }

    public async Task RefreshToken(CancellationToken cancellationToken)
    {
        var refreshToken = _cookieService.GetRefreshToken();

        var user = await _repository.GetAll<User>()
            .Where(u => u.RefreshTokens.Any(rt => rt.Token == refreshToken))
            .SingleOrDefaultAsync(cancellationToken);

        if (user is null)
            throw new BadHttpRequestException("User is not found");

        var usersRefreshToken = user.RefreshTokens.FirstOrDefault(rt => rt.Token == refreshToken);

        if (usersRefreshToken?.ExpiresAt <= DateTime.UtcNow || usersRefreshToken?.Revoked == true)
            throw new UnauthorizedAccessException("Refresh token is expired or invalid");

        await CreateJwtToken(user, cancellationToken);
    }

    public async Task RevokeToken(int userId, CancellationToken cancellationToken)
    {
        var user = await _repository.GetAll<User>().SingleOrDefaultAsync(u => u.Id == userId, cancellationToken);
        if (user is null)
            throw new BadHttpRequestException("User is not found");

        if (user.RefreshTokens == null || !user.RefreshTokens.Any())
            throw new InvalidOperationException("No refresh tokens are available to revoke");

        foreach (var token in user.RefreshTokens.Where(rt => rt.ExpiresAt > DateTime.UtcNow))
            token.Revoked = true;
        await _repository.SaveChangesAsync(cancellationToken);
        
        _cookieService.RemoveAccessToken();
        _cookieService.RemoveRefreshToken();
    }
    
    private async Task SetRefreshToken(User user, CancellationToken cancellationToken)
    {
        var refreshToken = new RefreshToken
        {
            Token = Convert.ToBase64String(RandomNumberGenerator.GetBytes(64)),
            ExpiresAt = DateTime.UtcNow.AddDays(90),
            CreatedAt = DateTime.UtcNow,
            User = user
        };

        _repository.Add(refreshToken);
        await _repository.SaveChangesAsync(cancellationToken);
        
        _cookieService.AddRefreshToken(refreshToken);
    }
}