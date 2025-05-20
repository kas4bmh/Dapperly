namespace DapperlyApi.Entity
{
    public class UserEntity
    {
        public int Id { get; set; }
        public string Role { get; set; }
        public string Company { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }

        public ICollection<OrderEntity> Orders { get; set; }
        public ICollection<CartEntity> Carts { get; set; }
    }

}
