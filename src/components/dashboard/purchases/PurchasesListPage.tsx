import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Search,
  Plus,
  Download,
  Calendar,
  Eye,
  Edit2,
  Printer,
  RotateCcw,
  CreditCard,
} from "lucide-react";
import {
  mockPurchases,
  mockPurchasesSummary,
  type PurchaseRecord,
} from "./mockPurchasesData";

export const PurchasesListPage: React.FC = () => {
  const navigate = useNavigate();
  const [purchases] = useState<PurchaseRecord[]>(mockPurchases);

  // Filters
  const [searchInvoice, setSearchInvoice] = useState("");
  const [selectedSupplier, setSelectedSupplier] = useState("All Suppliers");
  const [selectedDateRange, setSelectedDateRange] = useState("All Time");
  const [selectedPaymentStatus, setSelectedPaymentStatus] =
    useState("All Payment Statuses");
  const [selectedPurchaseStatus, setSelectedPurchaseStatus] =
    useState("All Purchase Statuses");
  const [currentPage, setCurrentPage] = useState(1);

  // Payment Modal state for quick payment
  const [activePaymentPurchase, setActivePaymentPurchase] =
    useState<PurchaseRecord | null>(null);
  const [paymentAmount, setPaymentAmount] = useState<number>(0);

  const suppliers = [
    "All Suppliers",
    ...Array.from(new Set(mockPurchases.map((p) => p.supplier.name))),
  ];

  const filteredPurchases = purchases.filter((p) => {
    const matchesSearch =
      p.invoiceNo.toLowerCase().includes(searchInvoice.toLowerCase()) ||
      p.purchaseNumber.toLowerCase().includes(searchInvoice.toLowerCase()) ||
      p.supplier.name.toLowerCase().includes(searchInvoice.toLowerCase());

    const matchesSupplier =
      selectedSupplier === "All Suppliers" ||
      p.supplier.name === selectedSupplier;

    const matchesPaymentStatus =
      selectedPaymentStatus === "All Payment Statuses" ||
      p.paymentStatus === selectedPaymentStatus;

    const matchesPurchaseStatus =
      selectedPurchaseStatus === "All Purchase Statuses" ||
      p.purchaseStatus === selectedPurchaseStatus;

    return (
      matchesSearch &&
      matchesSupplier &&
      matchesPaymentStatus &&
      matchesPurchaseStatus
    );
  });

  const renderPaymentBadge = (status: PurchaseRecord["paymentStatus"]) => {
    switch (status) {
      case "Paid":
        return (
          <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#ebfbf3] text-[#16a34a] border border-[#bbf7d0]">
            Paid
          </span>
        );
      case "Partial":
        return (
          <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#fff7ed] text-[#ea580c] border border-[#ffedd5]">
            Partial
          </span>
        );
      case "Due":
        return (
          <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#fef2f2] text-[#dc2626] border border-[#fecaca]">
            Due
          </span>
        );
    }
  };

  const renderPurchaseStatusBadge = (
    status: PurchaseRecord["purchaseStatus"]
  ) => {
    switch (status) {
      case "Received":
        return (
          <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#ecfdf5] text-[#059669] border border-[#a7f3d0]">
            Received
          </span>
        );
      case "Pending":
        return (
          <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#fffbeb] text-[#d97706] border border-[#fef3c7]">
            Pending
          </span>
        );
      case "Ordered":
        return (
          <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#eff6ff] text-[#2563eb] border border-[#bfdbfe]">
            Ordered
          </span>
        );
    }
  };

  const handleExport = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [
        "Invoice,Date,Supplier,Items,Subtotal,Discount,Grand Total,Paid,Due,Payment Status,Purchase Status",
      ]
        .concat(
          filteredPurchases.map(
            (p) =>
              `"${p.invoiceNo}","${p.date}","${p.supplier.name}",${p.items.length || 1},${p.subtotal},${p.invoiceDiscount},${p.grandTotal},${p.paidAmount},${p.dueAmount},"${p.paymentStatus}","${p.purchaseStatus}"`
          )
        )
        .join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `purchases_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full min-h-screen bg-[#F7F9FB] p-4 sm:p-6 lg:p-7 space-y-5">
      {/* 1. Header & Breadcrumbs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium mb-1">
            <Link to="/" className="hover:text-slate-600 transition-colors">
              Dashboard
            </Link>
            <span>/</span>
            <span className="text-slate-400">Purchases</span>
            <span>/</span>
            <span className="text-slate-600 font-semibold">All Purchases</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Purchases
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/purchases/new")}
            className="h-9.5 px-4 bg-[#16a34a] hover:bg-[#15803d] text-white text-xs font-bold rounded-lg flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
          >
            <Plus size={15} />
            <span>Add Purchase</span>
          </button>
        </div>
      </div>

      {/* 2. Top 5 Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5">
        {/* Total Purchases */}
        <div className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-2xs">
          <p className="text-[11px] font-medium text-slate-500 mb-1">
            Total Purchases
          </p>
          <p className="text-xl font-bold text-slate-900">
            {mockPurchasesSummary.totalPurchases}
          </p>
          <p className="text-[10px] text-slate-400 mt-1 line-clamp-1">
            Total count of all historical acquisitions
          </p>
        </div>

        {/* Today's Purchases */}
        <div className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-2xs">
          <p className="text-[11px] font-medium text-slate-500 mb-1">
            Today's Purchases
          </p>
          <p className="text-xl font-bold text-slate-900">
            {mockPurchasesSummary.todayPurchases}
          </p>
          <p className="text-[10px] text-slate-400 mt-1 line-clamp-1">
            Shows new intake (matching PIN-2026-8942)
          </p>
        </div>

        {/* Purchase Due */}
        <div className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-2xs">
          <p className="text-[11px] font-medium text-slate-500 mb-1">
            Purchase Due
          </p>
          <p className="text-xl font-bold text-slate-900 text-rose-600">
            {mockPurchasesSummary.purchaseDue}
          </p>
          <p className="text-[10px] text-slate-400 mt-1 line-clamp-1">
            Total pending liabilities
          </p>
        </div>

        {/* Paid Purchases */}
        <div className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-2xs">
          <p className="text-[11px] font-medium text-slate-500 mb-1">
            Paid Purchases
          </p>
          <p className="text-xl font-bold text-slate-900">
            {mockPurchasesSummary.paidPurchases}
          </p>
          <p className="text-[10px] text-slate-400 mt-1 line-clamp-1">
            Total cleared invoices
          </p>
        </div>

        {/* Purchase Returns */}
        <div className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-2xs col-span-2 md:col-span-1">
          <p className="text-[11px] font-medium text-slate-500 mb-1">
            Purchase Returns
          </p>
          <p className="text-xl font-bold text-slate-900">
            {mockPurchasesSummary.purchaseReturns}
          </p>
          <p className="text-[10px] text-slate-400 mt-1 line-clamp-1">
            Muted return values
          </p>
        </div>
      </div>

      {/* 3. Filters & Search Bar Card */}
      <div className="bg-white rounded-xl p-3.5 border border-slate-200/80 shadow-2xs flex flex-wrap items-center gap-3">
        {/* Search Input */}
        <div className="flex-1 min-w-[220px]">
          <div className="relative">
            <input
              type="text"
              value={searchInvoice}
              onChange={(e) => setSearchInvoice(e.target.value)}
              placeholder="Search by invoice no..."
              className="w-full h-9.5 pl-3.5 pr-9 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white transition-all"
            />
            <Search className="w-4 h-4 text-slate-400 absolute right-3 top-2.5 pointer-events-none" />
          </div>
        </div>

        {/* Supplier Dropdown */}
        <div className="min-w-[150px]">
          <select
            value={selectedSupplier}
            onChange={(e) => setSelectedSupplier(e.target.value)}
            className="w-full h-9.5 px-3 text-xs bg-white border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:border-emerald-500 transition-colors cursor-pointer"
          >
            {suppliers.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        {/* Date Range Dropdown */}
        <div className="min-w-[130px] relative">
          <select
            value={selectedDateRange}
            onChange={(e) => setSelectedDateRange(e.target.value)}
            className="w-full h-9.5 pl-8 pr-3 text-xs bg-white border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:border-emerald-500 transition-colors cursor-pointer"
          >
            <option value="All Time">All Time</option>
            <option value="Today">Today</option>
            <option value="This Week">This Week</option>
            <option value="This Month">This Month</option>
          </select>
          <Calendar
            size={13}
            className="text-slate-400 absolute left-2.5 top-3 pointer-events-none"
          />
        </div>

        {/* Payment Status Dropdown */}
        <div className="min-w-[140px]">
          <select
            value={selectedPaymentStatus}
            onChange={(e) => setSelectedPaymentStatus(e.target.value)}
            className="w-full h-9.5 px-3 text-xs bg-white border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:border-emerald-500 transition-colors cursor-pointer"
          >
            <option value="All Payment Statuses">All Payment Statuses</option>
            <option value="Paid">Paid</option>
            <option value="Partial">Partial</option>
            <option value="Due">Due</option>
          </select>
        </div>

        {/* Purchase Status Dropdown */}
        <div className="min-w-[140px]">
          <select
            value={selectedPurchaseStatus}
            onChange={(e) => setSelectedPurchaseStatus(e.target.value)}
            className="w-full h-9.5 px-3 text-xs bg-white border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:border-emerald-500 transition-colors cursor-pointer"
          >
            <option value="All Purchase Statuses">All Purchase Statuses</option>
            <option value="Received">Received</option>
            <option value="Pending">Pending</option>
            <option value="Ordered">Ordered</option>
          </select>
        </div>

        {/* Export Button */}
        <button
          onClick={handleExport}
          className="h-9.5 px-3.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs ml-auto"
        >
          <Download size={14} className="text-slate-500" />
          <span>Export</span>
        </button>
      </div>

      {/* 4. Purchases Table Card */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/75 text-[11px] font-bold text-slate-500 tracking-wider">
                <th className="py-3 px-3">Purchase Invoice</th>
                <th className="py-3 px-3">Date</th>
                <th className="py-3 px-3">Supplier</th>
                <th className="py-3 px-2 text-center">Items</th>
                <th className="py-3 px-3 text-right">Subtotal</th>
                <th className="py-3 px-3 text-right">Discount</th>
                <th className="py-3 px-3 text-right">Grand Total</th>
                <th className="py-3 px-3 text-right">Paid</th>
                <th className="py-3 px-3 text-right">Due</th>
                <th className="py-3 px-3 text-center">Payment Status</th>
                <th className="py-3 px-3 text-center">Status</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPurchases.length === 0 ? (
                <tr>
                  <td colSpan={12} className="py-8 text-center text-slate-400">
                    No purchases found matching the criteria.
                  </td>
                </tr>
              ) : (
                filteredPurchases.map((p) => {
                  const itemCount =
                    p.items.length > 0 ? `${p.items.length} Items` : "1 Item";
                  return (
                    <tr
                      key={p.id}
                      className="hover:bg-slate-50/70 transition-colors"
                    >
                      {/* Invoice */}
                      <td className="py-3 px-3">
                        <Link
                          to={`/purchases/details/${p.id}`}
                          className="font-bold text-slate-800 hover:text-emerald-600 transition-colors font-mono text-[11px]"
                        >
                          {p.invoiceNo}
                        </Link>
                      </td>

                      {/* Date */}
                      <td className="py-3 px-3 text-slate-600 whitespace-nowrap">
                        {p.date}
                      </td>

                      {/* Supplier */}
                      <td className="py-3 px-3 font-semibold text-slate-800 line-clamp-1 max-w-[160px]">
                        {p.supplier.name}
                      </td>

                      {/* Items */}
                      <td className="py-3 px-2 text-center text-slate-600">
                        {itemCount}
                      </td>

                      {/* Subtotal */}
                      <td className="py-3 px-3 text-right font-medium text-slate-700">
                        ৳{p.subtotal.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                      </td>

                      {/* Discount */}
                      <td className="py-3 px-3 text-right text-slate-600">
                        ৳{p.invoiceDiscount.toFixed(2)}
                      </td>

                      {/* Grand Total */}
                      <td className="py-3 px-3 text-right font-bold text-slate-900">
                        ৳{p.grandTotal.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                      </td>

                      {/* Paid */}
                      <td className="py-3 px-3 text-right font-semibold text-emerald-600">
                        ৳{p.paidAmount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                      </td>

                      {/* Due */}
                      <td className="py-3 px-3 text-right font-semibold text-rose-600">
                        ৳{p.dueAmount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                      </td>

                      {/* Payment Status */}
                      <td className="py-3 px-3 text-center">
                        {renderPaymentBadge(p.paymentStatus)}
                      </td>

                      {/* Status */}
                      <td className="py-3 px-3 text-center">
                        {renderPurchaseStatusBadge(p.purchaseStatus)}
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          {/* View */}
                          <button
                            type="button"
                            onClick={() =>
                              navigate(`/purchases/details/${p.id}`)
                            }
                            className="p-1 text-slate-400 hover:text-emerald-600 transition-colors cursor-pointer"
                            title="View Purchase Details"
                          >
                            <Eye size={13} />
                          </button>

                          {/* Edit */}
                          <button
                            type="button"
                            onClick={() =>
                              navigate(`/purchases/new?editId=${p.id}`)
                            }
                            className="p-1 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                            title="Edit Purchase"
                          >
                            <Edit2 size={13} />
                          </button>

                          {/* Print */}
                          <button
                            type="button"
                            onClick={() => window.print()}
                            className="p-1 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                            title="Print Invoice"
                          >
                            <Printer size={13} />
                          </button>

                          {/* Return */}
                          <button
                            type="button"
                            onClick={() =>
                              navigate(
                                `/purchases/return?invoice=${p.invoiceNo}`
                              )
                            }
                            className="p-1 text-slate-400 hover:text-amber-600 transition-colors cursor-pointer"
                            title="Purchase Return"
                          >
                            <RotateCcw size={13} />
                          </button>

                          {/* Payment */}
                          <button
                            type="button"
                            onClick={() => {
                              setActivePaymentPurchase(p);
                              setPaymentAmount(p.dueAmount);
                            }}
                            className="p-1 text-slate-400 hover:text-emerald-600 transition-colors cursor-pointer"
                            title="Record Payment"
                          >
                            <CreditCard size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination matching Image 4 */}
        <div className="px-4 py-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <p>
            Showing{" "}
            <span className="font-semibold text-slate-800">
              1-8
            </span>{" "}
            of <span className="font-semibold text-slate-800">145</span> purchases
          </p>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="px-2.5 py-1 rounded border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 cursor-pointer"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage(1)}
              className={`w-7 h-7 rounded flex items-center justify-center font-bold text-xs cursor-pointer ${
                currentPage === 1
                  ? "bg-[#162220] text-white"
                  : "border border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              1
            </button>
            <button
              onClick={() => setCurrentPage(2)}
              className={`w-7 h-7 rounded flex items-center justify-center font-bold text-xs cursor-pointer ${
                currentPage === 2
                  ? "bg-[#162220] text-white"
                  : "border border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              2
            </button>
            <button
              onClick={() => setCurrentPage(3)}
              className={`w-7 h-7 rounded flex items-center justify-center font-bold text-xs cursor-pointer ${
                currentPage === 3
                  ? "bg-[#162220] text-white"
                  : "border border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              3
            </button>
            <span className="px-1 text-slate-400">...</span>
            <button
              onClick={() => setCurrentPage(19)}
              className={`w-7 h-7 rounded flex items-center justify-center font-bold text-xs cursor-pointer ${
                currentPage === 19
                  ? "bg-[#162220] text-white"
                  : "border border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              19
            </button>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(19, prev + 1))}
              className="px-2.5 py-1 rounded border border-slate-200 text-slate-600 hover:bg-slate-50 cursor-pointer"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Payment Quick Modal */}
      {activePaymentPurchase && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 max-w-md w-full p-5 space-y-4">
            <h3 className="text-sm font-bold text-slate-900">
              Record Supplier Payment
            </h3>
            <p className="text-xs text-slate-500">
              Invoice: <span className="font-mono font-bold text-slate-800">{activePaymentPurchase.invoiceNo}</span> (Supplier: {activePaymentPurchase.supplier.name})
            </p>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 mb-1 font-medium">Total Due</label>
                <div className="text-sm font-bold text-rose-600">
                  ৳{activePaymentPurchase.dueAmount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </div>
              </div>
              <div>
                <label className="block text-slate-600 mb-1 font-medium">Paying Amount</label>
                <input
                  type="number"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(Number(e.target.value) || 0)}
                  className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-emerald-500 font-bold"
                />
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setActivePaymentPurchase(null)}
                className="px-3.5 py-1.5 rounded-lg border border-slate-200 text-slate-600 text-xs font-semibold hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  alert("Payment recorded successfully!");
                  setActivePaymentPurchase(null);
                }}
                className="px-3.5 py-1.5 rounded-lg bg-[#16a34a] hover:bg-[#15803d] text-white text-xs font-bold shadow-xs cursor-pointer"
              >
                Confirm Payment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PurchasesListPage;
