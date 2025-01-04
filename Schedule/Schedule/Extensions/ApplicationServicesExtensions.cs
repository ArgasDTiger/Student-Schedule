using Schedule.Interfaces;
using Schedule.Services;

namespace Schedule.Extensions;

public static class ApplicationServicesExtensions
{
    public static void AddApplicationServices(this IServiceCollection services)
    {
        services.AddScoped<IRepository, Repository>();
    }
}