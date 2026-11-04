import React, { useState } from "react";
import {
  Shuffle,
  X,
  Upload,
  Plus,
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Link2,
  Code,
  AlignLeft,
  AlignCenter,
  AlignRight,
  ChevronDown,
} from "lucide-react";

const POS: React.FC = () => {
  // Form state
  const [formData, setFormData] = useState({
    productType: "Standard",
    productName: "",
    productBarcode: "",
    category: "",
    subCategory: "",
    brand: "",
    productUnit: "",
    productBuyPrice: "",
    productSalePrice: "",
    productImage: null as File | null,
    productAlertQuantity: "",
    barcodeSymbology: "Code128",
    weight: "",
    promotion: false,
    productTax: "",
    taxMethod: "Exclusive",
    productDetails: "",
    productDetailsForInvoice: "",
    hasMultipleVariants: false,
    supplier: "",
    supplierPartNo: "",
    supplierPrice: "",
  });

  const [imageFileName, setImageFileName] = useState<string>("");

  // Subcategories mapping based on Category
  const subCategoryOptions: Record<string, string[]> = {
    Beverages: ["Soft Drinks", "Juices", "Coffee & Tea", "Mineral Water"],
    Groceries: ["Rice & Flour", "Oils & Ghee", "Spices & Seasoning", "Sugar & Salt"],
    Snacks: ["Chips & Crisps", "Biscuits & Cookies", "Nuts & Dry Fruits"],
    Dairy: ["Milk & Cream", "Cheese & Butter", "Yogurt & Curd"],
    Bakery: ["Breads", "Cakes & Pastries", "Buns & Rolls"],
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
        ...(name === "category" ? { subCategory: "" } : {}),
      }));
    }
  };

  const generateBarcode = () => {
    const randomBarcode = Math.floor(100000000000 + Math.random() * 900000000000).toString();
    setFormData((prev) => ({ ...prev, productBarcode: randomBarcode }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData((prev) => ({ ...prev, productImage: file }));
      setImageFileName(file.name);
    }
  };

  const clearAlertQuantity = () => {
    setFormData((prev) => ({ ...prev, productAlertQuantity: "" }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitting Product Form Data:", formData);
    alert("Product added successfully!");
  };

  return (
    <div className="min-h-screen bg-[#f1f2f7] p-3 sm:p-5 font-sans text-xs sm:text-sm text-[#555]">
      {/* Top Breadcrumb & Status Info Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 text-[11px] text-[#777] border-b border-[#e2e4e8] mb-4 gap-1">
        <div className="flex items-center space-x-1.5">
          <a href="#" className="text-[#337ab7] hover:underline">
            Home
          </a>
          <span>/</span>
          <a href="#" className="text-[#337ab7] hover:underline">
            Products
          </a>
          <span>/</span>
          <span className="text-[#555] font-medium">Add Product</span>
        </div>
        <div className="text-[11px] text-gray-500">
          Your IP Address 27.147.176.150 (Last login at: 02-11-2026 19:38 IP: 103.152.147.117)
        </div>
      </div>

      {/* Main Card Container */}
      <div className="bg-white border border-[#d3d7db] rounded-sm shadow-xs">
        {/* Card Header */}
        <div className="bg-[#f8f9fa] border-b border-[#e5e5e5] px-4 py-2.5 flex items-center gap-2">
          <span className="text-[#428bca] font-bold text-base leading-none">+</span>
          <h2 className="text-[#428bca] font-semibold text-sm">Add Product</h2>
        </div>

        {/* Form Instructions */}
        <div className="px-5 pt-4 pb-2 text-[12px] text-[#666]">
          Please fill in the information below. The field labels marked with{" "}
          <span className="text-red-500 font-bold">*</span> are required input fields.
        </div>

        {/* The Form */}
        <form onSubmit={handleSubmit} className="px-5 pb-8 pt-2">
          {/* Main 2-Column Responsive Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-8 gap-y-4">
            {/* LEFT COLUMN: Main Inputs (takes 7 cols on lg, or full width) */}
            <div className="lg:col-span-6 space-y-4">
              {/* Product Type */}
              <div>
                <label className="block text-[12px] font-semibold text-[#444] mb-1">
                  Product Type <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    name="productType"
                    value={formData.productType}
                    onChange={handleInputChange}
                    className="w-full h-8 px-2.5 text-xs text-[#555] bg-white border border-[#d2d6de] rounded-xs focus:border-[#3c8dbc] focus:outline-none appearance-none cursor-pointer"
                  >
                    <option value="Standard">Standard</option>
                    <option value="Combo">Combo</option>
                    <option value="Digital">Digital</option>
                    <option value="Service">Service</option>
                  </select>
                  <ChevronDown className="absolute right-2 top-2.5 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* Product Name */}
              <div>
                <label className="block text-[12px] font-semibold text-[#444] mb-1">
                  Product Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="productName"
                  value={formData.productName}
                  onChange={handleInputChange}
                  required
                  className="w-full h-8 px-2.5 text-xs text-[#555] bg-white border border-[#d2d6de] rounded-xs focus:border-[#3c8dbc] focus:outline-none"
                />
              </div>

              {/* Product Bar Code */}
              <div>
                <label className="block text-[12px] font-semibold text-[#444] mb-1">
                  Product Bar Code <span className="text-red-500">*</span>
                </label>
                <div className="flex">
                  <input
                    type="text"
                    name="productBarcode"
                    value={formData.productBarcode}
                    onChange={handleInputChange}
                    required
                    className="flex-1 h-8 px-2.5 text-xs text-[#555] bg-white border border-[#d2d6de] rounded-l-xs focus:border-[#3c8dbc] focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={generateBarcode}
                    title="Generate Random Barcode"
                    className="px-3 h-8 bg-[#f4f4f4] border border-l-0 border-[#d2d6de] rounded-r-xs hover:bg-[#e7e7e7] text-gray-600 flex items-center justify-center transition-colors"
                  >
                    <Shuffle className="w-3.5 h-3.5" />
                  </button>
                </div>
                <p className="text-[11px] text-[#888] mt-1">
                  You can scan your barcode and select the correct symbology below
                </p>
              </div>

              {/* Category */}
              <div>
                <label className="block text-[12px] font-semibold text-[#444] mb-1">
                  Category <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                    className="w-full h-8 px-2.5 text-xs text-[#555] bg-white border border-[#d2d6de] rounded-xs focus:border-[#3c8dbc] focus:outline-none appearance-none cursor-pointer"
                  >
                    <option value="">Select Category</option>
                    <option value="Beverages">Beverages</option>
                    <option value="Groceries">Groceries</option>
                    <option value="Snacks">Snacks</option>
                    <option value="Dairy">Dairy</option>
                    <option value="Bakery">Bakery</option>
                  </select>
                  <ChevronDown className="absolute right-2 top-2.5 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* Sub Category */}
              <div>
                <label className="block text-[12px] font-semibold text-[#444] mb-1">
                  Sub Category
                </label>
                <div className="relative">
                  <select
                    name="subCategory"
                    value={formData.subCategory}
                    onChange={handleInputChange}
                    disabled={!formData.category}
                    className="w-full h-8 px-2.5 text-xs text-[#555] bg-white border border-[#d2d6de] rounded-xs focus:border-[#3c8dbc] focus:outline-none appearance-none cursor-pointer disabled:bg-gray-100 disabled:text-gray-400"
                  >
                    <option value="">
                      {formData.category ? "Select Sub Category" : "Please select category to load"}
                    </option>
                    {formData.category &&
                      subCategoryOptions[formData.category]?.map((sub) => (
                        <option key={sub} value={sub}>
                          {sub}
                        </option>
                      ))}
                  </select>
                  <ChevronDown className="absolute right-2 top-2.5 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* Brand */}
              <div>
                <label className="block text-[12px] font-semibold text-[#444] mb-1">Brand</label>
                <div className="relative">
                  <select
                    name="brand"
                    value={formData.brand}
                    onChange={handleInputChange}
                    className="w-full h-8 px-2.5 text-xs text-[#555] bg-white border border-[#d2d6de] rounded-xs focus:border-[#3c8dbc] focus:outline-none appearance-none cursor-pointer"
                  >
                    <option value="">Select Brand</option>
                    <option value="Nestle">Nestle</option>
                    <option value="Unilever">Unilever</option>
                    <option value="Coca-Cola">Coca-Cola</option>
                    <option value="PepsiCo">PepsiCo</option>
                    <option value="Pran">Pran</option>
                    <option value="Square">Square</option>
                  </select>
                  <ChevronDown className="absolute right-2 top-2.5 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* Product Unit */}
              <div>
                <label className="block text-[12px] font-semibold text-[#444] mb-1">
                  Product Unit <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    name="productUnit"
                    value={formData.productUnit}
                    onChange={handleInputChange}
                    required
                    className="w-full h-8 px-2.5 text-xs text-[#555] bg-white border border-[#d2d6de] rounded-xs focus:border-[#3c8dbc] focus:outline-none appearance-none cursor-pointer"
                  >
                    <option value="">Select Unit</option>
                    <option value="Piece (pc)">Piece (pc)</option>
                    <option value="Kilogram (kg)">Kilogram (kg)</option>
                    <option value="Gram (g)">Gram (g)</option>
                    <option value="Litre (ltr)">Litre (ltr)</option>
                    <option value="Box (bx)">Box (bx)</option>
                    <option value="Packet (pkt)">Packet (pkt)</option>
                  </select>
                  <ChevronDown className="absolute right-2 top-2.5 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* Product Buy Price */}
              <div>
                <label className="block text-[12px] font-semibold text-[#444] mb-1">
                  Product Buy Price <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  step="any"
                  name="productBuyPrice"
                  value={formData.productBuyPrice}
                  onChange={handleInputChange}
                  required
                  placeholder="0.00"
                  className="w-full h-8 px-2.5 text-xs text-[#555] bg-white border border-[#d2d6de] rounded-xs focus:border-[#3c8dbc] focus:outline-none"
                />
              </div>

              {/* Product Sale Price */}
              <div>
                <label className="block text-[12px] font-semibold text-[#444] mb-1">
                  Product Sale Price <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  step="any"
                  name="productSalePrice"
                  value={formData.productSalePrice}
                  onChange={handleInputChange}
                  required
                  placeholder="0.00"
                  className="w-full h-8 px-2.5 text-xs text-[#555] bg-white border border-[#d2d6de] rounded-xs focus:border-[#3c8dbc] focus:outline-none"
                />
              </div>

              {/* Product Image */}
              <div>
                <label className="block text-[12px] font-semibold text-[#444] mb-1">
                  Product Image
                </label>
                <div className="relative flex">
                  <input
                    type="text"
                    readOnly
                    value={imageFileName}
                    placeholder=""
                    className="flex-1 h-8 px-2.5 text-xs text-[#555] bg-white border border-[#d2d6de] rounded-l-xs focus:outline-none cursor-pointer"
                    onClick={() => document.getElementById("file-upload-input")?.click()}
                  />
                  <label
                    htmlFor="file-upload-input"
                    className="h-8 px-3.5 bg-[#337ab7] hover:bg-[#286090] text-white text-xs font-medium flex items-center justify-center gap-1.5 rounded-r-xs cursor-pointer transition-colors shadow-xs"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Browse ...</span>
                  </label>
                  <input
                    id="file-upload-input"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </div>
              </div>

              {/* Product Alert Quantity */}
              <div>
                <label className="block text-[12px] font-semibold text-[#444] mb-1">
                  Product Alert Quantity
                </label>
                <div className="flex">
                  <input
                    type="number"
                    name="productAlertQuantity"
                    value={formData.productAlertQuantity}
                    onChange={handleInputChange}
                    placeholder=""
                    className="flex-1 h-8 px-2.5 text-xs text-[#555] bg-white border border-[#d2d6de] rounded-l-xs focus:border-[#3c8dbc] focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={clearAlertQuantity}
                    title="Clear alert quantity"
                    className="px-2.5 h-8 bg-[#337ab7] hover:bg-[#286090] text-white border border-l-0 border-[#337ab7] rounded-r-xs flex items-center justify-center transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Barcode Symbology */}
              <div>
                <label className="block text-[12px] font-semibold text-[#444] mb-1">
                  Barcode Symbology <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    name="barcodeSymbology"
                    value={formData.barcodeSymbology}
                    onChange={handleInputChange}
                    required
                    className="w-full h-8 px-2.5 text-xs text-[#555] bg-white border border-[#d2d6de] rounded-xs focus:border-[#3c8dbc] focus:outline-none appearance-none cursor-pointer"
                  >
                    <option value="Code128">Code128</option>
                    <option value="Code39">Code39</option>
                    <option value="EAN-13">EAN-13</option>
                    <option value="UPC-A">UPC-A</option>
                    <option value="EAN-8">EAN-8</option>
                  </select>
                  <ChevronDown className="absolute right-2 top-2.5 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* Weight (kg) */}
              <div>
                <label className="block text-[12px] font-semibold text-[#444] mb-1">Weight (kg)</label>
                <input
                  type="number"
                  step="any"
                  name="weight"
                  value={formData.weight}
                  onChange={handleInputChange}
                  placeholder=""
                  className="w-full h-8 px-2.5 text-xs text-[#555] bg-white border border-[#d2d6de] rounded-xs focus:border-[#3c8dbc] focus:outline-none"
                />
              </div>

              {/* Promotion Checkbox */}
              <div className="pt-1">
                <label className="inline-flex items-center gap-2 text-xs font-semibold text-[#444] cursor-pointer">
                  <input
                    type="checkbox"
                    name="promotion"
                    checked={formData.promotion}
                    onChange={handleInputChange}
                    className="w-4 h-4 rounded border-[#ccc] text-[#337ab7] focus:ring-0 cursor-pointer"
                  />
                  <span>Promotion</span>
                </label>
              </div>

              {/* Product Tax */}
              <div>
                <label className="block text-[12px] font-semibold text-[#444] mb-1">Product Tax</label>
                <div className="relative">
                  <select
                    name="productTax"
                    value={formData.productTax}
                    onChange={handleInputChange}
                    className="w-full h-8 px-2.5 text-xs text-[#555] bg-white border border-[#d2d6de] rounded-xs focus:border-[#3c8dbc] focus:outline-none appearance-none cursor-pointer"
                  >
                    <option value="">Select Product Tax</option>
                    <option value="No Tax (0%)">No Tax (0%)</option>
                    <option value="VAT (5%)">VAT (5%)</option>
                    <option value="VAT (7.5%)">VAT (7.5%)</option>
                    <option value="VAT (15%)">VAT (15%)</option>
                  </select>
                  <ChevronDown className="absolute right-2 top-2.5 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* Tax Method */}
              <div>
                <label className="block text-[12px] font-semibold text-[#444] mb-1">Tax Method</label>
                <div className="relative">
                  <select
                    name="taxMethod"
                    value={formData.taxMethod}
                    onChange={handleInputChange}
                    className="w-full h-8 px-2.5 text-xs text-[#555] bg-white border border-[#d2d6de] rounded-xs focus:border-[#3c8dbc] focus:outline-none appearance-none cursor-pointer"
                  >
                    <option value="Exclusive">Exclusive</option>
                    <option value="Inclusive">Inclusive</option>
                  </select>
                  <ChevronDown className="absolute right-2 top-2.5 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Variants & Supplier Section (takes 6 cols on lg) */}
            <div className="lg:col-span-6 space-y-4">
              {/* Variant Checkbox */}
              <div className="flex items-center gap-2 pt-0.5">
                <input
                  type="checkbox"
                  id="hasMultipleVariants"
                  name="hasMultipleVariants"
                  checked={formData.hasMultipleVariants}
                  onChange={handleInputChange}
                  className="w-4 h-4 rounded border-[#ccc] text-[#337ab7] focus:ring-0 cursor-pointer"
                />
                <label
                  htmlFor="hasMultipleVariants"
                  className="text-xs font-semibold text-[#444] cursor-pointer"
                >
                  This product has multiple variants{" "}
                  <span className="font-normal text-gray-500 italic">
                    e.g. Multiple Sizes and/or Colors
                  </span>
                </label>
              </div>

              {/* Supplier Box */}
              <div className="pt-2">
                <div className="flex items-center gap-2 mb-2">
                  <label className="text-xs font-bold text-[#444]">Supplier</label>
                  <button
                    type="button"
                    onClick={() => {
                      const name = prompt("Enter new supplier name:");
                      if (name) alert(`Supplier "${name}" added!`);
                    }}
                    title="Add Supplier"
                    className="w-4 h-4 bg-[#337ab7] hover:bg-[#286090] text-white flex items-center justify-center rounded-xs transition-colors shadow-xs"
                  >
                    <Plus className="w-3 h-3 stroke-[3]" />
                  </button>
                </div>

                {/* Supplier Dropdown */}
                <div className="relative mb-2.5">
                  <select
                    name="supplier"
                    value={formData.supplier}
                    onChange={handleInputChange}
                    className="w-full h-8 px-2.5 text-xs text-[#555] bg-white border border-[#d2d6de] rounded-xs focus:border-[#3c8dbc] focus:outline-none appearance-none cursor-pointer"
                  >
                    <option value="">Select Supplier</option>
                    <option value="Apex Global Imports">Apex Global Imports</option>
                    <option value="Direct Agro Farm">Direct Agro Farm</option>
                    <option value="National Distributors Ltd">National Distributors Ltd</option>
                    <option value="Metro Wholesale Supplies">Metro Wholesale Supplies</option>
                  </select>
                  <ChevronDown className="absolute right-2 top-2.5 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
                </div>

                {/* Supplier Part No & Price Grid */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <input
                      type="text"
                      name="supplierPartNo"
                      value={formData.supplierPartNo}
                      onChange={handleInputChange}
                      placeholder="Supplier Part No."
                      className="w-full h-8 px-2.5 text-xs text-[#555] bg-white border border-[#d2d6de] rounded-xs focus:border-[#3c8dbc] focus:outline-none"
                    />
                  </div>
                  <div>
                    <input
                      type="number"
                      step="any"
                      name="supplierPrice"
                      value={formData.supplierPrice}
                      onChange={handleInputChange}
                      placeholder="Supplier Price"
                      className="w-full h-8 px-2.5 text-xs text-[#555] bg-white border border-[#d2d6de] rounded-xs focus:border-[#3c8dbc] focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* LOWER SECTION: Two Rich Text / Details Editors side-by-side */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-6">
            {/* 17. Product Details */}
            <div>
              <label className="block text-[12px] font-semibold text-[#444] mb-1">
                Product Details
              </label>
              <div className="border border-[#d2d6de] rounded-xs overflow-hidden bg-white shadow-2xs">
                {/* Editor Toolbar */}
                <div className="flex items-center flex-wrap gap-1 bg-[#f4f4f4] border-b border-[#e5e5e5] px-2 py-1.5 text-gray-700">
                  <button
                    type="button"
                    title="Numbered List"
                    className="p-1 hover:bg-[#e0e0e0] rounded"
                  >
                    <ListOrdered className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    title="Bullet List"
                    className="p-1 hover:bg-[#e0e0e0] rounded"
                  >
                    <List className="w-3.5 h-3.5" />
                  </button>
                  <div className="w-[1px] h-4 bg-gray-300 mx-1" />
                  <button
                    type="button"
                    title="Align Left"
                    className="p-1 hover:bg-[#e0e0e0] rounded"
                  >
                    <AlignLeft className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    title="Align Center"
                    className="p-1 hover:bg-[#e0e0e0] rounded"
                  >
                    <AlignCenter className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    title="Align Right"
                    className="p-1 hover:bg-[#e0e0e0] rounded"
                  >
                    <AlignRight className="w-3.5 h-3.5" />
                  </button>
                  <div className="w-[1px] h-4 bg-gray-300 mx-1" />
                  <button
                    type="button"
                    title="Bold"
                    className="p-1 hover:bg-[#e0e0e0] rounded font-bold"
                  >
                    <Bold className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    title="Italic"
                    className="p-1 hover:bg-[#e0e0e0] rounded italic"
                  >
                    <Italic className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    title="Underline"
                    className="p-1 hover:bg-[#e0e0e0] rounded"
                  >
                    <Underline className="w-3.5 h-3.5" />
                  </button>
                  <div className="w-[1px] h-4 bg-gray-300 mx-1" />
                  <button
                    type="button"
                    title="Insert Link"
                    className="p-1 hover:bg-[#e0e0e0] rounded"
                  >
                    <Link2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    title="Code View"
                    className="p-1 hover:bg-[#e0e0e0] rounded"
                  >
                    <Code className="w-3.5 h-3.5" />
                  </button>
                </div>
                {/* Text Area Content */}
                <textarea
                  name="productDetails"
                  value={formData.productDetails}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full p-2.5 text-xs text-[#555] focus:outline-none resize-y"
                  placeholder=""
                />
              </div>
            </div>

            {/* 18. Product details for invoice */}
            <div>
              <label className="block text-[12px] font-semibold text-[#444] mb-1">
                Product details for invoice
              </label>
              <div className="border border-[#d2d6de] rounded-xs overflow-hidden bg-white shadow-2xs">
                {/* Editor Toolbar */}
                <div className="flex items-center flex-wrap gap-1 bg-[#f4f4f4] border-b border-[#e5e5e5] px-2 py-1.5 text-gray-700">
                  <button
                    type="button"
                    title="Numbered List"
                    className="p-1 hover:bg-[#e0e0e0] rounded"
                  >
                    <ListOrdered className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    title="Bullet List"
                    className="p-1 hover:bg-[#e0e0e0] rounded"
                  >
                    <List className="w-3.5 h-3.5" />
                  </button>
                  <div className="w-[1px] h-4 bg-gray-300 mx-1" />
                  <button
                    type="button"
                    title="Align Left"
                    className="p-1 hover:bg-[#e0e0e0] rounded"
                  >
                    <AlignLeft className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    title="Align Center"
                    className="p-1 hover:bg-[#e0e0e0] rounded"
                  >
                    <AlignCenter className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    title="Align Right"
                    className="p-1 hover:bg-[#e0e0e0] rounded"
                  >
                    <AlignRight className="w-3.5 h-3.5" />
                  </button>
                  <div className="w-[1px] h-4 bg-gray-300 mx-1" />
                  <button
                    type="button"
                    title="Bold"
                    className="p-1 hover:bg-[#e0e0e0] rounded font-bold"
                  >
                    <Bold className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    title="Italic"
                    className="p-1 hover:bg-[#e0e0e0] rounded italic"
                  >
                    <Italic className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    title="Underline"
                    className="p-1 hover:bg-[#e0e0e0] rounded"
                  >
                    <Underline className="w-3.5 h-3.5" />
                  </button>
                  <div className="w-[1px] h-4 bg-gray-300 mx-1" />
                  <button
                    type="button"
                    title="Insert Link"
                    className="p-1 hover:bg-[#e0e0e0] rounded"
                  >
                    <Link2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    title="Code View"
                    className="p-1 hover:bg-[#e0e0e0] rounded"
                  >
                    <Code className="w-3.5 h-3.5" />
                  </button>
                </div>
                {/* Text Area Content */}
                <textarea
                  name="productDetailsForInvoice"
                  value={formData.productDetailsForInvoice}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full p-2.5 text-xs text-[#555] focus:outline-none resize-y"
                  placeholder=""
                />
              </div>
            </div>
          </div>

          {/* Footer Submit Button */}
          <div className="mt-8 flex justify-center">
            <button
              type="submit"
              className="bg-[#428bca] hover:bg-[#3276b1] text-white text-sm font-semibold px-12 py-2 rounded-xs shadow transition-colors cursor-pointer"
            >
              Add Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default POS;
