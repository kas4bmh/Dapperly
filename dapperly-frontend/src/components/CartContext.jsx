import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const { token, loggedInUser } = useAuth();
  const [cart, setCart] = useState([]);

  const API_BASE_URL = 'https://dapperly-bpcbh3erbzc4ckhh.eastasia-01.azurewebsites.net';
  // Load cart on user login
  useEffect(() => {
    if (!token || !loggedInUser?.id) return;

    axios.get(`${API_BASE_URL}/api/Service/cartByUserId/${loggedInUser.id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then(res => {
      console.log(res)
      setCart(res.data);
    }).catch(err => {
      console.error("Failed to load cart:", err);
    });
  }, [token, loggedInUser]);

  // Add product to DB cart
  const addToCart = async (product) => {
    try {
      const payload = {
        userId: loggedInUser.id,
        productId: product.id,
        quantity: 1
      };

      var res=await postAsync(payload);
console.log(res);
      // Optimistic UI update
      setCart(prevCart => {
        const existingIndex = prevCart.findIndex(p => p.productId === product.id);
        if (existingIndex !== -1) {
          const updated = [...prevCart];
          updated[existingIndex].quantity += 1;
          return updated;
        } else {
          return [...prevCart, {
            id: res.data.id || 0,
            productId: product.id,
            productName: product.productName,
            price: product.price,
            quantity: 1,
            imageBaseUrl: product.imageBaseUrl
          }];
        }
      });
    } catch (err) {
      console.error("Error adding to cart:", err);
    }
  };



  const updateCartQuantity = async (productId, newQuantity) => {
    try {
      const payload = {
        userId: loggedInUser.id,
        productId: productId,
        quantity: newQuantity
      };

      updateCart(payload);

      // Optional: update quantity via a backend endpoint (create if needed)
      setCart(prevCart =>
        prevCart.map(item =>
          item.productId === productId ? { ...item, quantity: newQuantity } : item
        )
      );
    } catch (err) {
      console.error('Update cart quantity failed:', err);
    }
  };

  const removeFromCart = async (cartId) => {
    try {
      
      removeCartAsync(cartId);
      
      // Optional: delete from backend via API if available
      setCart(prevCart => prevCart.filter(item => item.id !== cartId));
    } catch (err) {
      console.error("Remove from cart failed:", err);
    }
  };

     const postAsync =async (payload)=>{ 
      var res=await axios.post(
        `${API_BASE_URL}/api/service/addToCart`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      return res;
    }

    const removeCartAsync= async(cartId)=>{
     
       await axios.delete(
      `${API_BASE_URL}/api/service/removeFromCart/${cartId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    }

    const updateCart = async (payload) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/api/Service/updateCart`,payload,{
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
    console.log(response.data);
  } catch (error) {
    console.error("Error updating cart", error);
  }
};

  return (
    <CartContext.Provider value={{ cart, addToCart, updateCartQuantity, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
};
