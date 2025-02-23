using Microsoft.EntityFrameworkCore;
using Schedule.Entities;
using Schedule.Exceptions;
using Schedule.Interfaces;
using Schedule.Requests;

namespace Schedule.Services;

public class TeacherService : ITeacherService
{
    private readonly IRepository _repository;

    public TeacherService(IRepository repository)
    {
        _repository = repository;
    }
    
    public Task<List<Teacher>> GetAllTeachers(string? search, CancellationToken cancellationToken)
    {
        return _repository
            .GetAll<Teacher>()
            .Where(t => !t.IsArchived 
                        && (search == null 
                            || EF.Functions.Like(t.FirstName, $"%{search}%")
                            || EF.Functions.Like(t.LastName, $"%{search}%")
                            || EF.Functions.Like(t.MiddleName, $"%{search}%")
                            || EF.Functions.Like(t.LastName + " " + t.FirstName, $"%{search}%")
                            || EF.Functions.Like(t.LastName + " " + t.FirstName + " " + t.MiddleName, $"%{search}%")))
            .OrderBy(t => t.LastName)
            .ToListAsync(cancellationToken);
    }

    public Task<List<Teacher>> GetAllArchivedTeachers(string? search, CancellationToken cancellationToken)
    {
        return _repository
            .GetAll<Teacher>()
            .Where(t => t.IsArchived 
                        && (search == null 
                            || EF.Functions.Like(t.FirstName, $"%{search}%")
                            || EF.Functions.Like(t.LastName, $"%{search}%")
                            || EF.Functions.Like(t.MiddleName, $"%{search}%")
                            || EF.Functions.Like(t.LastName + " " + t.FirstName, $"%{search}%")
                            || EF.Functions.Like(t.LastName + " " + t.FirstName + " " + t.MiddleName, $"%{search}%")))
            .OrderBy(t => t.LastName)
            .ToListAsync(cancellationToken);
    }

    public async Task<Teacher> CreateTeacher(Teacher teacher, CancellationToken cancellationToken)
    {
        teacher.IsArchived = false;
        var newTeacher = _repository.Add(teacher);
        await _repository.SaveChangesAsync(cancellationToken);
        return newTeacher;
    }

    public async Task<bool> UpdateTeacher(Teacher teacher, CancellationToken cancellationToken)
    {
        var existingTeacher = await _repository.GetAllAsNoTracking<Teacher>().Where(t => t.Id == teacher.Id).SingleOrDefaultAsync(cancellationToken);
        if (existingTeacher is null)
            throw new DetailedException("Teacher is not found.");

        teacher.IsArchived = existingTeacher.IsArchived;
        _repository.Update(teacher);
        return await _repository.SaveChangesAsync(cancellationToken);
    }

    public async Task<bool> ArchiveTeacher(int teacherId, CancellationToken cancellationToken)
    {
        var existingTeacher = await _repository.GetAll<Teacher>().Where(t => t.Id == teacherId).SingleOrDefaultAsync(cancellationToken);
        if (existingTeacher is null)
            throw new DetailedException("Teacher is not found.");
        
        if (existingTeacher.IsArchived)
            throw new DetailedException("Teacher is already archived.");

        existingTeacher.IsArchived = true;
        return await _repository.SaveChangesAsync(cancellationToken);
    }

    public async Task<bool> PublishTeacher(int teacherId, CancellationToken cancellationToken)
    {
        var existingTeacher = await _repository.GetAll<Teacher>().Where(t => t.Id == teacherId).SingleOrDefaultAsync(cancellationToken);
        if (existingTeacher is null)
            throw new DetailedException("Teacher is not found.");
        
        if (!existingTeacher.IsArchived)
            throw new DetailedException("Teacher is already published.");

        existingTeacher.IsArchived = false;
        return await _repository.SaveChangesAsync(cancellationToken);
    }

    public async Task<bool> DeleteTeacher(int teacherId, CancellationToken cancellationToken)
    {
        var existingTeacher = await _repository.GetAll<Teacher>().Where(t => t.Id == teacherId).SingleOrDefaultAsync(cancellationToken);
        if (existingTeacher is null)
            throw new DetailedException("Teacher is not found.");
        
        _repository.Remove(existingTeacher);
        return await _repository.SaveChangesAsync(cancellationToken);   
    }
}