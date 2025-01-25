using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Google.Apis.Auth;
using Microsoft.IdentityModel.Tokens;
using Schedule.Entities;
using Schedule.Interfaces;
using Schedule.Models.Payloads;

namespace Schedule.Schema.Mutations;

public class Mutation(IRepository repository, IUserService userService, IConfiguration configuration)
{
    public async Task<GoogleSignInPayload> Login(string requestToken, CancellationToken cancellationToken)
    {
        try
        {
            var clientId = configuration["GoogleAuth:ClientId"]
                ?? throw new Exception("Google ClientId is not configured");
            // var allowedDomain = configuration["GoogleAuth:AllowedDomain"]
            //                ?? throw new Exception("Allowed Domain is not configured");
                
            var settings = new GoogleJsonWebSignature.ValidationSettings
            {
                Audience = new[] { clientId }
            };

            var payload = await GoogleJsonWebSignature.ValidateAsync(requestToken, settings);
            
            // if (!payload.Email.EndsWith(allowedDomain))
            // {
            //     throw new Exception("Invalid email domain");
            // }

            var user = await userService.AuthenticateGoogleUserAsync(payload, cancellationToken);
            if (user is null)
                throw new Exception("Authentication failed");

            var token = GenerateJwtToken(user);

            return new GoogleSignInPayload
            {
                User = user,
                Token = token
            };
        }
        catch (Exception ex)
        {
            throw new GraphQLException(new Error("Authentication failed", ex.Message));
        }
    }

    private string GenerateJwtToken(User user)
    {
        var key = configuration["Authentication:Jwt:Key"] 
            ?? throw new Exception("JWT Key not configured");

        var claims = new List<Claim>
        {
            new(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new(ClaimTypes.Email, user.Email),
            new(ClaimTypes.Role, user.Role.ToString())
        };

        var securityKey = new SymmetricSecurityKey(System.Text.Encoding.UTF8.GetBytes(key));
        var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: configuration["Authentication:Jwt:Issuer"],
            audience: configuration["Authentication:Jwt:Audience"],
            claims: claims,
            expires: DateTime.Now.AddDays(7),
            signingCredentials: credentials);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}