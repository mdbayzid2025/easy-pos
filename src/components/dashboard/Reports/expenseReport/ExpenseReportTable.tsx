import { useState, useMemo, useEffect } from "react";
import {
  Receipt,
  Tag,
  FileText,
  Building2,
  Calendar,
  Printer,
  ArrowLeft,
  Search,
  Filter,
  X,
} from "lucide-react";
import type { Expense, ExpenseCategory } from "../../../../types/expense";
import type { Building } from "../../Building/types";
import { Button } from "../../../ui/button";
import { monthNamesBengali, yearOptions } from "../types";
import {
  useGetExpensesQuery,
  useGetExpenseCategoriesQuery,
} from "../../../../redux/features/expense/expenseApi";
import { useGetBuildingsQuery } from "../../../../redux/features/building/buildingApi";

interface ExpenseReportTableProps {
  buildings?: Building[];
  selectedBuilding?: Building | undefined;
  selectedBuildingId?: string;
  expenseList?: Expense[];
  month?: string;
  year?: number;
  onBackToCatalog?: () => void;
}

const monthToNumMap: Record<string, string> = {
  জানুয়ারি: "01",
  ফেব্রুয়ারি: "02",
  মার্চ: "03",
  এপ্রিল: "04",
  মে: "05",
  জুন: "06",
  জুলাই: "07",
  আগস্ট: "08",
  সেপ্টেম্বর: "09",
  অক্টোবর: "10",
  নভেম্বর: "11",
  ডিসেম্বর: "12",
};

export default function ExpenseReportTable({
  buildings: propBuildings,
  selectedBuildingId: propSelectedBuildingId = "ALL",
  month: propMonth,
  year: propYear,
  onBackToCatalog,
}: ExpenseReportTableProps) {
  // Filters State
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("ALL");
  const [selectedBuildingId, setSelectedBuildingId] = useState<string>(
    propSelectedBuildingId,
  );
  const [selectedMonth, setSelectedMonth] = useState<string>(
    propMonth || "ALL",
  );
  const [selectedYear, setSelectedYear] = useState<string>(
    propYear ? String(propYear) : "ALL",
  );

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [
    searchTerm,
    selectedCategoryId,
    selectedBuildingId,
    selectedYear,
    selectedMonth,
    pageSize,
  ]);

  // Construct query payload for backend POST /expense/get-all?q=...
  const queryParams = useMemo(() => {
    const filterObj: Record<string, any> = {};

    if (selectedBuildingId !== "ALL" && selectedBuildingId !== "GENERAL") {
      filterObj["building._id"] = selectedBuildingId;
    }
    if (selectedCategoryId !== "ALL") {
      filterObj["category._id"] = selectedCategoryId;
    }
    if (selectedMonth !== "ALL") {
      const monthNumStr = monthToNumMap[selectedMonth];
      if (monthNumStr) {
        filterObj.month = Number(monthNumStr);
      }
    }
    if (selectedYear !== "ALL") {
      filterObj.year = Number(selectedYear);
    }

    return {
      search: searchTerm.trim() || undefined,
      filter: Object.keys(filterObj).length > 0 ? filterObj : null,
      pagination: {
        currentPage: currentPage,
        pageSize: pageSize,
      },
    };
  }, [
    searchTerm,
    selectedCategoryId,
    selectedBuildingId,
    selectedMonth,
    selectedYear,
    currentPage,
    pageSize,
  ]);

  // API Queries (Backend handled filtering & pagination)
  const { data: apiExpensesData, isLoading: isExpensesLoading } =
    useGetExpensesQuery(queryParams, { skip: false });
  const { data: apiCategoriesData } = useGetExpenseCategoriesQuery(undefined, {
    skip: false,
  });
  const { data: apiBuildingsData } = useGetBuildingsQuery(undefined, {
    skip: false,
  });

  const categoriesList: ExpenseCategory[] = useMemo(() => {
    if (apiCategoriesData && Array.isArray(apiCategoriesData?.data)) {
      return apiCategoriesData.data;
    }
    return [];
  }, [apiCategoriesData]);

  const buildings = useMemo(() => {
    if (
      apiBuildingsData &&
      Array.isArray(apiBuildingsData?.data) &&
      apiBuildingsData.data.length > 0
    ) {
      return apiBuildingsData.data;
    }
    return propBuildings || [];
  }, [apiBuildingsData, propBuildings]);

  const expenses: Expense[] = useMemo(() => {
    if (apiExpensesData && Array.isArray(apiExpensesData?.data)) {
      return apiExpensesData.data;
    }
    return [];
  }, [apiExpensesData]);

  const totalItems: number = useMemo(() => {
    if (typeof apiExpensesData?.count === "number") {
      return apiExpensesData.count;
    }
    if (typeof apiExpensesData?.totalCount === "number") {
      return apiExpensesData.totalCount;
    }
    return expenses.length;
  }, [apiExpensesData, expenses.length]);

  const totalPages = Math.ceil(totalItems / pageSize) || 1;

  const totalExpenseSum = useMemo(() => {
    if (typeof apiExpensesData?.totalAmount === "number") {
      return apiExpensesData.totalAmount;
    }
    return expenses.reduce((acc, exp) => acc + (exp.amount || 0), 0);
  }, [apiExpensesData, expenses]);

  const reportDateStr = new Date().toLocaleDateString("bn-BD", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-4">
      {/* Component-Specific Filter Bar */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-200 shadow-xs space-y-4 print:hidden">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
          {/* Back button & Search Box */}
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto flex-1">
            {onBackToCatalog && (
              <Button
                onClick={onBackToCatalog}
                variant="outline"
                className="rounded-xl text-xs font-bold text-[#054a48] bg-emerald-50/50 border-emerald-200 hover:bg-emerald-100 flex items-center gap-1.5 h-9 px-3.5 shrink-0 w-full sm:w-auto justify-center"
              >
                <ArrowLeft size={15} /> ← রিপোর্ট তালিকায় ফিরে যান
              </Button>
            )}

            {/* Search Input */}
            <div className="relative w-full sm:max-w-xs flex-1">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={16}
              />
              <input
                type="text"
                placeholder="খরচের বিবরণ বা ভাউচার দিয়ে খুঁজুন..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-8 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-hidden focus:ring-2 focus:ring-[#054a48] focus:bg-white transition-all font-medium"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          </div>

          {/* Right Controls: Print button */}
          <div className="flex items-center gap-3 w-full lg:w-auto justify-end">
            <Button
              onClick={handlePrint}
              variant="outline"
              className="rounded-xl text-xs font-bold text-gray-700 hover:text-[#054a48] border-gray-200 flex items-center gap-1.5 h-9 px-3.5"
            >
              <Printer size={15} /> প্রিন্ট / ডাউনলোড
            </Button>
          </div>
        </div>

        {/* Filter Dropdowns Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5 pt-2 border-t border-gray-100">
          {/* Building Selector */}
          <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-xl text-xs">
            <Building2 size={15} className="text-[#054a48] shrink-0" />
            <select
              value={selectedBuildingId}
              onChange={(e) => setSelectedBuildingId(e.target.value)}
              className="bg-transparent font-bold text-gray-800 focus:outline-hidden cursor-pointer w-full"
            >
              <option value="ALL">সকল ভবন & জেনারেল খরচ</option>
              <option value="GENERAL">শুধুমাত্র জেনারেল (অফিস খরচ)</option>
              {buildings.map((b: any) => (
                <option key={b.id || b._id} value={b.id || b._id}>
                  {b.name} {b.code ? `(${b.code})` : ""}
                </option>
              ))}
            </select>
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-xl text-xs">
            <Tag size={15} className="text-gray-500 shrink-0" />
            <select
              value={selectedCategoryId}
              onChange={(e) => setSelectedCategoryId(e.target.value)}
              className="bg-transparent font-bold text-gray-800 focus:outline-hidden cursor-pointer w-full"
            >
              <option value="ALL">সকল ক্যাটাগরি</option>
              {categoriesList.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Month Selector */}
          <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-xl text-xs">
            <Filter size={15} className="text-emerald-600 shrink-0" />
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="bg-transparent font-bold text-gray-800 focus:outline-hidden cursor-pointer w-full"
            >
              <option value="ALL">সকল মাস</option>
              {monthNamesBengali.map((m) => (
                <option key={m} value={m}>
                  {m} মাস
                </option>
              ))}
            </select>
          </div>

          {/* Year Selector */}
          <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-xl text-xs">
            <Calendar size={15} className="text-gray-500 shrink-0" />
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="bg-transparent font-bold text-gray-800 focus:outline-hidden cursor-pointer w-full"
            >
              <option value="ALL">সকল বছর</option>
              {yearOptions.map((y) => (
                <option key={y} value={String(y)}>
                  {y} ইং
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Active Filters Reset Summary */}
        {(selectedCategoryId !== "ALL" ||
          selectedBuildingId !== "ALL" ||
          selectedYear !== "ALL" ||
          selectedMonth !== "ALL" ||
          searchTerm) && (
          <div className="flex items-center justify-between text-xs text-gray-500 pt-1">
            <span>
              ফিল্টারকৃত মোট রেজাল্ট:{" "}
              <strong className="text-gray-800">{totalItems}</strong> টি খরচ
              রেকর্ড
            </span>
            <button
              onClick={() => {
                setSelectedCategoryId("ALL");
                setSelectedBuildingId("ALL");
                setSelectedYear("ALL");
                setSelectedMonth("ALL");
                setSearchTerm("");
              }}
              className="text-emerald-700 hover:underline font-bold"
            >
              সকল ফিল্টার রিমুভ করুন
            </button>
          </div>
        )}
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-xs p-4 sm:p-6 space-y-4 print:p-0 print:border-none print:shadow-none">
        {/* Printable Report Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-200">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
              <Receipt size={24} className="text-[#054a48] print:hidden" />
              <span>মাসিক রক্ষণাবেক্ষণ ও ক্রয় ব্যয় রিপোর্ট</span>
            </h2>
            <p className="text-sm font-bold text-red-700 underline decoration-red-300 underline-offset-4 mt-1">
              (Monthly Maintenance & Purchase Expense Report) —{" "}
              {selectedMonth === "ALL" ? "সকল মাস" : `${selectedMonth} মাস`},{" "}
              {selectedYear === "ALL" ? "সকল বছর" : `${selectedYear} ইং`}
            </p>
          </div>

          <div className="text-right text-xs text-gray-500 font-medium print:text-black">
            <p>
              মোট খরচ ভাউচার:{" "}
              <strong className="text-gray-800">{totalItems} টি</strong>
            </p>
            <p>
              মোট পরিমাণ:{" "}
              <strong className="text-red-700 font-bold">
                ৳ {totalExpenseSum.toLocaleString()}
              </strong>
            </p>
          </div>
        </div>

        {/* Read-Only Expense Report Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs border border-gray-300">
            <thead>
              <tr className="bg-gray-100/90 font-bold text-gray-800 border-b border-gray-300 uppercase tracking-wider text-[11px]">
                <th className="p-3 border-r border-gray-300 text-center w-12">
                  ক্রঃ নং
                </th>
                <th className="p-3 border-r border-gray-300 min-w-[110px]">
                  তারিখ (Date)
                </th>
                <th className="p-3 border-r border-gray-300 min-w-[160px]">
                  ক্যাটাগরি (Category)
                </th>
                <th className="p-3 border-r border-gray-300 min-w-[280px]">
                  মালামাল / খরচের বিবরণ (Description)
                </th>
                <th className="p-3 border-r border-gray-300 min-w-[120px] text-right font-black text-gray-900 bg-gray-200/50">
                  মোট টাকা (৳)
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200 text-xs">
              {isExpensesLoading ? (
                <tr>
                  <td
                    colSpan={5}
                    className="py-12 text-center text-gray-500 font-medium"
                  >
                    খরচের ডেটা লোড হচ্ছে...
                  </td>
                </tr>
              ) : expenses.length > 0 ? (
                expenses.map((expense: any, idx: any) => {
                  return (
                    <tr
                      key={expense._id}
                      className="hover:bg-red-50/20 transition-colors text-gray-800"
                    >
                      <td className="p-3 border-r border-gray-200 text-center font-bold">
                        {(currentPage - 1) * pageSize + idx + 1}
                      </td>
                      <td className="p-3 border-r border-gray-200 font-semibold text-gray-700 whitespace-nowrap">
                        {expense.dateString ||
                          (expense.date
                            ? String(expense.date).split("T")[0]
                            : "")}
                      </td>
                      <td className="p-3 border-r border-gray-200">
                        <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded font-medium text-[11px] border border-emerald-200">
                          <Tag
                            size={11}
                            className="text-emerald-600 print:hidden"
                          />
                          {expense.category?.name || "সাধারণ খরচ"}
                        </span>
                      </td>
                      <td className="p-3 border-r border-gray-200 font-medium">
                        <div className="flex items-start gap-1.5">
                          <FileText
                            size={13}
                            className="text-gray-400 shrink-0 mt-0.5 print:hidden"
                          />
                          <div>
                            <span>{expense.description}</span>
                            {expense.receiptNo && (
                              <span className="block text-[10px] text-gray-400">
                                ভাউচার নং: {expense.receiptNo}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="p-3 border-r border-gray-200 text-right font-black text-red-700 bg-red-50/30 whitespace-nowrap">
                        ৳ {expense.amount?.toLocaleString()}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-gray-400">
                    <Receipt size={36} className="mx-auto text-gray-300 mb-2" />
                    <p className="font-bold text-sm">
                      কোন খরচের তথ্য পাওয়া যায়নি
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      ফিল্টারে সিলেক্ট করা ক্যাটাগরি, সাল, মাস বা সার্চ
                      কীওয়ার্ড পরিবর্তন করে চেষ্টা করুন।
                    </p>
                  </td>
                </tr>
              )}
            </tbody>

            {/* Grand Total Footer */}
            {expenses.length > 0 && (
              <tfoot>
                <tr className="bg-red-100/80 font-black text-red-950 border-t-2 border-red-300 text-sm">
                  <td
                    colSpan={4}
                    className="p-3 border-r border-red-200 text-right uppercase tracking-wider"
                  >
                    একবারে নিচে মোট ক্ষেত্রফল/মাসিক ব্যয়:
                  </td>
                  <td className="p-3 border-r border-red-200 text-right font-black text-base text-red-900 bg-red-200/90 whitespace-nowrap">
                    ৳ {totalExpenseSum.toLocaleString()}
                  </td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-600 print:hidden border-t border-gray-100">
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
                className="bg-gray-50 border border-gray-200 text-gray-700 rounded-md px-2 py-1 focus:outline-hidden cursor-pointer"
              >
                <option value={5}>৫ টি</option>
                <option value={10}>১০ টি</option>
                <option value={20}>২০ টি</option>
                <option value={50}>৫০ টি</option>
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
                <span>আগেরটি</span>
              </Button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (pageNum) => (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-7 h-7 rounded-lg font-medium text-xs transition-all ${
                      currentPage === pageNum
                        ? "bg-[#054a48] text-white"
                        : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-100"
                    }`}
                  >
                    {pageNum}
                  </button>
                ),
              )}

              <Button
                disabled={currentPage === totalPages}
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                variant="outline"
                size="sm"
                className="h-8 px-2.5 text-xs gap-1"
              >
                <span>পরেরটি</span>
              </Button>
            </div>
          )}
        </div>

        {/* Bottom Report Date display */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200 text-xs text-gray-600 font-semibold">
          <div>
            <span>মোট রেকর্ড: {totalItems} টি</span>
          </div>
          <div className="text-right font-bold text-gray-800">
            <span>রিপোর্ট প্রকাশের তারিখ: {reportDateStr}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
