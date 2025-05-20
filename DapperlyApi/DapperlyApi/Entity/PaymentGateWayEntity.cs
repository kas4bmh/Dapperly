namespace DapperlyApi.Entity
{
    public class PaymentGateWayEntity
    {
        public string OrderAddress { get; set; }
        public int UserId { get; set; }
        public List<ProductEntity> Cart { get; set; }
    }

}
