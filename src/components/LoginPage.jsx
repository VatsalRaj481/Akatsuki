import React, { useState, useContext } from "react"; // Added useContext
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import NotificationPopup from "../NotificationPopup";
import Footer from "../Footer";
import { UserContext } from "../UserContext"; // Import UserContext

const LoginPage = () => {
  const [loginData, setLoginData] = useState({ username: "", password: "" });
  const [notification, setNotification] = useState(null);
  const navigate = useNavigate();
  const { setUserData } = useContext(UserContext); // Access setUserData from context

  const handleChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (loginData.password.length < 8) {
      setNotification({ message: "Password must be at least 8 characters long.", type: "error" });
      return;
    }

    try {
      // Assuming your backend /auth/login returns { token: "...", username: "...", email: "..." }
      const response = await axios.post("http://localhost:8091/auth/login", loginData);

      // Store the JWT token in localStorage
      localStorage.setItem("userToken", response.data.token);

      // --- NEW: Set user data in UserContext and localStorage ---
      const userDataFromLogin = {
        username: response.data.username,
        email: response.data.email,
        profileImage: "/Naruto.jpg", // Default image path, or use response.data.profileImage if backend provides it
      };
      setUserData(userDataFromLogin); // Update the global context state
      localStorage.setItem("userData", JSON.stringify(userDataFromLogin)); // Persist user data in localStorage

      setNotification({ message: "Login successful!", type: "success" });

      setTimeout(() => {
        setNotification(null);
        navigate("/home");
      }, 1000);
    } catch (error) {
      console.error("Login error:", error); // Log the full error for debugging
      setNotification({
        message: error.response?.data || "Login failed. Check your credentials.",
        type: "error",
      });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <header className="absolute top-0 left-0 flex items-center gap-3 p-5 border-b border-gray-700 w-full">
        <svg className="w-10 h-10 text-white" viewBox="0 0 48 48" fill="none">
          <path
            d="M24 0.757355L47.2426 24L24 47.2426L0.757355 24L24 0.757355ZM21 35.7574V12.2426L9.24264 24L21 35.7574Z"
            fill="currentColor"
          />
        </svg>
        <h1 className="text-2xl font-bold">IMS</h1>
      </header>

      {notification && (
        <NotificationPopup
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}

      <main className="max-w-md w-full p-6 bg-gray-800 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold text-center mb-4">Welcome to IMS</h2>
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <input
            className="w-full p-3 bg-gray-700 rounded-md"
            type="text"
            name="username"
            placeholder="Enter username"
            value={loginData.username}
            onChange={handleChange}
            required
          />
          <input
            className="w-full p-3 bg-gray-700 rounded-md"
            type="password"
            name="password"
            placeholder="Enter password"
            value={loginData.password}
            onChange={handleChange}
            required
          />
          <button
            className="w-full p-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-md"
            type="submit"
          >
            Log in
          </button>
        </form>
        <div className="text-center mt-4 text-gray-400">
          <p>
            New to IMS?{" "}
            <NavLink to="/signup" className="font-bold text-blue-500">
              Sign up
            </NavLink>
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default LoginPage;
