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

const SupplierComponent = () => {
  const { userData } = useContext(UserContext);
  const navigate = useNavigate();
  const [suppliers, setSuppliers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

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
      console.error("JWT Token is missing");
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
    }
  }, [token]);

  useEffect(() => {
    if (!userData) {
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
      } else {
        // Add new supplier using the constructed payload
        await axios.post("http://localhost:8080/api/suppliers", payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
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
      // You can add a notification here if you have a NotificationPopup component
    } catch (err) {
      console.error("Error saving supplier:", err);
      // Add error notification here if you have one
    }
  };

  const deleteSupplier = async (supplierId) => {
    try {
      await axios.delete(`http://localhost:8080/api/suppliers/${supplierId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchSuppliers(); // Refresh the list after deletion
      // Add success notification here
    } catch (err) {
      console.error("Error deleting supplier:", err);
      // Add error notification here
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

  if (!userData) return null;

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white">
      {/* Navbar */}
      <header className="absolute top-0 left-0 flex items-center gap-3 p-5 border-b border-gray-700 w-full">
        <Link to="/home">
          <svg className="w-10 h-10 text-white" viewBox="0 0 48 48" fill="none">
            <path
              d="M24 0.757355L47.2426 24L24 47.2426L0.757355 24L24 0.757355ZM21 35.7574V12.2426L9.24264 24L21 35.7574Z"
              fill="currentColor"
            />
          </svg>
        </Link>
        <h1 className="text-2xl font-bold">IMS</h1>
        <div className="flex items-center gap-6 ml-auto">
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          {/* Button to open the Add Supplier modal */}
          <button
            onClick={openAddSupplierForm}
            className="h-10 px-4 bg-green-600 rounded-xl text-white font-semibold"
          >
            Add Supplier
          </button>
          <Link to="/profile">
            <img
              className="w-10 h-10 rounded-full border border-gray-500"
              src={userData.profileImage}
              alt="Profile"
            />
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <div className="px-20 flex flex-col py-10 mt-20">
        <h2 className="text-white text-2xl font-bold pb-6">Suppliers</h2>

        <div className="bg-gray-800 rounded-lg shadow-lg p-5 overflow-x-auto">
          <table className="w-full text-left border-collapse">
          <thead>
              <tr className="border-b border-gray-700">
                <th className="p-3">Supplier ID</th>
                <th className="p-3">Name</th>
                <th className="p-3">Contact Info</th>
                <th className="p-3">Supplied Products</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSuppliers.map((supplier) => (
                <tr // Ensure no new line/space immediately after this 'tr'
                  key={supplier.supplierId}
                  className="border-b border-gray-700"
                >
                  <td className="p-3">#{supplier.supplierId ?? "N/A"}</td>
                  <td className="p-3">{supplier.name ?? "Unknown Supplier"}</td>
                  <td className="p-3">{supplier.contactInfo ?? "N/A"}</td>
                  <td className="p-3">
                    {supplier.suppliedProducts &&
                    supplier.suppliedProducts.length > 0 ? (
                      <span>
                        {supplier.suppliedProducts
                          .map((product) => product.name)
                          .join(", ")}
                      </span>
                    ) : (
                      <span>No products listed</span>
                    )}
                  </td>
                  <td className="p-3 flex gap-2">
                    <button
                      onClick={() => startEditSupplier(supplier)}
                      className="bg-yellow-500 hover:bg-yellow-600 px-3 py-1 rounded-lg text-sm"
                    >
                      Update
                    </button>
                    <button
                      onClick={() => deleteSupplier(supplier.supplierId)}
                      className="bg-red-500 hover:bg-red-700 px-3 py-1 rounded-lg text-sm"
                    >
                      Delete
                    </button>
                  </td>
                </tr> 
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Supplier Modal Popup */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-8 rounded-xl shadow-2xl w-full max-w-md mx-auto relative transform transition-all duration-300 ease-out scale-100 opacity-100">
            {/* Close Button */}
            <button
              onClick={() => setShowForm(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl"
              aria-label="Close"
            >
              &times;
            </button>
            <h3 className="text-2xl font-semibold mb-6 text-center text-white">
              {editSupplier ? "Edit Supplier" : "Add New Supplier"}
            </h3>
            <div className="space-y-4">
              <input
                type="text"
                name="name"
                placeholder="Supplier Name"
                value={supplierData.name}
                onChange={handleInputChange}
                className="w-full p-3 bg-gray-700 rounded-lg border border-gray-600 focus:ring-2 focus:ring-green-500 focus:border-transparent text-white placeholder-gray-400"
              />
              <input
                type="text"
                name="contactInfo"
                placeholder="Contact Info (e.g., Email, Phone)"
                value={supplierData.contactInfo}
                onChange={handleInputChange}
                className="w-full p-3 bg-gray-700 rounded-lg border border-gray-600 focus:ring-2 focus:ring-green-500 focus:border-transparent text-white placeholder-gray-400"
              />
              {/* NEW INPUT FIELD for provided product IDs */}
              <input
                type="text"
                name="providedProductIdsInput"
                placeholder="Product IDs (comma-separated, e.g., 1, 5, 10)"
                value={supplierData.providedProductIdsInput}
                onChange={handleInputChange}
                className="w-full p-3 bg-gray-700 rounded-lg border border-gray-600 focus:ring-2 focus:ring-green-500 focus:border-transparent text-white placeholder-gray-400"
              />
            </div>
            <button
              onClick={handleSubmit}
              className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-3 px-4 rounded-lg mt-6 transition duration-200"
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