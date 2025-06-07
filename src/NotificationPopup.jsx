import React, { useEffect, useState } from "react";

const NotificationPopup = ({ message, type, onClose }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true); // Trigger animation

    const timer = setTimeout(() => {
      setVisible(false); // Fade out
      setTimeout(onClose, 700); // Completely remove after fade-out
    }, 2000); // Auto-dismiss after 2 seconds

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className={`fixed bottom-14 left-1/2 transform -translate-x-1/2 p-4 rounded-md shadow-lg cursor-pointer 
        transition-opacity duration-500 ${visible ? "opacity-100" : "opacity-0"} 
        ${type === "success" ? "bg-green-900 border border-green-500 text-green-300" : "bg-red-900 border border-red-500 text-red-300"}`}
      style={{ zIndex: 9999 }} // Ensures it's above everything, including footer
      onClick={onClose} // Close when clicked
    >
      <p className="text-center font-semibold">{message}</p>
    </div>
  );
};

export default NotificationPopup;
