import {
  ArrowLeft,
  Calendar,
  CreditCard,
  Edit,
  Filter,
  Landmark,
  Plus,
  Printer,
  Search,
  Trash2,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  useAddBankDepositMutation,
  useDeleteBankDepositMutation,
  useGetBankDepositsQuery,
  useUpdateBankDepositMutation,
  type BankDepositItem,
} from "../../../../redux/features/bank-deposit/bankDepositApi";
import { Button } from "../../../ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../../ui/dialog";
import { Input } from "../../../ui/input";
import { monthNamesBengali, yearOptions } from "../types";

const monthToNumMap: Record<string, number> = {
  জানুয়ারি: 1,
  ফেব্রুয়ারি: 2,
  মার্চ: 3,
  এপ্রিল: 4,
  মে: 5,
  জুন: 6,
  জুলাই: 7,
  আগস্ট: 8,
  সেপ্টেম্বর: 9,
  অক্টোবর: 10,
  নভেম্বর: 11,
  ডিসেম্বর: 12,
};

interface BankDepositReportTableProps {
  onBackToCatalog?: () => void;
}

export default function BankDepositReportTable({
  onBackToCatalog,
}: BankDepositReportTableProps) {
  // Filters State
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedYear, setSelectedYear] = useState<string>("ALL");
  const [selectedMonth, setSelectedMonth] = useState<string>("ALL");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Modal State for Add / Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<BankDepositItem | null>(null);

  // Form Fields State
  const [formData, setFormData] = useState({
    dateString: new Date().toISOString().split("T")[0],
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    title: "",
    description: "",
    note: "",
    amount: 0,
  });

  // RTK Mutations
  const [addBankDeposit, { isLoading: isAdding }] = useAddBankDepositMutation();
  const [updateBankDeposit, { isLoading: isUpdating }] =
    useUpdateBankDepositMutation();
  const [deleteBankDeposit] = useDeleteBankDepositMutation();

  // Reset page on filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedYear, selectedMonth, pageSize]);

  // Construct query payload for backend POST /bank-deposit/get-all?q=...
  const queryParams = useMemo(() => {
    const filterObj: Record<string, any> = {};

    if (selectedYear !== "ALL") {
      filterObj.year = Number(selectedYear);
    }
    if (selectedMonth !== "ALL") {
      const monthNum = monthToNumMap[selectedMonth];
      if (monthNum) {
        filterObj.month = monthNum;
      }
    }

    return {
      search: searchTerm.trim() || undefined,
      filter: Object.keys(filterObj).length ? filterObj : null,
      pagination: {
        currentPage: currentPage,
        pageSize: pageSize,
      },
    };
  }, [searchTerm, selectedYear, selectedMonth, currentPage, pageSize]);

  // API Query
  const { data: apiResponse, isLoading: isDepositsLoading } =
    useGetBankDepositsQuery(queryParams, { skip: false });

  const depositList: BankDepositItem[] = useMemo(() => {
    if (apiResponse && Array.isArray(apiResponse?.data)) {
      return apiResponse.data;
    }
    return [];
  }, [apiResponse]);

  const totalItems: number = useMemo(() => {
    if (typeof apiResponse?.count === "number") {
      return apiResponse.count;
    }
    return depositList.length;
  }, [apiResponse, depositList.length]);

  const totalPages = Math.ceil(totalItems / pageSize) || 1;

  const totalAmountSum = useMemo(() => {
    return depositList.reduce((acc, item) => acc + (item.amount || 0), 0);
  }, [depositList]);

  const handleOpenAddModal = () => {
    setEditingItem(null);
    const now = new Date();
    setFormData({
      dateString: now.toISOString().split("T")[0],
      year: now.getFullYear(),
      month: now.getMonth() + 1,
      title: "",
      description: "",
      note: "",
      amount: 0,
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item: BankDepositItem) => {
    setEditingItem(item);
    const itemDate = item.dateString ? new Date(item.dateString) : new Date();
    setFormData({
      dateString: item.dateString || new Date().toISOString().split("T")[0],
      year: item.year || itemDate.getFullYear(),
      month: item.month || itemDate.getMonth() + 1,
      title: item.title || "",
      description: item.description || "",
      note: item.note || "",
      amount: item.amount || 0,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingItem && editingItem._id) {
        await updateBankDeposit({
          id: editingItem._id,
          ...formData,
        }).unwrap();
      } else {
        await addBankDeposit(formData).unwrap();
      }
      setIsModalOpen(false);
    } catch (err) {
      console.error("Failed to save bank deposit:", err);
    }
  };

  const handleDelete = async (id: string) => {
    if (
      window.confirm(
        "আপনি কি নিশ্চিত যে এই ব্যাংক ডিপোজিট এন্ট্রি মুছে ফেলতে চান?",
      )
    ) {
      try {
        await deleteBankDeposit(id).unwrap();
      } catch (err) {
        console.error("Failed to delete bank deposit:", err);
      }
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const reportDateStr = new Date().toLocaleDateString("bn-BD", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="space-y-4">
      {/* Component Filter & Action Bar */}
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
                placeholder="টাইটেল, বিবরণ বা নোট দিয়ে খুঁজুন..."
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

          {/* Right Controls: Add & Print */}
          <div className="flex items-center gap-3 w-full lg:w-auto justify-end">
            <Button
              onClick={handleOpenAddModal}
              className="bg-[#054a48] hover:bg-[#085f5c] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 h-9 px-4 cursor-pointer shadow-xs"
            >
              <Plus size={16} /> নতুন ডিপোজিট যুক্ত করুন
            </Button>
            <Button
              onClick={handlePrint}
              variant="outline"
              className="rounded-xl text-xs font-bold text-gray-700 hover:text-[#054a48] border-gray-200 flex items-center gap-1.5 h-9 px-3.5 cursor-pointer"
            >
              <Printer size={15} /> প্রিন্ট / ডাউনলোড
            </Button>
          </div>
        </div>

        {/* Filter Dropdowns Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5 pt-2 border-t border-gray-100">
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
        {(selectedYear !== "ALL" || selectedMonth !== "ALL" || searchTerm) && (
          <div className="flex items-center justify-between text-xs text-gray-500 pt-1">
            <span>
              ফিল্টারকৃত মোট রেজাল্ট:{" "}
              <strong className="text-gray-800">{totalItems}</strong> টি ডিপোজিট
              রেকর্ড
            </span>
            <button
              onClick={() => {
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
              <Landmark size={24} className="text-[#054a48] print:hidden" />
              <span>ব্যাংক ডিপোজিট হিসাব রিপোর্ট</span>
            </h2>
            <p className="text-sm font-bold text-emerald-800 underline decoration-emerald-300 underline-offset-4 mt-1">
              (Bank Deposit Account Report) —{" "}
              {selectedMonth === "ALL" ? "সকল মাস" : `${selectedMonth} মাস`},{" "}
              {selectedYear === "ALL" ? "সকল বছর" : `${selectedYear} ইং`}
            </p>
          </div>

          <div className="text-right text-xs text-gray-500 font-medium print:text-black">
            <p>
              মোট ডিপোজিট রেকর্ড:{" "}
              <strong className="text-gray-800">{totalItems} টি</strong>
            </p>
            <p>
              মোট জমার পরিমাণ:{" "}
              <strong className="text-emerald-700 font-bold">
                ৳ {totalAmountSum.toLocaleString()}
              </strong>
            </p>
          </div>
        </div>

        {/* Bank Deposit Table */}
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
                <th className="p-3 border-r border-gray-300 min-w-[180px]">
                  টাইটেল (Title)
                </th>
                <th className="p-3 border-r border-gray-300 min-w-[220px]">
                  বিবরণ (Description)
                </th>
                <th className="p-3 border-r border-gray-300 min-w-[150px]">
                  নোট (Note)
                </th>
                <th className="p-3 border-r border-gray-300 min-w-[120px] text-right font-black text-gray-900 bg-gray-200/50">
                  পরিমাণ (৳)
                </th>
                <th className="p-3 text-center w-20 print:hidden">অ্যাকশন</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200 text-xs">
              {isDepositsLoading ? (
                <tr>
                  <td
                    colSpan={7}
                    className="py-12 text-center text-gray-500 font-medium"
                  >
                    ব্যাংক ডিপোজিট ডেটা লোড হচ্ছে...
                  </td>
                </tr>
              ) : depositList.length > 0 ? (
                depositList.map((item, idx) => (
                  <tr
                    key={item._id}
                    className="hover:bg-emerald-50/20 transition-colors text-gray-800"
                  >
                    <td className="p-3 border-r border-gray-200 text-center font-bold">
                      {(currentPage - 1) * pageSize + idx + 1}
                    </td>
                    <td className="p-3 border-r border-gray-200 font-semibold text-gray-700 whitespace-nowrap">
                      {item.dateString}
                    </td>
                    <td className="p-3 border-r border-gray-200 font-bold text-gray-900">
                      {item.title}
                    </td>
                    <td className="p-3 border-r border-gray-200 font-medium text-gray-600">
                      {item.description || "-"}
                    </td>
                    <td className="p-3 border-r border-gray-200 font-medium text-gray-500 italic">
                      {item.note || "-"}
                    </td>
                    <td className="p-3 border-r border-gray-200 text-right font-black text-emerald-700 bg-emerald-50/30 whitespace-nowrap">
                      ৳ {item.amount?.toLocaleString()}
                    </td>
                    <td className="p-3 text-center print:hidden whitespace-nowrap">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => handleOpenEditModal(item)}
                          className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded cursor-pointer"
                          title="এডিট"
                        >
                          <Edit size={15} />
                        </button>
                        <button
                          onClick={() => item._id && handleDelete(item._id)}
                          className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded cursor-pointer"
                          title="ডিলিট"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-gray-400">
                    <Landmark
                      size={36}
                      className="mx-auto text-gray-300 mb-2"
                    />
                    <p className="font-bold text-sm">
                      কোন ব্যাংক ডিপোজিট রেকর্ড পাওয়া যায়নি
                    </p>
                  </td>
                </tr>
              )}
            </tbody>

            {/* Total Footer */}
            {depositList.length > 0 && (
              <tfoot>
                <tr className="bg-emerald-100/80 font-black text-emerald-950 border-t-2 border-emerald-300 text-sm">
                  <td
                    colSpan={5}
                    className="p-3 border-r border-emerald-200 text-right uppercase tracking-wider"
                  >
                    সর্বমোট জমার পরিমাণ:
                  </td>
                  <td className="p-3 border-r border-emerald-200 text-right font-black text-base text-emerald-900 bg-emerald-200/90 whitespace-nowrap">
                    ৳ {totalAmountSum.toLocaleString()}
                  </td>
                  <td className="p-3 print:hidden"></td>
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

      {/* Add / Edit Bank Deposit Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-lg bg-white rounded-2xl p-6">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <CreditCard className="text-[#054a48]" size={20} />
              {editingItem
                ? "ডিপোজিট এডিট করুন"
                : "নতুন ব্যাংক ডিপোজিট যুক্ত করুন"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 mt-2">
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">
                  তারিখ (DateString) *
                </label>
                <Input
                  type="date"
                  required
                  value={formData.dateString}
                  onChange={(e) => {
                    const dateVal = e.target.value;
                    const d = dateVal ? new Date(dateVal) : new Date();
                    setFormData({
                      ...formData,
                      dateString: dateVal,
                      year: d.getFullYear(),
                      month: d.getMonth() + 1,
                    });
                  }}
                  className="w-full text-xs"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">
                  মাস (Month) *
                </label>
                <select
                  value={formData.month}
                  onChange={(e) =>
                    setFormData({ ...formData, month: Number(e.target.value) })
                  }
                  className="w-full h-9 bg-white border border-gray-200 rounded-md text-xs px-2 font-medium focus:outline-hidden"
                >
                  {monthNamesBengali.map((mName, idx) => (
                    <option key={mName} value={idx + 1}>
                      {mName} ({idx + 1})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">
                  বছর (Year) *
                </label>
                <Input
                  type="number"
                  required
                  value={formData.year}
                  onChange={(e) =>
                    setFormData({ ...formData, year: Number(e.target.value) })
                  }
                  className="w-full text-xs"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">
                টাইটেল (Title) *
              </label>
              <Input
                type="text"
                required
                placeholder="যেমন: ডাচ বাংলা ব্যাংক জমা"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="w-full text-xs"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">
                টাকার পরিমাণ (Amount) *
              </label>
              <Input
                type="number"
                required
                min={0}
                placeholder="0.00"
                value={formData.amount}
                onChange={(e) =>
                  setFormData({ ...formData, amount: Number(e.target.value) })
                }
                className="w-full text-xs"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">
                বিবরণ (Description)
              </label>
              <Input
                type="text"
                placeholder="ডিপোজিট বিস্তারিত বিবরণ..."
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full text-xs"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">
                নোট (Note)
              </label>
              <Input
                type="text"
                placeholder="অতিরিক্ত নোট..."
                value={formData.note}
                onChange={(e) =>
                  setFormData({ ...formData, note: e.target.value })
                }
                className="w-full text-xs"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsModalOpen(false)}
                className="text-xs font-bold"
              >
                বাতিল
              </Button>
              <Button
                type="submit"
                disabled={isAdding || isUpdating}
                className="bg-[#054a48] hover:bg-[#085f5c] text-white text-xs font-bold"
              >
                {isAdding || isUpdating ? "সংরক্ষণ হচ্ছে..." : "সংরক্ষণ করুন"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
