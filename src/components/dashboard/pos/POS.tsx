import React, { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  Upload,
  ChevronDown,
  Check,
  Barcode,
} from "lucide-react";
import { mockGroceryProducts, type GroceryProduct } from "./mockProducts";

export const POS: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get("editId");

  const [formData, setFormData] = useState({
    productName: "Chashi Chinigura Rice 1kg",
    sku: "SKU-10243",
    barcode: "894110023001",
    category: "Rice & Grains",
    brand: "Chashi",
    unit: "Kg",
    description: "",
    isActive: true,
    // Pricing
    purchasePrice: "132.00",
    sellingPrice: "145.00",
    wholesalePrice: "138.00",
    minSellingPrice: "140.00",
    // Inventory
    openingStock: "0",
    minStockAlert: "10",
    maxStock: "500",
    warehouseShelf: "Warehouse A , Section 3",
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // If editing an existing product, populate the fields
  useEffect(() => {
    if (editId) {
      const existing = mockGroceryProducts.find((p) => p.id === editId);
      if (existing) {
        setFormData({
          productName: existing.name,
          sku: existing.sku,
          barcode: existing.barcode,
          category: existing.category,
          brand: existing.brand,
          unit: existing.unit,
          description: existing.description || "",
          isActive: existing.isActive ?? true,
          purchasePrice: existing.purchasePrice.toFixed(2),
          sellingPrice: existing.sellingPrice.toFixed(2),
          wholesalePrice: (existing.wholesalePrice || existing.purchasePrice * 1.05).toFixed(2),
          minSellingPrice: (existing.minSellingPrice || existing.sellingPrice * 0.95).toFixed(2),
          openingStock: (existing.openingStock ?? 0).toString(),
          minStockAlert: (existing.minStockAlert ?? 10).toString(),
          maxStock: (existing.maxStock ?? 500).toString(),
          warehouseShelf: existing.warehouseShelf || "Warehouse A , Section 3",
        });
      }
    }
  }, [editId]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Product saved successfully!");
    navigate("/products");
  };

  return (
    <div className="w-full min-h-screen bg-[#f8fafc] p-4 sm:p-6 lg:p-8 space-y-6">
      {/* 1. Header with Breadcrumb and Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium mb-1">
            <Link to="/products" className="text-emerald-700 hover:underline">
              Products
            </Link>
            <span>&gt;</span>
            <span className="text-slate-600 font-semibold">Add Product</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            {editId ? "Edit Product" : "Add New Product"}
          </h1>
        </div>

        {/* Top Action Buttons */}
        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => navigate("/products")}
            className="px-4 py-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-semibold rounded-xl transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="add-product-form"
            className="px-4.5 py-2 bg-[#16a34a] hover:bg-[#15803d] text-white text-xs sm:text-sm font-semibold rounded-xl flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
          >
            <Check size={16} className="stroke-[2.5]" />
            <span>Save Product</span>
          </button>
        </div>
      </div>

      {/* 2. Main Form Grid Layout */}
      <form id="add-product-form" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT COLUMN: Product Information (takes 7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-2xl p-5 sm:p-6 border border-slate-100 shadow-2xs space-y-4">
            <h3 className="text-sm sm:text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
              Product Information
            </h3>

            {/* Product Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Product Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="productName"
                value={formData.productName}
                onChange={handleInputChange}
                required
                className="w-full h-9.5 px-3.5 text-xs sm:text-sm bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>

            {/* SKU and Barcode Side by Side */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* SKU */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  SKU <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="sku"
                  value={formData.sku}
                  onChange={handleInputChange}
                  required
                  className="w-full h-9.5 px-3.5 text-xs sm:text-sm bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>

              {/* Barcode */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Barcode
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="barcode"
                    value={formData.barcode}
                    onChange={handleInputChange}
                    className="w-full h-9.5 pl-3.5 pr-9 text-xs sm:text-sm bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                  <Barcode className="w-5 h-5 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Category and Brand Side by Side */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Category */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Category <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                    className="w-full h-9.5 px-3.5 pr-8 text-xs sm:text-sm bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-emerald-500 appearance-none cursor-pointer"
                  >
                    <option value="Rice & Grains">Rice & Grains</option>
                    <option value="Oil & Fats">Oil & Fats</option>
                    <option value="Baking & Sugar">Baking & Sugar</option>
                    <option value="Salt & Spices">Salt & Spices</option>
                    <option value="Dairy">Dairy</option>
                    <option value="Bakery">Bakery</option>
                    <option value="Eggs">Eggs</option>
                    <option value="Beverages">Beverages</option>
                    <option value="Biscuits & Snacks">Biscuits & Snacks</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-3 pointer-events-none" />
                </div>
              </div>

              {/* Brand */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Brand <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <select
                    name="brand"
                    value={formData.brand}
                    onChange={handleInputChange}
                    required
                    className="w-full h-9.5 px-3.5 pr-8 text-xs sm:text-sm bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-emerald-500 appearance-none cursor-pointer"
                  >
                    <option value="Chashi">Chashi</option>
                    <option value="Rupchanda">Rupchanda</option>
                    <option value="Fresh">Fresh</option>
                    <option value="ACI Pure">ACI Pure</option>
                    <option value="Aarong Dairy">Aarong Dairy</option>
                    <option value="All Time">All Time</option>
                    <option value="Farm Fresh">Farm Fresh</option>
                    <option value="Ispahani">Ispahani</option>
                    <option value="Pran">Pran</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-3 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Unit */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Unit <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <select
                  name="unit"
                  value={formData.unit}
                  onChange={handleInputChange}
                  required
                  className="w-full h-9.5 px-3.5 pr-8 text-xs sm:text-sm bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-emerald-500 appearance-none cursor-pointer"
                >
                  <option value="Kg">Kg</option>
                  <option value="Pcs">Pcs</option>
                  <option value="Pack">Pack</option>
                  <option value="Dozen">Dozen</option>
                  <option value="Litre">Litre</option>
                  <option value="Box">Box</option>
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-3 pointer-events-none" />
              </div>
            </div>

            {/* Product Description */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Product Description
              </label>
              <textarea
                name="description"
                rows={4}
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Add product descriptions, ingredients, or brand info..."
                className="w-full p-3 text-xs sm:text-sm bg-white border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500 transition-colors resize-y"
              />
            </div>

            {/* Product Status Toggle */}
            <div className="pt-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Product Status <span className="text-rose-500">*</span>
              </label>
              <div className="flex items-center gap-3">
                <span className="text-xs font-medium text-slate-500">Status</span>
                <button
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, isActive: !prev.isActive }))}
                  className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    formData.isActive ? "bg-emerald-600" : "bg-slate-300"
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                      formData.isActive ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
              <span className="text-[11px] text-slate-400 block mt-0.5">
                {formData.isActive ? "Active" : "Inactive"}
              </span>
            </div>
          </div>

          {/* RIGHT COLUMN: Product Image + Pricing + Inventory (takes 5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* 1. Product Image Upload Box */}
            <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-2xs">
              <h3 className="text-sm font-bold text-slate-900 mb-3">Product Image</h3>
              <label
                htmlFor="product-image-upload"
                className="border-2 border-dashed border-slate-200 hover:border-emerald-500/70 rounded-xl p-5 flex flex-col items-center justify-center text-center cursor-pointer bg-slate-50/50 hover:bg-emerald-50/20 transition-all group"
              >
                {imagePreview ? (
                  <div className="flex flex-col items-center gap-2">
                    <img
                      src={imagePreview}
                      alt="Product preview"
                      className="w-20 h-20 object-contain rounded-lg border border-slate-200"
                    />
                    <span className="text-xs font-semibold text-emerald-600">
                      Change image
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-slate-100 group-hover:bg-emerald-100 flex items-center justify-center text-slate-500 group-hover:text-emerald-700 transition-colors">
                      <Upload size={18} />
                    </div>
                    <span className="text-xs font-bold text-slate-800">
                      Upload Product Image
                    </span>
                    <span className="text-[11px] text-slate-400">
                      Drag and drop or click to upload<br />(PNG, JPG, max 2MB)
                    </span>
                  </div>
                )}
                <input
                  id="product-image-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            </div>

            {/* 2. Pricing Box */}
            <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-2xs space-y-3.5">
              <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2.5">
                Pricing
              </h3>

              <div className="grid grid-cols-2 gap-3.5">
                {/* Purchase Price */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Purchase Price (৳) <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-xs text-slate-400 font-bold">
                      ৳
                    </span>
                    <input
                      type="number"
                      step="any"
                      name="purchasePrice"
                      value={formData.purchasePrice}
                      onChange={handleInputChange}
                      required
                      className="w-full h-9 pl-7 pr-3 text-xs sm:text-sm bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                {/* Selling Price */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Selling Price (৳) <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-xs text-slate-400 font-bold">
                      ৳
                    </span>
                    <input
                      type="number"
                      step="any"
                      name="sellingPrice"
                      value={formData.sellingPrice}
                      onChange={handleInputChange}
                      required
                      className="w-full h-9 pl-7 pr-3 text-xs sm:text-sm bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                {/* Wholesale Price */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Wholesale Price (৳) <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-xs text-slate-400 font-bold">
                      ৳
                    </span>
                    <input
                      type="number"
                      step="any"
                      name="wholesalePrice"
                      value={formData.wholesalePrice}
                      onChange={handleInputChange}
                      required
                      className="w-full h-9 pl-7 pr-3 text-xs sm:text-sm bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                {/* Min. Selling Price */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Min. Selling Price (৳) <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-xs text-slate-400 font-bold">
                      ৳
                    </span>
                    <input
                      type="number"
                      step="any"
                      name="minSellingPrice"
                      value={formData.minSellingPrice}
                      onChange={handleInputChange}
                      required
                      className="w-full h-9 pl-7 pr-3 text-xs sm:text-sm bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Inventory Box */}
            <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-2xs space-y-3.5">
              <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2.5">
                Inventory
              </h3>

              <div className="grid grid-cols-2 gap-3.5">
                {/* Opening Stock */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Opening Stock
                  </label>
                  <input
                    type="number"
                    name="openingStock"
                    value={formData.openingStock}
                    onChange={handleInputChange}
                    className="w-full h-9 px-3 text-xs sm:text-sm bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                {/* Min. Stock Alert */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Min. Stock Alert
                  </label>
                  <input
                    type="number"
                    name="minStockAlert"
                    value={formData.minStockAlert}
                    onChange={handleInputChange}
                    className="w-full h-9 px-3 text-xs sm:text-sm bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                {/* Max. Stock */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Max. Stock
                  </label>
                  <input
                    type="number"
                    name="maxStock"
                    value={formData.maxStock}
                    onChange={handleInputChange}
                    className="w-full h-9 px-3 text-xs sm:text-sm bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                {/* Warehouse/Shelf */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Warehouse/Shelf <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      name="warehouseShelf"
                      value={formData.warehouseShelf}
                      onChange={handleInputChange}
                      className="w-full h-9 pl-3 pr-7 text-xs bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-emerald-500 appearance-none cursor-pointer truncate"
                    >
                      <option value="Warehouse A , Section 3">Warehouse A , Section 3</option>
                      <option value="Warehouse B , Section 1">Warehouse B , Section 1</option>
                      <option value="Warehouse C , Section 2">Warehouse C , Section 2</option>
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-3 pointer-events-none" />
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Save Action Button */}
            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => navigate("/products")}
                className="px-4 py-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-semibold rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4.5 py-2 bg-[#16a34a] hover:bg-[#15803d] text-white text-xs sm:text-sm font-semibold rounded-xl flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
              >
                <Check size={16} className="stroke-[2.5]" />
                <span>Save Product</span>
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default POS;
