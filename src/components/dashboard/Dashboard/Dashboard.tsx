import React from "react";
import { Calendar } from "lucide-react";
import { TodayStatsCards } from "./TodayStatsCards";
import { SalesAndPaymentOverview } from "./SalesAndPaymentOverview";
import { ProductsAndStockSection } from "./ProductsAndStockSection";
import { mockDashboardData } from "./mockDashboardData";

const Dashboard: React.FC = () => {
  const { userName, currentDate } = mockDashboardData;

  return (
    <div className="w-full min-h-screen bg-[#f8fafc] p-4 sm:p-6 lg:p-8 space-y-6">
      {/* 1. Welcome Greeting Header with Date Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Welcome back, {userName}!
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Here's what's happening in your store today.
          </p>
        </div>

        {/* Date Selector Badge */}
        <div className="flex items-center gap-2 bg-white border border-slate-200/80 rounded-lg px-3 py-1.5 shadow-2xs text-slate-600 text-xs font-semibold self-start sm:self-auto cursor-pointer hover:bg-slate-50 transition-colors">
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
          <span>{currentDate}</span>
        </div>
      </div>

      {/* 2. Top Metric Cards (Today's Sales, Orders, Expenses, Profit + Stock Summary) */}
      <TodayStatsCards />

      {/* 3. Middle Section: Daily Sales Overview & Payment Methods Donut */}
      <SalesAndPaymentOverview />

      {/* 4. Bottom Section: Top Selling Products & Low Stock Alerts */}
      <ProductsAndStockSection />
    </div>
  );
};

export default Dashboard;
