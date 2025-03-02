using Mapster;
using Schedule.DTOs;

namespace Schedule.Schema.Queries;

public partial class Query
{
    public async Task<List<GroupDTO>> GetGroups(int facultyId, string? search, CancellationToken cancellationToken)
    {
        var groups = await _groupService.GetAllGroups(facultyId, search, cancellationToken);
        return groups.Adapt<List<GroupDTO>>();
    }
}