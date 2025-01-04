namespace Schedule.Entities;

public class User
{
    public int Id { get; set; }
    public string FirstName { get; set; }
    public string MiddleName { get; set; }
    public string LastName { get; set; }
    public DateTime DateOfBirth { get; set; }
    public string Email { get; set; }
}

public class Student : User
{
    public List<Group> Groups { get; set; }
}

public class Moderator : User
{
    public List<Faculty> Faculties { get; set; }
}

public class Admin : User
{
}