import React, { createContext, useState, useEffect } from "react";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  // Initialize userData as null.
  // It will be populated with actual user data upon successful login.
  // We can keep a default profile image, or make it dynamic if provided by backend.
  const [userData, setUserData] = useState(null);

  // Attempt to load user data from localStorage on initial render
  // This helps persist the session across page refreshes
  useEffect(() => {
    const storedUserData = localStorage.getItem("userData");
    if (storedUserData) {
      try {
        setUserData(JSON.parse(storedUserData));
      } catch (e) {
        console.error("Failed to parse user data from localStorage:", e);
        // If parsing fails, clear the invalid data
        localStorage.removeItem("userData");
        localStorage.removeItem("userToken"); // Also clear token if user data is corrupted
      }
    }
  }, []); // Empty dependency array means this runs once on mount

  // The 'setUserData' function will be passed down to consumers
  // (like LoginPage) to update the context with actual retrieved user data.
  return (
    <UserContext.Provider value={{ userData, setUserData }}>
      {children}
    </UserContext.Provider>
  );
};