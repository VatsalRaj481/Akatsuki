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
import NotificationPopup from "../NotificationPopup";

const OrderComponent = () => {
  const { userData } = useContext(UserContext);
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [notification, setNotification] = useState(null);

  const [showForm, setShowForm] = useState(false);
  const [orderData, setOrderData] = useState({
    customerId: "",
    productId: "",
    quantity: "",
    orderDate: new Date().toISOString().split("T")[0],
    status: "Pending",
  });

  const token = localStorage.getItem("userToken");

  const fetchOrders = useCallback(async () => {
    if (!token) {
      // Added notification and navigation for consistency with ProductPage
      setNotification({ message: "Authentication required. Please log in.", type: "error" });
      navigate("/login");
      return;
    }

    try {
      // Adjusted API call to fetch orders which now include productName
      const response = await axios.get("http://localhost:8080/api/orders", {
        headers: { Authorization: `Bearer ${token}` },
      });

      // The backend now provides productName directly in the OrderResponseDto,
      // so the enrichment logic here becomes simpler or can be removed if the
      // backend already provides all necessary fields.
      const enrichedOrders = await Promise.all(
        response.data.map(async (order) => {
          try {
            const priceRes = await axios.get(
              `http://localhost:8080/api/orders/${order.orderId}/product-price`,
              { headers: { Authorization: `Bearer ${token}` } }
            );

            const totalRes = await axios.get(
              `http://localhost:8080/api/orders/${order.orderId}/total-price`,
              { headers: { Authorization: `Bearer ${token}` } }
            );

            return {
              ...order,
              productPrice: priceRes.data,
              totalPrice: totalRes.data,
              // productName is now expected directly from the backend response.
              // Ensure order.status is correctly parsed if it comes as a stringified JSON.
              status:
                typeof order.status === "string" && order.status.startsWith("{")
                  ? JSON.parse(order.status).status
                  : order.status,
            };
          } catch (err) {
            console.error("Error fetching additional order details:", err);
            // Return with default values if fetching additional details fails
            return {
              ...order,
              productPrice: 0,
              totalPrice: 0,
              productName: order.productName || "Unknown Product",
            };
          }
        })
      );

      setOrders(enrichedOrders);
    } catch (err) {
      console.error("Error fetching orders:", err);
      // Added notification for consistency
      setNotification({ message: "Failed to fetch orders. Please try again.", type: "error" });
    }
  }, [token, navigate, setNotification]); // Added setNotification to dependencies

  useEffect(() => {
    if (!userData) {
      // Added notification and navigation for consistency with ProductPage
      setNotification({ message: "Please log in to view orders.", type: "error" });
      navigate("/login");
      return;
    }
    fetchOrders();
  }, [userData, navigate, fetchOrders, setNotification]); // Added setNotification to dependencies

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await axios.put(
        `http://localhost:8080/api/orders/${orderId}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.orderId === orderId ? { ...order, status: newStatus } : order
        )
      );

      setNotification({
        message: `Order status updated to "${newStatus}"`,
        type: "success",
      });
    } catch (err) {
      console.error("Error updating order status:", err);
      setNotification({
        message: "Failed to update order status. Try again.",
        type: "error",
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setOrderData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      await axios.post("http://localhost:8080/api/orders", orderData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      fetchOrders();
      setShowForm(false);
      setOrderData({
        customerId: "",
        productId: "",
        quantity: "",
        orderDate: new Date().toISOString().split("T")[0],
        status: "Pending",
      });
      setNotification({
        message: "Order created successfully!",
        type: "success",
      });
    } catch (error) {
      console.error("Error creating order:", error);
      setNotification({
        message: "Failed to create order. Try again.",
        type: "error",
      });
    }
  };

  const cancelOrder = async (orderId) => {
    // Added confirmation dialog for user experience
    if (!window.confirm("Are you sure you want to cancel this order?")) {
        return;
    }
    try {
      await axios.delete(`http://localhost:8080/api/orders/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setNotification({
        message: "Order canceled successfully!",
        type: "success",
      });

      setOrders((prevOrders) =>
        prevOrders.filter((order) => order.orderId !== orderId)
      );
    } catch (err) {
      console.error("Error cancelling order:", err);
      setNotification({
        message: "Failed to cancel order. Try again.",
        type: "error",
      });
    }
  };

  const getStatusColor = (status) => {
    switch (status.trim()) {
      case "Completed":
        return "bg-green-500 text-white";
      case "Shipped":
        return "bg-yellow-500 text-black";
      case "Pending":
        return "bg-red-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  const filteredOrders = useMemo(() => {
    return orders.filter((order) =>
      order.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.productName?.toLowerCase().includes(searchTerm.toLowerCase()) // Filter by product name too
    );
  }, [orders, searchTerm]);

  // Changed to show login prompt for consistency
  if (!userData) {
    return (
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-950 to-gray-800 text-white font-sans items-center justify-center">
        <p className="text-lg mb-4">Please log in to view orders.</p>
        <Link to="/login" className="font-bold text-blue-500 hover:text-blue-400 transition-colors px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600">Go to Login</Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-950 to-gray-800 text-white font-sans">
      {/* Consistent Navbar styling from ProductPage */}
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
          <button
            onClick={() => setShowForm(true)}
            className="h-10 px-5 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg shadow-md transition-colors duration-300 ease-in-out transform hover:scale-105"
          >
            Add Order
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
      {/* Adjusted padding and top margin for consistency */}
      <main className="flex-grow flex flex-col items-start p-8 mt-6 pb-20">
        {/* Heading: "Your Orders", left-aligned and full width */}
        <h2 className="text-3xl font-extrabold text-white mb-8 w-full text-left">Your Orders</h2>

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
                <th className="p-3 font-semibold text-sm uppercase tracking-wider">Order ID</th>
                <th className="p-3 font-semibold text-sm uppercase tracking-wider">Date</th>
                <th className="p-3 font-semibold text-sm uppercase tracking-wider">Product Name</th>
                <th className="p-3 font-semibold text-sm uppercase tracking-wider">Price</th>
                <th className="p-3 font-semibold text-sm uppercase tracking-wider">Quantity</th>
                <th className="p-3 font-semibold text-sm uppercase tracking-wider">Total</th>
                <th className="p-3 font-semibold text-sm uppercase tracking-wider">Status</th>
                <th className="p-3 font-semibold text-sm uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <tr key={order.orderId} className="border-b border-gray-700 last:border-b-0 hover:bg-gray-700 transition-colors duration-200">
                    <td className="p-3 text-sm text-gray-200">#{order.orderId ?? "N/A"}</td>
                    <td className="p-3 text-sm text-gray-200">
                      {new Date(
                        order.orderDate ?? Date.now()
                      ).toLocaleDateString()}
                    </td>
                    <td className="p-3 text-sm text-blue-400 font-medium">
                      {order.productName ?? "Unknown Product"}
                    </td>
                    <td className="p-3 text-sm text-gray-200">
                      ${order.productPrice?.toFixed(2) ?? "0.00"}
                    </td>
                    <td className="p-3 text-sm text-gray-200">{order.quantity}</td>
                    <td className="p-3 text-base text-green-400 font-bold">
                      ${order.totalPrice?.toFixed(2) ?? "0.00"}
                    </td>
                    <td className="p-3">
                      <select
                        value={order.status.trim()} // Trim status to ensure correct comparison
                        onChange={(e) => updateOrderStatus(order.orderId, e.target.value)}
                        className={`px-3 py-1 rounded-md text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-opacity-75 ${getStatusColor(
                          order.status
                        )}`}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Completed">Completed</option>
                      </select>
                    </td>
                    <td className="p-3">
                      {order.status.trim() === "Pending" && (
                        <button
                          onClick={() => cancelOrder(order.orderId)}
                          className="bg-red-600 hover:bg-red-700 px-3 py-1.5 rounded-md text-xs font-bold text-white shadow-sm transition-colors duration-200"
                        >
                          Cancel
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="p-5 text-center text-gray-400 text-lg">No orders found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>

      {/* Add New Order Modal Popup */}
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
              Add New Order
            </h3>
            <div className="space-y-5">
              <input
                type="text"
                name="customerId"
                placeholder="Customer ID"
                value={orderData.customerId}
                onChange={handleInputChange}
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400 transition-colors duration-200"
              />
              <input
                type="text"
                name="productId"
                placeholder="Product ID"
                value={orderData.productId}
                onChange={handleInputChange}
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400 transition-colors duration-200"
              />
              <input
                type="number"
                name="quantity"
                placeholder="Quantity"
                value={orderData.quantity}
                onChange={handleInputChange}
                className="w-full p-3 bg-gray-700 rounded-lg border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400 transition-colors duration-200"
              />
            </div>
            <button
              onClick={handleSubmit}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg mt-8 shadow-md transition-colors duration-300 ease-in-out transform hover:scale-105"
            >
              Create Order
            </button>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default OrderComponent;