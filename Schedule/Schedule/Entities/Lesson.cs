namespace Schedule.Entities;

public class Lesson : EntityWithIntId, IArchivedEntity
{
    public string Name { get; set; }
    public bool IsArchived { get; set; }
    public virtual List<LessonGroup> LessonGroups { get; set; } = [];
}