import React from "react";
import {
  ChevronLeft,
  ChevronRight,
  Eye,
  Edit,
  Trash2,
} from "lucide-react";
import { type IncomeRecord } from "./IncomeDetailsModal";
import { Button } from "../../ui/button";

interface IncomeReportTableProps {
  incomesList: IncomeRecord[];
  isIncomesLoading: boolean;
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  globalUnitRate: number;
  setPageSize: (size: number) => void;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  onOpenDetailsModal: (income: IncomeRecord) => void;
  onOpenEditModal: (income: IncomeRecord) => void;
  onDeleteIncome: (income: IncomeRecord) => void;
}

export default function IncomeReportTable({
  incomesList,
  isIncomesLoading,
  currentPage,
  pageSize,
  totalItems,
  totalPages,
  globalUnitRate,
  setPageSize,
  setCurrentPage,
  onOpenDetailsModal,
  onOpenEditModal,
  onDeleteIncome,
}: IncomeReportTableProps) {
  return (
    <div className="space-y-4">
      {/* Main Income Excel Table (15-Column Layout) */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 space-y-4 print:p-0 print:border-none">
        <div className="hidden print:block mb-4 text-center">
          <h2 className="text-2xl font-bold text-gray-900">
            আইনাল প্রপার্টিজ - ভাড়ার আয় হিসাব
          </h2>
          <p className="text-xs text-gray-600">
            মাসিক ভাড়ার আয় ও বিদ্যুৎ বিলের হিসাবপত্র
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-center border-collapse text-xs border border-gray-300">
            <thead>
              {/* Top Multi-Level Header */}
              <tr className="bg-gray-100 font-bold text-gray-800 border-b border-gray-300">
                <th rowSpan={2} className="p-2 border-r border-gray-300 w-10">
                  নং
                </th>
                <th rowSpan={2} className="p-2 border-r border-gray-300 w-14">
                  ফ্লোর
                </th>
                <th rowSpan={2} className="p-2 border-r border-gray-300 w-16">
                  ফ্ল্যাট নং
                </th>
                <th
                  rowSpan={2}
                  className="p-2 border-r border-gray-300 text-left min-w-[140px]"
                >
                  ভাড়াটিয়া নাম ও ফোন
                </th>
                <th
                  rowSpan={2}
                  className="p-2 border-r border-gray-300 min-w-[75px]"
                >
                  পূর্বের বকেয়া
                </th>
                <th
                  rowSpan={2}
                  className="p-2 border-r border-gray-300 min-w-[85px]"
                >
                  ফ্ল্যাট ভাড়া
                </th>
                <th
                  rowSpan={2}
                  className="p-2 border-r border-gray-300 min-w-[75px]"
                >
                  অগ্রিম কমানো
                </th>
                <th
                  rowSpan={2}
                  className="p-2 border-r border-gray-300 min-w-[75px]"
                >
                  লিফট ভাড়া
                </th>

                {/* Grouped Electricity Header */}
                <th
                  colSpan={5}
                  className="p-1.5 border-r border-gray-300 bg-amber-50 text-amber-900 font-extrabold"
                >
                  বিদ্যুৎ বিল
                </th>

                <th
                  rowSpan={2}
                  className="p-2 border-r border-gray-300 min-w-[75px]"
                >
                  পানি/গ্যাস
                </th>
                <th
                  rowSpan={2}
                  className="p-2 border-r border-gray-300 min-w-[80px]"
                >
                  গ্যারেজ ভাড়া
                </th>
                <th
                  rowSpan={2}
                  className="p-2 border-r border-gray-300 min-w-[75px] text-emerald-800 bg-emerald-50/50"
                >
                  মওকুফ/ছাড়
                </th>
                <th
                  rowSpan={2}
                  className="p-2 border-r border-gray-300 min-w-[90px] font-black text-gray-900 bg-gray-200/60"
                >
                  মোট ভাড়া
                </th>
                <th
                  rowSpan={2}
                  className="p-2 border-r border-gray-300 min-w-[95px] font-black text-emerald-900 bg-[#d1e7dd]"
                >
                  ভাড়া আদায়
                </th>
                <th
                  rowSpan={2}
                  className="p-2 border-r border-gray-300 min-w-[90px] font-black text-red-900 bg-[#f8d7da]"
                >
                  অবশিষ্ট বকেয়া
                </th>
                <th rowSpan={2} className="p-2 min-w-[110px] print:hidden">
                  অ্যাকশন
                </th>
              </tr>

              {/* Sub-Header for Electricity details */}
              <tr className="bg-amber-50/80 font-bold text-amber-900 text-[11px] border-b border-gray-300">
                <th className="p-1.5 border-r border-gray-300">
                  পূর্বের ইউনিট
                </th>
                <th className="p-1.5 border-r border-gray-300">
                  বর্তমান ইউনিট
                </th>
                <th className="p-1.5 border-r border-gray-300">
                  ব্যবহৃত ইউনিট
                </th>
                <th className="p-1.5 border-r border-gray-300">প্রতি ইউনিট</th>
                <th className="p-1.5 border-r border-gray-300">বিদ্যুৎ বিল</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {isIncomesLoading ? (
                <tr>
                  <td
                    colSpan={19}
                    className="p-8 text-center text-gray-500 font-medium"
                  >
                    ডেটা লোড হচ্ছে...
                  </td>
                </tr>
              ) : incomesList.length > 0 ? (
                incomesList.map((inc, idx) => {
                  const usedUnits = Math.max(
                    0,
                    (inc.currentUnit || 0) - (inc.previousUnit || 0)
                  );
                  const elecBill = usedUnits * (inc.rate || globalUnitRate);
                  const currentDue = Math.max(
                    0,
                    (inc.totalBill || 0) - (inc.totalReceived || 0)
                  );

                  return (
                    <tr
                      key={inc._id}
                      className="hover:bg-gray-50 transition-colors text-gray-800"
                    >
                      <td className="p-2 border-r border-gray-200 font-bold">
                        {(currentPage - 1) * pageSize + idx + 1}
                      </td>
                      <td className="p-2 border-r border-gray-200 font-semibold">
                        {inc.floor?.floorNo || 1} তলা
                      </td>
                      <td className="p-2 border-r border-gray-200 font-extrabold text-[#054a48]">
                        {inc.unit?.unitNo || "101"}
                      </td>
                      <td className="p-2 border-r border-gray-200 text-left">
                        <div className="font-bold text-gray-900">
                          {inc.user?.name || "N/A"}
                        </div>
                        <div className="text-[11px] text-gray-500">
                          {inc.user?.phoneNo || ""}
                        </div>
                      </td>
                      <td className="p-2 border-r border-gray-200 text-red-600 font-semibold">
                        {inc.previousDue > 0
                          ? `৳${inc.previousDue.toLocaleString()}`
                          : "-"}
                      </td>
                      <td className="p-2 border-r border-gray-200 font-bold">
                        ৳{inc.baseFare ? inc.baseFare.toLocaleString() : "0"}
                      </td>
                      <td className="p-2 border-r border-gray-200 text-blue-700 font-medium">
                        {inc.advanced > 0
                          ? `৳${inc.advanced.toLocaleString()}`
                          : "-"}
                      </td>
                      <td className="p-2 border-r border-gray-200">
                        {inc.liftBill > 0
                          ? `৳${inc.liftBill.toLocaleString()}`
                          : "-"}
                      </td>

                      {/* Electricity Breakdown */}
                      <td className="p-2 border-r border-gray-200 bg-amber-50/20 text-gray-700">
                        {inc.previousUnit || 0}
                      </td>
                      <td className="p-2 border-r border-gray-200 bg-amber-50/20 text-gray-900 font-bold">
                        {inc.currentUnit || 0}
                      </td>
                      <td className="p-2 border-r border-gray-200 bg-amber-50/20 font-bold text-amber-900">
                        {usedUnits}
                      </td>
                      <td className="p-2 border-r border-gray-200 bg-amber-50/20 text-amber-900 font-semibold">
                        ৳{inc.rate || globalUnitRate}
                      </td>
                      <td className="p-2 border-r border-gray-200 bg-amber-50/30 font-bold text-amber-900">
                        ৳{elecBill.toLocaleString()}
                      </td>

                      <td className="p-2 border-r border-gray-200">
                        {inc.gasBill > 0
                          ? `৳${inc.gasBill.toLocaleString()}`
                          : "-"}
                      </td>
                      <td className="p-2 border-r border-gray-200">
                        {inc.garageBill > 0
                          ? `৳${inc.garageBill.toLocaleString()}`
                          : "-"}
                      </td>
                      <td className="p-2 border-r border-gray-200 text-emerald-700 font-semibold bg-emerald-50/30">
                        {(inc.discount || 0) > 0
                          ? `৳${inc.discount?.toLocaleString()}`
                          : "-"}
                      </td>
                      <td className="p-2 border-r border-gray-200 font-black text-gray-900 bg-gray-100/70">
                        ৳{inc.totalBill ? inc.totalBill.toLocaleString() : 0}
                      </td>
                      <td className="p-2 border-r border-gray-200 font-black text-emerald-900 bg-emerald-50">
                        ৳
                        {inc.totalReceived
                          ? inc.totalReceived.toLocaleString()
                          : 0}
                      </td>
                      <td
                        className={`p-2 border-r border-gray-200 font-black ${
                          currentDue > 0
                            ? "text-red-700 bg-red-50"
                            : "text-emerald-700 bg-emerald-100/50"
                        }`}
                      >
                        ৳{currentDue.toLocaleString()}
                      </td>
                      <td className="p-2 print:hidden">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => onOpenDetailsModal(inc)}
                            title="রিসিট দেখুন / প্রিন্ট"
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <Eye size={15} />
                          </button>
                          <button
                            onClick={() => onOpenEditModal(inc)}
                            title="এডিট করুন"
                            className="p-1.5 text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors"
                          >
                            <Edit size={15} />
                          </button>
                          <button
                            onClick={() => onDeleteIncome(inc)}
                            title="ডিলিট করুন"
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan={19}
                    className="p-8 text-center text-gray-500 font-medium"
                  >
                    কোনো ভাড়ার আয় হিসাব রেকর্ড পাওয়া যায়নি।
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination Controls */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-600 print:hidden">
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
                      ? "bg-[#054a48] text-white font-bold"
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
    </div>
  );
}
