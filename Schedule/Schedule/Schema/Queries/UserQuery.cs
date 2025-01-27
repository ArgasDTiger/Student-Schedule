using HotChocolate.Authorization;
using Schedule.DTOs;

namespace Schedule.Schema.Queries;

public partial class Query
{
    [Authorize]
    public async Task<UserDTO> GetCurrentUser(CancellationToken cancellationToken)
    {
        return await _userService.GetCurrentUser(cancellationToken);
    }
}