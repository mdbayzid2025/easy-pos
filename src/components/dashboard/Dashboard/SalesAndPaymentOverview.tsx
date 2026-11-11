import React, { useState } from "react";
import { ChevronDown, MoreHorizontal } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Bar,
  ComposedChart,
} from "recharts";
import { mockDashboardData } from "./mockDashboardData";

export const SalesAndPaymentOverview: React.FC = () => {
  const [timeRange, setTimeRange] = useState("Last 7 days");
  const { dailySales, paymentMethods } = mockDashboardData;

  // Custom tooltips
  const CustomSalesTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 text-white text-xs px-2.5 py-1.5 rounded shadow-md">
          <span className="font-semibold">৳{payload[0].value.toLocaleString()}</span>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
      {/* 1. Daily Sales Overview (Area + Subtle Pillars) */}
      <div className="lg:col-span-8 bg-white rounded-xl p-5 border border-slate-100 shadow-2xs">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm sm:text-base font-bold text-slate-800">
            Daily Sales Overview
          </h3>
          <div className="relative">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="text-xs font-medium text-slate-600 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg px-2.5 py-1.5 pr-7 appearance-none cursor-pointer focus:outline-none"
            >
              <option value="Last 7 days">Last 7 days</option>
              <option value="This Month">This Month</option>
              <option value="Last Month">Last Month</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-2.5 pointer-events-none" />
          </div>
        </div>

        {/* Chart Container */}
        <div className="h-64 sm:h-72 w-full relative">
          {/* Peak Badge indicator */}
          <div className="absolute top-1 left-[58%] -translate-x-1/2 text-[11px] font-bold text-slate-800 bg-white px-2 py-0.5 rounded shadow-2xs border border-slate-100 flex items-center gap-1 z-10 pointer-events-none">
            <span>৳95,000</span>
          </div>

          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={dailySales}
              margin={{ top: 20, right: 10, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="day"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "#64748b" }}
              />
              <YAxis hide domain={[0, 110000]} />
              <Tooltip content={<CustomSalesTooltip />} />

              {/* Background Pillar Bars */}
              <Bar
                dataKey="sales"
                barSize={32}
                radius={[4, 4, 0, 0]}
                fill="#ecfdf5"
              />

              {/* Foreground Smooth Curved Area */}
              <Area
                type="monotone"
                dataKey="sales"
                stroke="#10b981"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#salesGrad)"
                dot={(props: any) => {
                  const { cx, cy, payload } = props;
                  if (payload.isPeak) {
                    return (
                      <circle
                        key={cx}
                        cx={cx}
                        cy={cy}
                        r={4}
                        fill="#059669"
                        stroke="#ffffff"
                        strokeWidth={2}
                      />
                    );
                  }
                  return <React.Fragment key={cx} />;
                }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 2. Payment Method Donut Chart */}
      <div className="lg:col-span-4 bg-white rounded-xl p-5 border border-slate-100 shadow-2xs flex flex-col justify-between">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm sm:text-base font-bold text-slate-800">
            Payment Method
          </h3>
          <button
            type="button"
            className="text-slate-400 hover:text-slate-600 transition-colors p-1"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>

        {/* Donut Chart with Legend on the Right */}
        <div className="flex items-center justify-between flex-1 gap-2">
          {/* Chart Graphic with Center Label */}
          <div className="relative w-44 h-44 sm:w-48 sm:h-48 mx-auto flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={paymentMethods}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={68}
                  paddingAngle={2}
                  dataKey="percentage"
                  startAngle={90}
                  endAngle={-270}
                >
                  {paymentMethods.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>

            {/* Custom overlaid percentage callouts */}
            <div className="absolute top-4 right-10 text-[10px] font-bold text-emerald-800 pointer-events-none">
              5%
            </div>
            <div className="absolute top-10 left-6 text-[10px] font-bold text-emerald-700 pointer-events-none">
              15%
            </div>
            <div className="absolute bottom-11 left-6 text-[10px] font-bold text-emerald-800 pointer-events-none">
              18%
            </div>
            <div className="absolute bottom-8 right-6 text-[10px] font-bold text-emerald-100 pointer-events-none">
              62%
            </div>
          </div>

          {/* Legend Items matching screenshot colors */}
          <div className="space-y-2 text-xs font-medium text-slate-700 pr-2">
            {paymentMethods.map((method) => (
              <div key={method.name} className="flex items-center gap-2">
                <span
                  className="w-2.5 h-2.5 rounded-sm shrink-0"
                  style={{ backgroundColor: method.color }}
                />
                <span className="text-slate-700 font-semibold">{method.name}</span>
                <span className="text-slate-500">{method.percentage}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

