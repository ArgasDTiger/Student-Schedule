using Schedule.Interfaces;

namespace Schedule.Schema.Mutations;

public partial class Mutation
{
    private readonly ITokenService _tokenService;
    private readonly IUserService _userService;
    private readonly ILessonService _lessonService;
    private readonly IGroupService _groupService;

    public Mutation(ITokenService tokenService, IUserService userService, ILessonService lessonService, IGroupService groupService)
    {
        _tokenService = tokenService;
        _userService = userService;
        _lessonService = lessonService;
        _groupService = groupService;
    }
}