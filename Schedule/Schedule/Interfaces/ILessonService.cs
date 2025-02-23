using Schedule.Entities;
using Schedule.Requests;

namespace Schedule.Interfaces;

public interface ILessonService
{
    Task<List<Lesson>> GetAllLessons(string? search, CancellationToken cancellationToken);
    Task<List<Lesson>> GetAllArchivedLessons(string? search, CancellationToken cancellationToken);
    Task<Lesson> CreateLesson(string name, CancellationToken cancellationToken);
    Task<bool> UpdateLesson(Lesson lesson, CancellationToken cancellationToken);
    Task<bool> ArchiveLesson(int lessonId, CancellationToken cancellationToken);
    Task<bool> PublishLesson(int lessonId, CancellationToken cancellationToken);
    Task<bool> DeleteLesson(int lessonId, CancellationToken cancellationToken);
    Task<LessonGroup> AddLessonGroup(AddLessonInfoInput addLessonInfo, CancellationToken cancellationToken);
    Task<bool> UpdateLessonGroup(UpdateLessonInfoInput addLessonInfo, CancellationToken cancellationToken);
    Task<bool> DeleteLessonGroup(int id, CancellationToken cancellationToken);
    Task<List<LessonGroup>> GetLessonGroupByStudentGroup(int groupId, CancellationToken cancellationToken);
}