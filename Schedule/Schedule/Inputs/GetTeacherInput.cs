using Schedule.Entities;

namespace Schedule.Inputs;

public class GetTeacherInput
{
    public string? Search { get; set; }
    public DayOfWeek? WeekDay { get; set; }
    public LessonNumber? LessonNumber { get; set; }
    public int? LessonInfoId { get; set; }
}