// import { useNavigate } from "react-router-dom";
// import { useState } from "react";
// import NotificationPopup from "./NotificationPopup"; // Keep your correct import path here

// const Logout = ({ className }) => { // Accept className as a prop
//   const navigate = useNavigate();
//   const [notification, setNotification] = useState(null);

//   const handleLogout = () => {
//     try {
//       localStorage.removeItem("userToken");
//       setNotification({ message: "Logout successful!", type: "success" });
//       setTimeout(() => {
//         setNotification(null);
//         navigate("/login");
//       }, 1500);
//     } catch (error) {
//       setNotification({ message: "Logout failed! Please try again.", type: "error" });
//     }
//   };

//   return (
//     <div className="flex flex-col items-center"> {/* Keep this wrapper for the notification */}
//       {notification && (
//         <NotificationPopup
//           message={notification.message}
//           type={notification.type}
//           onClose={() => setNotification(null)}
//         />
//       )}
//       <button
//         // Apply the className passed from parent, and default red styles
//         className={`${className} bg-red-600 hover:bg-red-500`}
//         onClick={handleLogout}
//       >
//         Log out
//       </button>
//     </div>
//   );
// };

// export default Logout;

// src/Logout.jsx
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import NotificationPopup from "./NotificationPopup"; // Keep your correct import path here

const Logout = ({ className }) => {
  // Accept className as a prop
  const navigate = useNavigate();
  const [notification, setNotification] = useState(null);

  const handleLogout = () => {
    try {
      localStorage.removeItem("userToken");
      localStorage.removeItem("userData"); // Also clear userData for a complete logout
      setNotification({ message: "Logout successful!", type: "success" });
      setTimeout(() => {
        setNotification(null);
        navigate("/login");
      }, 1500);
    } catch (error) {
      setNotification({
        message: "Logout failed! Please try again.",
        type: "error",
      });
    }
  };

  return (
    <div className="flex flex-col items-center">
      {" "}
      {/* Keep this wrapper for the notification */}
      {notification && (
        <NotificationPopup
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
      <button
        // Apply the className passed from parent ONLY
        className={className}
        onClick={handleLogout}
      >
        Log out
      </button>
    </div>
  );
};

export default Logout;
