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
    public DbSet<Teacher> Teachers { get; set; }
    public DbSet<User> Users { get; set; }
    public DbSet<RefreshToken> RefreshTokens { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        if (!optionsBuilder.IsConfigured)
        {
            optionsBuilder.UseLazyLoadingProxies();
        }
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Group>()
            .HasOne(g => g.Faculty)
            .WithMany(f => f.Groups)
            .HasForeignKey(g => g.FacultyId)
            .OnDelete(DeleteBehavior.Cascade);

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

        modelBuilder.Entity<User>()
            .HasMany(s => s.Groups)
            .WithMany()
            .UsingEntity(j => j.ToTable("GroupUsers")
                .Property("GroupsId").HasColumnName("GroupId"));

        modelBuilder.Entity<User>()
            .HasMany(m => m.Faculties)
            .WithMany()
            .UsingEntity(j => j.ToTable("FacultyUsers")
                .Property("FacultiesId").HasColumnName("FacultyId"));

        modelBuilder.Entity<RefreshToken>()
            .Property(rt => rt.Revoked)
            .HasDefaultValue(false);
    }
}