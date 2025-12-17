import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { AuthContext } from './AuthContext';

export const CartContext = createContext();

const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:5001/api';

export function CartProvider({ children }) {
  const { user } = useContext(AuthContext); 
  const [count, setCount] = useState(0);

  const refreshCount = useCallback(async () => {
    if (!user?.id) {
      setCount(0);
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/cart/${user.id}/total`);
      const data = await res.json();
      setCount(data.totalItems || 0);
    } catch {
      setCount(0);
    }
  }, [user]);

  useEffect(() => {
    refreshCount();
  }, [refreshCount]);

  return (
    <CartContext.Provider value={{ count, setCount, refreshCount }}>
      {children}
    </CartContext.Provider>
  );
}
