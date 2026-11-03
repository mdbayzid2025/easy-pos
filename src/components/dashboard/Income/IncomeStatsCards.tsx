import React from "react";
import {
  Building2,
  DollarSign,
  AlertCircle,
  Zap,
  Flame,
  Car,
  Receipt,
  CheckCircle2,
} from "lucide-react";
import { type IncomeRecord } from "./IncomeDetailsModal";

interface IncomeStatsCardsProps {
  incomesList: IncomeRecord[];
  globalUnitRate?: number;
}

export default function IncomeStatsCards({
  incomesList,
  globalUnitRate = 11,
}: IncomeStatsCardsProps) {
  // Detailed Summary Computations
  const stats = React.useMemo(() => {
    let totalBaseFare = 0;
    let totalPreviousDue = 0;
    let totalElectricityBill = 0;
    let totalGasBill = 0;
    let totalGarageBill = 0;
    let totalDemand = 0;
    let totalReceived = 0;

    incomesList.forEach((item) => {
      totalBaseFare += item.baseFare || 0;
      totalPreviousDue += item.previousDue || 0;

      const usedUnits = Math.max(
        0,
        (item.currentUnit || 0) - (item.previousUnit || 0)
      );
      const elecBill = usedUnits * (item.rate || globalUnitRate);
      totalElectricityBill += elecBill;

      totalGasBill += item.gasBill || 0;
      totalGarageBill += item.garageBill || 0;
      totalDemand += item.totalBill || 0;
      totalReceived += item.totalReceived || 0;
    });

    const totalDue = Math.max(0, totalDemand - totalReceived);

    return {
      totalBaseFare,
      totalPreviousDue,
      totalElectricityBill,
      totalGasBill,
      totalGarageBill,
      totalDemand,
      totalReceived,
      totalDue,
    };
  }, [incomesList, globalUnitRate]);

  const cards = [
    {
      title: "মোট ফ্ল্যাট ভাড়া",
      amount: stats.totalBaseFare,
      bgColor: "bg-blue-50",
      textColor: "text-blue-600",
      icon: Building2,
    },
    {
      title: "মোট পূর্বের বকেয়া",
      amount: stats.totalPreviousDue,
      bgColor: "bg-amber-50",
      textColor: "text-amber-600",
      icon: AlertCircle,
    },
    {
      title: "মোট বিদ্যুৎ বিল",
      amount: stats.totalElectricityBill,
      bgColor: "bg-yellow-50",
      textColor: "text-yellow-600",
      icon: Zap,
    },
    {
      title: "গ্যাস/পানি বিল",
      amount: stats.totalGasBill,
      bgColor: "bg-cyan-50",
      textColor: "text-cyan-600",
      icon: Flame,
    },
    {
      title: "গ্যারেজ ভাড়া",
      amount: stats.totalGarageBill,
      bgColor: "bg-indigo-50",
      textColor: "text-indigo-600",
      icon: Car,
    },
    {
      title: "সর্বমোট ভাড়া (দাবি)",
      amount: stats.totalDemand,
      bgColor: "bg-purple-50",
      textColor: "text-purple-700",
      icon: Receipt,
    },
    {
      title: "সর্বমোট আদায়",
      amount: stats.totalReceived,
      bgColor: "bg-emerald-50",
      textColor: "text-emerald-700",
      icon: CheckCircle2,
    },
    {
      title: "সর্বমোট বকেয়া",
      amount: stats.totalDue,
      bgColor: "bg-red-50",
      textColor: "text-red-600",
      icon: DollarSign,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4">
      {cards.map((card, idx) => {
        const IconComponent = card.icon;
        return (
          <div
            key={idx}
            className="bg-white p-4.5 rounded-xl border border-gray-200 shadow-xs flex items-center gap-3.5 transition-all hover:shadow-md"
          >
            <div
              className={`w-11 h-11 rounded-xl ${card.bgColor} ${card.textColor} flex items-center justify-center font-bold shrink-0`}
            >
              <IconComponent size={22} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs text-gray-500 font-medium truncate">
                {card.title}
              </p>
              <h3 className={`text-lg font-extrabold ${card.textColor} truncate`}>
                ৳ {card.amount.toLocaleString()}
              </h3>
            </div>
          </div>
        );
      })}
    </div>
  );
}
