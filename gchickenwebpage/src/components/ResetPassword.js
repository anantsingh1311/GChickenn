import React, { Component } from "react";
import "../Login.css";
import "@fontsource/great-vibes";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link, Navigate } from "react-router-dom";

class ResetPassword extends Component {
  constructor(props) {
    super(props);

    this.state = {
      password1: "",
      password2: "",
      loading: false,
      redirectToLogin: false
    };
  }

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  handleSubmit = async (e) => {
    e.preventDefault();

    const { password1, password2 } = this.state;
    const { token } = this.props.params;

    if (!password1 || !password2) {
      toast.error("Please fill in all fields");
      return;
    }

    if (password1.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    if (password1 !== password2) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      this.setState({ loading: true });

      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/reset-password/${token}`,
        {
          password: password1
        }
      );

      toast.success(res.data.message || "Password reset successful");

      this.setState({
        password1: "",
        password2: "",
        loading: false,
        redirectToLogin: true
      });
    } catch (error) {
      this.setState({ loading: false });
      toast.error(error.response?.data?.message || "Reset link is invalid or expired");
    }
  };

  render() {
    const { password1, password2, loading, redirectToLogin } = this.state;

    if (redirectToLogin) {
      return <Navigate to="/login" />;
    }

    return (
      <div className="auth-page">
        <ToastContainer />
        <div className="auth-card">
          <h1 className="auth-title">Reset Password</h1>
          <p className="auth-subtitle">
            Enter your new password below.
          </p>

          <form onSubmit={this.handleSubmit} className="auth-form">
            <label>New Password</label>
            <input
              type="password"
              name="password1"
              value={password1}
              onChange={this.handleChange}
              placeholder="Enter new password"
              required
            />

            <label>Confirm New Password</label>
            <input
              type="password"
              name="password2"
              value={password2}
              onChange={this.handleChange}
              placeholder="Re-enter new password"
              required
            />

            <button type="submit" className="auth-btn" disabled={loading}>
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>

          <p className="auth-footer-text">
            Back to{" "}
            <Link to="/login" className="auth-link">
              Login
            </Link>
          </p>
        </div>
      </div>
    );
  }
}

export default ResetPassword;