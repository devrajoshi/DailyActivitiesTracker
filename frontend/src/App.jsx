import React, { Suspense, lazy } from "react";
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
import PrivateRoute from "./components/PrivateRoute";
import { isAuthenticated } from "./utils/auth";

// Lazy Load Components for Performance Optimization
const Home = lazy(() => import("./components/Home"));
const RegistrationForm = lazy(() => import("./components/RegistrationForm"));
const LoginForm = lazy(() => import("./components/LoginForm"));
const Activities = lazy(() => import("./components/Activities"));
const History = lazy(() => import("./components/History"));
const Profile = lazy(() => import("./components/Profile"));

function App() {
  return (
    <Router>
      <Navbar />

      <div className="flex flex-col min-h-screen">
        <div className="flex-grow mt-16">
          <Suspense
            fallback={<div className="text-center mt-16">Loading...</div>}
          >
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/register" element={<RegistrationForm />} />
              <Route path="/login" element={<LoginForm />} />

              {/* Protected Routes */}
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
          </Suspense>
        </div>

        {/* Conditional Footer */}
        {!isAuthenticated() && <Footer />}
      </div>

      <ToastContainer position="top-right" autoClose={3000} />
    </Router>
  );
}

export default App;
