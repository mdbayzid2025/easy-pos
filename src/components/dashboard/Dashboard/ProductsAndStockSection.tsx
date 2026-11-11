import React from "react";
import { MoreHorizontal } from "lucide-react";
import { mockDashboardData } from "./mockDashboardData";

export const ProductsAndStockSection: React.FC = () => {
  const { topSellingProducts, lowStockAlerts } = mockDashboardData;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
      {/* 1. Top Selling Products (takes 7 cols on lg) */}
      <div className="lg:col-span-7 bg-white rounded-xl p-5 border border-slate-100 shadow-2xs">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm sm:text-base font-bold text-slate-800">
            Top Selling Products
          </h3>
          <button
            type="button"
            className="text-slate-400 hover:text-slate-600 transition-colors p-1"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="text-slate-400 font-semibold border-b border-slate-100">
                <th className="pb-2.5 font-medium">Product</th>
                <th className="pb-2.5 font-medium">Category</th>
                <th className="pb-2.5 font-medium text-center">Sold</th>
                <th className="pb-2.5 font-medium text-right">Revenue</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {topSellingProducts.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-2.5 pr-2">
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-7 h-7 rounded-md flex items-center justify-center text-sm shrink-0 ${item.iconBg}`}
                      >
                        {item.iconText}
                      </div>
                      <span className="font-semibold text-slate-800 line-clamp-1">
                        {item.name}
                      </span>
                    </div>
                  </td>
                  <td className="py-2.5 text-slate-500">{item.category}</td>
                  <td className="py-2.5 text-slate-700 font-medium text-center">
                    {item.sold}
                  </td>
                  <td className="py-2.5 text-right font-bold text-slate-900">
                    ৳{item.revenue.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 2. Low Stock Alert (takes 5 cols on lg) */}
      <div className="lg:col-span-5 bg-white rounded-xl p-5 border border-slate-100 shadow-2xs">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm sm:text-base font-bold text-slate-800">
            Low Stock Alert
          </h3>
          <button
            type="button"
            className="text-slate-400 hover:text-slate-600 transition-colors p-1"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="text-slate-400 font-semibold border-b border-slate-100">
                <th className="pb-2.5 font-medium">Product</th>
                <th className="pb-2.5 font-medium text-center">In Stock</th>
                <th className="pb-2.5 font-medium text-center">Reorder Level</th>
                <th className="pb-2.5 font-medium text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {lowStockAlerts.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-2.5 pr-2">
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-7 h-7 rounded-md flex items-center justify-center text-sm shrink-0 ${item.iconBg}`}
                      >
                        {item.iconText}
                      </div>
                      <span className="font-semibold text-slate-800 line-clamp-1">
                        {item.name}
                      </span>
                    </div>
                  </td>
                  <td className="py-2.5 text-slate-700 font-semibold text-center">
                    {item.inStock}
                  </td>
                  <td className="py-2.5 text-slate-500 text-center">
                    {item.reorderLevel}
                  </td>
                  <td className="py-2.5 text-right">
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-rose-50 text-rose-500 border border-rose-100">
                      {item.leftCount} left
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

