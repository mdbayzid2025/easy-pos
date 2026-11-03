import { useState, useMemo, useEffect } from "react";
import { ArrowLeft, Calendar, Building2, Printer, Plus, Trash2, Save, Edit2 } from "lucide-react";
import { useGetIncomesQuery } from "../../../../redux/features/income/incomeApi";
import { useGetExpensesQuery } from "../../../../redux/features/expense/expenseApi";
import { useGetBuildingsQuery } from "../../../../redux/features/building/buildingApi";
import { useGetBankDepositsQuery } from "../../../../redux/features/bank-deposit/bankDepositApi";
import {
  useGetOpeningBalancesQuery,
  useAddOpeningBalanceMutation,
  useUpdateOpeningBalanceMutation,
} from "../../../../redux/features/opening-balance/openingBalanceApi";
import { monthNamesBengali, yearOptions } from "../types";
import { Button } from "../../../ui/button";
import { toast } from "sonner";

interface SummaryReportViewProps {
  onBackToCatalog?: () => void;
}

interface OtherIncomeItem {
  id: string;
  title: string;
  amount: number;
}

const bengaliToEnglishMonthMap: Record<string, string> = {
  জানুয়ারি: "January",
  ফেব্রুয়ারি: "February",
  মার্চ: "March",
  এপ্রিল: "April",
  মে: "May",
  জুন: "June",
  জুলাই: "July",
  আগস্ট: "August",
  সেপ্টেম্বর: "September",
  অক্টোবর: "October",
  নভেম্বর: "November",
  ডিসেম্বর: "December",
};

const monthToNumMap: Record<string, number> = {
  জানুয়ারি: 1,
  ফেব্রুয়ারি: 2,
  মার্চ: 3,
  এপ্রিল: 4,
  মে: 5,
  জুন: 6,
  জুলাই: 7,
  আগস্ট: 8,
  সেপ্টেম্বর: 9,
  অক্টোবর: 10,
  নভেম্বর: 11,
  ডিসেম্বর: 12,
};

const defaultLastMonth = (() => {
  const now = new Date();
  const d = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  return {
    monthName: monthNamesBengali[d.getMonth()] || "আগস্ট",
    yearNum: d.getFullYear(),
  };
})();

export default function SummaryReportView({ onBackToCatalog }: SummaryReportViewProps) {
  const [selectedMonth, setSelectedMonth] = useState<string>(defaultLastMonth.monthName);
  const [selectedYear, setSelectedYear] = useState<number>(defaultLastMonth.yearNum);

  // Editable states
  const [openingBalance, setOpeningBalance] = useState<number>(0);
  const [isEditingOB, setIsEditingOB] = useState<boolean>(false);
  const [otherIncomes, setOtherIncomes] = useState<OtherIncomeItem[]>([]);
  const [newTitle, setNewTitle] = useState("");
  const [newAmount, setNewAmount] = useState<number | "">("");

  // RTK Queries
  const { data: apiBuildingsData } = useGetBuildingsQuery(undefined);
  const buildings = useMemo(() => {
    if (apiBuildingsData && Array.isArray(apiBuildingsData?.data)) {
      return apiBuildingsData.data;
    }
    return [];
  }, [apiBuildingsData]);

  // Income Query (Rent & Advance)
  const incomePayload = useMemo(() => {
    const filterObj: Record<string, any> = {};
    if (selectedMonth && selectedMonth !== "ALL") {
      const engMonth = bengaliToEnglishMonthMap[selectedMonth] || selectedMonth;
      filterObj.month = { $in: [engMonth, selectedMonth] };
    }
    if (selectedYear) {
      filterObj.year = selectedYear;
    }
    return { filter: filterObj };
  }, [selectedMonth, selectedYear]);

  const { data: incomeResponse } = useGetIncomesQuery(incomePayload);

  // Expense Query
  const expensePayload = useMemo(() => {
    const filterObj: Record<string, any> = {};
    if (selectedMonth && selectedMonth !== "ALL") {
      const mNum = monthToNumMap[selectedMonth];
      if (mNum) filterObj.month = mNum;
    }
    if (selectedYear) {
      filterObj.year = selectedYear;
    }
    return { filter: filterObj };
  }, [selectedMonth, selectedYear]);

  const { data: expenseResponse } = useGetExpensesQuery(expensePayload);

  // Bank Deposit Query
  const depositPayload = useMemo(() => {
    const filterObj: Record<string, any> = {};
    if (selectedMonth && selectedMonth !== "ALL") {
      const mNum = monthToNumMap[selectedMonth];
      if (mNum) filterObj.month = mNum;
    }
    if (selectedYear) {
      filterObj.year = selectedYear;
    }
    return { filter: filterObj };
  }, [selectedMonth, selectedYear]);

  const { data: depositResponse } = useGetBankDepositsQuery(depositPayload);

  // Opening Balance Query & Mutation
  const monthNum = monthToNumMap[selectedMonth] || 1;
  const { data: obData } = useGetOpeningBalancesQuery({
    filter: { month: monthNum, year: selectedYear },
  });
  const [addOpeningBalance] = useAddOpeningBalanceMutation();
  const [updateOpeningBalance] = useUpdateOpeningBalanceMutation();

  const obDoc = useMemo(() => {
    if (obData && Array.isArray(obData?.data) && obData.data.length > 0) {
      return obData.data[0];
    }
    return null;
  }, [obData]);

  useEffect(() => {
    if (obDoc) {
      setOpeningBalance(obDoc.amount || 0);
      if (obDoc.description) {
        try {
          const parsed = JSON.parse(obDoc.description);
          if (Array.isArray(parsed)) setOtherIncomes(parsed);
        } catch {
          // Fallback if plain text description
        }
      } else {
        setOtherIncomes([]);
      }
    } else {
      setOpeningBalance(0);
      setOtherIncomes([]);
    }
  }, [obDoc]);

  // Extract arrays
  const incomeList = useMemo(() => {
    if (!incomeResponse) return [];
    if (Array.isArray(incomeResponse)) return incomeResponse;
    if (Array.isArray(incomeResponse?.data)) return incomeResponse.data;
    return [];
  }, [incomeResponse]);

  const expenseList = useMemo(() => {
    if (!expenseResponse) return [];
    if (Array.isArray(expenseResponse)) return expenseResponse;
    if (Array.isArray(expenseResponse?.data)) return expenseResponse.data;
    return [];
  }, [expenseResponse]);

  const depositList = useMemo(() => {
    if (!depositResponse) return [];
    if (Array.isArray(depositResponse)) return depositResponse;
    if (Array.isArray(depositResponse?.data)) return depositResponse.data;
    return [];
  }, [depositResponse]);

  // Building-wise Rent Incomes
  const buildingIncomes = useMemo(() => {
    const map: Record<string, { name: string; amount: number }> = {};
    buildings.forEach((b: any) => {
      const bId = b._id || b.id;
      map[bId] = { name: b.name, amount: 0 };
    });

    incomeList.forEach((inc: any) => {
      const bId = inc.building?._id || inc.building?.id;
      const rec = inc.totalReceived || 0;
      if (bId && map[bId]) {
        map[bId].amount += rec;
      } else if (bId) {
        map[bId] = { name: inc.building?.name || "ভবন", amount: rec };
      }
    });

    return Object.values(map);
  }, [buildings, incomeList]);

  const totalBuildingRentIncome = useMemo(() => {
    return buildingIncomes.reduce((acc, curr) => acc + curr.amount, 0);
  }, [buildingIncomes]);

  // Flat Booking Advances
  const flatBookingAdvances = useMemo(() => {
    const list: Array<{ bName: string; unitNo: string; amount: number }> = [];
    incomeList.forEach((inc: any) => {
      if (inc.advanced && inc.advanced > 0) {
        list.push({
          bName: inc.building?.name || "ভবন",
          unitNo: inc.unit?.unitNo || "---",
          amount: inc.advanced,
        });
      }
    });
    return list;
  }, [incomeList]);

  const totalBookingAdvance = useMemo(() => {
    return flatBookingAdvances.reduce((acc, item) => acc + item.amount, 0);
  }, [flatBookingAdvances]);

  // Total Other Incomes
  const totalOtherIncomes = useMemo(() => {
    return otherIncomes.reduce((acc, item) => acc + item.amount, 0);
  }, [otherIncomes]);

  // Financial Grand Totals from Backend calculation object (with fallback to client list calculations)
  const backendCalculation = obData?.calculation;

  const totalIncomeSum = backendCalculation?.totalIncome ?? (totalBuildingRentIncome + totalBookingAdvance + totalOtherIncomes);
  const totalBankDeposit = backendCalculation?.totalBankDeposit ?? depositList.reduce((acc: number, item: any) => acc + (item.amount || 0), 0);
  const totalOfficeExpense = backendCalculation?.totalExpense ?? expenseList.reduce((acc: number, item: any) => acc + (item.amount || 0), 0);

  const officeCash = backendCalculation?.officeCash ?? (openingBalance + totalIncomeSum - totalBankDeposit);
  const officeRemainingBalance = backendCalculation?.officeRemainingBalance ?? (officeCash - totalOfficeExpense);

  // Persistence handler
  const handleSaveOBAndOthers = async (newOB: number, newOthers: OtherIncomeItem[]) => {
    const payload = {
      date: new Date().toISOString(),
      dateString: new Date().toISOString().split("T")[0],
      month: monthNum,
      year: selectedYear,
      amount: newOB,
      openingBalanceFor: `Month: ${selectedMonth}, Year: ${selectedYear}`,
      description: JSON.stringify(newOthers),
    };

    try {
      if (obDoc && (obDoc._id || obDoc.id)) {
        await updateOpeningBalance({ id: obDoc._id || obDoc.id, ...payload }).unwrap();
      } else {
        await addOpeningBalance(payload).unwrap();
      }
      toast.success("ব্যালেন্স ও তথ্য সফলভাবে সংরক্ষণ করা হয়েছে");
    } catch {
      toast.error("সংরক্ষণ করতে ব্যর্থ হয়েছে");
    }
  };

  const handleSaveOB = () => {
    setIsEditingOB(false);
    handleSaveOBAndOthers(openingBalance, otherIncomes);
  };

  const handleAddOtherIncome = () => {
    if (!newTitle.trim() || !newAmount || Number(newAmount) <= 0) {
      toast.error("সঠিক বিবরণ এবং টাকার পরিমাণ দিন");
      return;
    }
    const updated = [
      ...otherIncomes,
      { id: String(Date.now()), title: newTitle.trim(), amount: Number(newAmount) },
    ];
    setOtherIncomes(updated);
    setNewTitle("");
    setNewAmount("");
    handleSaveOBAndOthers(openingBalance, updated);
  };

  const handleDeleteOtherIncome = (id: string) => {
    const updated = otherIncomes.filter((item) => item.id !== id);
    setOtherIncomes(updated);
    handleSaveOBAndOthers(openingBalance, updated);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Filter Bar */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 print:hidden">
        <div className="flex items-center gap-3">
          {onBackToCatalog && (
            <Button
              variant="outline"
              size="sm"
              onClick={onBackToCatalog}
              className="rounded-xl border-gray-200 text-gray-700 hover:bg-gray-100 text-xs font-bold"
            >
              <ArrowLeft size={15} className="mr-1" /> ক্যাটালগে ফিরুন
            </Button>
          )}
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              মাসিক আয়-ব্যয় সামারি হিসাব (Financial Statement)
            </h2>
            <p className="text-xs text-gray-500">
              মাসের শুরু হিসাব, আয়, ডিপোজিট, অফিস ক্যাশ ও খরচের সম্পূর্ণ তালিকা
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Month Select */}
          <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 rounded-xl px-3 py-1.5 text-xs">
            <Calendar size={14} className="text-emerald-700" />
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="bg-transparent font-bold text-gray-800 outline-none cursor-pointer"
            >
              {monthNamesBengali.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>

          {/* Year Select */}
          <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 rounded-xl px-3 py-1.5 text-xs">
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="bg-transparent font-bold text-gray-800 outline-none cursor-pointer"
            >
              {yearOptions.map((y) => (
                <option key={y} value={y}>
                  {y} ইং
                </option>
              ))}
            </select>
          </div>

          <Button
            onClick={handlePrint}
            size="sm"
            className="bg-[#054a48] hover:bg-[#085f5c] text-white rounded-xl text-xs gap-1.5 font-bold"
          >
            <Printer size={14} /> প্রিন্ট / পিডিএফ
          </Button>
        </div>
      </div>

      {/* Financial Statement Paper Sheet */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-8 space-y-6 text-gray-800 print:p-0 print:border-none print:shadow-none">
        {/* Printable Title */}
        <div className="text-center border-b border-gray-200 pb-4">
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
            মাসিক আয়-ব্যয় ও ক্যাশ ব্যালেন্স হিসাব
          </h1>
          <p className="text-sm font-bold text-[#054a48] mt-1">
            মাসের নাম: <span className="underline decoration-emerald-400">{selectedMonth}</span>, সাল: <span className="underline decoration-emerald-400">{selectedYear}</span>
          </p>
        </div>

        {/* 1. OPENING BALANCE SECTION */}
        <div className="bg-emerald-50/50 border border-emerald-200 rounded-xl p-4 flex items-center justify-between gap-4">
          <div>
            <span className="text-xs font-extrabold text-emerald-900 uppercase tracking-wide">
              হাতে শুরু জমা (Opening Balance)
            </span>
            <p className="text-[11px] text-emerald-700">পূর্ববর্তী মাসের অবশিষ্ট ক্যাশ ব্যালেন্স</p>
          </div>

          <div className="flex items-center gap-2">
            {isEditingOB ? (
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-gray-700">৳</span>
                <input
                  type="number"
                  value={openingBalance}
                  onChange={(e) => setOpeningBalance(Number(e.target.value))}
                  className="w-32 px-3 py-1 bg-white border border-emerald-400 rounded-lg text-sm font-bold text-gray-900 focus:outline-none"
                  placeholder="0"
                />
                <Button
                  size="sm"
                  onClick={handleSaveOB}
                  className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs h-8 px-2.5 rounded-lg gap-1"
                >
                  <Save size={13} /> সেইভ
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-xl font-black text-emerald-800">
                  ৳ {openingBalance.toLocaleString()}
                </span>
                <button
                  onClick={() => setIsEditingOB(true)}
                  className="p-1.5 text-emerald-700 hover:bg-emerald-100 rounded-lg transition-colors print:hidden"
                  title="এডিট করুন"
                >
                  <Edit2 size={15} />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* 2. INCOME FROM BUILDINGS */}
        <div className="space-y-3">
          <div className="flex items-center justify-between border-b border-gray-200 pb-1.5">
            <h3 className="font-extrabold text-gray-900 text-sm flex items-center gap-2">
              <Building2 size={16} className="text-[#054a48]" />
              <span>বিল্ডিংসমূহ থেকে ভাড়া আয় (Income from Buildings)</span>
            </h3>
            <span className="text-xs font-bold text-gray-500">
              মোট: ৳ {totalBuildingRentIncome.toLocaleString()}
            </span>
          </div>

          <div className="divide-y divide-gray-100 text-xs sm:text-sm pl-2">
            {buildingIncomes.length > 0 ? (
              buildingIncomes.map((bInc, idx) => (
                <div key={idx} className="py-2 flex items-center justify-between hover:bg-gray-50/50 px-2 rounded-lg">
                  <span className="font-medium text-gray-750">
                    {bInc.name} থেকে আয়
                  </span>
                  <span className="font-bold text-gray-900">
                    ৳ {bInc.amount.toLocaleString()}
                  </span>
                </div>
              ))
            ) : (
              <div className="py-3 text-gray-400 text-xs italic">কোন বিল্ডিং আয়ের রেকর্ড নেই</div>
            )}
          </div>
        </div>

        {/* 3. INCOME FROM FLAT BOOKING */}
        <div className="space-y-3">
          <div className="flex items-center justify-between border-b border-gray-200 pb-1.5">
            <h3 className="font-extrabold text-gray-900 text-sm">
              ফ্ল্যাট বুকিং অগ্রিম আয় (Income From Flat Booking)
            </h3>
            <span className="text-xs font-bold text-gray-500">
              মোট: ৳ {totalBookingAdvance.toLocaleString()}
            </span>
          </div>

          <div className="divide-y divide-gray-100 text-xs sm:text-sm pl-2">
            {flatBookingAdvances.length > 0 ? (
              flatBookingAdvances.map((adv, idx) => (
                <div key={idx} className="py-2 flex items-center justify-between hover:bg-gray-50/50 px-2 rounded-lg">
                  <span className="font-medium text-gray-750">
                    {adv.bName} থেকে ফ্ল্যাট {adv.unitNo} অগ্রিম
                  </span>
                  <span className="font-bold text-gray-900">
                    ৳ {adv.amount.toLocaleString()}
                  </span>
                </div>
              ))
            ) : (
              <div className="py-3 text-gray-400 text-xs italic">কোন বুকিং অগ্রিম আয়ের রেকর্ড নেই</div>
            )}
          </div>
        </div>

        {/* 4. OTHER INCOMES */}
        <div className="space-y-3">
          <div className="flex items-center justify-between border-b border-gray-200 pb-1.5">
            <h3 className="font-extrabold text-gray-900 text-sm">
              অন্যান্য আয় (Income from others)
            </h3>
            <span className="text-xs font-bold text-gray-500">
              মোট: ৳ {totalOtherIncomes.toLocaleString()}
            </span>
          </div>

          <div className="divide-y divide-gray-100 text-xs sm:text-sm pl-2">
            {otherIncomes.map((item) => (
              <div key={item.id} className="py-2 flex items-center justify-between hover:bg-gray-50/50 px-2 rounded-lg">
                <span className="font-medium text-gray-750">{item.title}</span>
                <div className="flex items-center gap-3">
                  <span className="font-bold text-gray-900">
                    ৳ {item.amount.toLocaleString()}
                  </span>
                  <button
                    onClick={() => handleDeleteOtherIncome(item.id)}
                    className="text-red-500 hover:text-red-700 print:hidden"
                    title="মুছে ফেলুন"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Add New Item Form */}
          <div className="flex flex-col sm:flex-row items-center gap-2 pt-2 print:hidden">
            <input
              type="text"
              placeholder="আয়ের নাম/বিবরণ (যেমন: শাহনাজ হাউজ গ্যাস বিল পরিশোধ)..."
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="flex-1 px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:bg-white focus:outline-none w-full"
            />
            <input
              type="number"
              placeholder="টাকা (৳)..."
              value={newAmount}
              onChange={(e) => setNewAmount(e.target.value ? Number(e.target.value) : "")}
              className="w-full sm:w-32 px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:bg-white focus:outline-none"
            />
            <Button
              size="sm"
              onClick={handleAddOtherIncome}
              className="bg-[#054a48] hover:bg-[#085f5c] text-white text-xs rounded-xl h-8 px-3 shrink-0 gap-1 font-bold w-full sm:w-auto justify-center"
            >
              <Plus size={14} /> যোগ করুন
            </Button>
          </div>
        </div>

        {/* 5. SUMMARY FINANCIAL BALANCE STATEMENT TABLE */}
        <div className="pt-4 border-t-2 border-gray-900 space-y-2">
          <div className="bg-emerald-100/70 p-3.5 rounded-xl flex items-center justify-between font-black text-emerald-950 text-sm sm:text-base border border-emerald-300">
            <span>সর্বমোট আয় (Total Income)</span>
            <span>৳ {totalIncomeSum.toLocaleString()}</span>
          </div>

          <div className="p-3 rounded-xl flex items-center justify-between font-bold text-gray-700 text-xs sm:text-sm border border-gray-200 bg-gray-50">
            <span>ব্যাংক ডিপোজিট (-) (Bank Deposit)</span>
            <span className="text-red-600 font-extrabold">- ৳ {totalBankDeposit.toLocaleString()}</span>
          </div>

          <div className="p-3.5 rounded-xl flex items-center justify-between font-extrabold text-gray-900 text-sm sm:text-base border border-blue-200 bg-blue-50/70">
            <span>অফিস ক্যাশ (Office Cash)</span>
            <span className="text-blue-900 font-black">৳ {officeCash.toLocaleString()}</span>
          </div>

          <div className="p-3 rounded-xl flex items-center justify-between font-bold text-gray-700 text-xs sm:text-sm border border-gray-200 bg-gray-50">
            <span>অফিস কর্তৃক খরচ (-) (Office Expenses)</span>
            <span className="text-red-600 font-extrabold">- ৳ {totalOfficeExpense.toLocaleString()}</span>
          </div>

          <div className="p-4 rounded-2xl flex items-center justify-between font-black text-white text-base sm:text-lg bg-[#054a48] shadow-md border-2 border-emerald-700">
            <span>অফিস অবশিষ্ট ব্যালেন্স (Office Remaining Balance)</span>
            <span className="text-emerald-300 font-extrabold text-xl sm:text-2xl">
              ৳ {officeRemainingBalance.toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
