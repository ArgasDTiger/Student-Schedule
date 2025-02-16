using Schedule.Interfaces;

namespace Schedule.Schema.Queries;

public partial class Query
{
    private readonly ITokenService _tokenService;
    private readonly IUserService _userService;
    private readonly ILessonService _lessonService;
    private readonly ITeacherService _teacherService;

    public Query(ITokenService tokenService, IUserService userService, ILessonService lessonService, ITeacherService teacherService)
    {
        _tokenService = tokenService;
        _userService = userService;
        _lessonService = lessonService;
        _teacherService = teacherService;
    }
}