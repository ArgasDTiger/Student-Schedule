using Schedule.Entities;

namespace Schedule.Interfaces;

public interface ITokenService
{
    Task CreateJwtToken(User user, CancellationToken cancellationToken);
    Task RefreshToken(CancellationToken cancellationToken);
    Task RevokeToken(int userId, CancellationToken cancellationToken);
}