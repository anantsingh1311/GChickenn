import React, { Component } from "react";
import { Link } from "react-router-dom";
import "../Navbar.css";
import "@fontsource/great-vibes";
import "bootstrap/dist/css/bootstrap.min.css";
import brandLogo from "../brand-logo.JPG";
import axios from "axios";

export default class Navbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: JSON.parse(localStorage.getItem("user"))
    };
  }

  componentDidMount() {
    window.addEventListener("storage", this.syncUser);
  }

  componentWillUnmount() {
    window.removeEventListener("storage", this.syncUser);
  }

  syncUser = () => {
    this.setState({ user: JSON.parse(localStorage.getItem("user")) });
  };

  handleLogout = async () => {
  try {
    await axios.post(
      `${process.env.REACT_APP_API_URL}/api/logout`,
      {},
      { withCredentials: true }
    );
  } catch (err) {
    console.error(err);
  }

  localStorage.removeItem("user");
  sessionStorage.clear();
  window.location.href = "/login";
};

  render() {
    const { user } = this.state;

    return (
      <>
        {/* TOP AUTH BAR */}
        <div className="top-auth-bar">
          <div className="top-auth-content">
            {user ? (
              <>
                {user.role === "admin" && (
                  <Link to="/Admin" className="auth-link">
                    Admin
                  </Link>
                )}
                <span onClick={this.handleLogout} className="auth-link clickable">
                  Logout
                </span>
              </>
            ) : (
              <>
                <Link to="/Login" className="auth-link">Log In</Link>
                <Link to="/Signup" className="auth-link">Sign Up</Link>
              </>
            )}
          </div>
        </div>

        {/* MAIN NAVBAR */}
        <nav className="navbar navbar-expand-lg royal-navbar">
          <div className="container-fluid">

            {/* Brand */}
            <Link to="/" className="navbar-brand royal-brand">
              GChickenn
              <img src={brandLogo} alt="logo" className="navbar-logo" />
            </Link>

            {/* Mobile toggle */}
            <button
              className="navbar-toggler custom-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#mainNavbar"
            >
              ☰
            </button>

            {/* Links */}
            <div className="collapse navbar-collapse" id="mainNavbar">
              <ul className="navbar-nav ms-auto nav-links">

                <li className="nav-item">
                  <Link to="/" className="nav-link royal-link">Home</Link>
                </li>

                <li className="nav-item">
                  <Link to="/Products" className="nav-link royal-link">Products</Link>
                </li>

                <li className="nav-item">
                  <Link to="/Order" className="nav-link royal-link nav-cta">
                    Order Now
                  </Link>
                </li>

              </ul>
            </div>

          </div>
        </nav>
      </>
    );
  }
}