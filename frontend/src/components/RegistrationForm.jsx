import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AuthLayout from "./AuthLayout";

// Validation schema
const schema = Yup.object().shape({
  fullname: Yup.string()
    .min(6, "Name must be at least 4 characters")
    .required("Name is required"),
  username: Yup.string().required("Username is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  timezone: Yup.string().required("Timezone is required"), // Ensure timezone is required
});

const RegistrationForm = () => {
  const {
    register,
    handleSubmit,
    setValue, // Used to set the value of the timezone field
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  // Detect the user's timezone using the browser
  useEffect(() => {
    const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    // Set the detected timezone in the form
    setValue("timezone", userTimezone);
  }, [setValue]);

  const onSubmit = async (data) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/users/register",
        data
      );
      toast.success(
        response.data?.message ||
          "Registration successful! Redirecting to login..."
      );

      // Store email and password in session storage
      sessionStorage.setItem("preFilledEmail", data.email);
      sessionStorage.setItem("preFilledPassword", data.password);

      // Delay redirection to allow the toast to display
      setTimeout(() => {
        window.location.href = "/login"; // Redirect to login page
      }, 2000); // 3-second delay
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <AuthLayout title="Register">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Name Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Full Name
          </label>
          <input
            type="text"
            {...register("fullname")}
            autoComplete="fullname" // Autocomplete for fullname
            className={`mt-1 block w-full px-3 py-2 border ${
              errors.fullname ? "border-red-500" : "border-gray-300"
            } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
          />
          {errors.fullname && (
            <p className="mt-2 text-sm text-red-600">
              {errors.fullname.message}
            </p>
          )}
        </div>
        {/* Username Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Username
          </label>
          <input
            type="text"
            {...register("username")}
            autoComplete="username" // Autocomplete for username
            className={`mt-1 block w-full px-3 py-2 border ${
              errors.username ? "border-red-500" : "border-gray-300"
            } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
          />
          {errors.username && (
            <p className="mt-2 text-sm text-red-600">
              {errors.username.message}
            </p>
          )}
        </div>

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
            autoComplete="new-password" // Autocomplete for registration password
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

        {/* Timezone Field (Hidden) */}
        <input
          type="hidden"
          {...register("timezone")} // Register the timezone field
        />

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded-md shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 cursor-pointer"
        >
          Register
        </button>

        {/* Link to Login Page */}
        <p className="text-sm text-center text-gray-600">
          Already have an account?{" "}
          <a
            href="/login"
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            Login
          </a>
        </p>
      </form>
    </AuthLayout>
  );
};

export default RegistrationForm;
