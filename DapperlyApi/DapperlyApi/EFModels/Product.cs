namespace DapperlyApi.Models
{
    public class Product
    {
        public int Id { get; set; }
        public string ProductName { get; set; }

        public string Category { get; set; }
        public string Description { get; set; }
        public string ImageBaseUrl { get; set; }
        public decimal Price { get; set; }
        public int Stock { get; set; }

        public ICollection<Order>? Orders { get; set; }
        public ICollection<Cart>? Carts { get; set; }
    }

}
