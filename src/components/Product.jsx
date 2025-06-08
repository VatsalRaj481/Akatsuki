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

const ProductPage = () => {
  const { userData } = useContext(UserContext);
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editProduct, setEditProduct] = useState(null);

  const token = localStorage.getItem("userToken");

  const [productData, setProductData] = useState({
    name: "",
    price: "",
    description: "",
    imageUrl: "",
  });

  const fetchProducts = useCallback(async () => {
    if (!token) {
      console.error("JWT Token is missing");
      return;
    }

    try {
      console.log("Using JWT Token:", token);
      const response = await axios.get("http://localhost:8080/api/products", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  }, [token]);
  useEffect(() => {
    if (!userData) {
      navigate("/login");
      return;
    }
    fetchProducts();
  }, [userData, navigate, fetchProducts]);

  const handleInputChange = (e) => {
    setProductData({ ...productData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      if (editProduct) {
        await axios.put(
          `http://localhost:8081/api/products/${editProduct.id}`,
          productData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        await axios.post("http://localhost:8081/api/products", productData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      fetchProducts();
      setShowForm(false);
      setEditProduct(null);
      setProductData({ name: "", price: "", description: "", imageUrl: "" });
    } catch (error) {
      console.error("Error saving product:", error);
    }
  };

  const deleteProduct = async (id) => {
    try {
      await axios.delete(`http://localhost:8081/api/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(products.filter((p) => p.id !== id));
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const startEditProduct = (product) => {
    setEditProduct(product);
    setProductData(product);
    setShowForm(true);
  };
  // Function to open the Add Product form (and clear any previous edit data)
  const openAddProductForm = () => {
    setEditProduct(null); // Ensure no product is in edit mode
    setProductData({ name: "", price: "", description: "", imageUrl: "" }); // Clear form fields
    setShowForm(true); // Open the modal
  };
  const filteredProducts = useMemo(() => {
    return products.filter(
      (product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [products, searchTerm]);

  if (!userData) return null;

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white">
      {/* Navbar */}
      <header className="absolute top-0 left-0 flex items-center gap-3 p-5 border-b border-gray-700 w-full">
        <Link to="/">
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
          <button
            onClick={openAddProductForm} // Call the new function
            className="h-10 px-4 bg-green-600 rounded-xl"
          >
            Add Product
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
        <h2 className="text-white text-2xl font-bold pb-6">Products</h2>

        {/* Product Cards */}
        <div className="grid grid-cols-4 gap-6 mt-2 max-h-none px-4 justify-start">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-gray-800 rounded-lg shadow-md p-4 flex flex-col items-start w-full h-[360px]"
            >
              <p className="text-sm font-bold text-gray-400 self-start">
                ID: {product.id}
              </p>
              <img
                src={`http://localhost:8081${product.imageUrl}`}
                alt={product.name}
                className="w-28 h-28 object-cover rounded-lg mx-auto mt-2"
              />
              <h3 className="text-lg font-semibold mt-2 text-center w-full">
                {product.name}
              </h3>
              <p className="text-gray-400 text-sm mt-1">
                {product.description || "No description available"}
              </p>
              <p className="text-md font-bold text-blue-400 mt-2">
                Price: ${product.price?.toFixed(2) ?? "N/A"}
              </p>
              {/* Stock Display */}
              <p
                className={`text-md font-bold mt-2 ${
                  product.stockDetails?.quantity > 0
                    ? "text-green-400"
                    : "text-red-400"
                }`}
              >
                {product.stockDetails?.quantity > 0
                  ? `In Stock: ${product.stockDetails.quantity}`
                  : "Out of Stock"}
              </p>
              <div className="flex justify-between w-full mt-4 space-x-2">
                <button
                  onClick={() => startEditProduct(product)}
                  className="bg-yellow-500 px-5 py-2 rounded-md text-sm w-[45%]"
                >
                  Update
                </button>
                <button
                  onClick={() => deleteProduct(product.id)}
                  className="bg-red-500 px-5 py-2 rounded-md text-sm w-[45%]"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
        {/* Add/Edit Product Modal Popup */}
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
                {editProduct ? "Edit Product" : "Add New Product"}
              </h3>
              <div className="space-y-4">
                <input
                  type="text"
                  name="name"
                  placeholder="Product Name"
                  value={productData.name}
                  onChange={handleInputChange}
                  className="w-full p-3 bg-gray-700 rounded-lg border border-gray-600 focus:ring-2 focus:ring-green-500 focus:border-transparent text-white placeholder-gray-400"
                />
                <input
                  type="number"
                  name="price"
                  placeholder="Price"
                  value={productData.price}
                  onChange={handleInputChange}
                  className="w-full p-3 bg-gray-700 rounded-lg border border-gray-600 focus:ring-2 focus:ring-green-500 focus:border-transparent text-white placeholder-gray-400"
                />
                <input
                  type="text"
                  name="description"
                  placeholder="Description"
                  value={productData.description}
                  onChange={handleInputChange}
                  className="w-full p-3 bg-gray-700 rounded-lg border border-gray-600 focus:ring-2 focus:ring-green-500 focus:border-transparent text-white placeholder-gray-400"
                />
                <input
                  type="text"
                  name="imageUrl"
                  placeholder="Image URL"
                  value={productData.imageUrl}
                  onChange={handleInputChange}
                  className="w-full p-3 bg-gray-700 rounded-lg border border-gray-600 focus:ring-2 focus:ring-green-500 focus:border-transparent text-white placeholder-gray-400"
                />
              </div>
              <button
                onClick={handleSubmit}
                className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-3 px-4 rounded-lg mt-6 transition duration-200"
              >
                {editProduct ? "Update Product" : "Add Product"}
              </button>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default ProductPage;