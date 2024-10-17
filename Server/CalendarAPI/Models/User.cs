using Microsoft.AspNetCore.Identity;

namespace CalendarAPI.Models
{
    public class User : IdentityUser
    {
        public List<Event> Events { get; set; }
    }
}
