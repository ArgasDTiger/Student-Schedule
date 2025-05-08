using Schedule.DTOs;
using Schedule.Entities;

namespace Schedule.Types;

public class TeacherType : ObjectType<TeacherDTO>
{
    protected override void Configure(IObjectTypeDescriptor<TeacherDTO> descriptor)
    {
        descriptor.Field(f => f.Id).Type<NonNullType<IdType>>();
        descriptor.Field(f => f.FirstName).Type<NonNullType<StringType>>();
        descriptor.Field(f => f.MiddleName).Type<NonNullType<StringType>>();
        descriptor.Field(f => f.LastName).Type<NonNullType<StringType>>();
        descriptor.Field(f => f.Degree).Type<NonNullType<EnumType<Degree>>>();
    }
}