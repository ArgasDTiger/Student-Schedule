using Schedule.Entities;

namespace Schedule.DTOs;

public class UserDTO
{
    public int Id { get; set; }
    public string FirstName { get; set; }
    public string MiddleName { get; set; }
    public string LastName { get; set; }
    public DateTime DateOfBirth { get; set; }
    public string Email { get; set; }
    public string Token { get; set; }
    public UserRole Role { get; set; }
}

public class StudentDTO : UserDTO
{
    public List<GroupDTO> Groups { get; set; }
}

public class ModeratorDTO : UserDTO
{
    public List<Faculty> Faculties { get; set; }
}

public class AdminDTO : UserDTO
{
}