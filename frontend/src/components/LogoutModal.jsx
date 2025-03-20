import React, { useState } from "react";

const LogoutModal = ({ onLogout }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleLogout = () => {
        onLogout(); // Call the parent's logout function
        setIsModalOpen(false); // Close the modal after logout
    };

    return (
        <>
            {/* Logout Button */}
            <button
                onClick={() => setIsModalOpen(true)}
                className="text-white bg-red-500 hover:bg-red-600 px-3 py-2 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-indigo-600 focus:ring-white dark:text-gray-100 dark:hover:bg-red-700 cursor-pointer"
            >
                Logout
            </button>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-opacity-50 backdrop-blur-xs">
                    <div className="relative bg-white rounded-lg shadow-[0_20px_50px_rgba(8,_112,_184,_0.7)] dark:bg-gray-500 w-full max-w-md">
                        {/* Close Button */}
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white  cursor-pointer"
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
                                className="mx-auto mb-4 text-gray-400 w-14 h-14 dark:text-gray-200"
                                fill="none"
                                viewBox="0 0 20 20"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                                />
                            </svg>
                            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                                Are you sure you want to logout?
                            </h3>
                            <button
                                onClick={handleLogout}
                                className="text-white bg-red-500 hover:bg-red-600 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center me-2 cursor-pointer"
                            >
                                Yes, Logout
                            </button>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600 cursor-pointer"
                            >
                                No, cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default LogoutModal;