using HotChocolate.Authorization;
using Mapster;
using Microsoft.EntityFrameworkCore;
using Schedule.DTOs;
using Schedule.Entities;

namespace Schedule.Schema.Queries;

public partial class Query
{
    public async Task<List<LessonDTO>> GetLessons(CancellationToken cancellationToken)
    {
        var lessons = await _lessonService.GetAllLessons(cancellationToken);
        return lessons.Adapt<List<LessonDTO>>();
    }
    
    [Authorize(Roles = [nameof(UserRole.Student), nameof(UserRole.Moderator)])]
    public async Task<List<LessonInfoDTO>> GetScheduleByStudentGroup(int groupId, CancellationToken cancellationToken)
    {
        var lessonGroups = await _lessonService.GetLessonGroupByStudentGroup(groupId, cancellationToken);
        return lessonGroups.Adapt<List<LessonInfoDTO>>();
    }
}