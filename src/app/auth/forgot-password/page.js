"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  forgotPassword,
  verifyResetCode,
  resetPassword,
} from "@/services/authService";

export default function ForgotPasswordPage() {
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [resetCode, setResetCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [rePassword, setRePassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleSendCode(e) {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      setLoading(true);
      await forgotPassword(email);
      setMessage("Reset code sent to your email.");
      setStep(2);
    } catch (err) {
      setError(err.message || "Failed to send reset code");
    } finally {
      setLoading(false);
    }
  }

  async function handleVerifyCode(e) {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      setLoading(true);
      await verifyResetCode(resetCode);
      setMessage("Code verified. Set your new password.");
      setStep(3);
    } catch (err) {
      setError(err.message || "Invalid reset code");
    } finally {
      setLoading(false);
    }
  }

  async function handleResetPassword(e) {
    e.preventDefault();
    setError("");
    setMessage("");

    if (newPassword !== rePassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      await resetPassword(email, newPassword);
      router.push("/auth/login");
    } catch (err) {
      setError(err.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen d-flex align-items-center justify-content-center bg-light">
      <div className="card border-0 shadow-sm" style={{ width: "420px" }}>
        <div className="card-header text-center bg-white border-0 py-4">
          <h3 className="fw-bold">Forgot Password</h3>
          <p className="text-muted mb-0">Step {step} of 3</p>
        </div>

        <div className="card-body px-4 pb-4">
          {error && <div className="alert alert-danger py-2">{error}</div>}
          {message && (
            <div className="alert alert-success py-2">{message}</div>
          )}

          {step === 1 && (
            <form onSubmit={handleSendCode}>
              <label className="form-label fw-semibold">Email</label>
              <input
                type="email"
                className="form-control mb-3"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <button
                type="submit"
                disabled={loading}
                className="btn w-100 fw-bold"
                style={{ backgroundColor: "#F5C518", color: "#111827" }}
              >
                {loading ? "Sending..." : "Send Reset Code"}
              </button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleVerifyCode}>
              <label className="form-label fw-semibold">Reset Code</label>
              <input
                type="text"
                className="form-control mb-3"
                value={resetCode}
                onChange={(e) => setResetCode(e.target.value)}
                required
              />

              <button
                type="submit"
                disabled={loading}
                className="btn w-100 fw-bold"
                style={{ backgroundColor: "#F5C518", color: "#111827" }}
              >
                {loading ? "Verifying..." : "Verify Code"}
              </button>
            </form>
          )}

          {step === 3 && (
            <form onSubmit={handleResetPassword}>
              <label className="form-label fw-semibold">New Password</label>
              <input
                type="password"
                className="form-control mb-3"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />

              <label className="form-label fw-semibold">Confirm Password</label>
              <input
                type="password"
                className="form-control mb-3"
                value={rePassword}
                onChange={(e) => setRePassword(e.target.value)}
                required
              />

              <button
                type="submit"
                disabled={loading}
                className="btn w-100 fw-bold"
                style={{ backgroundColor: "#F5C518", color: "#111827" }}
              >
                {loading ? "Resetting..." : "Reset Password"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
