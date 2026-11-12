import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  Plus,
  QrCode,
  Printer,
  Check,
  Trash2,
  Edit2,
  ArrowRightLeft,
  Save,
} from "lucide-react";
import {
  initialStockProducts,
  mockSuppliers,
  type StockProduct,
} from "./mockStockData";

interface ReceivedItem {
  product: StockProduct;
  quantityReceived: number;
  unit: string;
  purchasePrice: number;
  discount: number;
  taxPercent: number;
}

export const ReceiveStockPage: React.FC = () => {
  // Top form states
  const [supplier, setSupplier] = useState("Meghna Group (Rupchanda)");
  const [purchaseInvoiceNumber, setPurchaseInvoiceNumber] =
    useState("PIN-2026-8942");
  const [purchaseDate, setPurchaseDate] = useState("2026-11-07");
  const [warehouse, setWarehouse] = useState("Warehouse A");
  const [referenceNumber, setReferenceNumber] = useState("PO-82910");

  // Items in receipt matching Image 4
  const [items, setItems] = useState<ReceivedItem[]>([
    {
      product: initialStockProducts[1], // Rupchanda Soybean Oil 5L
      quantityReceived: 50,
      unit: "Pcs",
      purchasePrice: 845.0,
      discount: 0,
      taxPercent: 5.0,
    },
    {
      product: initialStockProducts[0], // Chashi Chinigura Rice 1kg
      quantityReceived: 100,
      unit: "Kg",
      purchasePrice: 132.0,
      discount: 0,
      taxPercent: 0.0,
    },
    {
      product: initialStockProducts[9], // ACI Pure Salt 1kg
      quantityReceived: 150,
      unit: "Pcs",
      purchasePrice: 32.0,
      discount: 0,
      taxPercent: 0.0,
    },
    {
      product: initialStockProducts[3], // Aarong Dairy Liquid Milk 1L
      quantityReceived: 24,
      unit: "Pack",
      purchasePrice: 82.0,
      discount: 0,
      taxPercent: 5.0,
    },
    {
      product: initialStockProducts[5], // Poultry Eggs (Dozen)
      quantityReceived: 30,
      unit: "Dozen",
      purchasePrice: 140.0,
      discount: 0,
      taxPercent: 0.0,
    },
  ]);

  // Financial inputs matching Image 4
  const [discountAmount, setDiscountAmount] = useState(500.0);
  const [shippingCost, setShippingCost] = useState(1200.0);
  const [otherCost, setOtherCost] = useState(350.0);
  const [paidAmount, setPaidAmount] = useState(50000.0);
  const [paymentMethod, setPaymentMethod] = useState("Cash");

  const [searchQuery, setSearchQuery] = useState("");
  const [isAddMenuOpen, setIsAddMenuOpen] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleQtyChange = (productId: string, delta: number) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.product.id === productId) {
          const newQty = Math.max(1, item.quantityReceived + delta);
          return { ...item, quantityReceived: newQty };
        }
        return item;
      })
    );
  };



  const handleRemoveItem = (productId: string) => {
    setItems((prev) => prev.filter((i) => i.product.id !== productId));
  };

  const handleAddProduct = (prod: StockProduct) => {
    if (!items.some((i) => i.product.id === prod.id)) {
      setItems((prev) => [
        ...prev,
        {
          product: prod,
          quantityReceived: 10,
          unit: prod.unit.toUpperCase(),
          purchasePrice: prod.purchasePrice,
          discount: 0,
          taxPercent: 0,
        },
      ]);
    }
    setIsAddMenuOpen(false);
  };

  // Calculations
  const calculateItemTotal = (item: ReceivedItem) => {
    const base = item.quantityReceived * item.purchasePrice - item.discount;
    const tax = base * (item.taxPercent / 100);
    return base + tax;
  };

  const totalQuantities = items.reduce((sum, i) => sum + i.quantityReceived, 0);
  const subtotal = items.reduce((sum, i) => sum + calculateItemTotal(i), 0);
  const grandTotal = subtotal - discountAmount + shippingCost + otherCost;
  const dueAmount = Math.max(0, grandTotal - paidAmount);

  const handleReceiveStock = () => {
    setIsSuccess(true);
    setTimeout(() => setIsSuccess(false), 3000);
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
            <span className="text-slate-600 font-semibold">Receive Stock</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Receive Stock
          </h1>
        </div>
        <div className="text-xs text-slate-500 font-medium bg-white px-3 py-1.5 rounded-lg border border-slate-200/80 shadow-2xs self-start sm:self-auto">
          Saturday, Nov 7, 2026 • 12:09 PM
        </div>
      </div>

      {isSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-2">
          <Check size={16} className="text-emerald-600" />
          <span>Stock received and logged successfully into Warehouse inventory!</span>
        </div>
      )}

      {/* 2. Main Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column (approx 70% width: 8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          {/* Supplier & Invoice Form Card */}
          <div className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200/80 shadow-2xs space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Supplier */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1.5">
                  Supplier
                </label>
                <select
                  value={supplier}
                  onChange={(e) => setSupplier(e.target.value)}
                  className="w-full h-9.5 px-3 text-xs bg-white border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:border-emerald-500 cursor-pointer"
                >
                  {mockSuppliers.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              {/* Purchase Invoice Number */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1.5">
                  Purchase Invoice Number
                </label>
                <input
                  type="text"
                  value={purchaseInvoiceNumber}
                  onChange={(e) => setPurchaseInvoiceNumber(e.target.value)}
                  className="w-full h-9.5 px-3 text-xs bg-white border border-slate-200 rounded-lg text-slate-700 font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Purchase Date */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1.5">
                  Purchase Date
                </label>
                <input
                  type="date"
                  value={purchaseDate}
                  onChange={(e) => setPurchaseDate(e.target.value)}
                  className="w-full h-9.5 px-3 text-xs bg-white border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:border-emerald-500 cursor-pointer"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
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
                  <option value="Main Central">Main Central</option>
                </select>
              </div>

              {/* Reference Number */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1.5">
                  Reference Number
                </label>
                <input
                  type="text"
                  value={referenceNumber}
                  onChange={(e) => setReferenceNumber(e.target.value)}
                  className="w-full h-9.5 px-3 text-xs bg-white border border-slate-200 rounded-lg text-slate-700 font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* Product Search & Scanning (Inline) */}
          <div className="space-y-1.5">
            <h3 className="text-xs font-bold text-slate-800 tracking-tight">
              Product Search & Scanning (Inline)
            </h3>
            <div className="flex items-center gap-2.5">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search and select products to add..."
                  className="w-full h-9.5 pl-3.5 pr-9 text-xs bg-white border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500 transition-all shadow-2xs"
                />
                <Search className="w-4 h-4 text-slate-400 absolute right-3 top-2.5 pointer-events-none" />
              </div>

              {/* Add Product Button */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsAddMenuOpen(!isAddMenuOpen)}
                  className="h-9.5 px-3.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
                >
                  <span>Add Product</span>
                  <Plus size={14} className="text-slate-500" />
                </button>

                {isAddMenuOpen && (
                  <div className="absolute right-0 top-11 w-64 bg-white border border-slate-200 rounded-xl shadow-lg z-20 py-1.5 max-h-60 overflow-y-auto">
                    <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase">
                      Select Product to Receive
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
                          ৳{p.purchasePrice}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Barcode Scanner Icon */}
              <button
                type="button"
                className="h-9.5 w-9.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-lg flex items-center justify-center shadow-2xs transition-colors cursor-pointer"
                title="Scan Barcode"
              >
                <QrCode size={16} />
              </button>
            </div>
          </div>

          {/* Received Products Table Card */}
          <div className="bg-white rounded-xl border border-slate-200/80 shadow-2xs overflow-hidden">
            <div className="p-3.5 border-b border-slate-100">
              <h3 className="text-xs font-bold text-slate-900 tracking-tight">
                Received Products
              </h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/75 text-[11px] font-bold text-slate-500">
                    <th className="py-2.5 px-3">Product</th>
                    <th className="py-2.5 px-2">SKU</th>
                    <th className="py-2.5 px-2 text-right">Current Stock</th>
                    <th className="py-2.5 px-3 text-center">Quantity Received</th>
                    <th className="py-2.5 px-2 text-center">Unit</th>
                    <th className="py-2.5 px-2 text-right">Purchase Price</th>
                    <th className="py-2.5 px-2 text-right">Discount (%)</th>
                    <th className="py-2.5 px-2 text-right">Tax (%)</th>
                    <th className="py-2.5 px-3 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {items.map((item) => {
                    const itemTotal = calculateItemTotal(item);
                    return (
                      <tr
                        key={item.product.id}
                        className="hover:bg-slate-50/70 transition-colors"
                      >
                        {/* Product Thumbnail & Name */}
                        <td className="py-2.5 px-3">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-base shrink-0">
                              {item.product.image}
                            </div>
                            <span className="font-bold text-slate-800 line-clamp-1">
                              {item.product.name}
                            </span>
                          </div>
                        </td>

                        {/* SKU */}
                        <td className="py-2.5 px-2 font-mono text-[11px] text-slate-600">
                          {item.product.sku}
                        </td>

                        {/* Current Stock */}
                        <td className="py-2.5 px-2 text-right text-slate-600 font-medium">
                          {item.product.currentStock} {item.product.unit.toUpperCase()}
                        </td>

                        {/* Quantity Received Stepper */}
                        <td className="py-2.5 px-3 text-center">
                          <div className="inline-flex items-center border border-slate-200 rounded-lg overflow-hidden bg-white shadow-2xs">
                            <button
                              type="button"
                              onClick={() => handleQtyChange(item.product.id, -1)}
                              className="w-6 h-6 flex items-center justify-center text-slate-500 hover:bg-slate-100 font-bold cursor-pointer"
                            >
                              -
                            </button>
                            <span className="w-8 text-center text-xs font-bold text-slate-800">
                              {item.quantityReceived}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleQtyChange(item.product.id, 1)}
                              className="w-6 h-6 flex items-center justify-center text-slate-500 hover:bg-slate-100 font-bold cursor-pointer"
                            >
                              +
                            </button>
                          </div>
                        </td>

                        {/* Unit */}
                        <td className="py-2.5 px-2 text-center text-slate-600 font-medium">
                          {item.unit}
                        </td>

                        {/* Purchase Price */}
                        <td className="py-2.5 px-2 text-right font-semibold text-slate-800">
                          ৳ {item.purchasePrice.toFixed(2)}
                        </td>

                        {/* Discount */}
                        <td className="py-2.5 px-2 text-right font-mono text-[11px] text-slate-600">
                          ৳ [{item.discount.toFixed(2)}]
                        </td>

                        {/* Tax % */}
                        <td className="py-2.5 px-2 text-right font-medium text-slate-700">
                          {item.taxPercent.toFixed(1)} %
                        </td>

                        {/* Total */}
                        <td className="py-2.5 px-3 text-right font-bold text-slate-900">
                          ৳ {itemTotal.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                        </td>

                        {/* Remove */}
                        <td className="py-2.5 px-2 text-center">
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(item.product.id)}
                            className="p-1 text-slate-400 hover:text-rose-500 rounded transition-colors cursor-pointer"
                            title="Remove product"
                          >
                            <Trash2 size={13} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Footer */}
            <div className="px-4 py-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500 bg-slate-50/50">
              <span className="font-medium">
                {items.length} items selected for receipt
              </span>
              <span className="font-bold text-slate-700">
                Total Quantities: {totalQuantities} received
              </span>
            </div>
          </div>
        </div>

        {/* Right Column (approx 30% width: 4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          {/* Financial Breakdown Card */}
          <div className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200/80 shadow-2xs space-y-3">
            <div className="space-y-2.5 text-xs">
              {/* Subtotal */}
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-medium">Subtotal</span>
                <span className="font-bold text-slate-800">
                  ৳{subtotal.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </span>
              </div>

              {/* Discount Input */}
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-medium">Discount</span>
                <div className="flex items-center gap-1.5 border border-slate-200 rounded-md px-2 py-1 bg-slate-50">
                  <span className="text-[11px] text-slate-500">৳</span>
                  <input
                    type="number"
                    value={discountAmount}
                    onChange={(e) => setDiscountAmount(Number(e.target.value) || 0)}
                    className="w-16 text-right font-semibold text-slate-800 text-xs bg-transparent focus:outline-none"
                  />
                  <Edit2 size={11} className="text-slate-400" />
                </div>
              </div>

              {/* VAT/Tax */}
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-medium">VAT/Tax (Composite)</span>
                <span className="text-slate-500 text-[11px]">
                  ৳ 0.00 / calculated
                </span>
              </div>

              {/* Shipping Cost */}
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-medium">Shipping Cost</span>
                <div className="flex items-center gap-1 border border-slate-200 rounded-md px-2 py-1 bg-slate-50">
                  <span className="text-[11px] text-slate-500">৳</span>
                  <input
                    type="number"
                    value={shippingCost}
                    onChange={(e) => setShippingCost(Number(e.target.value) || 0)}
                    className="w-16 text-right font-semibold text-slate-800 text-xs bg-transparent focus:outline-none"
                  />
                </div>
              </div>

              {/* Other Cost */}
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-medium">Other Cost</span>
                <div className="flex items-center gap-1 border border-slate-200 rounded-md px-2 py-1 bg-slate-50">
                  <span className="text-[11px] text-slate-500">৳</span>
                  <input
                    type="number"
                    value={otherCost}
                    onChange={(e) => setOtherCost(Number(e.target.value) || 0)}
                    className="w-16 text-right font-semibold text-slate-800 text-xs bg-transparent focus:outline-none"
                  />
                </div>
              </div>

              {/* Grand Total */}
              <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between">
                <span className="text-slate-800 font-bold">Grand Total</span>
                <span className="text-xl font-extrabold text-[#16a34a]">
                  ৳{grandTotal.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          </div>

          {/* Payment Card */}
          <div className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200/80 shadow-2xs space-y-3">
            <h3 className="text-xs font-bold text-slate-900 tracking-tight">
              Payment
            </h3>

            <div className="space-y-3 text-xs">
              {/* Paid Amount */}
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-medium">Paid Amount</span>
                <div className="flex items-center gap-1.5 border border-slate-200 rounded-md px-2 py-1 bg-slate-50">
                  <span className="text-[11px] text-slate-500">৳</span>
                  <input
                    type="number"
                    value={paidAmount}
                    onChange={(e) => setPaidAmount(Number(e.target.value) || 0)}
                    className="w-20 text-right font-bold text-slate-800 text-xs bg-transparent focus:outline-none"
                  />
                  <ArrowRightLeft size={11} className="text-slate-400" />
                </div>
              </div>

              {/* Due Amount */}
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-medium">Due Amount</span>
                <span className="font-extrabold text-rose-600 text-sm">
                  ৳{dueAmount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </span>
              </div>

              {/* Payment Method Pills */}
              <div>
                <span className="text-[11px] font-bold text-slate-700 block mb-2">
                  Payment Method
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {["Cash", "Card", "bKash", "Bank Transfer", "Other"].map(
                    (method) => {
                      const isSelected = paymentMethod === method;
                      return (
                        <button
                          key={method}
                          type="button"
                          onClick={() => setPaymentMethod(method)}
                          className={`px-3 py-1 rounded-full text-[11px] font-semibold transition-colors cursor-pointer ${
                            isSelected
                              ? "bg-[#ecfdf5] text-[#16a34a] border border-[#a7f3d0]"
                              : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                          }`}
                        >
                          {method}
                        </button>
                      );
                    }
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons matching Image 4 */}
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => setItems([])}
                className="h-9.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-lg shadow-2xs transition-colors cursor-pointer flex items-center justify-center"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={() => window.print()}
                className="h-9.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-lg shadow-2xs transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Printer size={13} className="text-slate-500" />
                <span>Print</span>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                className="h-10 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-lg shadow-2xs transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Save size={13} className="text-slate-500" />
                <span>Save as Draft</span>
              </button>

              <button
                type="button"
                onClick={handleReceiveStock}
                className="h-10 bg-[#16a34a] hover:bg-[#15803d] text-white text-xs font-bold rounded-lg shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Check size={14} />
                <span>Receive Stock</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Branding */}
      <div className="text-center text-[11px] text-slate-400 py-1">
        Grocery POS • v2.4.1
      </div>
    </div>
  );
};

export default ReceiveStockPage;
