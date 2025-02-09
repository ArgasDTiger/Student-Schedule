namespace Schedule.DTOs;

public class FacultyDTO
{
    public int Id { get; set; }
    public string Name { get; set; }
    public int CorpusNumber { get; set; }
    public List<GroupDTO> Groups { get; set; }
}