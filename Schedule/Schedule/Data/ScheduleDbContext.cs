using Microsoft.EntityFrameworkCore;
using Schedule.Entities;

namespace Schedule.Data;

public class ScheduleDbContext : DbContext
{
    public ScheduleDbContext(DbContextOptions<ScheduleDbContext> options) : base(options)
    {
        Console.WriteLine("DbContext created");
    }

    public override void Dispose()
    {
        Console.WriteLine("DbContext disposed");
        base.Dispose();
    }
    
    public DbSet<Faculty> Faculties { get; set; }
    public DbSet<Group> Groups { get; set; }
    public DbSet<Lesson> Lessons { get; set; }
    public DbSet<LessonGroup> LessonGroup { get; set; }
    // public DbSet<LessonTeacher> LessonTeacher { get; set; }
    public DbSet<Teacher> Teachers { get; set; }
    public DbSet<User> Users { get; set; }
    public DbSet<Student> Students { get; set; }
    public DbSet<Moderator> Moderators { get; set; }
    public DbSet<Admin> Administrators { get; set; }
    
    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        if (!optionsBuilder.IsConfigured)
        {
            optionsBuilder.UseLazyLoadingProxies();
        }
    }
    
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Student>().ToTable("Students");
        modelBuilder.Entity<Moderator>().ToTable("Moderators");
        modelBuilder.Entity<Admin>().ToTable("Administrators");
        
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

        modelBuilder.Entity<Student>()
            .HasMany(s => s.Groups)
            .WithMany();

        modelBuilder.Entity<Moderator>()
            .HasMany(m => m.Faculties)
            .WithMany();
    }
}