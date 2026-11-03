import {
  Building2,
  Home,
  FileText,
  CreditCard,
  Zap,
  Flame,
  Briefcase,
  Wallet,
  Calendar,
  Filter,
} from "lucide-react";
import { cn } from "../../../lib/utils";
import { useGetAdminDashboardQuery } from "../../../redux/features/dashboard/dashboardApi";
import { monthNamesBengali, yearOptions } from "../Reports/types";

interface StatsCardsProps {
  selectedMonth?: string;
  selectedYear?: number;
  onMonthChange?: (month: string) => void;
  onYearChange?: (year: number) => void;
}

const StatsCards = ({
  selectedMonth = "ALL",
  selectedYear = 2026,
  onMonthChange,
  onYearChange,
}: StatsCardsProps) => {
  const { data, isLoading, isFetching } = useGetAdminDashboardQuery({
    month: selectedMonth,
    year: selectedYear,
  });

  const stats = [
    {
      title: "খালি ইউনিট (Vacant Units)",
      value: data?.totalVacanceUnit ?? 0,
      subtitle: "উপলব্ধ ফাঁকা ফ্ল্যাট/ইউনিট",
      icon: Building2,
      iconBg: "bg-teal-50 text-teal-600 border border-teal-100",
    },
    {
      title: "ফ্ল্যাট ভাড়া (Flat Rent)",
      value: `৳ ${(data?.totalFlotRent || 0).toLocaleString()}`,
      subtitle: "ফিল্টারকৃত মাসের ভাড়া",
      icon: Home,
      iconBg: "bg-emerald-50 text-emerald-600 border border-emerald-100",
    },
    {
      title: "সর্বমোট বিল (Total Bills)",
      value: `৳ ${(data?.totalBills || 0).toLocaleString()}`,
      subtitle: "ফিল্টারকৃত মাসের মোট বিল",
      icon: FileText,
      iconBg: "bg-blue-50 text-blue-600 border border-blue-100",
    },
    {
      title: "মাসিক বকেয়া (Monthly Dues)",
      value: `৳ ${(data?.totalDues || 0).toLocaleString()}`,
      subtitle: "অবশিষ্ট অনাদায়ী বকেয়া বিল",
      icon: CreditCard,
      iconBg: "bg-rose-50 text-rose-600 border border-rose-100",
    },
    {
      title: "বিদ্যুৎ বিল (Electricity Bills)",
      value: `৳ ${(data?.electricityBills || 0).toLocaleString()}`,
      subtitle: "ফিল্টারকৃত মাসের মোট বিদ্যুৎ বিল",
      icon: Zap,
      iconBg: "bg-amber-50 text-amber-600 border border-amber-100",
    },
    {
      title: "গ্যাস বিল (Gas Bills)",
      value: `৳ ${(data?.gasBills || 0).toLocaleString()}`,
      subtitle: "ফিল্টারকৃত মাসের মোট গ্যাস বিল",
      icon: Flame,
      iconBg: "bg-orange-50 text-orange-600 border border-orange-100",
    },
    {
      title: "অফিস খরচ (Office Expense)",
      value: `৳ ${(data?.totalOfficeExpense || 0).toLocaleString()}`,
      subtitle: "ফিল্টারকৃত মাসের মোট অফিস খরচ",
      icon: Briefcase,
      iconBg: "bg-purple-50 text-purple-600 border border-purple-100",
    },
    {
      title: "মালিক খরচ (Owner Cost)",
      value: `৳ ${(data?.totalOwnerCost || 0).toLocaleString()}`,
      subtitle: "ফিল্টারকৃত মাসের মোট মালিক খরচ",
      icon: Wallet,
      iconBg: "bg-indigo-50 text-indigo-600 border border-indigo-100",
    },
  ];

  return (
    <div className="w-full space-y-3">
      {/* Filters bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-slate-200/70 shadow-2xs">
        <div className="text-sm font-bold text-slate-800 flex items-center gap-2">
          <span>ওভারভিউ পরিসংখ্যান (Dashboard Overview)</span>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Month Filter */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700">
            <Filter size={14} className="text-[#054a48]" />
            <select
              value={selectedMonth}
              onChange={(e) => onMonthChange && onMonthChange(e.target.value)}
              className="bg-transparent focus:outline-hidden cursor-pointer"
            >
              <option value="ALL">সকল মাস</option>
              {monthNamesBengali.map((m, idx) => (
                <option key={m} value={idx + 1}>
                  {m}
                </option>
              ))}
            </select>
          </div>

          {/* Year Filter */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700">
            <Calendar size={14} className="text-[#054a48]" />
            <select
              value={selectedYear}
              onChange={(e) => onYearChange && onYearChange(Number(e.target.value))}
              className="bg-transparent focus:outline-hidden cursor-pointer"
            >
              {yearOptions.map((y) => (
                <option key={y} value={y}>
                  {y} ইং
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {isLoading || isFetching
          ? Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-4 border border-slate-200/70 shadow-2xs animate-pulse flex flex-col justify-between h-28"
              >
                <div className="flex items-center justify-between">
                  <div className="h-4 bg-slate-200 rounded w-1/2"></div>
                  <div className="h-8 w-8 bg-slate-200 rounded-lg"></div>
                </div>
                <div className="mt-2">
                  <div className="h-6 bg-slate-200 rounded w-3/4"></div>
                  <div className="mt-1 h-3 bg-slate-100 rounded w-1/3"></div>
                </div>
              </div>
            ))
          : stats.map((stat, index) => {
              const Icon = stat.icon;

              return (
                <div
                  key={index}
                  className="bg-white rounded-xl p-3.5 sm:p-4 border border-slate-200/70 shadow-2xs hover:shadow-md transition-all duration-200 flex flex-col justify-between"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-xs font-semibold text-slate-600 tracking-tight">
                      {stat.title}
                    </span>
                    <div
                      className={cn(
                        "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg p-2 transition-transform duration-200 hover:scale-105",
                        stat.iconBg,
                      )}
                    >
                      <Icon className="h-4.5 w-4.5 stroke-[2.2]" />
                    </div>
                  </div>

                  <div className="mt-3">
                    <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                      {stat.value}
                    </h3>
                    <p className="mt-1 text-[11px] text-slate-400 font-medium">
                      {stat.subtitle}
                    </p>
                  </div>
                </div>
              );
            })}
      </div>
    </div>
  );
};

export default StatsCards;
