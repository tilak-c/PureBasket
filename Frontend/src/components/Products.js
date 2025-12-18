import Swal from 'sweetalert2';
import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import '../styles/Products.css';
const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:5001/api';

const FALLBACK_IMAGE = '/mnt/data/85de1d0a-9e6d-4506-9a03-c5b9c21c30ce.png';

export default function Products() {
  const { user } = useContext(AuthContext);
  const { refreshCount } = useContext(CartContext);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addingId, setAddingId] = useState(null); 

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts(q = '') {
    setLoading(true);
    try {
      const url = q ? `${API_BASE}/products?q=${encodeURIComponent(q)}` : `${API_BASE}/products`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to load products');
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('fetchProducts error', err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }

  async function handleAddToCart(productId) {
    if (!user) {
      Swal.fire({
        icon: "error",
        title: "Something went wrong!",
        text: "Please login to add items to cart",
        confirmButtonColor: "#0a4a7b"
      });
            return;
      }

    try {
      setAddingId(productId);
      const res = await fetch(`${API_BASE}/cart/${user.id}/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId,
          quantity: 1
        })
      });

      const text = await res.text();
      let data;
      try { data = text ? JSON.parse(text) : null; }
      catch (e) {
        console.error('Non-JSON add-to-cart response:', text);
        throw new Error('Server returned non-JSON response. See console for details.');
      }

      if (!res.ok) {
        throw new Error(data?.message || 'Failed to add to cart');
      }
 Swal.fire({
    icon: "success",
    title: "Success!",
    text: "Added to cart",
    confirmButtonColor: "#0a4a7b"
  });

      if (typeof refreshCount === 'function') {
        try { await refreshCount(); } catch (e) { console.warn('refreshCount failed', e); }
      }

    } catch (err) {
      console.error('addToCart error:', err);
      Swal.fire({
  icon: "error",
  title: "Something went wrong!",
  text: `${err.message}||"Could not add to cart"`,
  confirmButtonColor: "#0a4a7b"
});
    } finally {
      setAddingId(null);
    }
  }

  if (loading) {
    return <div className="products-wrap"><div className="loader">Loading products…</div></div>;
  }

  if (!products.length) {
    return (
      <div className="products-wrap">
        <div className="products-empty">No products found</div>
      </div>
    );
  }

  return (
    <div className="products-wrap">
      <div className="products-grid">
        {products.map(p => (
          <div className="product-card" key={p._id || p.id || p.name}>
            <div className="product-image-wrap">
              <img
                src={p.imageUrl || FALLBACK_IMAGE}
                alt={p.name}
                onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = FALLBACK_IMAGE; }}
                className="product-image"
              />
            </div>

            <div className="product-body">
              <div className="product-name">{p.name}</div>
              <div className="product-price">₹ {Number(p.price).toLocaleString()}</div>
            </div>

            <div className="product-actions">
              <button
                className="add-btn"
                onClick={() => handleAddToCart(p._id || p.id)}
                disabled={addingId === (p._id || p.id)}
                type="button"
              >
                {addingId === (p._id || p.id) ? 'Adding…' : 'Add to cart'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
