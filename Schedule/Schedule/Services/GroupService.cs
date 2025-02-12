using Microsoft.EntityFrameworkCore;
using Schedule.Entities;
using Schedule.Interfaces;

namespace Schedule.Services;

public class GroupService : IGroupService
{
    private readonly IRepository _repository;

    public GroupService(IRepository repository)
    {
        _repository = repository;
    }
    public async Task<List<Group>> GetAllGroups(CancellationToken cancellationToken)
    {
        return await _repository.GetAll<Group>().ToListAsync(cancellationToken);
    }
}