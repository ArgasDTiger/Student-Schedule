using HotChocolate.Fetching;
using Schedule.Data;

namespace Schedule.Extensions;

public static class DataLoaderServiceExtensions
{
    public static IServiceCollection AddDataLoaders(this IServiceCollection services)
    {
        services.AddScoped<IBatchScheduler, BatchScheduler>();
        
        services.AddScoped<DataLoaderContext>();
        
        return services;
    }
}