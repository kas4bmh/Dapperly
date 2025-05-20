// src/components/BillingPage.jsx
import React, { useState } from 'react';
import '../css/BillingPage.css';
import { useAuth } from '../components/AuthContext';
import { useCart } from '../components/CartContext';
import { useNavigate } from 'react-router-dom';
import {useAddress} from "../components/AddressContext"

const BillingPage = () => {
var navigte=useNavigate();
     const { cart } = useCart();
     const { token,loggedInUser} = useAuth(); 
     const {addAddress}=useAddress();

  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [zipCode, setZipCode] = useState('');

  const handlePayment = () => {
    if (!address || !city || !zipCode) {
      alert('Please fill in all billing details.');
      return;
    }
addAddress(JSON.stringify({
 address:address,
 city:city,
 zipCode:zipCode
})
);

    alert('Redirecting to payment...');
navigte("/payment/?payload");
    // Navigate or trigger payment logic here
  };

  return (
    <div className="billing-container">
      <h2>Billing Details</h2>

      <div className="billing-form">
        <input
          type="text"
          placeholder="Street Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="City"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Zip Code"
          value={zipCode}
          onChange={(e) => setZipCode(e.target.value)}
          required
        />
      </div>

      <h3>Cart Summary</h3>
    <table className="cart-table">
  <thead>
    <tr>
      <th>Product</th>
      <th>Qty</th>
      <th>Price</th>
      <th>Total Price</th>
    </tr>
  </thead>
  <tbody>
    {cart.map((item, idx) => (
      <tr key={idx}>
        <td>{item.productName}</td>
        <td>{item.quantity}</td>
        <td>{item.price}</td>
        <td>{item.quantity * item.price}</td>
      </tr>
    ))}
  </tbody>
  <tfoot>
    <tr>
      <td colSpan="1"><strong>Total</strong></td>
      <td>
        <strong>
          {cart.reduce((sum, item) => sum + item.quantity, 0)}
        </strong>
      </td>
      <td></td>
      <td>
        <strong>
          ₹{cart.reduce((sum, item) => sum + item.quantity * item.price, 0)}
        </strong>
      </td>
    </tr>
  </tfoot>
</table>


      <div className="total-amount">
        <strong>Total Amount:</strong> ₹{cart.reduce((sum, item) => sum + item.quantity * item.price, 0)}
      </div>

      <button className="pay-now-button" onClick={handlePayment}>
        Pay Now
      </button>
    </div>
  );
};

export default BillingPage;
