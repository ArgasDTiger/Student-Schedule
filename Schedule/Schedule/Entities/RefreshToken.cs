namespace Schedule.Entities;

public class RefreshToken : EntityWithIntId
{
    public string Token { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime ExpiresAt { get; set; }
    public bool Revoked { get; set; }
    public int UserId { get; set; }
    public virtual User User { get; set; }
}