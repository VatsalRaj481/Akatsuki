import React, { useContext, useState, useEffect, useCallback } from "react";
import axios from "axios";
import { UserContext } from "../UserContext"; // Adjust path if necessary
import { Link, useNavigate } from "react-router-dom";
import Search from "../Search"; // Adjust path if necessary
import Footer from "../Footer"; // Adjust path if necessary
import NotificationPopup from "../NotificationPopup"; // Adjust path if necessary

const ReportGenerator = () => {
  const { userData } = useContext(UserContext);
  const navigate = useNavigate();
  const token = localStorage.getItem("userToken");

  // State for report generation
  const [reportType, setReportType] = useState(""); // e.g., "inventory", "order", "supplier"
  const [startDate, setStartDate] = useState(""); //YYYY-MM-DD
  const [endDate, setEndDate] = useState(""); //YYYY-MM-DD
  const [parameters, setParameters] = useState({}); // New state for dynamic parameters

  // State for displaying report results
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    // Redirect if user data is not available, indicating not logged in.
    // userData could be null initially before the context fully loads.
    if (userData === undefined) {
      return; // Still loading user data, do nothing yet
    }
    if (!userData) {
      // Added notification and navigation for consistency
      setNotification({ message: "Please log in to generate reports.", type: "error" });
      navigate("/login");
      return;
    }
  }, [userData, navigate]);

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    if (name === "startDate") {
      setStartDate(value);
    } else {
      setEndDate(value);
    }
  };

  const handleReportTypeChange = (e) => {
    setReportType(e.target.value);
    setReportData(null); // Clear previous report data when type changes
    setParameters({}); // Clear parameters when report type changes
  };

  const handleParameterChange = (e) => {
    const { name, value, type } = e.target;
    let processedValue = value;

    // Convert to number for numeric inputs if not empty, otherwise null
    if (type === "number") {
      processedValue = value === "" ? null : Number(value);
    } else {
      // For text/select inputs, if value is empty, treat as null for API payload
      processedValue = value === "" ? null : value;
    }

    setParameters((prevParams) => {
      const newParams = { ...prevParams };
      if (
        processedValue === null ||
        processedValue === undefined ||
        processedValue === "" // Ensure empty strings also remove the parameter
      ) {
        // Remove the parameter if its value is effectively empty
        delete newParams[name];
      } else {
        newParams[name] = processedValue;
      }
      return newParams;
    });
  };

  const generateReport = useCallback(async () => {
    if (!token) {
      setNotification({
        message: "Authentication token missing. Please log in.",
        type: "error",
      });
      navigate("/login"); // Navigate to login if token is missing
      return;
    }
    if (!reportType) {
      setNotification({
        message: "Please select a report type.",
        type: "error",
      });
      return;
    }
    if (!startDate || !endDate) {
      setNotification({
        message: "Please select both start and end dates.",
        type: "error",
      });
      return;
    }
    if (new Date(startDate) > new Date(endDate)) {
      setNotification({
        message: "Start date cannot be after end date.",
        type: "error",
      });
      return;
    }

    setLoading(true);
    setReportData(null); // Clear previous report data

    try {
      const payload = {
        reportType: reportType,
        startDate: startDate,
        endDate: endDate,
        parameters: parameters, // Include the parameters object
      };

      console.log("Sending payload:", payload); // Log the payload for debugging

      const response = await axios.post(
        "http://localhost:8080/api/reports/generate",
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setReportData(response.data);
      setNotification({
        message: `Report generated successfully for ${reportType}!`,
        type: "success",
      });
    } catch (err) {
      console.error("Error generating report:", err);
      // More robust way to get error message from backend
      const errorMessage =
        err.response?.data?.message || // Specific error message from backend
        (typeof err.response?.data === 'string' ? err.response.data : null) || // Backend sends plain string error
        err.message || // Axios or network error message
        "Failed to generate report. Please try again.";

      setNotification({ message: errorMessage, type: "error" });
    } finally {
      setLoading(false);
    }
  }, [token, reportType, startDate, endDate, parameters, navigate]); // Added 'navigate' to dependency array

  // Changed to show login prompt for consistency
  if (!userData) {
    return (
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-950 to-gray-800 text-white font-sans items-center justify-center">
        <p className="text-lg mb-4">Please log in to generate reports.</p>
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
              fill="currentColor"
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
          <Search searchTerm={""} setSearchTerm={() => {}} /> {/* Keep if relevant, otherwise remove */}
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
        {/* Heading: "Report Generation", left-aligned and full width */}
        <h2 className="text-3xl font-extrabold text-white mb-8 w-full text-left">Report Generation</h2>

        {/* Notification Popup */}
        {notification && (
          <NotificationPopup
            message={notification.message}
            type={notification.type}
            onClose={() => setNotification(null)}
          />
        )}

        <div className="bg-gray-800 rounded-lg shadow-xl p-5 overflow-x-auto w-full max-w-7xl mx-auto border border-gray-700">
          {/* Report Type and Date Selection */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div>
              <label
                htmlFor="reportType"
                className="block text-gray-300 text-sm font-semibold mb-2"
              >
                Select Report Type:
              </label>
              <div className="relative">
                <select
                  id="reportType"
                  name="reportType"
                  value={reportType}
                  onChange={handleReportTypeChange}
                  className="w-full p-3 bg-gray-700 rounded-lg border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white appearance-none pr-8 transition-colors duration-200"
                >
                  <option value="">-- Choose Report Type --</option>
                  <option value="inventory">Inventory Report</option>
                  <option value="order">Order Report</option>
                  <option value="supplier">Supplier Report</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 6.757 7.586 5.343 9z"/></svg>
                </div>
              </div>
            </div>

            <div>
              <label
                htmlFor="startDate"
                className="block text-gray-300 text-sm font-semibold mb-2"
              >
                Start Date:
              </label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                value={startDate}
                onChange={handleDateChange}
                max={new Date().toISOString().split('T')[0]} // Max date is today
                className="w-full p-3 bg-gray-700 rounded-lg border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white transition-colors duration-200"
              />
            </div>

            <div>
              <label
                htmlFor="endDate"
                className="block text-gray-300 text-sm font-semibold mb-2"
              >
                End Date:
              </label>
              <input
                type="date"
                id="endDate"
                name="endDate"
                value={endDate}
                onChange={handleDateChange}
                min={startDate} // End date cannot be before start date
                max={new Date().toISOString().split('T')[0]} // Max date is today
                className="w-full p-3 bg-gray-700 rounded-lg border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white transition-colors duration-200"
              />
            </div>
          </div>

          {/* Dynamic Parameters Input */}
          {reportType && (
            <div className="bg-gray-700 rounded-lg p-5 mt-4 border border-gray-600">
              <h4 className="text-lg font-bold text-gray-200 mb-4">
                Additional Filters:
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {reportType === "inventory" && (
                  <div>
                    <label
                      htmlFor="minStock"
                      className="block text-gray-300 text-sm font-semibold mb-2"
                    >
                      Minimum Final Stock:
                    </label>
                    <input
                      type="number"
                      id="minStock"
                      name="minStock"
                      value={
                        parameters.minStock === null ? "" : parameters.minStock
                      } // Display empty for null
                      onChange={handleParameterChange}
                      placeholder="e.g., 10"
                      min="0" // Stock cannot be negative
                      className="w-full p-3 bg-gray-600 rounded-lg border border-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400 transition-colors duration-200"
                    />
                  </div>
                )}

                {reportType === "order" && (
                  <>
                    <div>
                      <label
                        htmlFor="status"
                        className="block text-gray-300 text-sm font-semibold mb-2"
                      >
                        Order Status:
                      </label>
                      <div className="relative">
                        <select
                          id="status"
                          name="status"
                          value={parameters.status || ""}
                          onChange={handleParameterChange}
                          className="w-full p-3 bg-gray-600 rounded-lg border border-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white appearance-none pr-8 transition-colors duration-200"
                        >
                          <option value="">-- All Statuses --</option>
                          <option value="Pending">Pending</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                          <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 6.757 7.586 5.343 9z"/></svg>
                        </div>
                      </div>
                    </div>
                    <div>
                      <label
                        htmlFor="customerId"
                        className="block text-gray-300 text-sm font-semibold mb-2"
                      >
                        Customer ID:
                      </label>
                      <input
                        type="number"
                        id="customerId"
                        name="customerId"
                        value={
                          parameters.customerId === null
                            ? ""
                            : parameters.customerId
                        } // Display empty for null
                        onChange={handleParameterChange}
                        placeholder="e.g., 123"
                        min="1" // Customer ID should generally be positive
                        className="w-full p-3 bg-gray-600 rounded-lg border border-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400 transition-colors duration-200"
                      />
                    </div>
                  </>
                )}

                {reportType === "supplier" && (
                  <div>
                    <label
                      htmlFor="minProductsSupplied"
                      className="block text-gray-300 text-sm font-semibold mb-2"
                    >
                      Minimum Products Supplied:
                    </label>
                    <input
                      type="number"
                      id="minProductsSupplied"
                      name="minProductsSupplied"
                      value={
                        parameters.minProductsSupplied === null
                          ? ""
                          : parameters.minProductsSupplied
                      } // Display empty for null
                      onChange={handleParameterChange}
                      placeholder="e.g., 5"
                      min="0" // Quantity cannot be negative
                      className="w-full p-3 bg-gray-600 rounded-lg border border-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400 transition-colors duration-200"
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          <button
            onClick={generateReport}
            disabled={loading || !reportType || !startDate || !endDate}
            className={`
              w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg mt-8 shadow-md transition-colors duration-300 ease-in-out transform hover:scale-105
              ${loading || !reportType || !startDate || !endDate
                ? "bg-gray-600 text-gray-400 cursor-not-allowed" // Disabled state
                : "" // Enabled state handled by the main classes
              }
            `}
          >
            {loading ? "Generating Report..." : "Generate Report"}
          </button>
        </div>

        {/* Display Generated Report */}
        {reportData && (
          <div className="mt-8 bg-gray-800 rounded-lg shadow-xl p-5 overflow-x-auto w-full max-w-7xl mx-auto border border-gray-700">
            <h3 className="text-xl font-bold text-gray-200 mb-5 border-b border-gray-700 pb-3">
              Generated Report:
            </h3>

            {/* Display filters applied */}
            {Object.keys(parameters).length > 0 && (
              <p className="text-gray-400 text-sm mb-4 italic px-2 py-1 bg-gray-700 rounded-md inline-block">
                **Filters applied:**{" "}
                {Object.entries(parameters)
                  .filter(([, value]) => value !== null && value !== "")
                  .map(([key, value]) => {
                    let displayKey = key;
                    if (key === "minStock") displayKey = "Min. Final Stock";
                    if (key === "customerId") displayKey = "Customer ID";
                    if (key === "minProductsSupplied") displayKey = "Min. Products Supplied";
                    if (key === "status") displayKey = "Order Status";
                    return `${displayKey}: ${value}`;
                  })
                  .join(", ")}
              </p>
            )}

            {/* General "No data found" message if reportData is an empty array for list reports */}
            {((reportType === "inventory" || reportType === "supplier") && reportData.length === 0) && (
              <p className="p-5 text-center text-gray-400 text-lg">
                No data found for the selected report type and criteria.
              </p>
            )}

            {/* Inventory Report Display */}
            {reportType === "inventory" && Array.isArray(reportData) && reportData.length > 0 && (
              <div className="overflow-x-auto mt-4">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-700 text-gray-300">
                      <th className="p-3 font-semibold text-sm uppercase tracking-wider">
                        Product ID
                      </th>
                      <th className="p-3 font-semibold text-sm uppercase tracking-wider">
                        Product Name
                      </th>
                      <th className="p-3 font-semibold text-sm uppercase tracking-wider">
                        Initial Stock
                      </th>
                      <th className="p-3 font-semibold text-sm uppercase tracking-wider">
                        Stock Added
                      </th>
                      <th className="p-3 font-semibold text-sm uppercase tracking-wider">
                        Stock Removed
                      </th>
                      <th className="p-3 font-semibold text-sm uppercase tracking-wider">
                        Final Stock
                      </th>
                      <th className="p-3 font-semibold text-sm uppercase tracking-wider">
                        Reorder Level
                      </th>
                      <th className="p-3 font-semibold text-sm uppercase tracking-wider">
                        Low Stock?
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {reportData.map((item) => (
                      <tr
                        key={item.productId}
                        className="border-b border-gray-700 last:border-b-0 hover:bg-gray-700 transition-colors duration-200"
                      >
                        <td className="p-3 text-sm text-gray-200">
                          #{item.productId}
                        </td>
                        <td className="p-3 text-sm text-blue-400 font-medium">
                          {item.productName}
                        </td>
                        <td className="p-3 text-sm text-gray-200">
                          {item.initialStock}
                        </td>
                        <td className="p-3 text-sm text-gray-200">
                          {item.stockAdded}
                        </td>
                        <td className="p-3 text-sm text-gray-200">
                          {item.stockRemoved}
                        </td>
                        <td className="p-3 text-sm text-gray-200">
                          {item.finalStock}
                        </td>
                        <td className="p-3 text-sm text-gray-200">
                          {item.reorderLevel}
                        </td>
                        <td className="p-3 text-sm font-medium">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                              item.isLowStock
                                ? "bg-red-600 text-white"
                                : "bg-green-600 text-white"
                            }`}
                          >
                            {item.isLowStock ? "Yes" : "No"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Order Report Display */}
            {reportType === "order" && reportData && (reportData.totalOrders > 0 || Object.keys(reportData).length > 0) && ( // Check for totalOrders or if reportData object is not empty
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-center mt-4">
                  <div className="p-4 bg-gray-700 rounded-lg shadow-md border border-gray-600">
                    <p className="text-gray-300 text-sm">Total Orders:</p>
                    <p className="text-3xl font-extrabold text-green-400">
                      {reportData.totalOrders}
                    </p>
                  </div>
                  <div className="p-4 bg-gray-700 rounded-lg shadow-md border border-gray-600">
                    <p className="text-gray-300 text-sm">Pending Orders:</p>
                    <p className="text-3xl font-extrabold text-orange-400">
                      {reportData.pendingOrders}
                    </p>
                  </div>
                  <div className="p-4 bg-gray-700 rounded-lg shadow-md border border-gray-600">
                    <p className="text-gray-300 text-sm">Shipped Orders:</p>
                    <p className="text-3xl font-extrabold text-blue-400">
                      {reportData.shippedOrders}
                    </p>
                  </div>
                  <div className="p-4 bg-gray-700 rounded-lg shadow-md border border-gray-600">
                    <p className="text-gray-300 text-sm">Delivered Orders:</p>
                    <p className="text-3xl font-extrabold text-emerald-400">
                      {reportData.deliveredOrders}
                    </p>
                  </div>
                  <div className="p-4 bg-gray-700 rounded-lg shadow-md col-span-full md:col-span-1 border border-gray-600">
                    <p className="text-gray-300 text-sm">Total Revenue:</p>
                    <p className="text-3xl font-extrabold text-yellow-400">
                      ${reportData.totalRevenue?.toFixed(2)}
                    </p>
                  </div>
                </div>

                <h4 className="text-lg font-bold text-gray-200 mb-3 pt-4 border-t border-gray-700">
                  Top Selling Products:
                </h4>
                {reportData.topSellingProducts &&
                reportData.topSellingProducts.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-gray-700 text-gray-300">
                          <th className="p-3 font-semibold text-sm uppercase tracking-wider">
                            Product Name
                          </th>
                          <th className="p-3 font-semibold text-sm uppercase tracking-wider">
                            Units Sold
                          </th>
                          <th className="p-3 font-semibold text-sm uppercase tracking-wider">
                            Total Revenue
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {reportData.topSellingProducts.map((item, index) => (
                          <tr
                            key={index}
                            className="border-b border-gray-700 last:border-b-0 hover:bg-gray-700 transition-colors duration-200"
                          >
                            <td className="p-3 text-sm text-blue-400 font-medium">
                              {item.productName}
                            </td>
                            <td className="p-3 text-sm text-gray-200">
                              {item.unitsSold}
                            </td>
                            <td className="p-3 text-sm text-gray-200">
                              ${item.totalRevenue?.toFixed(2)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="p-5 text-center text-gray-400 text-lg">
                    No top selling products found for the selected criteria.
                  </p>
                )}
              </div>
            )}

            {/* Supplier Report Display */}
            {reportType === "supplier" && Array.isArray(reportData) && reportData.length > 0 && (
              <div className="overflow-x-auto mt-4">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-700 text-gray-300">
                      <th className="p-3 font-semibold text-sm uppercase tracking-wider">
                        Supplier ID
                      </th>
                      <th className="p-3 font-semibold text-sm uppercase tracking-wider">
                        Supplier Name
                      </th>
                      <th className="p-3 font-semibold text-sm uppercase tracking-wider">
                        Products Supplied
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {reportData.map((item) => (
                      <tr
                        key={item.supplierId}
                        className="border-b border-gray-700 last:border-b-0 hover:bg-gray-700 transition-colors duration-200"
                      >
                        <td className="p-3 text-sm text-gray-200">
                          #{item.supplierId}
                        </td>
                        <td className="p-3 text-sm text-blue-400 font-medium">
                          {item.supplierName}
                        </td>
                        <td className="p-3 text-sm text-gray-200">
                          {item.productsSupplied}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* No report data message - for Order if totalOrders is 0 and other report types */}
            {reportType === "order" && reportData && reportData.totalOrders === 0 && (
              <p className="p-5 text-center text-gray-400 text-lg">
                No order data found for the selected criteria.
              </p>
            )}

            {/* Initial message */}
            {!reportData && !loading && reportType === "" && (
              <p className="p-5 text-center text-gray-400 text-lg">
                Select report type and dates to generate a report.
              </p>
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default ReportGenerator;