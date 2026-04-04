// routes/auth.js
const express = require('express');
const router = express.Router();
const User = require('../models/user-model');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/authorizationmiddleware');
const adminOnly = require('../middleware/adminmiddleware');
// const express = require("express");
// const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
//Industry standard method  using JWT tokens:
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username }).select("+password");
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // true in production with HTTPS
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000
    });

    return res.json({
      message: "Login successful",
      user: {
        id: user._id,
        username: user.username,
        role: user.role
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});
router.get('/admin-dashboard', auth, adminOnly, (req, res) => {
    res.json({ message: "Welcome Admin" });
});
router.post("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: false,
    sameSite: "lax"
  });

  res.json({ message: "Logged out successfully" });
});
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

  

    if (!email || !email.trim()) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });

    // do not reveal whether user exists
    if (!user) {
      return res.status(200).json({
        message: "If an account with that email exists, a reset link has been sent."
      });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");

    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpire = Date.now() + 24 * 60 * 60 * 1000; // 1 day

    await user.save({ validateBeforeSave: false });
    
    // const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}?username=${encodeURIComponent(user.username)}`;

    //   const transporter = nodemailer.createTransport({
    //   host: "smtp.gmail.com",
    //   port: 587,
    //   secure: false, // VERY IMPORTANT (must be false for 587)
    //   auth: {
    //     user: process.env.EMAIL_USER,
    //     pass: process.env.EMAIL_PASS,
    //   },
    // });

    // const mailOptions = {
    //   from: process.env.EMAIL_USER,
    //   to: user.email,
    //   subject: "Password Reset Request",
    //   html: `
    //     <div style="font-family: Arial, sans-serif; padding: 20px; color: #222;">
    //       <h2>Password Reset</h2>
    //       <p>You requested to reset your password.</p>
    //       <p>Your username is: "${user.username}" </p>
    //       <p>Click the button below to reset it. This link expires in 24 hrs.</p>
    //       <a href="${resetUrl}" 
    //          style="display:inline-block;padding:12px 20px;background:#d62828;color:#fff;text-decoration:none;border-radius:8px;font-weight:bold;">
    //          Reset Password
    //       </a>
    //       <p style="margin-top:20px;">If you did not request this, you can safely ignore this email.</p>
    //     </div>
    //   `
    // };
    // let emailSent = false;
    // try{

    // await transporter.sendMail(mailOptions);}
    // catch(err){
    //   emailSent = false;
    //   console.error(`Email not sent`);
    // }
    let emailSent = false;
    if(!emailSent){
           return res.status(201).json({
        success: true,
        emailSent: false,
        message:
          `Email could not be sent, please click the link above that appears after to reset your password ${resetUrl}`
      });
    }
      res.status(201).json({
      message:"Email Delivered please use that link to navigate to reset your password"
    })
  } catch (error) {
    console.error("Forgot password error:", error);
    return res.status(500).json({ message: "Server error" });
  }
});
router.post("/reset-password/:token", async (req, res) => {
  try {
    const { password } = req.body;

    if (!password || password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters"
      });
    }

    const hashedToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() }
    }).select("+password");

    if (!user) {
      return res.status(400).json({
        message: "Reset link is invalid or has expired"
      });
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    return res.status(200).json({
      message: "Password has been reset successfully"
    });
  } catch (error) {
    console.error("Reset password error:", error);
    return res.status(500).json({ message: "Server error" });
  }
});
module.exports = router;