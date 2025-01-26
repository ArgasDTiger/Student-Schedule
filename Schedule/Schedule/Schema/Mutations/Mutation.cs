
using Google.Apis.Auth;
using Mapster;
using Microsoft.EntityFrameworkCore;
using Schedule.DTOs;
using Schedule.Entities;
using Schedule.Interfaces;

namespace Schedule.Schema.Mutations;

public partial class Mutation(IRepository repository, IConfiguration configuration, ITokenService tokenService)
{
    public async Task<UserDTO> Login(string idToken, CancellationToken cancellationToken)
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

            tokenService.CreateJwtToken(user);

            UserDTO adaptedUser = user.Role switch
            {
                UserRole.Student => user.Adapt<StudentDTO>(),
                UserRole.Moderator => user.Adapt<ModeratorDTO>(),
                UserRole.Admin => user.Adapt<AdminDTO>(),
                _ => throw new Exception("Unknown user role")
            };

            return adaptedUser;
        }
        catch (Exception ex)
        {
            throw new GraphQLException(new Error("Authentication failed", ex.Message));
        }
    }
}