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

    public async Task<List<Teacher>> GetAllTeachers(CancellationToken cancellationToken)
    {
        return await _repository.GetAll<Teacher>().OrderBy(t => t.LastName).ToListAsync(cancellationToken);
    }
}