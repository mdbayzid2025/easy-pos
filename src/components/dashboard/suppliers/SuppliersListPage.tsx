import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Search,
  Plus,
  Download,
} from "lucide-react";
import {
  mockSuppliersList,
  type Supplier,
} from "./mockSuppliersData";
import { RecordSupplierPaymentModal } from "./RecordSupplierPaymentModal";

export const SuppliersListPage: React.FC = () => {
  const navigate = useNavigate();
  const [suppliers] = useState<Supplier[]>(mockSuppliersList);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Statuses");
  const [categoryFilter, setCategoryFilter] = useState("All Categories");
  const [currentPage, setCurrentPage] = useState(1);

  // Payment Modal state
  const [selectedSupplierForPayment, setSelectedSupplierForPayment] =
    useState<Supplier | null>(null);

  const filteredSuppliers = suppliers.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.phone.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "All Statuses" || s.status === statusFilter;

    const matchesCategory =
      categoryFilter === "All Categories" ||
      s.supplierType === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  const handleExport = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [
        "Supplier Name,Company,Phone,Email,Address,Total Purchase,Paid,Due,Status",
      ]
        .concat(
          filteredSuppliers.map(
            (s) =>
              `"${s.name}","${s.company}","${s.phone}","${s.email}","${s.address}",${s.totalPurchase},${s.paid},${s.due},"${s.status}"`
          )
        )
        .join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `suppliers_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full min-h-screen bg-[#F7F9FB] p-4 sm:p-6 lg:p-7 space-y-5">
      {/* 1. Header & Breadcrumbs matching Image 3 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium mb-1">
            <Link to="/" className="hover:text-slate-600 transition-colors">
              Dashboard
            </Link>
            <span>/</span>
            <span className="text-slate-400">Suppliers</span>
            <span>/</span>
            <span className="text-slate-600 font-semibold">All Suppliers</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Suppliers
          </h1>
        </div>
        <div className="text-xs text-slate-500 font-medium bg-white px-3 py-1.5 rounded-lg border border-slate-200/80 shadow-2xs self-start sm:self-auto">
          Saturday, Nov 7, 2026 • 12:18 PM
        </div>
      </div>

      {/* 2. Top 4 Metric Cards matching Image 3 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        {/* Total Suppliers */}
        <div className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-2xs">
          <p className="text-[11px] font-medium text-slate-500 mb-1">
            Total Suppliers
          </p>
          <p className="text-xl font-bold text-slate-900">48</p>
          <p className="text-[10px] text-slate-400 mt-1">
            Total count of supplier partners
          </p>
        </div>

        {/* Active Suppliers */}
        <div className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-2xs">
          <p className="text-[11px] font-medium text-slate-500 mb-1">
            Active Suppliers
          </p>
          <p className="text-xl font-bold text-slate-900">45</p>
          <p className="text-[10px] text-slate-400 mt-1">Active in system</p>
        </div>

        {/* Total Supplier Due */}
        <div className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-2xs">
          <p className="text-[11px] font-medium text-slate-500 mb-1">
            Total Supplier Due
          </p>
          <p className="text-xl font-bold text-rose-600">৳1,19,678.90</p>
          <p className="text-[10px] text-slate-400 mt-1">Pending liabilities</p>
        </div>

        {/* Total Purchase */}
        <div className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-2xs">
          <p className="text-[11px] font-medium text-slate-500 mb-1">
            Total Purchase
          </p>
          <p className="text-xl font-bold text-slate-900">৳14,58,320.00</p>
          <p className="text-[10px] text-slate-400 mt-1">historical purchases</p>
        </div>
      </div>

      {/* 3. Filter Bar matching Image 3 */}
      <div className="bg-white rounded-xl p-3.5 border border-slate-200/80 shadow-2xs flex flex-wrap items-center gap-3">
        {/* Search */}
        <div className="flex-1 min-w-[220px]">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, company, phone..."
              className="w-full h-9.5 pl-3.5 pr-9 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white transition-all"
            />
            <Search className="w-4 h-4 text-slate-400 absolute right-3 top-2.5 pointer-events-none" />
          </div>
        </div>

        {/* Status Dropdown */}
        <div className="min-w-[130px]">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full h-9.5 px-3 text-xs bg-white border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:border-emerald-500 cursor-pointer"
          >
            <option value="All Statuses">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>

        {/* Category Dropdown */}
        <div className="min-w-[150px]">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full h-9.5 px-3 text-xs bg-white border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:border-emerald-500 cursor-pointer"
          >
            <option value="All Categories">All Categories</option>
            <option value="Wholesaler / Manufacturer">Wholesaler / Manufacturer</option>
            <option value="Distributor">Distributor</option>
            <option value="Importer">Importer</option>
          </select>
        </div>

        {/* Export Button */}
        <button
          onClick={handleExport}
          className="h-9.5 px-3.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
        >
          <Download size={14} className="text-slate-500" />
          <span>Export</span>
        </button>

        {/* Add Supplier Button */}
        <button
          onClick={() => navigate("/suppliers/new")}
          className="h-9.5 px-3.5 bg-[#16a34a] hover:bg-[#15803d] text-white text-xs font-bold rounded-lg flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer ml-auto"
        >
          <Plus size={15} />
          <span>Add Supplier</span>
        </button>
      </div>

      {/* 4. Suppliers Table Card matching Image 3 */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/75 text-[11px] font-bold text-slate-500 tracking-wider">
                <th className="py-3 px-3">Supplier Name</th>
                <th className="py-3 px-3">Company</th>
                <th className="py-3 px-3">Phone</th>
                <th className="py-3 px-3">Email</th>
                <th className="py-3 px-3">Address</th>
                <th className="py-3 px-3 text-right">Total Purchase</th>
                <th className="py-3 px-3 text-right">Paid</th>
                <th className="py-3 px-3 text-right">Due</th>
                <th className="py-3 px-3 text-center">Status</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredSuppliers.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-8 text-center text-slate-400">
                    No suppliers found matching the filter.
                  </td>
                </tr>
              ) : (
                filteredSuppliers.map((s) => (
                  <tr
                    key={s.id}
                    className="hover:bg-slate-50/70 transition-colors"
                  >
                    {/* Supplier Name */}
                    <td className="py-3 px-3">
                      <Link
                        to={`/suppliers/details/${s.id}`}
                        className="font-bold text-slate-800 hover:text-emerald-600 transition-colors block line-clamp-1"
                      >
                        {s.name}
                      </Link>
                    </td>

                    {/* Company */}
                    <td className="py-3 px-3 font-semibold text-slate-700 line-clamp-1 max-w-[150px]">
                      {s.company}
                    </td>

                    {/* Phone */}
                    <td className="py-3 px-3 text-slate-600 whitespace-nowrap">
                      {s.phone}
                    </td>

                    {/* Email */}
                    <td className="py-3 px-3 text-slate-600 max-w-[160px] truncate">
                      {s.email}
                    </td>

                    {/* Address */}
                    <td className="py-3 px-3 text-slate-500 max-w-[180px] truncate">
                      {s.address}
                    </td>

                    {/* Total Purchase */}
                    <td className="py-3 px-3 text-right font-medium text-slate-800">
                      ৳{s.totalPurchase.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                    </td>

                    {/* Paid */}
                    <td className="py-3 px-3 text-right font-semibold text-emerald-600">
                      ৳{s.paid.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                    </td>

                    {/* Due */}
                    <td className="py-3 px-3 text-right font-semibold text-rose-600">
                      ৳{s.due.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                    </td>

                    {/* Status */}
                    <td className="py-3 px-3 text-center">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                          s.status === "Active"
                            ? "bg-[#ebfbf3] text-[#16a34a] border border-[#bbf7d0]"
                            : "bg-[#fef2f2] text-[#dc2626] border border-[#fecaca]"
                        }`}
                      >
                        {s.status}
                      </span>
                    </td>

                    {/* Actions matching Image 3 (View | Edit | Payment | Ledger) */}
                    <td className="py-3 px-4 text-center whitespace-nowrap text-[11px] font-medium text-slate-500">
                      <div className="flex items-center justify-center gap-1.5">
                        <Link
                          to={`/suppliers/details/${s.id}`}
                          className="hover:text-emerald-600 transition-colors"
                        >
                          View
                        </Link>
                        <span>|</span>
                        <Link
                          to={`/suppliers/new?editId=${s.id}`}
                          className="hover:text-slate-900 transition-colors"
                        >
                          Edit
                        </Link>
                        <span>|</span>
                        <button
                          type="button"
                          onClick={() => setSelectedSupplierForPayment(s)}
                          className="hover:text-emerald-600 transition-colors cursor-pointer"
                        >
                          Payment
                        </button>
                        <span>|</span>
                        <Link
                          to={`/suppliers/details/${s.id}?tab=ledger`}
                          className="hover:text-slate-900 transition-colors"
                        >
                          Ledger
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination matching Image 3 */}
        <div className="px-4 py-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <p>
            Showing <span className="font-semibold text-slate-800">1-8</span> of{" "}
            <span className="font-semibold text-slate-800">48</span> suppliers
          </p>

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
            <span className="px-1 text-slate-400">...</span>
            <button
              onClick={() => setCurrentPage(6)}
              className={`w-7 h-7 rounded flex items-center justify-center font-bold text-xs cursor-pointer ${
                currentPage === 6
                  ? "bg-[#162220] text-white"
                  : "border border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              6
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.min(6, p + 1))}
              className="px-2.5 py-1 rounded border border-slate-200 text-slate-600 hover:bg-slate-50 cursor-pointer"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Record Payment Modal */}
      {selectedSupplierForPayment && (
        <RecordSupplierPaymentModal
          isOpen={Boolean(selectedSupplierForPayment)}
          onClose={() => setSelectedSupplierForPayment(null)}
          supplier={selectedSupplierForPayment}
          onPaymentSuccess={() => {
            alert("Payment recorded successfully!");
          }}
        />
      )}

      {/* Footer Branding */}
      <div className="text-center text-[11px] text-slate-400 py-1">
        Browser view. No code. copyright v2.4.1
      </div>
    </div>
  );
};

export default SuppliersListPage;

