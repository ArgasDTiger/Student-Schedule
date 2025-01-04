using Microsoft.EntityFrameworkCore;
using Schedule.Data;
using Schedule.Interfaces;

namespace Schedule.Services;

public class Repository(ScheduleDbContext context) : IRepository
{
    public IQueryable<T> GetAll<T>() where T : class
    {
        context.ChangeTracker.LazyLoadingEnabled = true;
        return context.Set<T>();
    }

    public IQueryable<T> GetAllAsNoTracking<T>() where T : class
    {
        context.ChangeTracker.LazyLoadingEnabled = false;
        return context.Set<T>().AsNoTracking();
    }

    public T Add<T>(T entity) where T : class
    {
       return context.Add(entity).Entity;
    }

    public void Remove<T>(T entity) where T : class
    {
        context.Remove<T>(entity);
    }

    public T Update<T>(T entity) where T : class
    {
        return context.Update<T>(entity).Entity;
    }

    public Task<int> SaveChangesAsync(CancellationToken cancellationToken)
    {
        return context.SaveChangesAsync(cancellationToken);
    }
}