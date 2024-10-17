using CalendarAPI.DTOS;
using CalendarAPI.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace CalendarAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly UserManager<User> _userManager;
        private readonly SignInManager<User> _signInManager;

        public AccountController(UserManager<User> userManager,
            SignInManager<User> signInManager)
        {
            _userManager = userManager;
            _signInManager = signInManager;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDTO registerDTO)
        {
            try
            {   
                if(!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var user = new User { UserName = registerDTO.Username, Email = registerDTO.Email };
                var result = await _userManager.CreateAsync(user, registerDTO.Password);

                if (result.Succeeded)
                {
                    await _signInManager.SignInAsync(user, isPersistent: false);
                    return Ok();
                }
                else
                {
                    return BadRequest(result.Errors);
                }

            }
            catch(Exception ex)
            {
                return StatusCode(500, ex.Message);
            }


            

        }
    }
}
