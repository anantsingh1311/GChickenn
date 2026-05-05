import React, { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import AuthLayout from "./AuthLayout";
import { API_URL } from "../config";

const toastProps = {
  position: "top-center",
  autoClose: 2400,
  toastStyle: {
    background: "#0b4a37",
    color: "#f6edd2",
    border: "1px solid rgba(216, 180, 91, 0.28)"
  }
};

export default function ResetPassword({ params }) {
  const [password1, setPassword1] = useState("");
  const [password2, setPassword2] = useState("");
  const [loading, setLoading] = useState(false);
  const [redirectToLogin, setRedirectToLogin] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!password1 || !password2) {
      toast.error("Please fill in both password fields.", toastProps);
      return;
    }

    if (password1.length < 6) {
      toast.error("Password must be at least 6 characters long.", toastProps);
      return;
    }

    if (password1 !== password2) {
      toast.error("Passwords do not match.", toastProps);
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(`${API_URL}/api/reset-password/${params.token}`, {
        password: password1
      });

      toast.success(response.data.message || "Password reset successful.", toastProps);
      setPassword1("");
      setPassword2("");
      setRedirectToLogin(true);
    } catch (error) {
      toast.error(error.response?.data?.message || "Reset link is invalid or expired.", toastProps);
    } finally {
      setLoading(false);
    }
  };

  if (redirectToLogin) {
    return <Navigate to="/login" replace />;
  }

  return (
    <>
      <ToastContainer {...toastProps} />
      <AuthLayout
        eyebrow="Secure reset"
        title="Choose a new password"
        subtitle="Enter your new password below and then return to the login screen with your updated credentials."
        accentTitle="Keep access simple"
        accentCopy="The new experience keeps recovery focused and uncluttered so customers can finish quickly on mobile or desktop."
        footer={
          <p>
            Back to{" "}
            <Link to="/login" className="font-semibold text-brand-gold hover:text-white">
              login
            </Link>
          </p>
        }
      >
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="input-label" htmlFor="password1">
              New password
            </label>
            <input
              id="password1"
              type="password"
              value={password1}
              onChange={(event) => setPassword1(event.target.value)}
              className="input-field"
              placeholder="Enter new password"
              required
            />
          </div>

          <div>
            <label className="input-label" htmlFor="password2">
              Confirm new password
            </label>
            <input
              id="password2"
              type="password"
              value={password2}
              onChange={(event) => setPassword2(event.target.value)}
              className="input-field"
              placeholder="Re-enter new password"
              required
            />
          </div>

          <button type="submit" className="primary-button w-full" disabled={loading}>
            {loading ? "Resetting password..." : "Reset password"}
          </button>
        </form>
      </AuthLayout>
    </>
  );
}
