"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import { getCart } from "@/services/cartService";
import {
  createCashOrder,
  createOnlineCheckoutSession,
} from "@/services/orderService";
import { useCart } from "@/context/CartContext";
import { useLoading } from "@/context/LoadingContext";

export default function AddressPage() {
  const router = useRouter();
  const { refreshCart, resetCart } = useCart();
  const { showLoader, hideLoader } = useLoading();

  const [cart, setCart] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    details: "",
    phone: "",
    city: "",
  });

  useEffect(() => {
    async function fetchCartData() {
      showLoader();
      try {
        const data = await getCart();
        setCart(data);
      } catch {
        setCart(null);
      } finally {
        hideLoader();
      }
    }

    fetchCartData();
  }, []);

  function handleChange(e) {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }

  function validate() {
    if (!formData.details.trim()) return "Address details are required";
    if (!formData.city.trim()) return "City is required";
    if (!formData.phone.trim()) return "Phone is required";
    if (!/^01\d{9}$/.test(formData.phone.trim())) {
      return "Phone must be a valid Egyptian number";
    }
    return "";
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    const cartId = cart?.cartId || cart?.data?._id;
    if (!cartId) {
      setError("Your cart is empty");
      return;
    }

    try {
      setSubmitting(true);

      if (paymentMethod === "cash") {
        await createCashOrder(cartId, formData);
        await refreshCart();
        resetCart();
        router.push("/orders?placed=1&method=cash");
        return;
      }

      const returnUrl = `${window.location.origin}`;
      const session = await createOnlineCheckoutSession(
        cartId,
        formData,
        returnUrl
      );

      const sessionUrl = session?.session?.url;
      if (!sessionUrl) {
        throw new Error("Payment session URL is missing");
      }

      window.location.href = sessionUrl;
    } catch (err) {
      setError(err.message || "Failed to complete checkout");
    } finally {
      setSubmitting(false);
    }
  }

  const itemsCount = cart?.numOfCartItems || 0;
  const totalPrice = cart?.data?.totalCartPrice || 0;

  return (
    <ProtectedRoute>
      <div className="container py-4">
        <h2 className="mb-4">Shipping Address & Payment</h2>

        {!cart || itemsCount === 0 ? (
          <div className="card shadow-sm">
            <div className="card-body py-4 text-center">
              <h5 className="mb-2">Your cart is empty</h5>
              <button
                className="btn btn-warning"
                onClick={() => router.push("/products")}
              >
                Go to Products
              </button>
            </div>
          </div>
        ) : (
          <div className="row g-4">
            <div className="col-lg-8">
              <div className="card shadow-sm border-0">
                <div className="card-body p-4">
                  <form onSubmit={handleSubmit}>
                    {error && (
                      <div className="alert alert-danger py-2 mb-3">
                        {error}
                      </div>
                    )}

                    <div className="mb-3">
                      <label className="form-label fw-semibold">
                        Address Details
                      </label>
                      <textarea
                        name="details"
                        className="form-control"
                        rows={3}
                        value={formData.details}
                        onChange={handleChange}
                        placeholder="Building, street, floor, apartment"
                      />
                    </div>

                    <div className="row g-3 mb-3">
                      <div className="col-md-6">
                        <label className="form-label fw-semibold">City</label>
                        <input
                          name="city"
                          className="form-control"
                          value={formData.city}
                          onChange={handleChange}
                          placeholder="Cairo"
                        />
                      </div>

                      <div className="col-md-6">
                        <label className="form-label fw-semibold">Phone</label>
                        <input
                          name="phone"
                          className="form-control"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="01XXXXXXXXX"
                        />
                      </div>
                    </div>

                    <div className="mb-4">
                      <label className="form-label fw-semibold d-block">
                        Payment Method
                      </label>

                      <div className="form-check mb-2">
                        <input
                          className="form-check-input"
                          type="radio"
                          id="cashMethod"
                          name="payment"
                          checked={paymentMethod === "cash"}
                          onChange={() => setPaymentMethod("cash")}
                        />
                        <label className="form-check-label" htmlFor="cashMethod">
                          Cash on Delivery
                        </label>
                      </div>

                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          id="onlineMethod"
                          name="payment"
                          checked={paymentMethod === "online"}
                          onChange={() => setPaymentMethod("online")}
                        />
                        <label className="form-check-label" htmlFor="onlineMethod">
                          Online Payment (Card)
                        </label>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={submitting}
                      className="btn btn-warning fw-bold"
                    >
                      {submitting
                        ? "Processing..."
                        : paymentMethod === "cash"
                        ? "Place Cash Order"
                        : "Continue to Online Payment"}
                    </button>
                  </form>
                </div>
              </div>
            </div>

            <div className="col-lg-4">
              <div className="card shadow-sm border-0">
                <div className="card-body p-4">
                  <h5 className="mb-3">Order Summary</h5>
                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-muted">Items</span>
                    <span className="fw-semibold">{itemsCount}</span>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span className="text-muted">Total</span>
                    <span className="fw-bold text-success">{totalPrice} EGP</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
