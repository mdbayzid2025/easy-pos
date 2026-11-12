import React, { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  Search,
  Barcode,
  Plus,
  Minus,
  Trash2,
  ChevronDown,
  RotateCcw,
  Banknote,
  CreditCard,
  Smartphone,
} from "lucide-react";
import { type ReturnItem } from "./mockSalesData";

export const SalesReturnPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const queryInvoice = searchParams.get("invoiceNo") || "INV-2026-1107";

  const [searchInvoiceInput, setSearchInvoiceInput] = useState(queryInvoice);
  const [refundPaymentMethod, setRefundPaymentMethod] = useState("Cash");
  const [returnNotes, setReturnNotes] = useState("");

  // Invoice Header Info matching Screenshot 2
  const invoiceInfo = {
    invoiceNo: "INV-2026-1107",
    customer: "Walk-in Customer",
    cashier: "Abir Hasan",
    date: "Nov 7, 2026, 11:55 AM",
    totalAmount: 1275.7,
  };

  // Returned Items Table
  const [returnItems, setReturnItems] = useState<ReturnItem[]>([
    {
      id: "1",
      name: "Rupchanda Soybean Oil 5L",
      soldQty: 1,
      returnQty: 0,
      unitPrice: 890.0,
      refundAmount: 0.0,
      reason: "Reason...",
      image: "🧴",
    },
    {
      id: "2",
      name: "Aarong Liquid Milk 1L",
      soldQty: 2,
      returnQty: 1,
      unitPrice: 90.0,
      refundAmount: 90.0,
      reason: "Customer Return",
      image: "🥛",
    },
    {
      id: "3",
      name: "ACI Pure Salt 1kg",
      soldQty: 3,
      returnQty: 1,
      unitPrice: 38.0,
      refundAmount: 38.0,
      reason: "Customer Return",
      image: "🧂",
    },
    {
      id: "4",
      name: "All Time Family Bread 400g",
      soldQty: 1,
      returnQty: 0,
      unitPrice: 50.0,
      refundAmount: 0.0,
      reason: "Reason...",
      image: "🍞",
    },
  ]);

  const updateReturnQty = (id: string, delta: number) => {
    setReturnItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const newQty = Math.max(0, Math.min(item.soldQty, item.returnQty + delta));
          return {
            ...item,
            returnQty: newQty,
            refundAmount: newQty * item.unitPrice,
          };
        }
        return item;
      })
    );
  };

  const updateReason = (id: string, reason: string) => {
    setReturnItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, reason } : item))
    );
  };

  const removeItem = (id: string) => {
    setReturnItems((prev) => prev.filter((item) => item.id !== id));
  };

  // Calculations
  const returnItemCount = returnItems.reduce((acc, item) => acc + (item.returnQty > 0 ? 1 : 0), 0);
  const totalReturnAmount = returnItems.reduce((acc, item) => acc + item.refundAmount, 0);
  const vatAdjusted = 0.0;
  const refundAmount = totalReturnAmount - vatAdjusted;
  const remainingInvoiceAmount = Math.max(0, invoiceInfo.totalAmount - refundAmount);

  const handleProcessReturn = (e: React.FormEvent) => {
    e.preventDefault();
    if (refundAmount <= 0) {
      alert("Please select at least 1 item to return.");
      return;
    }
    alert(
      `Return processed successfully!\nRefund of ৳${refundAmount.toFixed(2)} issued via ${refundPaymentMethod}.`
    );
    navigate("/sales/history");
  };

  return (
    <div className="w-full min-h-screen bg-[#f8fafc] p-4 sm:p-6 lg:p-8 space-y-5">
      {/* 1. Header with Breadcrumbs & Current Time matching Screenshot 2 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-1 gap-2">
        <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
          <Link to="/" className="hover:text-slate-600 transition-colors">
            Dashboard
          </Link>
          <span>/</span>
          <span className="hover:text-slate-600">POS & Sales</span>
          <span>/</span>
          <span className="text-slate-700 font-semibold">Sales Return</span>
        </div>

        <div className="text-right text-xs text-slate-500 font-medium">
          Saturday, Nov 7, 2026 • 12:01 PM
        </div>
      </div>

      <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Sales Return</h1>

      {/* 2. Invoice Search Bar with Green "Search Invoice" Button */}
      <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-2xs flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <input
            type="text"
            value={searchInvoiceInput}
            onChange={(e) => setSearchInvoiceInput(e.target.value)}
            placeholder="Search Invoice Number..."
            className="w-full h-10 pl-3.5 pr-9 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500"
          />
          <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-3 pointer-events-none" />
        </div>

        <button
          type="button"
          onClick={() => alert(`Fetching invoice ${searchInvoiceInput}...`)}
          className="h-10 px-5 bg-[#166534] hover:bg-[#14532d] text-white rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer w-full sm:w-auto"
        >
          <span>Search Invoice</span>
          <Barcode size={16} />
        </button>
      </div>

      {/* 3. Main 2-Column Return View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: Invoice Information + Returned Items Table (takes 8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          {/* Invoice Information Box */}
          <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-2xs">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2.5 mb-3">
              Invoice Information
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div>
                <span className="text-slate-400 block font-medium">Invoice No:</span>
                <span className="font-bold text-slate-800 font-mono mt-0.5 block">
                  {invoiceInfo.invoiceNo}
                </span>
                <span className="text-[11px] text-slate-500 mt-1 block">
                  Date: {invoiceInfo.date}
                </span>
              </div>

              <div>
                <span className="text-slate-400 block font-medium">Customer:</span>
                <span className="font-bold text-slate-800 mt-0.5 block">
                  {invoiceInfo.customer}
                </span>
              </div>

              <div>
                <span className="text-slate-400 block font-medium">Cashier:</span>
                <span className="font-bold text-slate-800 mt-0.5 block">
                  {invoiceInfo.cashier}
                </span>
              </div>

              <div>
                <span className="text-slate-400 block font-medium">Total Amount</span>
                <span className="font-bold text-slate-900 text-sm mt-0.5 block">
                  ৳{invoiceInfo.totalAmount.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Returned Items Table matching Screenshot 2 */}
          <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-2xs space-y-3">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2.5">
              Returned Items
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="text-slate-400 font-semibold border-b border-slate-100">
                    <th className="pb-3 px-2">Product</th>
                    <th className="pb-3 px-2 text-center">Sold Qty</th>
                    <th className="pb-3 px-2 text-center">Return Qty</th>
                    <th className="pb-3 px-2 text-right">Unit Price</th>
                    <th className="pb-3 px-2 text-right">Refund Amount</th>
                    <th className="pb-3 px-2">Reason</th>
                    <th className="pb-3 px-2 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {returnItems.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                      {/* Product Thumbnail & Name */}
                      <td className="py-3 px-2">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-200/80 flex items-center justify-center text-lg shrink-0">
                            {item.image}
                          </div>
                          <span className="font-semibold text-slate-800 line-clamp-1">
                            {item.name}
                          </span>
                        </div>
                      </td>

                      {/* Sold Qty */}
                      <td className="py-3 px-2 text-center text-slate-600 font-semibold">
                        {item.soldQty}
                      </td>

                      {/* Return Qty with Increment/Decrement */}
                      <td className="py-3 px-2">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => updateReturnQty(item.id, -1)}
                            className="w-6 h-6 rounded-md bg-white border border-slate-200 hover:bg-slate-100 flex items-center justify-center text-slate-600 transition-colors"
                          >
                            <Minus size={11} />
                          </button>
                          <span className="w-6 text-center text-xs font-bold text-slate-800">
                            {item.returnQty}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateReturnQty(item.id, 1)}
                            className="w-6 h-6 rounded-md bg-white border border-slate-200 hover:bg-slate-100 flex items-center justify-center text-slate-600 transition-colors"
                          >
                            <Plus size={11} />
                          </button>
                        </div>
                      </td>

                      {/* Unit Price */}
                      <td className="py-3 px-2 text-right text-slate-700 font-medium">
                        ৳{item.unitPrice.toFixed(2)}
                      </td>

                      {/* Refund Amount */}
                      <td className="py-3 px-2 text-right font-bold text-slate-900">
                        ৳{item.refundAmount.toFixed(2)}
                      </td>

                      {/* Reason Select Dropdown */}
                      <td className="py-3 px-2 min-w-[140px]">
                        <div className="relative">
                          <select
                            value={item.reason}
                            onChange={(e) => updateReason(item.id, e.target.value)}
                            className="w-full h-8 pl-2.5 pr-7 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 appearance-none cursor-pointer focus:outline-none focus:border-emerald-500 font-medium"
                          >
                            <option value="Reason...">Reason...</option>
                            <option value="Damaged">Damaged</option>
                            <option value="Wrong Product">Wrong Product</option>
                            <option value="Customer Return">Customer Return</option>
                            <option value="Expired">Expired</option>
                            <option value="Other">Other</option>
                          </select>
                          <ChevronDown className="w-3 h-3 text-slate-400 absolute right-2 top-2.5 pointer-events-none" />
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-2 text-center">
                        <button
                          type="button"
                          onClick={() => removeItem(item.id)}
                          className="text-slate-400 hover:text-rose-500 p-1 transition-colors"
                          title="Remove item"
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Return Summary & Payment Refund Method (takes 4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          {/* Return Summary Box */}
          <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-2xs space-y-3">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2.5">
              Return Summary
            </h3>

            <div className="space-y-2 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Original Total</span>
                <span className="font-semibold text-slate-800">
                  ৳{invoiceInfo.totalAmount.toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Return Item Count</span>
                <span className="font-semibold text-slate-800">{returnItemCount} Items</span>
              </div>

              <div className="flex justify-between">
                <span>Total Return Amount</span>
                <span className="font-semibold text-slate-800">
                  ৳{totalReturnAmount.toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between">
                <span>VAT/Tax Deducted/Adjusted</span>
                <span className="font-semibold text-slate-500">
                  ৳{vatAdjusted.toFixed(2)}
                </span>
              </div>

              {/* Big Refund Amount Callout */}
              <div className="border-t border-slate-200 pt-2 flex justify-between items-baseline">
                <span className="font-bold text-slate-900 text-sm">Refund Amount</span>
                <span className="text-xl font-extrabold text-[#16a34a]">
                  ৳{refundAmount.toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between text-[11px] pt-1 text-slate-500">
                <span>Remaining Invoice Amount</span>
                <span className="font-semibold text-slate-700">
                  ৳{remainingInvoiceAmount.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Payment Refund Method Box */}
          <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-2xs space-y-3.5">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2.5">
              Payment Refund Method
            </h3>

            <span className="text-xs font-semibold text-slate-600 block">
              Refund Payment Method
            </span>

            {/* 4 Refund Methods Grid matching screenshot */}
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setRefundPaymentMethod("Cash")}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer border ${
                  refundPaymentMethod === "Cash"
                    ? "bg-[#ebfbf3] text-[#16a34a] border-[#bbf7d0]"
                    : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                }`}
              >
                <Banknote size={15} />
                <span>Cash</span>
              </button>

              <button
                type="button"
                onClick={() => setRefundPaymentMethod("Card")}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer border ${
                  refundPaymentMethod === "Card"
                    ? "bg-[#ebfbf3] text-[#16a34a] border-[#bbf7d0]"
                    : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                }`}
              >
                <CreditCard size={15} />
                <span>Card</span>
              </button>

              <button
                type="button"
                onClick={() => setRefundPaymentMethod("bKash")}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer border ${
                  refundPaymentMethod === "bKash"
                    ? "bg-pink-50 text-[#e2136e] border-pink-200"
                    : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                }`}
              >
                <Smartphone size={15} />
                <span>bKash</span>
              </button>

              <button
                type="button"
                onClick={() => setRefundPaymentMethod("Nagad")}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer border ${
                  refundPaymentMethod === "Nagad"
                    ? "bg-orange-50 text-[#f7941d] border-orange-200"
                    : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                }`}
              >
                <Smartphone size={15} />
                <span>Nagad</span>
              </button>
            </div>

            {/* Notes textarea */}
            <div>
              <textarea
                rows={3}
                value={returnNotes}
                onChange={(e) => setReturnNotes(e.target.value)}
                placeholder="Add return notes/comments..."
                className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500 resize-none"
              />
            </div>

            {/* Footer Action Buttons */}
            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => navigate("/sales/history")}
                className="flex-1 py-2.5 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
              >
                Cancel Return
              </button>

              <button
                type="button"
                onClick={handleProcessReturn}
                className="flex-1 py-2.5 bg-[#166534] hover:bg-[#14532d] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer"
              >
                <RotateCcw size={14} />
                <span>Process Return</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesReturnPage;
