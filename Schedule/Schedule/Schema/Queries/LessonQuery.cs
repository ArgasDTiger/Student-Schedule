using Mapster;
using Schedule.DTOs;

namespace Schedule.Schema.Queries;

public partial class Query
{
    public async Task<List<LessonDTO>> GetLessons(CancellationToken cancellationToken)
    {
        var lessons = await _lessonService.GetAllLessons(cancellationToken);
        return lessons.Adapt<List<LessonDTO>>();
    }
}