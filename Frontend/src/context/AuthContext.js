// src/context/AuthContext.js
import React, { createContext, useState } from 'react';
import * as api from '../api';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const s = localStorage.getItem('user');
      return s ? JSON.parse(s) : null;
    } catch (e) {
      return null;
    }
  });
  const [loading, setLoading] = useState(false);

  async function register({ name, email, password }) {
  setLoading(true);
  try {
    const res = await api.register({ name, email, password });
const normalizedUser = {
  id: res.user._id || res.user.id,
  name: res.user.name,
  email: res.user.email,
  phone: res.user.phone
};

localStorage.setItem("user", JSON.stringify(normalizedUser));
setUser(normalizedUser);

    return normalizedUser;
  } finally {
    setLoading(false);
  }
}

  async function login({ email, password }) {
  setLoading(true);
  try {
    const res = await api.login({ email, password });
const normalizedUser = {
  id: res.user._id || res.user.id,
  name: res.user.name,
  email: res.user.email,
  phone: res.user.phone
};

localStorage.setItem("user", JSON.stringify(normalizedUser));
setUser(normalizedUser);

    return normalizedUser;
  } finally {
    setLoading(false);
  }
}

  function logout() {
    localStorage.removeItem('user');
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
