using Mapster;
using Schedule.DataLoaders;
using Schedule.Entities;

namespace Schedule.DTOs;

public class LessonInfoDTO
{
    [GraphQLIgnore]
    public int LessonId { get; set; }
    public async Task<LessonDTO> Lesson([Service] DataLoaderWithIntId<Lesson> dataLoader)
    {
        var lesson = await dataLoader.LoadAsync(LessonId, CancellationToken.None);
        return lesson.Adapt<LessonDTO>();
    }
    [GraphQLIgnore]
    public int GroupId { get; set; }
    public async Task<GroupDTO> Group([Service] DataLoaderWithIntId<Group> dataLoader)
    {
        var group = await dataLoader.LoadAsync(GroupId, CancellationToken.None);
        return group.Adapt<GroupDTO>();
    }
    [GraphQLIgnore]
    public int TeacherId { get; set; }
    public async Task<TeacherDTO> Teacher([Service] DataLoaderWithIntId<Teacher> dataLoader)
    {
        var teacher = await dataLoader.LoadAsync(TeacherId, CancellationToken.None);
        return teacher.Adapt<TeacherDTO>();
    }
    public DayOfWeek WeekDay { get; set; }
    public LessonNumber LessonNumber { get; set; }
    public LessonType Type { get; set; }
    public int Room { get; set; }
    public bool OddWeek { get; set; }
    public bool EvenWeek { get; set; }
}