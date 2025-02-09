using System.Reflection;
using HotChocolate.Types.Descriptors;
using Mapster;
using Microsoft.EntityFrameworkCore;
using Schedule.Data;
using Schedule.Extensions;
using Schedule.Helpers;
using Schedule.Schema.Mutations;
using Schedule.Schema.Queries;

var builder = WebApplication.CreateBuilder(args);

TypeAdapterConfig.GlobalSettings.Scan(Assembly.GetExecutingAssembly());

builder.Services
    .AddGraphQLServer()
    .AddConvention<INamingConventions>(new PascalCaseEnumConverter())
    .AddQueryType<Query>()
    .AddMutationType<Mutation>()
    .AddAuthorization()
    .AddErrorFilter<DetailedExceptionErrorFilter>();

builder.Services.AddDbContext<ScheduleDbContext>(options =>
    options.UseLazyLoadingProxies()
        .UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddAuthenticationServices(builder.Configuration);
builder.Services.AddApplicationServices();

builder.Services.AddEndpointsApiExplorer();

builder.Services.AddCors(options =>
{
    options.AddPolicy("CorsPolicy", b =>
    {
        b.WithOrigins("http://localhost:4200")
            .AllowAnyMethod()
            .AllowAnyHeader()
            .AllowCredentials();
    });
});

var app = builder.Build();

app.UseCors("CorsPolicy");
app.UseAuthentication();
app.UseAuthorization();

app.MapGraphQL();
app.UseHttpsRedirection();

using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    var loggerFactory = services.GetRequiredService<ILoggerFactory>();
    try
    {
        var context = services.GetRequiredService<ScheduleDbContext>();
        await context.Database.MigrateAsync();
        await context.SeedDataAsync();
    }
    catch (Exception ex)
    {
        var logger = loggerFactory.CreateLogger<Program>();
        logger.LogError(ex, "An error occurred during seeding data.");
    }
}

app.Run();