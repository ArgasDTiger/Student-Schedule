using Mapster;
using Schedule.DTOs;
using Schedule.Entities;

namespace Schedule.Helpers;

public class MappingConfigurations : IRegister
{
    public void Register(TypeAdapterConfig config)
    {
        config.NewConfig<LessonGroup, LessonInfoDTO>()
            .Map(dest => dest.Group, src => src.Group.Adapt<GroupDTO>())
            .Map(dest => dest.Teacher, src => src.Teacher.Adapt<TeacherDTO>())
            .Map(dest => dest.Lesson, src => src.Lesson.Adapt<LessonDTO>());

        config.NewConfig<Group, GroupDTO>()
            .Map(dest => dest.Faculty, src => src.Faculty.Adapt<FacultyDTO>());
    }  
}