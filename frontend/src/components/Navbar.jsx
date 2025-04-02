import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { isAuthenticated, logout } from "../utils/auth";
import LogoutModal from "./LogoutModal"; // Import the LogoutModal component

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  // Toggle mobile menu
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Handle Logout
  const handleLogout = () => {
    logout(); // Clear token and log out the user
    navigate("/login"); // Redirect to login page
  };

  return (
    <nav className="bg-indigo-600 shadow-md w-full fixed top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="text-white text-xl font-bold">
              Routine Tracker
            </Link>
          </div>

          {/* Navigation Links (Desktop View) */}
          <div className="hidden md:flex space-x-4">
            {isAuthenticated() ? (
              <>
                <Link
                  to="/activities"
                  className="text-white hover:bg-indigo-700 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Activities
                </Link>
                <Link
                  to="/history"
                  className="text-white hover:bg-indigo-700 px-3 py-2 rounded-md text-sm font-medium"
                >
                  History
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/"
                  className="text-white hover:bg-indigo-700 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Home
                </Link>
                <Link
                  to="/register"
                  className="text-white hover:bg-indigo-700 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Register
                </Link>
                <Link
                  to="/login"
                  className="text-white hover:bg-indigo-700 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Login
                </Link>
              </>
            )}
          </div>

          {/* Right aligned Profile icon */}
          <div className="flex items-center space-x-1 md:space-x-4">
            {/* Profile Icon */}
            {isAuthenticated() && (
              <Link
                to="/profile"
                className="text-white hover:bg-indigo-700 p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-indigo-600 focus:ring-white"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </Link>
            )}

            {/* Logout Modal (Shown only on medium and large screens) */}
            {isAuthenticated() && (
              <div className="hidden md:block">
                <LogoutModal onLogout={handleLogout} />
              </div>
            )}

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center">
              <button
                type="button"
                onClick={toggleMenu}
                className="inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-indigo-600 focus:ring-white cursor-pointer"
                aria-controls="mobile-menu"
                aria-expanded="false"
              >
                <span className="sr-only">Open main menu</span>
                <svg
                  className={`${isMenuOpen ? "hidden" : "block"} h-6 w-6`}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16m-7 6h7"
                  />
                </svg>
                <svg
                  className={`${isMenuOpen ? "block" : "hidden"} h-6 w-6`}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`${isMenuOpen ? "block" : "hidden"} md:hidden`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          {isAuthenticated() ? (
            <>
              {/* Activities Link */}
              <Link
                to="/activities"
                className="text-white block hover:bg-indigo-700 px-3 py-2 rounded-md text-base font-medium"
                onClick={() => setIsMenuOpen(false)} // Close menu on click
              >
                Activities
              </Link>

              {/* History Link */}
              <Link
                to="/history"
                className="text-white block hover:bg-indigo-700 px-3 py-2 rounded-md text-base font-medium"
                onClick={() => setIsMenuOpen(false)} // Close menu on click
              >
                History
              </Link>

              {/* Logout Button for Mobile Menu */}
              {isAuthenticated() && (
                <LogoutModal
                  onLogout={handleLogout}
                  isMobile={true}
                  onClose={() => setIsMenuOpen(false)} // Close menu after logout
                />
              )}
            </>
          ) : (
            <>
              {/* Home Link */}
              <Link
                to="/"
                className="text-white block hover:bg-indigo-700 px-3 py-2 rounded-md text-base font-medium"
                onClick={() => setIsMenuOpen(false)} // Close menu on click
              >
                Home
              </Link>

              {/* Register Link */}
              <Link
                to="/register"
                className="text-white block hover:bg-indigo-700 px-3 py-2 rounded-md text-base font-medium"
                onClick={() => setIsMenuOpen(false)} // Close menu on click
              >
                Register
              </Link>

              {/* Login Link */}
              <Link
                to="/login"
                className="text-white block hover:bg-indigo-700 px-3 py-2 rounded-md text-base font-medium"
                onClick={() => setIsMenuOpen(false)} // Close menu on click
              >
                Login
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
