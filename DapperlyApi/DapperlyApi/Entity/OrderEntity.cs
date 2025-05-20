using DapperlyApi.Models;

namespace DapperlyApi.Entity
{
    public class OrderEntity
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public UserEntity User { get; set; }

        public DateTime OrderDate { get; set; }
        public decimal TotalAmount { get; set; }

        public ICollection<ProductEntity> Products { get; set; }
        public Payment Payment { get; set; }
    }

}
