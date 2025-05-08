using Microsoft.EntityFrameworkCore;
using Schedule.Entities;
using Schedule.Exceptions;
using Schedule.Inputs;
using Schedule.Interfaces;

namespace Schedule.Services;

public class LessonService : ILessonService
{
    private readonly IRepository _repository;

    public LessonService(IRepository repository)
    {
        _repository = repository;
    }

    public Task<List<Lesson>> GetAllLessons(string? search, CancellationToken cancellationToken)
    {
        return _repository
            .GetAll<Lesson>()
            .Where(l => !l.IsArchived 
                        && (search == null || EF.Functions.Like(l.Name, $"%{search}%")))
            .OrderBy(l => l.Name)
            .ToListAsync(cancellationToken);
    }

    public Task<List<Lesson>> GetAllArchivedLessons(string? search, CancellationToken cancellationToken)
    {
        return _repository
            .GetAll<Lesson>()
            .Where(l => l.IsArchived 
                        && (search == null || EF.Functions.Like(l.Name, $"%{search}%")))
            .OrderBy(l => l.Name)
            .ToListAsync(cancellationToken);
    }

    public async Task<Lesson> CreateLesson(string name, CancellationToken cancellationToken)
    {
        var lesson = new Lesson
        {
            Name = name,
            IsArchived = false
        };

        var addedLesson = _repository.Add(lesson);
        await _repository.SaveChangesAsync(cancellationToken);
        return addedLesson;
    }

    public async Task<bool> UpdateLesson(Lesson lesson, CancellationToken cancellationToken)
    {
        var existingLesson = await _repository.GetAllAsNoTracking<Lesson>().Where(l => l.Id == lesson.Id).SingleOrDefaultAsync(cancellationToken);
        if (existingLesson is null)
            throw new DetailedException("Lesson is not found.");

        lesson.IsArchived = existingLesson.IsArchived;
        _repository.Update(lesson);
        return await _repository.SaveChangesAsync(cancellationToken);
    }

    public async Task<bool> ArchiveLesson(int lessonId, CancellationToken cancellationToken)
    {
        var existingLesson = await _repository.GetAll<Lesson>().Where(l => l.Id == lessonId).SingleOrDefaultAsync(cancellationToken);
        if (existingLesson is null)
            throw new DetailedException("Lesson is not found.");
        
        if (existingLesson.IsArchived)
            throw new DetailedException("Lesson is already archived.");

        existingLesson.IsArchived = true;
        existingLesson.LessonGroups.Clear();
        return await _repository.SaveChangesAsync(cancellationToken);
    }

    public async Task<bool> PublishLesson(int lessonId, CancellationToken cancellationToken)
    {
        var existingLesson = await _repository.GetAll<Lesson>().Where(l => l.Id == lessonId).SingleOrDefaultAsync(cancellationToken);
        if (existingLesson is null)
            throw new DetailedException("Lesson is not found.");
        
        if (!existingLesson.IsArchived)
            throw new DetailedException("Lesson is already published.");

        existingLesson.IsArchived = false;
        return await _repository.SaveChangesAsync(cancellationToken);
    }

    public async Task<bool> DeleteLesson(int lessonId, CancellationToken cancellationToken)
    {
        var existingLesson = await _repository.GetAll<Lesson>().Where(l => l.Id == lessonId).SingleOrDefaultAsync(cancellationToken);
        if (existingLesson is null)
            throw new DetailedException("Lesson is not found.");
        
        _repository.Remove(existingLesson);
        return await _repository.SaveChangesAsync(cancellationToken);
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

        var lessonGroupFromDb = _repository.Add(newLessonGroup);
        await _repository.SaveChangesAsync(cancellationToken);

        var lessonGroup = await _repository
            .GetAll<LessonGroup>()
            .Include(lg => lg.Lesson)
            .Include(lg => lg.Group).ThenInclude(g => g.Faculty)
            .Include(lg => lg.Teacher)
            .SingleOrDefaultAsync(lg => lg.Id == lessonGroupFromDb.Id, cancellationToken);

        if (lessonGroup is null)
            throw new DetailedException("Couldn't load added lesson information.");
        
        return lessonGroup;
    }

    public async Task<bool> UpdateLessonGroup(UpdateLessonInfoInput input, CancellationToken cancellationToken)
    {
        var lessonGroup = await _repository.GetAll<LessonGroup>().SingleOrDefaultAsync(lg => lg.Id == input.Id, cancellationToken);

        if (lessonGroup is null)
            throw new DetailedException("LessonInfo is not found.");
        
        lessonGroup.LessonId = input.LessonId;
        lessonGroup.GroupId = input.GroupId;
        lessonGroup.TeacherId = input.TeacherId;
        lessonGroup.WeekDay = input.WeekDay;
        lessonGroup.LessonNumber = input.LessonNumber;
        lessonGroup.Type = input.Type;
        lessonGroup.Room = input.Room;
        lessonGroup.OddWeek = input.OddWeek;
        lessonGroup.EvenWeek = input.EvenWeek;

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