import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  DollarSign,
  Edit2,
  Eye,
  Filter,
  Plus,
  Receipt,
  Search,
  Tag,
  Trash2,
  TrendingUp,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import Swal from "sweetalert2";
import {
  useDeleteUtilityByIdMutation,
  useGetUtilitiesQuery,
} from "../../../redux/features/utility/utilityApi";
import type { Utility } from "../../../types/utility";
import { Button } from "../../ui/button";
import UtilityDetailsModal from "./UtilityDetailsModal";
import UtilityFormModal from "./UtilityFormModal";

export default function UtilityManagement() {
  // State variables
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [selectedYear, setSelectedYear] = useState<string>("ALL");
  const [selectedMonth, setSelectedMonth] = useState<string>("ALL");

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingUtility, setEditingUtility] = useState<Utility | null>(null);
  const [selectedDetailsUtility, setSelectedDetailsUtility] =
    useState<Utility | null>(null);

  // RTK Query payload for POST /utility/get-all
  const utilityQueryPayload = useMemo(
    () => ({
      pagination: {
        pageSize: pageSize,
        currentPage: currentPage,
      },
      filter: null,
      select: {
        electricityBill: 1,
        waterBill: 1,
        gasBill: 1,
        liftBill: 1,
        garageBill: 1,
        isDelete: 1,
        createdAt: 1,
        updatedAt: 1,
      },
      sort: {
        createdAt: -1,
      },
    }),
    [currentPage, pageSize],
  );

  // RTK Query calls
  const {
    data: apiUtilitiesData,
    isLoading: isQueryLoading,
    isFetching: isQueryFetching,
  } = useGetUtilitiesQuery(utilityQueryPayload);

  const [deleteUtilityApi] = useDeleteUtilityByIdMutation();

  const rawUtilities: Utility[] = apiUtilitiesData?.data || [];

  // Filtered utilities logic
  const filteredUtilities = useMemo(() => {
    return rawUtilities.filter((u) => {
      // 1. Search term match
      const term = searchTerm.toLowerCase().trim();
      const dateStr = u.createdAt
        ? new Date(u.createdAt).toISOString().split("T")[0]
        : "";
      const matchesSearch =
        !term ||
        dateStr.includes(term) ||
        String(u.electricityBill || "").includes(term) ||
        String(u.waterBill || "").includes(term) ||
        String(u.gasBill || "").includes(term);

      // 2. Category match (filter items that have amount > 0 in selected category)
      let matchesCategory = true;
      if (selectedCategory === "ELECTRICITY")
        matchesCategory = (u.electricityBill || 0) > 0;
      else if (selectedCategory === "WATER")
        matchesCategory = (u.waterBill || 0) > 0;
      else if (selectedCategory === "GAS")
        matchesCategory = (u.gasBill || 0) > 0;
      else if (selectedCategory === "LIFT")
        matchesCategory = (u.liftBill || 0) > 0;
      else if (selectedCategory === "GARAGE")
        matchesCategory = (u.garageBill || 0) > 0;

      // 3. Year match
      const itemYear = u.createdAt
        ? new Date(u.createdAt).getFullYear().toString()
        : "";
      const matchesYear =
        selectedYear === "ALL" ? true : itemYear === selectedYear;

      // 4. Month match
      const itemMonth = u.createdAt
        ? (new Date(u.createdAt).getMonth() + 1).toString().padStart(2, "0")
        : "";
      const matchesMonth =
        selectedMonth === "ALL" ? true : itemMonth === selectedMonth;

      return matchesSearch && matchesCategory && matchesYear && matchesMonth;
    });
  }, [rawUtilities, searchTerm, selectedCategory, selectedYear, selectedMonth]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory, selectedYear, selectedMonth, pageSize]);

  // Stats calculation
  const totalAmountSum = useMemo(() => {
    return filteredUtilities.reduce((sum, u) => {
      return (
        sum +
        (u.electricityBill || 0) +
        (u.waterBill || 0) +
        (u.gasBill || 0) +
        (u.liftBill || 0) +
        (u.garageBill || 0)
      );
    }, 0);
  }, [filteredUtilities]);

  const totalEntries = filteredUtilities.length;
  const avgAmountPerEntry =
    totalEntries > 0 ? Math.round(totalAmountSum / totalEntries) : 0;

  // Pagination calculation
  const totalItems = filteredUtilities.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  const paginatedUtilities = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredUtilities.slice(start, start + pageSize);
  }, [filteredUtilities, currentPage, pageSize]);

  // Modal Handlers
  const handleOpenAddModal = () => {
    setEditingUtility(null);
    setIsFormModalOpen(true);
  };

  const handleOpenEditModal = (utilityItem: Utility) => {
    setEditingUtility(utilityItem);
    setIsFormModalOpen(true);
  };

  const handleOpenDetailsModal = (utilityItem: Utility) => {
    setSelectedDetailsUtility(utilityItem);
  };

  const handleDeleteUtility = (utilityItem: Utility) => {
    const id = utilityItem._id || utilityItem.id;
    if (!id) return;

    Swal.fire({
      title: "আপনি কি নিশ্চিত?",
      text: "ইউটিলিটি বিল রেকর্ডটি ডিলিট করতে চান?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#054a48",
      cancelButtonColor: "#dc2626",
      confirmButtonText: "হ্যাঁ, ডিলিট করুন",
      cancelButtonText: "বাতিল",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteUtilityApi(id).unwrap();
          toast.success("ইউটিলিটি বিল রেকর্ড ডিলিট করা হয়েছে");
        } catch (err: any) {
          toast.error(err?.data?.message || "ডিলিট করতে ব্যর্থ হয়েছে!");
        }
      }
    });
  };

  const isLoading = isQueryLoading || isQueryFetching;

  return (
    <div className="w-full space-y-6 p-4 sm:p-6 pb-16 animate-in fade-in duration-200">
      {/* ────────────────────────────────────────────────
          1. TOP BANNER HEADER & ACTION BUTTON
      ──────────────────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#054a48] via-[#086361] to-[#043634] p-6 text-white shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-[28px] sm:text-[36px] md:text-[40px] font-extrabold tracking-tight leading-tight">
              ইউটিলিটি ব্যবস্থাপনা (Utility Management)
            </h1>
          </div>

          <Button
            onClick={handleOpenAddModal}
            className="inline-flex items-center justify-center gap-2 bg-[#d97706] hover:bg-[#b45309] text-white font-extrabold px-5 py-3 rounded-xl shadow-lg hover:shadow-amber-500/25 transition-all duration-200 cursor-pointer"
          >
            <Plus size={18} />
            <span>+ নতুন ইউটিলিটি যোগ করুন</span>
          </Button>
        </div>
      </div>

      {/* ────────────────────────────────────────────────
          2. TOP 4 STATS CARDS ROW
      ──────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Amount */}
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <DollarSign size={24} />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">
              সর্বমোট ইউটিলিটি খরচ
            </p>
            <h3 className="text-xl font-extrabold text-gray-900">
              ৳ {totalAmountSum.toLocaleString()}
            </h3>
          </div>
        </div>

        {/* Card 2: Total Entry Count */}
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <Receipt size={24} />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">মোট বিল এন্ট্রি</p>
            <h3 className="text-xl font-extrabold text-gray-900">
              {totalEntries} টি
            </h3>
          </div>
        </div>

        {/* Card 3: Categories Count */}
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <Tag size={24} />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">
              ইউটিলিটি খাতসমূহ
            </p>
            <h3 className="text-xl font-extrabold text-gray-900">৫ টি</h3>
          </div>
        </div>

        {/* Card 4: Avg Amount */}
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
            <TrendingUp size={24} />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">গড় বিল/এন্ট্রি</p>
            <h3 className="text-xl font-extrabold text-gray-900">
              ৳ {avgAmountPerEntry.toLocaleString()}
            </h3>
          </div>
        </div>
      </div>

      {/* ────────────────────────────────────────────────
          3. SEARCH & FILTER BAR
      ──────────────────────────────────────────────── */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs space-y-4">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
          {/* Search Input Box */}
          <div className="relative w-full lg:w-96">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder="ইউটিলিটি বিল বা বিবরণ দিয়ে খুঁজুন..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs font-semibold focus:outline-hidden focus:ring-2 focus:ring-[#054a48] focus:bg-white transition-all"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Filter Dropdowns Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 w-full lg:w-auto">
            {/* Category Filter */}
            <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 px-2.5 py-1.5 rounded-lg text-xs font-semibold">
              <Tag size={14} className="text-gray-400 shrink-0" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-transparent font-semibold text-gray-700 w-full focus:outline-hidden cursor-pointer"
              >
                <option value="ALL">সকল খাত</option>
                <option value="ELECTRICITY">বিদ্যুৎ (Electricity)</option>
                <option value="WATER">পানি (Water)</option>
                <option value="GAS">গ্যাস (Gas)</option>
                <option value="LIFT">লিফট (Lift)</option>
                <option value="GARAGE">গ্যারেজ (Garage)</option>
              </select>
            </div>

            {/* Year Filter */}
            <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 px-2.5 py-1.5 rounded-lg text-xs font-semibold">
              <Calendar size={14} className="text-gray-400 shrink-0" />
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="bg-transparent font-semibold text-gray-700 w-full focus:outline-hidden cursor-pointer"
              >
                <option value="ALL">সকল বছর</option>
                <option value="2024">২০২৪</option>
                <option value="2025">২০২৫</option>
                <option value="2026">২০২৬</option>
                <option value="2027">২০২৭</option>
              </select>
            </div>

            {/* Month Filter */}
            <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 px-2.5 py-1.5 rounded-lg text-xs font-semibold">
              <Filter size={14} className="text-gray-400 shrink-0" />
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="bg-transparent font-semibold text-gray-700 w-full focus:outline-hidden cursor-pointer"
              >
                <option value="ALL">সকল মাস</option>
                <option value="01">জানুয়ারি (01)</option>
                <option value="02">ফেব্রুয়ারি (02)</option>
                <option value="03">মার্চ (03)</option>
                <option value="04">এপ্রিল (04)</option>
                <option value="05">মে (05)</option>
                <option value="06">জুন (06)</option>
                <option value="07">জুলাই (07)</option>
                <option value="08">আগস্ট (08)</option>
                <option value="09">সেপ্টেম্বর (09)</option>
                <option value="10">অক্টোবর (10)</option>
                <option value="11">নভেম্বর (11)</option>
                <option value="12">ডিসেম্বর (12)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Active Filter Clear */}
        {(selectedCategory !== "ALL" ||
          selectedYear !== "ALL" ||
          selectedMonth !== "ALL" ||
          searchTerm) && (
          <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-100">
            <span>
              ফিল্টারকৃত রেজাল্ট:{" "}
              <strong className="text-gray-800">
                {filteredUtilities.length}
              </strong>{" "}
              টি ইউটিলিটি রেকর্ড
            </span>
            <button
              onClick={() => {
                setSelectedCategory("ALL");
                setSelectedYear("ALL");
                setSelectedMonth("ALL");
                setSearchTerm("");
              }}
              className="text-[#054a48] hover:underline font-bold"
            >
              সকল ফিল্টার রিমুভ করুন
            </button>
          </div>
        )}
      </div>

      {/* ────────────────────────────────────────────────
          4. MAIN UTILITY DATA TABLE
      ──────────────────────────────────────────────── */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 text-gray-700 uppercase font-bold border-b border-gray-200">
              <tr>
                <th className="py-3.5 px-4">ক্রমিক</th>
                <th className="py-3.5 px-4">তারিখ (DATE)</th>
                <th className="py-3.5 px-4">ইলেকট্রিক (ELECTRICITY)</th>
                <th className="py-3.5 px-4">পানি (WATER)</th>
                <th className="py-3.5 px-4">গ্যাস (GAS)</th>
                <th className="py-3.5 px-4">লিফট (LIFT)</th>
                <th className="py-3.5 px-4">গ্যারেজ (GARAGE)</th>
                <th className="py-3.5 px-4">পরিমাণ (AMOUNT)</th>
                <th className="py-3.5 px-4 text-center">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-700">
              {isLoading ? (
                <tr>
                  <td
                    colSpan={9}
                    className="py-10 text-center text-gray-400 font-bold"
                  >
                    ইউটিলিটি বিলের ডেটা লোড হচ্ছে...
                  </td>
                </tr>
              ) : paginatedUtilities.length > 0 ? (
                paginatedUtilities.map((item, idx) => {
                  const slNo = (currentPage - 1) * pageSize + idx + 1;
                  const dateFormatted = item.createdAt
                    ? new Date(item.createdAt).toISOString().split("T")[0]
                    : "2026-07-01";

                  const totalItemAmount =
                    (item.electricityBill || 0) +
                    (item.waterBill || 0) +
                    (item.gasBill || 0) +
                    (item.liftBill || 0) +
                    (item.garageBill || 0);

                  return (
                    <tr
                      key={item._id || item.id || idx}
                      className="hover:bg-gray-50/80 transition-colors"
                    >
                      <td className="py-3.5 px-4 font-bold text-gray-800">
                        {slNo}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-gray-700">
                        <span className="inline-flex items-center gap-1.5 bg-gray-50 border border-gray-200 px-2 py-1 rounded-md text-[11px]">
                          <Calendar size={13} className="text-gray-400" />
                          {dateFormatted}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-amber-700">
                        ৳ {(item.electricityBill || 0).toLocaleString()}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-blue-700">
                        ৳ {(item.waterBill || 0).toLocaleString()}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-orange-700">
                        ৳ {(item.gasBill || 0).toLocaleString()}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-emerald-700">
                        ৳ {(item.liftBill || 0).toLocaleString()}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-purple-700">
                        ৳ {(item.garageBill || 0).toLocaleString()}
                      </td>
                      <td className="py-3.5 px-4 font-extrabold text-[#054a48] text-sm">
                        ৳ {totalItemAmount.toLocaleString()}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center justify-center gap-1.5">
                          {/* View Details */}
                          <button
                            onClick={() => handleOpenDetailsModal(item)}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                            title="বিস্তারিত দেখুন"
                          >
                            <Eye size={16} />
                          </button>
                          {/* Edit */}
                          <button
                            onClick={() => handleOpenEditModal(item)}
                            className="p-1.5 text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                            title="সম্পাদনা করুন"
                          >
                            <Edit2 size={16} />
                          </button>
                          {/* Delete */}
                          <button
                            onClick={() => handleDeleteUtility(item)}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                            title="ডিলিট করুন"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan={9}
                    className="py-12 text-center text-gray-400 space-y-3"
                  >
                    <div className="w-12 h-12 bg-emerald-50 text-[#054a48] rounded-xl flex items-center justify-center mx-auto">
                      <Receipt size={24} />
                    </div>
                    <p className="text-xs font-bold text-gray-500">
                      কোনো ইউটিলিটি রেকর্ড পাওয়া যায়নি
                    </p>
                    <Button
                      onClick={handleOpenAddModal}
                      className="bg-[#054a48] text-white text-xs font-bold px-4 py-2 rounded-xl"
                    >
                      + প্রথম ইউটিলিটি রেকর্ড যোগ করুন
                    </Button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ────────────────────────────────────────────────
          5. FOOTER PAGINATION BAR
      ──────────────────────────────────────────────── */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-600">
        <div className="flex items-center gap-4">
          <div>
            দেখাচ্ছে{" "}
            <span className="font-bold">
              {totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1}
            </span>{" "}
            থেকে{" "}
            <span className="font-bold">
              {Math.min(currentPage * pageSize, totalItems)}
            </span>{" "}
            (সর্বমোট {totalItems} টি)
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-gray-500 font-medium">প্রতি পেজে:</span>
            <select
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
              className="bg-gray-50 border border-gray-200 text-gray-700 font-semibold rounded-md px-2 py-1 focus:outline-hidden cursor-pointer"
            >
              <option value={5}>৫ টি</option>
              <option value={10}>১০ টি</option>
              <option value={20}>২০ টি</option>
            </select>
          </div>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center gap-1">
            <Button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              variant="outline"
              size="sm"
              className="h-8 px-2.5 text-xs gap-1 cursor-pointer"
            >
              <ChevronLeft size={14} />
              <span>আগেরটি</span>
            </Button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map(
              (pageNum) => (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`w-8 h-8 rounded-lg font-bold text-xs transition-all cursor-pointer ${
                    currentPage === pageNum
                      ? "bg-[#054a48] text-white shadow-xs"
                      : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-100"
                  }`}
                >
                  {pageNum}
                </button>
              ),
            )}

            <Button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              variant="outline"
              size="sm"
              className="h-8 px-2.5 text-xs gap-1 cursor-pointer"
            >
              <span>পরেরটি</span>
              <ChevronRight size={14} />
            </Button>
          </div>
        )}
      </div>

      {/* Form Modal */}
      <UtilityFormModal
        isOpen={isFormModalOpen}
        editingUtility={editingUtility}
        onClose={() => {
          setIsFormModalOpen(false);
          setEditingUtility(null);
        }}
      />

      {/* Details Modal */}
      {selectedDetailsUtility && (
        <UtilityDetailsModal
          utility={selectedDetailsUtility}
          onClose={() => setSelectedDetailsUtility(null)}
        />
      )}
    </div>
  );
}
