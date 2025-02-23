namespace Schedule.Entities;

public class Teacher : EntityWithIntId, IArchivedEntity
{
    public string FirstName { get; set; }
    public string MiddleName { get; set; }
    public string LastName { get; set; }
    public Degree Degree { get; set; }
    public bool IsArchived { get; set; }
}

public enum Degree : byte
{
    Assistant,
    AssociateProfessor,
    Professor
}