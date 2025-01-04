namespace Schedule.Entities;

public class LessonGroup
{
    public int Id { get; set; }
    public Lesson Lesson { get; set; }
    public Group Group { get; set; }
    public string? SubGroupLetter { get; set; }
}