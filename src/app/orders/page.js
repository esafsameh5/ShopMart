"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";
import { useLoading } from "@/context/LoadingContext";
import { getUserIdFromAuth, getUserOrders } from "@/services/orderService";

export default function OrdersPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, token } = useAuth();
  const { showLoader, hideLoader } = useLoading();

  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");

  const justPlaced = searchParams.get("placed") === "1";
  const paymentMethod = searchParams.get("method");

  // Derive user id once from auth state to avoid repeated parsing.
  const userId = useMemo(() => getUserIdFromAuth(user, token), [user, token]);

  useEffect(() => {
    async function fetchOrders() {
      if (!userId) return;

      showLoader();
      setError("");

      try {
        const data = await getUserOrders(userId);
        setOrders(Array.isArray(data) ? data : []);
      } catch {
        setError("Failed to load your orders");
      } finally {
        hideLoader();
      }
    }

    fetchOrders();
  }, [userId]);

  return (
    <ProtectedRoute>
      <div className="container py-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="mb-0">Orders</h2>
          <button
            className="btn btn-outline-dark btn-sm"
            onClick={() => router.push("/products")}
          >
            Continue Shopping
          </button>
        </div>

        {justPlaced && (
          <div className="alert alert-success">
            Order placed successfully via{" "}
            <strong>{paymentMethod === "cash" ? "Cash" : "Online"}</strong>.
          </div>
        )}

        {error && <div className="alert alert-danger">{error}</div>}

        {orders.length === 0 ? (
          <div className="card shadow-sm border-0">
            <div className="card-body py-5 text-center">
              <h5 className="mb-2">No orders yet</h5>
              <p className="text-muted mb-3">
                Your order history will appear here after checkout.
              </p>
              <button
                className="btn btn-warning"
                onClick={() => router.push("/products")}
              >
                Start Shopping
              </button>
            </div>
          </div>
        ) : (
          <div className="row g-3">
            {orders.map((order) => (
              <div key={order._id} className="col-12">
                <div className="card border-0 shadow-sm">
                  <div className="card-body">
                    <div className="d-flex flex-wrap justify-content-between gap-2 mb-2">
                      <div>
                        <h6 className="mb-1">Order #{order.id || order._id}</h6>
                        <small className="text-muted">
                          {order.createdAt
                            ? new Date(order.createdAt).toLocaleString()
                            : "-"}
                        </small>
                      </div>

                      <div className="d-flex gap-2">
                        <span
                          className={`badge ${
                            order.isPaid ? "text-bg-success" : "text-bg-secondary"
                          }`}
                        >
                          {order.isPaid ? "Paid" : "Not Paid"}
                        </span>
                        <span
                          className={`badge ${
                            order.isDelivered ? "text-bg-success" : "text-bg-warning"
                          }`}
                        >
                          {order.isDelivered ? "Delivered" : "In Delivery"}
                        </span>
                      </div>
                    </div>

                    <div className="row g-3">
                      <div className="col-md-4">
                        <small className="text-muted d-block">Payment</small>
                        <strong>{order.paymentMethodType || "-"}</strong>
                      </div>

                      <div className="col-md-4">
                        <small className="text-muted d-block">Total Price</small>
                        <strong>{order.totalOrderPrice || 0} EGP</strong>
                      </div>

                      <div className="col-md-4">
                        <small className="text-muted d-block">Items</small>
                        <strong>{order.cartItems?.length || 0}</strong>
                      </div>
                    </div>

                    <hr />

                    <small className="text-muted d-block">Shipping Address</small>
                    <p className="mb-0">
                      {order.shippingAddress?.details || "-"}
                      {order.shippingAddress?.city
                        ? `, ${order.shippingAddress.city}`
                        : ""}
                      {order.shippingAddress?.phone
                        ? ` - ${order.shippingAddress.phone}`
                        : ""}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
