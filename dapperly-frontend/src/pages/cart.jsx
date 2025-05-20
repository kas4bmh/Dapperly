// src/components/CartPage.js
import React from 'react';
import { useCart } from '../components/CartContext';
import { useNavigate } from 'react-router-dom'; 
import "../css/Cart.css"

const CartPage = () => {
  const navigate = useNavigate(); 
      const handleCheckout = () => {
    navigate('/billing'); // Navigate to the Payment Page
  };
 const { cart, updateCartQuantity,removeFromCart} = useCart();
  
  // Calculate total price
  const totalAmount = cart.reduce((total, product) => total + product.price * product.quantity, 0);

  // Handle Quantity Change
  const handleQuantityChange = (id, quantity) => {   
    updateCartQuantity(id, quantity); // Update the quantity in the cart context
  };

  const removeProductFromCart=(id)=>{
    removeFromCart(id);
  }

  return (
    <div className="cart-container">
      <h2 className="cart-title">Your Shopping Cart</h2>

      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div className="cart-items-list">
          {cart.map((product) => (
            <div key={product.id} className="cart-item">
              <div className="cart-item-img-container">
                <img src={product.imageBaseUrl} alt={product.productName} className="cart-item-img" />
              </div>
              <div className="cart-item-details">
                <h3>{product.productName}</h3>
                <div className="cart-item-quantity">
                  <label htmlFor={`quantity-${product.id}`}>Quantity: </label>
                  <input 
                    type="number" 
                    id={`quantity-${product.id}`} 
                    min="1" 
                    value={product.quantity} 
                    onChange={(e) => handleQuantityChange(product.productId, parseInt(e.target.value))} 
                    className="quantity-input"
                  />
                </div>
                <p className="cart-item-price">₹{(product.price * product.quantity).toFixed(2)}</p>
                <button
  className="remove-button"
  onClick={() => removeProductFromCart(product.id)}
>
  Remove
</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Display total amount */}
      {cart.length > 0 && (
        <div className="total-container">
          <h3>Total: ₹{totalAmount.toFixed(2)}</h3>
        </div>
      )}

      <button className="checkout-button" onClick={handleCheckout}>Proceed to Checkout</button>
    </div>
  );


};

export default CartPage;
