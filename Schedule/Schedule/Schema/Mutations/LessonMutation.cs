using Mapster;
using Schedule.DTOs;
using Schedule.Requests;

namespace Schedule.Schema.Mutations;

public partial class Mutation
{
    public async Task<LessonInfoDTO> CreateLessonInfo(AddLessonInfoRequest request, CancellationToken cancellationToken)
    {
        var lesson = await _lessonService.AddLessonGroup(request, cancellationToken);
        return lesson.Adapt<LessonInfoDTO>();
    }
    
    public async Task<bool> UpdateLessonInfo(UpdateLessonInfoRequest request, CancellationToken cancellationToken)
    {
        return await _lessonService.UpdateLessonGroup(request, cancellationToken);
    }
    
    public async Task<bool> DeleteLessonInfo(int id, CancellationToken cancellationToken)
    {
        return await _lessonService.DeleteLessonGroup(id, cancellationToken);
    }
}