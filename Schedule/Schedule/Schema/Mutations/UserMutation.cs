namespace Schedule.Schema.Mutations;

public partial class Mutation
{
    public async Task<bool> PromoteUserToModerator(int userId, CancellationToken cancellationToken)
    {
        return await _userService.PromoteUserToModerator(userId, cancellationToken);
    }

    public async Task<bool> DemoteUserFromModerator(int userId, CancellationToken cancellationToken)
    {
        return await _userService.DemoteUserFromModerator(userId, cancellationToken);
    }

    public async Task<bool> AddUserToGroup(int userId, int groupId, CancellationToken cancellationToken)
    {
        return await _userService.AddUserToGroup(userId, groupId, cancellationToken);
    }

    public async Task<bool> RemoveUserFromGroup(int userId, int groupId, CancellationToken cancellationToken)
    {
        return await _userService.RemoveUserFromGroup(userId, groupId, cancellationToken);
    }
}