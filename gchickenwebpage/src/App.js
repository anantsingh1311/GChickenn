import { BrowserRouter as Router, Navigate, Route, Routes } from "react-router-dom";

import Admin from "./components/Admin";
import Footer from "./components/Footer";
import ForgotPassword from "./components/ForgotPassword";
import Home from "./components/Home";
import Login from "./components/Login";
import Navbar from "./components/Navbar";
import Order from "./components/Order";
import Products from "./components/Products";
import ResetPasswordWrapper from "./components/ResetPasswordWrapper";
import Signup from "./components/Signup";

function ProtectedRoute({ children }) {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function AdminRoute({ children }) {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role?.toLowerCase() !== "admin") {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-brand-gradient text-brand-cream">
        <Navbar />

        <main className="pb-14">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route
              path="/order"
              element={
                <ProtectedRoute>
                  <Order />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <Admin />
                </AdminRoute>
              }
            />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPasswordWrapper />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}
