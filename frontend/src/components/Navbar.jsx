import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { isAuthenticated, logout } from "../utils/auth";
import LogoutModal from "./LogoutModal"; // Import the LogoutModal component

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const navigate = useNavigate();

  // Toggle mobile menu
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Toggle dark mode
  const toggleDarkMode = () => {
    setIsDarkMode((prevMode) => !prevMode);
  };

  // Persist dark mode preference in localStorage
  useEffect(() => {
    const isDark = localStorage.getItem("darkMode") === "true";
    setIsDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("darkMode", "true");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("darkMode", "false");
    }
  }, [isDarkMode]);

  // Handle Logout
  const handleLogout = () => {
    logout(); // Clear token and log out the user
    navigate("/login"); // Redirect to login page
  };

  return (
    <nav className="bg-indigo-600 shadow-md dark:bg-gray-800 w-full fixed top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link
              to="/"
              className="text-white text-xl font-bold dark:text-gray-100"
            >
              Routine Tracker
            </Link>
          </div>

          {/* Navigation Links (Desktop View) */}
          <div className="hidden md:flex space-x-4">
            {isAuthenticated() ? (
              <>
                <Link
                  to="/activities"
                  className="text-white hover:bg-indigo-700 px-3 py-2 rounded-md text-sm font-medium dark:text-gray-100 dark:hover:bg-gray-700"
                >
                  Activities
                </Link>
                <Link
                  to="/history"
                  className="text-white hover:bg-indigo-700 px-3 py-2 rounded-md text-sm font-medium dark:text-gray-100 dark:hover:bg-gray-700"
                >
                  History
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/"
                  className="text-white hover:bg-indigo-700 px-3 py-2 rounded-md text-sm font-medium dark:text-gray-100 dark:hover:bg-gray-700"
                >
                  Home
                </Link>
                <Link
                  to="/register"
                  className="text-white hover:bg-indigo-700 px-3 py-2 rounded-md text-sm font-medium dark:text-gray-100 dark:hover:bg-gray-700"
                >
                  Register
                </Link>
                <Link
                  to="/login"
                  className="text-white hover:bg-indigo-700 px-3 py-2 rounded-md text-sm font-medium dark:text-gray-100 dark:hover:bg-gray-700"
                >
                  Login
                </Link>
              </>
            )}
          </div>

          {/* Right aligned icons (Profile Icon and Dark Mode Toggle) */}
          <div className="flex items-center space-x-1 md:space-x-4">
            {/* Profile Icon */}
            {isAuthenticated() && (
              <Link
                to="/profile"
                className="text-white hover:bg-indigo-700 p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-indigo-600 focus:ring-white dark:text-gray-100 dark:hover:bg-gray-700"
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

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full bg-indigo-500 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-gray-700 dark:hover:bg-gray-600 cursor-pointer"
            >
              {isDarkMode ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              )}
            </button>

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
                className="inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-indigo-600 focus:ring-white dark:text-gray-100 dark:hover:bg-gray-700 cursor-pointer"
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
      <div
        className={`${
          isMenuOpen ? "block" : "hidden"
        } md:hidden fixed top-16 right-4 z-50 bg-indigo-600 dark:bg-gray-800 p-4 rounded-lg shadow-lg`}
      >
        <div className="flex flex-col items-end space-y-2 bg-indigo-600 ">
          {isAuthenticated() ? (
            <>
              <Link
                to="/activities"
                className="bg-indigo-600 text-indigo-600 hover:text-indigo-700 dark:text-gray-100 dark:hover:text-gray-300"
              >
                Activities
              </Link>
              <Link
                to="/history"
                className="text-indigo-600 hover:text-indigo-700 dark:text-gray-100 dark:hover:text-gray-300"
              >
                History
              </Link>
              {/* Logout Button for Mobile Menu */}
              <LogoutModal onLogout={handleLogout} isMobile={true} />
            </>
          ) : (
            <>
              <Link
                to="/"
                className="text-indigo-600 hover:text-indigo-700 dark:text-gray-100 dark:hover:text-gray-300"
              >
                Home
              </Link>
              <Link
                to="/register"
                className="text-indigo-600 hover:text-indigo-700 dark:text-gray-100 dark:hover:text-gray-300"
              >
                Register
              </Link>
              <Link
                to="/login"
                className="text-indigo-600 hover:text-indigo-700 dark:text-gray-100 dark:hover:text-gray-300"
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
