using Mapster;
using Microsoft.EntityFrameworkCore;
using Schedule.DTOs;
using Schedule.Entities;
using Schedule.Interfaces;

namespace Schedule.Types;

public class FacultyType : ObjectType<FacultyDTO>
{
    protected override void Configure(IObjectTypeDescriptor<FacultyDTO> descriptor)
    {
        descriptor.Field(f => f.Id).Type<NonNullType<IdType>>();
        descriptor.Field(f => f.Name).Type<NonNullType<StringType>>();
        descriptor.Field(f => f.CorpusNumber).Type<NonNullType<IntType>>();
            
        descriptor.Field(f => f.Groups)
            .ResolveWith<FacultyResolvers>(r => r.GetGroups(default!, default!))
            .Type<NonNullType<ListType<NonNullType<GroupType>>>>();
    }
        
    private class FacultyResolvers
    {
        public async Task<List<GroupDTO>> GetGroups(
            [Parent] FacultyDTO faculty,
            [Service] IRepository repository)
        {
            var groups = await repository.GetAll<Group>()
                .Where(g => g.FacultyId == faculty.Id)
                .ToListAsync();
                    
            return groups.Adapt<List<GroupDTO>>();
        }
    }
}