using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Data;

public class ScheduleContext : DbContext
{
    public ScheduleContext(DbContextOptions<ScheduleContext> options) : base(options)
    {
    }
    
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        
    }
}