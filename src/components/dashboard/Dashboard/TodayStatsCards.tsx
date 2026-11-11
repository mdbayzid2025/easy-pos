import React from "react";
import { Calendar, FileText, DollarSign, TrendingUp } from "lucide-react";
import { mockDashboardData } from "./mockDashboardData";

export const TodayStatsCards: React.FC = () => {
  const { todayStats, stockSummary } = mockDashboardData;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-12 gap-4">
      {/* 4 Today Stats Cards (taking 8 cols on xl) */}
      <div className="xl:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        {/* 1. Today's Sales */}
        <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-2xs hover:shadow-sm transition-shadow flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium text-slate-500">Today's Sales</span>
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              ৳{todayStats.sales.amount.toLocaleString()}
            </div>
            <div className="mt-2 flex items-center">
              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-600">
                {todayStats.sales.change}
              </span>
            </div>
          </div>
        </div>

        {/* 2. Today's Orders */}
        <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-2xs hover:shadow-sm transition-shadow flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium text-slate-500">Today's Orders</span>
            <FileText className="w-3.5 h-3.5 text-slate-400" />
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              {todayStats.orders.count} <span className="text-sm font-medium text-slate-500">orders</span>
            </div>
            <div className="mt-2 flex items-center">
              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-600">
                {todayStats.orders.change}
              </span>
            </div>
          </div>
        </div>

        {/* 3. Today's Expenses */}
        <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-2xs hover:shadow-sm transition-shadow flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium text-slate-500">Today's Expenses</span>
            <DollarSign className="w-3.5 h-3.5 text-slate-400" />
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              ৳{todayStats.expenses.amount.toLocaleString()}
            </div>
            <div className="mt-2 flex items-center">
              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[11px] font-semibold bg-rose-50 text-rose-500">
                {todayStats.expenses.change}
              </span>
            </div>
          </div>
        </div>

        {/* 4. Today's Profit */}
        <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-2xs hover:shadow-sm transition-shadow flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium text-slate-500">Today's Profit</span>
            <TrendingUp className="w-3.5 h-3.5 text-slate-400" />
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              ৳{todayStats.profit.amount.toLocaleString()}
            </div>
            <div className="mt-2 flex items-center">
              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-600">
                {todayStats.profit.change}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Stock Summary Card (takes 4 cols on xl) */}
      <div className="xl:col-span-4 bg-white rounded-xl p-4 sm:p-5 border border-slate-100 shadow-2xs flex flex-col justify-between">
        <div className="flex items-baseline justify-between pb-3 border-b border-slate-100">
          <span className="text-xs font-medium text-slate-500">Total Stock Value</span>
          <span className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            ৳{stockSummary.totalStockValue.toLocaleString()}
          </span>
        </div>
        <div className="grid grid-cols-2 gap-4 pt-3">
          <div>
            <div className="text-[11px] font-medium text-slate-400">Customer Due</div>
            <div className="text-base sm:text-lg font-bold text-slate-800 mt-0.5">
              ৳{stockSummary.customerDue.toLocaleString()}
            </div>
          </div>
          <div className="border-l border-slate-100 pl-4">
            <div className="text-[11px] font-medium text-slate-400">Supplier Due</div>
            <div className="text-base sm:text-lg font-bold text-slate-800 mt-0.5">
              ৳{stockSummary.supplierDue.toLocaleString()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

