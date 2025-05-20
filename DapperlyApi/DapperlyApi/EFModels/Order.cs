namespace DapperlyApi.Models
{
    public class Order
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public User User { get; set; }

        public string OrderAddress { get; set; }

        public DateTime OrderDate { get; set; }
        public decimal TotalAmount { get; set; }

        public ICollection<Product> Products { get; set; }
        public Payment Payment { get; set; }
    }

}
