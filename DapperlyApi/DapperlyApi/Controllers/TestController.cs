using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DapperlyApi.Controllers
{
    [Authorize]
    public class TestController: CustomController
    {
       
        [HttpGet]
        public async Task<IActionResult> GetTestResut()
        {
            await Task.CompletedTask;
            return Ok("Api Testing Successfull");
        }
    }
}
