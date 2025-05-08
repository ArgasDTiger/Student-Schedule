using Mapster;
using Schedule.Data;
using Schedule.DTOs;

namespace Schedule.Types;

public class GroupType : ObjectType<GroupDTO>
{
    protected override void Configure(IObjectTypeDescriptor<GroupDTO> descriptor)
    {
        descriptor.Field(f => f.Id).Type<NonNullType<IdType>>();
        descriptor.Field(f => f.GroupNumber).Type<NonNullType<IntType>>();
            
        descriptor.Field(f => f.Faculty)
            .ResolveWith<GroupResolvers>(r => r.GetFaculty(default!, default!))
            .Type<NonNullType<FacultyType>>();
    }
        
    private class GroupResolvers
    {
        public async Task<FacultyDTO> GetFaculty(
            [Parent] GroupDTO group,
            [Service] DataLoaderContext dataLoaderContext)
        {
            if (group.Faculty.Id > 0)
            {
                var availableFaculty = await dataLoaderContext.FacultyById.LoadAsync(group.Faculty.Id);
                return availableFaculty.Adapt<FacultyDTO>();
            }
                
            var groupEntity = await dataLoaderContext.GroupById.LoadAsync(group.Id);
            var faculty = await dataLoaderContext.FacultyById.LoadAsync(groupEntity.FacultyId);
            return faculty.Adapt<FacultyDTO>();
        }
    }
}