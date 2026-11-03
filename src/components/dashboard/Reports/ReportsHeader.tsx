import { BarChart3, Plus } from "lucide-react";
import { Button } from "../../ui/button";

interface ReportsHeaderProps {
  activeReportType: "income" | "expense";
  onSelectReportType: (type: "income" | "expense") => void;
  onOpenAddExpenseModal: () => void;
}

export default function ReportsHeader({
  activeReportType,
  onSelectReportType,
  onOpenAddExpenseModal,
}: ReportsHeaderProps) {
  return (
    <div className="bg-[#054a48] text-white rounded-2xl p-5 sm:p-7 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all duration-300">
      <div>
        <div className="flex items-center gap-2 mb-1.5">
          <span className="bg-white/20 text-white text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1.5 backdrop-blur-xs">
            <BarChart3 size={14} /> হিসাব ও রিপোর্টস ম্যানেজমেন্ট
          </span>
        </div>
        <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">
          {activeReportType === "income"
            ? "মাসিক মোট ভাড়ার (আয়) হিসাব রিপোর্ট"
            : "মাসিক খরচ (ব্যয়) হিসাব রিপোর্ট"}
        </h1>
        <p className="text-emerald-100 text-xs sm:text-sm mt-1 max-w-2xl">
          বিল্ডিং অনুযায়ী, সাল ও মাস নির্বাচন করে মাসিক সকল ভাড়া সংগ্রহ ও কেনাকাটা/রক্ষণাবেক্ষণ খরচের বিস্তারিত বিবরণী বিশ্লেষণ করুন।
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3 shrink-0">
        {/* Toggle Report Type Buttons */}
        <div className="bg-white/10 p-1 rounded-xl flex items-center gap-1 backdrop-blur-xs border border-white/20">
          <button
            onClick={() => onSelectReportType("income")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
              activeReportType === "income"
                ? "bg-white text-[#054a48] shadow-sm"
                : "text-white/90 hover:text-white"
            }`}
          >
            📊 আয় (ভাড়া) হিসাব
          </button>
          <button
            onClick={() => onSelectReportType("expense")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
              activeReportType === "expense"
                ? "bg-white text-[#054a48] shadow-sm"
                : "text-white/90 hover:text-white"
            }`}
          >
            💸 ব্যয় (খরচ) হিসাব
          </button>
        </div>

        {activeReportType === "expense" && (
          <Button
            onClick={onOpenAddExpenseModal}
            className="bg-white hover:bg-emerald-50 text-[#054a48] font-bold px-4 py-2 rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer text-xs"
          >
            <Plus size={16} /> + নতুন খরচ যুক্ত করুন
          </Button>
        )}
      </div>
    </div>
  );
}
