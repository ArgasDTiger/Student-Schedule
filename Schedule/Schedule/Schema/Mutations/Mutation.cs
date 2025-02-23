using HotChocolate.Subscriptions;
using Schedule.Interfaces;

namespace Schedule.Schema.Mutations;

public partial class Mutation
{
    private readonly ITokenService _tokenService;
    private readonly IUserService _userService;
    private readonly ILessonService _lessonService;
    private readonly IGroupService _groupService;
    private readonly ITopicEventSender _eventSender;
    private readonly ITeacherService _teacherService;

    public Mutation(ITokenService tokenService, IUserService userService, ILessonService lessonService, IGroupService groupService, ITopicEventSender eventSender, ITeacherService teacherService)
    {
        _tokenService = tokenService;
        _userService = userService;
        _lessonService = lessonService;
        _groupService = groupService;
        _eventSender = eventSender;
        _teacherService = teacherService;
        _eventSender = eventSender;
    }
}