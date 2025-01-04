using Core.Interfaces;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Services;

public class Repository(ScheduleDbContext _context) : IRepository
{
    public IQueryable<T> GetAll<T>() where T : class
    {
        _context.ChangeTracker.LazyLoadingEnabled = true;
        return _context.Set<T>();
    }

    public IQueryable<T> GetAllAsNoTracking<T>() where T : class
    {
        _context.ChangeTracker.LazyLoadingEnabled = false;
        return _context.Set<T>().AsNoTracking();
    }

    public T Add<T>(T entity) where T : class
    {
       return _context.Add(entity).Entity;
    }

    public void Remove<T>(T entity) where T : class
    {
        _context.Remove<T>(entity);
    }

    public T Update<T>(T entity) where T : class
    {
        return _context.Update<T>(entity).Entity;
    }

    public Task<int> SaveChangesAsync(CancellationToken cancellationToken)
    {
        return _context.SaveChangesAsync(cancellationToken);
    }
}