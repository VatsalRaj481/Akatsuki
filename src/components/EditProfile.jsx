import React, { useState, useContext, useEffect } from "react";
import { UserContext } from "../UserContext";
import NotificationPopup from "../NotificationPopup";
import Footer from "../Footer";
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate
import axios from "axios"; // Import axios

const EditProfilePage = () => {
  const { userData, setUserData } = useContext(UserContext);
  const navigate = useNavigate(); // Initialize navigate

  const [formData, setFormData] = useState({
    username: userData ? userData.username : "",
    email: userData ? userData.email : "",
    currentPassword: "", // New field for current password verification
    newPassword: "",     // Renamed from 'password' for clarity
    confirmNewPassword: "", // Renamed from 'confirmPassword'
  });

  const [notification, setNotification] = useState(null);
  const [imagePreview, setImagePreview] = useState(userData ? userData.profileImage : "/default-profile.jpg");

  // Effect to update formData when userData changes (e.g., after initial load or logout/login)
  useEffect(() => {
    if (userData) {
      setFormData(prevFormData => ({
        ...prevFormData, // Keep password fields as they are (don't pre-fill)
        username: userData.username,
        email: userData.email,
      }));
      setImagePreview(userData.profileImage || "/default-profile.jpg");
    } else {
      // If userData becomes null (e.g., user logs out), reset form
      setFormData({ username: "", email: "", currentPassword: "", newPassword: "", confirmNewPassword: "" });
      setImagePreview("/default-profile.jpg");
    }
  }, [userData]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageURL = URL.createObjectURL(file);
      setImagePreview(imageURL);
      const updatedUserData = { ...userData, profileImage: imageURL };
      setUserData(updatedUserData);
      localStorage.setItem("userData", JSON.stringify(updatedUserData));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Determine if password is being changed
    const isPasswordChangeAttempt = formData.newPassword.length > 0 || formData.confirmNewPassword.length > 0;

    if (isPasswordChangeAttempt) {
      if (formData.newPassword !== formData.confirmNewPassword) {
        setNotification({
          message: "New passwords do not match! Please try again.",
          type: "error",
        });
        return;
      }
      if (formData.newPassword.length < 8) {
        setNotification({
          message: "New password must be at least 8 characters long.",
          type: "error",
        });
        return;
      }
      if (!formData.currentPassword || formData.currentPassword.length === 0) {
          setNotification({
              message: "Current password is required to change your password.",
              type: "error",
          });
          return;
      }
    }

    try {
      const token = localStorage.getItem("userToken");
      if (!token) {
        setNotification({ message: "Authentication token not found. Please log in.", type: "error" });
        navigate("/login"); // Redirect to login if no token
        return;
      }

      // Prepare data for the API call
      const updatePayload = {
        username: formData.username,
        email: formData.email,
      };

      // Only add password fields if a change is intended
      if (isPasswordChangeAttempt) {
        updatePayload.currentPassword = formData.currentPassword;
        updatePayload.newPassword = formData.newPassword;
      }

      // API Call to backend
      const response = await axios.put(
        "http://localhost:8091/auth/profile", // Match your backend endpoint
        updatePayload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // --- Frontend state update after successful backend call ---
      const updatedUserData = {
        ...userData,
        username: formData.username,
        email: formData.email,
        // profileImage is handled by handleImageUpload, no need to update here again
      };
      setUserData(updatedUserData);
      localStorage.setItem("userData", JSON.stringify(updatedUserData));

      setNotification({
        message: response.data || "Profile updated successfully!",
        type: "success",
      });

      // Clear password fields after successful submission
      setFormData(prev => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      }));

      // Redirect to home page after a short delay
      setTimeout(() => {
        setNotification(null);
        navigate("/home");
      }, 1500); // Redirect after 1.5 seconds to show success message
    } catch (error) {
      console.error("Failed to update profile:", error);
      setNotification({
        message: error.response?.data || "Failed to update profile. Please try again.",
        type: "error",
      });
    }
  };

  if (!userData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        <p>Please log in to view your profile.</p>
        <Link to="/login" className="font-bold text-blue-500 ml-2">Go to Login</Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <header className="absolute top-0 left-0 flex items-center gap-3 p-5 border-b border-gray-700 w-full">
        <Link to="/">
          <svg className="w-10 h-10 text-white" viewBox="0 0 48 48" fill="none">
            <path d="M24 0.757355L47.2426 24L24 47.2426L0.757355 24L24 0.757355ZM21 35.7574V12.2426L9.24264 24L21 35.7574Z" fill="currentColor" />
          </svg>
        </Link>
        <h1 className="text-2xl font-bold">IMS</h1>
      </header>

      {notification && (
        <NotificationPopup
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}

      <h1 className="text-2xl font-bold text-center mt-20">Edit Profile</h1>
      <main className="max-w-2xl w-full p-6 bg-gray-800 rounded-lg shadow-lg mt-4 flex flex-row items-center justify-between">
        {/* Left Side - Form Fields */}
        <form onSubmit={handleSubmit} className="w-1/2 flex flex-col gap-4 pr-4">
          <input className="w-full p-3 bg-gray-700 rounded-full" type="text" name="username" placeholder="Update your username" value={formData.username} onChange={handleChange} required />
          <input className="w-full p-3 bg-gray-700 rounded-full" type="email" name="email" placeholder="Update your email" value={formData.email} onChange={handleChange} required />

          <hr className="border-gray-600 my-2" /> {/* Separator for password fields */}
          <p className="text-gray-400 text-sm">Change Password (leave blank if not changing)</p>

          <input className="w-full p-3 bg-gray-700 rounded-full" type="password" name="currentPassword" placeholder="Current Password" value={formData.currentPassword} onChange={handleChange} />
          <input className="w-full p-3 bg-gray-700 rounded-full" type="password" name="newPassword" placeholder="New Password" value={formData.newPassword} onChange={handleChange} />
          <input className="w-full p-3 bg-gray-700 rounded-full" type="password" name="confirmNewPassword" placeholder="Confirm New Password" value={formData.confirmNewPassword} onChange={handleChange} />

          <button className="w-full p-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-full" type="submit">
            Save Changes
          </button>
        </form>

        {/* Right Side - Profile Image Upload */}
        <div className="w-1/2 flex flex-col items-center pl-4">
          <label className="cursor-pointer">
            <img src={imagePreview} alt="Profile" className="w-28 h-28 rounded-full border-2 border-gray-500 shadow-lg hover:opacity-80 transition duration-300" />
            <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
          </label>
          <p className="text-gray-400 text-sm mt-2">Click to change profile photo</p>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default EditProfilePage;