import Swal from "sweetalert2";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { CartContext } from "../context/CartContext";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Cart.css";

const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:5001/api";
const EMPTY_CART_IMG =
  "https://static.vecteezy.com/system/resources/thumbnails/005/006/007/small/no-item-in-the-shopping-cart-click-to-go-shopping-now-concept-illustration-flat-design-eps10-modern-graphic-element-for-landing-page-empty-state-ui-infographic-icon-vector.jpg";

export default function Cart() {
  const { user } = useContext(AuthContext);
  const { refreshCount } = useContext(CartContext);
  const navigate = useNavigate();

  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [savingItemId, setSavingItemId] = useState(null);
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  useEffect(() => {
    if (user) fetchCart();
    else {
      setCart(null);
      setLoading(false);
    }
  }, [user]);

  async function fetchCart() {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/cart/${user.id}`);
      if (!res.ok) throw new Error("Failed to load cart");
      const data = await res.json();
      setCart(data);
    } catch (err) {
      console.error("fetchCart error", err);
      setCart(null);
    } finally {
      setLoading(false);
    }
  }

  function computeTotals() {
    if (!cart || !cart.items) return { subtotal: 0, itemCount: 0 };
    let subtotal = 0;
    let count = 0;
    for (const it of cart.items) {
      subtotal += Number(it.price || 0) * Number(it.quantity || 0);
      count += Number(it.quantity || 0);
    }
    return { subtotal, itemCount: count };
  }

  async function changeQty(itemId, qty) {
    if (!user) {
      Swal.fire({
        icon: "error",
        title: "Oops!",
        text: "Please login",
        confirmButtonColor: "#0a4a7b"
      });
      return;
    }
    if (qty < 1) return;

    setSavingItemId(itemId);
    try {
      const res = await fetch(`${API_BASE}/cart/${user.id}/update`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemId, quantity: qty }),
      });

      const text = await res.text();
      let body;
      try {
        body = text ? JSON.parse(text) : null;
      } catch {
        console.error("UpdateQty returned non-JSON:", text);
        throw new Error("Server returned invalid JSON.");
      }

      if (!res.ok) throw new Error(body?.message || "Failed to update qty");

      setCart(body);

      await refreshCount();
    } catch (err) {
      console.error("changeQty error", err);
      Swal.fire({
  icon: "error",
  title: "Something went wrong!",
  text: `${err.message}||"Could not update quantity"`,
  confirmButtonColor: "#0a4a7b"
});
    } finally {
      setSavingItemId(null);
    }
  }

  async function removeItem(itemId) {
    if (!user) {
      Swal.fire({
  icon: "error",
  title: "Something went wrong!",
  text: "Please login",
  confirmButtonColor: "#0a4a7b"
});
    }
  const confirmed = await Swal.fire({
  title: "Remove this item?",
  text: "This cannot be undone.",
  icon: "warning",
  showCancelButton: true,
  confirmButtonText: "Remove",
  cancelButtonText: "Cancel",
  confirmButtonColor: "#0a4a7b",
  cancelButtonColor: "#b5d9f7"
});

if (!confirmed.isConfirmed) return;


    try {
      const res = await fetch(
        `${API_BASE}/cart/${user.id}/remove/${itemId}`,
        { method: "DELETE" }
      );

      const text = await res.text();
      let body;
      try {
        body = text ? JSON.parse(text) : null;
      } catch {
        console.error("Remove returned non-JSON:", text);
        throw new Error("Server returned invalid JSON");
      }

      if (!res.ok) throw new Error(body?.message || "Failed to remove item");

      setCart(body);
      await refreshCount();
    } catch (err) {
      console.error("removeItem error:", err);
      Swal.fire({
  icon: "error",
  title: "Something went wrong!",
  text: `${err.message}`,
  confirmButtonColor: "#0a4a7b"
});
    }
  }

  async function clearCart() {
    if (!user){
      Swal.fire({
  icon: "warning",
  title: "Please login",
  confirmButtonColor: "#0a4a7b",
});
    }
    const confirmed = await Swal.fire({
  title: "Clear entire cart?",
  text: "This cannot be undone.",
  icon: "warning",
  showCancelButton: true,
  confirmButtonText: "Remove",
  cancelButtonText: "Cancel",
  confirmButtonColor: "#0a4a7b",
  cancelButtonColor: "#b5d9f7"
});

if (!confirmed.isConfirmed) return;


    try {
      const res = await fetch(`${API_BASE}/cart/${user.id}/clear`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Failed to clear cart");

      setCart({ items: [] });
      await refreshCount();
    } catch (err) {
      console.error("clearCart error", err);
        Swal.fire({
  icon: "error",
  title: "Something went wrong!",
  text: `${err.message}`,
  confirmButtonColor: "#0a4a7b"
});
    }
  }


  async function checkout() {
    if (!user) return navigate("/login");
    if (!cart.items || cart.items.length === 0)
    return Swal.fire({
  icon: "error",
  title: "Your cart is empty",
  text: "Add some items before checking out!",
  confirmButtonColor: "#0a4a7b",
});
      const confirmed = await Swal.fire({
  title: "Place the order?",
  text: "This cannot be undone.",
  icon: "warning",
  showCancelButton: true,
  confirmButtonText: "Place Order",
  cancelButtonText: "Cancel",
  confirmButtonColor: "#0a4a7b",
  cancelButtonColor: "#b5d9f7"
});

if (!confirmed.isConfirmed) return;

    setCheckoutLoading(true);
    try {
      const res = await fetch(
        `${API_BASE}/orders/${user.id}/create-from-cart`,
        { method: "POST" }
      );

      const text = await res.text();
      let body;
      try {
        body = JSON.parse(text);
      } catch {
        console.error("Checkout returned non-JSON:", text);
        throw new Error("Invalid response from server");
      }

      if (!res.ok) throw new Error(body?.message || "Checkout failed");

      Swal.fire({
    icon: "success",
    title: "Success!",
    text: "Order placed!",
    confirmButtonColor: "#0a4a7b"
  });
      await refreshCount();
      navigate("/orders");
    } catch (err) {
      console.error("checkout error", err);
      Swal.fire({
  icon: "error",
  title: "Something went wrong!",
  text: `${err.message}`,
  confirmButtonColor: "#0a4a7b"
});
    } finally {
      setCheckoutLoading(false);
      fetchCart();
    }
  }


  if (loading) {
    return (
      <div className="cart-wrap">
        <div className="cart-empty">Loading cart…</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="cart-wrap">
        <div className="cart-empty">
          <h3>Please login to view your cart</h3>
          <Link to="/login"><button className="cart-cta">Login</button></Link>
        </div>
      </div>
    );
  }

  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <div className="cart-wrap">
        <div className="cart-empty">
          <img src={EMPTY_CART_IMG} alt="empty cart" className="cart-empty-img" />
          <h3>Your cart is empty</h3>
          <Link to="/items"><button className="cart-cta">Shop items</button></Link>
        </div>
      </div>
    );
  }

  const { subtotal, itemCount } = computeTotals();

  return (
    <div className="cart-wrap">
      <div className="cart-inner">
        <div className="cart-items">
          <h2>Your Cart ({itemCount} items)</h2>

          {cart.items.map((it) => (
            <div className="cart-item" key={it._id}>
              <div className="cart-item-left">
                <img
                  src={it.imageUrl || EMPTY_CART_IMG}
                  alt={it.name}
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = EMPTY_CART_IMG;
                  }}
                />
              </div>

              <div className="cart-item-body">
                <div className="cart-item-name">{it.name}</div>
                <div className="cart-item-price">
                  ₹ {Number(it.price).toLocaleString()}
                </div>

                <div className="cart-item-controls">
                  <button
                    className="qty-btn"
                    onClick={() => changeQty(it._id, it.quantity - 1)}
                    disabled={savingItemId === it._id || it.quantity <= 1}
                  >
                    -
                  </button>

                  <div className="qty-display">{it.quantity}</div>

                  <button
                    className="qty-btn"
                    onClick={() => changeQty(it._id, it.quantity + 1)}
                    disabled={savingItemId === it._id}
                  >
                    +
                  </button>

                  <button
                    className="remove-btn"
                    onClick={() => removeItem(it._id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}

          <button className="clear-btn" onClick={clearCart}>
            Clear cart
          </button>
        </div>

        {/* Summary */}
        <aside className="cart-summary">
          <h3>Order Summary</h3>
          <div className="summary-row">
            <span>Items</span>
            <span>{itemCount}</span>
          </div>
          <div className="summary-row">
            <span>Subtotal</span>
            <span>₹ {subtotal.toLocaleString()}</span>
          </div>

          <button
            className="checkout-btn"
            onClick={checkout}
            disabled={checkoutLoading}
          >
            {checkoutLoading ? "Placing order…" : "Checkout"}
          </button>
        </aside>
      </div>
    </div>
  );
}
