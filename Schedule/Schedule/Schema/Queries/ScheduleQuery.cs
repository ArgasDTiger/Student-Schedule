using HotChocolate.Authorization;
using Mapster;
using Microsoft.EntityFrameworkCore;
using Schedule.DTOs;
using Schedule.Entities;

namespace Schedule.Schema.Queries;

public partial class Query
{
    // [Authorize(Roles = [nameof(UserRole.Student)])
    public async Task<List<LessonInfoDTO>> GetScheduleByStudentGroup(int groupId, CancellationToken cancellationToken)
    {
        var lessonGroups = await _repository
            .GetAll<LessonGroup>()
            .Where(lg => lg.Group.Id == groupId)
            .ToListAsync(cancellationToken);
        
        return lessonGroups.Adapt<List<LessonInfoDTO>>();
    }
}