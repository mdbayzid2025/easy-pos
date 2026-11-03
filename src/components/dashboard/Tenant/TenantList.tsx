import { useState } from "react";
import {
  Users,
  Plus,
  Search,
  ChevronLeft,
  ChevronRight,
  Eye,
  Edit,
  Trash2,
  Building2,
  Phone,
  UserCheck,
  Lock,
} from "lucide-react";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import type { Tenant } from "./types";

interface TenantListProps {
  tenantList: Tenant[];
  accessFilter?: boolean;
  onAccessFilterChange?: (filter: boolean) => void;
  selectedBuilding?: string;
  onBuildingChange?: (buildingId: string) => void;
  buildings?: any[];
  isLoading?: boolean;
  onOpenRegisterForm: () => void;
  onSelectTenantDetails: (tenant: Tenant) => void;
  onOpenEditTenant: (tenant: Tenant) => void;
  onDeleteTenant: (tenant: Tenant) => void;
  onToggleUserAccess: (tenant: Tenant) => void;
}

export default function TenantList({
  tenantList,
  accessFilter = true,
  onAccessFilterChange,
  selectedBuilding = "ALL",
  onBuildingChange,
  buildings = [],
  isLoading = false,
  onOpenRegisterForm,
  onSelectTenantDetails,
  onOpenEditTenant,
  onDeleteTenant,
  onToggleUserAccess,
}: TenantListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Filter Logic (Search by keyword)
  const filteredTenants = tenantList.filter((t) => {
    const bName = t.building?.name || t.buildingName || "";
    const uName = t.unit?.flotNo || t.unitName || "";
    const phone = t.phoneNo || t.phone || "";

    const matchesSearch =
      !searchTerm ||
      t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      phone.includes(searchTerm) ||
      t.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (t._id && t._id.toLowerCase().includes(searchTerm.toLowerCase())) ||
      bName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      uName.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesSearch;
  });

  // Pagination Logic
  const totalPages = Math.ceil(filteredTenants.length / pageSize) || 1;
  const startIndex = (currentPage - 1) * pageSize;
  const currentTenants = filteredTenants.slice(
    startIndex,
    startIndex + pageSize
  );

  return (
    <div className="w-full space-y-6 pb-16">
      {/* Header Banner */}
      <div className="bg-[#054a48] text-white rounded-2xl p-4 sm:p-6 shadow-lg flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight leading-tight">
            Tenant Directory & List
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
          {/* Building Dropdown Filter */}
          <div className="relative w-full sm:w-48 md:w-52">
            <Building2
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-200 pointer-events-none"
            />
            <select
              value={selectedBuilding || "ALL"}
              onChange={(e) => onBuildingChange?.(e.target.value)}
              className="w-full pl-8 pr-7 py-1.5 text-xs font-semibold text-white bg-white/10 hover:bg-white/15 border border-white/25 rounded-xl shadow-2xs focus:outline-none focus:ring-1 focus:ring-white/40 focus:border-white transition-all cursor-pointer appearance-none truncate backdrop-blur-xs"
            >
              <option value="ALL" className="text-gray-900 bg-white">
                সকল ভবন (All Buildings)
              </option>
              {buildings.map((b: any) => (
                <option
                  key={b._id || b.id}
                  value={b._id || b.id}
                  className="text-gray-900 bg-white"
                >
                  {b.name}
                </option>
              ))}
            </select>
            <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-white/70 text-[9px]">
              ▼
            </div>
          </div>

          {/* Add New Tenant Button */}
          <Button
            size="sm"
            onClick={onOpenRegisterForm}
            className="bg-white hover:bg-emerald-50 text-[#054a48] font-bold px-3 py-1.5 h-8 rounded-xl shadow-sm transition-all flex items-center gap-1.5 cursor-pointer text-xs shrink-0"
          >
            <Plus size={15} /> + নতুন ভাড়াটিয়া রেজিস্টার
          </Button>

          {/* Active Tenant Button */}
          <Button
            size="sm"
            variant="outline"
            onClick={() => onAccessFilterChange?.(true)}
            className={`border-white/30 text-white hover:bg-white/20 px-3 py-1.5 h-8 rounded-xl text-xs font-semibold transition-all shrink-0 ${
              accessFilter === true ? "bg-white/25 border-white shadow-xs" : "bg-white/10"
            }`}
          >
            সক্রিয় ভাড়াটিয়া
          </Button>

          {/* Inactive Tenant Button */}
          <Button
            size="sm"
            variant="outline"
            onClick={() => onAccessFilterChange?.(false)}
            className={`border-white/30 text-white hover:bg-white/20 px-3 py-1.5 h-8 rounded-xl text-xs font-semibold transition-all shrink-0 ${
              accessFilter === false ? "bg-white/25 border-white shadow-xs" : "bg-white/10"
            }`}
          >
            নিষ্ক্রিয় ভাড়াটিয়া
          </Button>
        </div>
      </div>

      {/* Directory Box */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden space-y-4">
        {/* Top Title & Search Toolbar */}
        <div className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 bg-gray-50/50">
          <div>
            <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
              Tenant Directory List
              <span className="text-xs bg-gray-200 text-gray-700 font-bold px-2.5 py-0.5 rounded-full">
                {filteredTenants.length} records
              </span>
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Search by tenant name, phone, building, floor, or unit number.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Items Per Page Select */}
            <div className="flex items-center gap-2 text-xs font-semibold text-gray-600">
              <span>দেখাও</span>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="px-2.5 py-1.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-800 bg-white shadow-2xs focus:outline-none"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
              <span>টি</span>
            </div>

            {/* Search Box */}
            <div className="relative max-w-md">
              <Search
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <Input
                type="text"
                placeholder="Search tenant name, phone, unit..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-9 pr-4 py-2 text-xs rounded-xl border-gray-200 bg-white shadow-2xs w-full sm:w-64"
              />
            </div>
          </div>
        </div>

        {/* Directory Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100/70 border-y border-gray-100 text-gray-600 text-xs font-bold uppercase tracking-wider">
                <th className="py-3.5 px-4 sm:px-6">প্রোফাইল (Tenant)</th>
                <th className="py-3.5 px-4 sm:px-6">ফোন নম্বর</th>
                <th className="py-3.5 px-4 sm:px-6">ভবন (Building)</th>
                <th className="py-3.5 px-4 sm:px-6">ফ্লোর ও ইউনিট</th>
                <th className="py-3.5 px-4 sm:px-6">স্থিতি (Status)</th>
                <th className="py-3.5 px-4 sm:px-6 text-center">ACCESS CONTROL</th>
                <th className="py-3.5 px-4 sm:px-6 text-right">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs sm:text-sm">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <div className="w-7 h-7 border-3 border-[#054a48] border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-xs font-semibold text-gray-600">ভাড়াটিয়ার তালিকা লোড হচ্ছে...</span>
                    </div>
                  </td>
                </tr>
              ) : currentTenants.length > 0 ? (
                currentTenants.map((tenant) => {
                  const isActive = tenant.status === "সক্রিয়";
                  const bName = tenant.building?.name || tenant.buildingName || "---";
                  const fNo = tenant.floor?.floorNo || "---";
                  const uNo = tenant.unit?.flotNo || tenant.unitName || "---";
                  const phone = tenant.phoneNo || tenant.phone || "---";
                  const hasAccess = tenant.hasAccess ?? tenant.hasUserAccess ?? false;

                  return (
                    <tr
                      key={tenant.id || tenant._id}
                      className="hover:bg-emerald-50/30 transition-colors duration-150 group"
                    >
                      {/* Profile (Avatar + Name + ID) */}
                      <td className="py-4 px-4 sm:px-6 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          {tenant.profileImg ? (
                            <img
                              src={tenant.profileImg}
                              alt={tenant.name}
                              className="w-10 h-10 rounded-full object-cover border border-emerald-300 shadow-2xs shrink-0"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-[#054a48] text-white font-extrabold flex items-center justify-center text-xs border border-emerald-200 shrink-0 shadow-2xs">
                              {tenant.name.slice(0, 2).toUpperCase()}
                            </div>
                          )}
                          <div>
                            <div className="font-bold text-gray-900 group-hover:text-[#054a48] transition-colors flex items-center gap-1.5">
                              {tenant.name}
                              {tenant.documents && (
                                <span className="w-2 h-2 rounded-full bg-blue-500 inline-block" title="Document attached"></span>
                              )}
                            </div>
                            <div className="flex items-center gap-2 text-[11px] text-gray-400 font-semibold">
                              <span>ID: {tenant.id || tenant._id}</span>
                              {tenant.email && <span className="truncate max-w-[130px]">• {tenant.email}</span>}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Phone Number */}
                      <td className="py-4 px-4 sm:px-6 whitespace-nowrap font-medium text-gray-700">
                        <div className="flex items-center gap-1.5 font-bold">
                          <Phone size={13} className="text-[#054a48]" />
                          <span>{phone}</span>
                        </div>
                      </td>

                      {/* Building Name */}
                      <td className="py-4 px-4 sm:px-6 whitespace-nowrap font-bold text-gray-800">
                        <div className="flex items-center gap-1.5">
                          <Building2 size={14} className="text-[#054a48]" />
                          <span>{bName}</span>
                        </div>
                      </td>

                      {/* Floor & Flat / Unit */}
                      <td className="py-4 px-4 sm:px-6 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <span className="bg-emerald-50 text-[#054a48] font-bold px-2 py-0.5 rounded-md border border-emerald-200/60 text-xs">
                            {fNo}
                          </span>
                          <span className="bg-gray-100 font-extrabold text-gray-900 px-2.5 py-0.5 rounded-md border border-gray-200 text-xs">
                            {uNo}
                          </span>
                        </div>
                      </td>

                      {/* Status Dropdown / Badge */}
                      <td className="py-4 px-4 sm:px-6 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                            isActive
                              ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                              : "bg-amber-100 text-amber-800 border border-amber-200"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              isActive ? "bg-emerald-600" : "bg-amber-600"
                            }`}
                          ></span>
                          {tenant.status}
                        </span>
                      </td>

                      {/* User Panel Button (hasAccess) */}
                      <td className="py-4 px-4 sm:px-6 whitespace-nowrap text-center">
                        <Button
                          size="sm"
                          onClick={() => onToggleUserAccess(tenant)}
                          className={`h-7 px-3 text-[11px] font-bold rounded-lg transition-all cursor-pointer ${
                            hasAccess
                              ? "bg-emerald-600 text-white hover:bg-emerald-700 shadow-xs"
                              : "bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-300"
                          }`}
                        >
                          {hasAccess ? (
                            <>
                              <UserCheck size={12} className="mr-1" /> Login Allowed
                            </>
                          ) : (
                            <>
                              <Lock size={12} className="mr-1" /> No Access
                            </>
                          )}
                        </Button>
                      </td>

                      {/* Action Icons */}
                      <td className="py-4 px-4 sm:px-6 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => onSelectTenantDetails(tenant)}
                            title="বিস্তারিত দেখুন"
                            className="h-8 w-8 p-0 rounded-lg text-[#054a48] hover:bg-emerald-50 cursor-pointer"
                          >
                            <Eye size={16} />
                          </Button>

                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => onOpenEditTenant(tenant)}
                            title="সম্পাদনা (Edit/Update)"
                            className="h-8 w-8 p-0 rounded-lg text-blue-600 hover:bg-blue-50 cursor-pointer"
                          >
                            <Edit size={16} />
                          </Button>

                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => onDeleteTenant(tenant)}
                            title="মুছে ফেলুন"
                            className="h-8 w-8 p-0 rounded-lg text-red-600 hover:bg-red-50 cursor-pointer"
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan={7}
                    className="py-12 text-center text-gray-500 space-y-2"
                  >
                    <Users size={36} className="mx-auto text-gray-300" />
                    <p className="font-bold text-base">কোনো ভাড়াটিয়া পাওয়া যায়নি</p>
                    <p className="text-xs text-gray-400">
                      {accessFilter === false
                        ? "কোনো স্থগিত বা নিষ্ক্রিয় ভাড়াটিয়া পাওয়া যায়নি।"
                        : accessFilter === true
                        ? "কোনো সক্রিয় ভাড়াটিয়া পাওয়া যায়নি।"
                        : "নতুন ভাড়াটিয়া রেজিস্টার করুন অথবা আপনার সার্চ ফিল্টারটি পরিবর্তন করুন।"}
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="p-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
          <div>
            দেখানো হচ্ছে{" "}
            <span className="font-bold text-gray-800">
              {filteredTenants.length > 0 ? startIndex + 1 : 0}
            </span>{" "}
            থেকে{" "}
            <span className="font-bold text-gray-800">
              {Math.min(startIndex + pageSize, filteredTenants.length)}
            </span>{" "}
            (সর্বমোট{" "}
            <span className="font-bold text-gray-800">
              {filteredTenants.length}
            </span>{" "}
            টি রেকর্ডের মধ্যে)
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="h-8 px-2.5 rounded-lg text-xs"
            >
              <ChevronLeft size={14} className="mr-1" /> পূর্ববর্তী
            </Button>
            <span className="px-3 py-1 font-bold text-gray-800 bg-gray-100 rounded-lg">
              {currentPage} / {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="h-8 px-2.5 rounded-lg text-xs"
            >
              পরবর্তী <ChevronRight size={14} className="ml-1" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
