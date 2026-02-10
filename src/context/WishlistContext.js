"use client";

import { createContext, useContext, useEffect, useState } from "react";
import {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
} from "@/services/wishlistService";

const WishlistContext = createContext();

export function WishlistProvider({ children }) {
  const [wishlistIds, setWishlistIds] = useState([]);

  async function loadWishlist() {
    const token = localStorage.getItem("token");

    if (!token) {
      setWishlistIds([]);
      return;
    }

    try {
      const ids = await getWishlist();
      setWishlistIds(Array.isArray(ids) ? ids : []);
    } catch {
      setWishlistIds([]);
    }
  }

  useEffect(() => {
    loadWishlist();
  }, []);

  async function toggleWishlist(productId) {
    const token = localStorage.getItem("token");

    if (!token) {
      window.location.href = "/auth/login";
      return;
    }

    try {
      if (wishlistIds.includes(productId)) {
        await removeFromWishlist(productId);
        setWishlistIds((prev) =>
          prev.filter((id) => id !== productId)
        );
      } else {
        await addToWishlist(productId);
        setWishlistIds((prev) => [...prev, productId]);
      }
    } catch {
      // Keep current UI state if API action fails.
    }
  }

  function resetWishlist() {
    setWishlistIds([]);
  }

  return (
    <WishlistContext.Provider
      value={{
        wishlistIds,
        toggleWishlist,
        loadWishlist,
        resetWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  return useContext(WishlistContext);
}
