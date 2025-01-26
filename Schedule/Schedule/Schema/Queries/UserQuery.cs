using Microsoft.EntityFrameworkCore;
using Schedule.Entities;

namespace Schedule.Schema.Queries;

public partial class Query
{
    public async Task<User> GetCurrentUser([GlobalState] string? userId, CancellationToken cancellationToken)
    {
        if (string.IsNullOrEmpty(userId))
        {
            throw new GraphQLException(new Error("Not authenticated"));
        }
    
        var user = await _repository.GetAll<User>().FirstOrDefaultAsync(u => u.Id == int.Parse(userId), cancellationToken);
        return user ?? throw new GraphQLException(new Error("User is not found"));
    }
}