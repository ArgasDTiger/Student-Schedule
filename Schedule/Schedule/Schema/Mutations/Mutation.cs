using Schedule.DTOs;
using Schedule.Interfaces;

namespace Schedule.Schema.Mutations;

public class Mutation
{
    private readonly ITokenService _tokenService;
    private readonly IUserService _userService;

    public Mutation(ITokenService tokenService, IUserService userService)
    {
        _tokenService = tokenService;
        _userService = userService;
    }
    
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