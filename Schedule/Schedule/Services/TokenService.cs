using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;
using Schedule.Entities;
using Schedule.Interfaces;

namespace Schedule.Services;

public class TokenService(IConfiguration configuration) : ITokenService
{
    public string CreateJwtToken(User user)
    {
        var key = configuration["GoogleAuth:Jwt:Key"] ?? throw new Exception("Authentication failed.");

        var claims = new List<Claim>
        {
            new(ClaimTypes.Email, user.Email),
            new(ClaimTypes.Role, user.Role.ToString())
        };

        var securityKey = new SymmetricSecurityKey(System.Text.Encoding.UTF8.GetBytes(key));
        var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: configuration["GoogleAuth:Jwt:Issuer"],
            audience: configuration["GoogleAuth:Jwt:Audience"],
            claims: claims,
            expires: DateTime.Now.AddDays(7),
            signingCredentials: credentials);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}