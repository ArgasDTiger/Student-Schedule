using Schedule.Interfaces;

namespace Schedule.Schema.Queries;

public partial class Query
{
    private readonly IRepository _repository;

    public Query(IRepository repository)
    {
        _repository = repository;
    }
}