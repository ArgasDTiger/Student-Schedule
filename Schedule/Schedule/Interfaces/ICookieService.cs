using Schedule.Entities;

namespace Schedule.Interfaces;

public interface ICookieService
{
    string GetAccessToken();
    string GetRefreshToken();
    void AddRefreshToken(RefreshToken refreshToken);
    void AddAccessToken(string token);
    void RemoveAccessToken();
    void RemoveRefreshToken();
}