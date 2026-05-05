import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import AuthLayout from "./AuthLayout";
import { API_URL } from "../config";

const toastProps = {
  position: "top-center",
  autoClose: 3200,
  toastStyle: {
    background: "#0b4a37",
    color: "#f6edd2",
    border: "1px solid rgba(216, 180, 91, 0.28)"
  }
};

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!email.trim()) {
      toast.error("Please enter your email address.", toastProps);
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(`${API_URL}/api/forgot-password`, {
        email
      });

      if (!response.data.emailSent) {
        toast.warning("Email could not be sent automatically.", toastProps);
        toast.warning(
          <span>
            Use this reset link instead:{" "}
            <a
              href={response.data.resetUrl}
              className="font-semibold underline"
              target="_blank"
              rel="noreferrer"
            >
              open reset link
            </a>
          </span>,
          { ...toastProps, autoClose: 6500 }
        );
      } else {
        toast.success("Reset email sent successfully.", toastProps);
      }

      setEmail("");
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong.", toastProps);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ToastContainer {...toastProps} />
      <AuthLayout
        eyebrow="Password recovery"
        title="Reset your password"
        subtitle="Enter the email linked to your account and we will send you a secure reset path."
        accentTitle="Support when you need it"
        accentCopy="If email delivery is delayed, the recovery flow still provides a direct link so you are not blocked."
        footer={
          <p>
            Remembered it?{" "}
            <Link to="/login" className="font-semibold text-brand-gold hover:text-white">
              Back to login
            </Link>
          </p>
        }
      >
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="input-label" htmlFor="email">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="input-field"
              placeholder="Enter your registered email"
              required
            />
          </div>

          <button type="submit" className="primary-button w-full" disabled={loading}>
            {loading ? "Sending link..." : "Send reset link"}
          </button>
        </form>
      </AuthLayout>
    </>
  );
}
