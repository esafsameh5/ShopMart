"use client";

import { useLoading } from "@/context/LoadingContext";

export default function GlobalLoader() {
  const { loading } = useLoading();

  if (!loading) return null;

  return (
    <div
      className="d-flex flex-column justify-content-center align-items-center"
      style={{
        position: "fixed",
        inset: 0,
        background: "linear-gradient(135deg, #020617, #0f172a)",
        zIndex: 9999,
        color: "#fff",
      }}
    >
      <h1
        className="fw-bold mb-4"
        style={{ color: "#F5C518", letterSpacing: "1px" }}
      >
        ShopMart
      </h1>

      <div className="spinner-border text-warning"></div>
    </div>
  );
}
