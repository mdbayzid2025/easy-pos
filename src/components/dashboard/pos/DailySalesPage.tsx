import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Calendar,
  ChevronDown,
  Search,
  Download,
} from "lucide-react";
import {
  Area,
  ResponsiveContainer,
  Bar,
  ComposedChart,
  XAxis,
  Tooltip,
} from "recharts";
import { mockSalesTransactions, type SaleTransaction } from "./mockSalesData";

export const DailySalesPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState("Nov 7, 2026");
  const [cashierFilter, setCashierFilter] = useState("All Cashiers");
  const [paymentFilter, setPaymentFilter] = useState("All Payment Methods");
  const [searchInvoice, setSearchInvoice] = useState("");

  const transactions = mockSalesTransactions.slice(0, 8);

  const salesTrendData = [
    { time: "9 AM", val: 5000 },
    { time: "10 AM", val: 12000 },
    { time: "1 PM", val: 32000 },
    { time: "12 PM", val: 45000 },
    { time: "1 PM", val: 78000 },
    { time: "2 PM", val: 65000 },
    { time: "3 PM", val: 84250, isPeak: true },
    { time: "4 PM", val: 72000 },
    { time: "5 PM", val: 60000 },
    { time: "8 PM", val: 45000 },
    { time: "9 PM", val: 25000 },
  ];

  const filtered = transactions.filter((t) => {
    const q = searchInvoice.toLowerCase();
    const matchSearch =
      t.invoiceNo.toLowerCase().includes(q) || t.customer.toLowerCase().includes(q);
    const matchCashier = cashierFilter === "All Cashiers" || t.cashier === cashierFilter;
    const matchPayment =
      paymentFilter === "All Payment Methods" || t.paymentMethod.includes(paymentFilter);
    return matchSearch && matchCashier && matchPayment;
  });

  const renderStatusBadge = (status: SaleTransaction["status"]) => {
    switch (status) {
      case "Paid":
        return (
          <span className="inline-block px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-[#ebfbf3] text-[#16a34a]">
            Paid
          </span>
        );
      case "Partial":
        return (
          <span className="inline-block px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-[#fffbeb] text-[#d97706]">
            Partial
          </span>
        );
      case "Due":
        return (
          <span className="inline-block px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-[#fef2f2] text-[#dc2626]">
            Due
          </span>
        );
      case "Returned":
        return (
          <span className="inline-block px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-[#f1f5f9] text-[#64748b]">
            Returned
          </span>
        );
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#f8fafc] p-4 sm:p-6 lg:p-8 space-y-5">
      {/* 1. Breadcrumbs & Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-1 gap-2">
        <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
          <Link to="/" className="hover:text-slate-600 transition-colors">
            Dashboard
          </Link>
          <span>/</span>
          <span className="hover:text-slate-600">Reports</span>
          <span>/</span>
          <span className="text-slate-700 font-semibold">Daily Sales</span>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <span className="px-3 py-1 bg-[#1a2b28] text-emerald-400 font-bold rounded-lg border border-[#273d39]">
            Pratidin Bazar
          </span>
          <span className="text-slate-600 font-medium">Cashier: Abir Hasan</span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Daily Sales</h1>
        <div className="text-xs font-semibold text-slate-500">{selectedDate}</div>
      </div>

      {/* 2. Top Filter Controls Row */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-100 shadow-2xs flex flex-wrap items-end gap-3 justify-between">
        <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[280px]">
          {/* Date Picker */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">
              Date Picker
            </label>
            <div className="relative">
              <input
                type="text"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="h-9.5 pl-9 pr-3 text-xs bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:outline-none focus:border-emerald-500"
              />
              <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
            </div>
          </div>

          {/* Cashier */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">
              Cashier
            </label>
            <div className="relative">
              <select
                value={cashierFilter}
                onChange={(e) => setCashierFilter(e.target.value)}
                className="h-9.5 pl-3.5 pr-8 text-xs bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 appearance-none cursor-pointer focus:outline-none focus:border-emerald-500"
              >
                <option value="All Cashiers">All Cashiers</option>
                <option value="Abir Hasan">Abir Hasan</option>
                <option value="Karim Uddin">Karim Uddin</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-3 pointer-events-none" />
            </div>
          </div>

          {/* Payment Method */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">
              Payment Method
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
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-3 pointer-events-none" />
            </div>
          </div>

          {/* Search Invoice */}
          <div className="flex-1 min-w-[200px]">
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">
              Search Invoice
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Invoice No, Customer..."
                value={searchInvoice}
                onChange={(e) => setSearchInvoice(e.target.value)}
                className="w-full h-9.5 pl-3 pr-9 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500"
              />
              <Search className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Export Button */}
        <div>
          <button
            type="button"
            onClick={() => alert("Exporting Daily Sales report as CSV/Excel...")}
            className="h-9.5 px-4 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Download size={14} />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* 3. Stats Grid & Mini Trend Chart matching Screenshot 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Stat Cards (8 cards in 4x2 grid) */}
        <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-3">
          {/* Total Sales */}
          <div className="bg-white rounded-xl p-3.5 border border-slate-100 shadow-2xs">
            <span className="text-[11px] font-medium text-slate-500">Total Sales</span>
            <div className="text-lg font-bold text-slate-900 mt-1">৳84,250.00</div>
          </div>

          {/* Total Orders */}
          <div className="bg-white rounded-xl p-3.5 border border-slate-100 shadow-2xs">
            <span className="text-[11px] font-medium text-slate-500">Total Orders</span>
            <div className="text-lg font-bold text-slate-900 mt-1">312</div>
          </div>

          {/* Cash Sales */}
          <div className="bg-white rounded-xl p-3.5 border border-slate-100 shadow-2xs">
            <span className="text-[11px] font-medium text-slate-500">Cash Sales</span>
            <div className="text-lg font-bold text-slate-900 mt-1">৳52,235.00</div>
          </div>

          {/* Card Sales */}
          <div className="bg-white rounded-xl p-3.5 border border-slate-100 shadow-2xs">
            <span className="text-[11px] font-medium text-slate-500">Card Sales</span>
            <div className="text-lg font-bold text-slate-900 mt-1">৳15,165.00</div>
          </div>

          {/* bKash Sales */}
          <div className="bg-white rounded-xl p-3.5 border border-slate-100 shadow-2xs">
            <span className="text-[11px] font-medium text-slate-500">bKash Sales</span>
            <div className="text-lg font-bold text-slate-900 mt-1">৳12,637.50</div>
          </div>

          {/* Nagad Sales */}
          <div className="bg-white rounded-xl p-3.5 border border-slate-100 shadow-2xs">
            <span className="text-[11px] font-medium text-slate-500">Nagad Sales</span>
            <div className="text-lg font-bold text-slate-900 mt-1">৳4,212.50</div>
          </div>

          {/* Due Sales */}
          <div className="bg-white rounded-xl p-3.5 border border-slate-100 shadow-2xs">
            <span className="text-[11px] font-medium text-slate-500">Due Sales</span>
            <div className="text-lg font-bold text-slate-900 mt-1">৳0.00</div>
          </div>

          {/* Total Discount */}
          <div className="bg-white rounded-xl p-3.5 border border-slate-100 shadow-2xs">
            <span className="text-[11px] font-medium text-slate-500">Total Discount</span>
            <div className="text-lg font-bold text-slate-900 mt-1">৳2,430.00</div>
          </div>
        </div>

        {/* Right: Sales Trend Today Chart (takes 4 cols on lg) */}
        <div className="lg:col-span-4 bg-white rounded-xl p-4 border border-slate-100 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-bold text-slate-800">Sales Trend Today</span>
            <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
              ৳84,250 Today
            </span>
          </div>

          <div className="h-28 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={salesTrendData} margin={{ top: 10, right: 5, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="trendGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" hide />
                <Tooltip />
                <Bar dataKey="val" barSize={8} radius={[2, 2, 0, 0]} fill="#ecfdf5" />
                <Area type="monotone" dataKey="val" stroke="#10b981" strokeWidth={2} fill="url(#trendGrad)" />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-between text-[9px] text-slate-400 font-medium px-1">
            <span>9 AM</span>
            <span>1 PM</span>
            <span>4 PM</span>
            <span>9 PM</span>
          </div>
        </div>
      </div>

      {/* 4. Transactions Data Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50/75 text-slate-500 font-semibold border-b border-slate-100">
                <th className="py-3 px-3">#</th>
                <th className="py-3 px-3">Invoice No</th>
                <th className="py-3 px-3">Date & Time</th>
                <th className="py-3 px-3">Customer</th>
                <th className="py-3 px-3">Cashier</th>
                <th className="py-3 px-3 text-right">Subtotal</th>
                <th className="py-3 px-3 text-right">Discount</th>
                <th className="py-3 px-3 text-right">Grand Total</th>
                <th className="py-3 px-3 text-right">Paid</th>
                <th className="py-3 px-3 text-right">Due</th>
                <th className="py-3 px-3">Payment Method</th>
                <th className="py-3 px-3 text-center">Status</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((t, idx) => (
                <tr key={t.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-3 px-3 text-slate-400">{idx + 1}.</td>
                  <td className="py-3 px-3 font-mono font-medium text-slate-800">
                    {t.invoiceNo}
                  </td>
                  <td className="py-3 px-3 text-slate-500">{t.dateTime}</td>
                  <td className="py-3 px-3 font-semibold text-slate-700">{t.customer}</td>
                  <td className="py-3 px-3 text-slate-500">{t.cashier}</td>
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
                  <td className="py-3 px-3 text-center">{renderStatusBadge(t.status)}</td>
                  <td className="py-3 px-3 text-right">
                    <div className="flex items-center justify-end gap-1.5 text-xs text-slate-500 font-medium">
                      <button
                        onClick={() => navigate("/pos/invoice")}
                        className="hover:text-emerald-700 hover:underline cursor-pointer"
                      >
                        View
                      </button>
                      <span>|</span>
                      <button
                        onClick={() => navigate("/pos/invoice")}
                        className="hover:text-emerald-700 hover:underline cursor-pointer"
                      >
                        Print
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
          <div>Showing 1-8 of 312 transactions</div>
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
            <button className="px-3 py-1 border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50 cursor-pointer">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DailySalesPage;
