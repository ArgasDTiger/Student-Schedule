using Schedule.Entities;

namespace Schedule.DTOs;

public class LessonInfoDTO
{
    public int Id { get; set; }
    public LessonDTO Lesson { get; set; }
    public GroupDTO Group { get; set; }
    public TeacherDTO Teacher { get; set; }
    public DayOfWeek WeekDay { get; set; }
    public LessonNumber LessonNumber { get; set; }
    public LessonType Type { get; set; }
    public int Room { get; set; }
    public bool OddWeek { get; set; }
    public bool EvenWeek { get; set; }
}