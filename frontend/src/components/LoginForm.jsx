import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import axiosInstance from "../utils/axiosInstance";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AuthLayout from "./AuthLayout";

const API_URL = import.meta.env.VITE_API_URL;

// Validation schema
const schema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

const LoginForm = () => {
  const {
    register,
    handleSubmit,
    setValue, // Used to set values for autofill
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  // Retrieve pre-filled email and password from session storage
  useEffect(() => {
    const preFilledEmail = sessionStorage.getItem("preFilledEmail");
    const preFilledPassword = sessionStorage.getItem("preFilledPassword");

    if (preFilledEmail && preFilledPassword) {
      setValue("email", preFilledEmail); // Autofill email
      setValue("password", preFilledPassword); // Autofill password

      // Clear session storage after autofilling
      sessionStorage.removeItem("preFilledEmail");
      sessionStorage.removeItem("preFilledPassword");
    }
  }, [setValue]);

  const onSubmit = async (data) => {
    try {
      // Send login request to the server
      const response = await axiosInstance.post(
        `${API_URL}/api/users/login`,
        data
      );
      const { accessToken, refreshToken } = response.data; // Destructure tokens from response

      // Save the accessToken to localStorage
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);

      // Show success toast
      toast.success("Login successful!");

      // Delay redirection to allow the toast to display
      setTimeout(() => {
        window.location.href = "/activities"; // Redirect to activities
      }, 2000); // 2-second delay
    } catch (error) {
      // Handle login failure
      toast.error(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <AuthLayout title="Login">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Email Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            {...register("email")}
            autoComplete="email" // Autocomplete for email
            className={`mt-1 block w-full px-3 py-2 border ${
              errors.email ? "border-red-500" : "border-gray-300"
            } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
          />
          {errors.email && (
            <p className="mt-2 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        {/* Password Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            type="password"
            {...register("password")}
            autoComplete="current-password" // Autocomplete for login password
            className={`mt-1 block w-full px-3 py-2 border ${
              errors.password ? "border-red-500" : "border-gray-300"
            } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
          />
          {errors.password && (
            <p className="mt-2 text-sm text-red-600">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded-md shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 cursor-pointer"
        >
          Login
        </button>

        {/* Link to Register Page */}
        <p className="text-sm text-center text-gray-600">
          Don't have an account?{" "}
          <a
            href="/register"
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            Register
          </a>
        </p>
      </form>
    </AuthLayout>
  );
};

export default LoginForm;
