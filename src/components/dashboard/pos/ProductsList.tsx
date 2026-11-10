import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FileSpreadsheet,
  FileText,
  Search,
  ChevronDown,
  CameraOff,
  Eye,
  Copy,
  Edit,
  Image as ImageIcon,
  Printer,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Plus,
} from "lucide-react";
import { type Product, initialMockProducts } from "./mockProducts";

const ProductsList: React.FC = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>(initialMockProducts);
  const [pageSize, setPageSize] = useState<number>(10);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeDropdownId, setActiveDropdownId] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Filter products by search query
  const filteredProducts = products.filter((p) => {
    const q = searchQuery.toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      p.code.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q)
    );
  });

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(filteredProducts.map((p) => p.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectItem = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const toggleDropdown = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveDropdownId((prev) => (prev === id ? null : id));
  };

  const handleDeleteProduct = (id: string) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      setProducts((prev) => prev.filter((p) => p.id !== id));
      setActiveDropdownId(null);
    }
  };

  const handleDuplicateProduct = (product: Product) => {
    const duplicated: Product = {
      ...product,
      id: Date.now().toString(),
      code: Math.floor(10000000 + Math.random() * 90000000).toString(),
      name: `${product.name} (Copy)`,
    };
    setProducts((prev) => [duplicated, ...prev]);
    setActiveDropdownId(null);
  };

  return (
    <div
      className="min-h-screen bg-[#f1f2f7] p-3 sm:p-5 font-sans text-xs sm:text-sm text-[#555]"
      onClick={() => setActiveDropdownId(null)}
    >
      {/* Top Breadcrumb & Status Info Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 text-[11px] text-[#777] border-b border-[#e2e4e8] mb-4 gap-1">
        <div className="flex items-center space-x-1.5">
          <Link to="/" className="text-[#337ab7] hover:underline">
            Home
          </Link>
          <span>/</span>
          <span className="text-[#555] font-medium">Products</span>
        </div>
        <div className="text-[11px] text-gray-500">
          Your IP Address 27.147.176.150 (Last login at: 04-11-2026 07:09 IP:
          27.147.205.15)
        </div>
      </div>

      {/* Main Container Card */}
      <div className="bg-white border border-[#d3d7db] rounded-sm shadow-xs">
        {/* Card Header */}
        <div className="bg-[#f8f9fa] border-b border-[#e5e5e5] px-4 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* Barcode-like icon glyph */}
            <span className="flex gap-[2px] items-center text-[#428bca]">
              <span className="w-[2px] h-3.5 bg-[#428bca] inline-block" />
              <span className="w-[3px] h-3.5 bg-[#428bca] inline-block" />
              <span className="w-[1px] h-3.5 bg-[#428bca] inline-block" />
              <span className="w-[2px] h-3.5 bg-[#428bca] inline-block" />
            </span>
            <h2 className="text-[#428bca] font-semibold text-sm">
              Products (All Warehouses)
            </h2>
          </div>
          <div className="flex items-center gap-2 text-gray-500">
            <Link
              to="/pos/add-product"
              className="text-[#428bca] hover:text-[#286090] p-1 flex items-center gap-1 text-xs font-semibold mr-2"
              title="Add New Product"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Product</span>
            </Link>
            <button
              type="button"
              title="Export PDF"
              className="p-1 hover:text-red-600 transition-colors"
            >
              <FileText className="w-4 h-4 text-[#428bca]" />
            </button>
            <button
              type="button"
              title="Export Excel"
              className="p-1 hover:text-green-600 transition-colors"
            >
              <FileSpreadsheet className="w-4 h-4 text-[#428bca]" />
            </button>
          </div>
        </div>

        {/* Notice text */}
        <div className="px-5 pt-3 pb-2 text-[12px] text-[#666]">
          Please use the table below to navigate or filter the results. You can
          download the table as excel and pdf.
        </div>

        {/* Controls: Page size & Search */}
        <div className="px-5 py-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-[#555]">
            <span>Show</span>
            <div className="relative">
              <select
                value={pageSize}
                onChange={(e) => setPageSize(Number(e.target.value))}
                className="h-7 px-2 pr-6 text-xs bg-white border border-[#d2d6de] rounded-xs focus:border-[#3c8dbc] focus:outline-none appearance-none cursor-pointer"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
              <ChevronDown className="absolute right-1.5 top-2 w-3 h-3 text-gray-400 pointer-events-none" />
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <label className="text-gray-600">Search</label>
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder=""
                className="h-7 px-2 text-xs border border-[#d2d6de] rounded-xs focus:border-[#3c8dbc] focus:outline-none w-48 sm:w-60"
              />
              <Search className="absolute right-2 top-2 w-3 h-3 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Table View */}
        <div className="overflow-x-auto px-5 py-2">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#428bca] text-white select-none">
                <th className="py-2.5 px-3 w-8 border border-[#357ebd]">
                  <input
                    type="checkbox"
                    checked={
                      selectedIds.length === filteredProducts.length &&
                      filteredProducts.length > 0
                    }
                    onChange={handleSelectAll}
                    className="rounded border-gray-300 cursor-pointer"
                  />
                </th>
                <th className="py-2.5 px-3 border border-[#357ebd] font-semibold">
                  Image
                </th>
                <th className="py-2.5 px-3 border border-[#357ebd] font-semibold">
                  Code
                </th>
                <th className="py-2.5 px-3 border border-[#357ebd] font-semibold">
                  <div className="flex items-center justify-between">
                    <span>Product Name</span>
                    <span className="text-[10px]">▲</span>
                  </div>
                </th>
                <th className="py-2.5 px-3 border border-[#357ebd] font-semibold">
                  <div className="flex items-center justify-between">
                    <span>Brand</span>
                    <span className="text-[10px]">⇅</span>
                  </div>
                </th>
                <th className="py-2.5 px-3 border border-[#357ebd] font-semibold">
                  <div className="flex items-center justify-between">
                    <span>Category</span>
                    <span className="text-[10px]">⇅</span>
                  </div>
                </th>
                <th className="py-2.5 px-3 border border-[#357ebd] font-semibold text-right">
                  <div className="flex items-center justify-end gap-1">
                    <span>Buy Price</span>
                    <span className="text-[10px]">⇅</span>
                  </div>
                </th>
                <th className="py-2.5 px-3 border border-[#357ebd] font-semibold text-right">
                  <div className="flex items-center justify-end gap-1">
                    <span>Sale Price</span>
                    <span className="text-[10px]">⇅</span>
                  </div>
                </th>
                <th className="py-2.5 px-3 border border-[#357ebd] font-semibold text-right">
                  <div className="flex items-center justify-end gap-1">
                    <span>Stock</span>
                    <span className="text-[10px]">⇅</span>
                  </div>
                </th>
                <th className="py-2.5 px-3 border border-[#357ebd] font-semibold">
                  <div className="flex items-center justify-between">
                    <span>Unit</span>
                    <span className="text-[10px]">⇅</span>
                  </div>
                </th>
                <th className="py-2.5 px-3 border border-[#357ebd] font-semibold text-right">
                  <div className="flex items-center justify-end gap-1">
                    <span>Alert Quantity</span>
                    <span className="text-[10px]">⇅</span>
                  </div>
                </th>
                <th className="py-2.5 px-3 border border-[#357ebd] font-semibold text-center w-24">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.slice(0, pageSize).map((prod) => (
                <tr
                  key={prod.id}
                  className="border-b border-[#e7e7e7] hover:bg-[#f9f9f9] transition-colors"
                >
                  <td className="py-2 px-3 border-r border-[#e7e7e7] text-center">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(prod.id)}
                      onChange={() => handleSelectItem(prod.id)}
                      className="rounded border-gray-300 cursor-pointer"
                    />
                  </td>
                  <td className="py-2 px-3 border-r border-[#e7e7e7] text-center">
                    {prod.image ? (
                      <span className="text-xl inline-block">{prod.image}</span>
                    ) : (
                      <div className="w-7 h-7 mx-auto bg-gray-50 border border-gray-200 rounded flex items-center justify-center text-gray-400">
                        <CameraOff className="w-3.5 h-3.5" />
                      </div>
                    )}
                  </td>
                  <td className="py-2 px-3 border-r border-[#e7e7e7] text-[#555] font-mono">
                    {prod.code}
                  </td>
                  <td className="py-2 px-3 border-r border-[#e7e7e7]">
                    <Link
                      to={`/pos/product-details/${prod.id}`}
                      className="text-[#337ab7] hover:underline font-medium"
                    >
                      {prod.name}
                    </Link>
                  </td>
                  <td className="py-2 px-3 border-r border-[#e7e7e7] text-[#555]">
                    {prod.brand || ""}
                  </td>
                  <td className="py-2 px-3 border-r border-[#e7e7e7] text-[#555]">
                    {prod.category}
                  </td>
                  <td className="py-2 px-3 border-r border-[#e7e7e7] text-right font-mono">
                    ৳{prod.buyPrice.toFixed(2)}
                  </td>
                  <td className="py-2 px-3 border-r border-[#e7e7e7] text-right font-mono">
                    ৳{prod.salePrice.toFixed(2)}
                  </td>
                  <td
                    className={`py-2 px-3 border-r border-[#e7e7e7] text-right font-mono font-medium ${
                      prod.stock < 0
                        ? "text-red-500"
                        : prod.stock === 0
                          ? "text-gray-500"
                          : "text-green-600"
                    }`}
                  >
                    {prod.stock.toFixed(2)}
                  </td>
                  <td className="py-2 px-3 border-r border-[#e7e7e7] text-[#555] uppercase">
                    {prod.unit}
                  </td>
                  <td className="py-2 px-3 border-r border-[#e7e7e7] text-right font-mono">
                    {prod.alertQuantity.toFixed(2)}
                  </td>
                  <td className="py-2 px-3 text-center relative">
                    <button
                      type="button"
                      onClick={(e) => toggleDropdown(prod.id, e)}
                      className="bg-[#428bca] hover:bg-[#3276b1] text-white px-2.5 py-1 rounded-xs text-[11px] font-medium flex items-center justify-between gap-1 mx-auto cursor-pointer shadow-xs"
                    >
                      <span>Actions</span>
                      <ChevronDown className="w-3 h-3" />
                    </button>

                    {/* Action Dropdown Menu */}
                    {activeDropdownId === prod.id && (
                      <div
                        className="absolute right-3 top-9 z-50 w-44 bg-white border border-[#ccc] rounded-xs shadow-lg py-1 text-left text-xs"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          type="button"
                          onClick={() => {
                            setActiveDropdownId(null);
                            navigate(`/pos/product-details/${prod.id}`);
                          }}
                          className="w-full px-3 py-1.5 hover:bg-[#f5f5f5] flex items-center gap-2 text-[#444]"
                        >
                          <Eye className="w-3.5 h-3.5 text-gray-500" />
                          <span>Product Details</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDuplicateProduct(prod)}
                          className="w-full px-3 py-1.5 hover:bg-[#f5f5f5] flex items-center gap-2 text-[#444]"
                        >
                          <Copy className="w-3.5 h-3.5 text-gray-500" />
                          <span>Duplicate Product</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setActiveDropdownId(null);
                            navigate("/pos/add-product");
                          }}
                          className="w-full px-3 py-1.5 hover:bg-[#f5f5f5] flex items-center gap-2 text-[#444]"
                        >
                          <Edit className="w-3.5 h-3.5 text-gray-500" />
                          <span>Edit Product</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            alert(`View image of ${prod.name}`);
                            setActiveDropdownId(null);
                          }}
                          className="w-full px-3 py-1.5 hover:bg-[#f5f5f5] flex items-center gap-2 text-[#444]"
                        >
                          <ImageIcon className="w-3.5 h-3.5 text-gray-500" />
                          <span>View Image</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            alert(`Print Barcode/Label for ${prod.name}`);
                            setActiveDropdownId(null);
                          }}
                          className="w-full px-3 py-1.5 hover:bg-[#f5f5f5] flex items-center gap-2 text-[#444]"
                        >
                          <Printer className="w-3.5 h-3.5 text-gray-500" />
                          <span>Print Barcode/Label</span>
                        </button>
                        <div className="border-t border-[#eee] my-1" />
                        <button
                          type="button"
                          onClick={() => handleDeleteProduct(prod.id)}
                          className="w-full px-3 py-1.5 hover:bg-red-50 text-red-600 flex items-center gap-2"
                        >
                          <Trash2 className="w-3.5 h-3.5 text-red-500" />
                          <span>Delete Product</span>
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
            {/* Table Footer with Placeholders Matching Screenshot */}
            <tfoot>
              <tr className="bg-[#f9f9f9] text-[#888] font-semibold border-t border-[#d3d7db]">
                <td className="py-2 px-3 border-r border-[#e7e7e7]"></td>
                <td className="py-2 px-3 border-r border-[#e7e7e7] text-center">
                  Image
                </td>
                <td className="py-2 px-3 border-r border-[#e7e7e7]">[Code]</td>
                <td className="py-2 px-3 border-r border-[#e7e7e7]">[Name]</td>
                <td className="py-2 px-3 border-r border-[#e7e7e7]">[Brand]</td>
                <td className="py-2 px-3 border-r border-[#e7e7e7]">
                  [Category]
                </td>
                <td className="py-2 px-3 border-r border-[#e7e7e7] text-right">
                  [Buy Price]
                </td>
                <td className="py-2 px-3 border-r border-[#e7e7e7] text-right">
                  [Sale Price]
                </td>
                <td className="py-2 px-3 border-r border-[#e7e7e7] text-right">
                  [Stock]
                </td>
                <td className="py-2 px-3 border-r border-[#e7e7e7]">[Unit]</td>
                <td className="py-2 px-3 border-r border-[#e7e7e7] text-right">
                  [Alert Quantity]
                </td>
                <td className="py-2 px-3 text-center">Actions</td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Pagination & Counter matching screenshot */}
        <div className="px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-[#666]">
          <div>
            Showing 1 to {Math.min(filteredProducts.length, pageSize)} of{" "}
            {filteredProducts.length} entries
          </div>
          <div className="flex items-center space-x-1">
            <button
              type="button"
              className="px-2.5 py-1 text-xs border border-[#ddd] bg-white rounded-xs text-[#777] hover:bg-gray-50 flex items-center gap-0.5 cursor-pointer disabled:opacity-50"
              disabled
            >
              <ChevronLeft className="w-3 h-3" />
              <span>Previous</span>
            </button>
            <button
              type="button"
              className="px-2.5 py-1 text-xs border border-[#428bca] bg-[#428bca] text-white rounded-xs font-semibold"
            >
              1
            </button>
            <button
              type="button"
              className="px-2.5 py-1 text-xs border border-[#ddd] bg-white rounded-xs text-[#337ab7] hover:bg-gray-50 cursor-pointer"
            >
              2
            </button>
            <button
              type="button"
              className="px-2.5 py-1 text-xs border border-[#ddd] bg-white rounded-xs text-[#337ab7] hover:bg-gray-50 cursor-pointer"
            >
              3
            </button>
            <button
              type="button"
              className="px-2.5 py-1 text-xs border border-[#ddd] bg-white rounded-xs text-[#337ab7] hover:bg-gray-50 cursor-pointer"
            >
              4
            </button>
            <button
              type="button"
              className="px-2.5 py-1 text-xs border border-[#ddd] bg-white rounded-xs text-[#337ab7] hover:bg-gray-50 cursor-pointer"
            >
              5
            </button>
            <button
              type="button"
              className="px-2.5 py-1 text-xs border border-[#ddd] bg-white rounded-xs text-[#337ab7] hover:bg-gray-50 flex items-center gap-0.5 cursor-pointer"
            >
              <span>Next</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsList;
