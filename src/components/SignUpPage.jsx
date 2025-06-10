// import React, { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import axios from "axios";
// import NotificationPopup from "../NotificationPopup";
// import Footer from "../Footer";

// const SignUpPage = () => {
//   const [formData, setFormData] = useState({
//     username: "",
//     emailId: "", // Matches backend field
//     password: "",
//     confirmPassword: "",
//   });

//   const [notification, setNotification] = useState(null);
//   const [isSubmitting, setIsSubmitting] = useState(false); // Prevents duplicate requests
//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     //  Password Security Check (at least 8 characters, 1 uppercase, 1 number, 1 symbol)
//     const passwordRegex =
//       /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;

//     if (!passwordRegex.test(formData.password)) {
//       setNotification({
//         message:
//           "Password must be at least 8 characters, contain a number, uppercase letter, and symbol.",
//         type: "error",
//       });
//       return;
//     }

//     if (formData.password !== formData.confirmPassword) {
//       setNotification({
//         message: "Passwords do not match! Please try again.",
//         type: "error",
//       });
//       return;
//     }

//     try {
//       setIsSubmitting(true); // Prevent duplicate clicks

//       const response = await axios.post("http://localhost:8091/auth/register", {
//         username: formData.username,
//         emailId: formData.emailId,
//         password: formData.password,
//       });

//       setNotification({ message: response.data, type: "success" });

//       setTimeout(() => {
//         setNotification(null);
//         navigate("/login"); // Redirect after signup
//       }, 2000);
//     } catch (error) {
//       const errorMessage = error.response?.data?.message || "Signup failed!";
//       setNotification({ message: errorMessage, type: "error" });
//     } finally {
//       setIsSubmitting(false); // Reactivate the button
//     }
//   };

//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
//       {/* Header */}
//       <header className="absolute top-0 left-0 flex items-center gap-3 p-5 border-b border-gray-700 w-full">
//         <svg className="w-10 h-10 text-white" viewBox="0 0 48 48" fill="none">
//           <path
//             d="M24 0.757355L47.2426 24L24 47.2426L0.757355 24L24 0.757355ZM21 35.7574V12.2426L9.24264 24L21 35.7574Z"
//             fill="currentColor"
//           />
//         </svg>
//         <h1 className="text-2xl font-bold">IMS</h1>
//       </header>

//       {/* Notification Popups */}
//       {notification && (
//         <NotificationPopup
//           message={notification.message}
//           type={notification.type}
//           onClose={() => setNotification(null)}
//         />
//       )}

//       {/* Signup Form */}
//       <main className="max-w-sm w-full p-5 bg-gray-800 rounded-lg shadow-lg">
//         <h2 className="text-lg font-semibold text-center mb-3">
//           Create Your IMS Account
//         </h2>

//         <form onSubmit={handleSubmit} className="flex flex-col gap-3">
//           <input
//             className="w-full p-3 bg-gray-700 rounded-lg"
//             type="text"
//             name="username"
//             placeholder="Choose a username"
//             value={formData.username}
//             onChange={handleChange}
//             required
//           />
//           <input
//             className="w-full p-3 bg-gray-700 rounded-lg"
//             type="email"
//             name="emailId"
//             placeholder="Enter your email"
//             value={formData.emailId}
//             onChange={handleChange}
//             required
//           />
//           <input
//             className="w-full p-3 bg-gray-700 rounded-lg"
//             type="password"
//             name="password"
//             placeholder="Create a password"
//             value={formData.password}
//             onChange={handleChange}
//             required
//           />
//           <input
//             className="w-full p-3 bg-gray-700 rounded-lg"
//             type="password"
//             name="confirmPassword"
//             placeholder="Confirm your password"
//             value={formData.confirmPassword}
//             onChange={handleChange}
//             required
//           />

//           <button
//             className={`w-full p-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg ${
//               isSubmitting ? "opacity-50 cursor-not-allowed" : ""
//             }`}
//             type="submit"
//             disabled={isSubmitting}
//           >
//             {isSubmitting ? "Signing Up..." : "Sign Up"}
//           </button>
//         </form>

//         {/* Link to Login Page */}
//         <div className="text-center mt-3 text-gray-400 text-sm">
//           <p>
//             Already have an account?{" "}
//             <Link to="/login" className="font-bold text-blue-500">
//               Log in
//             </Link>
//           </p>
//         </div>
//       </main>

//       <Footer />
//     </div>
//   );
// };

// export default SignUpPage;

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

    // Password Security Check (at least 8 characters, 1 uppercase, 1 number, 1 symbol)
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
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-950 to-gray-800 text-white font-sans">
      {/* Consistent Navbar from HomePage */}
      <nav className="flex items-center justify-between p-4 bg-gray-900 shadow-xl border-b border-gray-700">
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-2">
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
              <p className="text-xs text-gray-400 mt-1">Inventory Management System</p>
            </div>
          </Link>
        </div>
      </nav>

      {/* Notification Popups */}
      {notification && (
        <NotificationPopup
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}

      {/* Signup Form - Adjusted box size and heading size */}
      <main className="flex-grow flex items-center justify-center p-8">
        <div className="max-w-sm w-full p-5 bg-gray-800 rounded-lg shadow-xl border border-gray-700"> {/* max-w-sm and p-5 */}
          <h2 className="text-2xl font-extrabold text-center mb-4 text-white"> {/* text-2xl and mb-4 */}
            Create Your IMS Account
          </h2>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <input
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-200"
              type="text"
              name="username"
              placeholder="Choose a username"
              value={formData.username}
              onChange={handleChange}
              required
            />
            <input
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-200"
              type="email"
              name="emailId"
              placeholder="Enter your email"
              value={formData.emailId}
              onChange={handleChange}
              required
            />
            <input
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-200"
              type="password"
              name="password"
              placeholder="Create a password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <input
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-200"
              type="password"
              name="confirmPassword"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />

            <button
              className={`w-full p-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-md transition-colors duration-300 ease-in-out transform hover:scale-105 ${
                isSubmitting ? "opacity-50 cursor-not-allowed" : ""
              }`}
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Signing Up..." : "Sign Up"}
            </button>
          </form>

          {/* Link to Login Page */}
          <div className="text-center mt-6 text-gray-400 text-sm">
            <p>
              Already have an account?{" "}
              <Link to="/login" className="font-bold text-blue-500 hover:text-blue-400 transition-colors">
                Log in
              </Link>
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default SignUpPage;