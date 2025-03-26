import React from "react";

const AuthLayout = ({ children, title }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="w-9/10 md:w-3/4 max-w-md p-8 space-y-6 bg-white rounded-lg shadow-[0_20px_50px_rgba(8,_112,_184,_0.7)]">
        <h1 className="text-2xl font-bold text-center text-gray-800">
          {title}
        </h1>
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
