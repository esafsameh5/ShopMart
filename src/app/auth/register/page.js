"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { registerUser } from "@/services/authService";

export default function RegisterPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    rePassword: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  function handleChange(e) {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }

  function validateForm() {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/.test(formData.password)) {
      newErrors.password = "Password must contain uppercase, lowercase, and a number";
    }

    if (formData.rePassword !== formData.password) {
      newErrors.rePassword = "Passwords do not match";
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
      await registerUser(formData);
      router.push("/auth/login");
    } catch (err) {
      setApiError(err.message);
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
              <span className="auth-badge">Join ShopMart</span>
              <h2 className="auth-aside-title mt-3">Create Account</h2>
              <p className="auth-aside-text mb-4">
                Create your account to unlock offers, save products, and enjoy a smoother shopping experience.
              </p>

              <ul className="auth-feature-list">
                <li>Exclusive member offers</li>
                <li>Saved carts and favorites</li>
                <li>Faster order tracking</li>
              </ul>
            </div>
          </div>

          <div className="col-lg-7">
            <div className="auth-card-wrap">
              <h3 className="auth-title mb-1">Start your account</h3>
              <p className="auth-subtitle mb-4">Fill in the details below to register.</p>

              {apiError && (
                <div className="alert alert-danger py-2 mb-3">{apiError}</div>
              )}

              <form onSubmit={handleSubmit} noValidate>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Name</label>
                  <div className="auth-input-wrap">
                    <i className="bi bi-person"></i>
                    <input
                      type="text"
                      name="name"
                      className="form-control auth-input"
                      placeholder="e.g. Ahmed Mohamed"
                      value={formData.name}
                      onChange={handleChange}
                    />
                  </div>
                  {errors.name && (
                    <small className="text-danger d-block mt-1">{errors.name}</small>
                  )}
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">Email</label>
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
                  <label className="form-label fw-semibold">Password</label>
                  <div className="auth-input-wrap">
                    <i className="bi bi-shield-lock"></i>
                    <input
                      type="password"
                      name="password"
                      className="form-control auth-input"
                      placeholder="At least 6 chars, A-Z, a-z, 0-9"
                      value={formData.password}
                      onChange={handleChange}
                    />
                  </div>
                  {errors.password && (
                    <small className="text-danger d-block mt-1">{errors.password}</small>
                  )}
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">Confirm Password</label>
                  <div className="auth-input-wrap">
                    <i className="bi bi-lock"></i>
                    <input
                      type="password"
                      name="rePassword"
                      className="form-control auth-input"
                      placeholder="Repeat your password"
                      value={formData.rePassword}
                      onChange={handleChange}
                    />
                  </div>
                  {errors.rePassword && (
                    <small className="text-danger d-block mt-1">{errors.rePassword}</small>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn w-100 auth-submit-btn fw-bold"
                >
                  {loading ? "Creating account..." : "Register"}
                </button>
              </form>

              <p className="mb-0 mt-4 auth-subtitle text-center">
                Already have an account?{" "}
                <Link href="/auth/login" className="auth-link fw-semibold">
                  Login
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
