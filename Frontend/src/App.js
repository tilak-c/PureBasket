// src/App.js
import React, { useContext } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Products from './components/Products';
import Profile from './components/Profile';
import LoggedOutHome from './components/LoggedOutHome';
import { AuthContext } from './context/AuthContext';
import Cart from './components/Cart';
import Orders from "./components/Orders";
import OrderDetails from "./components/OrderDetails";

export default function App() {
  const { user } = useContext(AuthContext);

  return (
    <div>
      <Navbar />

      <Routes>
        <Route
          path="/"
          element={user ? <Products /> : <LoggedOutHome />}
        />

        <Route path="/items" element={<Products />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/orders/:id" element={<OrderDetails />} />

      </Routes>
    </div>
  );
}
