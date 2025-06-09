import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import NotificationPopup from "../NotificationPopup";
import Footer from "../Footer";

const SignUpPage = () => {
  const [formData, setFormData] = useState({
    username: "",
    emailId: "", // Matches backend field
    password: "",
    confirmPassword: "",
  });

  const [notification, setNotification] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false); // Prevents duplicate requests
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    //  Password Security Check (at least 8 characters, 1 uppercase, 1 number, 1 symbol)
    const passwordRegex =
      /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;

    if (!passwordRegex.test(formData.password)) {
      setNotification({
        message:
          "Password must be at least 8 characters, contain a number, uppercase letter, and symbol.",
        type: "error",
      });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setNotification({
        message: "Passwords do not match! Please try again.",
        type: "error",
      });
      return;
    }

    try {
      setIsSubmitting(true); // Prevent duplicate clicks

      const response = await axios.post("http://localhost:8091/auth/register", {
        username: formData.username,
        emailId: formData.emailId,
        password: formData.password,
      });

      setNotification({ message: response.data, type: "success" });

      setTimeout(() => {
        setNotification(null);
        navigate("/login"); // Redirect after signup
      }, 2000);
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Signup failed!";
      setNotification({ message: errorMessage, type: "error" });
    } finally {
      setIsSubmitting(false); // Reactivate the button
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="absolute top-0 left-0 flex items-center gap-3 p-5 border-b border-gray-700 w-full">
        <svg className="w-10 h-10 text-white" viewBox="0 0 48 48" fill="none">
          <path
            d="M24 0.757355L47.2426 24L24 47.2426L0.757355 24L24 0.757355ZM21 35.7574V12.2426L9.24264 24L21 35.7574Z"
            fill="currentColor"
          />
        </svg>
        <h1 className="text-2xl font-bold">IMS</h1>
      </header>

      {/* Notification Popups */}
      {notification && (
        <NotificationPopup
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}

      {/* Signup Form */}
      <main className="max-w-sm w-full p-5 bg-gray-800 rounded-lg shadow-lg">
        <h2 className="text-lg font-semibold text-center mb-3">
          Create Your IMS Account
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            className="w-full p-3 bg-gray-700 rounded-lg"
            type="text"
            name="username"
            placeholder="Choose a username"
            value={formData.username}
            onChange={handleChange}
            required
          />
          <input
            className="w-full p-3 bg-gray-700 rounded-lg"
            type="email"
            name="emailId"
            placeholder="Enter your email"
            value={formData.emailId}
            onChange={handleChange}
            required
          />
          <input
            className="w-full p-3 bg-gray-700 rounded-lg"
            type="password"
            name="password"
            placeholder="Create a password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <input
            className="w-full p-3 bg-gray-700 rounded-lg"
            type="password"
            name="confirmPassword"
            placeholder="Confirm your password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />

          <button
            className={`w-full p-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg ${
              isSubmitting ? "opacity-50 cursor-not-allowed" : ""
            }`}
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Signing Up..." : "Sign Up"}
          </button>
        </form>

        {/* Link to Login Page */}
        <div className="text-center mt-3 text-gray-400 text-sm">
          <p>
            Already have an account?{" "}
            <Link to="/login" className="font-bold text-blue-500">
              Log in
            </Link>
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default SignUpPage;
