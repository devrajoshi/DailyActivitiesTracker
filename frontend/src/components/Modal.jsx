import React from "react";
import ReactDOM from "react-dom";

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Blurred Background */}
      <div className="absolute inset-0 bg-opacity-50 backdrop-blur-xs"></div>

      {/* Modal Content */}
      <div className="relative z-10 bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-gray-500 hover:text-red-500 transition duration-300 ease-in-out transform hover:scale-125 cursor-pointer font-semibold"
        >
          &times;
        </button>

        {/* Modal Body */}
        {children}
      </div>
    </div>,
    document.getElementById("modal-root")
  );
};

export default Modal;
