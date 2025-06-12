import React, { useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "./UserContext";
import Footer from "./Footer";

const AboutUs = () => {
  const { userData } = useContext(UserContext); // Needed for the profile image in the navbar
  const navigate = useNavigate(); // Needed for potential programmatic navigation, though Link is used here

  // You might not need the useEffect for login redirection on a static About Us page,
  // but if the navbar relies on userData, keeping it might be safer for consistent behavior.
  useEffect(() => {
    // If you want the About Us page to also redirect if not logged in, keep this:
    if (!userData) {
      navigate("/login");
    }
    // If About Us should be publicly accessible even if not logged in, remove this useEffect or comment it out.
  }, [userData, navigate]);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-950 to-gray-800 text-white font-sans">
      {/* Navbar - Copied from HomePage */}
      <nav className="flex items-center justify-between p-4 bg-gray-900 shadow-xl border-b border-gray-700">
        {/* Top Left - Logo, Title & Tagline */}
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
              <p className="text-xs text-gray-400 mt-1">
                Inventory Management System
              </p>
            </div>
          </Link>
        </div>

        {/* Top Right - About Us Button & Profile Image */}
        <div className="flex items-center gap-6">
          {/* Profile Image */}
          <Link to="/profile">
            <img
              src={userData?.profileImage}
              alt="Profile"
              className="w-12 h-12 rounded-full border-2 border-blue-500 shadow-xl cursor-pointer object-cover
                         transition-all duration-300 ease-in-out hover:border-purple-400 hover:scale-105"
            />
          </Link>
        </div>
      </nav>

      {/* Main Content Area for About Us */}
      <main className="flex-grow flex items-center justify-center py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h1
            className="text-4xl md:text-5xl font-extrabold text-center mb-8
                       bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 text-transparent bg-clip-text"
          >
            About Our Inventory Management System
          </h1>

          <div
            className="bg-gray-800 shadow-xl rounded-2xl p-6 md:p-10
                      border border-gray-700 transition-all duration-300 ease-in-out"
          >
            <p className="text-lg text-gray-300 mb-5 leading-relaxed">
              Welcome to our Inventory Management System (IMS) — a robust,
              user-friendly platform designed to streamline and automate your
              business operations across product, order, stock, supplier, and
              reporting management.
            </p>

            <p className="text-lg text-gray-300 mb-5 leading-relaxed">
              Built with a modern technology stack including Spring Boot for
              the backend and React for the frontend, our system supports a
              seamless and secure experience. It leverages REST APIs, JWT-based
              authentication, microservices architecture, and real-time data
              handling for optimal performance.
            </p>

            <p className="text-lg text-gray-300 mb-5 leading-relaxed">
              This project was developed as part of our internship at
              Cognizant, where we worked in an Agile team to design,
              implement, and test an end-to-end enterprise-grade inventory
              solution. From product tracking to supplier coordination and
              analytics, every module has been thoughtfully crafted to meet
              industry standards.
            </p>

            <p className="text-lg text-gray-300 mb-5 leading-relaxed">
              Our goal is to empower businesses to gain full visibility over
              their inventory, reduce manual errors, and make data-driven
              decisions with confidence.
            </p>

            <p className="text-lg text-gray-300 leading-relaxed">
              Thank you for exploring our system. We hope it adds significant
              value to your organization’s operational efficiency!
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AboutUs;
