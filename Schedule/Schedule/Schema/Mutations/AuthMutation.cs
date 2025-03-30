using Schedule.DTOs;

namespace Schedule.Schema.Mutations;

public partial class Mutation
{
    public async Task<UserDTO> Login(string idToken, CancellationToken cancellationToken)
    {
        return await _userService.Login(idToken, cancellationToken);
    }
   
    public async Task<bool?> RefreshToken(CancellationToken cancellationToken)
    {
        await _tokenService.RefreshToken(cancellationToken);
        return true;
    }

    public async Task<bool?> RevokeToken(CancellationToken cancellationToken)
    {
        await _tokenService.RevokeToken(cancellationToken);
        return true;
    }
}