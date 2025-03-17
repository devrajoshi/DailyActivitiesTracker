import React from "react";

const AuthLayout = ({ children, title }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-center text-gray-800">
          {title}
        </h1>
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
