import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "../styles/Orders.css";

const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:5001/api";

export default function Orders() {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) fetchOrders();
  }, [user]);

  async function fetchOrders() {
    try {
      const res = await fetch(`${API_BASE}/orders/user/${user.id}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message);
      setOrders(data);
    } catch (err) {
      console.error("Orders error:", err);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }

  function formatDate(dt) {
    return new Date(dt).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
  }

  if (!user)
    return (
      <div className="orders-center">
        <h2>Please login to view your orders</h2>
        <Link className="orders-btn" to="/login">Login</Link>
      </div>
    );

  if (loading)
    return (
      <div className="orders-center">
        <div className="orders-loader"></div>
        <p>Loading orders…</p>
      </div>
    );

  if (!orders.length)
    return (
      <div className="orders-center">
        <h2>No Orders Found</h2>
        <p>You haven't placed any orders yet.</p>
        <Link className="orders-btn" to="/items">Shop Now</Link>
      </div>
    );

  return (
    <div className="orders-container">
      <h2 className="orders-title">Your Orders</h2>

      <div className="orders-list">
        {orders.map((o) => (
          <Link to={`/orders/${o._id}`} className="order-card" key={o._id}>
            <div className="order-header">
              <span className="order-id">Order #{o._id.slice(-6)}</span>
              <span className="order-date">{formatDate(o.createdAt)}</span>
            </div>

            <div className="order-body">
              <div className="order-info">
                <div><strong>Items:</strong> {o.items?.length}</div>
                <div><strong>Total:</strong> ₹{o.totalPrice}</div>
              </div>

              <div className={`order-status order-status-${o.status}`}>
                {o.status}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
