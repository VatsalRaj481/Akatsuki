// import React, { useContext } from "react";
// import { UserContext } from "../UserContext"; // Import context
// import Footer from "../Footer";
// import { Link } from "react-router-dom";
// import Logout from "../Logout"; // Assuming Logout is in the same directory, or adjust path if necessary

// const ProfilePage = () => {
//   const { userData } = useContext(UserContext);

//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
//       {/* Navbar */}
//       <header className="absolute top-0 left-0 flex items-center justify-between p-5 border-b border-gray-700 w-full">
//         {/* Left Side - IMS Logo & Text Together */}
//         <Link to={"/"} className="flex items-center gap-3">
//           <svg className="w-10 h-10 text-white" viewBox="0 0 48 48" fill="none">
//             <path
//               d="M24 0.757355L47.2426 24L24 47.2426L0.757355 24L24 0.757355ZM21 35.7574V12.2426L9.24264 24L21 35.7574Z"
//               fill="currentColor"
//             />
//           </svg>
//           <h1 className="text-2xl font-bold">IMS</h1>
//         </Link>
//       </header>

//       <h2 className="text-2xl font-bold text-center mt-1">User Profile</h2>

//       {/* Profile Information */}
//       <main className="max-w-lg w-full p-6 bg-gray-800 rounded-lg shadow-lg mt-7 flex flex-row items-center justify-between">
//         {/* Left Side - User Details */}
//         <div className="w-1/2 flex flex-col gap-4">
//           <p className="text-lg font-semibold">Username:</p>
//           <p className="p-3 bg-gray-700 rounded-full">{userData.username}</p>

//           <p className="text-lg font-semibold">Email:</p>
//           <p className="p-3 bg-gray-700 rounded-full">{userData.email}</p>
//         </div>

//         {/* Right Side - Profile Image */}
//         <div className="w-1/2 flex flex-col items-center">
//           <img
//             src={userData.profileImage}
//             alt="Profile"
//             className="w-40 h-40 rounded-full border-2 border-gray-500 shadow-lg"
//           />
//           <p className="text-gray-400 text-sm mt-2">Profile Photo</p>
//         </div>
//       </main>

//       {/* Buttons: Edit Profile and Logout */}
//       <div className="flex gap-4 w-full max-w-lg mt-4">
//         <Link to="/edit" className="flex-grow">
//           <button className="w-full p-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-full">
//             Edit Profile
//           </button>
//         </Link>
//         {/* Pass the exact same className to Logout, ensuring flex-grow is on its wrapper */}
//         <div className="flex-grow">
//           <Logout
//             className="w-full p-3 text-white font-bold rounded-full" // Removed bg-red and hover-bg-red
//           />
//         </div>
//       </div>

//       <Footer />
//     </div>
//   );
// };

// export default ProfilePage;

import React, { useContext } from "react";
import { UserContext } from "../UserContext";
import Footer from "../Footer";
import { Link } from "react-router-dom";
import Logout from "../Logout"; // Ensure this path is correct

const ProfilePage = () => {
  const { userData } = useContext(UserContext);

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

      {/* Main Content Area */}
      <main className="flex-grow flex flex-col items-center justify-center p-8">
        <h2 className="text-3xl font-extrabold text-center mb-6 text-white">
          User Profile
        </h2>

        {/* Profile Information Card */}
        <div className="max-w-xl w-full p-6 bg-gray-800 rounded-lg shadow-xl border border-gray-700 flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Left Side - User Details */}
          <div className="flex-1 flex flex-col gap-4 w-full md:w-auto">
            <div>
              <p className="text-lg font-semibold text-gray-300 mb-1">Username:</p>
              <p className="p-3 bg-gray-700 rounded-md text-white font-medium break-words">
                {userData?.username || "N/A"}
              </p>
            </div>

            <div>
              <p className="text-lg font-semibold text-gray-300 mb-1">Email:</p>
              <p className="p-3 bg-gray-700 rounded-md text-white font-medium break-words">
                {userData?.email || "N/A"}
              </p>
            </div>
          </div>

          {/* Right Side - Profile Image */}
          <div className="flex-none flex flex-col items-center md:items-end">
            <img
              src={userData?.profileImage || "/Naruto.jpg"}
              alt="Profile"
              className="w-36 h-36 rounded-full border-4 border-blue-500 shadow-lg object-cover transform transition-transform duration-300 hover:scale-105"
            />
            <p className="text-gray-400 text-sm mt-3">Your Profile Photo</p>
          </div>
        </div>

        {/* Buttons: Edit Profile and Logout */}
        <div className="flex flex-col md:flex-row gap-4 w-full max-w-xl mt-6">
          <Link to="/edit" className="flex-grow">
            <button className="w-full p-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-md transition-colors duration-300 ease-in-out transform hover:scale-105">
              Edit Profile
            </button>
          </Link>
          <div className="flex-grow">
            <Logout
              // These classes will now be correctly applied by Logout.jsx
              className="w-full p-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg shadow-md transition-colors duration-300 ease-in-out transform hover:scale-105"
            />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProfilePage;