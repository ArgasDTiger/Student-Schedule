using Microsoft.EntityFrameworkCore;
using Schedule.DTOs;
using Schedule.Entities;
using Schedule.Interfaces;

namespace Schedule.Schema.Queries;

public class Query(IRepository repository)
{
    public async Task<List<LessonInfoDTO>> GetScheduleByStudentGroup(int groupId, CancellationToken cancellationToken)
    {
        var lessonGroups = await repository
            .GetAll<LessonGroup>()
            .Where(lg => lg.Group.Id == groupId)
            .ToListAsync(cancellationToken);
        
        var lessons = lessonGroups.Select(lg => new LessonInfoDTO
        {
            LessonId = lg.Lesson.Id,
            GroupId = lg.Group.Id,
            TeacherId = lg.Teacher.Id,
            WeekDay = lg.WeekDay,
            LessonNumber = lg.LessonNumber,
            Type = lg.Type,
            Room = lg.Room,
            OddWeek = lg.OddWeek,
            EvenWeek = lg.EvenWeek
        }).ToList();
        
        return lessons;
    }
}