using Schedule.DTOs;

namespace Schedule.Types;

public class LessonType : ObjectType<LessonDTO>
{
    protected override void Configure(IObjectTypeDescriptor<LessonDTO> descriptor)
    {
        descriptor.Field(f => f.Id).Type<NonNullType<IdType>>();
        descriptor.Field(f => f.Name).Type<NonNullType<StringType>>();
    }
}