using HotChocolate.Authorization;
using Mapster;
using Schedule.DTOs;
using Schedule.Entities;

namespace Schedule.Schema.Queries;

public partial class Query
{
    public async Task<List<LessonDTO>> GetLessons(string? search, CancellationToken cancellationToken)
    {
        var lessons = await _lessonService.GetAllLessons(search, cancellationToken);
        return lessons.Adapt<List<LessonDTO>>();
    }
    
    public async Task<List<LessonDTO>> GetArchivedLessons(string? search, CancellationToken cancellationToken)
    {
        var lessons = await _lessonService.GetAllArchivedLessons(search, cancellationToken);
        return lessons.Adapt<List<LessonDTO>>();
    }
    
    [Authorize(Roles = [nameof(UserRole.Student), nameof(UserRole.Moderator), nameof(UserRole.Admin)])]
    public async Task<List<LessonInfoDTO>> GetScheduleByStudentGroup(int groupId, CancellationToken cancellationToken)
    {
        var lessonGroups = await _lessonService.GetLessonGroupByStudentGroup(groupId, cancellationToken);
        return lessonGroups.Adapt<List<LessonInfoDTO>>();
    }
}