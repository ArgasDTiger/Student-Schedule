using Schedule.Entities;
using Schedule.Interfaces;

namespace Schedule.Services;

public class CookieService : ICookieService
{
    private readonly IHttpContextAccessor _httpContextAccessor;
    private readonly HttpContext? _httpContext;

    public CookieService(IHttpContextAccessor httpContextAccessor)
    {
        _httpContextAccessor = httpContextAccessor;
        _httpContext = httpContextAccessor.HttpContext;
    }

    public string GetAccessToken()
    {
        var httpContext = _httpContextAccessor.HttpContext;
        var accessToken = httpContext?.Request.Cookies["X-Access-Token"];
        if (string.IsNullOrEmpty(accessToken))
            throw new UnauthorizedAccessException("Access token is missing or invalid");
        return accessToken;
    }

    public string GetRefreshToken()
    {
        var httpContext = _httpContextAccessor.HttpContext;
        var refreshToken = httpContext?.Request.Cookies["X-Refresh-Token"];
        if (string.IsNullOrEmpty(refreshToken))
            throw new UnauthorizedAccessException("Refresh token is missing or invalid");
        return refreshToken;
    }

    public void AddRefreshToken(RefreshToken refreshToken)
    {
        _httpContext?.Response.Cookies.Append("X-Refresh-Token", refreshToken.Token,
            new CookieOptions
            {
                Expires = refreshToken.ExpiresAt,
                HttpOnly = true,
                Secure = true,
                IsEssential = true,
                SameSite = SameSiteMode.None
            });
    }

    public void AddAccessToken(string token)
    {
        _httpContext?.Response.Cookies.Append("X-Access-Token", token,
            new CookieOptions
            {
                Expires = DateTime.UtcNow.AddMinutes(30),
                HttpOnly = true,
                Secure = true,
                IsEssential = true,
                SameSite = SameSiteMode.None
            });
    }

    public void RemoveAccessToken()
    {
        if (_httpContext?.Request.Cookies["X-Access-Token"] is not null)
        {
            _httpContext.Response.Cookies.Append("X-Access-Token", "", new CookieOptions
            {
                Expires = DateTime.UtcNow.AddDays(-1)
            });
        }
    }

    public void RemoveRefreshToken()
    {
        if (_httpContext?.Request.Cookies["X-Refresh-Token"] is not null)
        {
            _httpContext.Response.Cookies.Append("X-Refresh-Token", "", new CookieOptions
            {
                Expires = DateTime.UtcNow.AddDays(-1)
            });
        }
    }
}