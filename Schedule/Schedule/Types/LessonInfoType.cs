using Mapster;
using Schedule.Data;
using Schedule.DTOs;
using Schedule.Entities;

namespace Schedule.Types;

public class LessonInfoType : ObjectType<LessonInfoDTO>
{
    protected override void Configure(IObjectTypeDescriptor<LessonInfoDTO> descriptor)
    {
        descriptor.Field(f => f.Id).Type<NonNullType<IdType>>();
        
        descriptor.Field(f => f.Lesson)
            .ResolveWith<LessonInfoResolvers>(r => r.GetLesson(default!, default!))
            .Type<NonNullType<LessonType>>();
            
        descriptor.Field(f => f.Group)
            .ResolveWith<LessonInfoResolvers>(r => r.GetGroup(default!, default!))
            .Type<NonNullType<GroupType>>();
            
        descriptor.Field(f => f.Teacher)
            .ResolveWith<LessonInfoResolvers>(r => r.GetTeacher(default!, default!))
            .Type<NonNullType<TeacherType>>();
            
        descriptor.Field(f => f.WeekDay).Type<NonNullType<EnumType<DayOfWeek>>>();
        descriptor.Field(f => f.LessonNumber).Type<NonNullType<EnumType<LessonNumber>>>();
        descriptor.Field(f => f.Type).Type<NonNullType<EnumType<LessonType>>>();
        descriptor.Field(f => f.Room).Type<NonNullType<IntType>>();
        descriptor.Field(f => f.OddWeek).Type<NonNullType<BooleanType>>();
        descriptor.Field(f => f.EvenWeek).Type<NonNullType<BooleanType>>();
    }
    
    private class LessonInfoResolvers
    {
        public async Task<LessonDTO> GetLesson(
            [Parent] LessonInfoDTO lessonInfo,
            [Service] DataLoaderContext dataLoaderContext)
        {
            var lessonGroup = await dataLoaderContext.LessonGroupById.LoadAsync(lessonInfo.Id);
            var lesson = await dataLoaderContext.LessonById.LoadAsync(lessonGroup.LessonId);
            return lesson.Adapt<LessonDTO>();
        }
        
        public async Task<GroupDTO> GetGroup(
            [Parent] LessonInfoDTO lessonInfo,
            [Service] DataLoaderContext dataLoaderContext)
        {
            var lessonGroup = await dataLoaderContext.LessonGroupById.LoadAsync(lessonInfo.Id);
            var group = await dataLoaderContext.GroupById.LoadAsync(lessonGroup.GroupId);
            return group.Adapt<GroupDTO>();
        }
        
        public async Task<TeacherDTO> GetTeacher(
            [Parent] LessonInfoDTO lessonInfo,
            [Service] DataLoaderContext dataLoaderContext)
        {
            var lessonGroup = await dataLoaderContext.LessonGroupById.LoadAsync(lessonInfo.Id);
            var teacher = await dataLoaderContext.TeacherById.LoadAsync(lessonGroup.TeacherId);
            return teacher.Adapt<TeacherDTO>();
        }
    }
}