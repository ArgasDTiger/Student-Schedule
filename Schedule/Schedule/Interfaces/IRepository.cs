namespace Schedule.Interfaces;

public interface IRepository
{
    IQueryable<T> GetAll<T>() where T : class;
    IQueryable<T> GetAllAsNoTracking<T>() where T : class;
    T Add<T>(T entity) where T : class;
    void Remove<T>(T entity) where T : class;
    T Update<T>(T entity) where T : class;
    Task<int> SaveChangesAsync(CancellationToken cancellationToken);
}