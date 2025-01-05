using System.Security.Claims;
using Google.Apis.Auth;

namespace Schedule.Middleware;

public class GoogleAuthenticationMiddleware(RequestDelegate next, IConfiguration configuration)
{
    public async Task InvokeAsync(HttpContext context)
    {
        if (context.Request.Path.StartsWithSegments("/graphql"))
        {
            var token = context.Request.Headers["Authorization"]
                .FirstOrDefault()?.Replace("Bearer ", "");

            if (!string.IsNullOrEmpty(token))
            {
                try
                {
                    var settings = new GoogleJsonWebSignature.ValidationSettings
                    {
                        Audience = new[] { configuration.GetValue<string>("GoogleAuth:ClientId") }
                    };

                    var payload = await GoogleJsonWebSignature.ValidateAsync(token, settings);
                    context.User = new ClaimsPrincipal(
                        new ClaimsIdentity(new[]
                        {
                            new Claim(ClaimTypes.NameIdentifier, payload.Subject),
                            new Claim(ClaimTypes.Email, payload.Email),
                            new Claim(ClaimTypes.GivenName, payload.GivenName),
                            new Claim(ClaimTypes.Surname, payload.FamilyName)
                        }, "Google")
                    );
                }
                catch
                {
                    context.Response.StatusCode = 401;
                    return;
                }
            }
        }

        await next(context);
    }
}