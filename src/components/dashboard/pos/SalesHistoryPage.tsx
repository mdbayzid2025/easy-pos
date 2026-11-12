import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Calendar,
  ChevronDown,
  Search,
  Download,
  Eye,
  Printer,
  RotateCcw,
  MoreHorizontal,
} from "lucide-react";
import { mockSalesTransactions, type SaleTransaction } from "./mockSalesData";

export const SalesHistoryPage: React.FC = () => {
  const navigate = useNavigate();
  const [dateRange, setDateRange] = useState("Nov 1, 2026 - Nov 7, 2026");
  const [customerFilter, setCustomerFilter] = useState("All Customers");
  const [cashierFilter, setCashierFilter] = useState("All Cashiers");
  const [paymentFilter, setPaymentFilter] = useState("All Payment Methods");
  const [searchInvoice, setSearchInvoice] = useState("");

  const filtered = mockSalesTransactions.filter((t) => {
    const q = searchInvoice.toLowerCase();
    const matchSearch =
      t.invoiceNo.toLowerCase().includes(q) || t.customer.toLowerCase().includes(q);
    const matchCustomer =
      customerFilter === "All Customers" || t.customer.includes(customerFilter);
    const matchCashier = cashierFilter === "All Cashiers" || t.cashier === cashierFilter;
    const matchPayment =
      paymentFilter === "All Payment Methods" || t.paymentMethod.includes(paymentFilter);
    return matchSearch && matchCustomer && matchCashier && matchPayment;
  });

  const renderStatusBadge = (status: SaleTransaction["status"]) => {
    switch (status) {
      case "Paid":
        return (
          <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#ebfbf3] text-[#16a34a]">
            Paid
          </span>
        );
      case "Partial":
        return (
          <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#fffbeb] text-[#d97706]">
            Partial
          </span>
        );
      case "Due":
        return (
          <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#fef2f2] text-[#dc2626]">
            Due
          </span>
        );
      case "Returned":
        return (
          <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#f1f5f9] text-[#64748b]">
            Returned
          </span>
        );
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#f8fafc] p-4 sm:p-6 lg:p-8 space-y-5">
      {/* 1. Header with Breadcrumbs & Current Time matching Screenshot 3 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-1 gap-2">
        <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
          <Link to="/" className="hover:text-slate-600 transition-colors">
            Dashboard
          </Link>
          <span>/</span>
          <span className="hover:text-slate-600">POS & Sales</span>
          <span>/</span>
          <span className="text-slate-700 font-semibold">Sales History</span>
        </div>

        <div className="text-right text-xs text-slate-500 font-medium">
          Saturday, Nov 7, 2026 • 12:00 PM
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Sales History</h1>

        <button
          type="button"
          onClick={() => alert("Exporting all sales records...")}
          className="h-9.5 px-4 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer self-start sm:self-auto shadow-2xs"
        >
          <Download size={14} />
          <span>Export</span>
        </button>
      </div>

      {/* 2. Filter Bar */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-100 shadow-2xs flex flex-wrap items-end gap-3 justify-between">
        <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[280px]">
          {/* Date Range Picker */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">
              Date Range Picker
            </label>
            <div className="relative">
              <input
                type="text"
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="h-9.5 pl-9 pr-3 text-xs bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:outline-none focus:border-emerald-500"
              />
              <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
            </div>
          </div>

          {/* Customer Filter */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">
              Customer Filter
            </label>
            <div className="relative">
              <select
                value={customerFilter}
                onChange={(e) => setCustomerFilter(e.target.value)}
                className="h-9.5 pl-3.5 pr-8 text-xs bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 appearance-none cursor-pointer focus:outline-none focus:border-emerald-500"
              >
                <option value="All Customers">All Customers</option>
                <option value="Walk-in">Walk-in Customer</option>
                <option value="Tanvir">Tanvir Rahman</option>
                <option value="Sadiya">Sadiya Khan</option>
                <option value="Yusuf">Md. Yusuf</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-3 pointer-events-none" />
            </div>
          </div>

          {/* Cashier Filter */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">
              Cashier Filter
            </label>
            <div className="relative">
              <select
                value={cashierFilter}
                onChange={(e) => setCashierFilter(e.target.value)}
                className="h-9.5 pl-3.5 pr-8 text-xs bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 appearance-none cursor-pointer focus:outline-none focus:border-emerald-500"
              >
                <option value="All Cashiers">All Cashiers</option>
                <option value="Abir Hasan">Abir Hasan</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-3 pointer-events-none" />
            </div>
          </div>

          {/* Payment Method Filter */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">
              Payment Method Filter
            </label>
            <div className="relative">
              <select
                value={paymentFilter}
                onChange={(e) => setPaymentFilter(e.target.value)}
                className="h-9.5 pl-3.5 pr-8 text-xs bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 appearance-none cursor-pointer focus:outline-none focus:border-emerald-500"
              >
                <option value="All Payment Methods">All Payment Methods</option>
                <option value="Cash">Cash</option>
                <option value="Card">Card</option>
                <option value="bKash">bKash</option>
                <option value="Nagad">Nagad</option>
                <option value="Due">Due</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-3 pointer-events-none" />
            </div>
          </div>

          {/* Invoice Search */}
          <div className="flex-1 min-w-[200px]">
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">
              Invoice Search
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search by invoice no..."
                value={searchInvoice}
                onChange={(e) => setSearchInvoice(e.target.value)}
                className="w-full h-9.5 pl-3 pr-9 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500"
              />
              <Search className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* 3. Table View matching Screenshot 3 */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50/75 text-slate-500 font-semibold border-b border-slate-100">
                <th className="py-3 px-3">Invoice No</th>
                <th className="py-3 px-3">Date & Time</th>
                <th className="py-3 px-3">Customer</th>
                <th className="py-3 px-3 text-center">Items</th>
                <th className="py-3 px-3 text-right">Subtotal</th>
                <th className="py-3 px-3 text-right">Discount</th>
                <th className="py-3 px-3 text-right">Grand Total</th>
                <th className="py-3 px-3 text-right">Paid</th>
                <th className="py-3 px-3 text-right">Due</th>
                <th className="py-3 px-3">Payment Method</th>
                <th className="py-3 px-3">Cashier</th>
                <th className="py-3 px-3 text-center">Status</th>
                <th className="py-3 px-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-3 px-3 font-mono font-medium text-slate-800">
                    {t.invoiceNo}
                  </td>
                  <td className="py-3 px-3 text-slate-500">{t.dateTime}</td>
                  <td className="py-3 px-3 font-semibold text-slate-700">{t.customer}</td>
                  <td className="py-3 px-3 text-center text-slate-600 font-medium">
                    {t.itemsCount || 1} Items
                  </td>
                  <td className="py-3 px-3 text-right text-slate-700">
                    ৳{t.subtotal.toFixed(2)}
                  </td>
                  <td className="py-3 px-3 text-right text-slate-500">
                    ৳{t.discount.toFixed(2)}
                  </td>
                  <td className="py-3 px-3 text-right font-bold text-slate-900">
                    ৳{t.grandTotal.toFixed(2)}
                  </td>
                  <td className="py-3 px-3 text-right text-slate-700">
                    ৳{t.paid.toFixed(2)}
                  </td>
                  <td className="py-3 px-3 text-right text-slate-500">
                    ৳{t.due.toFixed(2)}
                  </td>
                  <td className="py-3 px-3 text-slate-600 font-medium">
                    {t.paymentMethod}
                  </td>
                  <td className="py-3 px-3 text-slate-500">{t.cashier}</td>
                  <td className="py-3 px-3 text-center">{renderStatusBadge(t.status)}</td>

                  {/* Actions Column matching screenshot 3 icon group */}
                  <td className="py-3 px-3 text-center">
                    <div className="inline-flex items-center gap-1.5 p-1 bg-slate-50 rounded-lg border border-slate-200/80">
                      <button
                        type="button"
                        onClick={() => navigate("/pos/invoice")}
                        className="flex flex-col items-center px-1.5 py-0.5 hover:text-emerald-700 text-slate-600 cursor-pointer"
                        title="View Details"
                      >
                        <Eye size={12} />
                        <span className="text-[9px]">View</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => navigate("/pos/invoice")}
                        className="flex flex-col items-center px-1.5 py-0.5 hover:text-emerald-700 text-slate-600 cursor-pointer"
                        title="Print Receipt"
                      >
                        <Printer size={12} />
                        <span className="text-[9px]">Print</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => navigate(`/sales/return?invoiceNo=${t.invoiceNo}`)}
                        className="flex flex-col items-center px-1.5 py-0.5 hover:text-amber-700 text-slate-600 cursor-pointer"
                        title="Process Return"
                      >
                        <RotateCcw size={12} />
                        <span className="text-[9px]">Return</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => alert(`Cancel invoice ${t.invoiceNo}?`)}
                        className="flex flex-col items-center px-1.5 py-0.5 hover:text-rose-700 text-slate-600 cursor-pointer"
                        title="Cancel"
                      >
                        <MoreHorizontal size={12} />
                        <span className="text-[9px]">Cancel</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-5 py-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500">
          <div>Showing 1-8 of 145 invoices</div>
          <div className="flex items-center space-x-1 font-medium">
            <button
              disabled
              className="px-3 py-1 border border-slate-200 rounded-lg text-slate-400 disabled:opacity-50 cursor-pointer"
            >
              Previous
            </button>
            <button className="w-7 h-7 rounded-lg bg-emerald-600 text-white font-bold">
              1
            </button>
            <button className="w-7 h-7 rounded-lg hover:bg-slate-100 text-slate-700">
              2
            </button>
            <button className="w-7 h-7 rounded-lg hover:bg-slate-100 text-slate-700">
              3
            </button>
            <span className="px-1 text-slate-400">...</span>
            <button className="w-7 h-7 rounded-lg hover:bg-slate-100 text-slate-700">
              15
            </button>
            <button className="px-3 py-1 border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50 cursor-pointer">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesHistoryPage;
