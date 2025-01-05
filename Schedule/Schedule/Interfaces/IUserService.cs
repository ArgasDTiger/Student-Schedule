using Google.Apis.Auth;
using Schedule.Entities;

namespace Schedule.Interfaces;

public interface IUserService
{
    Task<User?> AuthenticateGoogleUserAsync(GoogleJsonWebSignature.Payload payload, CancellationToken cancellationToken);
}