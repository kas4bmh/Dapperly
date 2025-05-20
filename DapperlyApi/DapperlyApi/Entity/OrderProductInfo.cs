using Microsoft.EntityFrameworkCore;

namespace DapperlyApi.Entity
{
    [Keyless]
    public class OrderProductInfo
    {
        public int OrderId { get; set; }
        public string ProductName { get; set; }
        public string ImageBaseUrl { get; set; }
        public int Quantity { get; set; }

        public decimal Price { get; set; }
        public decimal TotalAmount { get; set; }
        public string OrderAddress { get; set; }
        public DateTime OrderDate { get; set; }
    }
}
