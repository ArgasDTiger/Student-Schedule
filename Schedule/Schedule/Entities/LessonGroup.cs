namespace Schedule.Entities;

public class LessonGroup
{
    public int Id { get; set; }
    public Lesson Lesson { get; set; }
    public Group Group { get; set; }
    public Teacher Teacher { get; set; }
    // public string? SubGroupLetter { get; set; }
    public DayOfWeek WeekDay { get; set; }
    public LessonNumber LessonNumber { get; set; }
    public LessonType Type { get; set; }
    public int Room { get; set; }
    public bool OddWeek { get; set; }
    public bool EvenWeek { get; set; }
}

public enum LessonType
{
    Lecture,
    Practice,
    Laboratory
}

public enum LessonNumber
{
    First,
    Second,
    Third,
    Fourth,
    Fifth
}