using Schedule.Entities;

namespace Schedule.Interfaces;

public interface IFacultyService
{
    Task<Faculty> GetAllFaculties(CancellationToken cancellationToken);
    
}