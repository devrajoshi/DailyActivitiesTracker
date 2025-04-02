import React, { useEffect, useState } from "react";
import axios from "axios";
import { isAuthenticated } from "../utils/auth";
import { FaCameraRetro } from "react-icons/fa";
import { toast } from "react-toastify";
// import { BiSolidEdit } from "react-icons/bi";
import Modal from "./Modal"; // Assuming you have this component

const API_URL = process.env.REACT_APP_API_URL;

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profilePicture, setProfilePicture] = useState(
    "https://source.unsplash.com/random/100x100"
  );
  const [uploading, setUploading] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({
    fullname: "",
    username: "",
    email: "",
  });
  const [passwordFormData, setPasswordFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Fetch user details from backend
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("API_URL/api/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUser(response.data);
        setEditFormData({
          fullname: response.data.fullname || "",
          username: response.data.username || "",
          email: response.data.email || "",
        });

        if (response.data.profilePictureUrl) {
          setProfilePicture(`API_URL/${response.data.profilePictureUrl}`);
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated()) {
      fetchUserDetails();
    }
  }, []);

  // Handle profile picture change
  const handleProfileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      setUploading(true);
      const tempUrl = URL.createObjectURL(file);
      setProfilePicture(tempUrl);

      const formData = new FormData();
      formData.append("profilePicture", file);

      const token = localStorage.getItem("token");
      const response = await axios.post(
        "API_URL/api/users/profile/update-profile-picture",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.profilePictureUrl) {
        const updatedUrl = `API_URL/${response.data.profilePictureUrl}`;
        setProfilePicture(updatedUrl);
        toast.success("Profile picture updated successfully!");
      }
    } catch (error) {
      console.error("Error uploading profile picture:", error);
      toast.error("Failed to upload profile picture. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  // Handle Edit Profile form submission
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        "API_URL/api/users/profile",
        editFormData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setUser(response.data);
      setIsEditModalOpen(false);
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error(error.response?.data?.message || "Failed to update profile");
    }
  };

  // Handle Change Password form submission
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    // Validate new password and confirmation
    if (passwordFormData.newPassword !== passwordFormData.confirmPassword) {
      return toast.error("New password and confirmation do not match");
    }

    try {
      const token = localStorage.getItem("token");

      // Send password change request to the backend
      const response = await axios.put(
        "API_URL/api/users/profile/change-password",
        {
          currentPassword: passwordFormData.currentPassword,
          newPassword: passwordFormData.newPassword,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Reset form data
      setPasswordFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      // Close the modal
      setIsPasswordModalOpen(false);

      // Show success toast
      toast.success("Password changed successfully!");

      // Check if re-login is required
      if (response.data.requireReLogin) {
        // Show logout notification
        toast.info(
          "Your account is being logged out for security reasons... \n Please login with the new password."
        );

        // Clear token from localStorage
        localStorage.removeItem("token");

        // Redirect to login page after a short delay
        setTimeout(() => {
          window.location.href = "/login"; // Force full-page reload
        }, 4000); // Delay for 2 seconds to allow the user to read the toast message
      }
    } catch (error) {
      console.error("Error changing password:", error);

      // Show error toast
      toast.error(error.response?.data?.message || "Failed to change password");
    }
  };

  if (loading) {
    return <p className="text-center">Loading...</p>;
  }

  if (!user) {
    return <p className="text-center">Unable to load user details.</p>;
  }

  return (
    <div className=" w-9/10 md:w-3/4 max-w-md mx-auto mt-6 p-4 bg-white rounded-lg shadow-[0_20px_50px_rgba(8,_112,_184,_0.7)]">
      <div className="flex flex-col items-center p-2">
        {/* Profile Picture */}
        <div>
          <input
            type="file"
            id="profileInput"
            accept="image/*"
            className="hidden"
            onChange={handleProfileChange}
          />
          <div
            className="flex justify-center mb-6 cursor-pointer relative group"
            onClick={() => document.getElementById("profileInput").click()}
          >
            <img
              src={profilePicture}
              alt="Profile"
              className="w-32 h-32 rounded-full object-cover border-2 border-indigo-600"
            />
            <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 hover:opacity-70 group-hover:opacity-100 transition-opacity">
              <FaCameraRetro className="h-8 w-8 text-white opacity-50 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>
        </div>

        {/* User Details */}
        <div className=" flex-col items-center space-y-4">
          <div>
            <p className="text-sm font-medium text-gray-500">Full Name</p>
            <p className="text-lg font-semibold text-gray-900">
              {user.fullname || "Not provided"}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Username</p>
            <p className="text-lg font-semibold text-gray-900">
              {user.username}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Email</p>
            <p className="text-lg font-semibold text-gray-900">{user.email}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Member Since</p>
            <p className="text-lg font-semibold text-gray-900">
              {new Date(user.createdAt).toLocaleDateString()}
            </p>
          </div>
          {/* </div>

        <div className="flex justify-center items-center p-4 mt-2"> */}
          {/* Action Buttons */}
          <div className="flex items-center mt-10">
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-2 md:px-5 py-2.5 text-center me-2 mb-2 cursor-pointer"
            >
              Edit Info
            </button>
            <button
              onClick={() => setIsPasswordModalOpen(true)}
              className="text-white bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-teal-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 cursor-pointer"
            >
              Change Password
            </button>
          </div>
        </div>
      </div>

      {/* Loading Indicator */}
      {uploading && (
        <p className="text-center mt-4 text-indigo-600">
          Uploading profile picture...
        </p>
      )}

      {/* Edit Profile Modal */}
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
        <h2 className="text-xl font-bold mb-4">Edit Profile</h2>
        <form onSubmit={handleEditSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Full Name
            </label>
            <input
              type="text"
              value={editFormData.fullname}
              onChange={(e) =>
                setEditFormData({ ...editFormData, fullname: e.target.value })
              }
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              type="text"
              value={editFormData.username}
              onChange={(e) =>
                setEditFormData({ ...editFormData, username: e.target.value })
              }
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              value={editFormData.email}
              onChange={(e) =>
                setEditFormData({ ...editFormData, email: e.target.value })
              }
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={() => setIsEditModalOpen(false)}
              className="text-white bg-gradient-to-r from-gray-400 via-gray-500 to-gray-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 cursor-pointer"
            >
              Save
            </button>
          </div>
        </form>
      </Modal>

      {/* Change Password Modal */}
      <Modal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
      >
        <h2 className="text-xl font-bold mb-4">Change Password</h2>
        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Current Password
            </label>
            <input
              type="password"
              value={passwordFormData.currentPassword}
              onChange={(e) =>
                setPasswordFormData({
                  ...passwordFormData,
                  currentPassword: e.target.value,
                })
              }
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              New Password
            </label>
            <input
              type="password"
              value={passwordFormData.newPassword}
              onChange={(e) =>
                setPasswordFormData({
                  ...passwordFormData,
                  newPassword: e.target.value,
                })
              }
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Confirm New Password
            </label>
            <input
              type="password"
              value={passwordFormData.confirmPassword}
              onChange={(e) =>
                setPasswordFormData({
                  ...passwordFormData,
                  confirmPassword: e.target.value,
                })
              }
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={() => setIsPasswordModalOpen(false)}
              className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700"
            >
              Save
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Profile;
