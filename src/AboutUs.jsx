import React from 'react'; 

const AboutUs = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-center mb-6 text-gray-800">About Us</h1>
      
      <div className="bg-white shadow-lg rounded-2xl p-6 md:p-10">
        <p className="text-lg text-gray-700 mb-4 leading-relaxed">
          Welcome to our <strong>Inventory Management System</strong> — a robust, user-friendly platform designed to streamline and automate your business operations across product, order, stock, supplier, and reporting management.
        </p>

        <p className="text-lg text-gray-700 mb-4 leading-relaxed">
          Built with a modern technology stack including <strong>Spring Boot</strong> for the backend and <strong>React</strong> for the frontend, our system supports a seamless and secure experience. It leverages REST APIs, JWT-based authentication, microservices architecture, and real-time data handling for optimal performance.
        </p>

        <p className="text-lg text-gray-700 mb-4 leading-relaxed">
          This project was developed as part of our internship at <strong>Cognizant</strong>, where we worked in an Agile team to design, implement, and test an end-to-end enterprise-grade inventory solution. From product tracking to supplier coordination and analytics, every module has been thoughtfully crafted to meet industry standards.
        </p>

        <p className="text-lg text-gray-700 mb-4 leading-relaxed">
          Our goal is to empower businesses to gain full visibility over their inventory, reduce manual errors, and make data-driven decisions with confidence.
        </p>

        <p className="text-lg text-gray-700 leading-relaxed">
          Thank you for exploring our system. We hope it adds value to your organization’s operational efficiency!
        </p>
      </div>
    </div>
  );
};

export default AboutUs;

