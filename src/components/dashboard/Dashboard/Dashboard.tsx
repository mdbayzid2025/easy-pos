import { useState } from "react";
import { BookingUsersChart } from "./BookingUsersChart";
import { RevenueChart } from "./RevenueChart";
import { DepositChart } from "./DepositChart";
import StatsCards from "./Statics";

const Dashboard = () => {
  const [selectedMonth, setSelectedMonth] = useState<string>("ALL");
  const [selectedYear, setSelectedYear] = useState<number>(2026);

  return (
    <div className="w-full p-4 sm:p-6 space-y-6 pb-10">
      {/* 1. Top: Stats Cards with Month and Year filtering */}
      <StatsCards
        selectedMonth={selectedMonth}
        selectedYear={selectedYear}
        onMonthChange={setSelectedMonth}
        onYearChange={setSelectedYear}
      />

      {/* 2. Bottom: 3 Responsive Charts (Income, Expense, Bank Deposit) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6">
        <RevenueChart />
        <BookingUsersChart />
        <DepositChart />
      </div>
    </div>
  );
};

export default Dashboard;
