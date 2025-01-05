using Microsoft.EntityFrameworkCore;
using Schedule.Data;
using Schedule.Extensions;
using Schedule.Schema.Queries;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddGraphQLServer().AddQueryType<Query>();

builder.Services.AddDbContext<ScheduleDbContext>(options =>
        options.UseLazyLoadingProxies()
            .UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddApplicationServices();

builder.Services.AddEndpointsApiExplorer();

var app = builder.Build();

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
        logger.LogError(ex, "An error occured during seeding data.");
    }
}

app.Run();
