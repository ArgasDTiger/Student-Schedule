
using Mapster;
using Schedule.DTOs;

namespace Schedule.Schema.Queries;

public partial class Query
{
    public async Task<List<TeacherDTO>> GetTeachers(CancellationToken cancellationToken)
    {
        var teachers = await _teacherService.GetAllTeachers(cancellationToken);
        return teachers.Adapt<List<TeacherDTO>>();
    }
}