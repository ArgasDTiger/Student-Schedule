using Schedule.Entities;

namespace Schedule.Interfaces;

public interface ITokenService
{
    string CreateJwtToken(User user);
}