import React, { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  Search,
  Plus,
  QrCode,
  Trash2,
  UploadCloud,
  Check,
  ArrowDown,
  ArrowUp,
} from "lucide-react";
import { initialStockProducts, type StockProduct } from "./mockStockData";

interface AdjustmentItem {
  product: StockProduct;
  adjustmentQty: number;
}

export const StockAdjustmentPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const preselectedProductId = searchParams.get("productId");

  // Form states
  const [adjustmentDate, setAdjustmentDate] = useState("2026-11-07");
  const [warehouse, setWarehouse] = useState("Warehouse A");
  const [adjustmentType, setAdjustmentType] = useState<"increase" | "decrease">(
    "decrease"
  );
  const [reason, setReason] = useState("Physical Count Correction");
  const [notes, setNotes] = useState(
    "Discrepancy found during monthly inventory count."
  );
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  // Table items state prefilled to match Image 1
  const [adjustmentItems, setAdjustmentItems] = useState<AdjustmentItem[]>([
    { product: initialStockProducts[1], adjustmentQty: 3 }, // Rupchanda Soybean Oil 5L
    { product: initialStockProducts[0], adjustmentQty: 5 }, // Chashi Chinigura Rice 1kg
    { product: initialStockProducts[9], adjustmentQty: 2 }, // ACI Pure Salt 1kg
    { product: initialStockProducts[3], adjustmentQty: 1 }, // Aarong Dairy Liquid Milk 1L
    { product: initialStockProducts[5], adjustmentQty: 2 }, // Poultry Eggs (Dozen)
  ]);

  // Product search in table
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddMenuOpen, setIsAddMenuOpen] = useState(false);

  // If a productId was passed in query, add it if not already present
  useEffect(() => {
    if (preselectedProductId) {
      const prod = initialStockProducts.find((p) => p.id === preselectedProductId);
      if (prod && !adjustmentItems.some((item) => item.product.id === prod.id)) {
        setAdjustmentItems((prev) => [{ product: prod, adjustmentQty: 1 }, ...prev]);
      }
    }
  }, [preselectedProductId]);

  const handleQtyChange = (productId: string, delta: number) => {
    setAdjustmentItems((prev) =>
      prev.map((item) => {
        if (item.product.id === productId) {
          const newQty = Math.max(1, item.adjustmentQty + delta);
          return { ...item, adjustmentQty: newQty };
        }
        return item;
      })
    );
  };

  const handleRemoveItem = (productId: string) => {
    setAdjustmentItems((prev) => prev.filter((i) => i.product.id !== productId));
  };

  const handleAddProduct = (prod: StockProduct) => {
    if (!adjustmentItems.some((i) => i.product.id === prod.id)) {
      setAdjustmentItems((prev) => [...prev, { product: prod, adjustmentQty: 1 }]);
    }
    setIsAddMenuOpen(false);
  };

  // Calculations for summary card
  const totalItemsCount = adjustmentItems.length;
  const totalAdjustmentQty = adjustmentItems.reduce(
    (sum, item) => sum + item.adjustmentQty,
    0
  );
  const currentTotalStock = adjustmentItems.reduce(
    (sum, item) => sum + item.product.currentStock,
    0
  );

  const finalStock =
    adjustmentType === "increase"
      ? currentTotalStock + totalAdjustmentQty
      : Math.max(0, currentTotalStock - totalAdjustmentQty);

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
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
            <span className="text-slate-600 font-semibold">Stock Adjustment</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Stock Adjustment
          </h1>
        </div>
        <div className="text-xs text-slate-500 font-medium bg-white px-3 py-1.5 rounded-lg border border-slate-200/80 shadow-2xs self-start sm:self-auto">
          Saturday, Nov 7, 2026 • 12:09 PM
        </div>
      </div>

      {savedSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-2">
          <Check size={16} className="text-emerald-600" />
          <span>Stock adjustment saved successfully! Inventory counts updated.</span>
        </div>
      )}

      {/* 2. Main Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column (approx 70% width: 8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          {/* Top Form Card */}
          <div className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200/80 shadow-2xs space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Adjustment Date */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1.5">
                  Adjustment Date
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={adjustmentDate}
                    onChange={(e) => setAdjustmentDate(e.target.value)}
                    className="w-full h-9.5 px-3 text-xs bg-white border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:border-emerald-500 cursor-pointer"
                  />
                </div>
              </div>

              {/* Warehouse */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1.5">
                  Warehouse
                </label>
                <select
                  value={warehouse}
                  onChange={(e) => setWarehouse(e.target.value)}
                  className="w-full h-9.5 px-3 text-xs bg-white border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:border-emerald-500 cursor-pointer"
                >
                  <option value="Warehouse A">Warehouse A</option>
                  <option value="Warehouse B">Warehouse B</option>
                  <option value="Main Storage">Main Storage</option>
                  <option value="Cold Storage">Cold Storage</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              {/* Adjustment Type Toggle */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1.5">
                  Adjustment Type
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setAdjustmentType("increase")}
                    className={`h-9.5 rounded-lg text-xs font-semibold flex items-center justify-center transition-colors cursor-pointer ${
                      adjustmentType === "increase"
                        ? "bg-[#16a34a] text-white shadow-xs font-bold"
                        : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    [ Increase Stock ]
                  </button>

                  <button
                    type="button"
                    onClick={() => setAdjustmentType("decrease")}
                    className={`h-9.5 rounded-lg text-xs font-semibold flex items-center justify-center transition-colors cursor-pointer ${
                      adjustmentType === "decrease"
                        ? "bg-[#16a34a] text-white shadow-xs font-bold"
                        : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    [ Decrease Stock ]
                  </button>
                </div>
              </div>

              {/* Reason */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1.5">
                  Reason
                </label>
                <select
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full h-9.5 px-3 text-xs bg-white border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:border-emerald-500 cursor-pointer"
                >
                  <option value="Damaged">Damaged</option>
                  <option value="Expired">Expired</option>
                  <option value="Lost">Lost</option>
                  <option value="Physical Count Correction">
                    Physical Count Correction
                  </option>
                  <option value="Wrong Entry">Wrong Entry</option>
                </select>
              </div>
            </div>
          </div>

          {/* Products Table Card */}
          <div className="bg-white rounded-xl border border-slate-200/80 shadow-2xs overflow-hidden">
            {/* Search & Add Action Bar */}
            <div className="p-3.5 border-b border-slate-100 flex items-center gap-2.5">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by product name, SKU, or barcode..."
                  className="w-full h-9.5 pl-3.5 pr-9 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white transition-all"
                />
                <Search className="w-4 h-4 text-slate-400 absolute right-3 top-2.5 pointer-events-none" />
              </div>

              {/* Add Product Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsAddMenuOpen(!isAddMenuOpen)}
                  className="h-9.5 px-3 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
                >
                  <span>Add Product</span>
                  <Plus size={14} className="text-slate-500" />
                </button>

                {isAddMenuOpen && (
                  <div className="absolute right-0 top-11 w-64 bg-white border border-slate-200 rounded-xl shadow-lg z-20 py-1.5 max-h-60 overflow-y-auto">
                    <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase">
                      Select Product to Add
                    </div>
                    {initialStockProducts.map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => handleAddProduct(p)}
                        className="w-full text-left px-3 py-2 text-xs hover:bg-slate-50 flex items-center justify-between text-slate-700"
                      >
                        <span className="line-clamp-1">{p.name}</span>
                        <span className="text-[10px] font-bold text-slate-400 shrink-0 ml-2">
                          {p.currentStock} {p.unit}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Barcode scanner icon */}
              <button
                type="button"
                className="h-9.5 w-9.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-lg flex items-center justify-center shadow-2xs transition-colors cursor-pointer"
                title="Scan Barcode"
              >
                <QrCode size={16} />
              </button>
            </div>

            {/* Products Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/75 text-[11px] font-bold text-slate-500">
                    <th className="py-2.5 px-3">Product</th>
                    <th className="py-2.5 px-3">SKU</th>
                    <th className="py-2.5 px-3">Barcode</th>
                    <th className="py-2.5 px-3">Category</th>
                    <th className="py-2.5 px-2 text-right">Current Stock</th>
                    <th className="py-2.5 px-3 text-center">Adjustment Qty</th>
                    <th className="py-2.5 px-2 text-right">New Stock</th>
                    <th className="py-2.5 px-3 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {adjustmentItems.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-8 text-center text-slate-400">
                        No products added for adjustment. Click "Add Product +" above.
                      </td>
                    </tr>
                  ) : (
                    adjustmentItems.map(({ product, adjustmentQty }) => {
                      const calculatedNewStock =
                        adjustmentType === "increase"
                          ? product.currentStock + adjustmentQty
                          : Math.max(0, product.currentStock - adjustmentQty);

                      return (
                        <tr
                          key={product.id}
                          className="hover:bg-slate-50/70 transition-colors"
                        >
                          {/* Product Thumbnail & Name */}
                          <td className="py-2.5 px-3">
                            <div className="flex items-center gap-2.5">
                              <div className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-base shrink-0">
                                {product.image}
                              </div>
                              <span className="font-bold text-slate-800 line-clamp-1">
                                {product.name}
                              </span>
                            </div>
                          </td>

                          {/* SKU */}
                          <td className="py-2.5 px-3 font-mono text-[11px] text-slate-600">
                            {product.sku}
                          </td>

                          {/* Barcode */}
                          <td className="py-2.5 px-3 font-mono text-[11px] text-slate-500">
                            {product.barcode}
                          </td>

                          {/* Category */}
                          <td className="py-2.5 px-3 text-slate-600 font-medium">
                            {product.category}
                          </td>

                          {/* Current Stock */}
                          <td className="py-2.5 px-2 text-right font-bold text-slate-700">
                            {product.currentStock} {product.unit.toUpperCase()}
                          </td>

                          {/* Adjustment Qty Stepper */}
                          <td className="py-2.5 px-3 text-center">
                            <div className="inline-flex items-center border border-slate-200 rounded-lg overflow-hidden bg-white shadow-2xs">
                              <button
                                type="button"
                                onClick={() => handleQtyChange(product.id, -1)}
                                className="w-6 h-6 flex items-center justify-center text-slate-500 hover:bg-slate-100 font-bold cursor-pointer"
                              >
                                -
                              </button>
                              <span className="w-8 text-center text-xs font-bold text-slate-800">
                                {adjustmentQty}
                              </span>
                              <button
                                type="button"
                                onClick={() => handleQtyChange(product.id, 1)}
                                className="w-6 h-6 flex items-center justify-center text-slate-500 hover:bg-slate-100 font-bold cursor-pointer"
                              >
                                +
                              </button>
                            </div>
                          </td>

                          {/* New Stock */}
                          <td className="py-2.5 px-2 text-right font-bold text-slate-900">
                            {calculatedNewStock} {product.unit.toUpperCase()}
                          </td>

                          {/* Actions (Delete/Trash) */}
                          <td className="py-2.5 px-3 text-center">
                            <button
                              type="button"
                              onClick={() => handleRemoveItem(product.id)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors cursor-pointer"
                              title="Remove item"
                            >
                              <Trash2 size={14} />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Table Footer matching Image 1 */}
            <div className="px-4 py-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500 bg-slate-50/50">
              <span className="font-medium">
                {totalItemsCount} items selected for adjustment
              </span>
              <span className="font-bold text-slate-700">
                Total Adjustment: {totalAdjustmentQty} pcs to be{" "}
                {adjustmentType === "decrease" ? "decreased" : "increased"}
              </span>
            </div>
          </div>
        </div>

        {/* Right Column (approx 30% width: 4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          {/* Adjustment Summary Card */}
          <div className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200/80 shadow-2xs space-y-3.5">
            <h3 className="text-xs font-bold text-slate-900 tracking-tight">
              Adjustment Summary
            </h3>

            <div className="space-y-2.5 text-xs">
              {/* Type Badge */}
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-medium">Adjustment Type</span>
                {adjustmentType === "decrease" ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#fff1f2] text-[#ef4444] border border-[#fee2e2]">
                    <ArrowDown size={12} />
                    Decrease Stock
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#f0fdf4] text-[#16a34a] border border-[#bbf7d0]">
                    <ArrowUp size={12} />
                    Increase Stock
                  </span>
                )}
              </div>

              {/* Current Stock */}
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-medium">Current Stock</span>
                <span className="font-bold text-slate-800">
                  {currentTotalStock} Pcs
                </span>
              </div>

              {/* Adjustment */}
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-medium">Adjustment</span>
                <span
                  className={`font-bold ${
                    adjustmentType === "decrease"
                      ? "text-rose-500"
                      : "text-emerald-600"
                  }`}
                >
                  {adjustmentType === "decrease" ? "-" : "+"}
                  {totalAdjustmentQty} Pcs
                </span>
              </div>

              {/* Final Stock */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <span className="text-slate-700 font-bold">Final Stock</span>
                <span className="text-xl font-extrabold text-[#16a34a]">
                  {finalStock} Pcs
                </span>
              </div>
            </div>
          </div>

          {/* Notes Card */}
          <div className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200/80 shadow-2xs space-y-2">
            <h3 className="text-xs font-bold text-slate-900 tracking-tight">
              Notes
            </h3>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add adjustment notes or reason details..."
              rows={3}
              className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white transition-all resize-none"
            />
          </div>

          {/* Attachment / Photo Card */}
          <div className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200/80 shadow-2xs space-y-2">
            <h3 className="text-xs font-bold text-slate-900 tracking-tight">
              Attachment / Photo
            </h3>

            <label className="border-2 border-dashed border-slate-200 hover:border-emerald-400 rounded-xl p-4 flex flex-col items-center justify-center text-center cursor-pointer transition-colors bg-slate-50/50 hover:bg-emerald-50/20 group">
              <input
                type="file"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setUploadedFile(e.target.files[0]);
                  }
                }}
              />
              <UploadCloud
                size={24}
                className="text-slate-400 group-hover:text-emerald-500 mb-1.5 transition-colors"
              />
              <span className="text-xs font-bold text-slate-700 group-hover:text-emerald-600 block">
                {uploadedFile ? uploadedFile.name : "Attach Photo / Document"}
              </span>
              <span className="text-[10px] text-slate-400 mt-0.5">
                Drag & drop or click to upload (max 5MB)
              </span>
            </label>
          </div>

          {/* Action Buttons matching Image 1 */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <button
              type="button"
              onClick={() => {
                setAdjustmentItems([]);
                setNotes("");
              }}
              className="h-10 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-lg shadow-2xs transition-colors cursor-pointer flex items-center justify-center"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleSave}
              className="h-10 bg-[#16a34a] hover:bg-[#15803d] text-white text-xs font-bold rounded-lg shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Check size={15} />
              <span>Save Adjustment</span>
            </button>
          </div>
        </div>
      </div>

      {/* Footer Branding */}
      <div className="text-center text-[11px] text-slate-400 py-1">
        v2.4.1 © copyright view
      </div>
    </div>
  );
};

export default StockAdjustmentPage;
