"use client";

import { createContext, useContext, useState } from "react";

const LoadingContext = createContext();

export function LoadingProvider({ children }) {
  const [loading, setLoading] = useState(false);

  function showLoader() {
    setLoading(true);
  }

  function hideLoader() {
    setLoading(false);
  }

  return (
    <LoadingContext.Provider
      value={{ loading, showLoader, hideLoader }}
    >
      {children}
    </LoadingContext.Provider>
  );
}

export function useLoading() {
  return useContext(LoadingContext);
}
