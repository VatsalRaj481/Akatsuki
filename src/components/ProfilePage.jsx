import React, { useContext } from "react";
import { UserContext } from "../UserContext"; // Import context
import Footer from "../Footer";
import { Link } from "react-router-dom";
import Logout from "../Logout"; // Assuming Logout is in the same directory, or adjust path if necessary

const ProfilePage = () => {
  const { userData } = useContext(UserContext);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      {/* Navbar */}
      <header className="absolute top-0 left-0 flex items-center justify-between p-5 border-b border-gray-700 w-full">
        {/* Left Side - IMS Logo & Text Together */}
        <Link to={"/home"} className="flex items-center gap-3">
          <svg className="w-10 h-10 text-white" viewBox="0 0 48 48" fill="none">
            <path
              d="M24 0.757355L47.2426 24L24 47.2426L0.757355 24L24 0.757355ZM21 35.7574V12.2426L9.24264 24L21 35.7574Z"
              fill="currentColor"
            />
          </svg>
          <h1 className="text-2xl font-bold">IMS</h1>
        </Link>
      </header>

      <h2 className="text-2xl font-bold text-center mt-1">User Profile</h2>

      {/* Profile Information */}
      <main className="max-w-lg w-full p-6 bg-gray-800 rounded-lg shadow-lg mt-7 flex flex-row items-center justify-between">
        {/* Left Side - User Details */}
        <div className="w-1/2 flex flex-col gap-4">
          <p className="text-lg font-semibold">Username:</p>
          <p className="p-3 bg-gray-700 rounded-full">{userData.username}</p>

          <p className="text-lg font-semibold">Email:</p>
          <p className="p-3 bg-gray-700 rounded-full">{userData.email}</p>
        </div>

        {/* Right Side - Profile Image */}
        <div className="w-1/2 flex flex-col items-center">
          <img
            src={userData.profileImage}
            alt="Profile"
            className="w-40 h-40 rounded-full border-2 border-gray-500 shadow-lg"
          />
          <p className="text-gray-400 text-sm mt-2">Profile Photo</p>
        </div>
      </main>

      {/* Buttons: Edit Profile and Logout */}
      <div className="flex gap-4 w-full max-w-lg mt-4">
        <Link to="/edit" className="flex-grow">
          <button className="w-full p-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-full">
            Edit Profile
          </button>
        </Link>
        {/* Pass the exact same className to Logout, ensuring flex-grow is on its wrapper */}
        <div className="flex-grow">
          <Logout
            className="w-full p-3 text-white font-bold rounded-full" // Removed bg-red and hover-bg-red
          />
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ProfilePage;