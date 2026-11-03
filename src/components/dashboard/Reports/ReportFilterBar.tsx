import { Building2, Calendar, Printer, ArrowLeft } from "lucide-react";
import { Button } from "../../ui/button";
import type { Building } from "../Building/types";
import { monthNamesBengali, yearOptions } from "./types";

interface ReportFilterBarProps {
  buildings: Building[];
  selectedBuildingId: string;
  onSelectBuildingId: (id: string) => void;
  selectedYear: number;
  onSelectYear: (year: number) => void;
  selectedMonth: string;
  onSelectMonth: (month: string) => void;
  onBackToCatalog: () => void;
  onPrint: () => void;
}

export default function ReportFilterBar({
  buildings,
  selectedBuildingId,
  onSelectBuildingId,
  selectedYear,
  onSelectYear,
  selectedMonth,
  onSelectMonth,
  onBackToCatalog,
  onPrint,
}: ReportFilterBarProps) {
  return (
    <div className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-100 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
      {/* Left Back & Building Selector */}
      <div className="flex flex-wrap items-center gap-3">
        <Button
          onClick={onBackToCatalog}
          variant="outline"
          className="rounded-xl text-xs font-bold text-[#054a48] bg-emerald-50/50 border-emerald-200 hover:bg-emerald-100 flex items-center gap-1.5 h-9 px-3.5"
        >
          <ArrowLeft size={15} /> ← রিপোর্ট এর তালিকায় ফিরে যান
        </Button>

        {/* Building Selector */}
        <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-xl">
          <Building2 size={16} className="text-[#054a48] shrink-0" />
          <select
            value={selectedBuildingId}
            onChange={(e) => onSelectBuildingId(e.target.value)}
            className="bg-transparent text-xs font-bold text-gray-800 focus:outline-none cursor-pointer pr-2"
          >
            <option value="ALL">সকল ভবন & জেনারেল খরচ</option>
            <option value="GENERAL">শুধুমাত্র জেনারেল (অফিস খরচ)</option>
            {buildings.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name} ({b.code})
              </option>
            ))}
          </select>
        </div>

        {/* Month Selector */}
        <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-xl">
          <Calendar size={16} className="text-emerald-600 shrink-0" />
          <select
            value={selectedMonth}
            onChange={(e) => onSelectMonth(e.target.value)}
            className="bg-transparent text-xs font-bold text-gray-800 focus:outline-none cursor-pointer pr-2"
          >
            {monthNamesBengali.map((m) => (
              <option key={m} value={m}>
                {m} মাস
              </option>
            ))}
          </select>
        </div>

        {/* Year Selector */}
        <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-xl">
          <span className="text-xs font-bold text-gray-500">সাল:</span>
          <select
            value={selectedYear}
            onChange={(e) => onSelectYear(Number(e.target.value))}
            className="bg-transparent text-xs font-bold text-gray-800 focus:outline-none cursor-pointer pr-2"
          >
            {yearOptions.map((y) => (
              <option key={y} value={y}>
                {y} ইং
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Right Print Button */}
      <div className="flex items-center gap-3 justify-end">
        <Button
          onClick={onPrint}
          variant="outline"
          className="rounded-xl text-xs font-bold text-gray-700 hover:text-[#054a48] border-gray-200 flex items-center gap-1.5 h-9 px-3.5"
        >
          <Printer size={15} /> প্রিন্ট / ডাউনলোড
        </Button>
      </div>
    </div>
  );
}
