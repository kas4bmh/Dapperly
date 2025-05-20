namespace DapperlyApi.Entity
{
    public class ProductEntity
    {
        public int ProductId { get; set; }
        public string? ProductName { get; set; }

        public string? Category { get; set; }
        public string? Description { get; set; }
        public string? ImageBaseUrl { get; set; }
        public decimal Price { get; set; }
        public int? Stock { get; set; }
        public int Quantity { get; set; }
    }

}
