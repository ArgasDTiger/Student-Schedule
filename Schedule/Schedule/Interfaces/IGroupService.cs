using Schedule.Entities;

namespace Schedule.Interfaces;

public interface IGroupService
{
    Task<List<Group>> GetAllGroups(int facultyId, string? search, CancellationToken cancellationToken);
    Task<Group> CreateGroup(Group group, CancellationToken cancellationToken);
    Task<bool> UpdateGroup(Group group, CancellationToken cancellationToken);
    Task<bool> DeleteGroup(int groupId, CancellationToken cancellationToken);
}