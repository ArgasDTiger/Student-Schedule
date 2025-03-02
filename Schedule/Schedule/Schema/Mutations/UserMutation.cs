using Mapster;
using Schedule.DTOs;
using Schedule.Entities;
using Schedule.Inputs;

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

    public async Task<UserDTO> AddStudent(AddStudentInput user, CancellationToken cancellationToken)
    {
        var mappedStudent = user.Adapt<User>();
        var addedStudent = await _userService.AddStudent(mappedStudent, cancellationToken);
        return addedStudent.Adapt<UserDTO>();
    }
    
    public async Task<bool> UpdateStudent(UpdateStudentInput user, CancellationToken cancellationToken)
    {
        var mappedStudent = user.Adapt<User>();
        return await _userService.UpdateStudent(mappedStudent, cancellationToken);
    }

    public async Task<bool> RemoveStudent(int userId, CancellationToken cancellationToken)
    {
        return await _userService.RemoveStudent(userId, cancellationToken);
    }

    public async Task<bool> AddModeratorToFaculty(int userId, int facultyId, CancellationToken cancellationToken)
    {
        return await _userService.AddModeratorToFaculty(userId, facultyId, cancellationToken);
    }

    public async Task<bool> RemoveModeratorFromFaculty(int userId, int facultyId, CancellationToken cancellationToken)
    {
        return await _userService.RemoveModeratorFromFaculty(userId, facultyId, cancellationToken);
    }
}