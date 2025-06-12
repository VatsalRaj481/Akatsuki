// import React, { useContext, useEffect } from "react";
// import { UserContext } from "../UserContext";
// import { Link, useNavigate } from "react-router-dom";
// import Footer from "../Footer";

// // Icon components (You can move these to a separate file like 'src/components/Icons.jsx')
// const ProductIcon = () => (
//   <svg className="w-10 h-10 mx-auto mb-2 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"></path></svg>
// );

// const OrderIcon = () => (
//   <svg className="w-10 h-10 mx-auto mb-2 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M17 16l4 4m0 0l-4-4m4 4V12"></path></svg>
// );

// const ReportIcon = () => (
//   <svg className="w-10 h-10 mx-auto mb-2 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19V6l2-2 2 2v13M9 19H7a2 2 0 01-2-2V5a2 2 0 012-2h10a2 2 0 012 2v12a2 2 0 01-2 2h-2M9 19v-2m-2 2H5m14 0h-2"></path></svg>
// );

// const SupplierIcon = () => (
//   <svg className="w-10 h-10 mx-auto mb-2 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h2a2 2 0 002-2V8a2 2 0 00-2-2h-2M4 18V6a2 2 0 012-2h10a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2zm0 0H2a2 2 0 00-2 2v2h2V18zm0 0h2v2H4v-2z"></path></svg>
// );


// const HomePage = () => {
//   const { userData } = useContext(UserContext);
//   const navigate = useNavigate();

//   useEffect(() => {
//     if (!userData) {
//       navigate("/login");
//     }
//   }, [userData, navigate]);

//   return (
//     <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-950 to-gray-800 text-white font-sans">
//       {/* Navbar */}
//       <nav className="flex items-center justify-between p-4 bg-gray-900 shadow-xl border-b border-gray-700">
//         {/* Top Left - Logo, Title & Tagline */}
//         <div className="flex items-center gap-4">
//           <Link to="/" className="flex items-center gap-2">
//             <svg
//               className="w-10 h-10 text-blue-400 cursor-pointer hover:scale-110 transition duration-300 ease-in-out"
//               viewBox="0 0 48 48"
//               fill="none"
//               xmlns="http://www.w3.org/2000/svg"
//             >
//               <path
//                 d="M24 0.757355L47.2426 24L24 47.2426L0.757355 24L24 0.757355ZM21 35.7574V12.2426L9.24264 24L21 35.7574Z"
//                 fill="currentColor"
//               />
//             </svg>
//             <div>
//               <h1 className="text-2xl font-extrabold bg-gradient-to-r from-blue-300 to-purple-400 text-transparent bg-clip-text leading-none">
//                 IMS
//               </h1>
//               <p className="text-xs text-gray-400 mt-1">Inventory Management System</p>
//             </div>
//           </Link>
//         </div>

        

//         {/* Top Right - Profile Image and Navigation */}
//         <div className="flex items-center gap-6">

//           <Link to="/profile">
//             <img
//               src={userData?.profileImage}
//               alt="Profile"
//               className="w-12 h-12 rounded-full border-2 border-blue-500 shadow-xl cursor-pointer object-cover transition-all duration-300 ease-in-out hover:border-purple-400 hover:scale-105"
//             />
//           </Link>
//         </div>
//       </nav>

//       {/* Main Content Area: Left (Hero) and Right (Cards) */}
//       <main className="flex-grow flex p-8">
//         {/* Left Section - Hero Text & Core Message */}
//         <section className="flex flex-col items-center justify-center w-1/2 pr-8 text-center md:text-left">
//           <svg
//             className="w-20 h-20 text-blue-500 mx-auto md:ml-0 animate-bounce-slow mb-4" // Reduced icon size
//             viewBox="0 0 48 48"
//             fill="none"
//             xmlns="http://www.w3.org/2000/svg"
//           >
//             <path
//               d="M24 0.757355L47.2426 24L24 47.2426L0.757355 24L24 0.757355ZM21 35.7574V12.2426L9.24264 24L21 35.7574Z"
//               fill="currentColor"
//             />
//           </svg>
//           <h2 className="text-4xl font-extrabold leading-tight bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 text-transparent bg-clip-text mb-3"> {/* Reduced heading size */}
//             Streamline Your Inventory Management
//           </h2>
//           <p className="text-lg text-gray-300 max-w-2xl mx-auto md:mx-0"> {/* Reduced paragraph size */}
//             Your ultimate solution for comprehensive inventory control, seamless order
//             management, and insightful reporting.
//           </p>
//         </section>

//         {/* Right Section - Feature Cards */}
//         <section className="w-1/2 pl-8 flex justify-center items-center">
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 w-full max-w-lg"> {/* Reduced gap, added max-w for cards */}
//             <FeatureCard
//               icon={<ProductIcon />}
//               title="Product Control"
//               description="Real-time stock levels, details, and location tracking." // More concise description
//               link="/product"
//               delay="delay-200"
//             />
//             <FeatureCard
//               icon={<OrderIcon />}
//               title="Order Fulfillment"
//               description="Track orders from creation to delivery with status updates." // More concise description
//               link="/order"
//               delay="delay-300"
//             />
//             <FeatureCard
//               icon={<SupplierIcon />}
//               title="Supplier Relations"
//               description="Manage supplier information and track goods received." // More concise description
//               link="/suppliers"
//               delay="delay-400"
//             />
//             <FeatureCard
//               icon={<ReportIcon />}
//               title="Actionable Reports"
//               description="Generate detailed reports for inventory, sales, and performance." // More concise description
//               link="/reports"
//               delay="delay-500"
//             />
//           </div>
//         </section>
//       </main>

//       <Footer />
//     </div>
//   );
// };

// // Helper component for feature cards
// const FeatureCard = ({ icon, title, description, link, delay }) => (
//   <Link to={link} className={`block animate-fade-in-up ${delay}`}>
//     <div className="bg-gray-800 p-4 rounded-lg shadow-xl border border-gray-700 hover:border-blue-500 transition-all duration-300 ease-in-out transform hover:-translate-y-2 cursor-pointer h-full flex flex-col"> {/* Reduced padding */}
//       <div className="text-center"> {/* Centered content within card */}
//         {icon}
//         <h3 className="text-lg font-bold text-white mb-1">{title}</h3> {/* Reduced title size */}
//         <p className="text-gray-400 text-xs">{description}</p> {/* Reduced description size */}
//       </div>
//       <span className="text-blue-400 text-xs font-semibold mt-3 block text-center">Go to {title} &rarr;</span> {/* Reduced link size, centered */}
//     </div>
//   </Link>
// );

// export default HomePage;

import React, { useContext, useEffect } from "react";
import { UserContext } from "../UserContext";
import { Link, useNavigate } from "react-router-dom";
import Footer from "../Footer";

// Icon components (You can move these to a separate file like 'src/components/Icons.jsx')
const ProductIcon = () => (
  <svg className="w-10 h-10 mx-auto mb-2 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"></path></svg>
);

const OrderIcon = () => (
  <svg className="w-10 h-10 mx-auto mb-2 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M17 16l4 4m0 0l-4-4m4 4V12"></path></svg>
);

const ReportIcon = () => (
  <svg className="w-10 h-10 mx-auto mb-2 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19V6l2-2 2 2v13M9 19H7a2 2 0 01-2-2V5a2 2 0 012-2h10a2 2 0 012 2v12a2 2 0 01-2 2h-2M9 19v-2m-2 2H5m14 0h-2"></path></svg>
);

const SupplierIcon = () => (
  <svg className="w-10 h-10 mx-auto mb-2 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h2a2 2 0 002-2V8a2 2 0 00-2-2h-2M4 18V6a2 2 0 012-2h10a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2zm0 0H2a2 2 0 00-2 2v2h2V18zm0 0h2v2H4v-2z"></path></svg>
);


const HomePage = () => {
  const { userData } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!userData) {
      navigate("/login");
    }
  }, [userData, navigate]);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-950 to-gray-800 text-white font-sans">
      {/* Navbar */}
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
              <p className="text-xs text-gray-400 mt-1">Inventory Management System</p>
            </div>
          </Link>
        </div>

        {/* Top Right - About Us Button & Profile Image */}
        <div className="flex items-center gap-6">
          {/* About Us Button - Enhanced to match IMS logo text */}
          <Link
            to="/about"
            className="text-sm md:text-base font-extrabold px-3 py-1 rounded-md
                       bg-gradient-to-r from-gray-500 to-gray-400 text-transparent bg-clip-text
                       hover:bg-gradient-to-r hover:from-blue-300 hover:to-purple-400 hover:text-transparent hover:bg-clip-text
                       transition-all duration-300 ease-in-out
                       border border-transparent hover:border-blue-500 hover:shadow-md"
          >
            About Us
          </Link>

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

      {/* Main Content Area: Left (Hero) and Right (Cards) */}
      <main className="flex-grow flex p-8">
        {/* Left Section - Hero Text & Core Message */}
        <section className="flex flex-col items-center justify-center w-1/2 pr-8 text-center md:text-left">
          <svg
            className="w-20 h-20 text-blue-500 mx-auto md:ml-0 animate-bounce-slow mb-4" // Reduced icon size
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M24 0.757355L47.2426 24L24 47.2426L0.757355 24L24 0.757355ZM21 35.7574V12.2426L9.24264 24L21 35.7574Z"
              fill="currentColor"
            />
          </svg>
          <h2 className="text-4xl font-extrabold leading-tight bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 text-transparent bg-clip-text mb-3"> {/* Reduced heading size */}
            Streamline Your Inventory Management
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto md:mx-0"> {/* Reduced paragraph size */}
            Your ultimate solution for comprehensive inventory control, seamless order
            management, and insightful reporting.
          </p>
        </section>

        {/* Right Section - Feature Cards */}
        <section className="w-1/2 pl-8 flex justify-center items-center">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 w-full max-w-lg"> {/* Reduced gap, added max-w for cards */}
            <FeatureCard
              icon={<ProductIcon />}
              title="Product Control"
              description="Real-time stock levels, details, and location tracking." // More concise description
              link="/product"
              delay="delay-200"
            />
            <FeatureCard
              icon={<OrderIcon />}
              title="Order Fulfillment"
              description="Track orders from creation to delivery with status updates." // More concise description
              link="/order"
              delay="delay-300"
            />
            <FeatureCard
              icon={<SupplierIcon />}
              title="Supplier Relations"
              description="Manage supplier information and track goods received." // More concise description
              link="/suppliers"
              delay="delay-400"
            />
            <FeatureCard
              icon={<ReportIcon />}
              title="Actionable Reports"
              description="Generate detailed reports for inventory, sales, and performance." // More concise description
              link="/reports"
              delay="delay-500"
            />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

// Helper component for feature cards
const FeatureCard = ({ icon, title, description, link, delay }) => (
  <Link to={link} className={`block animate-fade-in-up ${delay}`}>
    <div className="bg-gray-800 p-4 rounded-lg shadow-xl border border-gray-700 hover:border-blue-500 transition-all duration-300 ease-in-out transform hover:-translate-y-2 cursor-pointer h-full flex flex-col"> {/* Reduced padding */}
      <div className="text-center"> {/* Centered content within card */}
        {icon}
        <h3 className="text-lg font-bold text-white mb-1">{title}</h3> {/* Reduced title size */}
        <p className="text-gray-400 text-xs">{description}</p> {/* Reduced description size */}
      </div>
      <span className="text-blue-400 text-xs font-semibold mt-3 block text-center">Go to {title} &rarr;</span> {/* Reduced link size, centered */}
    </div>
  </Link>
);

export default HomePage;