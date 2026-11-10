import { useState, useMemo } from "react";
import { Calendar } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useGetBankDepositChartQuery } from "../../../redux/features/dashboard/dashboardApi";
import { yearOptions } from "../../../lib/dateConstants";

export function DepositChart() {
  const [selectedYear, setSelectedYear] = useState<number>(2026);
  const { data: apiChartData, isLoading } =
    useGetBankDepositChartQuery(selectedYear);

  const chartData = useMemo(() => {
    if (Array.isArray(apiChartData)) {
      return apiChartData;
    }
    return [
      { month: "Jan", amount: 0 },
      { month: "Feb", amount: 0 },
      { month: "Mar", amount: 0 },
      { month: "Apr", amount: 0 },
      { month: "May", amount: 0 },
      { month: "Jun", amount: 0 },
      { month: "Jul", amount: 0 },
      { month: "Aug", amount: 0 },
      { month: "Sep", amount: 0 },
      { month: "Oct", amount: 0 },
      { month: "Nov", amount: 0 },
      { month: "Dec", amount: 0 },
    ];
  }, [apiChartData]);

  // Dynamic YAxis max with headroom for label text
  const maxAmount = Math.max(...chartData.map((d) => d.amount || 0), 10000);
  const yAxisMax = Math.ceil((maxAmount * 1.25) / 10000) * 10000;

  return (
    <div className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200/70 shadow-2xs w-full flex flex-col col-span-1 lg:col-span-2">
      {/* <div className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200/70 shadow-2xs w-full flex flex-col col-span-1 lg:col-span-2"> */}
      {/* Header section */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <div>
          <h3 className="text-lg sm:text-xl font-bold text-slate-900 mt-0.5">
            মাসিক ব্যাংক ডিপোজিট (Bank Deposit Chart)
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            মাসভিত্তিক মোট জমাকৃত ডিপোজিট ({selectedYear} ইং)
          </p>
        </div>

        {/* Legend & Year Selector */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs font-semibold">
            <span className="h-3 w-3 rounded-xs bg-[#2563eb] inline-block" />
            <span className="text-slate-700">ডিপোজিট</span>
          </div>

          {/* Year Filter Dropdown */}
          <div className="flex items-center gap-1 bg-blue-50/80 border border-blue-200 px-2.5 py-1 rounded-lg text-xs">
            <Calendar size={13} className="text-[#2563eb] shrink-0" />
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="bg-transparent font-bold text-[#2563eb] focus:outline-hidden cursor-pointer"
            >
              {yearOptions.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="w-full h-[280px] sm:h-[320px]">
        {isLoading ? (
          <div className="w-full h-full flex items-center justify-center text-xs text-slate-400">
            লোডিং চার্ট ডেটা...
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 25, right: 10, left: -10, bottom: 5 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#e2e8f0"
              />
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#64748b", fontSize: 11 }}
                dy={5}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#64748b", fontSize: 10 }}
                domain={[0, yAxisMax]}
              />
              <Tooltip
                content={({ active, payload }: any) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="rounded-lg border bg-white p-2 shadow-md text-xs">
                        <p className="font-semibold text-slate-800 mb-0.5">
                          {data.month} {selectedYear}
                        </p>
                        <p className="text-[#2563eb] font-medium">
                          ডিপোজিট: ৳ {(data.amount || 0).toLocaleString()}
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar
                dataKey="amount"
                fill="#2563eb"
                radius={[4, 4, 0, 0]}
                maxBarSize={28}
              >
                <LabelList
                  dataKey="amount"
                  position="top"
                  formatter={(val: any) =>
                    typeof val === "number" && val > 0
                      ? `৳${val.toLocaleString()}`
                      : ""
                  }
                  style={{
                    fontSize: "9px",
                    fill: "#2563eb",
                    fontWeight: "bold",
                  }}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
