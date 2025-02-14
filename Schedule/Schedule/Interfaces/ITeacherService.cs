using Schedule.Entities;

namespace Schedule.Interfaces;

public interface ITeacherService
{
    Task<List<Teacher>> GetAllTeachers(CancellationToken cancellationToken);
}