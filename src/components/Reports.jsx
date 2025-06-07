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
  const [startDate, setStartDate] = useState(""); // YYYY-MM-DD
  const [endDate, setEndDate] = useState(""); // YYYY-MM-DD

  // State for displaying report results
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    if (!userData) {
      navigate("/");
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
    setReportData(null); // Clear previous report data
  };

  const generateReport = useCallback(async () => {
    if (!token) {
      setNotification({ message: "Authentication token missing.", type: "error" });
      return;
    }
    if (!reportType) {
      setNotification({ message: "Please select a report type.", type: "error" });
      return;
    }
    if (!startDate || !endDate) {
      setNotification({ message: "Please select both start and end dates.", type: "error" });
      return;
    }
    if (new Date(startDate) > new Date(endDate)) {
      setNotification({ message: "Start date cannot be after end date.", type: "error" });
      return;
    }

    setLoading(true);
    setReportData(null); // Clear previous report data

    try {
      const payload = {
        reportType: reportType,
        startDate: startDate,
        endDate: endDate,
      };

      const response = await axios.post("http://localhost:8080/api/reports/generate", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setReportData(response.data);
      setNotification({ message: `Report generated successfully for ${reportType}!`, type: "success" });
    } catch (err) {
      console.error("Error generating report:", err);
      const errorMessage = err.response?.data || "Failed to generate report. Please try again.";
      setNotification({ message: errorMessage, type: "error" });
    } finally {
      setLoading(false);
    }
  }, [token, reportType, startDate, endDate]); // Removed 'parameters' from dependency array

  if (!userData) return null; // Or a loading spinner/redirect message

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white">
      {/* Navbar - Re-using the structure from OrderComponent */}
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
          <Search searchTerm={""} setSearchTerm={() => {}} />{" "}
          {/* Search not directly relevant here, but for consistency */}
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
        <h2 className="text-white text-2xl font-bold pb-6">Report Generation</h2>

        {notification && (
          <NotificationPopup
            message={notification.message}
            type={notification.type}
            onClose={() => setNotification(null)}
          />
        )}

        <div className="bg-gray-800 rounded-lg shadow-lg p-6 space-y-6">
          {/* Report Type and Date Selection */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="reportType" className="block text-gray-300 text-sm font-bold mb-2">
                Select Report Type:
              </label>
              <select
                id="reportType"
                name="reportType"
                value={reportType}
                onChange={handleReportTypeChange}
                className="w-full p-3 bg-gray-700 rounded-lg border border-gray-600 focus:ring-2 focus:ring-green-500 focus:border-transparent text-white"
              >
                <option value="">-- Choose --</option>
                <option value="inventory">Inventory Report</option>
                <option value="order">Order Report</option>
                <option value="supplier">Supplier Report</option>
              </select>
            </div>

            <div>
              <label htmlFor="startDate" className="block text-gray-300 text-sm font-bold mb-2">
                Start Date:
              </label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                value={startDate}
                onChange={handleDateChange}
                className="w-full p-3 bg-gray-700 rounded-lg border border-gray-600 focus:ring-2 focus:ring-green-500 focus:border-transparent text-white"
              />
            </div>

            <div>
              <label htmlFor="endDate" className="block text-gray-300 text-sm font-bold mb-2">
                End Date:
              </label>
              <input
                type="date"
                id="endDate"
                name="endDate"
                value={endDate}
                onChange={handleDateChange}
                className="w-full p-3 bg-gray-700 rounded-lg border border-gray-600 focus:ring-2 focus:ring-green-500 focus:border-transparent text-white"
              />
            </div>
          </div>

          {/* Dynamic Parameters Input - REMOVED THIS ENTIRE SECTION */}

          <button
            onClick={generateReport}
            disabled={loading || !reportType || !startDate || !endDate}
            className={`w-full py-3 px-6 rounded-lg font-bold text-white transition duration-200 ${
              loading || !reportType || !startDate || !endDate
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-500 shadow-lg"
            }`}
          >
            {loading ? "Generating Report..." : "Generate Report"}
          </button>
        </div>

        {/* Display Generated Report */}
        {reportData && (
          <div className="mt-8 bg-gray-800 rounded-lg shadow-lg p-5 overflow-x-auto">
            <h3 className="text-xl font-semibold text-gray-200 mb-4">Generated Report:</h3>

            {/* Inventory Report Display */}
            {reportType === "inventory" && reportData && Array.isArray(reportData) && (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="p-3">Product ID</th>
                    <th className="p-3">Product Name</th>
                    <th className="p-3">Initial Stock</th>
                    <th className="p-3">Stock Added</th>
                    <th className="p-3">Stock Removed</th>
                    <th className="p-3">Final Stock</th>
                    <th className="p-3">Reorder Level</th>
                    <th className="p-3">Low Stock?</th>
                  </tr>
                </thead>
                <tbody>
                  {reportData.map((item) => (
                    <tr key={item.productId} className="border-b border-gray-700">
                      <td className="p-3">{item.productId}</td>
                      <td className="p-3">{item.productName}</td>
                      <td className="p-3">{item.initialStock}</td>
                      <td className="p-3">{item.stockAdded}</td>
                      <td className="p-3">{item.stockRemoved}</td>
                      <td className="p-3">{item.finalStock}</td>
                      <td className="p-3">{item.reorderLevel}</td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            item.isLowStock ? "bg-red-500 text-white" : "bg-green-500 text-white"
                          }`}
                        >
                          {item.isLowStock ? "Yes" : "No"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {/* Order Report Display */}
            {reportType === "order" && reportData && (
              <div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6 text-center">
                  <div className="p-4 bg-gray-700 rounded-lg">
                    <p className="text-gray-300 text-sm">Total Orders:</p>
                    <p className="text-2xl font-bold">{reportData.totalOrders}</p>
                  </div>
                  <div className="p-4 bg-gray-700 rounded-lg">
                    <p className="text-gray-300 text-sm">Pending Orders:</p>
                    <p className="text-2xl font-bold">{reportData.pendingOrders}</p>
                  </div>
                  <div className="p-4 bg-gray-700 rounded-lg">
                    <p className="text-gray-300 text-sm">Shipped Orders:</p>
                    <p className="text-2xl font-bold">{reportData.shippedOrders}</p>
                  </div>
                  <div className="p-4 bg-gray-700 rounded-lg">
                    <p className="text-gray-300 text-sm">Delivered Orders:</p>
                    <p className="text-2xl font-bold">{reportData.deliveredOrders}</p>
                  </div>
                  <div className="p-4 bg-gray-700 rounded-lg col-span-full md:col-span-1">
                    <p className="text-gray-300 text-sm">Total Revenue:</p>
                    <p className="text-2xl font-bold">${reportData.totalRevenue?.toFixed(2)}</p>
                  </div>
                </div>

                <h4 className="text-lg font-semibold text-gray-200 mb-3">Top Selling Products:</h4>
                {reportData.topSellingProducts && reportData.topSellingProducts.length > 0 ? (
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-gray-700">
                        <th className="p-3">Product Name</th>
                        <th className="p-3">Units Sold</th>
                        <th className="p-3">Total Revenue</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reportData.topSellingProducts.map((product, index) => (
                        <tr key={index} className="border-b border-gray-700">
                          <td className="p-3">{product.productName}</td>
                          <td className="p-3">{product.unitsSold}</td>
                          <td className="p-3">${product.totalRevenue?.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p className="text-gray-400">No top selling products found for this period.</p>
                )}
              </div>
            )}

            {/* Supplier Report Display */}
            {reportType === "supplier" && reportData && Array.isArray(reportData) && (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="p-3">Supplier ID</th>
                    <th className="p-3">Supplier Name</th>
                    <th className="p-3">Products Supplied Count</th>
                    <th className="p-3">Total Quantity Supplied</th>
                  </tr>
                </thead>
                <tbody>
                  {reportData.map((item) => (
                    <tr key={item.supplierId} className="border-b border-gray-700">
                      <td className="p-3">{item.supplierId}</td>
                      <td className="p-3">{item.supplierName}</td>
                      <td className="p-3">{item.productsSupplied}</td>
                      <td className="p-3">{item.totalQuantitySupplied}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {reportData && !Array.isArray(reportData) && reportType !== "order" && (
                <p className="text-gray-400">No data found for this report type and criteria.</p>
            )}
             {reportData && Array.isArray(reportData) && reportData.length === 0 && (
                <p className="text-gray-400">No data found for this report type and criteria.</p>
            )}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default ReportGenerator;