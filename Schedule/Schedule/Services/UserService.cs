using Google.Apis.Auth;
using Microsoft.EntityFrameworkCore;
using Schedule.Entities;
using Schedule.Interfaces;

namespace Schedule.Services;

public class UserService(IRepository repository, IConfiguration configuration) : IUserService
{
    public async Task<User?> AuthenticateGoogleUserAsync(GoogleJsonWebSignature.Payload payload, CancellationToken cancellationToken)
    {
        if (!payload.EmailVerified 
            // || !payload.Email.EndsWith(configuration.GetValue<string>("GoogleAuth:AllowedDomain"))
            )
            return null;

        var user = await repository.GetAll<User>().FirstOrDefaultAsync(u => u.GoogleId == payload.Subject, cancellationToken);

        if (user is null)
        {
            user = new User
            {
                FirstName = payload.GivenName,
                LastName = payload.FamilyName,
                Email = payload.Email,
                GoogleId = payload.Subject,
                Role = UserRole.Student
            };

            repository.Add(user);
            await repository.SaveChangesAsync(cancellationToken);
        }

        return user;
    }
}