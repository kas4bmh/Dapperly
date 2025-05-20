import axios from "axios";
import React, { useState, useEffect } from "react";
import { useAuth } from "../components/AuthContext";
import "../css/Orders.css"

const OrderPage = () => {
  const [orders, setOrders] = useState([]);
  const { token, loggedInUser, logout } = useAuth();

  useEffect(() => {
    if (!loggedInUser?.id) return;

    axios
      .get(`https://localhost:44314/api/Service/orderByUserId/${loggedInUser.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setOrders(response.data); // Array of order info
      })
      .catch((error) => {
        console.error("Error fetching orders:", error);
        if (error?.response?.status === 401) logout();
      });
  }, [loggedInUser?.id, token]);

  return (
    <div className="order-container">
      <h1 className="order-title">My Orders</h1>

      {orders.length === 0 ? (
        <div className="order-empty">No orders found.</div>
      ) : (
        <div className="order-table-wrapper">
          <table className="order-table">
            <thead>
              <tr>
                <th>Order Id</th>
                <th>Image</th>
                <th>Product</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Order Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, index) => (
                <tr key={index}>
                    <td>#{order.orderId}</td>
                  <td>
                    <img
                      src={order.imageBaseUrl}
                      alt={order.productName}
                      className="order-img"
                    />
                  </td>
                  <td>{order.productName}</td>
                  <td>{order.quantity}</td>
                  <td>₹{order.price}</td>
                  <td>{new Date(order.orderDate).toLocaleDateString()}</td>
                </tr>
              ))}
              <tr className="order-total-row">
                <td colSpan="5" style={{ textAlign: "right", fontWeight: "bold", paddingTop: "20px" }}>
                  Grand Total: ₹{orders[0].totalAmount}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default OrderPage;
