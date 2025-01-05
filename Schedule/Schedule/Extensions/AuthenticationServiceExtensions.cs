using System.Security.Claims;
using Microsoft.AspNetCore.Authentication.OAuth;
using Schedule.Helpers.GoogleAuth;

namespace Schedule.Extensions;

public static class AuthenticationServiceExtensions
{
    public static IServiceCollection AddGoogleAuthentication(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        var googleOptions = configuration
            .GetSection(GoogleAuthOptions.SectionName)
            .Get<GoogleAuthOptions>();

        services.AddAuthentication()
            .AddCookie()
            .AddGoogle(options =>
            {
                options.ClientId = googleOptions.ClientId;
                options.ClientSecret = googleOptions.ClientSecret;
                
                options.Events = new OAuthEvents
                {
                    OnTicketReceived = async context =>
                    {
                        var email = context.Principal.FindFirstValue(ClaimTypes.Email);
                        if (!email.EndsWith($"@{googleOptions.AllowedDomain}"))
                        {
                            context.Response.StatusCode = 403;
                            context.HandleResponse();
                        }
                    }
                };
            });

        return services;
    }
}
