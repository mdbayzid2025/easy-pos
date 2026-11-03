import { useState, useMemo, useEffect } from "react";
import { toast } from "sonner";
import Swal from "sweetalert2";
import {
  Search,
  X,
  ChevronLeft,
  ChevronRight,
  Filter,
  Tag,
  Calendar,
} from "lucide-react";

import ExpenseHeader from "./ExpenseHeader";
import ExpenseTable from "./ExpenseTable";
import ExpenseFormModal from "./ExpenseFormModal";
import ExpenseDetailsModal from "./ExpenseDetailsModal";
import ExpenseCategoryFormModal from "./ExpenseCategoryFormModal";

import {
  useGetExpensesQuery,
  useAddExpenseMutation,
  useUpdateExpenseMutation,
  useDeleteExpenseMutation,
  useGetExpenseCategoriesQuery,
} from "../../../redux/features/expense/expenseApi";

import {
  type Expense,
  type ExpenseCategory,
} from "../../../types/expense";
import { Button } from "../../ui/button";

export default function ExpenseManagement() {
  const currentDate = new Date();
  const currentYearStr = String(currentDate.getFullYear());
  const currentMonthStr = String(currentDate.getMonth() + 1).padStart(2, "0");

  const [categoriesList, setCategoriesList] = useState<ExpenseCategory[]>([]);

  // Filters state
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState("ALL");
  const [selectedType, setSelectedType] = useState("ALL");
  const [selectedYear, setSelectedYear] = useState<string>(currentYearStr);
  const [selectedMonth, setSelectedMonth] = useState<string>(currentMonthStr);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  // Modal states
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [selectedDetailsExpense, setSelectedDetailsExpense] =
    useState<Expense | null>(null);

  // Query params memoized for backend search, filter & pagination
  const queryParams = useMemo(() => {
    const filterObj: any = {};
    if (selectedCategoryId && selectedCategoryId !== "ALL") {
      filterObj["category._id"] = selectedCategoryId;
    }
    if (selectedType && selectedType !== "ALL") {
      filterObj.type = selectedType;
    }
    if (selectedYear && selectedYear !== "ALL") {
      filterObj.year = Number(selectedYear);
    }
    if (selectedMonth && selectedMonth !== "ALL") {
      filterObj.month = Number(selectedMonth);
    }

    return {
      search: searchTerm.trim() || undefined,
      filter: Object.keys(filterObj).length > 0 ? filterObj : undefined,
      pagination: {
        currentPage,
        pageSize,
      },
    };
  }, [
    searchTerm,
    selectedCategoryId,
    selectedType,
    selectedYear,
    selectedMonth,
    currentPage,
    pageSize,
  ]);

  // RTK Query calls with backend params
  const { data: apiExpensesData } = useGetExpensesQuery(queryParams);
  const { data: apiCategoriesData } = useGetExpenseCategoriesQuery(undefined);

  const expensesList: Expense[] = useMemo(() => {
    if (apiExpensesData && Array.isArray(apiExpensesData?.data)) {
      return apiExpensesData.data;
    }
    return [];
  }, [apiExpensesData]);

  const [addExpenseApi] = useAddExpenseMutation();
  const [updateExpenseApi] = useUpdateExpenseMutation();
  const [deleteExpenseApi] = useDeleteExpenseMutation();

  useEffect(() => {
    if (apiCategoriesData && Array.isArray(apiCategoriesData?.data)) {
      setCategoriesList(apiCategoriesData.data);
    }
  }, [apiCategoriesData]);

  // Total items and pagination from backend
  const totalItems = apiExpensesData?.count ?? expensesList.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;

  // Reset page when search or filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [
    searchTerm,
    selectedCategoryId,
    selectedType,
    selectedYear,
    selectedMonth,
    pageSize,
  ]);

  // Modal Handlers
  const handleOpenAddModal = () => {
    setEditingExpense(null);
    setIsFormModalOpen(true);
  };

  const handleOpenEditModal = (expense: Expense) => {
    setEditingExpense(expense);
    setIsFormModalOpen(true);
  };

  const handleOpenDetailsModal = (expense: Expense) => {
    setSelectedDetailsExpense(expense);
  };

  const handleDeleteExpense = (expense: Expense) => {
    Swal.fire({
      title: "আপনি কি নিশ্চিত?",
      text: `"${expense.category?.name || "খরচ"}" এর ৳${expense.amount} খরচের রেকর্ড ডিলিট করা হবে।`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#054a48",
      cancelButtonColor: "#dc2626",
      confirmButtonText: "হ্যাঁ, ডিলিট করুন",
      cancelButtonText: "বাতিল",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteExpenseApi(expense._id).unwrap();
          toast.success("খরচের তথ্য সফলভাবে ডিলিট করা হয়েছে");
        } catch (err: any) {
          toast.error(err?.data?.message || "খরচ ডিলিট করতে ব্যর্থ হয়েছে");
        }
      }
    });
  };

  const handleSaveExpense = async (expenseData: Partial<Expense>) => {
    if (editingExpense) {
      try {
        await updateExpenseApi({
          id: editingExpense._id,
          ...expenseData,
        }).unwrap();
        toast.success("খরচের তথ্য আপডেট করা হয়েছে");
      } catch (err: any) {
        toast.error(err?.data?.message || "খরচ আপডেট করতে ব্যর্থ হয়েছে");
      }
    } else {
      try {
        const res = await addExpenseApi(expenseData).unwrap();
        toast.success(res?.message || "নতুন খরচ সফলভাবে যোগ করা হয়েছে");
      } catch (err: any) {
        toast.error(err?.data?.message || "খরচ যোগ করতে ব্যর্থ হয়েছে");
      }
    }

    setIsFormModalOpen(false);
  };

  return (
    <div className="w-full space-y-6 p-4 sm:p-6 pb-16">
      {/* Header Banner */}
      <ExpenseHeader
        onOpenAddModal={handleOpenAddModal}
        onOpenCategoryModal={() => setIsCategoryModalOpen(true)}
      />

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs space-y-4">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
          {/* Search Box */}
          <div className="relative w-full lg:w-96">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder="খরচের বিবরণ বা ক্যাটাগরি দিয়ে খুঁজুন..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-hidden focus:ring-2 focus:ring-[#054a48] focus:bg-white transition-all"
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
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-2.5 w-full lg:w-auto">
            {/* Category Filter */}
            <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 px-2.5 py-1.5 rounded-lg text-xs">
              <Tag size={14} className="text-gray-400 shrink-0" />
              <select
                value={selectedCategoryId}
                onChange={(e) => setSelectedCategoryId(e.target.value)}
                className="bg-transparent font-medium text-gray-700 w-full focus:outline-hidden"
              >
                <option value="ALL">সকল ক্যাটাগরি</option>
                {categoriesList.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Type Filter */}
            <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 px-2.5 py-1.5 rounded-lg text-xs">
              <Tag size={14} className="text-gray-400 shrink-0" />
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="bg-transparent font-medium text-gray-700 w-full focus:outline-hidden font-medium"
              >
                <option value="ALL">সকল খরচের টাইপ</option>
                <option value="OfficeCost">Cost From Office</option>
                <option value="OwnerCost">Cost From Owner</option>
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
                <option value="ALL">সকল বছর</option>
                <option value="2024">২০২৪</option>
                <option value="2025">২০২৫</option>
                <option value="2026">২০২৬</option>
                <option value="2027">২০২৭</option>
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

        {/* Active Filters Summary */}
        {(selectedCategoryId !== "ALL" ||
          selectedType !== "ALL" ||
          selectedYear !== "ALL" ||
          selectedMonth !== "ALL" ||
          searchTerm) && (
          <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-100">
            <span>
              ফিল্টারকৃত মোট রেজাল্ট:{" "}
              <strong className="text-gray-800">{totalItems}</strong> টি খরচ
              রেকর্ড
            </span>
            <button
              onClick={() => {
                setSelectedCategoryId("ALL");
                setSelectedType("ALL");
                setSelectedYear("ALL");
                setSelectedMonth("ALL");
                setSearchTerm("");
              }}
              className="text-emerald-700 hover:underline font-medium"
            >
              সকল ফিল্টার রিমুভ করুন
            </button>
          </div>
        )}
      </div>

      {/* Main Expense Table */}
      <ExpenseTable
        expenses={expensesList}
        onViewDetails={handleOpenDetailsModal}
        onEditExpense={handleOpenEditModal}
        onDeleteExpense={handleDeleteExpense}
      />

      {/* Pagination Controls */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-600">
        <div className="flex items-center gap-4">
          <div>
            দেখাচ্ছে{" "}
            <span className="font-semibold">
              {totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1}
            </span>{" "}
            থেকে{" "}
            <span className="font-semibold">
              {Math.min(currentPage * pageSize, totalItems)}
            </span>{" "}
            (সর্বমোট {totalItems} টি)
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-gray-500 font-medium">প্রতি পেজে:</span>
            <select
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
              className="bg-gray-50 border border-gray-200 text-gray-700 rounded-md px-2 py-1 focus:outline-hidden"
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
              className="h-8 px-2.5 text-xs gap-1"
            >
              <ChevronLeft size={14} />
              <span>আগেরটি</span>
            </Button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map(
              (pageNum) => (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`w-8 h-8 rounded-lg font-medium text-xs transition-all ${
                    currentPage === pageNum
                      ? "bg-[#054a48]"
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
              className="h-8 px-2.5 text-xs gap-1"
            >
              <span>পরেরটি</span>
              <ChevronRight size={14} />
            </Button>
          </div>
        )}
      </div>

      {/* Add / Edit Form Modal */}
      {isFormModalOpen && (
        <ExpenseFormModal
          editingExpense={editingExpense}
          categories={categoriesList}
          onClose={() => setIsFormModalOpen(false)}
          onSaveExpense={handleSaveExpense}
          onOpenCategoryModal={() => setIsCategoryModalOpen(true)}
        />
      )}

      {/* Expense Category Form Modal */}
      {isCategoryModalOpen && (
        <ExpenseCategoryFormModal
          onClose={() => setIsCategoryModalOpen(false)}
        />
      )}

      {/* View Details Modal */}
      {selectedDetailsExpense && (
        <ExpenseDetailsModal
          expense={selectedDetailsExpense}
          onClose={() => setSelectedDetailsExpense(null)}
        />
      )}
    </div>
  );
}
