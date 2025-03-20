    import React, { useEffect, useState } from "react";
    import axios from "axios";
    import { isAuthenticated } from "../utils/auth";
    import {FaCameraRetro} from "react-icons/fa"

    const Profile = () => {
        const [user, setUser] = useState(null);
        const [loading, setLoading] = useState(true);
        const [profilePicture, setProfilePicture] = useState("https://source.unsplash.com/random/100x100");
        const [uploading, setUploading] = useState(false);

        // Fetch user details from backend
        useEffect(() => {
            const fetchUserDetails = async () => {
                try {
                    const token = localStorage.getItem("token");
                    const response = await axios.get("http://localhost:5000/api/users/me", {
                        headers: { Authorization: `Bearer ${token}` },
                    });

                    setUser(response.data);

                    // Ensure profilePicture is correctly set from backend
                    if (response.data.profilePictureUrl) {
                        setProfilePicture(`http://localhost:5000/${response.data.profilePictureUrl}`);
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

                // Show temporary preview while uploading
                const tempUrl = URL.createObjectURL(file);
                setProfilePicture(tempUrl);

                const formData = new FormData();
                formData.append("profilePicture", file);

                const token = localStorage.getItem("token");
                const response = await axios.post(
                    "http://localhost:5000/api/users/profile/update-profile-picture",
                    formData,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "multipart/form-data",
                        },
                    }
                );

                // Update profile picture from backend response
                if (response.data.profilePictureUrl) {
                    const updatedUrl = `http://localhost:5000/${response.data.profilePictureUrl}`;
                    setProfilePicture(updatedUrl);
                }
            } catch (error) {
                console.error("Error uploading profile picture:", error);
                alert("Failed to upload profile picture. Please try again.");
            } finally {
                setUploading(false);
            }
        };

        if (loading) {
            return <p className="text-center">Loading...</p>;
        }

        if (!user) {
            return <p className="text-center">Unable to load user details.</p>;
        }

        return (
            <div className="max-w-md mx-auto mt-6 p-16 bg-white rounded-lg dark:bg-gray-800 shadow-[0_20px_50px_rgba(8,_112,_184,_0.7)]">
                {/* Profile Picture */}
                <div className="flex flex-col items-center">
                    {/* Hidden file input */}
                    <input type="file" id="profileInput" accept="image/*" className="hidden" onChange={handleProfileChange} />

                    {/* Profile Picture - Clickable */}
                    <div
                        className="flex justify-center mb-6 cursor-pointer relative group"
                        onClick={() => document.getElementById("profileInput").click()}
                    >
                        {/* Profile Picture */}
                        <img
                            src={profilePicture}
                            alt="Profile"
                            className="w-32 h-32 rounded-full object-cover border-2 border-indigo-600"
                        />

                        {/* Overlay with Camera Icon */}
                        <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 hover:opacity-70 group-hover:opacity-100 transition-opacity">
                            <FaCameraRetro className="h-8 w-8 text-white opacity-50 group-hover:opacity-100 transition-opacity" />
                        </div>
                    </div>
                </div>

                {/* User Details */}
                <div className="space-y-4">
                    <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Full Name</p>
                        <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">{user.name || "Not provided"}</p>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Username</p>
                        <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">{user.username}</p>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Email</p>
                        <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">{user.email}</p>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Country</p>
                        <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">{user.country || "Not provided"}</p>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Member Since</p>
                        <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">{new Date(user.createdAt).toLocaleDateString()}</p>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-6 flex space-x-4">
                    <button className="w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded-md shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                        Edit Profile
                    </button>
                    <button className="w-full py-2 px-4 bg-red-600 text-white font-semibold rounded-md shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                        Change Password
                    </button>
                </div>

                {/* Loading Indicator */}
                {uploading && <p className="text-center mt-4 text-indigo-600">Uploading profile picture...</p>}
            </div>
        );
    };

    export default Profile;
