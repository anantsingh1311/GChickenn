import React, { Component } from "react";
import "../Login.css";
import "@fontsource/great-vibes";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";
export default class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: "",
      password: "",
      loading: false
    };
  }

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  OnSubmit = async (e) => {
    e.preventDefault();

    const { username, password } = this.state;

    if (!username || !password) {
      toast.error("Please fill all fields");
      return;
    }

    try {
  this.setState({ loading: true });

 const res = await axios.post(
  `${process.env.REACT_APP_API_URL}/api/login`,
  { username, password },
  { withCredentials: true }
);

 const { user } = res.data;

localStorage.setItem("user", JSON.stringify(user));

toast.success(`Welcome ${user.username}`);

setTimeout(() => {
  if (user.role?.toLowerCase() === "admin") {
    window.location.href = "/admin";
  } else {
    window.location.href = "/";
  }
}, 1200);

} catch (err) {
  console.error(err);
  toast.error("Invalid username or password");
} finally {
  this.setState({ loading: false });
}
  };

  render() {
    const { username, password, loading } = this.state;

    return (
      <div className="login-page">
        <ToastContainer position="top-center" autoClose={2000} />

        <div className="login-card">
          <h1 className="login-title">Log In</h1>

          <form className="login-form" onSubmit={this.OnSubmit}>
            <div className="login-field">
              <label>Username</label>
              <input
                type="text"
                name="username"
                value={username}
                onChange={this.handleChange}
                required
              />
            </div>

            <div className="login-field">
              <label>Password</label>
              <input
                type="password"
                name="password"
                value={password}
                onChange={this.handleChange}
                required
              />
            </div>

            <button
              type="submit"
              className="login-button"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Log In"}
            </button>
            <p>Dont Have an Account ?  <Link to="/signup" className="navbar-brand royal-brand">
                          Sign-up Now 😁
                        </Link></p>
            <Link to="/forgot-password" className="auth-link">
              Reset Password
            </Link>
          </form>
        </div>
      </div>
    );
  }
}