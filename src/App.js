import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { UserProvider } from "./UserContext"; 
import LoginPage from "./components/LoginPage";
import SignUpPage from "./components/SignUpPage";
import HomePage from "./components/HomePage";
import EditProfilePage from "./components/EditProfile";
import ProfilePage from "./components/ProfilePage";
import ErrorPage from "./components/ErrorPage";
import ProductComponent from "./components/Product";
import OrderComponent from "./components/Order";
import SupplierComponent from "./components/Supplier";
import Reports from "./components/Reports";

const App = () => {
  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/" element={<HomePage />} />
          <Route path="/edit" element={<EditProfilePage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/product" element={<ProductComponent />} />
          <Route path="/order" element={<OrderComponent/>}/>
          <Route path="*" element={<ErrorPage />} />
          <Route path="/suppliers" element={<SupplierComponent/>}/>
          <Route path="/reports" element={<Reports/>}/>
        </Routes>
      </Router>
    </UserProvider>
  );
};

export default App;
