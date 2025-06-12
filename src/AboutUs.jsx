import React from "react";

const AboutUs = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-950 to-gray-800 text-white font-sans">
      {/* Main content area, centered vertically and horizontally */}
      <main className="flex-grow flex items-center justify-center py-12 px-4">
        <div className="max-w-4xl mx-auto">
          {" "}
          {/* Adjusted max-width for better readability */}
          {/* Header with gradient text, similar to HomePage main titles */}
          <h1
            className="text-4xl md:text-5xl font-extrabold text-center mb-8
                       bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 text-transparent bg-clip-text"
          >
            About Our Inventory Management System
          </h1>
          {/* Content container with dark background, shadow, and border like feature cards */}
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
    </div>
  );
};

export default AboutUs;
