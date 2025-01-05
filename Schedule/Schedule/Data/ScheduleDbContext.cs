using Microsoft.EntityFrameworkCore;
using Schedule.Entities;

namespace Schedule.Data;

public class ScheduleDbContext : DbContext
{
    public ScheduleDbContext(DbContextOptions<ScheduleDbContext> options) : base(options)
    {
    }
    
    public DbSet<Faculty> Faculties { get; set; }
    public DbSet<Group> Groups { get; set; }
    public DbSet<Lesson> Lessons { get; set; }
    public DbSet<LessonGroup> LessonGroup { get; set; }
    // public DbSet<LessonTeacher> LessonTeacher { get; set; }
    public DbSet<Teacher> Teachers { get; set; }
    public DbSet<User> Users { get; set; }
    
    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        if (!optionsBuilder.IsConfigured)
        {
            optionsBuilder.UseLazyLoadingProxies();
        }
    }
    
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Faculty>()
            .HasKey(f => f.Id);

        modelBuilder.Entity<Group>()
            .HasKey(g => g.Id);

        modelBuilder.Entity<Group>()
            .HasOne(g => g.Faculty)
            .WithMany()
            .HasForeignKey("FacultyId")
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Lesson>()
            .HasKey(l => l.Id);

        modelBuilder.Entity<LessonGroup>()
            .HasKey(lg => lg.Id);

        modelBuilder.Entity<LessonGroup>()
            .HasOne(lg => lg.Lesson)
            .WithMany()
            .HasForeignKey("LessonId");

        modelBuilder.Entity<LessonGroup>()
            .HasOne(lg => lg.Group)
            .WithMany()
            .HasForeignKey("GroupId");
        
        modelBuilder.Entity<LessonGroup>()
            .HasOne(lt => lt.Teacher)
            .WithMany()
            .HasForeignKey("TeacherId");
        
        // modelBuilder.Entity<LessonTeacher>()
        //     .HasKey(lt => lt.Id);
        //
        // modelBuilder.Entity<LessonTeacher>()
        //     .HasOne(lt => lt.Teacher)
        //     .WithMany()
        //     .HasForeignKey("TeacherId");
        //
        // modelBuilder.Entity<LessonTeacher>()
        //     .HasOne(lt => lt.Faculty)
        //     .WithMany()
        //     .HasForeignKey("FacultyId");
        //
        // modelBuilder.Entity<LessonTeacher>()
        //     .Property(lt => lt.StartTime)
        //     .HasConversion(v => v.ToTimeSpan(), v => TimeOnly.FromTimeSpan(v));
        
        modelBuilder.Entity<Teacher>()
            .HasKey(t => t.Id);

        modelBuilder.Entity<User>()
            .HasKey(u => u.Id);

        modelBuilder.Entity<User>()
            .HasMany(s => s.Groups)
            .WithMany();

        modelBuilder.Entity<User>()
            .HasMany(m => m.Faculties)
            .WithMany();
    }
}