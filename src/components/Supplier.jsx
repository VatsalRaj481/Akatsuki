import React, {
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import axios from "axios";
import { UserContext } from "../UserContext";
import { Link, useNavigate } from "react-router-dom";
import Search from "../Search";
import Footer from "../Footer";
// Assuming you have a NotificationPopup component
import NotificationPopup from "../NotificationPopup";

const SupplierComponent = () => {
  const { userData } = useContext(UserContext);
  const navigate = useNavigate();
  const [suppliers, setSuppliers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [notification, setNotification] = useState(null); // Added for notifications

  // State variables for the modal form
  const [showForm, setShowForm] = useState(false); // Controls the visibility of the modal
  const [editSupplier, setEditSupplier] = useState(null); // Stores the supplier being edited
  const [supplierData, setSupplierData] = useState({
    name: "",
    contactInfo: "",
    // NEW: This state will hold the comma-separated string of product IDs for input
    providedProductIdsInput: "",
  });

  const token = localStorage.getItem("userToken");

  const fetchSuppliers = useCallback(async () => {
    if (!token) {
      // Added notification and navigation for consistency
      setNotification({ message: "Authentication required. Please log in.", type: "error" });
      navigate("/login");
      return;
    }

    try {
      console.log("Using JWT Token:", token);
      // Your backend returns SupplierResponseDto which includes suppliedProducts (List<ProductDto>)
      const response = await axios.get("http://localhost:8080/api/suppliers", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setSuppliers(response.data);
    } catch (err) {
      console.error("Error fetching suppliers:", err);
      setNotification({ message: "Failed to fetch suppliers. Please try again.", type: "error" });
    }
  }, [token, navigate]); // Added navigate to dependencies

  useEffect(() => {
    if (!userData) {
      // Added notification and navigation for consistency
      setNotification({ message: "Please log in to view suppliers.", type: "error" });
      navigate("/login");
      return;
    }
    fetchSuppliers();
  }, [userData, navigate, fetchSuppliers]);

  // Handler for form input changes
  const handleInputChange = (e) => {
    setSupplierData({ ...supplierData, [e.target.name]: e.target.value });
  };

  // Handler for form submission (add or update)
  const handleSubmit = async () => {
    try {
      // Parse the comma-separated product IDs string into an array of numbers
      const parsedProvidedProductIds = supplierData.providedProductIdsInput
        .split(",")
        .map((id) => Number(id.trim())) // Convert each string part to a number
        .filter((id) => !isNaN(id) && id > 0); // Filter out invalid numbers or empty strings

      // Construct the payload to send to the backend, using the parsed IDs
      const payload = {
        name: supplierData.name,
        contactInfo: supplierData.contactInfo,
        providedProductIds: parsedProvidedProductIds, // This matches the backend's Supplier entity
      };

      if (editSupplier) {
        // Update existing supplier using the constructed payload
        await axios.put(
          `http://localhost:8080/api/suppliers/${editSupplier.supplierId}`,
          payload, // Use the new payload
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setNotification({ message: "Supplier updated successfully!", type: "success" });
      } else {
        // Add new supplier using the constructed payload
        await axios.post("http://localhost:8080/api/suppliers", payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setNotification({ message: "Supplier added successfully!", type: "success" });
      }
      fetchSuppliers(); // Refresh the list of suppliers
      setShowForm(false); // Close the modal
      setEditSupplier(null); // Clear any editing state
      setSupplierData({
        // Reset form fields for next use
        name: "",
        contactInfo: "",
        providedProductIdsInput: "", // Reset the input string
      });
    } catch (err) {
      console.error("Error saving supplier:", err);
      setNotification({ message: "Failed to save supplier. Please try again.", type: "error" });
    }
  };

  const deleteSupplier = async (supplierId) => {
    // Added confirmation dialog for user experience
    if (!window.confirm("Are you sure you want to delete this supplier? This action cannot be undone.")) {
      return;
    }
    try {
      await axios.delete(`http://localhost:8080/api/suppliers/${supplierId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchSuppliers(); // Refresh the list after deletion
      setNotification({ message: "Supplier deleted successfully!", type: "success" });
    } catch (err) {
      console.error("Error deleting supplier:", err);
      setNotification({ message: "Failed to delete supplier. Please try again.", type: "error" });
    }
  };

  // Function to open the form for editing an existing supplier
  const startEditSupplier = (supplier) => {
    setEditSupplier(supplier);
    // Pre-fill the form with existing supplier data, converting product IDs to a string
    setSupplierData({
      name: supplier.name || "",
      contactInfo: supplier.contactInfo || "",
      // Convert the array of providedProductIds (from the backend Supplier entity)
      // to a comma-separated string for the input field.
      providedProductIdsInput: supplier.providedProductIds
        ? supplier.providedProductIds.join(", ")
        : "",
    });
    setShowForm(true); // Open the modal
  };

  // Function to open the form for adding a new supplier
  const openAddSupplierForm = () => {
    setEditSupplier(null); // Ensure no supplier is in edit mode
    setSupplierData({
      // Clear form fields for a new entry
      name: "",
      contactInfo: "",
      providedProductIdsInput: "", // Initialize to empty string for new input
    });
    setShowForm(true); // Open the modal
  };

  const filteredSuppliers = useMemo(() => {
    return suppliers.filter((supplier) =>
      supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      // Also filter by product names if the search term matches
      (supplier.suppliedProducts && supplier.suppliedProducts.some(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      ))
    );
  }, [suppliers, searchTerm]);

  // Changed to show login prompt for consistency
  if (!userData) {
    return (
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-950 to-gray-800 text-white font-sans items-center justify-center">
        <p className="text-lg mb-4">Please log in to view suppliers.</p>
        <Link to="/login" className="font-bold text-blue-500 hover:text-blue-400 transition-colors px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600">Go to Login</Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-950 to-gray-800 text-white font-sans">
      {/* Consistent Navbar styling from ProductPage/OrderComponent */}
      <nav className="flex items-center justify-between p-4 bg-gray-900 shadow-xl border-b border-gray-700">
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
        <div className="flex items-center gap-6">
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          {/* Button to open the Add Supplier modal */}
          <button
            onClick={openAddSupplierForm}
            className="h-10 px-5 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg shadow-md transition-colors duration-300 ease-in-out transform hover:scale-105"
          >
            Add Supplier
          </button>
          <Link to="/profile">
            <img
              className="w-10 h-10 rounded-full border-2 border-blue-500 shadow-lg object-cover cursor-pointer transition-all duration-300 ease-in-out hover:border-purple-400 hover:scale-105"
              src={userData?.profileImage || "/Naruto.jpg"} // Fallback image, optional chaining for userData
              alt="Profile"
            />
          </Link>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-grow flex flex-col items-start p-8 mt-6 pb-20">
        {/* Heading: "Suppliers", left-aligned and full width */}
        <h2 className="text-3xl font-extrabold text-white mb-8 w-full text-left">Our Suppliers</h2>

        {/* Notification Popup */}
        {notification && (
          <NotificationPopup
            message={notification.message}
            type={notification.type}
            onClose={() => setNotification(null)} // Clear notification on close
          />
        )}

        <div className="bg-gray-800 rounded-lg shadow-xl p-5 overflow-x-auto w-full max-w-7xl mx-auto border border-gray-700">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-700 text-gray-300">
                <th className="p-3 font-semibold text-sm uppercase tracking-wider">Supplier ID</th>
                <th className="p-3 font-semibold text-sm uppercase tracking-wider">Name</th>
                <th className="p-3 font-semibold text-sm uppercase tracking-wider">Contact Info</th>
                <th className="p-3 font-semibold text-sm uppercase tracking-wider">Supplied Products</th>
                <th className="p-3 font-semibold text-sm uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSuppliers.length > 0 ? (
                filteredSuppliers.map((supplier) => (
                  <tr
                    key={supplier.supplierId}
                    className="border-b border-gray-700 last:border-b-0 hover:bg-gray-700 transition-colors duration-200"
                  >
                    <td className="p-3 text-sm text-gray-200">#{supplier.supplierId ?? "N/A"}</td>
                    <td className="p-3 text-sm text-blue-400 font-medium">{supplier.name ?? "Unknown Supplier"}</td>
                    <td className="p-3 text-sm text-gray-200">{supplier.contactInfo ?? "N/A"}</td>
                    <td className="p-3 text-sm text-gray-200">
                      {supplier.suppliedProducts &&
                      supplier.suppliedProducts.length > 0 ? (
                        <span className="flex flex-wrap gap-1">
                          {supplier.suppliedProducts
                            .map((product) => (
                              <span
                                key={product.productId}
                                className="bg-gray-600 text-gray-100 px-2 py-0.5 rounded-full text-xs"
                              >
                                {product.name}
                              </span>
                            ))}
                        </span>
                      ) : (
                        <span className="text-gray-400 italic">No products listed</span>
                      )}
                    </td>
                    <td className="p-3 flex gap-2 items-center">
                      <button
                        onClick={() => startEditSupplier(supplier)}
                        className="bg-blue-600 hover:bg-blue-700 px-3 py-1.5 rounded-md text-xs font-bold text-white shadow-sm transition-colors duration-200"
                      >
                        Update
                      </button>
                      <button
                        onClick={() => deleteSupplier(supplier.supplierId)}
                        className="bg-red-600 hover:bg-red-700 px-3 py-1.5 rounded-md text-xs font-bold text-white shadow-sm transition-colors duration-200"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="p-5 text-center text-gray-400 text-lg">No suppliers found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>

      {/* Add/Edit Supplier Modal Popup */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-gray-900 border border-gray-700 p-8 rounded-xl shadow-2xl w-full max-w-md mx-auto relative transform transition-all duration-300 ease-out scale-100 opacity-100 animate-slide-up">
            {/* Close Button */}
            <button
              onClick={() => setShowForm(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white text-3xl font-light leading-none"
              aria-label="Close"
            >
              &times;
            </button>
            <h3 className="text-3xl font-bold mb-8 text-center text-white bg-gradient-to-r from-blue-300 to-purple-400 text-transparent bg-clip-text">
              {editSupplier ? "Edit Supplier" : "Add New Supplier"}
            </h3>
            <div className="space-y-5">
              <input
                type="text"
                name="name"
                placeholder="Supplier Name"
                value={supplierData.name}
                onChange={handleInputChange}
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400 transition-colors duration-200"
              />
              <input
                type="text"
                name="contactInfo"
                placeholder="Contact Info (e.g., Email, Phone)"
                value={supplierData.contactInfo}
                onChange={handleInputChange}
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400 transition-colors duration-200"
              />
              {/* NEW INPUT FIELD for provided product IDs */}
              <input
                type="text"
                name="providedProductIdsInput"
                placeholder="Product IDs (comma-separated, e.g., 1, 5, 10)"
                value={supplierData.providedProductIdsInput}
                onChange={handleInputChange}
                className="w-full p-3 bg-gray-700 rounded-lg border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400 transition-colors duration-200"
              />
            </div>
            <button
              onClick={handleSubmit}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg mt-8 shadow-md transition-colors duration-300 ease-in-out transform hover:scale-105"
            >
              {editSupplier ? "Update Supplier" : "Add Supplier"}
            </button>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default SupplierComponent;