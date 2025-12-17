import React, { useEffect, useState, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "../styles/OrderDetails.css";

const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:5001/api";

export default function OrderDetails() {
  const { user } = useContext(AuthContext);
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) fetchOrder();
  }, [user]);

  async function fetchOrder() {
    try {
      const res = await fetch(`${API_BASE}/orders/${id}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Unable to fetch order");
      setOrder(data);
    } catch (err) {
      console.error("OrderDetails error:", err);
      setOrder(null);
    } finally {
      setLoading(false);
    }
  }

  function formatDate(date) {
    return new Date(date).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  if (!user)
    return (
      <div className="od-center">
        <h2>You must login to view your orders</h2>
        <Link className="od-btn" to="/login">Login</Link>
      </div>
    );

  if (loading)
    return (
      <div className="od-center">
        <div className="od-loader"></div>
        <p>Loading order…</p>
      </div>
    );

  if (!order)
    return (
      <div className="od-center">
        <h2>Order not found</h2>
        <Link className="od-btn" to="/orders">Back to Orders</Link>
      </div>
    );

  return (
    <div className="od-container">
      <h2 className="od-title">Order Details</h2>

      <div className="od-summary-card">
        <div className="od-row">
          <span className="od-label">Order ID:</span>
          <span className="od-value">#{order._id.slice(-6)}</span>
        </div>

        <div className="od-row">
          <span className="od-label">Date:</span>
          <span className="od-value">{formatDate(order.createdAt)}</span>
        </div>

        <div className="od-row">
          <span className="od-label">Status:</span>
          <span className="od-status">{order.status}</span>
        </div>

        <div className="od-row">
          <span className="od-label">Total Price:</span>
          <span className="od-value">₹{order.totalPrice}</span>
        </div>
      </div>

      <h3 className="od-section-title">Items</h3>

      <div className="od-items">
        {order.items.map((item, i) => (
          <div key={i} className="od-item-card">
            <img src={item.imageUrl} alt={item.name} className="od-item-img" />

            <div className="od-item-info">
              <div className="od-item-name">{item.name}</div>
              <div className="od-item-text">Price: ₹{item.price}</div>
              <div className="od-item-text">Qty: {item.quantity}</div>
            </div>
          </div>
        ))}
      </div>

      <Link className="od-back" to="/orders">← Back to Orders</Link>
    </div>
  );
}
