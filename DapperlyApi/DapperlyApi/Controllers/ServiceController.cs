using DapperlyApi.Common;
using DapperlyApi.EFModels;
using DapperlyApi.Entity;
using DapperlyApi.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace DapperlyApi.Controllers
{
    [Authorize]
    public class ServiceController:CustomController
    {

        public ApplicationDbContext _dbContext { get; set; }
        public ServiceController(ApplicationDbContext dbContext)
        {
            _dbContext=dbContext;
        }

        [HttpPost("addProduct")]
        public async Task<IActionResult> AddProduct([FromBody] Product product)
        {
            try
            {
                if (product == null)
                    return BadRequest("Product is null");

                // Optional: Add validation logic here
                var res=_dbContext.Products.Add(product);
                await _dbContext.SaveChangesAsync();

                return Ok("Product created successfully");
            }
            catch (DbUpdateException dbEx)
            {
                // Log the error (not shown here)
                return StatusCode(500, "A database error occurred while saving the product.");
            }
            catch (Exception ex)
            {
                // Log the error (not shown here)
                return StatusCode(500, "An unexpected error occurred.");
            }
        }

        [HttpGet("getProdById/{id}")]
        public async Task<IActionResult> GetProductById(int id)
        {
            var product = await _dbContext.Products.FindAsync(id);
            if (product == null)
                return NotFound();

            return Ok(product);
        }

        [HttpPut("updateProduct/{id}")]
        public async Task<IActionResult> UpdateProduct(int id, [FromBody] Product updatedProduct)
        {
            try
            {
                if (updatedProduct == null || updatedProduct.Id != id)
                    return BadRequest("Product data is invalid.");

                var existingProduct = await _dbContext.Products.FindAsync(id);
                if (existingProduct == null)
                    return NotFound("Product not found.");

                // Update fields
                existingProduct.ProductName = updatedProduct.ProductName;
                existingProduct.Category = updatedProduct.Category;
                existingProduct.Description = updatedProduct.Description;
                existingProduct.ImageBaseUrl = updatedProduct.ImageBaseUrl;
                existingProduct.Price = updatedProduct.Price;
                existingProduct.Stock = updatedProduct.Stock;

                // Save changes
                await _dbContext.SaveChangesAsync();

                return Ok("Product updated successfully.");
            }
            catch (DbUpdateException dbEx)
            {
                // Log the error (not shown here)
                return StatusCode(500, "A database error occurred while saving the product.");
            }
            catch (Exception ex)
            {
                // Log the error (not shown here)
                return StatusCode(500, "An unexpected error occurred.");
            }
        }

        [HttpGet("allProducts")]
        public async Task<IActionResult> GetAllProducts()
        {
            try
            {
                var products = await _dbContext.Products.ToListAsync();
                return Ok(products);  // Return 200 OK with the list of products
            }
            catch (Exception ex)
            {
                // Optionally log the exception
                return StatusCode(500, "Internal server error: " + ex.Message);
            }
        }

        [HttpGet("cartByUserId/{userId}")]
        public async Task<IActionResult> GetCartByUserId(int userId)
        {
            try
            {
                var cartItems = await _dbContext.Carts
                    .Where(c => c.UserId == userId)
                    .Include(c => c.Product) // Eager load Product details
                     .Select(c => new
                     {
                         Id = c.Id,
                         UserId = c.UserId,
                         ProductId = c.ProductId,
                         ProductName = c.Product.ProductName,
                         ImageBaseUrl=c.Product.ImageBaseUrl,
                         Quantity = c.Quantity,
                         Price = c.Product.Price
                     })
                    .ToListAsync();

                return Ok(cartItems);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error fetching cart: {ex.Message}");
            }
        }

        [HttpPost("addToCart")]
        public async Task<IActionResult> AddToCart([FromBody] Cart request)
        {
            try
            {
                Cart cartItem;

                // Check if this product already exists in the user's cart
                var existingCartItem = await _dbContext.Carts
                    .FirstOrDefaultAsync(c => c.UserId == request.UserId && c.ProductId == request.ProductId);

                if (existingCartItem != null)
                {
                    // If item exists, update quantity
                    existingCartItem.Quantity += request.Quantity;
                    cartItem = existingCartItem;
                }
                else
                {
                    cartItem = new Cart
                    {
                        UserId = request.UserId,
                        ProductId = request.ProductId,
                        Quantity = request.Quantity
                    };

                    await _dbContext.Carts.AddAsync(cartItem);
                }

                await _dbContext.SaveChangesAsync();

                // Return the updated or newly created cart item (including ID)
                return Ok(new { id = cartItem.Id });
            }
            catch (Exception ex)
            {
                return StatusCode(500, "An error occurred: " + ex.Message);
            }
        }


        [HttpDelete("removeFromCart/{cartId}")]
        public async Task<IActionResult> RemoveFromCart(int cartId)
        {
            try
            {
                var cartItem = await _dbContext.Carts
                    .FirstOrDefaultAsync(c => c.Id== cartId);

                if (cartItem == null)
                    return NotFound("Cart item not found.");

                _dbContext.Carts.Remove(cartItem);
                await _dbContext.SaveChangesAsync();

                return Ok("Cart item removed successfully.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, "An error occurred: " + ex.Message);
            }
        }

        [HttpPut("updateCart")]
        public async Task<IActionResult> UpdateCart([FromBody] Cart cart)
        {
            try
            {
                var cartItem = await _dbContext.Carts
                    .FirstOrDefaultAsync(c => c.UserId == cart.UserId && c.ProductId == cart.ProductId);

                if (cartItem == null)
                    return NotFound("Cart item not found.");

                // Update quantity
                cartItem.Quantity = cart.Quantity;

                await _dbContext.SaveChangesAsync();

                return Ok("Cart updated successfully.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error updating cart: {ex.Message}");
            }
        }

        [HttpPost("processOrder")]

        public async Task<IActionResult> ProcessOrderAndPayment([FromBody] PaymentGateWayEntity entity)
        {
            if (entity == null || entity.Cart == null || entity.Cart.Count == 0)
                return BadRequest("Invalid order data.");
            decimal totalAmount = entity.Cart.Sum(item => item.Price * item.Quantity);
            using var transaction = await _dbContext.Database.BeginTransactionAsync();

            try
            {
                // Step 1: Create Order
                var order = new Order
                {
                    UserId = entity.UserId,
                    OrderAddress = entity.OrderAddress,
                   TotalAmount= totalAmount,   
                    OrderDate = DateTime.UtcNow
                };

                _dbContext.Orders.Add(order);
                await _dbContext.SaveChangesAsync(); // To get OrderId

                // Step 2: Create OrderProduct rows
                foreach (var item in entity.Cart)
                {
                    await _dbContext.Database.ExecuteSqlRawAsync(
    "INSERT INTO OrderProducts (OrderId, ProductId, Quantity) VALUES ({0}, {1}, {2})",
    order.Id, item.ProductId, item.Quantity
);
                }

                await _dbContext.SaveChangesAsync();

                // Step 3: Create Payment row
                var payment = new Payment
                {
                    OrderId = order.Id,
                    Amount = totalAmount,
                    PaymentDate = DateTime.UtcNow,
                    PaymentMethod = "Credit"
                };

                _dbContext.Payments.Add(payment);
                await _dbContext.SaveChangesAsync();

                await transaction.CommitAsync();

                return Ok(new { success = true, message = "Order placed successfully." });
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return StatusCode(500, new { success = false, message = "Failed to process order", error = ex.Message });
            }
        }


        [HttpGet("orderByUserId/{userId}")]
        public async Task<IActionResult> GetOrderDetailsById(int userId)
        {
            try
            {
                var result = await _dbContext.Set<OrderProductInfo>()
      .FromSqlRaw(@"
        SELECT o.Id OrderId,p.ProductName,p.ImageBaseUrl,op.Quantity,(p.Price*op.Quantity) Price, o.TotalAmount, o.OrderAddress, o.OrderDate 
        FROM Orders o
        JOIN OrderProducts op ON op.OrderId = o.Id
        JOIN Products p ON p.Id = op.ProductId
        JOIN Payments py ON py.OrderId = o.Id
        WHERE o.UserId = {0}", userId)
      .ToListAsync();
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error retriveing Order details: {ex.Message}");
            }
        }




    }
}
