import React, { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  Search,
  Trash2,
  Check,
} from "lucide-react";
import { mockPurchases, type PurchaseRecord } from "./mockPurchasesData";

interface ReturnItemState {
  id: string;
  name: string;
  image: string;
  purchasedQty: number;
  prevReturned: number;
  availableReturnQty: number;
  returnQty: number;
  purchasePrice: number;
  reason: string;
}

export const PurchaseReturnPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialInvoiceQuery = searchParams.get("invoice") || "PIN-2026-8942";

  const [searchInvoice, setSearchInvoice] = useState(initialInvoiceQuery);
  const purchase: PurchaseRecord = mockPurchases[0];

  // Return items matching Image 1
  const [items, setItems] = useState<ReturnItemState[]>([
    {
      id: "1",
      name: "Rupchanda Soybean Oil 5L",
      image: "🌻",
      purchasedQty: 50,
      prevReturned: 0,
      availableReturnQty: 50,
      returnQty: 5,
      purchasePrice: 845.0,
      reason: "Wrong Product",
    },
    {
      id: "2",
      name: "ACI Pure Salt 1kg",
      image: "🧂",
      purchasedQty: 150,
      prevReturned: 0,
      availableReturnQty: 150,
      returnQty: 0,
      purchasePrice: 32.0,
      reason: "Reason",
    },
    {
      id: "3",
      name: "Aarong Dairy Liquid Milk 1L",
      image: "🥛",
      purchasedQty: 24,
      prevReturned: 0,
      availableReturnQty: 24,
      returnQty: 3,
      purchasePrice: 82.0,
      reason: "Wrong Product",
    },
    {
      id: "4",
      name: "Poultry Eggs (Dozen)",
      image: "🥚",
      purchasedQty: 30,
      prevReturned: 0,
      availableReturnQty: 30,
      returnQty: 0,
      purchasePrice: 140.0,
      reason: "Reason",
    },
  ]);

  const [refundMethod, setRefundMethod] = useState<"adjust" | "cash">("adjust");
  const [returnNotes, setReturnNotes] = useState("");
  const [successMsg, setSuccessMsg] = useState(false);

  const handleQtyChange = (id: string, delta: number) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const next = Math.max(
            0,
            Math.min(item.availableReturnQty, item.returnQty + delta)
          );
          return { ...item, returnQty: next };
        }
        return item;
      })
    );
  };

  const handleReasonChange = (id: string, reason: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, reason } : item))
    );
  };

  const handleRemoveItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  // Calculations
  const returnAmount = items.reduce(
    (sum, i) => sum + i.returnQty * i.purchasePrice,
    0
  );
  const totalPurchase = 69678.9;
  const remainingPurchaseAmount = totalPurchase - returnAmount;
  const itemsSelectedCount = items.filter((i) => i.returnQty > 0).length;

  const handleProcessReturn = () => {
    setSuccessMsg(true);
    setTimeout(() => setSuccessMsg(false), 3000);
  };

  return (
    <div className="w-full min-h-screen bg-[#F7F9FB] p-4 sm:p-6 lg:p-7 space-y-5">
      {/* 1. Header & Search Bar matching Image 1 */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
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
            <span className="text-slate-600 font-semibold">
              Purchase Return
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Purchase Return
          </h1>
        </div>

        {/* Invoice Search Box on Right */}
        <div className="flex items-center gap-2">
          <div className="relative min-w-[280px]">
            <input
              type="text"
              value={searchInvoice}
              onChange={(e) => setSearchInvoice(e.target.value)}
              placeholder="Search Purchase Invoice No. (e.g., PIN-2026-8942)..."
              className="w-full h-9.5 pl-3.5 pr-8 text-xs bg-white border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500 shadow-2xs font-mono"
            />
            <Search className="w-4 h-4 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
          </div>
          <button
            type="button"
            className="h-9.5 px-4 bg-[#16a34a] hover:bg-[#15803d] text-white text-xs font-bold rounded-lg shadow-xs transition-colors cursor-pointer"
          >
            Search
          </button>
        </div>
      </div>

      {successMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-2">
          <Check size={16} className="text-emerald-600" />
          <span>Purchase return processed successfully! Supplier balance adjusted.</span>
        </div>
      )}

      {/* 2. Main Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column (8 cols): Purchase Info & Return Items */}
        <div className="lg:col-span-8 space-y-4">
          {/* Purchase Information Card matching Image 1 */}
          <div className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200/80 shadow-2xs space-y-3">
            <h3 className="text-xs font-bold text-slate-900 tracking-tight">
              Purchase Information
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-2.5 gap-x-6 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-slate-500 font-medium">No:</span>
                <span className="font-mono font-bold text-slate-800">
                  {purchase.invoiceNo}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-slate-500 font-medium">Total Amount:</span>
                <span className="font-bold text-slate-800">
                  ৳{totalPurchase.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-slate-500 font-medium">Supplier:</span>
                <span className="font-semibold text-slate-800 line-clamp-1">
                  {purchase.supplier.name}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-slate-500 font-medium">Paid Amount:</span>
                <span className="font-bold text-emerald-600">
                  ৳{purchase.paidAmount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-slate-500 font-medium">Purchase Date:</span>
                <span className="text-slate-700">
                  {purchase.date}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-slate-500 font-medium">Due Amount:</span>
                <span className="font-bold text-rose-600">
                  ৳{purchase.dueAmount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          </div>

          {/* Return Items Table Card */}
          <div className="bg-white rounded-xl border border-slate-200/80 shadow-2xs overflow-hidden">
            <div className="p-3.5 border-b border-slate-100">
              <h3 className="text-xs font-bold text-slate-900 tracking-tight">
                Return Items
              </h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/75 text-[11px] font-bold text-slate-500">
                    <th className="py-2.5 px-3">Product</th>
                    <th className="py-2.5 px-2 text-center">Purchased Qty</th>
                    <th className="py-2.5 px-2 text-center">Prev. Returned</th>
                    <th className="py-2.5 px-2 text-center">Available Return Qty</th>
                    <th className="py-2.5 px-3 text-center">Return Qty</th>
                    <th className="py-2.5 px-2 text-right">Purchase Price</th>
                    <th className="py-2.5 px-2 text-right">Return Amount</th>
                    <th className="py-2.5 px-3">Reason</th>
                    <th className="py-2.5 px-2 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {items.map((item, index) => {
                    const lineReturnAmount = item.returnQty * item.purchasePrice;
                    const isSelected = item.returnQty > 0;
                    return (
                      <tr
                        key={item.id}
                        className={`transition-colors ${
                          isSelected
                            ? "bg-[#f0fdf4]/60 hover:bg-[#f0fdf4]"
                            : "hover:bg-slate-50/70"
                        }`}
                      >
                        {/* Product */}
                        <td className="py-2.5 px-3">
                          <div className="flex items-center gap-2">
                            <span className="text-slate-400 text-[11px]">
                              {index + 1}.
                            </span>
                            <div className="w-7 h-7 rounded bg-slate-100 border border-slate-200 flex items-center justify-center text-sm shrink-0">
                              {item.image}
                            </div>
                            <span className="font-bold text-slate-800 line-clamp-1">
                              {item.name}
                            </span>
                          </div>
                        </td>

                        {/* Purchased Qty */}
                        <td className="py-2.5 px-2 text-center text-slate-600 font-medium">
                          {item.purchasedQty} Pcs
                        </td>

                        {/* Prev Returned */}
                        <td className="py-2.5 px-2 text-center text-slate-600">
                          {item.prevReturned} Pcs
                        </td>

                        {/* Available Return Qty */}
                        <td className="py-2.5 px-2 text-center font-bold text-slate-700">
                          {item.availableReturnQty} Pcs
                        </td>

                        {/* Return Qty Stepper */}
                        <td className="py-2.5 px-3 text-center">
                          <div className="inline-flex items-center border border-slate-200 rounded-lg overflow-hidden bg-white shadow-2xs">
                            <button
                              type="button"
                              onClick={() => handleQtyChange(item.id, -1)}
                              className="w-6 h-6 flex items-center justify-center text-slate-500 hover:bg-slate-100 font-bold cursor-pointer"
                            >
                              -
                            </button>
                            <span className="w-8 text-center text-xs font-bold text-slate-800">
                              {item.returnQty}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleQtyChange(item.id, 1)}
                              className="w-6 h-6 flex items-center justify-center text-slate-500 hover:bg-slate-100 font-bold cursor-pointer"
                            >
                              +
                            </button>
                          </div>
                        </td>

                        {/* Purchase Price */}
                        <td className="py-2.5 px-2 text-right text-slate-700">
                          ৳{item.purchasePrice.toFixed(2)}
                        </td>

                        {/* Return Amount */}
                        <td className="py-2.5 px-2 text-right font-bold text-slate-900">
                          ৳{lineReturnAmount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                        </td>

                        {/* Reason Dropdown */}
                        <td className="py-2.5 px-3">
                          <select
                            value={item.reason}
                            onChange={(e) =>
                              handleReasonChange(item.id, e.target.value)
                            }
                            className="h-8 px-2 text-xs bg-white border border-slate-200 rounded-md text-slate-700 focus:outline-none focus:border-emerald-500 cursor-pointer"
                          >
                            <option value="Damaged">Damaged</option>
                            <option value="Expired">Expired</option>
                            <option value="Wrong Product">Wrong Product</option>
                            <option value="Supplier Return">Supplier Return</option>
                            <option value="Other">Other</option>
                            <option value="Reason">Reason</option>
                          </select>
                        </td>

                        {/* Actions */}
                        <td className="py-2.5 px-2 text-center">
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(item.id)}
                            className="p-1 text-slate-400 hover:text-rose-500 rounded transition-colors cursor-pointer"
                            title="Remove"
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

            {/* Table Footer */}
            <div className="px-4 py-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 bg-slate-50/50">
              <span className="font-medium">
                {itemsSelectedCount} items selected for return
              </span>
            </div>
          </div>
        </div>

        {/* Right Column (4 cols): Summary & Refund Method */}
        <div className="lg:col-span-4 space-y-4">
          {/* Return Summary Card matching Image 1 */}
          <div className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200/80 shadow-2xs space-y-3">
            <h3 className="text-xs font-bold text-slate-900 tracking-tight">
              Return Summary
            </h3>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-medium">Total Purchase:</span>
                <span className="font-bold text-slate-800">
                  ৳{totalPurchase.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-medium">Return Amount:</span>
                <span className="text-base font-extrabold text-slate-900">
                  ৳{returnAmount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </span>
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-slate-500 font-medium">
                  Remaining Purchase Amount:
                </span>
                <span className="font-bold text-slate-800">
                  ৳{remainingPurchaseAmount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </span>
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                <span className="text-slate-700 font-semibold">
                  Supplier Adjustment:
                </span>
                <span className="font-bold text-[#16a34a]">
                  ৳{returnAmount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          </div>

          {/* Refund Method Card matching Image 1 */}
          <div className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200/80 shadow-2xs space-y-3">
            <h3 className="text-xs font-bold text-slate-900 tracking-tight">
              Refund Method
            </h3>

            <div className="space-y-2.5">
              <span className="text-[11px] font-medium text-slate-500 block">
                Return Refund Method
              </span>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setRefundMethod("adjust")}
                  className={`h-8 rounded-lg text-xs font-semibold flex items-center justify-center transition-colors cursor-pointer ${
                    refundMethod === "adjust"
                      ? "bg-[#16a34a] text-white shadow-xs font-bold"
                      : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  Adjust Supplier Due
                </button>

                <button
                  type="button"
                  onClick={() => setRefundMethod("cash")}
                  className={`h-8 rounded-lg text-xs font-semibold flex items-center justify-center transition-colors cursor-pointer ${
                    refundMethod === "cash"
                      ? "bg-[#16a34a] text-white shadow-xs font-bold"
                      : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  Cash Refund
                </button>
              </div>

              <div>
                <textarea
                  value={returnNotes}
                  onChange={(e) => setReturnNotes(e.target.value)}
                  placeholder="Add return notes / reason"
                  rows={3}
                  className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white transition-all resize-none mt-1"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons matching Image 1 */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <button
              type="button"
              onClick={() => {
                setItems((prev) => prev.map((i) => ({ ...i, returnQty: 0 })));
              }}
              className="h-10 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-lg shadow-2xs transition-colors cursor-pointer flex items-center justify-center"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleProcessReturn}
              className="h-10 bg-[#16a34a] hover:bg-[#15803d] text-white text-xs font-bold rounded-lg shadow-xs transition-colors cursor-pointer flex items-center justify-center"
            >
              Process Purchase Return
            </button>
          </div>
        </div>
      </div>

      {/* Footer Branding */}
      <div className="flex items-center justify-between text-[11px] text-slate-400 py-1">
        <span>Copyright v2.4.1</span>
        <span>Saturday, Nov 7, 2026</span>
      </div>
    </div>
  );
};

export default PurchaseReturnPage;

