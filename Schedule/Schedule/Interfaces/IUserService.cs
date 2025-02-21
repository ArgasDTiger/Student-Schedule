using Schedule.DTOs;
using Schedule.Entities;

namespace Schedule.Interfaces;

public interface IUserService
{
    Task<UserDTO> Login(string idToken, CancellationToken cancellationToken);
    Task<UserDTO> GetCurrentUser(CancellationToken cancellationToken);
    Task<List<User>> GetStudents(string? search, CancellationToken cancellationToken);
    Task<List<User>> GetStudentsByGroup(string? search, int groupId, CancellationToken cancellationToken);
    Task<List<User>> GetStudentsOutsideGroup(string? search, int groupId, CancellationToken cancellationToken);
    Task<bool> PromoteUserToModerator(int userId, CancellationToken cancellationToken);
    Task<bool> DemoteUserFromModerator(int userId, CancellationToken cancellationToken);
    Task<bool> AddUserToGroup(int userId, int groupId, CancellationToken cancellationToken);
    Task<bool> RemoveUserFromGroup(int userId, int groupId, CancellationToken cancellationToken);
}