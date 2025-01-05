using Microsoft.EntityFrameworkCore;
using Schedule.Entities;
using Schedule.Interfaces;
namespace Schedule.DataLoaders;

public class DataLoaderWithStringId<TEntity>(
    IBatchScheduler batchScheduler, 
    DataLoaderOptions options, 
    IRepository repository) 
    : BatchDataLoader<string, TEntity>(batchScheduler, options) 
    where TEntity : EntityWithStringId
{
    protected override async Task<IReadOnlyDictionary<string, TEntity>> LoadBatchAsync(
        IReadOnlyList<string> keys, 
        CancellationToken cancellationToken)
    {
        var data = await repository.GetAll<TEntity>()
            .Where(t => keys.Contains(t.Id))
            .ToDictionaryAsync(x => x.Id, cancellationToken);
            
        return data;
    }
}