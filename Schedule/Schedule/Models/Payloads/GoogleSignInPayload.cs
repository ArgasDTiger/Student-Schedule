using Schedule.Entities;

namespace Schedule.Models.Payloads;

public class GoogleSignInPayload
{
    public User User { get; set; }
    public string Token { get; set; }
}