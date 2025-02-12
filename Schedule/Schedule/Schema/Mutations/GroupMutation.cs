using Mapster;
using Schedule.DTOs;

namespace Schedule.Schema.Mutations;

public partial class Mutation
{
    public async Task<List<GroupDTO>> GetGroups(CancellationToken cancellationToken)
    {
        var groups = await _groupService.GetAllGroups(cancellationToken);
        return groups.Adapt<List<GroupDTO>>();
    }
}