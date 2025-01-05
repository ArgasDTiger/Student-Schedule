using Mapster;
using Microsoft.EntityFrameworkCore;
using Schedule.DTOs;
using Schedule.Entities;
using Schedule.Interfaces;

namespace Schedule.Schema.Queries;

public class Query(IRepository repository)
{
    public async Task<List<LessonInfoDTO>> GetScheduleByStudentGroup(int groupId, CancellationToken cancellationToken)
    {
        var lessonGroups = await repository
            .GetAll<LessonGroup>()
            .Where(lg => lg.Group.Id == groupId)
            .ToListAsync(cancellationToken);
        
        return lessonGroups.Adapt<List<LessonInfoDTO>>();
    }
}