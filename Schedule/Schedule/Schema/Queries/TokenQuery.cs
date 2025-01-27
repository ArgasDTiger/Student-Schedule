namespace Schedule.Schema.Queries;

public partial class Query
{
    public async Task RefreshToken(CancellationToken cancellationToken)
    {
        await _tokenService.RefreshToken(cancellationToken);
    }
}