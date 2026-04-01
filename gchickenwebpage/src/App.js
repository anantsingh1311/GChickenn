import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { SpeedInsights } from '@vercel/speed-insights/react';

import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Products from "./components/Products";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Order from "./components/Order";
import Admin from "./components/Admin";
import ForgotPassword from "./components/ForgotPassword";
import ResetPasswordWrapper from "./components/ResetPasswordWrapper";

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
function App() {
  return (
    <Router>
      <div className="app-root">
        <Navbar />

        <main className="app-content">
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
        <SpeedInsights />
      </div>
    </Router>
  );
}

export default App;

