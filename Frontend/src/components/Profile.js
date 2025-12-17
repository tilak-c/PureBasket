import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";
import "../styles/Profile.css";
import avatarImg from '../assets/avatar.png';
import Swal from "sweetalert2";
const DEFAULT_AVATAR = avatarImg;

export default function Profile() {
  const { user, logout } = useContext(AuthContext);
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState([]);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || ""
      });
      fetchOrders();
    }
  }, [user]);

  async function fetchOrders() {
    if (!user) return;
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_BASE || "http://localhost:5001/api"}/orders/user/${user.id}`
      );
      if (!res.ok) throw new Error("Could not load orders");
      const data = await res.json();
      setOrders(data || []);
    } catch (err) {
      console.warn("fetch orders error", err);
    }
  }

  async function onSave(e) {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    setMessage(null);

    try {
      const BASE = process.env.REACT_APP_API_BASE || "http://localhost:5001/api";
      // const url = `${BASE}/users/${user.id}`;
      const userId = user?.id || user?._id;

if (!userId) {
  Swal.fire({
  icon: "error",
  title: "Oops!",
  text: "Something is wrong: user has no ID",
  confirmButtonColor: "#0a4a7b"
});

  return;
}


      const url = `${BASE}/users/${userId}`;
      const res = await fetch(url, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          phone: form.phone
        })
      });

      const text = await res.text();
      let json;
      try {
        json = text ? JSON.parse(text) : null;
      } catch {
        json = text;
      }

      if (!res.ok) {
        throw new Error(json?.message || `Error ${res.status}`);
      }

      const updated = {
        id: user.id,
        name: form.name,
        email: user.email,
        phone: form.phone
      };

      localStorage.setItem("user", JSON.stringify(updated));
      setMessage("Profile updated");
      setEditing(false);
    } catch (err) {
      console.error("onSave error", err);
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (!user) {
    return (
      <div className="profile-wrap">
        <h2>Not signed in</h2>
        <p>
          Please <Link to="/login">Login</Link> or{" "}
          <Link to="/register">Register</Link> to view your profile.
        </p>
      </div>
    );
  }

  return (
    <div className="profile-wrap">
      <div className="profile-card">
        <div className="avatar-column">
          <img
            src={DEFAULT_AVATAR}
            alt="avatar"
            className="profile-avatar"
          />
        </div>

        <div className="profile-main">
          {!editing && (
            <div className="profile-top-actions">
              <button className="btn primary" onClick={() => setEditing(true)}>
                Edit Profile
              </button>
              <button className="btn" onClick={logout}>
                Logout
              </button>
            </div>
          )}

          <form className="profile-form" onSubmit={onSave}>
            <div className="form-row">
              <label>Name</label>
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                readOnly={!editing}
              />
            </div>

            <div className="form-row">
              <label>Email</label>
              <input value={form.email} readOnly />
              <small className="readonly-note">
                Email cannot be changed
              </small>
            </div>

            <div className="form-row">
              <label>Phone</label>
              <input
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                readOnly={!editing}
              />
            </div>

            {editing && (
              <div className="profile-actions">
                <button className="btn primary" type="submit" disabled={loading}>
                  {loading ? "Saving..." : "Save"}
                </button>
                <button
                  className="btn"
                  type="button"
                  onClick={() => {
                    setEditing(false);
                    setForm({
                      name: user.name || "",
                      email: user.email || "",
                      phone: user.phone || ""
                    });
                  }}
                >
                  Cancel
                </button>
              </div>
            )}

            {message && <div className="profile-message">{message}</div>}
          </form>
        </div>
      </div>

      <div className="orders-section">
        <h3>Recent Orders</h3>
        {orders.length === 0 ? (
          <p>No previous orders found.</p>
        ) : (
          <ul className="orders-list">
            {orders.slice(0, 5).map((o) => (
              <li key={o._id} className="order-item">
                <div>
                  <strong>Order:</strong> {o._id.slice(-6)}
                </div>
                <div>
                  <strong>Total:</strong> ₹{o.totalPrice}
                </div>
                <div>
                  <strong>Items:</strong> {o.items?.length || 0}
                </div>
                <Link to={`/orders/${o._id}`}>View</Link>
              </li>
            ))}
          </ul>
        )}
        <div style={{ marginTop: 12 }}>
          <Link to="/orders" className="btn-link">
            See all orders
          </Link>
        </div>
      </div>
    </div>
  );
}
