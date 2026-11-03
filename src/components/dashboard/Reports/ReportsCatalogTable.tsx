import { ExternalLink, DollarSign, Receipt, Building2, Landmark } from "lucide-react";
import { Button } from "../../ui/button";
import { Badge } from "../../ui/badge";
import type { ReportCatalogItem } from "./types";

interface ReportsCatalogTableProps {
  catalogList: ReportCatalogItem[];
  onOpenReport: (report: ReportCatalogItem) => void;
}

export default function ReportsCatalogTable({
  catalogList,
  onOpenReport,
}: ReportsCatalogTableProps) {
  const getIcon = (type: string) => {
    switch (type) {
      case "dollar":
        return <DollarSign size={18} className="text-emerald-600" />;
      case "receipt":
        return <Receipt size={18} className="text-red-600" />;
      case "bank":
        return <Landmark size={18} className="text-blue-600" />;
      default:
        return <Building2 size={18} className="text-purple-600" />;
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
      {/* Catalog Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="bg-gray-100/70 border-y border-gray-100 text-gray-500 text-xs font-extrabold uppercase tracking-wider">
              <th className="py-3.5 px-4 sm:px-6 w-16">কোড</th>
              <th className="py-3.5 px-4 sm:px-6">REPORT</th>
              <th className="py-3.5 px-4 sm:px-6 w-32">বিভাগ</th>
              <th className="py-3.5 px-4 sm:px-6 text-right w-28">অ্যাকশন</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {catalogList.map((report) => (
              <tr
                key={report.id}
                className="hover:bg-emerald-50/20 transition-colors group cursor-pointer"
                onClick={() => onOpenReport(report)}
              >
                <td className="py-4 px-4 sm:px-6 font-mono font-bold text-gray-500">
                  {report.code}
                </td>
                <td className="py-4 px-4 sm:px-6">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-xl bg-gray-100 shrink-0 mt-0.5 group-hover:bg-white transition-colors">
                      {getIcon(report.iconType)}
                    </div>
                    <div>
                      <h4 className="font-extrabold text-gray-900 group-hover:text-[#054a48] transition-colors text-sm sm:text-base">
                        {report.title}
                      </h4>
                      <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">
                        {report.subtitle}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4 sm:px-6 whitespace-nowrap">
                  <Badge
                    variant="outline"
                    className={`text-[11px] font-extrabold px-2.5 py-0.5 rounded-md ${
                      report.category === "আয়"
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : report.category === "ব্যয়"
                        ? "bg-red-50 text-red-700 border-red-200"
                        : report.category === "ডিপোজিট"
                        ? "bg-blue-50 text-blue-700 border-blue-200"
                        : "bg-purple-50 text-purple-700 border-purple-200"
                    }`}
                  >
                    {report.category}
                  </Badge>
                </td>
                <td className="py-4 px-4 sm:px-6 text-right whitespace-nowrap">
                  <Button
                    size="sm"
                    className="bg-[#054a48] hover:bg-[#085f5c] text-white font-bold text-xs px-3.5 py-1.5 rounded-xl shadow-xs inline-flex items-center gap-1.5 cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenReport(report);
                    }}
                  >
                    <ExternalLink size={13} /> Open
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
