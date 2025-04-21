using Mapster;
using Schedule.DTOs;
using Schedule.Entities;
using Schedule.Inputs;

namespace Schedule.Schema.Queries;

public partial class Query
{
    public async Task<List<TeacherDTO>> GetTeachers(GetTeacherInput teacherInput,  CancellationToken cancellationToken)
    {
        var teachers = await _teacherService.GetAllTeachers(teacherInput.Search, teacherInput.WeekDay, teacherInput.LessonNumber, teacherInput.LessonInfoId, cancellationToken);
        return teachers.Adapt<List<TeacherDTO>>();
    }

    public async Task<List<TeacherDTO>> GetArchivedTeachers(string? search, CancellationToken cancellationToken)
    {
        var teachers = await _teacherService.GetAllArchivedTeachers(search, cancellationToken);
        return teachers.Adapt<List<TeacherDTO>>();
    }
}