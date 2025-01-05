using GreenDonut.Predicates;
using Microsoft.EntityFrameworkCore;
using Schedule.Entities;
using Schedule.Interfaces;

namespace Schedule.DataLoaders;

public class DataLoaderWithIntId<TEntity>(
    IBatchScheduler batchScheduler, 
    DataLoaderOptions options, 
    IRepository repository) 
    : BatchDataLoader<int, TEntity>(batchScheduler, options) 
    where TEntity : EntityWithIntId
{
    protected override async Task<IReadOnlyDictionary<int, TEntity>> LoadBatchAsync(
        IReadOnlyList<int> keys, 
        CancellationToken cancellationToken)
    {
        var data = await repository.GetAll<TEntity>()
            .Where(t => keys.Contains(t.Id))
            .ToDictionaryAsync(x => x.Id, cancellationToken);
            
        return data;
    }
}