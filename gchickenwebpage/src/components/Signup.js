import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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

const initialForm = {
  username: "",
  firstname: "",
  lastname: "",
  firmname: "",
  mobile: "",
  email: "",
  password: "",
  passwordCheck: ""
};

function validateUsername(username) {
  return /^[A-Za-z0-9]+$/.test(username);
}

function validatePassword(password) {
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/.test(password);
}

export default function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateUsername(form.username)) {
      toast.error("Username can contain only letters and numbers.", toastProps);
      return;
    }

    if (!validatePassword(form.password)) {
      toast.error(
        "Password must be at least 8 characters and include upper, lower, number, and special character.",
        toastProps
      );
      return;
    }

    if (form.password !== form.passwordCheck) {
      toast.error("Passwords do not match.", toastProps);
      return;
    }

    try {
      setLoading(true);

      await axios.post(`${API_URL}/user/add`, {
        username: form.username,
        firstname: form.firstname,
        lastname: form.lastname,
        firmname: form.firmname,
        mobile: form.mobile,
        email: form.email,
        password: form.password
      });

      toast.success("Account created successfully.", toastProps);
      setForm(initialForm);

      setTimeout(() => {
        navigate("/login");
      }, 900);
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Signup failed. Please try again.", toastProps);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ToastContainer {...toastProps} />
      <AuthLayout
        eyebrow="New customer"
        title="Create your GChickenn account"
        subtitle="Set up your customer profile once so future orders are quicker, cleaner, and easier to manage."
        accentTitle="Made for returning buyers"
        accentCopy="A saved account helps streamline future orders for homes, firms, and repeat family purchases."
        footer={
          <p>
            Already registered?{" "}
            <Link to="/login" className="font-semibold text-brand-gold hover:text-white">
              Log in here
            </Link>
          </p>
        }
      >
        <form className="grid gap-4 sm:grid-cols-2" onSubmit={handleSubmit}>
          <div className="sm:col-span-2">
            <label className="input-label" htmlFor="username">
              Username
            </label>
            <p className="input-hint">
              Use only letters and numbers.
            </p>
            <input
              id="username"
              name="username"
              type="text"
              value={form.username}
              onChange={handleChange}
              className="input-field"
              placeholder="Choose a username"
              required
            />
          </div>

          <div>
            <label className="input-label" htmlFor="firstname">
              First name
            </label>
            <input
              id="firstname"
              name="firstname"
              type="text"
              value={form.firstname}
              onChange={handleChange}
              className="input-field"
              placeholder="First name"
              required
            />
          </div>

          <div>
            <label className="input-label" htmlFor="lastname">
              Last name
            </label>
            <input
              id="lastname"
              name="lastname"
              type="text"
              value={form.lastname}
              onChange={handleChange}
              className="input-field"
              placeholder="Last name"
              required
            />
          </div>

          <div className="sm:col-span-2">
            <label className="input-label" htmlFor="firmname">
              Firm name
            </label>
            <input
              id="firmname"
              name="firmname"
              type="text"
              value={form.firmname}
              onChange={handleChange}
              className="input-field"
              placeholder="Business or household name"
              required
            />
          </div>

          <div>
            <label className="input-label" htmlFor="mobile">
              Mobile number
            </label>
            <input
              id="mobile"
              name="mobile"
              type="tel"
              value={form.mobile}
              onChange={handleChange}
              className="input-field"
              placeholder="Mobile number"
              required
            />
          </div>

          <div>
            <label className="input-label" htmlFor="email">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              className="input-field"
              placeholder="Email address"
              required
            />
          </div>

          <div>
            <label className="input-label" htmlFor="password">
              Password
            </label>
            <p className="input-hint">
              8+ characters with upper, lower, number, and special character.
            </p>
            <input
              id="password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              className="input-field"
              placeholder="Create password"
              required
            />
          </div>

          <div>
            <label className="input-label" htmlFor="passwordCheck">
              Confirm password
            </label>
            <input
              id="passwordCheck"
              name="passwordCheck"
              type="password"
              value={form.passwordCheck}
              onChange={handleChange}
              className="input-field"
              placeholder="Confirm password"
              required
            />
          </div>

          <div className="sm:col-span-2">
            <button type="submit" className="primary-button w-full" disabled={loading}>
              {loading ? "Creating account..." : "Create account"}
            </button>
          </div>
        </form>
      </AuthLayout>
    </>
  );
}
