using Schedule.Entities;

namespace Schedule.Interfaces;

public interface IGroupService
{
    Task<List<Group>> GetAllGroups(CancellationToken cancellationToken);
}