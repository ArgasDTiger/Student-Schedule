namespace Schedule.Entities;

public class Faculty : EntityWithIntId
{
    public string Name { get; set; }
    public int CorpusNumber { get; set; }
    public virtual List<Group> Groups { get; set; }
}