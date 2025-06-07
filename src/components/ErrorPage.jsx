import React from "react";
import { Link } from "react-router-dom";

const ErrorPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      {/* Animated 404 Error */}
      <h1 className="text-6xl font-bold text-red-500 animate-bounce">404</h1>
      <p className="text-xl text-gray-400 mt-2 animate-fade">Oops! Page not found.</p>
      <p className="text-sm text-gray-500 mt-1 animate-fade">The page you're looking for doesn't exist or has been moved.</p>

      {/* Home Button with Animation */}
      <Link to="/">
        <button className="mt-6 p-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg animate-pulse">
          Go to Home
        </button>
      </Link>
    </div>
  );
};

export default ErrorPage;
