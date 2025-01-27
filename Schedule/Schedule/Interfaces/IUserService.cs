using Schedule.DTOs;

namespace Schedule.Interfaces;

public interface IUserService
{
    Task<UserDTO> Login(string idToken, CancellationToken cancellationToken);
    Task<UserDTO> GetCurrentUser(CancellationToken cancellationToken);
}