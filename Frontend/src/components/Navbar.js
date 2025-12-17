import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import AnimatedCartBadge from './AnimatedCartBadge';  // ← ADD THIS
import '../styles/Navbar.css';

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const { count } = useContext(CartContext);

  return (
    <nav className="navbar" role="navigation" aria-label="Main navigation">
      <div className="navbar-left">
        <Link to="/" className="navbar-logo-link" aria-label="PureBasket home">
          <span className="navbar-title">PureBasket</span>
        </Link>
      </div>


      <div className="navbar-right" style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 12 }}>
        {user ? (
          <>
            <Link className="navbar-link" to="/profile">
              Hi, {user.name}
            </Link>

            <Link className="navbar-link cart-link cart-wrapper" to="/cart">
              Cart
              <AnimatedCartBadge count={count} />
            </Link>


            <button className="navbar-button" onClick={logout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link className="navbar-link" to="/login">Login</Link>
            <Link className="navbar-link" to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}
