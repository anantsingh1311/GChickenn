import React, { Component } from "react";
import "../Login.css";
import "@fontsource/great-vibes";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";

export default class ForgotPassword extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      loading: false
    };
  }

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  handleSubmit = async (e) => {
    e.preventDefault();

    const { email } = this.state;

    if (!email.trim()) {
      toast.error("Please enter your email address");
      return;
    }

    try {
      this.setState({ loading: true });

      const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/forgot-password`, {
        email
      });

      if(!res.data.emailSent){
        toast.warning("Email couldnt be sent")
        toast.warning(<div> 
          Here is your reset link, click it to reset your password: 
          <a href={res.data.message}>Reset Link</a>
          </div>);
      this.setState({
        email: "",
        loading: false
      });
      }
      else{
         toast.success("Email Sent Sucessfully")
      // toast.success(res.data.message)

      this.setState({
        email: "",
        loading: false
      });

      }
     
    } catch (error) {
      this.setState({ loading: false });

      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  render() {
    const { email, loading } = this.state;

    return (
      <div className="auth-page">
        <ToastContainer />
        <div className="auth-card">
          <h1 className="auth-title">Forgot Password</h1>
          <p className="auth-subtitle">
            Enter your email address and we’ll send you a password reset link.
          </p>

          <form onSubmit={this.handleSubmit} className="auth-form">
            <label>Email Address</label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={this.handleChange}
              placeholder="Enter your registered email"
              required
            />

            <button type="submit" className="auth-btn" disabled={loading}>
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>

          <p className="auth-footer-text">
            Remembered your password?{" "}
            <Link to="/login" className="auth-link">
              Back to Login
            </Link>
          </p>
        </div>
      </div>
    );
  }
}