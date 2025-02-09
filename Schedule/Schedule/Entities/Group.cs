namespace Schedule.Entities;

public class Group : EntityWithIntId
{
    public int GroupNumber { get; set; }
    public int FacultyId { get; set; }
    public virtual Faculty Faculty { get; set; }
}