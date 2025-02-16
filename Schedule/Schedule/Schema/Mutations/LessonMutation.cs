using Mapster;
using Schedule.DTOs;
using Schedule.Requests;

namespace Schedule.Schema.Mutations;

public partial class Mutation
{
    public async Task<LessonInfoDTO> CreateLessonInfo(AddLessonInfoInput lessonInfo, CancellationToken cancellationToken)
    {
        var lesson = await _lessonService.AddLessonGroup(lessonInfo, cancellationToken);
        var toReturn = lesson.Adapt<LessonInfoDTO>();

        return toReturn;
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