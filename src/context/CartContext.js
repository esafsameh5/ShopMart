"use client";

import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartCount, setCartCount] = useState(0);

  async function refreshCart() {
    const token = localStorage.getItem("token");

    if (!token) {
      setCartCount(0);
      return;
    }

    try {
      const res = await fetch(
        "https://ecommerce.routemisr.com/api/v1/cart",
        {
          headers: { token },
        }
      );

      if (!res.ok) {
        setCartCount(0);
        return;
      }

      const data = await res.json();
      setCartCount(data?.numOfCartItems || 0);
    } catch {
      setCartCount(0);
    }
  }

  function updateCartCount(newCount) {
    setCartCount(newCount);
  }

  function resetCart() {
    setCartCount(0);
  }

  useEffect(() => {
    refreshCart();
  }, []);

  return (
    <CartContext.Provider
      value={{
        cartCount,
        refreshCart,
        updateCartCount,
        resetCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
