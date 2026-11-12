import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Search,
  Download,
  SlidersHorizontal,
  History,
  Edit2,
} from "lucide-react";
import { initialStockProducts, type StockProduct } from "./mockStockData";

export const StockOverviewPage: React.FC = () => {
  const navigate = useNavigate();
  const [products] = useState<StockProduct[]>(initialStockProducts);

  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedBrand, setSelectedBrand] = useState("All Brands");
  const [selectedStatus, setSelectedStatus] = useState("All Status");
  const [selectedWarehouse, setSelectedWarehouse] = useState("All Warehouses");
  const [currentPage, setCurrentPage] = useState(1);

  // Extract unique categories and brands
  const categories = [
    "All Categories",
    ...Array.from(new Set(initialStockProducts.map((p) => p.category))),
  ];
  const brands = [
    "All Brands",
    ...Array.from(new Set(initialStockProducts.map((p) => p.brand))),
  ];
  const statuses = ["All Status", "In Stock", "Low Stock", "Out of Stock"];
  const warehouses = [
    "All Warehouses",
    "Warehouse A",
    "Warehouse B",
    "Main Storage",
  ];

  // Filtering
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.barcode.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === "All Categories" ||
      product.category === selectedCategory;

    const matchesBrand =
      selectedBrand === "All Brands" || product.brand === selectedBrand;

    const matchesStatus =
      selectedStatus === "All Status" || product.status === selectedStatus;

    const matchesWarehouse =
      selectedWarehouse === "All Warehouses" ||
      product.warehouse === selectedWarehouse;

    return (
      matchesSearch &&
      matchesCategory &&
      matchesBrand &&
      matchesStatus &&
      matchesWarehouse
    );
  });

  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage) || 1;
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const renderStatusBadge = (status: StockProduct["status"]) => {
    switch (status) {
      case "In Stock":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#ebfbf3] text-[#16a34a] border border-[#bbf7d0]">
            In Stock
          </span>
        );
      case "Low Stock":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#fff7ed] text-[#ea580c] border border-[#ffedd5]">
            Low Stock
          </span>
        );
      case "Out of Stock":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#fef2f2] text-[#dc2626] border border-[#fecaca]">
            Out of Stock
          </span>
        );
    }
  };

  const handleExport = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      ["Product,SKU,Barcode,Category,Purchase Price,Selling Price,Current Stock,Stock Value,Status"]
        .concat(
          filteredProducts.map(
            (p) =>
              `"${p.name}","${p.sku}","${p.barcode}","${p.category}",${p.purchasePrice},${p.sellingPrice},"${p.currentStock} ${p.unit}",${(
                p.currentStock * p.purchasePrice
              ).toFixed(2)},"${p.status}"`
          )
        )
        .join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `stock_overview_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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
            <span className="text-slate-600 font-semibold">Stock Overview</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Stock Overview
          </h1>
        </div>
        <div className="text-xs text-slate-500 font-medium bg-white px-3 py-1.5 rounded-lg border border-slate-200/80 shadow-2xs self-start sm:self-auto">
          Saturday, Nov 7, 2026 • 12:03 PM
        </div>
      </div>

      {/* 2. Top Summary KPI Cards (Row of 6) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
        {/* Total Products */}
        <div className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-2xs">
          <p className="text-[11px] font-medium text-slate-500 mb-1">Total Products</p>
          <p className="text-xl font-bold text-slate-900">245</p>
        </div>

        {/* Total Stock Quantity */}
        <div className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-2xs">
          <p className="text-[11px] font-medium text-slate-500 mb-1">Total Stock Quantity</p>
          <p className="text-xl font-bold text-slate-900">14,820 pcs</p>
        </div>

        {/* Total Stock Value */}
        <div className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-2xs">
          <p className="text-[11px] font-medium text-slate-500 mb-1">Total Stock Value</p>
          <p className="text-xl font-bold text-slate-900">৳1,480,500.00</p>
        </div>

        {/* Low Stock Items */}
        <div className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-2xs">
          <p className="text-[11px] font-medium text-slate-500 mb-1.5">Low Stock Items</p>
          <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#fff7ed] text-[#ea580c] border border-[#ffedd5]">
            18 items
          </span>
        </div>

        {/* Out of Stock */}
        <div className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-2xs">
          <p className="text-[11px] font-medium text-slate-500 mb-1.5">Out of Stock</p>
          <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#fef2f2] text-[#dc2626] border border-[#fecaca]">
            4 items
          </span>
        </div>

        {/* Expiring Soon */}
        <div className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-2xs">
          <p className="text-[11px] font-medium text-slate-500 mb-1.5">Expiring Soon</p>
          <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#fefce8] text-[#ca8a04] border border-[#fef08a]">
            12 items
          </span>
        </div>
      </div>

      {/* 3. Filter & Search Bar Card */}
      <div className="bg-white rounded-xl p-3.5 border border-slate-200/80 shadow-2xs flex flex-wrap items-center gap-3">
        {/* Search */}
        <div className="flex-1 min-w-[240px]">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search by product name, SKU, barcode..."
              className="w-full h-9.5 pl-3.5 pr-9 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white transition-all"
            />
            <Search className="w-4 h-4 text-slate-400 absolute right-3 top-2.5 pointer-events-none" />
          </div>
        </div>

        {/* Category Dropdown */}
        <div className="min-w-[130px]">
          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full h-9.5 px-3 text-xs bg-white border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:border-emerald-500 transition-colors cursor-pointer"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* Brand Dropdown */}
        <div className="min-w-[120px]">
          <select
            value={selectedBrand}
            onChange={(e) => {
              setSelectedBrand(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full h-9.5 px-3 text-xs bg-white border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:border-emerald-500 transition-colors cursor-pointer"
          >
            {brands.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </div>

        {/* Stock Status Dropdown */}
        <div className="min-w-[120px]">
          <select
            value={selectedStatus}
            onChange={(e) => {
              setSelectedStatus(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full h-9.5 px-3 text-xs bg-white border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:border-emerald-500 transition-colors cursor-pointer"
          >
            {statuses.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        {/* Warehouse Dropdown */}
        <div className="min-w-[130px]">
          <select
            value={selectedWarehouse}
            onChange={(e) => {
              setSelectedWarehouse(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full h-9.5 px-3 text-xs bg-white border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:border-emerald-500 transition-colors cursor-pointer"
          >
            {warehouses.map((w) => (
              <option key={w} value={w}>
                {w}
              </option>
            ))}
          </select>
        </div>

        {/* Export Button */}
        <button
          onClick={handleExport}
          className="h-9.5 px-3.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs ml-auto"
        >
          <Download size={14} className="text-slate-500" />
          <span>Export</span>
        </button>
      </div>

      {/* 4. Products Stock Table Card */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/75 text-[11px] font-bold text-slate-500 tracking-wider">
                <th className="py-3 px-4">Product</th>
                <th className="py-3 px-3">SKU</th>
                <th className="py-3 px-3">Barcode</th>
                <th className="py-3 px-3">Category</th>
                <th className="py-3 px-3 text-right">Purchase Price</th>
                <th className="py-3 px-3 text-right">Selling Price</th>
                <th className="py-3 px-3 text-right">Current Stock</th>
                <th className="py-3 px-3 text-right">Stock Value</th>
                <th className="py-3 px-3 text-right">Minimum Stock</th>
                <th className="py-3 px-3 text-center">Status</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {paginatedProducts.length === 0 ? (
                <tr>
                  <td colSpan={11} className="py-8 text-center text-slate-400">
                    No products found matching the criteria.
                  </td>
                </tr>
              ) : (
                paginatedProducts.map((p) => {
                  const stockValue = p.currentStock * p.purchasePrice;
                  return (
                    <tr
                      key={p.id}
                      className="hover:bg-slate-50/70 transition-colors group"
                    >
                      {/* Product Thumbnail & Name */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-lg shrink-0 shadow-2xs">
                            {p.image}
                          </div>
                          <div>
                            <Link
                              to={`/inventory/stock-overview/${p.id}`}
                              className="font-bold text-slate-800 hover:text-emerald-600 transition-colors block line-clamp-1"
                            >
                              {p.name}
                            </Link>
                          </div>
                        </div>
                      </td>

                      {/* SKU */}
                      <td className="py-3 px-3 font-mono text-[11px] text-slate-600">
                        {p.sku}
                      </td>

                      {/* Barcode */}
                      <td className="py-3 px-3 font-mono text-[11px] text-slate-500">
                        {p.barcode}
                      </td>

                      {/* Category */}
                      <td className="py-3 px-3 text-slate-600 font-medium">
                        {p.category}
                      </td>

                      {/* Purchase Price */}
                      <td className="py-3 px-3 text-right font-semibold text-slate-700">
                        ৳{p.purchasePrice.toFixed(2)}
                      </td>

                      {/* Selling Price */}
                      <td className="py-3 px-3 text-right font-semibold text-slate-900">
                        ৳{p.sellingPrice.toFixed(2)}
                      </td>

                      {/* Current Stock */}
                      <td className="py-3 px-3 text-right font-bold text-slate-800">
                        {p.currentStock} {p.unit}
                      </td>

                      {/* Stock Value */}
                      <td className="py-3 px-3 text-right font-semibold text-slate-700">
                        ৳{stockValue.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                      </td>

                      {/* Minimum Stock */}
                      <td className="py-3 px-3 text-right text-slate-500">
                        {p.minStock} {p.unit}
                      </td>

                      {/* Status */}
                      <td className="py-3 px-3 text-center">
                        {renderStatusBadge(p.status)}
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          {/* Adjust Button */}
                          <button
                            type="button"
                            onClick={() =>
                              navigate(
                                `/inventory/stock-adjustment?productId=${p.id}`
                              )
                            }
                            className="p-1.5 rounded-md hover:bg-emerald-50 text-slate-500 hover:text-emerald-600 transition-colors cursor-pointer"
                            title="Adjust Stock"
                          >
                            <SlidersHorizontal size={14} />
                          </button>

                          {/* History / Product Overview Button */}
                          <button
                            type="button"
                            onClick={() =>
                              navigate(`/inventory/stock-overview/${p.id}`)
                            }
                            className="p-1.5 rounded-md hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
                            title="Stock History & Overview"
                          >
                            <History size={14} />
                          </button>

                          {/* Edit Button */}
                          <button
                            type="button"
                            onClick={() =>
                              navigate(`/products/product-details/${p.id}`)
                            }
                            className="p-1.5 rounded-md hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
                            title="Edit Product"
                          >
                            <Edit2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Table Pagination matching screenshot */}
        <div className="px-4 py-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <p>
            Showing{" "}
            <span className="font-semibold text-slate-800">
              {filteredProducts.length === 0
                ? "0"
                : `${(currentPage - 1) * itemsPerPage + 1}-${Math.min(
                    currentPage * itemsPerPage,
                    filteredProducts.length
                  )}`}
            </span>{" "}
            of <span className="font-semibold text-slate-800">245</span> products
          </p>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="px-2.5 py-1 rounded border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage(1)}
              className={`w-7 h-7 rounded flex items-center justify-center font-bold text-xs cursor-pointer ${
                currentPage === 1
                  ? "bg-[#162220] text-white"
                  : "border border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              1
            </button>
            <button
              onClick={() => setCurrentPage(2)}
              className={`w-7 h-7 rounded flex items-center justify-center font-bold text-xs cursor-pointer ${
                currentPage === 2
                  ? "bg-[#162220] text-white"
                  : "border border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              2
            </button>
            <button
              onClick={() => setCurrentPage(3)}
              className={`w-7 h-7 rounded flex items-center justify-center font-bold text-xs cursor-pointer ${
                currentPage === 3
                  ? "bg-[#162220] text-white"
                  : "border border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              3
            </button>
            <span className="px-1 text-slate-400">...</span>
            <button
              onClick={() => setCurrentPage(25)}
              className={`w-7 h-7 rounded flex items-center justify-center font-bold text-xs cursor-pointer ${
                currentPage === 25
                  ? "bg-[#162220] text-white"
                  : "border border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              25
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage >= totalPages}
              className="px-2.5 py-1 rounded border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Footer Branding */}
      <div className="text-center text-[11px] text-slate-400 py-1">
        Grocery PO, v2.4.1
      </div>
    </div>
  );
};

export default StockOverviewPage;
