using System.Reflection;
using Mapster;
using Microsoft.EntityFrameworkCore;
using Schedule.Data;
using Schedule.Extensions;
using Schedule.Middleware;
using Schedule.Schema.Mutations;
using Schedule.Schema.Queries;

var builder = WebApplication.CreateBuilder(args);

TypeAdapterConfig.GlobalSettings.Scan(Assembly.GetExecutingAssembly());

builder.Services
    // .AddAuthorization()
    .AddGraphQLServer()
    .AddQueryType<Query>();
// .AddMutationType<Mutation>()

builder.Services.AddDbContext<ScheduleDbContext>(options =>
    options.UseLazyLoadingProxies()
        .UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// builder.Services.AddGoogleAuthentication(builder.Configuration);
builder.Services.AddApplicationServices();

builder.Services.AddEndpointsApiExplorer();

builder.Services.AddCors(options =>
{
    options.AddPolicy("CorsPolicy", b =>
    {
        b.AllowAnyOrigin()
            .AllowAnyMethod()
            .AllowAnyHeader();
    });
});

var app = builder.Build();

// app.UseAuthentication();
// app.UseAuthorization();
// app.UseMiddleware<GoogleAuthenticationMiddleware>();

app.UseCors("CorsPolicy");
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