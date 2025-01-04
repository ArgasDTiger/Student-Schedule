using Schedule.Entities;

namespace Schedule.DTOs;

public record UserDTO(
    int Id, 
    string FirstName,
    string MiddleName, 
    string LastName,
    DateTime DateOfBirth, 
    string Email);

public record StudentDTO(
    int Id,
    string FirstName,
    string MiddleName,
    string LastName,
    DateTime DateOfBirth,
    string Email,
    List<Group> Groups,
    List<Faculty> Faculties) 
    : UserDTO(Id, FirstName, MiddleName, LastName, DateOfBirth, Email);
    
public record ModeratorDTO(
    int Id,
    string FirstName,
    string MiddleName,
    string LastName,
    DateTime DateOfBirth,
    string Email,
    List<Faculty> Faculties) 
    : UserDTO(Id, FirstName, MiddleName, LastName, DateOfBirth, Email);
    
public record AdminDTO(
    int Id,
    string FirstName,
    string MiddleName,
    string LastName,
    DateTime DateOfBirth,
    string Email) 
    : UserDTO(Id, FirstName, MiddleName, LastName, DateOfBirth, Email);