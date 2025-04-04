import React, { useEffect, useState } from "react";
import axios from "axios";
import { isAuthenticated } from "../utils/auth";
import { FaCameraRetro } from "react-icons/fa";
import { toast } from "react-toastify";
import Modal from "./Modal";

const API_URL = import.meta.env.VITE_API_URL;

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

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");
        const { data } = await axios.get(`${API_URL}/api/users/me`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        setUser(data);
        setEditFormData({
          fullname: data.fullname || "",
          username: data.username || "",
          email: data.email || "",
        });

        if (data.profilePictureUrl) {
          setProfilePicture(`${API_URL}/${data.profilePictureUrl}`);
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated()) fetchUserDetails();
  }, []);

  const handleProfileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      setUploading(true);
      const tempUrl = URL.createObjectURL(file);
      setProfilePicture(tempUrl);

      const formData = new FormData();
      formData.append("profilePicture", file);

      const accessToken = localStorage.getItem("accessToken");
      const { data } = await axios.post(
        `${API_URL}/api/users/profile/update-profile-picture`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (data.profilePictureUrl) {
        setProfilePicture(`${API_URL}/${data.profilePictureUrl}`);
        toast.success("Profile picture updated successfully!");
      }
    } catch (error) {
      console.error("Error uploading profile picture:", error);
      toast.error("Failed to upload profile picture. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleFormSubmit = async (
    url,
    formData,
    successMessage,
    closeModal
  ) => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const { data } = await axios.put(url, formData, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      setUser(data);
      closeModal();
      toast.success(successMessage);
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error(error.response?.data?.message || "Failed to submit form");
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (passwordFormData.newPassword !== passwordFormData.confirmPassword) {
      return toast.error("New password and confirmation do not match");
    }

    try {
      const accessToken = localStorage.getItem("accessToken");
      const { data } = await axios.put(
        `${API_URL}/api/users/profile/change-password`,
        {
          currentPassword: passwordFormData.currentPassword,
          newPassword: passwordFormData.newPassword,
        },
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      setPasswordFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setIsPasswordModalOpen(false);
      toast.success("Password changed successfully!");

      if (data.requireReLogin) {
        toast.info(
          "Your account is being logged out for security reasons. Please login with the new password."
        );
        localStorage.removeItem("accessToken");
        setTimeout(() => (window.location.href = "/login"), 4000);
      }
    } catch (error) {
      console.error("Error changing password:", error);
      toast.error(error.response?.data?.message || "Failed to change password");
    }
  };

  if (loading) return <p className="text-center">Loading...</p>;
  if (!user) return <p className="text-center">Unable to load user details.</p>;

  return (
    <div className="w-9/10 md:w-3/4 max-w-md mx-auto mt-6 p-4 bg-white rounded-lg shadow-[0_20px_50px_rgba(8,_112,_184,_0.7)]">
      <div className="flex flex-col items-center p-2">
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

        <div className="flex-col items-center space-y-4">
          {["fullname", "username", "email", "createdAt"].map((field) => (
            <div key={field}>
              <p className="text-sm font-medium text-gray-500">
                {field === "createdAt"
                  ? "Member Since"
                  : field.charAt(0).toUpperCase() + field.slice(1)}
              </p>
              <p className="text-lg font-semibold text-gray-900">
                {field === "createdAt"
                  ? new Date(user[field]).toLocaleDateString()
                  : user[field] || "Not provided"}
              </p>
            </div>
          ))}

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

      {uploading && (
        <p className="text-center mt-4 text-indigo-600">
          Uploading profile picture...
        </p>
      )}

      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
        <h2 className="text-xl font-bold mb-4">Edit Profile</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleFormSubmit(
              `${API_URL}/api/users/profile`,
              editFormData,
              "Profile updated successfully!",
              () => setIsEditModalOpen(false)
            );
          }}
          className="space-y-4"
        >
          {["fullname", "username", "email"].map((field) => (
            <div key={field}>
              <label className="block text-sm font-medium text-gray-700">
                {field.charAt(0).toUpperCase() + field.slice(1)}
              </label>
              <input
                type={field === "email" ? "email" : "text"}
                value={editFormData[field]}
                onChange={(e) =>
                  setEditFormData({ ...editFormData, [field]: e.target.value })
                }
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          ))}
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

      <Modal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
      >
        <h2 className="text-xl font-bold mb-4">Change Password</h2>
        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          {["currentPassword", "newPassword", "confirmPassword"].map(
            (field) => (
              <div key={field}>
                <label className="block text-sm font-medium text-gray-700">
                  {field
                    .replace(/([A-Z])/g, " $1")
                    .replace(/^./, (str) => str.toUpperCase())}
                </label>
                <input
                  type="password"
                  value={passwordFormData[field]}
                  onChange={(e) =>
                    setPasswordFormData({
                      ...passwordFormData,
                      [field]: e.target.value,
                    })
                  }
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            )
          )}
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
