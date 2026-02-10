"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

const LoadingContext = createContext();

export function LoadingProvider({ children }) {
  const [pendingCount, setPendingCount] = useState(0);
  const loading = pendingCount > 0;

  const showLoader = useCallback(() => {
    setPendingCount((count) => count + 1);
  }, []);

  const hideLoader = useCallback(() => {
    setPendingCount((count) => Math.max(0, count - 1));
  }, []);

  const value = useMemo(
    () => ({ loading, showLoader, hideLoader }),
    [loading, showLoader, hideLoader]
  );

  return (
    <LoadingContext.Provider value={value}>
      {children}
    </LoadingContext.Provider>
  );
}

export function useLoading() {
  return useContext(LoadingContext);
}
