import React, { Component } from "react";
import "../SignUp.css";
import "@fontsource/great-vibes";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default class Signup extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: "",
      firstname: "",
      lastname: "",
      firmname: "",
      mobile: "",
      email: "",
      password: "",
      passwordCheck: "",
      loading: false
    };
  }

  // ------------------------
  // INPUT HANDLER
  // ------------------------
  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  // ------------------------
  // VALIDATION
  // ------------------------
  validateUsername = (username) => {
    // must contain letters, numbers, special char
    const regex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&]).+$/;
    return regex.test(username);
  };

  validatePassword = (password) => {
    // min 8, uppercase, lowercase, number, special char
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
    return regex.test(password);
  };

  // ------------------------
  // SUBMIT
  // ------------------------
  OnSubmit = async (e) => {
    e.preventDefault();

    const {
      username,
      firstname,
      lastname,
      firmname,
      mobile,
      email,
      password,
      passwordCheck
    } = this.state;

    // Username validation
    if (!this.validateUsername(username)) {
      toast.error(
        "Username must include letters, numbers, and a special character"
      );
      return;
    }

    // Password validation
    if (!this.validatePassword(password)) {
      toast.error(
        "Password must be 8+ chars with uppercase, lowercase, number & special character"
      );
      return;
    }

    // Match check
    if (password !== passwordCheck) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      this.setState({ loading: true });

      const user = {
        username,
        firstname,
        lastname,
        firmname,
        mobile,
        email,
        password
      };

      const res = await axios.post(
        "http://localhost:5000/user/add",
        user
      );

      console.log(res.data);

      toast.success("Account created successfully! 🚀");

      setTimeout(() => {
        window.location.href = "/login";
      }, 1200);

    } catch (err) {
      console.error(err);

      if (err.response?.data?.message) {
        toast.error(err.response.data.message); // e.g. "Username already exists"
      } else {
        toast.error("Signup failed. Try again.");
      }
    } finally {
      this.setState({ loading: false });
    }
  };

  // ------------------------
  // RENDER
  // ------------------------
  render() {
    const {
      username,
      firstname,
      lastname,
      firmname,
      mobile,
      email,
      password,
      passwordCheck,
      loading
    } = this.state;

    return (
      <div className="signup-page">
        <ToastContainer position="top-center" autoClose={2000} />

        <div className="signup-card">
          <h1 className="signup-title">Create Account</h1>
          <p className="signup-subtitle">
            Sign up to start ordering fresh chicken 🐔
          </p>

          <form className="signup-form" onSubmit={this.OnSubmit}>

            <input
              type="text"
              name="username"
              placeholder="Username"
              value={username}
              onChange={this.handleChange}
              required
            />

            <input
              type="text"
              name="firstname"
              placeholder="First Name"
              value={firstname}
              onChange={this.handleChange}
              required
            />

            <input
              type="text"
              name="lastname"
              placeholder="Last Name"
              value={lastname}
              onChange={this.handleChange}
              required
            />

            <input
              type="text"
              name="firmname"
              placeholder="Firm Name"
              value={firmname}
              onChange={this.handleChange}
              required
            />

            <input
              type="tel"
              name="mobile"
              placeholder="Mobile Number"
              value={mobile}
              onChange={this.handleChange}
              required
            />

            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={email}
              onChange={this.handleChange}
              required
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={password}
              onChange={this.handleChange}
              required
            />

            <input
              type="password"
              name="passwordCheck"
              placeholder="Confirm Password"
              value={passwordCheck}
              onChange={this.handleChange}
              required
            />

            <button
              type="submit"
              className="signup-button"
              disabled={loading}
            >
              {loading ? "Creating Account..." : "Sign Up"}
            </button>

          </form>
        </div>
      </div>
    );
  }
}