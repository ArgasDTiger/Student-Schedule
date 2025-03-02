using Mapster;
using Schedule.DTOs;
using Schedule.Entities;
using Schedule.Inputs;

namespace Schedule.Schema.Mutations;

public partial class Mutation
{
    public async Task<TeacherDTO> CreateTeacher(AddTeacherInput teacher, CancellationToken cancellationToken)
    {
        var mappedTeacher = teacher.Adapt<Teacher>();
        var createdTeacher = await _teacherService.CreateTeacher(mappedTeacher, cancellationToken);
        return createdTeacher.Adapt<TeacherDTO>();
    }

    public async Task<bool> UpdateTeacher(UpdateTeacherInput teacher, CancellationToken cancellationToken)
    {
        var mappedTeacher = teacher.Adapt<Teacher>();
        return await _teacherService.UpdateTeacher(mappedTeacher, cancellationToken);
    }

    public async Task<bool> ArchiveTeacher(int teacherId, CancellationToken cancellationToken)
    {
        return await _teacherService.ArchiveTeacher(teacherId, cancellationToken);
    }

    public async Task<bool> PublishTeacher(int teacherId, CancellationToken cancellationToken)
    {
        return await _teacherService.PublishTeacher(teacherId, cancellationToken);
    }

    public async Task<bool> DeleteTeacher(int teacherId, CancellationToken cancellationToken)
    {
        return await _teacherService.DeleteTeacher(teacherId, cancellationToken);
    }    
}
