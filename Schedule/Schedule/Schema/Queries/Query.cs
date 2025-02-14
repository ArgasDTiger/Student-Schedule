using Schedule.Interfaces;

namespace Schedule.Schema.Queries;

public partial class Query
{
    private readonly IRepository _repository;
    private readonly ITokenService _tokenService;
    private readonly IUserService _userService;
    private readonly ILessonService _lessonService;
    private readonly ITeacherService _teacherService;

    public Query(IRepository repository, ITokenService tokenService, IUserService userService, ILessonService lessonService, ITeacherService teacherService)
    {
        _repository = repository;
        _tokenService = tokenService;
        _userService = userService;
        _lessonService = lessonService;
        _teacherService = teacherService;
    }
}