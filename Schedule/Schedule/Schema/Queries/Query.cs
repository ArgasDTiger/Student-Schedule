using HotChocolate.Authorization;
using Mapster;
using Microsoft.EntityFrameworkCore;
using Schedule.DTOs;
using Schedule.Entities;
using Schedule.Interfaces;

namespace Schedule.Schema.Queries;

public class Query(IRepository repository)
{
    public async Task<List<LessonInfoDTO>> GetScheduleByStudentGroup(int groupId, CancellationToken cancellationToken)
    {
        var lessonGroups = await repository
            .GetAll<LessonGroup>()
            .Where(lg => lg.Group.Id == groupId)
            .ToListAsync(cancellationToken);
        
        return lessonGroups.Adapt<List<LessonInfoDTO>>();
    }
    
    // [Authorize]
    // public async Task<User> GetCurrentUser([GlobalState] string? userId, CancellationToken cancellationToken)
    // {
    //     if (string.IsNullOrEmpty(userId))
    //     {
    //         throw new GraphQLException(new Error("Not authenticated"));
    //     }
    //
    //     var user = await repository.GetAll<User>().FirstOrDefaultAsync(u => u.Id == int.Parse(userId), cancellationToken);
    //     return user ?? throw new GraphQLException(new Error("User is not found"));
    // }
}