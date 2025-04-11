import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";
import axiosInstance from "./axiosInstance";
const API_URL = import.meta.env.VITE_API_URL;

// Function to refresh the access token
const refreshAccessToken = async () => {
  try {
    const refreshToken = localStorage.getItem("refreshToken");
    // if (!refreshToken) {
    //   throw new Error("No refresh token found");
    // }

    console.log("Sending request to refresh token..."); // Debugging
    const response = await axiosInstance.post(
      `${API_URL}/api/auth/refresh-token`,
      { refreshToken },
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    console.log("Response from refresh token endpoint:", response.data); // Debugging
    const { accessToken } = response.data;
    localStorage.setItem("accessToken", accessToken);
    return accessToken;
  } catch (error) {
    console.error("Error refreshing access token:", error);
    toast.error("Session expired. Please log in again.");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    window.location.href = "/login";
    throw error;
  }
};

// Function to check if the user is authenticated
const isAuthenticated = async () => {
  try {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) return false;

    const decoded = jwtDecode(accessToken);
    // console.log("Decoded token:", decoded); // Debugging

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

// Function to retrieve the user ID from the access token
// Function to decode the token and retrieve the userId
const getUserIdFromToken = () => {
  try {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      throw new Error("No access token found");
    }

    const decoded = jwtDecode(accessToken);
    // console.log("Decoded token:", decoded); // Debugging

    // Check token expiration
    if (decoded.exp * 1000 < Date.now()) {
      throw new Error("Access token expired");
    }

    return decoded.userId; // Extract userId from the token
  } catch (error) {
    console.error("Failed to retrieve userId from token:", error);
    throw error;
  }
};

// Function to log out the user
const logout = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  window.location.href = "/login";
};

export { refreshAccessToken, isAuthenticated, getUserIdFromToken, logout };
