import axios from "axios";
import { jwtDecode } from "jwt-decode"; // Corrected import statement
import { toast } from "react-toastify";

const API_URL = import.meta.env.VITE_API_URL;

// Function to refresh the access token
const refreshAccessToken = async () => {
  try {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) {
      throw new Error("No refresh token found");
    }

    const response = await axios.post(
      `${API_URL}/api/auth/refresh-token`,
      { refreshToken },
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    const { accessToken } = response.data;
    localStorage.setItem("accessToken", accessToken);
    return accessToken;
  } catch (error) {
    console.error("Error refreshing access token:", error);
    toast.error("Session expired. Please log in again.");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    window.location.href = "/login";
    throw error; // Re-throw to prevent further execution
  }
};

// Function to check if the user is authenticated
const isAuthenticated = async () => {
  try {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) return false;

    const decoded = jwtDecode(accessToken);

    // Check token expiration
    if (decoded.exp * 1000 < Date.now()) {
      try {
        await refreshAccessToken();
        return true;
      } catch {
        return false;
      }
    }

    return true;
  } catch (error) {
    console.error("Authentication check failed:", error);
    return false;
  }
};

// Function to log out the user
const logout = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  window.location.href = "/login";
};

export { refreshAccessToken, isAuthenticated, logout };
