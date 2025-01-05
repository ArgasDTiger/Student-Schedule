using Schedule.Entities;

namespace Schedule.DTOs;

public class TeacherDTO
{
    public int Id { get; set; }
    public string FirstName { get; set; }
    public string MiddleName { get; set; }
    public string LastName { get; set; }
    public Degree Degree { get; set; }
}