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
      console.error("JWT Token is missing");
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
    }
  }, [token]);

  useEffect(() => {
    if (!userData) {
      navigate("/login");
      return;
    }
    fetchOrders();
  }, [userData, navigate, fetchOrders]);

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
          {/* Search bar */}
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          {/* Add Order button - moved here */}
          <button
            onClick={() => setShowForm(true)}
            className="h-10 px-4 bg-green-600 rounded-xl hover:bg-green-700 transition duration-200"
          >
            Add Order
          </button>
          {/* Profile link */}
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
        <h2 className="text-white text-2xl font-bold pb-6">Your Orders</h2>

        {notification && (
          <NotificationPopup
            message={notification.message}
            type={notification.type}
            onClose={() => setNotification(null)}
          />
        )}

        <div className="bg-gray-800 rounded-lg shadow-lg p-5 overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="p-3">Order ID</th>
                <th className="p-3">Date</th>
                <th className="p-3">Product Name</th>{" "}
                {/* Changed from Product */}
                <th className="p-3">Price</th>
                <th className="p-3">Quantity</th>
                <th className="p-3">Total</th>
                <th className="p-3">Status</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order.orderId} className="border-b border-gray-700">
                  <td className="p-3">#{order.orderId ?? "N/A"}</td>
                  <td className="p-3">
                    {new Date(
                      order.orderDate ?? Date.now()
                    ).toLocaleDateString()}
                  </td>
                  <td className="p-3">
                    {order.productName ?? "Unknown Product"}{" "}
                    {/* Display product name */}
                  </td>
                  <td className="p-3">
                    ${order.productPrice?.toFixed(2) ?? "0.00"}
                  </td>
                  <td className="p-3">{order.quantity}</td>
                  <td className="p-3">
                    ${order.totalPrice?.toFixed(2) ?? "0.00"}
                  </td>
                  <td className="p-3">
                    <select
                      value={order.status}
                      onChange={(e) =>
                        updateOrderStatus(order.orderId, e.target.value)
                      }
                      className={`px-4 py-1 rounded-lg text-sm ${getStatusColor(
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
                        className="bg-red-500 hover:bg-red-700 px-3 py-1 rounded-lg text-sm"
                      >
                        Cancel Order
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {/* The "Add Order" button that was fixed to the bottom-right has been removed from here. */}
        </div>
      </div>
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-8 rounded-xl shadow-2xl w-full max-w-md mx-auto relative transform transition-all duration-300 ease-out scale-100 opacity-100">
            <button
              onClick={() => setShowForm(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl"
              aria-label="Close"
            >
              &times;
            </button>
            <h3 className="text-2xl font-semibold mb-6 text-center text-white">
              Add New Order
            </h3>
            <div className="space-y-4">
              <input
                type="text"
                name="customerId"
                placeholder="Customer ID"
                value={orderData.customerId}
                onChange={handleInputChange}
                className="w-full p-3 bg-gray-700 rounded-lg border border-gray-600 focus:ring-2 focus:ring-green-500 focus:border-transparent text-white placeholder-gray-400"
              />
              <input
                type="text"
                name="productId"
                placeholder="Product ID"
                value={orderData.productId}
                onChange={handleInputChange}
                className="w-full p-3 bg-gray-700 rounded-lg border border-gray-600 focus:ring-2 focus:ring-green-500 focus:border-transparent text-white placeholder-gray-400"
              />
              <input
                type="number"
                name="quantity"
                placeholder="Quantity"
                value={orderData.quantity}
                onChange={handleInputChange}
                className="w-full p-3 bg-gray-700 rounded-lg border border-gray-600 focus:ring-2 focus:ring-green-500 focus:border-transparent text-white placeholder-gray-400"
              />
            </div>
            <button
              onClick={handleSubmit}
              className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-3 px-4 rounded-lg mt-6 transition duration-200"
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