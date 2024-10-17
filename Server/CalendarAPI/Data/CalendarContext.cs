using CalendarAPI.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace CalendarAPI.Data
{
    public class CalendarContext : IdentityDbContext<User>
    {
        public CalendarContext(DbContextOptions<CalendarContext> options) : base(options) { }

        //public DbSet<User> Users { get; set; }
        public DbSet<Event> Events { get; set; }
    }
}
