using Schedule.Interfaces;

namespace Schedule.Schema.Queries;

public partial class Query
{
    private readonly IRepository _repository;
    private readonly ITokenService _tokenService;
    private readonly IUserService _userService;

    public Query(IRepository repository, ITokenService tokenService, IUserService userService)
    {
        _repository = repository;
        _tokenService = tokenService;
        _userService = userService;
    }
}