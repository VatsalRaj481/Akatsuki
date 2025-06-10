import React, {
  useContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import axios from "axios";
import { UserContext } from "../UserContext";
import { Link, useNavigate } from "react-router-dom";
import Search from "../Search";
import Footer from "../Footer";
import NotificationPopup from "../NotificationPopup"; // Import the NotificationPopup component

const ProductPage = () => {
  const { userData } = useContext(UserContext);
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editProduct, setEditProduct] = useState(null); // Stores the product being edited

  // State for notifications
  const [notification, setNotification] = useState(null); // { message: "", type: "success" | "error" }

  // New state for description modal
  const [showDescriptionModal, setShowDescriptionModal] = useState(false);
  const [selectedProductDescription, setSelectedProductDescription] = useState("");


  const token = localStorage.getItem("userToken");

  const [productData, setProductData] = useState({
    name: "",
    price: "",
    description: "",
    imageUrl: "",
    initialStockQuantity: "", // NEW: for stock quantity
    reorderLevel: "", // NEW: for reorder level
  });

  // Function to show a notification
  const showNotification = useCallback((message, type) => {
    setNotification({ message, type });
  }, []);

  // Function to clear the notification
  const clearNotification = useCallback(() => {
    setNotification(null);
  }, []);

  // Callback to fetch products, memoized to prevent unnecessary re-renders
  const fetchProducts = useCallback(async () => {
    if (!token) {
      console.error("JWT Token is missing");
      // Optionally redirect to login or show an error
      return;
    }

    try {
      console.log("Using JWT Token:", token);
      // Your product-service now returns ProductResponseDto, which includes stockDetails
      const response = await axios.get("http://localhost:8080/api/products", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
      showNotification("Failed to fetch products.", "error"); // Show error notification
    }
  }, [token, showNotification]);

  // Effect hook to fetch products on component mount or when userData/token changes
  useEffect(() => {
    if (!userData) {
      navigate("/login");
      return;
    }
    fetchProducts();
  }, [userData, navigate, fetchProducts]);

  // Handler for input changes in the product form
  const handleInputChange = (e) => {
    // Handle number inputs carefully, parse to int or float
    let value = e.target.value;
    if (e.target.name === "price") {
      value = parseFloat(value);
      if (isNaN(value)) {
        value = ""; // Keep it empty if not a valid number
      }
    } else if (
      e.target.name === "initialStockQuantity" ||
      e.target.name === "reorderLevel"
    ) {
      value = parseInt(value, 10);
      if (isNaN(value)) {
        value = ""; // Keep it empty if not a valid integer
      }
    }
    setProductData({ ...productData, [e.target.name]: value });
  };

  // Handler for submitting the Add/Update Product form
  const handleSubmit = async () => {
    // Basic validation
    if (!productData.name || !productData.price || !productData.imageUrl) {
      showNotification(
        "Please fill in all required product fields (Name, Price, Image URL).",
        "error"
      );
      return;
    }

    // Create the payload for ProductRequestDto
    const payload = {
      name: productData.name,
      price: productData.price,
      description: productData.description,
      imageUrl: productData.imageUrl,
      initialStockQuantity:
        productData.initialStockQuantity !== ""
          ? productData.initialStockQuantity
          : null, // Send null if empty/not provided
      reorderLevel:
        productData.reorderLevel !== "" ? productData.reorderLevel : null, // Send null if empty/not provided
    };

    try {
      if (editProduct) {
        // Update existing product
        await axios.put(
          `http://localhost:8080/api/products/${editProduct.id}`,
          payload, // Use the payload which now includes stock info
          { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log("Product updated successfully:", productData.name);
        showNotification("Product updated successfully!", "success");
      } else {
        // Add new product
        await axios.post("http://localhost:8080/api/products", payload, {
          // Use the payload
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("Product added successfully:", productData.name);
        showNotification("Product added successfully!", "success");
      }

      fetchProducts(); // Refresh the product list
      setShowForm(false); // Close the form
      setEditProduct(null); // Clear edit state
      // Reset all form fields, including new stock fields
      setProductData({
        name: "",
        price: "",
        description: "",
        imageUrl: "",
        initialStockQuantity: "",
        reorderLevel: "",
      });
    } catch (error) {
      console.error("Error saving product:", error);
      // Check for specific error messages from backend if needed
      const errorMessage =
        error.response?.data?.message ||
        "Failed to save product. Please try again.";
      showNotification(errorMessage, "error");
    }
  };

  // Handler for deleting a product
  const deleteProduct = async (id) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this product? This will also remove its stock record."
      )
    ) {
      return; // User cancelled the deletion
    }
    try {
      await axios.delete(`http://localhost:8080/api/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Optimistically update UI or re-fetch products
      setProducts(products.filter((p) => p.id !== id));
      console.log("Product and associated stock deleted successfully, ID:", id);
      showNotification(
        "Product and associated stock deleted successfully!",
        "success"
      );
    } catch (error) {
      console.error("Error deleting product:", error);
      showNotification("Failed to delete product. Please try again.", "error");
    }
  };

  // Function to initiate product editing
  const startEditProduct = (product) => {
    setEditProduct(product); // Set the product to be edited
    // Populate form fields including existing stock information if available
    setProductData({
      name: product.name,
      price: product.price,
      description: product.description,
      imageUrl: product.imageUrl,
      // When editing, initialStockQuantity and reorderLevel should reflect current stock values
      initialStockQuantity: product.stockDetails
        ? product.stockDetails.quantity
        : "",
      reorderLevel: product.stockDetails
        ? product.stockDetails.reorderLevel
        : "",
    });
    setShowForm(true); // Open the form
  };

  // Function to open the Add Product form (and clear any previous edit data)
  const openAddProductForm = () => {
    setEditProduct(null); // Ensure no product is in edit mode
    // Clear all form fields, including new stock fields
    setProductData({
      name: "",
      price: "",
      description: "",
      imageUrl: "",
      initialStockQuantity: "",
      reorderLevel: "",
    });
    setShowForm(true); // Open the modal
  };

  // Function to open description modal
  const openDescriptionModal = (description) => {
      setSelectedProductDescription(description);
      setShowDescriptionModal(true);
  };


  // Memoized filtering of products based on search term
  const filteredProducts = useMemo(() => {
    return products.filter(
      (product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [products, searchTerm]);

  // If user data is not available, don't render anything
  if (!userData) return null;

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-950 to-gray-800 text-white font-sans">
      {/* Navbar - Consistent with OrderComponent */}
      <nav className="flex items-center justify-between p-4 bg-gray-900 shadow-xl border-b border-gray-700">
        {/* Top Left - Logo, Title & Tagline */}
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-2">
            <svg
              className="w-10 h-10 text-blue-400 cursor-pointer hover:scale-110 transition duration-300 ease-in-out"
              viewBox="0 0 48 48"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M24 0.757355L47.2426 24L24 47.2426L0.757355 24L24 0.757355ZM21 35.7574V12.2426L9.24264 24L21 35.7574Z" />
            </svg>
            <div>
              <h1 className="text-2xl font-extrabold bg-gradient-to-r from-blue-300 to-purple-400 text-transparent bg-clip-text leading-none">
                IMS
              </h1>
              <p className="text-xs text-gray-400 mt-1">
                Inventory Management System
              </p>
            </div>
          </Link>
        </div>

        {/* Top Right - Search, Add Product Button, Profile Image */}
        <div className="flex items-center gap-6">
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          {/* Add Product Button - Consistent with OrderComponent Add Order button */}
          <button
            onClick={openAddProductForm}
            className="h-10 px-5 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg shadow-md transition-colors duration-300 ease-in-out transform hover:scale-105"
          >
            Add Product
          </button>
          <Link to="/profile">
            <img
              src={userData?.profileImage || "/Naruto.jpg"} // Fallback image for consistency
              alt="Profile"
              className="w-10 h-10 rounded-full border-2 border-blue-500 shadow-lg object-cover cursor-pointer transition-all duration-300 ease-in-out hover:border-purple-400 hover:scale-105"
            />
          </Link>
        </div>
      </nav>

      {/* Main Content Area - Adjusted padding and top margin for consistency */}
      <main className="flex-grow p-8 pb-16">
        <h2 className="text-3xl font-extrabold mb-8 text-left text-white">
          Products
        </h2>

        {/* Product Grid - Decreased gap-x and gap-y, removed fixed width from cards */}
        {/* Adjusted grid columns for smaller card widths and slightly increased gaps */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-x-5 gap-y-7">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <div
                key={product.id}
                // Removed w-[250px] to allow flex with grid, kept h-[360px]
                className="bg-gray-800 rounded-lg shadow-xl p-4 border border-gray-700 hover:border-blue-500 transition-all duration-300 ease-in-out transform hover:-translate-y-1 flex flex-col items-start w-full h-[360px]"
              >
                <p className="text-xs font-bold text-gray-400 self-start mb-2">
                  ID: {product.id}
                </p>
                <img
                  src={`http://localhost:8081${product.imageUrl}`}
                  alt={product.name}
                  className="w-32 h-32 object-cover rounded-lg mx-auto mb-2 border border-gray-600" // Increased image size slightly for better visibility
                />
                <h3 className="text-lg font-semibold text-white mb-1 line-clamp-1 w-full text-center">
                  {product.name}
                </h3>
                {/* Changed line-clamp-4 to line-clamp-3 */}
                <p className="text-xs text-gray-400 mb-2 line-clamp-3">
                  {product.description || "No description available"}
                </p>
                {/* Add Read More button if description is long */}
                {product.description && product.description.length > 120 && ( // 120 chars is an estimation for 3 lines
                  <button
                    onClick={() => openDescriptionModal(product.description)}
                    className="text-blue-400 hover:underline text-sm mb-2 self-start"
                  >
                    Read More
                  </button>
                )}
                <p className="text-sm font-bold text-blue-400 mb-1">
                  Price: ${product.price?.toFixed(2) ?? "N/A"}
                </p>
                <p
                  className={`text-sm font-bold ${
                    product.stockDetails && product.stockDetails.quantity > 0
                      ? "text-green-400"
                      : "text-red-400"
                  } mb-1`}
                >
                  {product.stockDetails
                    ? product.stockDetails.quantity > 0
                      ? `In Stock: ${product.stockDetails.quantity}`
                      : "Out of Stock"
                    : "Stock: N/A"}
                </p>
                {product.stockDetails &&
                  product.stockDetails.reorderLevel !== undefined && (
                    <p className="text-xs text-gray-500 mb-2">
                      Reorder Level: {product.stockDetails.reorderLevel}
                    </p>
                  )}
                {/* Pushed buttons to bottom using mt-auto */}
                <div className="flex justify-between w-full mt-auto space-x-2">
                  <button
                    onClick={() => startEditProduct(product)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-1.5 px-3 rounded-md text-sm transition duration-200 flex-grow"
                  >
                    Update
                  </button>
                  <button
                    onClick={() => deleteProduct(product.id)}
                    className="bg-red-500 hover:bg-red-600 text-white font-semibold py-1.5 px-3 rounded-md text-sm transition duration-200 flex-grow"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-400 text-center col-span-full py-10">
              No products found. Add a new product to get started!
            </p>
          )}
        </div>

        {/* Add/Edit Product Modal Popup - Decreased size, consistent with OrderComponent modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className="bg-gray-900 border border-gray-700 p-5 rounded-xl shadow-2xl w-full max-w-sm mx-auto relative transform transition-all duration-300 ease-out scale-100 opacity-100 animate-slide-up">
              {/* Close Button - Consistent with OrderComponent modal close button */}
              <button
                onClick={() => setShowForm(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white text-3xl font-light leading-none"
                aria-label="Close"
              >
                &times;
              </button>
              {/* Modal Title - Consistent with OrderComponent modal title */}
              <h3 className="text-3xl font-bold mb-6 text-center text-white bg-gradient-to-r from-blue-300 to-purple-400 text-transparent bg-clip-text">
                {editProduct ? "Edit Product" : "Add New Product"}
              </h3>
              <div className="space-y-4">
                {/* Input Fields - Consistent with OrderComponent modal inputs */}
                <input
                  type="text"
                  name="name"
                  placeholder="Product Name"
                  value={productData.name}
                  onChange={handleInputChange}
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400 transition-colors duration-200"
                  required
                />
                <input
                  type="number"
                  name="price"
                  placeholder="Price"
                  value={productData.price}
                  onChange={handleInputChange}
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400 transition-colors duration-200"
                  required
                />
                <textarea
                  name="description"
                  placeholder="Description"
                  value={productData.description}
                  onChange={handleInputChange}
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400 h-24 resize-none transition-colors duration-200"
                />
                <input
                  type="text"
                  name="imageUrl"
                  placeholder="Image URL (e.g., /path/to/your/image.jpg)"
                  value={productData.imageUrl}
                  onChange={handleInputChange}
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400 transition-colors duration-200"
                  required
                />
                <input
                  type="number"
                  name="initialStockQuantity"
                  placeholder="Initial Stock Quantity"
                  value={productData.initialStockQuantity}
                  onChange={handleInputChange}
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400 transition-colors duration-200"
                  min="0"
                />
                <input
                  type="number"
                  name="reorderLevel"
                  placeholder="Reorder Level"
                  value={productData.reorderLevel}
                  onChange={handleInputChange}
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400 transition-colors duration-200"
                  min="0"
                />
              </div>
              {/* Submit Button - Consistent with OrderComponent modal submit button */}
              <button
                onClick={handleSubmit}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg mt-6 shadow-md transition-colors duration-300 ease-in-out transform hover:scale-105"
              >
                {editProduct ? "Update Product" : "Add Product"}
              </button>
            </div>
          </div>
        )}

        {/* New: Description Modal */}
        {showDescriptionModal && (
            <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4 animate-fade-in">
                <div className="bg-gray-900 border border-gray-700 p-6 rounded-xl shadow-2xl w-full max-w-lg mx-auto relative transform transition-all duration-300 ease-out scale-100 opacity-100 animate-slide-up">
                    <button
                        onClick={() => setShowDescriptionModal(false)}
                        className="absolute top-4 right-4 text-gray-400 hover:text-white text-3xl font-light leading-none"
                        aria-label="Close"
                    >
                        &times;
                    </button>
                    <h3 className="text-3xl font-bold mb-6 text-center text-white bg-gradient-to-r from-blue-300 to-purple-400 text-transparent bg-clip-text">
                        Product Description
                    </h3>
                    <div className="text-gray-300 text-base leading-relaxed max-h-96 overflow-y-auto pr-2">
                        {selectedProductDescription || "No description available."}
                    </div>
                </div>
            </div>
        )}

        {notification && (
          <NotificationPopup
            message={notification.message}
            type={notification.type}
            onClose={clearNotification}
          />
        )}
      </main>
      <Footer />
    </div>
  );
};

export default ProductPage;