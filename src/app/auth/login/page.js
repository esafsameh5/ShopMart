"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { loginUser } from "@/services/authService";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }

  function validateForm() {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setApiError("");

    if (!validateForm()) return;

    try {
      setLoading(true);
      const res = await loginUser(formData);
      login(res.user, res.token);
      router.push("/");
    } catch {
      setApiError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="container py-4 py-lg-5">
        <div className="auth-shell row g-0 overflow-hidden">
          <div className="col-lg-5 d-none d-lg-flex auth-aside">
            <div>
              <span className="auth-badge">ShopMart Access</span>
              <h2 className="auth-aside-title mt-3">Welcome Back</h2>
              <p className="auth-aside-text mb-4">
                Sign in to manage your wishlist, track your orders, and continue shopping with faster checkout.
              </p>

              <ul className="auth-feature-list">
                <li>Fast and secure checkout</li>
                <li>Track orders in one place</li>
                <li>Save favorites to wishlist</li>
              </ul>
            </div>
          </div>

          <div className="col-lg-7">
            <div className="auth-card-wrap">
              <h3 className="auth-title mb-1">Login to your account</h3>
              <p className="auth-subtitle mb-4">Use your email and password to continue.</p>

              {apiError && (
                <div className="alert alert-danger py-2 mb-3">{apiError}</div>
              )}

              <form onSubmit={handleSubmit} noValidate>
                <div className="mb-3">
                  <label className="form-label fw-semibold text-black">Email</label>
                  <div className="auth-input-wrap">
                    <i className="bi bi-envelope"></i>
                    <input
                      type="email"
                      name="email"
                      className="form-control auth-input"
                      placeholder="e.g. ahmed@email.com"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>
                  {errors.email && (
                    <small className="text-danger d-block mt-1">{errors.email}</small>
                  )}
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold text-black">Password</label>
                  <div className="auth-input-wrap">
                    <i className="bi bi-lock"></i>
                    <input
                      type="password"
                      name="password"
                      className="form-control auth-input"
                      placeholder="Your password"
                      value={formData.password}
                      onChange={handleChange}
                    />
                  </div>
                  {errors.password && (
                    <small className="text-danger d-block mt-1">{errors.password}</small>
                  )}

                  <div className="text-end mt-2">
                    <Link href="/auth/forgot-password" className="auth-link">
                      Forgot password?
                    </Link>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn w-100 auth-submit-btn fw-bold"
                >
                  {loading ? "Logging in..." : "Login"}
                </button>
              </form>

              <p className="mb-0 mt-4 auth-subtitle text-center">
                Don&apos;t have an account?{" "}
                <Link href="/auth/register" className="auth-link fw-semibold">
                  Create one
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
