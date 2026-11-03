import { FileText, DollarSign, Receipt, Building2 } from "lucide-react";
import type { ReportCatalogItem } from "./types";

interface ReportsStatsProps {
  catalogList: ReportCatalogItem[];
}

export default function ReportsStats({ catalogList }: ReportsStatsProps) {
  const totalCount = catalogList.length;
  const incomeCount = catalogList.filter((r) => r.type === "income").length;
  const expenseCount = catalogList.filter((r) => r.type === "expense").length;
  const summaryCount = catalogList.filter((r) => r.type === "summary").length;

  const stats = [
    {
      title: "TOTAL REPORTS",
      value: totalCount,
      subtitle: "Available to open",
      icon: FileText,
      color: "bg-[#054a48] text-white",
    },
    {
      title: "INCOME REPORTS (আয়)",
      value: incomeCount,
      subtitle: "Rent collection & meters",
      icon: DollarSign,
      color: "bg-emerald-600 text-white",
    },
    {
      title: "EXPENSE REPORTS (ব্যয়)",
      value: expenseCount,
      subtitle: "Maintenance & vouchers",
      icon: Receipt,
      color: "bg-red-600 text-white",
    },
    {
      title: "BUILDING REPORTS (ভবন)",
      value: summaryCount,
      subtitle: "Property P&L summary",
      icon: Building2,
      color: "bg-purple-600 text-white",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, idx) => {
        const Icon = stat.icon;
        return (
          <div
            key={idx}
            className="bg-white rounded-2xl p-5 border border-gray-100 shadow-xs flex items-center justify-between hover:shadow-md transition-all duration-200"
          >
            <div>
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                {stat.title}
              </p>
              <h3 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
                {stat.value}
              </h3>
              <p className="text-xs text-gray-500 mt-1">{stat.subtitle}</p>
            </div>
            <div className={`p-3.5 rounded-2xl ${stat.color} shadow-sm shrink-0`}>
              <Icon size={22} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
