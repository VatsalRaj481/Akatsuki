// import React, { useContext } from "react";
// import { UserContext } from "../UserContext";
// import Footer from "../Footer";
// import { Link } from "react-router-dom";

// const HomePage = () => {
//   const { userData } = useContext(UserContext); // Access global user data
//   return (
//     <div className="flex flex-col min-h-screen bg-gray-900 text-white">
//       {/* Navbar */}
//       <nav className="flex items-center justify-between p-4 bg-gray-800 shadow-md">
//         {/* Left Side - Logo */}
//         <div className="flex items-center gap-3">
//           <Link to={"/home"}>
//             <svg
//               className="w-10 h-10 text-white cursor-pointer hover:opacity-80 transition duration-300"
//               viewBox="0 0 48 48"
//               fill="none"
//             >
//               <path
//                 d="M24 0.757355L47.2426 24L24 47.2426L0.757355 24L24 0.757355ZM21 35.7574V12.2426L9.24264 24L21 35.7574Z"
//                 fill="currentColor"
//               />
//             </svg>
//           </Link>
//           <h1 className="text-xl font-bold">IMS</h1>
//         </div>

//         {/* Search Bar */}
//         <input
//           type="text"
//           placeholder="Search..."
//           className="px-4 py-2 bg-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:outline-none w-1/3"
//         />

//         {/* Right Side - Navigation & Profile */}
//         <div className="flex items-center gap-6">
//           <Link to="/order">
//             <button className="text-white font-semibold transition-all hover:text-blue-400">
//               Orders
//             </button>
//           </Link>
//           <Link to="/product">
//             <button className="text-white font-semibold transition-all hover:text-blue-400">
//               Products
//             </button>
//           </Link>
//           <Link to="/suppliers">
//             <button className="text-white font-semibold transition-all hover:text-blue-400">
//               Suppliers
//             </button>
//           </Link>
//           <Link to="/reports">
//           <button className="text-white font-semibold transition-all hover:text-blue-400">
//             Reports
//           </button>
//           </Link>

//           {/* Profile Photo (Click to Go to Profile Page) */}
//           <Link to="/profile">
//             <img
//               src={userData.profileImage} // Dynamically fetch profile image from context
//               alt="Profile"
//               className="w-12 h-12 rounded-full border-2 border-gray-500 shadow-lg cursor-pointer hover:opacity-80 transition duration-300"
//             />
//           </Link>
//         </div>
//       </nav>

//       {/* Main Content */}
//       <main className="flex flex-grow items-center justify-center">
//         <div className="text-center">
//           <svg
//             className="w-16 h-16 text-blue-500 mx-auto"
//             viewBox="0 0 48 48"
//             fill="none"
//           >
//             <path
//               d="M24 0.757355L47.2426 24L24 47.2426L0.757355 24L24 0.757355ZM21 35.7574V12.2426L9.24264 24L21 35.7574Z"
//               fill="currentColor"
//             />
//           </svg>
//           <h2 className="text-3xl font-extrabold mt-4 bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
//             Welcome to IMS
//           </h2>
//         </div>
//       </main>

//       <Footer />
//     </div>
//   );
// };

// export default HomePage;


import React, { useContext, useEffect } from "react";
import { UserContext } from "../UserContext";
import { Link, useNavigate } from "react-router-dom";
import Footer from "../Footer";

const HomePage = () => {
  const { userData } = useContext(UserContext); // Access global user data
  const navigate = useNavigate(); // Use navigate hook for redirection

  useEffect(() => {
    if (!userData) {
      navigate("/");
    }
  }, [userData, navigate]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white">
      {/* Navbar */}
      <nav className="flex items-center justify-between p-4 bg-gray-800 shadow-md">
        {/* Left Side - Logo */}
        <div className="flex items-center gap-3">
          <Link to="/home">
            <svg
              className="w-10 h-10 text-white cursor-pointer hover:opacity-80 transition duration-300"
              viewBox="0 0 48 48"
              fill="none"
            >
              <path
                d="M24 0.757355L47.2426 24L24 47.2426L0.757355 24L24 0.757355ZM21 35.7574V12.2426L9.24264 24L21 35.7574Z"
                fill="currentColor"
              />
            </svg>
          </Link>
          <h1 className="text-xl font-bold">IMS</h1>
        </div>

        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search..."
          className="px-4 py-2 bg-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:outline-none w-1/3"
        />

        {/* Right Side - Navigation & Profile */}
        <div className="flex items-center gap-6">
          <Link to="/order">
            <button className="text-white font-semibold transition-all hover:text-blue-400">
              Orders
            </button>
          </Link>
          <Link to="/product">
            <button className="text-white font-semibold transition-all hover:text-blue-400">
              Products
            </button>
          </Link>
          <Link to="/suppliers">
            <button className="text-white font-semibold transition-all hover:text-blue-400">
              Suppliers
            </button>
          </Link>
          <Link to="/reports">
            <button className="text-white font-semibold transition-all hover:text-blue-400">
              Reports
            </button>
          </Link>

          {/* Profile Photo (Click to Go to Profile Page) */}
          <Link to="/profile">
            <img
              src={userData?.profileImage} // Ensure safe access to profileImage
              alt="Profile"
              className="w-12 h-12 rounded-full border-2 border-gray-500 shadow-lg cursor-pointer hover:opacity-80 transition duration-300"
            />
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex flex-grow items-center justify-center">
        <div className="text-center">
          <svg
            className="w-16 h-16 text-blue-500 mx-auto"
            viewBox="0 0 48 48"
            fill="none"
          >
            <path
              d="M24 0.757355L47.2426 24L24 47.2426L0.757355 24L24 0.757355ZM21 35.7574V12.2426L9.24264 24L21 35.7574Z"
              fill="currentColor"
            />
          </svg>
          <h2 className="text-3xl font-extrabold mt-4 bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
            Welcome to IMS
          </h2>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default HomePage;
