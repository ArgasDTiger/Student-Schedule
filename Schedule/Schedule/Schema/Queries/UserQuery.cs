using HotChocolate.Authorization;
using Mapster;
using Schedule.DTOs;

namespace Schedule.Schema.Queries;

public partial class Query
{
    [Authorize]
    public async Task<UserDTO> GetCurrentUser(CancellationToken cancellationToken)
    {
        return await _userService.GetCurrentUser(cancellationToken);
    }

    public async Task<List<UserDTO>> GetStudents(string? search, CancellationToken cancellationToken)
    {
        var students = await _userService.GetStudents(search, cancellationToken);
        return students.Adapt<List<UserDTO>>();
    }

    public async Task<List<UserDTO>> GetStudentsByGroup(string? search, int groupId, CancellationToken cancellationToken)
    {
        var students = await _userService.GetStudentsByGroup(search, groupId, cancellationToken);
        return students.Adapt<List<UserDTO>>();
    }

    public async Task<List<UserDTO>> GetStudentsOutsideGroup(string? search, int groupId, CancellationToken cancellationToken)
    {
        var students = await _userService.GetStudentsOutsideGroup(search, groupId, cancellationToken);
        return students.Adapt<List<UserDTO>>();
    }
}