namespace Schedule.Entities;

public class User : EntityWithIntId
{
    public string FirstName { get; set; }
    public string MiddleName { get; set; }
    public string LastName { get; set; }
    public DateTime DateOfBirth { get; set; }
    public string Email { get; set; }
}

public class Student : User
{
    public virtual List<Group> Groups { get; set; }
}

public class Moderator : User
{
    public virtual List<Faculty> Faculties { get; set; }
}

public class Admin : User
{
}