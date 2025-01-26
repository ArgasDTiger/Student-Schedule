using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using Schedule.Entities;
using Schedule.Interfaces;

namespace Schedule.Services;

public class TokenService : ITokenService
{
    private readonly IConfiguration _configuration;
    private readonly SymmetricSecurityKey _key;
    private readonly IHttpContextAccessor _httpContextAccessor;
    
    public TokenService(IConfiguration config, IHttpContextAccessor httpContextAccessor)
    {
        _configuration = config;
        _httpContextAccessor = httpContextAccessor;
        _key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["GoogleAuth:JWT:Key"]!));
    }
    public string CreateJwtToken(User user)
    {
        var claims = new List<Claim>
        {
            new(ClaimTypes.Email, user.Email),
            new(ClaimTypes.Role, user.Role.ToString())
        };

        var credentials = new SigningCredentials(_key, SecurityAlgorithms.HmacSha512Signature);

        
        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(claims),
            Expires = DateTime.Now.AddDays(7),
            SigningCredentials = credentials,
            Issuer = _configuration["GoogleAuth:Jwt:Issuer"],
            Audience = _configuration["GoogleAuth:Jwt:Audience"]
        };
        
        var tokenHandler = new JwtSecurityTokenHandler();
        var token = tokenHandler.WriteToken(tokenHandler.CreateToken(tokenDescriptor));

        var httpContext = _httpContextAccessor.HttpContext;
        httpContext?.Response.Cookies.Append("token", token,
            new CookieOptions
            {
                Expires = DateTime.Now.AddDays(7),
                HttpOnly = true,
                Secure = true,
                IsEssential = true,
                SameSite = SameSiteMode.None
            });

        return token;
        
    }
}