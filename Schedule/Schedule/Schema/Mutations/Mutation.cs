
using Google.Apis.Auth;
using Mapster;
using Microsoft.EntityFrameworkCore;
using Schedule.DTOs;
using Schedule.Entities;
using Schedule.Interfaces;

namespace Schedule.Schema.Mutations;

public class Mutation
{
    private readonly IRepository _repository;
    private readonly IConfiguration _configuration;
    private readonly ITokenService _tokenService;
    private readonly IUserService _userService;

    public Mutation(IRepository repository, IConfiguration configuration, ITokenService tokenService, IUserService userService)
    {
        _repository = repository;
        _configuration = configuration;
        _tokenService = tokenService;
        _userService = userService;
    }
    
    public async Task<UserDTO> Login(string idToken, CancellationToken cancellationToken)
    {
        return await _userService.Login(idToken, cancellationToken);
    }

    public async Task RevokeToken(int userId, CancellationToken cancellationToken)
    {
        await _tokenService.RevokeToken(userId, cancellationToken);
    }

}