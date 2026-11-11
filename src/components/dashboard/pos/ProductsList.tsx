import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Search,
  Plus,
  Eye,
  Edit2,
  Trash2,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  ChevronDown,
} from "lucide-react";
import { type GroceryProduct, mockGroceryProducts } from "./mockProducts";
import { ProductDetailsModal } from "./ProductDetailsModal";

export const ProductsList: React.FC = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<GroceryProduct[]>(mockGroceryProducts);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all categories");
  const [selectedBrand, setSelectedBrand] = useState("all brands");
  const [selectedStockStatus, setSelectedStockStatus] = useState("all status");

  // State for Product Details Modal
  const [selectedProduct, setSelectedProduct] = useState<GroceryProduct | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Extract unique categories and brands for filter dropdowns
  const categories = ["all categories", ...Array.from(new Set(mockGroceryProducts.map((p) => p.category)))];
  const brands = ["all brands", ...Array.from(new Set(mockGroceryProducts.map((p) => p.brand)))];

  // Filtering
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.barcode.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === "all categories" || p.category === selectedCategory;

    const matchesBrand = selectedBrand === "all brands" || p.brand === selectedBrand;

    const matchesStock =
      selectedStockStatus === "all status" ||
      (selectedStockStatus === "in stock" && p.status === "In Stock") ||
      (selectedStockStatus === "low stock" && p.status === "Low Stock") ||
      (selectedStockStatus === "out of stock" && p.status === "Out of Stock");

    return matchesSearch && matchesCategory && matchesBrand && matchesStock;
  });

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      setProducts((prev) => prev.filter((p) => p.id !== id));
    }
  };

  const handleOpenModal = (product: GroceryProduct) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const renderStatusBadge = (status: GroceryProduct["status"]) => {
    switch (status) {
      case "In Stock":
        return (
          <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#ebfbf3] text-[#16a34a] border border-[#bbf7d0]">
            In Stock
          </span>
        );
      case "Low Stock":
        return (
          <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#fffbeb] text-[#d97706] border border-[#fef3c7]">
            Low Stock
          </span>
        );
      case "Out of Stock":
        return (
          <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#fef2f2] text-[#dc2626] border border-[#fecaca]">
            Out of Stock
          </span>
        );
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#f8fafc] p-4 sm:p-6 lg:p-8 space-y-5">
      {/* 1. Breadcrumb & Title Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium mb-1">
            <Link to="/" className="hover:text-slate-600 transition-colors">
              Dashboard
            </Link>
            <span>/</span>
            <span className="text-slate-600 font-semibold">Products</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Products
          </h1>
        </div>

        {/* Add Product Button */}
        <Link
          to="/products/add-product"
          className="inline-flex items-center gap-2 bg-[#16a34a] hover:bg-[#15803d] text-white px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm shadow-xs transition-colors self-start sm:self-auto cursor-pointer"
        >
          <Plus size={16} className="stroke-[2.5]" />
          <span>Add Product</span>
        </Link>
      </div>

      {/* 2. Main White Container Card */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-2xs overflow-hidden">
        {/* Filters Bar */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-wrap items-center gap-3 justify-between">
          {/* Search Input */}
          <div className="relative flex-1 min-w-[200px] max-w-xs">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search product..."
              className="w-full h-9 pl-3.5 pr-8 text-xs bg-slate-50 border border-slate-200 rounded-lg placeholder-slate-400 text-slate-700 focus:outline-none focus:border-emerald-500 focus:bg-white transition-all"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-3 pointer-events-none" />
          </div>

          {/* Filter Dropdowns */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Category Select */}
            <div className="flex flex-col">
              <span className="text-[10px] text-slate-400 font-medium ml-1 mb-0.5">Category</span>
              <div className="relative">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="h-8.5 pl-3 pr-7 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:border-emerald-500 cursor-pointer appearance-none capitalize font-medium"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-2.5 pointer-events-none" />
              </div>
            </div>

            {/* Brand Select */}
            <div className="flex flex-col">
              <span className="text-[10px] text-slate-400 font-medium ml-1 mb-0.5">Brand</span>
              <div className="relative">
                <select
                  value={selectedBrand}
                  onChange={(e) => setSelectedBrand(e.target.value)}
                  className="h-8.5 pl-3 pr-7 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:border-emerald-500 cursor-pointer appearance-none font-medium"
                >
                  {brands.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-2.5 pointer-events-none" />
              </div>
            </div>

            {/* Stock Status Select */}
            <div className="flex flex-col">
              <span className="text-[10px] text-slate-400 font-medium ml-1 mb-0.5">Stock Status</span>
              <div className="relative">
                <select
                  value={selectedStockStatus}
                  onChange={(e) => setSelectedStockStatus(e.target.value)}
                  className="h-8.5 pl-3 pr-7 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:border-emerald-500 cursor-pointer appearance-none capitalize font-medium"
                >
                  <option value="all status">all status</option>
                  <option value="in stock">In Stock</option>
                  <option value="low stock">Low Stock</option>
                  <option value="out of stock">Out of Stock</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-2.5 pointer-events-none" />
              </div>
            </div>

            {/* Filter Action Button */}
            <div className="flex items-end self-end">
              <button
                type="button"
                className="h-8.5 px-3 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg text-xs font-semibold text-slate-600 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-slate-500" />
                <span>Filter</span>
              </button>
            </div>
          </div>
        </div>

        {/* Data Table matching Screenshot */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50/75 text-slate-500 font-semibold border-b border-slate-100">
                <th className="py-3 px-4 font-semibold">Product</th>
                <th className="py-3 px-3 font-semibold">SKU</th>
                <th className="py-3 px-3 font-semibold">Barcode</th>
                <th className="py-3 px-3 font-semibold">Category</th>
                <th className="py-3 px-3 font-semibold text-right">Purchase Price</th>
                <th className="py-3 px-3 font-semibold text-right">Selling Price</th>
                <th className="py-3 px-3 font-semibold text-center">Current Stock</th>
                <th className="py-3 px-3 font-semibold">Unit</th>
                <th className="py-3 px-3 font-semibold text-center">Status</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProducts.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/60 transition-colors">
                  {/* Product Name & Icon */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-emerald-50/70 border border-emerald-100/60 flex items-center justify-center text-base shrink-0 shadow-2xs">
                        {p.image}
                      </div>
                      <span
                        onClick={() => handleOpenModal(p)}
                        className="font-semibold text-slate-800 hover:text-emerald-700 cursor-pointer line-clamp-1"
                      >
                        {p.name}
                      </span>
                    </div>
                  </td>

                  {/* SKU */}
                  <td className="py-3 px-3 text-slate-500 font-medium">{p.sku}</td>

                  {/* Barcode */}
                  <td className="py-3 px-3 text-slate-500 font-mono text-[11px]">{p.barcode}</td>

                  {/* Category */}
                  <td className="py-3 px-3 text-slate-600 font-medium">{p.category}</td>

                  {/* Purchase Price */}
                  <td className="py-3 px-3 text-right text-slate-700 font-medium">
                    ৳{p.purchasePrice.toFixed(2)}
                  </td>

                  {/* Selling Price */}
                  <td className="py-3 px-3 text-right text-slate-900 font-bold">
                    ৳{p.sellingPrice.toFixed(2)}
                  </td>

                  {/* Current Stock */}
                  <td className="py-3 px-3 text-center text-slate-800 font-bold">
                    {p.currentStock}
                  </td>

                  {/* Unit */}
                  <td className="py-3 px-3 text-slate-500 font-medium">{p.unit}</td>

                  {/* Status Badge */}
                  <td className="py-3 px-3 text-center">{renderStatusBadge(p.status)}</td>

                  {/* Actions */}
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-2 text-slate-400">
                      {/* View Details Modal button */}
                      <button
                        type="button"
                        onClick={() => handleOpenModal(p)}
                        className="p-1 hover:text-emerald-600 transition-colors cursor-pointer"
                        title="View Details"
                      >
                        <Eye size={15} />
                      </button>

                      {/* Edit Product button */}
                      <button
                        type="button"
                        onClick={() => navigate(`/products/add-product?editId=${p.id}`)}
                        className="p-1 hover:text-amber-600 transition-colors cursor-pointer"
                        title="Edit Product"
                      >
                        <Edit2 size={15} />
                      </button>

                      {/* Delete button */}
                      <button
                        type="button"
                        onClick={() => handleDelete(p.id)}
                        className="p-1 hover:text-rose-600 transition-colors cursor-pointer"
                        title="Delete Product"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination matching screenshot */}
        <div className="px-5 py-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500">
          <div>
            Showing 1-{Math.min(filteredProducts.length, 10)} of 245 products
          </div>
          <div className="flex items-center space-x-1 font-medium">
            <button
              type="button"
              className="px-3 py-1 border border-slate-200 rounded-lg text-slate-500 hover:bg-slate-50 disabled:opacity-50 cursor-pointer"
              disabled
            >
              Previous
            </button>
            <button
              type="button"
              className="w-7 h-7 flex items-center justify-center rounded-lg bg-emerald-600 text-white font-bold"
            >
              1
            </button>
            <button
              type="button"
              className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-700 cursor-pointer"
            >
              2
            </button>
            <button
              type="button"
              className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-700 cursor-pointer"
            >
              3
            </button>
            <span className="px-1 text-slate-400">...</span>
            <button
              type="button"
              className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-700 cursor-pointer"
            >
              25
            </button>
            <button
              type="button"
              className="px-3 py-1 border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50 cursor-pointer"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Product Details Modal Component */}
      <ProductDetailsModal
        isOpen={isModalOpen}
        product={selectedProduct}
        onClose={() => setIsModalOpen(false)}
        onEdit={(prod) => navigate(`/products/add-product?editId=${prod.id}`)}
      />
    </div>
  );
};

export default ProductsList;
