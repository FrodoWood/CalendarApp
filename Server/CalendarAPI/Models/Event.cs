using System.Text.Json.Serialization;

namespace CalendarAPI.Models
{
    public class Event
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public DateOnly Date {  get; set; }
        public string UserId { get; set; }
        [JsonIgnore]
        public User User { get; set; }
    }
}
