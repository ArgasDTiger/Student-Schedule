using Microsoft.EntityFrameworkCore;
using Schedule.Entities;
using Schedule.Exceptions;
using Schedule.Interfaces;
using Schedule.Requests;

namespace Schedule.Services;

public class LessonService : ILessonService
{
    private readonly IRepository _repository;

    public LessonService(IRepository repository)
    {
        _repository = repository;
    }

    public async Task<List<Lesson>> GetAllLessons(CancellationToken cancellationToken)
    {
        return await _repository.GetAll<Lesson>().OrderBy(l => l.Name).ToListAsync(cancellationToken);
    }

    public async Task<LessonGroup> AddLessonGroup(AddLessonInfoInput input, CancellationToken cancellationToken)
    {
        var newLessonGroup = new LessonGroup
        {
            LessonId = input.LessonId,
            GroupId = input.GroupId,
            TeacherId = input.TeacherId,
            WeekDay = input.WeekDay,
            LessonNumber = input.LessonNumber,
            Type = input.Type,
            Room = input.Room,
            OddWeek = input.OddWeek,
            EvenWeek = input.EvenWeek
        };

        var lessonGroup = _repository.Add(newLessonGroup);
        await _repository.SaveChangesAsync(cancellationToken);

        return lessonGroup;
    }

    public async Task<bool> UpdateLessonGroup(UpdateLessonInfoRequest request, CancellationToken cancellationToken)
    {
        var lessonGroup = await _repository.GetAll<LessonGroup>().SingleOrDefaultAsync(lg => lg.Id == request.Id, cancellationToken);

        if (lessonGroup is null)
            throw new DetailedException("LessonInfo is not found.");
        
        lessonGroup.LessonId = request.LessonId;
        lessonGroup.GroupId = request.GroupId;
        lessonGroup.TeacherId = request.TeacherId;
        lessonGroup.WeekDay = request.WeekDay;
        lessonGroup.LessonNumber = request.LessonNumber;
        lessonGroup.Type = request.Type;
        lessonGroup.Room = request.Room;
        lessonGroup.OddWeek = request.OddWeek;
        lessonGroup.EvenWeek = request.EvenWeek;

        _repository.Update(lessonGroup);
        await _repository.SaveChangesAsync(cancellationToken);
        
        return true;
    }

    public async Task<bool> DeleteLessonGroup(int id, CancellationToken cancellationToken)
    {
        var lessonGroup = await _repository.GetAll<LessonGroup>().SingleOrDefaultAsync(lg => lg.Id == id, cancellationToken);

        if (lessonGroup is null)
            throw new DetailedException("LessonInfo is not found.");
        
        _repository.Remove(lessonGroup);
        await _repository.SaveChangesAsync(cancellationToken);

        return true;
    }

    public async Task<List<LessonGroup>> GetLessonGroupByStudentGroup(int groupId, CancellationToken cancellationToken)
    {
        var lessonGroups = await _repository
            .GetAll<LessonGroup>()
            .Where(lg => lg.Group.Id == groupId)
            .ToListAsync(cancellationToken);

        return lessonGroups;
    }
}