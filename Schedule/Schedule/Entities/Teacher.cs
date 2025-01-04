namespace Schedule.Entities;

public class Teacher
{
    public int Id { get; set; }
    public string FirstName { get; set; }
    public string MiddleName { get; set; }
    public string LastName { get; set; }
    public Degree Degree { get; set; }
}

public enum Degree
{
    Assistant,
    AssociateProfessor,
    Professor
}