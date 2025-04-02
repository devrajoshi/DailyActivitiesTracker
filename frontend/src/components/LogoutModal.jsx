import React, { useState } from "react";

const LogoutModal = ({ onLogout, isMobile = false }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Handle logout action
  const handleLogout = () => {
    onLogout(); // Call the parent's logout function
    setIsModalOpen(false); // Close the modal after logout
  };

  return (
    <>
      {/* Logout Button */}
      {!isMobile && (
        <button
          onClick={() => setIsModalOpen(true)}
          className="hidden md:flex text-white bg-red-500 hover:bg-red-600 px-3 py-2 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 cursor-pointer"
        >
          Logout
        </button>
      )}

      {isMobile && (
        <button
          onClick={() => setIsModalOpen(true)}
          className="block md:hidden w-full text-left px-4 py-2 text-white bg-red-500 hover:bg-red-600 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 cursor-pointer"
        >
          Logout
        </button>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-opacity-50 backdrop-blur-xs">
          <div className="relative bg-white rounded-lg shadow-lgw-full max-w-md">
            {/* Close Button */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-3 right-2.5 text-gray-400 hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 cursor-pointer"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {/* Modal Content */}
            <div className="p-6 text-center">
              <svg
                className="mx-auto mb-4 text-gray-400 w-14 h-14"
                fill="none"
                viewBox="0 0 20 20"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              <h3 className="mb-5 text-lg font-normal text-gray-500">
                Are you sure you want to logout?
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 me-2 cursor-pointer"
              >
                No, cancel
              </button>
              <button
                onClick={handleLogout}
                className="text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 cursor-pointer"
              >
                Yes, Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default LogoutModal;
