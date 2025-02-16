using Schedule.Entities;
using Schedule.Requests;

namespace Schedule.Interfaces;

public interface ILessonService
{
    Task<List<Lesson>> GetAllLessons(CancellationToken cancellationToken);
    Task<LessonGroup> AddLessonGroup(AddLessonInfoInput addLessonInfo, CancellationToken cancellationToken);
    Task<bool> UpdateLessonGroup(UpdateLessonInfoRequest addLessonInfo, CancellationToken cancellationToken);
    Task<bool> DeleteLessonGroup(int id, CancellationToken cancellationToken);
    Task<List<LessonGroup>> GetLessonGroupByStudentGroup(int groupId, CancellationToken cancellationToken);
}