import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import AuthLayout from "./AuthLayout";
import { API_URL } from "../config";

const toastProps = {
  position: "top-center",
  autoClose: 2200,
  toastStyle: {
    background: "#0b4a37",
    color: "#f6edd2",
    border: "1px solid rgba(216, 180, 91, 0.28)"
  }
};

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.username || !form.password) {
      toast.error("Please fill in both fields.", toastProps);
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        `${API_URL}/api/login`,
        {
          username: form.username,
          password: form.password
        },
        { withCredentials: true }
      );

      const { user } = response.data;

      localStorage.setItem("user", JSON.stringify(user));
      toast.success(`Welcome back, ${user.username}.`, toastProps);

      setTimeout(() => {
        navigate(user.role?.toLowerCase() === "admin" ? "/admin" : "/");
      }, 900);
    } catch (error) {
      console.error(error);
      toast.error("Invalid username or password.", toastProps);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ToastContainer {...toastProps} />
      <AuthLayout
        eyebrow="Account access"
        title="Log in to your account"
        subtitle="Access ordering, saved customer details, and your premium buying experience in a few seconds."
        accentTitle="Fast repeat ordering"
        accentCopy="Once you are signed in, you can move from browsing to checkout with a much smoother flow on any device."
        footer={
          <p>
            Do not have an account yet?{" "}
            <Link to="/signup" className="font-semibold text-brand-gold hover:text-white">
              Create one now
            </Link>
          </p>
        }
      >
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="input-label" htmlFor="username">
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              value={form.username}
              onChange={handleChange}
              className="input-field"
              placeholder="Enter your username"
              required
            />
          </div>

          <div>
            <label className="input-label" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              className="input-field"
              placeholder="Enter your password"
              required
            />
          </div>

          <button type="submit" className="primary-button w-full" disabled={loading}>
            {loading ? "Logging in..." : "Log in"}
          </button>

          <Link
            to="/forgot-password"
            className="inline-flex text-sm font-medium text-brand-sand transition hover:text-white"
          >
            Need to reset your password?
          </Link>
        </form>
      </AuthLayout>
    </>
  );
}
