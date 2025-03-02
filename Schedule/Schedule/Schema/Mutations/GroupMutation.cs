using Mapster;
using Schedule.DTOs;
using Schedule.Entities;
using Schedule.Inputs;

namespace Schedule.Schema.Mutations;

public partial class Mutation
{
    public async Task<GroupDTO> CreateGroup(AddGroupInput group, CancellationToken cancellationToken)
    {
        var mappedGroup = group.Adapt<Group>();
        var addedGroup = await _groupService.CreateGroup(mappedGroup, cancellationToken);
        var res= addedGroup.Adapt<GroupDTO>();
        return res;
    }

    public async Task<bool> UpdateGroup(UpdateGroupInput group, CancellationToken cancellationToken)
    {
        var mappedGroup = group.Adapt<Group>();
        return await _groupService.UpdateGroup(mappedGroup, cancellationToken);
    }

    public async Task<bool> DeleteGroup(int groupId, CancellationToken cancellationToken)
    {
        return await _groupService.DeleteGroup(groupId, cancellationToken);
    }
}