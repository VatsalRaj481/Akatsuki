import React, { useState, useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import NotificationPopup from "../NotificationPopup";
import Footer from "../Footer";
import { UserContext } from "../UserContext";

const LoginPage = () => {
  const [loginData, setLoginData] = useState({ username: "", password: "" });

  const [notification, setNotification] = useState(null);
  const navigate = useNavigate();
  const { setUserData } = useContext(UserContext);

  const handleChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (loginData.password.length < 8) {
      setNotification({
        message: "Password must be at least 8 characters long.",
        type: "error",
      });
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8091/auth/login",
        loginData
      );

      localStorage.setItem("userToken", response.data.token);

      const userDataFromLogin = {
        username: response.data.username,
        email: response.data.email,
        profileImage: "/Naruto.jpg",
      };
      setUserData(userDataFromLogin);
      localStorage.setItem("userData", JSON.stringify(userDataFromLogin));

      setNotification({ message: "Login successful!", type: "success" });

      setTimeout(() => {
        setNotification(null);
        navigate("/");
      }, 1000);
    } catch (error) {
      console.error("Login error:", error);
      setNotification({
        message:
          error.response?.data || "Login failed. Check your credentials.",
        type: "error",
      });
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-950 to-gray-800 text-white font-sans">
      {/* Consistent Navbar from HomePage */}
      <nav className="flex items-center justify-between p-4 bg-gray-900 shadow-xl border-b border-gray-700">
        <div className="flex items-center gap-4">
          <svg
            className="w-10 h-10 text-blue-400 cursor-pointer hover:scale-110 transition duration-300 ease-in-out"
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M24 0.757355L47.2426 24L24 47.2426L0.757355 24L24 0.757355ZM21 35.7574V12.2426L9.24264 24L21 35.7574Z"
              fill="currentColor"
            />
          </svg>
          <div>
            <h1 className="text-2xl font-extrabold bg-gradient-to-r from-blue-300 to-purple-400 text-transparent bg-clip-text leading-none">
              IMS
            </h1>
            <p className="text-xs text-gray-400 mt-1">
              Inventory Management System
            </p>
          </div>
        </div>
      </nav>

      {notification && (
        <NotificationPopup
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}

      {/* Main content: Login form - Adjusted box size and heading size */}
      <main className="flex-grow flex items-center justify-center p-8">
        <div className="max-w-sm w-full p-5 bg-gray-800 rounded-lg shadow-xl border border-gray-700">
          {" "}
          {/* max-w-sm and p-5 */}
          <h2 className="text-2xl font-extrabold text-center mb-4 text-white">
            {" "}
            {/* text-2xl and mb-4 */}
            Login
          </h2>
          <form onSubmit={handleLogin} className="flex flex-col gap-5">
            <input
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-200"
              type="text"
              name="username"
              placeholder="Enter username"
              value={loginData.username}
              onChange={handleChange}
              required
            />
            <input
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-200"
              type="password"
              name="password"
              placeholder="Enter password"
              value={loginData.password}
              onChange={handleChange}
              required
            />
            <button
              className="w-full p-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-md transition-colors duration-300 ease-in-out transform hover:scale-105"
              type="submit"
            >
              Log in
            </button>
          </form>
          <div className="text-center mt-6 text-gray-400 text-sm">
            <p>
              New to IMS?{" "}
              <NavLink
                to="/signup"
                className="font-bold text-blue-500 hover:text-blue-400 transition-colors"
              >
                Sign up
              </NavLink>
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default LoginPage;
