using BCrypt.Net;
using DapperlyApi.Common;
using DapperlyApi.Entity;
using DapperlyApi.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace DapperlyApi.Controllers
{
    
    public class AuthController: CustomController
    {
        private readonly IConfiguration _configuration;
        private readonly ApplicationDbContext _dbContext;
        public AuthController(IConfiguration configuration,ApplicationDbContext dbContext)
        {
            _configuration=configuration;
            _dbContext=dbContext;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginEntity model)
        {
            
            var user=_dbContext.Users.SingleOrDefault(u=>u.Email==model.Emailid);

            if (user == null)
                return Unauthorized("Invalid username or password");

            bool isPasswordValid = BCrypt.Net.BCrypt.Verify(model.Password, user.Password);
            if (!isPasswordValid)
                return Unauthorized("Invalid username or password");

            var token = GenerateJwtToken(user.Email, user.Role);

            return Ok(new { bearer = token, loggedInUser = new { id=user.Id,email = user.Email, role = user.Role, company = user.Company } });
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterEntity model)
        {
            try
            {
                // Check if user already exists
                var existingUser = await _dbContext.Users.FirstOrDefaultAsync(u => u.Email == model.Emailid);
                if (existingUser != null)
                    return BadRequest("User already exists");

                // Hash the password before storing
                string hashedPassword = BCrypt.Net.BCrypt.HashPassword(model.Password);

                // Create new user
                var newUser = new User
                {
                    Company = model.Company,
                    Email = model.Emailid,
                    Password = hashedPassword,
                    Role = model.Role
                };

                await _dbContext.Users.AddAsync(newUser);
                await _dbContext.SaveChangesAsync();

                return Ok();
            }
            catch (DbUpdateException ex)
            {
               return StatusCode(500, "An error occurred while saving the user to the database.");
            }
        }

        private string GenerateJwtToken(string username, string role)
        {
            var jwtSettings = _configuration.GetSection("Jwt");
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings["Key"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
        new Claim(ClaimTypes.Name, username),
        new Claim(ClaimTypes.Role, role)
    };

            var token = new JwtSecurityToken(
                claims: claims,
                expires: DateTime.Now.AddMinutes(Convert.ToDouble(jwtSettings["ExpireMinutes"])),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
