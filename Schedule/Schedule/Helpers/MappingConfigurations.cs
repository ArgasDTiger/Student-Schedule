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
            .PreserveReference(true)
            .Map(dest => dest.Faculty, src => src.Faculty.Adapt<FacultyDTO>());

        config.NewConfig<Faculty, FacultyDTO>()
            .PreserveReference(true)
            .Map(dest => dest.Groups, src => src.Groups.Adapt<GroupDTO[]>());

        config.NewConfig<User, UserDTO>()
            .Map(dest => dest.Groups, src => src.Groups.Adapt<List<GroupDTO>>())
            .Map(dest => dest.Faculties, src => src.Faculties.Adapt<List<FacultyDTO>>());
        
        /*config.NewConfig<User, object>()
            .MapWith(src => 
                src.Role == UserRole.Admin ? src.Adapt<AdminDTO>() :
                src.Role == UserRole.Moderator ? src.Adapt<ModeratorDTO>() :
                src.Role == UserRole.Student ? src.Adapt<StudentDTO>() :
                src.Adapt<UserDTO>());

        config.NewConfig<User, StudentDTO>()
            .Map(dest => dest.Groups, src => src.Groups.Adapt<List<GroupDTO>>());
        config.NewConfig<User, ModeratorDTO>()
            .Map(dest => dest.Faculties, src => src.Faculties.Adapt<List<FacultyDTO>>());
        config.NewConfig<User, AdminDTO>();*/
    }  
}