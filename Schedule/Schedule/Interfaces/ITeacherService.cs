using Schedule.Entities;

namespace Schedule.Interfaces;

public interface ITeacherService
{
    Task<List<Teacher>> GetAllTeachers(string? search, DayOfWeek? weekDay, LessonNumber? lessonNumber, int? lessonGroupId, CancellationToken cancellationToken);
    Task<List<Teacher>> GetAllArchivedTeachers(string? search, CancellationToken cancellationToken);
    Task<Teacher> CreateTeacher(Teacher teacher, CancellationToken cancellationToken);
    Task<bool> UpdateTeacher(Teacher teacher, CancellationToken cancellationToken);
    Task<bool> ArchiveTeacher(int teacherId, CancellationToken cancellationToken);
    Task<bool> PublishTeacher(int teacherId, CancellationToken cancellationToken);
    Task<bool> DeleteTeacher(int teacherId, CancellationToken cancellationToken);
    
}