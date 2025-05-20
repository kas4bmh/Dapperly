// src/components/PaymentPage.jsx
import React, { useState } from 'react';
import '../css/PaymentPage.css'; // Import custom styles for PaymentPage
import { useAuth } from '../components/AuthContext';
import { useCart } from '../components/CartContext';
import { useNavigate } from 'react-router-dom';
import {useAddress} from "../components/AddressContext"
import axios from 'axios';

const PaymentPage = () => {
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const {address}=useAddress();
  const{token,loggedInUser}=useAuth();
  const{cart}=useCart();
 const navigate =useNavigate();
  
  // Handle form submission (for now, just log the details)
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Card Number:', cardNumber);
    console.log('Expiry Date:', expiryDate);
    console.log('CVV:', cvv);
    
    var payload={
      orderAddress:address,
      userId:loggedInUser["id"],
      cart:cart
    }

    console.log(payload);

   axios.post(`https://localhost:44314/api/service/processOrder`, payload, {
  headers: {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json'  // Optional but good to specify
  }
})
.then((response) => {
  if (response.status === 200 || response.status === 201) {
    alert("Order Processed Successfully, Thank You!!");
    navigate("/products")

  } else {
    alert(`Unexpected status code: ${response.status}`);
  }
})
.catch((error) => {
  console.error('Error Porcessing the order:', error);

  if (error.response) {
    // Server responded with a status code out of 2xx
    alert(`Failed to process the order: ${error.response.data?.message || error.response.statusText}`);
  } else if (error.request) {
    // Request was made but no response received
    alert("No response from server.");
  } else {
    // Something else happened
    alert("An error occurred: " + error.message);
  }
});

  };

  return (
    <div className="payment-container">
      <h2>Payment Gateway</h2>
      <p>Enter your payment details to complete the purchase.</p>
      
      <form onSubmit={handleSubmit} className="payment-form">
        <input
          type="text"
          placeholder="Card Number"
          value={cardNumber}
          onChange={(e) => setCardNumber(e.target.value)}
          className="payment-input"
        />
        
        <div className="expiry-cvv-container">
          <input
            type="text"
            placeholder="Expiry Date (MM/YY)"
            value={expiryDate}
            onChange={(e) => setExpiryDate(e.target.value)}
            className="payment-input"
          />
          <input
            type="text"
            placeholder="CVV"
            value={cvv}
            onChange={(e) => setCvv(e.target.value)}
            className="payment-input"
          />
        </div>

        <button type="submit" className="pay-now-button" onClick={()=>handleSubmit}>Pay Now</button>
      </form>
    </div>
  );
};

export default PaymentPage;
