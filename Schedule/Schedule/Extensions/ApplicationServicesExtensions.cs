using Schedule.Interfaces;
using Schedule.Schema.Mutations;
using Schedule.Schema.Queries;
using Schedule.Services;

namespace Schedule.Extensions;

public static class ApplicationServicesExtensions
{
    public static void AddApplicationServices(this IServiceCollection services)
    {
        services.AddScoped<IRepository, Repository>();
        services.AddScoped<IUserService, UserService>();
        services.AddScoped<ITokenService, TokenService>();
        services.AddScoped<ICookieService, CookieService>();
        services.AddScoped<ILessonService, LessonService>();
        services.AddScoped<IGroupService, GroupService>();
        services.AddScoped<ITeacherService, TeacherService>();

        services.AddScoped<Query>();
        services.AddScoped<Mutation>();
        
        services.AddHttpContextAccessor();
        
        // services.AddScoped<DataLoaderWithIntId<EntityWithIntId>>();
        // services.AddScoped<DataLoaderWithStringId<EntityWithStringId>>();
        // services.AddScoped<DataLoaderWithIntId<Teacher>>();
        // services.AddScoped<DataLoaderWithIntId<Group>>();
        // services.AddScoped<DataLoaderWithIntId<Lesson>>();
    }
}