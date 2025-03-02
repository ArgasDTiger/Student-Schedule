using Mapster;
using Schedule.DTOs;
using Schedule.Entities;
using Schedule.Inputs;
using Schedule.Schema.Subscriptions;

namespace Schedule.Schema.Mutations;

public partial class Mutation
{
    public async Task<LessonInfoDTO> CreateLessonInfo(AddLessonInfoInput lessonInfo, CancellationToken cancellationToken)
    {
        var lesson = await _lessonService.AddLessonGroup(lessonInfo, cancellationToken);
        var toReturn = lesson.Adapt<LessonInfoDTO>();

        string updateCourseTopic = $"{lesson.GroupId}_{nameof(Subscription.LessonInfoCreated)}";
        await _eventSender.SendAsync(updateCourseTopic, toReturn, cancellationToken);

        return toReturn;
    }
    
    public async Task<bool> UpdateLessonInfo(UpdateLessonInfoInput lessonInfo, CancellationToken cancellationToken)
    {
        return await _lessonService.UpdateLessonGroup(lessonInfo, cancellationToken);
    }
    
    public async Task<bool> DeleteLessonInfo(int id, CancellationToken cancellationToken)
    {
        return await _lessonService.DeleteLessonGroup(id, cancellationToken);
    }

    public async Task<LessonDTO> CreateLesson(string name, CancellationToken cancellationToken)
    {
        var createdLesson = await _lessonService.CreateLesson(name, cancellationToken);
        return createdLesson.Adapt<LessonDTO>();
    }

    public async Task<bool> UpdateLesson(UpdateLessonInput lesson, CancellationToken cancellationToken)
    {
        var mappedLesson = lesson.Adapt<Lesson>();
        return await _lessonService.UpdateLesson(mappedLesson, cancellationToken);
    }

    public async Task<bool> ArchiveLesson(int lessonId, CancellationToken cancellationToken)
    {
        return await _lessonService.ArchiveLesson(lessonId, cancellationToken);
    }

    public async Task<bool> PublishLesson(int lessonId, CancellationToken cancellationToken)
    {
        return await _lessonService.PublishLesson(lessonId, cancellationToken);
    }

    public async Task<bool> DeleteLesson(int lessonId, CancellationToken cancellationToken)
    {
        return await _lessonService.DeleteLesson(lessonId, cancellationToken);
    }    
}