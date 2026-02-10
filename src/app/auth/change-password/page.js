"use client";

import { useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";
import { changePassword } from "@/services/authService";

export default function ChangePasswordPage() {
  const { user, login } = useAuth();

  const [formData, setFormData] = useState({
    currentPassword: "",
    password: "",
    rePassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function handleChange(e) {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (formData.password !== formData.rePassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      const result = await changePassword(formData);

      if (result?.token && user) {
        login(user, result.token);
      }

      setSuccess("Password updated successfully.");
      setFormData({
        currentPassword: "",
        password: "",
        rePassword: "",
      });
    } catch (err) {
      setError(err.message || "Failed to change password");
    } finally {
      setLoading(false);
    }
  }

  return (
    <ProtectedRoute>
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-white py-3">
                <h4 className="mb-0 fw-bold">Change Password</h4>
              </div>

              <div className="card-body">
                {error && (
                  <div className="alert alert-danger py-2">{error}</div>
                )}
                {success && (
                  <div className="alert alert-success py-2">{success}</div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">
                      Current Password
                    </label>
                    <input
                      type="password"
                      name="currentPassword"
                      className="form-control"
                      value={formData.currentPassword}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold">
                      New Password
                    </label>
                    <input
                      type="password"
                      name="password"
                      className="form-control"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <label className="form-label fw-semibold">
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      name="rePassword"
                      className="form-control"
                      value={formData.rePassword}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="btn fw-bold"
                    style={{ backgroundColor: "#F5C518", color: "#111827" }}
                  >
                    {loading ? "Updating..." : "Update Password"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
