using Schedule.DataLoaders;
using Schedule.Entities;
using Schedule.Interfaces;
using Schedule.Schema.Queries;
using Schedule.Services;

namespace Schedule.Extensions;

public static class ApplicationServicesExtensions
{
    public static void AddApplicationServices(this IServiceCollection services)
    {
        services.AddScoped<IRepository, Repository>();
        services.AddScoped<Query>();
        services.AddScoped<IUserService, UserService>();
        
        // services.AddScoped<DataLoaderWithIntId<EntityWithIntId>>();
        // services.AddScoped<DataLoaderWithStringId<EntityWithStringId>>();
        // services.AddScoped<DataLoaderWithIntId<Teacher>>();
        // services.AddScoped<DataLoaderWithIntId<Group>>();
        // services.AddScoped<DataLoaderWithIntId<Lesson>>();
    }
}