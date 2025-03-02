using Schedule.Entities;

namespace Schedule.Inputs;

public class AddTeacherInput
{
    public string FirstName { get; set; }
    public string MiddleName { get; set; }
    public string LastName { get; set; }
    public Degree Degree { get; set; }
}