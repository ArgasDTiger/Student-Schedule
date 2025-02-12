using Schedule.Entities;

namespace Schedule.Requests;

public class AddLessonInfoRequest
{
    public int LessonId { get; set; }
    public int GroupId { get; set; }
    public int TeacherId { get; set; }
    public DayOfWeek WeekDay { get; set; }
    public LessonNumber LessonNumber { get; set; }
    public LessonType Type { get; set; }
    public int Room { get; set; }
    public bool OddWeek { get; set; }
    public bool EvenWeek { get; set; }
}