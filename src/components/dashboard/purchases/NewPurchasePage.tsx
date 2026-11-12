import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Search,
  Plus,
  QrCode,
  Trash2,
  Check,
  Save,
} from "lucide-react";
import {
  initialStockProducts,
  mockSuppliers,
  type StockProduct,
} from "../inventory/mockStockData";

interface PurchaseItemRow {
  product: StockProduct;
  quantity: number;
  unit: string;
  purchasePrice: number;
  discount: number;
  taxPercent: number;
}

export const NewPurchasePage: React.FC = () => {
  const navigate = useNavigate();

  // Form states
  const [supplier, setSupplier] = useState("Meghna Group (Rupchanda)");
  const [purchaseInvoiceNo, setPurchaseInvoiceNo] = useState("PIN-2026-8943");
  const [purchaseDate, setPurchaseDate] = useState("2026-11-07");
  const [warehouse, setWarehouse] = useState("Warehouse A");
  const [paymentStatus, setPaymentStatus] = useState("Partial");

  // Items in purchase table matching Image 3
  const [items, setItems] = useState<PurchaseItemRow[]>([
    {
      product: initialStockProducts[1], // Rupchanda Soybean Oil 5L
      quantity: 50,
      unit: "Pcs",
      purchasePrice: 845.0,
      discount: 0.0,
      taxPercent: 5.0,
    },
    {
      product: initialStockProducts[0], // Chashi Chinigura Rice 1kg
      quantity: 100,
      unit: "Kg",
      purchasePrice: 132.0,
      discount: 0.0,
      taxPercent: 0.0,
    },
    {
      product: initialStockProducts[9], // ACI Pure Salt 1kg
      quantity: 150,
      unit: "Pcs",
      purchasePrice: 32.0,
      discount: 0.0,
      taxPercent: 0.0,
    },
    {
      product: initialStockProducts[3], // Aarong Dairy Liquid Milk 1L
      quantity: 24,
      unit: "Pack",
      purchasePrice: 82.0,
      discount: 0.0,
      taxPercent: 5.0,
    },
    {
      product: initialStockProducts[5], // Poultry Eggs (Dozen)
      quantity: 30,
      unit: "Dozen",
      purchasePrice: 140.0,
      discount: 0.0,
      taxPercent: 0.0,
    },
  ]);

  // Financial inputs matching Image 3
  const [invoiceDiscount, setInvoiceDiscount] = useState<number>(500.0);
  const [shippingCost, setShippingCost] = useState<number>(1200.0);
  const [otherCost, setOtherCost] = useState<number>(350.0);
  const [paidAmount, setPaidAmount] = useState<number>(50000.0);
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const previousSupplierDue = 12500.0;

  // Search & add dropdown
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddMenuOpen, setIsAddMenuOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);

  const handleQtyChange = (productId: string, val: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.product.id === productId
          ? { ...item, quantity: Math.max(1, val) }
          : item
      )
    );
  };

  const handlePriceChange = (productId: string, val: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.product.id === productId
          ? { ...item, purchasePrice: Math.max(0, val) }
          : item
      )
    );
  };

  const handleDiscountChange = (productId: string, val: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.product.id === productId
          ? { ...item, discount: Math.max(0, val) }
          : item
      )
    );
  };

  const handleTaxChange = (productId: string, val: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.product.id === productId
          ? { ...item, taxPercent: Math.max(0, val) }
          : item
      )
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
          quantity: 10,
          unit: prod.unit.toUpperCase(),
          purchasePrice: prod.purchasePrice,
          discount: 0.0,
          taxPercent: 0.0,
        },
      ]);
    }
    setIsAddMenuOpen(false);
  };

  // Calculations
  const calculateLineTotal = (item: PurchaseItemRow) => {
    const base = item.quantity * item.purchasePrice - item.discount;
    const tax = base * (item.taxPercent / 100);
    return base + tax;
  };

  const subtotal = items.reduce(
    (sum, i) => sum + i.quantity * i.purchasePrice,
    0
  );
  const itemDiscountTotal = items.reduce((sum, i) => sum + i.discount, 0);
  const taxTotal = items.reduce(
    (sum, i) =>
      sum +
      (i.quantity * i.purchasePrice - i.discount) * (i.taxPercent / 100),
    0
  );

  const grandTotal =
    subtotal - itemDiscountTotal - invoiceDiscount + taxTotal + shippingCost + otherCost;
  const currentDue = Math.max(0, grandTotal - paidAmount);

  const handleCompletePurchase = () => {
    setSuccessMessage(true);
    setTimeout(() => {
      setSuccessMessage(false);
      navigate("/purchases");
    }, 2000);
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
            <Link
              to="/purchases"
              className="text-slate-400 hover:text-slate-600 transition-colors"
            >
              Purchases
            </Link>
            <span>/</span>
            <span className="text-slate-600 font-semibold">New Purchase</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            New Purchase
          </h1>
        </div>
        <div className="text-xs text-slate-500 font-medium bg-white px-3 py-1.5 rounded-lg border border-slate-200/80 shadow-2xs self-start sm:self-auto">
          Saturday, Nov 7, 2026 • 12:16 PM
        </div>
      </div>

      {successMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-2">
          <Check size={16} className="text-emerald-600" />
          <span>Purchase completed successfully! Stock updated. Redirecting...</span>
        </div>
      )}

      {/* 2. Main Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column (approx 70% width: 8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          {/* Supplier & Invoice Details Card */}
          <div className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200/80 shadow-2xs space-y-4">
            <div className="flex items-center justify-between pb-1 border-b border-slate-100">
              <h3 className="text-xs font-bold text-slate-900 tracking-tight">
                Supplier & Invoice Details
              </h3>
              <button
                type="button"
                className="text-xs font-bold text-emerald-600 hover:text-emerald-700 cursor-pointer"
              >
                Add New Supplier +
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Supplier Dropdown */}
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

              {/* Purchase Invoice Input */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1.5">
                  Supplier Invoice No
                </label>
                <input
                  type="text"
                  value={purchaseInvoiceNo}
                  onChange={(e) => setPurchaseInvoiceNo(e.target.value)}
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

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
              {/* Purchase Invoice No */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1.5">
                  Purchase Invoice No
                </label>
                <input
                  type="text"
                  value={purchaseInvoiceNo}
                  onChange={(e) => setPurchaseInvoiceNo(e.target.value)}
                  className="w-full h-9.5 px-3 text-xs bg-white border border-slate-200 rounded-lg text-slate-700 font-mono focus:outline-none focus:border-emerald-500"
                />
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
                </select>
              </div>

              {/* Payment Status */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1.5">
                  Payment Status
                </label>
                <select
                  value={paymentStatus}
                  onChange={(e) => setPaymentStatus(e.target.value)}
                  className="w-full h-9.5 px-3 text-xs bg-white border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:border-emerald-500 cursor-pointer"
                >
                  <option value="Partial">Partial</option>
                  <option value="Paid">Paid</option>
                  <option value="Due">Due</option>
                </select>
              </div>
            </div>
          </div>

          {/* Product Entry Card */}
          <div className="space-y-1.5">
            <h3 className="text-xs font-bold text-slate-800 tracking-tight">
              Product Entry
            </h3>
            <div className="flex items-center gap-2.5">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search and select products to add..."
                  className="w-full h-9.5 pl-3.5 pr-9 text-xs bg-white border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500 shadow-2xs"
                />
                <Search className="w-4 h-4 text-slate-400 absolute right-3 top-2.5 pointer-events-none" />
              </div>

              {/* Add Product Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsAddMenuOpen(!isAddMenuOpen)}
                  className="h-9.5 px-3.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
                >
                  <Plus size={14} className="text-slate-500" />
                  <span>Add Product</span>
                </button>

                {isAddMenuOpen && (
                  <div className="absolute right-0 top-11 w-64 bg-white border border-slate-200 rounded-xl shadow-lg z-20 py-1.5 max-h-60 overflow-y-auto">
                    <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase">
                      Select Product
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

              {/* Barcode Scanner Button */}
              <button
                type="button"
                className="h-9.5 w-9.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-lg flex items-center justify-center shadow-2xs transition-colors cursor-pointer"
                title="Scan Barcode"
              >
                <QrCode size={16} />
              </button>
            </div>
          </div>

          {/* Purchase Items Table Card */}
          <div className="bg-white rounded-xl border border-slate-200/80 shadow-2xs overflow-hidden">
            <div className="p-3.5 border-b border-slate-100">
              <h3 className="text-xs font-bold text-slate-900 tracking-tight">
                Purchase Items
              </h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/75 text-[11px] font-bold text-slate-500">
                    <th className="py-2.5 px-3">Product</th>
                    <th className="py-2.5 px-2">SKU</th>
                    <th className="py-2.5 px-2 text-right">Current Stock</th>
                    <th className="py-2.5 px-2 text-center">Quantity</th>
                    <th className="py-2.5 px-2 text-center">Unit</th>
                    <th className="py-2.5 px-2 text-right">Purchase Price</th>
                    <th className="py-2.5 px-2 text-right">Discount (%)</th>
                    <th className="py-2.5 px-2 text-right">Tax (%)</th>
                    <th className="py-2.5 px-3 text-right">Line Total</th>
                    <th className="py-2.5 px-2 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {items.map((item) => {
                    const lineTotal = calculateLineTotal(item);
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

                        {/* Quantity Input */}
                        <td className="py-2.5 px-2 text-center">
                          <input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) =>
                              handleQtyChange(
                                item.product.id,
                                Number(e.target.value) || 1
                              )
                            }
                            className="w-14 h-7 text-center font-bold text-slate-800 bg-white border border-emerald-400 rounded-md focus:outline-none"
                          />
                        </td>

                        {/* Unit */}
                        <td className="py-2.5 px-2 text-center text-slate-600 font-medium">
                          {item.unit}
                        </td>

                        {/* Purchase Price Input */}
                        <td className="py-2.5 px-2 text-right">
                          <div className="inline-flex items-center gap-1 border border-slate-200 rounded px-1.5 py-0.5 bg-slate-50">
                            <span className="text-[10px] text-slate-500">৳</span>
                            <input
                              type="number"
                              value={item.purchasePrice}
                              onChange={(e) =>
                                handlePriceChange(
                                  item.product.id,
                                  Number(e.target.value) || 0
                                )
                              }
                              className="w-14 text-right font-semibold text-slate-800 text-xs bg-transparent focus:outline-none"
                            />
                          </div>
                        </td>

                        {/* Discount */}
                        <td className="py-2.5 px-2 text-right">
                          <div className="inline-flex items-center gap-1 border border-slate-200 rounded px-1.5 py-0.5 bg-slate-50">
                            <span className="text-[10px] text-slate-500">৳</span>
                            <input
                              type="number"
                              value={item.discount}
                              onChange={(e) =>
                                handleDiscountChange(
                                  item.product.id,
                                  Number(e.target.value) || 0
                                )
                              }
                              className="w-12 text-right text-slate-700 text-xs bg-transparent focus:outline-none"
                            />
                          </div>
                        </td>

                        {/* Tax % */}
                        <td className="py-2.5 px-2 text-right">
                          <div className="inline-flex items-center gap-1 border border-slate-200 rounded px-1.5 py-0.5 bg-slate-50">
                            <input
                              type="number"
                              value={item.taxPercent}
                              onChange={(e) =>
                                handleTaxChange(
                                  item.product.id,
                                  Number(e.target.value) || 0
                                )
                              }
                              className="w-10 text-right text-slate-700 text-xs bg-transparent focus:outline-none"
                            />
                            <span className="text-[10px] text-slate-500">%</span>
                          </div>
                        </td>

                        {/* Line Total */}
                        <td className="py-2.5 px-3 text-right font-bold text-slate-900">
                          ৳{lineTotal.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                        </td>

                        {/* Actions */}
                        <td className="py-2.5 px-2 text-center">
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(item.product.id)}
                            className="p-1 text-slate-400 hover:text-rose-500 rounded transition-colors cursor-pointer"
                            title="Remove Product"
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
            <div className="px-4 py-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 bg-slate-50/50">
              <span className="font-medium">
                {items.length} items in purchase list
              </span>
            </div>
          </div>
        </div>

        {/* Right Column (approx 30% width: 4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          {/* Purchase Summary Card */}
          <div className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200/80 shadow-2xs space-y-3">
            <h3 className="text-xs font-bold text-slate-900 tracking-tight">
              Purchase Summary
            </h3>

            <div className="space-y-2.5 text-xs">
              {/* Subtotal */}
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-medium">Subtotal</span>
                <span className="font-bold text-slate-800">
                  ৳{subtotal.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </span>
              </div>

              {/* Item Discount */}
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-medium">Item Discount</span>
                <span className="text-slate-700">
                  ৳{itemDiscountTotal.toFixed(2)}
                </span>
              </div>

              {/* Invoice Discount Input */}
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-medium">Invoice Discount</span>
                <div className="flex items-center gap-1 border border-slate-200 rounded px-2 py-0.5 bg-slate-50">
                  <span className="text-[11px] text-slate-500">৳</span>
                  <input
                    type="number"
                    value={invoiceDiscount}
                    onChange={(e) =>
                      setInvoiceDiscount(Number(e.target.value) || 0)
                    }
                    className="w-16 text-right font-semibold text-slate-800 text-xs bg-transparent focus:outline-none"
                  />
                </div>
              </div>

              {/* VAT/Tax */}
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-medium">VAT/Tax (5%)</span>
                <span className="text-slate-700">
                  ৳{taxTotal.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </span>
              </div>

              {/* Shipping Cost */}
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-medium">Shipping Cost</span>
                <div className="flex items-center gap-1 border border-slate-200 rounded px-2 py-0.5 bg-slate-50">
                  <span className="text-[11px] text-slate-500">৳</span>
                  <input
                    type="number"
                    value={shippingCost}
                    onChange={(e) =>
                      setShippingCost(Number(e.target.value) || 0)
                    }
                    className="w-16 text-right font-semibold text-slate-800 text-xs bg-transparent focus:outline-none"
                  />
                </div>
              </div>

              {/* Other Cost */}
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-medium">Other Cost</span>
                <div className="flex items-center gap-1 border border-slate-200 rounded px-2 py-0.5 bg-slate-50">
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

          {/* Payment & Due Card */}
          <div className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200/80 shadow-2xs space-y-3">
            <h3 className="text-xs font-bold text-slate-900 tracking-tight">
              Payment & Due
            </h3>

            <div className="space-y-3 text-xs">
              {/* Paid Amount */}
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-medium">Paid Amount</span>
                <div className="flex items-center gap-1 border border-slate-200 rounded px-2 py-1 bg-slate-50">
                  <span className="text-[11px] text-slate-500">৳</span>
                  <input
                    type="number"
                    value={paidAmount}
                    onChange={(e) => setPaidAmount(Number(e.target.value) || 0)}
                    className="w-20 text-right font-bold text-slate-800 text-xs bg-transparent focus:outline-none"
                  />
                </div>
              </div>

              {/* Previous Supplier Due */}
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-medium">
                  Previous Supplier Due
                </span>
                <span className="font-semibold text-slate-700">
                  ৳{previousSupplierDue.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </span>
              </div>

              {/* Current Due */}
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-medium">Current Due</span>
                <span className="font-extrabold text-rose-600 text-sm">
                  ৳{currentDue.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </span>
              </div>

              {/* Payment Method Pills */}
              <div>
                <span className="text-[11px] font-bold text-slate-700 block mb-2">
                  Payment Method
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {["Cash", "Bank Transfer", "Card", "bKash", "Nagad"].map(
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

          {/* Action Buttons matching Image 3 */}
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => navigate("/purchases")}
                className="h-9.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-lg shadow-2xs transition-colors cursor-pointer flex items-center justify-center"
              >
                Cancel
              </button>

              <button
                type="button"
                className="h-9.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-lg shadow-2xs transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Save size={13} className="text-slate-500" />
                <span>Save Draft</span>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => navigate("/purchases")}
                className="h-10 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-lg shadow-2xs transition-colors cursor-pointer flex items-center justify-center"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleCompletePurchase}
                className="h-10 bg-[#16a34a] hover:bg-[#15803d] text-white text-xs font-bold rounded-lg shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Check size={14} />
                <span>Complete Purchase</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Branding */}
      <div className="text-center text-[11px] text-slate-400 py-1">
        v2.4.1
      </div>
    </div>
  );
};

export default NewPurchasePage;

