import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Printer,
  FileDown,
  Edit,
  Trash2,
  CameraOff,
  BarChart3,
  QrCode,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { initialMockProducts } from "./mockProducts";

const ProductDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState<string>("details");

  // Find product by id, or default to the first one ("tessett")
  const product =
    initialMockProducts.find((p) => p.id === id) || initialMockProducts[0];

  const salesChartData = [
    { name: "October 2026", sold: 1500 },
  ];

  const purchasedChartData = [
    { name: "October 2026", purchased: 1000 },
  ];

  return (
    <div className="min-h-screen bg-[#f1f2f7] p-3 sm:p-5 font-sans text-xs sm:text-sm text-[#555]">
      {/* Top Breadcrumb & Status Info Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 text-[11px] text-[#777] border-b border-[#e2e4e8] mb-4 gap-1">
        <div className="flex items-center space-x-1.5">
          <Link to="/" className="text-[#337ab7] hover:underline">
            Home
          </Link>
          <span>/</span>
          <Link to="/pos" className="text-[#337ab7] hover:underline">
            Products
          </Link>
          <span>/</span>
          <span className="text-[#555] font-medium">{product.name}</span>
        </div>
        <div className="text-[11px] text-gray-500">
          Your IP Address 27.147.176.150 (Last login at: 04-11-2026 07:09 IP: 27.147.205.15)
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="flex items-center space-x-1 border-b border-[#d3d7db] mb-0 bg-transparent">
        {[
          { key: "details", label: "Product Details" },
          { key: "chart", label: "Chart" },
          { key: "sales", label: "Sales" },
          { key: "quotations", label: "Quotations" },
          { key: "purchases", label: "Purchases" },
          { key: "transfers", label: "Transfers" },
          { key: "quantity-adjustments", label: "Quantity Adjustments" },
        ].map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 text-xs font-semibold rounded-t-xs transition-colors cursor-pointer ${
              activeTab === tab.key
                ? "bg-white border-t-2 border-t-[#428bca] border-x border-[#d3d7db] text-[#333] -mb-[1px]"
                : "bg-[#e4e7ea] text-[#666] hover:bg-[#d8dce0] hover:text-[#333]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Main Content Area Container */}
      <div className="bg-white border border-[#d3d7db] rounded-b-sm shadow-xs">
        {/* Card Sub-Header */}
        <div className="bg-[#f8f9fa] border-b border-[#e5e5e5] px-4 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* Tab Icon */}
            {activeTab === "chart" ? (
              <BarChart3 className="w-4 h-4 text-[#428bca]" />
            ) : (
              <span className="w-3.5 h-3.5 border border-[#428bca] flex flex-col justify-center gap-[2px] p-[2px]">
                <span className="w-full h-[1px] bg-[#428bca]" />
                <span className="w-full h-[1px] bg-[#428bca]" />
                <span className="w-full h-[1px] bg-[#428bca]" />
              </span>
            )}
            <h2 className="text-[#428bca] font-semibold text-xs sm:text-sm">
              {activeTab === "chart" ? "Chart" : product.name}
            </h2>
          </div>
          {/* Top-right card toggle icon */}
          <div className="text-gray-400">
            <span className="cursor-pointer text-xs">🗕</span>
          </div>
        </div>

        {/* TAB 1: PRODUCT DETAILS */}
        {activeTab === "details" && (
          <div className="p-4 sm:p-6 space-y-6">
            <div className="text-xs font-bold text-[#444] uppercase tracking-wide">
              Product Details
            </div>

            {/* Top section: Placeholder image + Info list + Barcode/QR */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
              {/* No-image placeholder circle matching screenshot */}
              <div className="md:col-span-4 flex justify-center py-4">
                <div className="w-48 h-48 sm:w-56 sm:h-56 rounded-full border-8 border-gray-400 flex items-center justify-center relative overflow-hidden text-gray-500">
                  <div className="absolute w-full h-2 bg-gray-400 -rotate-45" />
                  <CameraOff className="w-20 h-20 text-gray-600" />
                </div>
              </div>

              {/* Product Specifications & Barcode/QR */}
              <div className="md:col-span-8 flex flex-col justify-between h-full">
                {/* Barcode & QR Code Section */}
                <div className="flex flex-col items-center sm:items-end mb-6 pr-4">
                  <span className="text-[11px] text-gray-500 mb-1">
                    Barcode & QRCode
                  </span>
                  <div className="flex items-center gap-4">
                    {/* Barcode Simulation */}
                    <div className="flex flex-col items-center">
                      <div className="flex h-12 items-stretch gap-[2px] px-2 bg-white">
                        <span className="w-[3px] bg-black" />
                        <span className="w-[1px] bg-black" />
                        <span className="w-[4px] bg-black" />
                        <span className="w-[2px] bg-black" />
                        <span className="w-[1px] bg-black" />
                        <span className="w-[3px] bg-black" />
                        <span className="w-[2px] bg-black" />
                        <span className="w-[4px] bg-black" />
                        <span className="w-[1px] bg-black" />
                        <span className="w-[2px] bg-black" />
                        <span className="w-[3px] bg-black" />
                        <span className="w-[1px] bg-black" />
                        <span className="w-[4px] bg-black" />
                      </div>
                    </div>
                    {/* QR Code Simulation */}
                    <div className="w-12 h-12 border border-gray-800 p-0.5 flex items-center justify-center bg-black text-white">
                      <QrCode className="w-10 h-10 text-white" />
                    </div>
                  </div>
                </div>

                {/* Details Attribute List */}
                <div className="space-y-1 text-xs">
                  <div className="flex py-1.5 px-4 bg-gray-50">
                    <span className="w-28 text-gray-600 font-semibold text-right pr-4">
                      Type
                    </span>
                    <span className="text-[#333] font-medium">{product.type}</span>
                  </div>
                  <div className="flex py-1.5 px-4 bg-white">
                    <span className="w-28 text-gray-600 font-semibold text-right pr-4">
                      Name
                    </span>
                    <span className="text-[#333] font-medium">{product.name}</span>
                  </div>
                  <div className="flex py-1.5 px-4 bg-gray-50">
                    <span className="w-28 text-gray-600 font-semibold text-right pr-4">
                      Code
                    </span>
                    <span className="text-[#333] font-mono">{product.code}</span>
                  </div>
                  <div className="flex py-1.5 px-4 bg-white">
                    <span className="w-28 text-gray-600 font-semibold text-right pr-4">
                      Brand
                    </span>
                    <span className="text-[#333] font-medium">{product.brand || "-"}</span>
                  </div>
                  <div className="flex py-1.5 px-4 bg-gray-50">
                    <span className="w-28 text-gray-600 font-semibold text-right pr-4">
                      Category
                    </span>
                    <span className="text-[#333] font-medium">{product.category}</span>
                  </div>
                  <div className="flex py-1.5 px-4 bg-white">
                    <span className="w-28 text-gray-600 font-semibold text-right pr-4">
                      Unit
                    </span>
                    <span className="text-[#333] font-medium">
                      {product.unit ? `${product.unit} (${product.unit})` : "-"}
                    </span>
                  </div>
                  <div className="flex py-1.5 px-4 bg-gray-50">
                    <span className="w-28 text-gray-600 font-semibold text-right pr-4">
                      Cost
                    </span>
                    <span className="text-[#333] font-mono">{product.cost.toFixed(2)}</span>
                  </div>
                  <div className="flex py-1.5 px-4 bg-white">
                    <span className="w-28 text-gray-600 font-semibold text-right pr-4">
                      Price
                    </span>
                    <span className="text-[#333] font-mono">{product.salePrice.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Warehouse Quantity Table */}
            <div className="pt-4">
              <h3 className="text-xs font-bold text-[#444] mb-2">
                Warehouse Quantity
              </h3>
              <div className="overflow-x-auto border border-[#d2d6de]">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-[#428bca] text-white">
                      <th className="py-2 px-4 font-semibold border-r border-[#357ebd]">
                        Warehouse Name
                      </th>
                      <th className="py-2 px-4 font-semibold border-r border-[#357ebd]">
                        Quantity (Racks)
                      </th>
                      <th className="py-2 px-4 font-semibold">Average Cost</th>
                    </tr>
                  </thead>
                  <tbody>
                    {product.warehouseQuantity && product.warehouseQuantity.length > 0 ? (
                      product.warehouseQuantity.map((wh, idx) => (
                        <tr key={idx} className="border-b border-gray-200">
                          <td className="py-2 px-4 text-[#555] border-r border-gray-200">
                            {wh.warehouseName}
                          </td>
                          <td className="py-2 px-4 text-[#333] font-bold border-r border-gray-200">
                            {wh.quantity.toFixed(2)}
                          </td>
                          <td className="py-2 px-4 text-[#555] font-mono">
                            {wh.averageCost.toFixed(4)}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr className="border-b border-gray-200">
                        <td className="py-2 px-4 text-[#555] border-r border-gray-200">
                          Main Warehouse (1)
                        </td>
                        <td className="py-2 px-4 text-[#333] font-bold border-r border-gray-200">
                          {product.stock.toFixed(2)}
                        </td>
                        <td className="py-2 px-4 text-[#555] font-mono">
                          {product.buyPrice.toFixed(4)}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Bottom Action Buttons Bar matching Screenshot 2 */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-0 rounded-xs overflow-hidden pt-2 font-medium text-xs">
              {/* Print Barcode/Label */}
              <button
                type="button"
                onClick={() => alert(`Print Barcode for ${product.name}`)}
                className="bg-[#428bca] hover:bg-[#3276b1] text-white py-2 px-3 flex items-center justify-center gap-2 transition-colors cursor-pointer border-r border-[#357ebd]"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Barcode/Label</span>
              </button>

              {/* PDF */}
              <button
                type="button"
                onClick={() => alert(`Downloading PDF for ${product.name}`)}
                className="bg-[#337ab7] hover:bg-[#286090] text-white py-2 px-3 flex items-center justify-center gap-2 transition-colors cursor-pointer border-r border-[#286090]"
              >
                <FileDown className="w-3.5 h-3.5" />
                <span>PDF</span>
              </button>

              {/* Edit */}
              <Link
                to="/pos/add-product"
                className="bg-[#f0ad4e] hover:bg-[#ec971f] text-white py-2 px-3 flex items-center justify-center gap-2 transition-colors cursor-pointer border-r border-[#eea236]"
              >
                <Edit className="w-3.5 h-3.5" />
                <span>Edit</span>
              </Link>

              {/* Delete */}
              <button
                type="button"
                onClick={() => alert(`Delete ${product.name}`)}
                className="bg-[#d9534f] hover:bg-[#c9302c] text-white py-2 px-3 flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: CHART (Matching Screenshot 3) */}
        {activeTab === "chart" && (
          <div className="p-4 sm:p-6 space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Sold Chart Card */}
              <div className="border border-[#d2d6de] rounded-xs bg-white">
                <div className="bg-[#f8f9fa] border-b border-[#e5e5e5] px-3 py-2 flex items-center gap-2 font-semibold text-xs text-[#337ab7]">
                  <BarChart3 className="w-3.5 h-3.5" />
                  <span>Sold</span>
                </div>
                <div className="p-4 h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={salesChartData} margin={{ top: 10, right: 20, left: 0, bottom: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e5e5" />
                      <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#666" }} />
                      <YAxis
                        ticks={[0, 250, 500, 750, 1000, 1250, 1500, 1750]}
                        domain={[0, 1800]}
                        tick={{ fontSize: 11, fill: "#666" }}
                      />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="sold"
                        stroke="#428bca"
                        strokeWidth={1}
                        dot={{ r: 4, fill: "#333", stroke: "#333" }}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Purchased Chart Card */}
              <div className="border border-[#d2d6de] rounded-xs bg-white">
                <div className="bg-[#f8f9fa] border-b border-[#e5e5e5] px-3 py-2 flex items-center gap-2 font-semibold text-xs text-[#337ab7]">
                  <BarChart3 className="w-3.5 h-3.5" />
                  <span>Purchased</span>
                </div>
                <div className="p-4 h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={purchasedChartData} margin={{ top: 10, right: 20, left: 0, bottom: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e5e5" />
                      <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#666" }} />
                      <YAxis
                        ticks={[0, 200, 400, 600, 800, 1000, 1200]}
                        domain={[0, 1300]}
                        tick={{ fontSize: 11, fill: "#666" }}
                      />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="purchased"
                        stroke="#428bca"
                        strokeWidth={1}
                        dot={{ r: 4, fill: "#333", stroke: "#333" }}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Other Tabs Placeholder */}
        {["sales", "quotations", "purchases", "transfers", "quantity-adjustments"].includes(
          activeTab
        ) && (
          <div className="p-8 text-center text-gray-500">
            <p className="text-sm">No records found for {activeTab}.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetailsPage;

