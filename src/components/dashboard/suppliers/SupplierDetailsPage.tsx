import React, { useState } from "react";
import { Link, useParams, useNavigate, useSearchParams } from "react-router-dom";
import {
  Edit2,
  Plus,
  Printer,
} from "lucide-react";
import {
  mockSuppliersList,
  mockSupplierPurchases,
  mockRecentPaymentHistory,
  type Supplier,
} from "./mockSuppliersData";
import { RecordSupplierPaymentModal } from "./RecordSupplierPaymentModal";

export const SupplierDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Find supplier or fallback to Mizanur Rahman matching Image 4
  const supplier: Supplier =
    mockSuppliersList.find((s) => s.id === id) || mockSuppliersList[0];

  const initialTab = searchParams.get("tab") || "purchases";
  const [activeTab, setActiveTab] = useState<
    "overview" | "purchases" | "payments" | "ledger"
  >(
    initialTab === "ledger"
      ? "ledger"
      : initialTab === "payments"
      ? "payments"
      : "purchases"
  );

  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const renderStatusBadge = (status: string) => {
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
      default:
        return null;
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#F7F9FB] p-4 sm:p-6 lg:p-7 space-y-5">
      {/* 1. Header & Breadcrumbs & Action Buttons */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium mb-1">
            <Link to="/" className="hover:text-slate-600 transition-colors">
              Dashboard
            </Link>
            <span>/</span>
            <Link
              to="/suppliers"
              className="text-slate-400 hover:text-slate-600 transition-colors"
            >
              Suppliers
            </Link>
            <span>/</span>
            <span className="text-slate-600 font-semibold">
              Supplier Details
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Supplier Details
          </h1>
        </div>

        {/* Top Right Action Buttons matching Image 4 */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => navigate(`/suppliers/new?editId=${supplier.id}`)}
            className="h-9 px-3.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
          >
            <Edit2 size={13} className="text-slate-500" />
            <span>Edit Supplier</span>
          </button>

          <button
            type="button"
            onClick={() => setIsPaymentModalOpen(true)}
            className="h-9 px-3.5 bg-white border border-slate-200 hover:bg-slate-50 text-emerald-700 text-xs font-bold rounded-lg flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
          >
            <Plus size={14} className="text-emerald-600" />
            <span>Add Payment</span>
          </button>

          <button
            type="button"
            onClick={() => navigate("/purchases/new")}
            className="h-9 px-3.5 bg-[#16a34a] hover:bg-[#15803d] text-white text-xs font-bold rounded-lg flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
          >
            <Plus size={14} />
            <span>Create Purchase</span>
          </button>

          <button
            type="button"
            onClick={() => window.print()}
            className="h-9 px-3.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
          >
            <Printer size={13} className="text-slate-500" />
            <span>Print Statement</span>
          </button>
        </div>
      </div>

      {/* 2. Supplier Profile Card matching Image 4 */}
      <div className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200/80 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left: Avatar & Name */}
        <div className="flex items-center gap-3.5">
          <div className="w-13 h-13 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center text-slate-600 font-bold text-lg shrink-0 shadow-2xs">
            <img
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150"
              alt={supplier.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              {supplier.name}
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Company: {supplier.company}
            </p>
          </div>
        </div>

        {/* Center: Contacts */}
        <div className="text-xs text-slate-600 space-y-0.5">
          <p className="font-semibold text-slate-400 text-[11px]">Contacts</p>
          <p>
            Phone: <strong className="text-slate-800">{supplier.phone}</strong>
          </p>
          <p>
            Email: <span className="text-slate-700">{supplier.email}</span>
          </p>
        </div>

        {/* Address */}
        <div className="text-xs text-slate-600 space-y-0.5 max-w-xs">
          <p className="font-semibold text-slate-400 text-[11px]">Address</p>
          <p className="text-slate-700 line-clamp-2">{supplier.address}</p>
        </div>

        {/* Status Badge */}
        <div className="self-start md:self-center">
          <span className="text-[11px] text-slate-400 block mb-0.5">Status</span>
          <span className="inline-block px-3 py-0.5 rounded-full text-xs font-semibold bg-[#ebfbf3] text-[#16a34a] border border-[#bbf7d0]">
            {supplier.status}
          </span>
        </div>
      </div>

      {/* 3. Four Metric Cards Row matching Image 4 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        {/* Total Purchase */}
        <div className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-2xs">
          <p className="text-[11px] font-medium text-slate-500 mb-1">
            Total Purchase
          </p>
          <p className="text-xl font-bold text-slate-900">
            ৳{supplier.totalPurchase.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </p>
        </div>

        {/* Total Paid */}
        <div className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-2xs">
          <p className="text-[11px] font-medium text-slate-500 mb-1">
            Total Paid
          </p>
          <p className="text-xl font-bold text-slate-900">
            ৳{supplier.paid.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </p>
        </div>

        {/* Current Due (Highlighted with Pink/Red border matching Image 4) */}
        <div className="bg-[#fffbfb] rounded-xl p-4 border border-rose-200 shadow-2xs">
          <p className="text-[11px] font-medium text-rose-500 mb-1">
            Current Due
          </p>
          <p className="text-xl font-extrabold text-rose-600">
            ৳{supplier.due.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </p>
        </div>

        {/* Total Returns */}
        <div className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-2xs">
          <p className="text-[11px] font-medium text-slate-500 mb-1">
            Total Returns
          </p>
          <p className="text-xl font-bold text-slate-900">
            ৳{(supplier.totalReturns || 4225.0).toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </p>
        </div>
      </div>

      {/* 4. Tabbed Content Card matching Image 4 */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-2xs overflow-hidden">
        {/* Tabs Bar */}
        <div className="px-5 border-b border-slate-100 flex items-center gap-6 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab("overview")}
            className={`py-3.5 border-b-2 transition-colors cursor-pointer ${
              activeTab === "overview"
                ? "border-[#16a34a] text-[#16a34a] font-bold"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            Overview
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("purchases")}
            className={`py-3.5 border-b-2 transition-colors cursor-pointer ${
              activeTab === "purchases"
                ? "border-[#16a34a] text-[#16a34a] font-bold"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            Purchase History
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("payments")}
            className={`py-3.5 border-b-2 transition-colors cursor-pointer ${
              activeTab === "payments"
                ? "border-[#16a34a] text-[#16a34a] font-bold"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            Payment History
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("ledger")}
            className={`py-3.5 border-b-2 transition-colors cursor-pointer ${
              activeTab === "ledger"
                ? "border-[#16a34a] text-[#16a34a] font-bold"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            Supplier Ledger
          </button>
        </div>

        {/* Tab 1: Purchase History Tab matching Image 4 */}
        {activeTab === "purchases" && (
          <div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/75 text-[11px] font-bold text-slate-500 tracking-wider">
                    <th className="py-3 px-4">Invoice</th>
                    <th className="py-3 px-3">Date</th>
                    <th className="py-3 px-3 text-center">Items</th>
                    <th className="py-3 px-3 text-right">Total</th>
                    <th className="py-3 px-3 text-right">Paid</th>
                    <th className="py-3 px-3 text-right">Due</th>
                    <th className="py-3 px-3 text-center">Status</th>
                    <th className="py-3 px-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {mockSupplierPurchases.map((inv) => (
                    <tr
                      key={inv.id}
                      className="hover:bg-slate-50/70 transition-colors"
                    >
                      <td className="py-3 px-4">
                        <Link
                          to="/purchases/details/pur-1"
                          className="font-mono text-[11px] font-bold text-slate-800 hover:text-emerald-600 transition-colors"
                        >
                          {inv.invoiceNo}
                        </Link>
                      </td>
                      <td className="py-3 px-3 text-slate-600 whitespace-nowrap">
                        {inv.date}
                      </td>
                      <td className="py-3 px-3 text-center text-slate-600">
                        {inv.itemsCount} Items
                      </td>
                      <td className="py-3 px-3 text-right font-medium text-slate-800">
                        ৳{inv.total.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-3 px-3 text-right font-semibold text-emerald-600">
                        ৳{inv.paid.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-3 px-3 text-right font-semibold text-rose-600">
                        ৳{inv.due.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-3 px-3 text-center">
                        {renderStatusBadge(inv.status)}
                      </td>
                      <td className="py-3 px-4 text-center whitespace-nowrap text-[11px] font-medium text-slate-500">
                        <div className="flex items-center justify-center gap-2">
                          <Link
                            to="/purchases/details/pur-1"
                            className="hover:text-emerald-600 transition-colors"
                          >
                            View
                          </Link>
                          <span>|</span>
                          <button
                            type="button"
                            onClick={() => window.print()}
                            className="hover:text-slate-800 transition-colors cursor-pointer"
                          >
                            Print
                          </button>
                          <span>|</span>
                          <button
                            type="button"
                            onClick={() => setIsPaymentModalOpen(true)}
                            className="hover:text-emerald-600 transition-colors cursor-pointer font-semibold"
                          >
                            Pay
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination matching Image 4 */}
            <div className="px-4 py-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
              <p>Showing 1-8 of 24 purchase invoices</p>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
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
                <button
                  onClick={() => setCurrentPage((p) => Math.min(3, p + 1))}
                  className="px-2.5 py-1 rounded border border-slate-200 text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Overview Tab */}
        {activeTab === "overview" && (
          <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
            <div className="space-y-3 p-4 bg-slate-50 rounded-xl border border-slate-200/80">
              <h3 className="font-bold text-slate-800 text-sm">Business Terms</h3>
              <div className="space-y-2 text-slate-600">
                <div className="flex justify-between">
                  <span>Supplier Type:</span>
                  <span className="font-semibold text-slate-800">{supplier.supplierType}</span>
                </div>
                <div className="flex justify-between">
                  <span>Payment Terms:</span>
                  <span className="font-semibold text-slate-800">{supplier.paymentTerms}</span>
                </div>
                <div className="flex justify-between">
                  <span>Preferred Method:</span>
                  <span className="font-semibold text-slate-800">{supplier.preferredPaymentMethod}</span>
                </div>
                <div className="flex justify-between">
                  <span>Credit Limit:</span>
                  <span className="font-semibold text-slate-800">৳{supplier.creditLimit?.toLocaleString("en-US")}</span>
                </div>
              </div>
            </div>

            <div className="space-y-3 p-4 bg-slate-50 rounded-xl border border-slate-200/80">
              <h3 className="font-bold text-slate-800 text-sm">Notes & Schedules</h3>
              <p className="text-slate-600 leading-relaxed">
                {supplier.notes || "No special notes recorded for this supplier."}
              </p>
            </div>
          </div>
        )}

        {/* Tab 3: Payment History Tab */}
        {activeTab === "payments" && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50 text-[11px] font-bold text-slate-500">
                  <th className="py-2.5 px-4">Date</th>
                  <th className="py-2.5 px-3">Method</th>
                  <th className="py-2.5 px-3 text-right">Amount Paid</th>
                  <th className="py-2.5 px-3 text-right">Balance Due</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {mockRecentPaymentHistory.map((h) => (
                  <tr key={h.id} className="hover:bg-slate-50/70">
                    <td className="py-3 px-4 font-medium text-slate-700">{h.date}</td>
                    <td className="py-3 px-3 font-semibold text-slate-800">{h.refMethod}</td>
                    <td className="py-3 px-3 text-right font-bold text-emerald-600">
                      ৳{h.amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-3 px-3 text-right font-semibold text-slate-700">
                      ৳{h.balance.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 4: Supplier Ledger Tab */}
        {activeTab === "ledger" && (
          <div className="p-5 space-y-3 text-xs">
            <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-lg border border-emerald-200 text-emerald-900 font-semibold">
              <span>Account Ledger for {supplier.company}</span>
              <button
                type="button"
                onClick={() => window.print()}
                className="text-xs bg-white border border-emerald-300 px-3 py-1 rounded shadow-2xs hover:bg-emerald-100"
              >
                Print Ledger
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50 text-[11px] font-bold text-slate-500">
                    <th className="py-2.5 px-3">Date</th>
                    <th className="py-2.5 px-3">Description</th>
                    <th className="py-2.5 px-3 text-right">Debit (Purchase)</th>
                    <th className="py-2.5 px-3 text-right">Credit (Payment)</th>
                    <th className="py-2.5 px-3 text-right">Balance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr className="hover:bg-slate-50/50">
                    <td className="py-2.5 px-3">Nov 7, 2026</td>
                    <td className="py-2.5 px-3">Invoice PIN-2026-8942</td>
                    <td className="py-2.5 px-3 text-right font-semibold text-slate-800">৳69,678.90</td>
                    <td className="py-2.5 px-3 text-right text-slate-400">--</td>
                    <td className="py-2.5 px-3 text-right font-bold text-rose-600">৳85,500.00</td>
                  </tr>
                  <tr className="hover:bg-slate-50/50">
                    <td className="py-2.5 px-3">Nov 7, 2026</td>
                    <td className="py-2.5 px-3">Payment - Bank Transfer</td>
                    <td className="py-2.5 px-3 text-right text-slate-400">--</td>
                    <td className="py-2.5 px-3 text-right font-semibold text-emerald-600">৳50,000.00</td>
                    <td className="py-2.5 px-3 text-right font-bold text-rose-600">৳35,500.00</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Record Payment Modal */}
      <RecordSupplierPaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        supplier={supplier}
        onPaymentSuccess={() => {
          alert("Payment recorded successfully!");
        }}
      />

      {/* Footer Branding */}
      <div className="text-center text-[11px] text-slate-400 py-1">
        v2.4.1
      </div>
    </div>
  );
};

export default SupplierDetailsPage;
