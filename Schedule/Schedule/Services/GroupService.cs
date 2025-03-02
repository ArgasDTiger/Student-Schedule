using Microsoft.EntityFrameworkCore;
using Schedule.Entities;
using Schedule.Exceptions;
using Schedule.Interfaces;

namespace Schedule.Services;

public class GroupService : IGroupService
{
    private readonly IRepository _repository;

    public GroupService(IRepository repository)
    {
        _repository = repository;
    }
    public async Task<List<Group>> GetAllGroups(int facultyId, string? search, CancellationToken cancellationToken)
    {
        return await _repository
            .GetAll<Group>()
            .Where(g =>
                g.FacultyId == facultyId 
                && EF.Functions.Like(g.GroupNumber.ToString(), $"%{search}%"))
            .ToListAsync(cancellationToken);
    }

    public async Task<Group> CreateGroup(Group group, CancellationToken cancellationToken)
    {
        var addedGroup = _repository.Add(group);
        await _repository.SaveChangesAsync(cancellationToken);
        return addedGroup;
    }

    public async Task<bool> UpdateGroup(Group group, CancellationToken cancellationToken)
    {
        var existingGroup = await _repository.GetAllAsNoTracking<Group>().Where(g => g.Id == group.Id)
            .SingleOrDefaultAsync(cancellationToken);
        if (existingGroup is null)
            throw new DetailedException("Group is not found.");

        _repository.Update(group);
         return await _repository.SaveChangesAsync(cancellationToken);
    }
    
    public async Task<bool> DeleteGroup(int groupId, CancellationToken cancellationToken)
    {
        var existingGroup = await _repository.GetAll<Group>().Where(g => g.Id == groupId)
            .SingleOrDefaultAsync(cancellationToken);
        if (existingGroup is null)
            throw new DetailedException("Group is not found.");
        
        _repository.Remove(existingGroup);
        return await _repository.SaveChangesAsync(cancellationToken);
    }
}