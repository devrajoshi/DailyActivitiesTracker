import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./components/Home";
import RegistrationForm from "./components/RegistrationForm";
import LoginForm from "./components/LoginForm";
// import Dashboard from "./components/Dashboard";
import Activities from "./components/Activities";
import History from "./components/History";
import Profile from "./components/Profile";
import PrivateRoute from "./components/PrivateRoute";
import { isAuthenticated } from "./utils/auth";

function App() {
  return (
    <Router>
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <div className="flex flex-col min-h-screen">
        <div className="flex-grow">
          <Routes>
            {/* Default route */}
            <Route path="/" element={<Home />} />

            {/* Public Routes */}
            <Route path="/register" element={<RegistrationForm />} />
            <Route path="/login" element={<LoginForm />} />

            {/* Protected Routes
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            /> */}
            <Route
              path="/activities"
              element={
                <PrivateRoute>
                  <Activities />
                </PrivateRoute>
              }
            />
            <Route
              path="/history"
              element={
                <PrivateRoute>
                  <History />
                </PrivateRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              }
            />

            {/* Redirect unknown routes to Home */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>

        {/* Conditional Footer */}
        {!isAuthenticated() && <Footer />}
      </div>

      {/* Toast Notifications */}
      <ToastContainer position="top-right" autoClose={3000} />
    </Router>
  );
}

export default App;