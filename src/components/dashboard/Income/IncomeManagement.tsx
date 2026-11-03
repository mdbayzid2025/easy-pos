import { useState, useMemo, useEffect } from "react";
import { toast } from "sonner";
import Swal from "sweetalert2";
import {
  Search,
  X,
  Plus,
  Building2,
  Calendar,
  Filter,
  Printer,
} from "lucide-react";

import {
  useGetIncomesQuery,
  useAddIncomeMutation,
  useUpdateIncomeMutation,
  useDeleteIncomeMutation,
} from "../../../redux/features/income/incomeApi";

import { useGetBuildingsQuery } from "../../../redux/features/building/buildingApi";

import IncomeFormModal from "./IncomeFormModal";
import IncomeDetailsModal, { type IncomeRecord } from "./IncomeDetailsModal";
import IncomeStatsCards from "./IncomeStatsCards";
import IncomeReportTable from "./IncomeReportTable";
import { Button } from "../../ui/button";

export default function IncomeManagement() {
  const currentYear = new Date().getFullYear();
  const monthsList = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // Filters State
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBuildingId, setSelectedBuildingId] = useState("ALL");
  const [selectedMonth, setSelectedMonth] = useState("ALL");
  const [selectedYear, setSelectedYear] = useState<string>("ALL");

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Global Electricity Rate control (from IncomeReportTable style)
  const [globalUnitRate] = useState<number>(11);

  // Modal States
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingIncome, setEditingIncome] = useState<IncomeRecord | null>(null);
  const [selectedDetailsIncome, setSelectedDetailsIncome] =
    useState<IncomeRecord | null>(null);

  // Build query params for backend filtering & pagination
  const queryParams = useMemo(() => {
    const filterObj: Record<string, any> = {};

    if (selectedBuildingId !== "ALL") {
      filterObj["building._id"] = selectedBuildingId;
    }
    if (selectedMonth !== "ALL") {
      filterObj.month = selectedMonth;
    }
    if (selectedYear !== "ALL") {
      filterObj.year = Number(selectedYear);
    }

    return {
      search: searchTerm.trim() || undefined,
      filter: filterObj,
      sort: { "unit.unitNo": 1 },
      pagination: {
        currentPage,
        pageSize,
      },
    };
  }, [
    searchTerm,
    selectedBuildingId,
    selectedMonth,
    selectedYear,
    currentPage,
    pageSize,
  ]);

  // RTK Query hooks
  const { data: apiIncomesData, isLoading: isIncomesLoading } =
    useGetIncomesQuery(queryParams);
  const { data: apiBuildingsData } = useGetBuildingsQuery(undefined);

  const [addIncomeApi] = useAddIncomeMutation();
  const [updateIncomeApi] = useUpdateIncomeMutation();
  const [deleteIncomeApi] = useDeleteIncomeMutation();

  const buildingsList = useMemo(() => {
    if (apiBuildingsData && Array.isArray(apiBuildingsData?.data)) {
      return apiBuildingsData.data;
    }
    return [];
  }, [apiBuildingsData]);

  const incomesList: IncomeRecord[] = useMemo(() => {
    if (apiIncomesData && Array.isArray(apiIncomesData?.data)) {
      return apiIncomesData.data;
    }
    return [];
  }, [apiIncomesData]);

  const totalItems =
    typeof apiIncomesData?.count === "number"
      ? apiIncomesData.count
      : incomesList.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;

  // Reset page to 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedBuildingId, selectedMonth, selectedYear, pageSize]);

  // Modal Handlers
  const handleOpenAddModal = () => {
    setEditingIncome(null);
    setIsFormModalOpen(true);
  };

  const handleOpenEditModal = (income: IncomeRecord) => {
    setEditingIncome(income);
    setIsFormModalOpen(true);
  };

  const handleOpenDetailsModal = (income: IncomeRecord) => {
    setSelectedDetailsIncome(income);
  };

  const handleDeleteIncome = (income: IncomeRecord) => {
    Swal.fire({
      title: "আপনি কি নিশ্চিত?",
      text: `"${income.user?.name || income.unit?.unitNo}" এর ৳${income.totalBill} বিল রেকর্ড ডিলিট করা হবে।`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#054a48",
      cancelButtonColor: "#dc2626",
      confirmButtonText: "হ্যাঁ, ডিলিট করুন",
      cancelButtonText: "বাতিল",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteIncomeApi(income._id).unwrap();
          toast.success("আদায় ও ভাড়ার রেকর্ড সফলভাবে ডিলিট করা হয়েছে");
        } catch (err: any) {
          toast.error(err?.data?.message || "ডিলিট করতে ব্যর্থ হয়েছে");
        }
      }
    });
  };

  const handleSaveIncome = async (incomePayload: any) => {
    if (editingIncome) {
      try {
        await updateIncomeApi({
          id: editingIncome._id,
          ...incomePayload,
        }).unwrap();
        toast.success("ভাড়া ও বিলের তথ্য সফলভাবে আপডেট করা হয়েছে");
        setIsFormModalOpen(false);
      } catch (err: any) {
        toast.error(err?.data?.message || "আপডেট করতে ব্যর্থ হয়েছে");
      }
    } else {
      try {
        const res = await addIncomeApi(incomePayload).unwrap();
        toast.success(
          res?.message || "নতুন মাস ভাড়া বিল সফলভাবে যোগ করা হয়েছে",
        );
        setIsFormModalOpen(false);
      } catch (err: any) {
        toast.error(err?.data?.message || "বিল যোগ করতে ব্যর্থ হয়েছে");
      }
    }
  };

  const handlePrintPage = () => {
    window.print();
  };

  return (
    <div className="w-full space-y-6 p-4 sm:p-6 pb-16 print:p-0 print:space-y-4">
      {/* Top Banner & Stats Section */}
      <div className="space-y-4 print:hidden">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#054a48] via-[#086361] to-[#043634] p-6 text-white shadow-xl">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight leading-tight">
                ভাড়া ও আয় ব্যবস্থাপনা (Income & Rent Management)
              </h1>
              <p className="text-xs sm:text-sm text-emerald-100 mt-1">
                মাসিক বাসা ভাড়া, বিদ্যুৎ মিটার ইউনিট, পানির বিল ও বকেয়া আদায়ের
                সমন্বিত হিসাব
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Button
                onClick={handlePrintPage}
                variant="outline"
                className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white border-white/30 font-semibold px-4 py-2.5 rounded-xl backdrop-blur-xs transition-all duration-200 text-xs"
              >
                <Printer size={16} />
                <span>রিপোর্ট প্রিন্ট করুন</span>
              </Button>
              <Button
                onClick={handleOpenAddModal}
                className="inline-flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold px-5 py-2.5 rounded-xl shadow-lg hover:shadow-emerald-500/25 transition-all duration-200 text-xs"
              >
                <Plus size={16} />
                <span>নতুন ভাড়া হিসাব যোগ করুন</span>
              </Button>
            </div>
          </div>
        </div>

        {/* 8 Summary Stats Cards */}
        <IncomeStatsCards
          incomesList={incomesList}
          globalUnitRate={globalUnitRate}
        />
      </div>

      {/* Filter and Search Controls Bar */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs space-y-4 print:hidden">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
          {/* Search Box for Varatia name or phone */}
          <div className="relative w-full lg:w-80">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder="ভাড়াটিয়ার নাম বা ফোন দিয়ে খুঁজুন..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-8 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs focus:outline-hidden focus:ring-2 focus:ring-[#054a48] focus:bg-white transition-all"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X size={15} />
              </button>
            )}
          </div>

          {/* Filter Dropdowns */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 w-full lg:w-auto">
            {/* Building Filter */}
            <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 px-2.5 py-1.5 rounded-lg text-xs">
              <Building2 size={14} className="text-gray-400 shrink-0" />
              <select
                value={selectedBuildingId}
                onChange={(e) => setSelectedBuildingId(e.target.value)}
                className="bg-transparent font-medium text-gray-700 w-full focus:outline-hidden"
              >
                <option value="ALL">সকল বিল্ডিং</option>
                {buildingsList.map((b: any) => (
                  <option key={b._id} value={b._id}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Month Filter */}
            <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 px-2.5 py-1.5 rounded-lg text-xs">
              <Filter size={14} className="text-gray-400 shrink-0" />
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="bg-transparent font-medium text-gray-700 w-full focus:outline-hidden"
              >
                <option value="ALL">সকল মাস</option>
                {monthsList.map((m) => (
                  <option key={m} value={m}>
                    {m === "ALL" ? "সকল মাস" : m}
                  </option>
                ))}
              </select>
            </div>

            {/* Year Filter */}
            <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 px-2.5 py-1.5 rounded-lg text-xs">
              <Calendar size={14} className="text-gray-400 shrink-0" />
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="bg-transparent font-medium text-gray-700 w-full focus:outline-hidden"
              >
                <option value="ALL">Year</option>
                <option value={currentYear}>{currentYear}</option>
                <option value={currentYear - 1}>{currentYear - 1}</option>
                <option value={currentYear - 2}>{currentYear - 2}</option>
                <option value={currentYear - 3}>{currentYear - 3}</option>
              </select>
            </div>
          </div>
        </div>

        {/* Active Filters Summary Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-gray-100 text-xs text-gray-600">
          <div className="flex items-center gap-2">
            <span>
              ফিল্টারকৃত রেজাল্ট:{" "}
              <strong className="text-gray-800">{totalItems}</strong> টি ইনকাম
              হিসাব রেকর্ড
            </span>
            {(selectedBuildingId !== "ALL" ||
              selectedMonth !== "ALL" ||
              selectedYear !== "ALL" ||
              searchTerm) && (
              <button
                onClick={() => {
                  setSelectedBuildingId("ALL");
                  setSelectedMonth("ALL");
                  setSelectedYear("ALL");
                  setSearchTerm("");
                }}
                className="text-emerald-700 hover:underline font-medium ml-2"
              >
                ফিল্টার রিমুভ করুন
              </button>
            )}
          </div>
        </div>
      </div>
      {/* Main Income Report Excel Table & Pagination */}
      <IncomeReportTable
        incomesList={incomesList}
        isIncomesLoading={isIncomesLoading}
        currentPage={currentPage}
        pageSize={pageSize}
        totalItems={totalItems}
        totalPages={totalPages}
        globalUnitRate={globalUnitRate}
        setPageSize={setPageSize}
        setCurrentPage={setCurrentPage}
        onOpenDetailsModal={handleOpenDetailsModal}
        onOpenEditModal={handleOpenEditModal}
        onDeleteIncome={handleDeleteIncome}
      />

      {/* Modals */}
      <IncomeFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSaveIncome={handleSaveIncome}
        editingIncome={editingIncome}
      />

      {selectedDetailsIncome && (
        <IncomeDetailsModal
          income={selectedDetailsIncome}
          onClose={() => setSelectedDetailsIncome(null)}
        />
      )}
    </div>
  );
}
