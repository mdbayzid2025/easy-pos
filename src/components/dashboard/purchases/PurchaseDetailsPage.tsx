import React, { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import {
  Printer,
  Plus,
  RotateCcw,
  Download,
} from "lucide-react";
import { mockPurchases, type PurchaseRecord } from "./mockPurchasesData";

export const PurchaseDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Find purchase by ID or fallback to pur-1 matching Image 2
  const purchase: PurchaseRecord =
    mockPurchases.find((p) => p.id === id) || mockPurchases[0];

  const [isAddPaymentModalOpen, setIsAddPaymentModalOpen] = useState(false);
  const [payAmount, setPayAmount] = useState(purchase.dueAmount);
  const [payMethod, setPayMethod] = useState("Cash");

  const totalQty = purchase.items.reduce((sum, i) => sum + i.purchasedQty, 0);

  return (
    <div className="w-full min-h-screen bg-[#F7F9FB] p-4 sm:p-6 lg:p-7 space-y-5">
      {/* 1. Header & Breadcrumbs & Action Buttons */}
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
              Purchase Details
            </span>
          </div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Purchase Details
            </h1>
            <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#ecfdf5] text-[#059669] border border-[#a7f3d0]">
              Received
            </span>
            <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#fff7ed] text-[#ea580c] border border-[#ffedd5]">
              Partially Paid
            </span>
          </div>
        </div>

        {/* Action Buttons matching Image 2 */}
        <div className="flex flex-col gap-2 self-start md:self-auto">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => window.print()}
              className="h-9 px-3.5 bg-[#16a34a] hover:bg-[#15803d] text-white text-xs font-bold rounded-lg flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
            >
              <Printer size={14} />
              <span>Print Purchase</span>
            </button>

            <button
              type="button"
              onClick={() => setIsAddPaymentModalOpen(true)}
              className="h-9 px-3.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
            >
              <Plus size={14} className="text-slate-500" />
              <span>Add Payment</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() =>
                navigate(`/purchases/return?invoice=${purchase.invoiceNo}`)
              }
              className="h-9 px-3.5 bg-white border border-rose-200 hover:bg-rose-50 text-rose-600 text-xs font-semibold rounded-lg flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
            >
              <RotateCcw size={13} />
              <span>Return Purchase</span>
            </button>

            <button
              type="button"
              onClick={() => window.print()}
              className="h-9 px-3.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
            >
              <Download size={13} className="text-slate-500" />
              <span>Download PDF</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Top Info Cards (Purchase Header & Supplier Info) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column (8 cols): Purchase Header, Supplier Info, and Purchase Items */}
        <div className="lg:col-span-8 space-y-4">
          {/* Purchase Header Card */}
          <div className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200/80 shadow-2xs space-y-2">
            <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block">
              Purchase Header
            </span>
            <h2 className="text-lg font-bold text-slate-900">
              Purchase #{purchase.purchaseNumber}
            </h2>
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 pt-1 border-t border-slate-100">
              <span>Invoice No: <strong className="text-slate-800">{purchase.invoiceNo}</strong></span>
              <span>|</span>
              <span>Date: {purchase.date}, {purchase.time}</span>
              <span>|</span>
              <span>Warehouse: {purchase.warehouse}</span>
              <span>|</span>
              <span>Created By: {purchase.createdBy}</span>
              <span>|</span>
              <span>Payment Status: {purchase.paymentStatus}</span>
            </div>
          </div>

          {/* Supplier Information Card */}
          <div className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200/80 shadow-2xs space-y-1.5">
            <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block">
              Supplier Information
            </span>
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600">
              <strong className="text-slate-800 font-bold">{purchase.supplier.name}</strong>
              <span>|</span>
              <span>{purchase.supplier.phone}</span>
              <span>|</span>
              <span>{purchase.supplier.address}</span>
              <span>|</span>
              <span className="font-semibold text-rose-600">
                Previous Due: ৳{purchase.supplier.previousDue.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </span>
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
                    <th className="py-2.5 px-3">SKU</th>
                    <th className="py-2.5 px-3 text-right">Quantity</th>
                    <th className="py-2.5 px-3 text-right">Unit Price</th>
                    <th className="py-2.5 px-3 text-right">Discount</th>
                    <th className="py-2.5 px-3 text-right">Tax</th>
                    <th className="py-2.5 px-4 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {purchase.items.map((item, index) => {
                    const itemBase = item.purchasedQty * item.purchasePrice;
                    const taxVal = itemBase * (item.taxPercent / 100);
                    const itemTotal = itemBase + taxVal - item.discount;
                    return (
                      <tr
                        key={item.id}
                        className="hover:bg-slate-50/70 transition-colors"
                      >
                        <td className="py-2.5 px-3">
                          <span className="text-slate-500 mr-2">{index + 1}.</span>
                          <span className="font-bold text-slate-800">
                            {item.name}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 font-mono text-[11px] text-slate-600">
                          {item.sku}
                        </td>
                        <td className="py-2.5 px-3 text-right font-bold text-slate-800">
                          {item.purchasedQty} {item.unit}
                        </td>
                        <td className="py-2.5 px-3 text-right text-slate-700">
                          ৳{item.purchasePrice.toFixed(2)}
                        </td>
                        <td className="py-2.5 px-3 text-right text-slate-600">
                          ৳{item.discount.toFixed(2)}
                        </td>
                        <td className="py-2.5 px-3 text-right text-slate-600">
                          {item.taxPercent > 0
                            ? `${item.taxPercent.toFixed(1)}% (৳${taxVal.toFixed(2)})`
                            : "0.0%"}
                        </td>
                        <td className="py-2.5 px-4 text-right font-bold text-slate-900">
                          ৳{itemTotal.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Table Footer */}
            <div className="px-4 py-3 border-t border-slate-100 flex items-center justify-end text-xs text-slate-500 bg-slate-50/50">
              <span className="font-bold text-slate-700">
                {purchase.items.length} Items, {totalQty} total quantity
              </span>
            </div>
          </div>
        </div>

        {/* Right Column (4 cols): Financial Summary */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200/80 shadow-2xs space-y-3.5">
            <h3 className="text-xs font-bold text-slate-900 tracking-tight">
              Financial Summary
            </h3>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-medium">Subtotal</span>
                <span className="font-bold text-slate-800">
                  ৳{purchase.subtotal.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-medium">Invoice Discount</span>
                <span className="text-slate-700">
                  ৳{purchase.invoiceDiscount.toFixed(2)}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-medium">Tax (5%)</span>
                <span className="text-slate-700">
                  ৳{purchase.taxAmount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-medium">Shipping Cost</span>
                <span className="text-slate-700">
                  ৳{purchase.shippingCost.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-medium">Other Cost</span>
                <span className="text-slate-700">
                  ৳{purchase.otherCost.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </span>
              </div>

              <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between">
                <span className="text-slate-800 font-bold">Grand Total</span>
                <span className="text-xl font-extrabold text-slate-900">
                  ৳{purchase.grandTotal.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </span>
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-slate-500 font-medium">Paid Amount</span>
                <span className="font-bold text-emerald-600">
                  ৳{purchase.paidAmount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-medium">Due Amount</span>
                <span className="font-extrabold text-rose-600 text-sm">
                  ৳{purchase.dueAmount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Bottom Payment History Card */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <div className="p-3.5 border-b border-slate-100">
          <h3 className="text-xs font-bold text-slate-900 tracking-tight">
            Payment History
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/75 text-[11px] font-bold text-slate-500">
                <th className="py-2.5 px-4">Date & Time</th>
                <th className="py-2.5 px-4">Payment Method</th>
                <th className="py-2.5 px-4">Amount</th>
                <th className="py-2.5 px-4">Reference / TrxID</th>
                <th className="py-2.5 px-4">Received By</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {purchase.paymentHistory.map((ph) => (
                <tr key={ph.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-4 text-slate-600 font-medium">
                    {ph.dateTime}
                  </td>
                  <td className="py-3 px-4 text-slate-800 font-semibold">
                    {ph.paymentMethod}
                  </td>
                  <td className="py-3 px-4 font-bold text-emerald-600">
                    ৳{ph.amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </td>
                  <td className="py-3 px-4 font-mono text-[11px] text-slate-600">
                    {ph.reference}
                  </td>
                  <td className="py-3 px-4 text-slate-700">
                    {ph.receivedBy}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Payment Modal */}
      {isAddPaymentModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 max-w-md w-full p-5 space-y-4">
            <h3 className="text-sm font-bold text-slate-900">
              Add Payment for Purchase #{purchase.purchaseNumber}
            </h3>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 mb-1 font-medium">Total Due</label>
                <div className="text-sm font-bold text-rose-600">
                  ৳{purchase.dueAmount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </div>
              </div>
              <div>
                <label className="block text-slate-600 mb-1 font-medium">Payment Amount</label>
                <input
                  type="number"
                  value={payAmount}
                  onChange={(e) => setPayAmount(Number(e.target.value) || 0)}
                  className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-emerald-500 font-bold"
                />
              </div>
              <div>
                <label className="block text-slate-600 mb-1 font-medium">Payment Method</label>
                <select
                  value={payMethod}
                  onChange={(e) => setPayMethod(e.target.value)}
                  className="w-full h-9 px-3 bg-white border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:border-emerald-500"
                >
                  <option value="Cash">Cash</option>
                  <option value="Bank Transfer (Bank Asia)">Bank Transfer</option>
                  <option value="bKash">bKash</option>
                  <option value="Card">Card</option>
                </select>
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsAddPaymentModalOpen(false)}
                className="px-3.5 py-1.5 rounded-lg border border-slate-200 text-slate-600 text-xs font-semibold hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  alert("Payment recorded!");
                  setIsAddPaymentModalOpen(false);
                }}
                className="px-3.5 py-1.5 rounded-lg bg-[#16a34a] hover:bg-[#15803d] text-white text-xs font-bold shadow-xs cursor-pointer"
              >
                Submit Payment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer Branding */}
      <div className="text-center text-[11px] text-slate-400 py-1">
        copyright v2.4.1
      </div>
    </div>
  );
};

export default PurchaseDetailsPage;

