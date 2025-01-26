using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Google.Apis.Auth;
using HotChocolate.Authorization;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Schedule.Entities;
using Schedule.Interfaces;
using Schedule.Models.Payloads;

namespace Schedule.Schema.Mutations;

public partial class Mutation(IRepository repository, IUserService userService, IConfiguration configuration)
{
    public async Task<GoogleSignInPayload> Login(string idToken, CancellationToken cancellationToken)
    {
        try
        {
            var clientId = configuration["GoogleAuth:ClientId"] ?? throw new Exception("Authentication failed.");
            // var allowedDomain = configuration["GoogleAuth:AllowedDomain"]
            //                ?? throw new Exception("Allowed Domain is not configured");
                
            var settings = new GoogleJsonWebSignature.ValidationSettings
            {
                Audience = new[] { clientId }
            };

            var payload = await GoogleJsonWebSignature.ValidateAsync(idToken, settings);
            
            // if (!payload.Email.EndsWith(allowedDomain))
            // {
            //     throw new Exception("Invalid email domain");
            // }

            var user = await repository.GetAll<User>().SingleOrDefaultAsync(u => u.GoogleId == payload.Subject, cancellationToken);
            if (user is null)
                throw new Exception("User is not found.");

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