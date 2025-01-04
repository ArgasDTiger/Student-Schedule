using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Schedule.Data;
using Schedule.Schema.Queries;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddGraphQLServer().AddQueryType<Query>();

builder.Services.AddDbContext<ScheduleDbContext>(o =>
    o.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddEndpointsApiExplorer();

var app = builder.Build();

app.MapGraphQL();

app.UseHttpsRedirection();

app.Run();
