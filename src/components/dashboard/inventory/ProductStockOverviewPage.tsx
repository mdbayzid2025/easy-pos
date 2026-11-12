import React, { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Edit2,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  initialStockProducts,
  mockStockMovements,
  mockStockMovementChartData,
  type StockProduct,
  type StockMovement,
} from "./mockStockData";

export const ProductStockOverviewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Find product by id, fallback to product #2 (Rupchanda Soybean Oil 5L) to match screenshot
  const product: StockProduct =
    initialStockProducts.find((p) => p.id === id) || initialStockProducts[1];

  const [movements] = useState<StockMovement[]>(mockStockMovements);

  const renderTransactionBadge = (type: StockMovement["transactionType"]) => {
    switch (type) {
      case "Sale":
        return (
          <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#fff1f2] text-[#f43f5e] border border-[#ffe4e6]">
            Sale
          </span>
        );
      case "Adjustment (Refill)":
        return (
          <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#f0fdf4] text-[#16a34a] border border-[#dcfce7]">
            Adjustment (Refill)
          </span>
        );
      case "Return (Customer)":
        return (
          <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#ecfeff] text-[#0891b2] border border-[#cffafe]">
            Return (Customer)
          </span>
        );
      case "Damage":
        return (
          <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#fef2f2] text-[#ef4444] border border-[#fee2e2]">
            Damage
          </span>
        );
      case "Purchase":
        return (
          <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#ecfdf5] text-[#059669] border border-[#a7f3d0]">
            Purchase
          </span>
        );
    }
  };

  const totalStockValue = product.currentStock * product.purchasePrice;

  return (
    <div className="w-full min-h-screen bg-[#F7F9FB] p-4 sm:p-6 lg:p-7 space-y-5">
      {/* 1. Header & Breadcrumbs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium mb-1">
            <Link to="/" className="hover:text-slate-600 transition-colors">
              Dashboard
            </Link>
            <span>/</span>
            <span className="text-slate-400">Inventory</span>
            <span>/</span>
            <Link
              to="/inventory/stock-overview"
              className="text-slate-400 hover:text-slate-600 transition-colors"
            >
              Stock Overview
            </Link>
            <span>/</span>
            <span className="text-slate-600 font-semibold">{product.name}</span>
          </div>
        </div>
        <div className="text-xs text-slate-500 font-medium bg-white px-3 py-1.5 rounded-lg border border-slate-200/80 shadow-2xs self-start sm:self-auto">
          Saturday, Nov 7, 2026 • 12:08 PM
        </div>
      </div>

      {/* 2. Back to Stock Button */}
      <div>
        <button
          onClick={() => navigate("/inventory/stock-overview")}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg shadow-2xs transition-colors cursor-pointer"
        >
          <ArrowLeft size={14} className="text-slate-500" />
          <span>Back to Stock</span>
        </button>
      </div>

      {/* 3. Product Header Card */}
      <div className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200/80 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left: Product Thumbnail & Info */}
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-3xl shrink-0 shadow-2xs">
            {product.image}
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
              {product.name}
            </h2>
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mt-1">
              <span>SKU: {product.sku}</span>
              <span>|</span>
              <span>Barcode: {product.barcode}</span>
              <span>|</span>
              <span>Category: {product.category}</span>
            </div>
          </div>
        </div>

        {/* Right: Stock Status & Action Buttons */}
        <div className="flex flex-wrap items-center gap-3 sm:gap-4 ml-auto">
          <div className="text-right">
            <span className="text-[11px] text-slate-400 block font-medium">
              Current Stock:
            </span>
            <span className="text-base font-bold text-slate-900">
              {product.currentStock} Pcs
            </span>
          </div>

          <div className="text-right">
            <span className="text-[11px] text-slate-400 block font-medium">
              Status
            </span>
            <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#ebfbf3] text-[#16a34a] border border-[#bbf7d0]">
              {product.status}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate(`/products/product-details/${product.id}`)}
              className="h-9 px-3.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
            >
              <Edit2 size={13} className="text-slate-500" />
              <span>Edit Product</span>
            </button>

            <button
              onClick={() =>
                navigate(`/inventory/stock-adjustment?productId=${product.id}`)
              }
              className="h-9 px-3.5 bg-[#16a34a] hover:bg-[#15803d] text-white text-xs font-bold rounded-lg flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
            >
              <SlidersHorizontal size={13} />
              <span>Adjust Stock</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4. Top KPI Cards Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        {/* Current Stock */}
        <div className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-2xs">
          <p className="text-[11px] font-medium text-slate-500 mb-1">Current Stock</p>
          <p className="text-xl font-bold text-slate-900">
            {product.currentStock} Pcs
          </p>
        </div>

        {/* Available Stock */}
        <div className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-2xs">
          <p className="text-[11px] font-medium text-slate-500 mb-1">Available Stock</p>
          <p className="text-xl font-bold text-slate-900">
            {product.availableStock} Pcs
          </p>
        </div>

        {/* Reserved Stock */}
        <div className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-2xs">
          <p className="text-[11px] font-medium text-slate-500 mb-0.5">Reserved Stock</p>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl font-bold text-slate-900">
              {product.reservedStock} Pcs
            </span>
          </div>
          <span className="text-[10px] text-slate-400 block mt-0.5">
            (for pending orders)
          </span>
        </div>

        {/* Minimum Stock Alert */}
        <div className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-2xs">
          <p className="text-[11px] font-medium text-slate-500 mb-1">Minimum Stock Alert</p>
          <p className="text-xl font-bold text-slate-900">{product.minStock} Pcs</p>
        </div>

        {/* Total Stock Value */}
        <div className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-2xs col-span-2 sm:col-span-1">
          <p className="text-[11px] font-medium text-slate-500 mb-1">Total Stock Value</p>
          <p className="text-xl font-bold text-slate-900">
            ৳{totalStockValue.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </p>
        </div>
      </div>

      {/* 5. Product Information Card */}
      <div className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200/80 shadow-2xs space-y-3">
        <h3 className="text-xs font-bold text-slate-800 tracking-tight">
          Product Information
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 pt-1">
          <div>
            <span className="text-[11px] text-slate-400 block font-medium">Purchase Price</span>
            <span className="text-sm font-bold text-slate-800 mt-0.5 block">
              ৳{product.purchasePrice.toFixed(2)}
            </span>
          </div>
          <div>
            <span className="text-[11px] text-slate-400 block font-medium">Selling Price</span>
            <span className="text-sm font-bold text-slate-800 mt-0.5 block">
              ৳{product.sellingPrice.toFixed(2)}
            </span>
          </div>
          <div>
            <span className="text-[11px] text-slate-400 block font-medium">Unit</span>
            <span className="text-sm font-bold text-slate-800 mt-0.5 block">
              {product.unit.toUpperCase()}
            </span>
          </div>
          <div>
            <span className="text-[11px] text-slate-400 block font-medium">Supplier</span>
            <span className="text-sm font-bold text-slate-800 mt-0.5 block line-clamp-1">
              {product.supplier}
            </span>
          </div>
          <div>
            <span className="text-[11px] text-slate-400 block font-medium">Last Purchase Date</span>
            <span className="text-sm font-bold text-slate-800 mt-0.5 block">
              {product.lastPurchaseDate}
            </span>
          </div>
          <div>
            <span className="text-[11px] text-slate-400 block font-medium">Last Purchase Price</span>
            <span className="text-sm font-bold text-slate-800 mt-0.5 block">
              ৳{product.lastPurchasePrice.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* 6. Lower Two Columns (History Table & Stock Chart) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column (7 cols): Stock Movement History */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200/80 shadow-2xs overflow-hidden flex flex-col justify-between">
          <div>
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-xs sm:text-sm font-bold text-slate-900 tracking-tight">
                Stock Movement History
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/75 text-[11px] font-bold text-slate-500">
                    <th className="py-2.5 px-3">Date & Time</th>
                    <th className="py-2.5 px-3">Reference</th>
                    <th className="py-2.5 px-3">Transaction Type</th>
                    <th className="py-2.5 px-2 text-right">Stock In</th>
                    <th className="py-2.5 px-2 text-right">Stock Out</th>
                    <th className="py-2.5 px-2 text-right">Balance</th>
                    <th className="py-2.5 px-3">User</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {movements.map((m) => (
                    <tr key={m.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-2.5 px-3 text-slate-600 font-medium whitespace-nowrap">
                        {m.dateTime}
                      </td>
                      <td className="py-2.5 px-3 font-mono text-[11px] text-slate-700">
                        {m.reference}
                      </td>
                      <td className="py-2.5 px-3">
                        {renderTransactionBadge(m.transactionType)}
                      </td>
                      <td className="py-2.5 px-2 text-right font-semibold text-emerald-600">
                        {m.stockIn ? `${m.stockIn} pcs` : "--"}
                      </td>
                      <td className="py-2.5 px-2 text-right font-semibold text-rose-500">
                        {m.stockOut ? `${m.stockOut} ${m.unit}` : "--"}
                      </td>
                      <td className="py-2.5 px-2 text-right font-bold text-slate-800">
                        {m.balance} pcs
                      </td>
                      <td className="py-2.5 px-3 text-slate-600 font-medium whitespace-nowrap">
                        {m.user}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          <div className="px-4 py-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Showing 1-6 of 32 movements</span>
            <div className="flex items-center gap-1">
              <button className="w-6 h-6 rounded border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 cursor-pointer">
                <ChevronLeft size={13} />
              </button>
              <button className="w-6 h-6 rounded bg-[#162220] text-white flex items-center justify-center font-bold text-xs cursor-pointer">
                1
              </button>
              <button className="w-6 h-6 rounded border border-slate-200 text-slate-600 flex items-center justify-center text-xs hover:bg-slate-50 cursor-pointer">
                2
              </button>
              <button className="w-6 h-6 rounded border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 cursor-pointer">
                <ChevronRight size={13} />
              </button>
            </div>
          </div>
        </div>

        {/* Right Column (5 cols): Stock Movement Chart */}
        <div className="lg:col-span-5 bg-white rounded-xl p-4 border border-slate-200/80 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between gap-2 mb-3">
              <div>
                <h3 className="text-xs sm:text-sm font-bold text-slate-900 tracking-tight">
                  Stock Movement Chart
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Stock Level over Time
                </p>
              </div>
              <span className="inline-block px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#f0fdf4] text-[#16a34a] border border-[#bbf7d0]">
                Last restocked: Oct 24, 2026 (+50 Pcs)
              </span>
            </div>

            {/* Chart Area */}
            <div className="h-64 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={mockStockMovementChartData}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="stockGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#16a34a" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#16a34a" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis
                    dataKey="date"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10, fill: "#94a3b8" }}
                  />
                  <YAxis
                    domain={[30, 65]}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10, fill: "#94a3b8" }}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-[#1e293b] text-white p-2 rounded-lg text-xs shadow-lg border border-slate-700">
                            <p className="font-bold">{data.date}</p>
                            <p className="text-emerald-400 font-semibold">
                              Stock: {data.stock} pcs
                            </p>
                            <p className="text-slate-300 text-[10px]">
                              {data.event}
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="stock"
                    stroke="#16a34a"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#stockGradient)"
                    dot={{ r: 3, fill: "#16a34a", strokeWidth: 1.5, stroke: "#ffffff" }}
                    activeDot={{ r: 5, fill: "#16a34a" }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
            <span>Range: Oct 24 - Nov 7, 2026</span>
            <span className="font-semibold text-slate-700">Net Change: +2 Pcs</span>
          </div>
        </div>
      </div>

      {/* Footer Branding */}
      <div className="text-center text-[11px] text-slate-400 py-1">
        Grocery POS v2.4.1
      </div>
    </div>
  );
};

export default ProductStockOverviewPage;
