using Mapster;
using Schedule.DTOs;
using Schedule.Entities;

namespace Schedule.Schema.Queries;

public partial class Query
{
    public async Task<List<TeacherDTO>> GetTeachers(string? search, CancellationToken cancellationToken)
    {
        var teachers = await _teacherService.GetAllTeachers(search, cancellationToken);
        return teachers.Adapt<List<TeacherDTO>>();
    }

    public async Task<List<TeacherDTO>> GetArchivedTeachers(string? search, CancellationToken cancellationToken)
    {
        var teachers = await _teacherService.GetAllArchivedTeachers(search, cancellationToken);
        return teachers.Adapt<List<TeacherDTO>>();
    }
}