namespace Schedule.Entities;

public class User : EntityWithIntId
{
    public string FirstName { get; set; }
    public string MiddleName { get; set; }
    public string LastName { get; set; }
    public DateTime DateOfBirth { get; set; }
    public string Email { get; set; }
    public string GoogleId { get; set; }
    public UserRole Role { get; set; }
    public virtual List<Group>? Groups { get; set; }
    public virtual List<Faculty>? Faculties { get; set; }
}

public enum UserRole
{
    Student,
    Moderator,
    Admin
}