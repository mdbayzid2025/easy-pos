import { useRef } from "react";
import { X, Printer, CheckCircle, AlertCircle, Building2, User, Zap } from "lucide-react";
import { Button } from "../../ui/button";

export interface IncomeRecord {
  _id: string;
  building: {
    _id: string;
    name: string;
    address?: string;
    phoneNo?: string;
  };
  floor: {
    _id: string;
    floorNo: number;
  };
  unit: {
    _id: string;
    unitNo: string;
    baseFare?: number;
  };
  user?: {
    _id?: string;
    name?: string;
    phoneNo?: string;
    email?: string;
  };
  dateString?: string;
  month: string;
  year: number;
  previousDue: number;
  advanced: number;
  currentUnit: number;
  previousUnit: number;
  rate: number;
  baseFare: number;
  liftBill: number;
  gasBill: number;
  garageBill: number;
  discount?: number;
  totalBill: number;
  totalReceived: number;
  historyTry?: Array<{
    date: string;
    amount: number;
    method?: string;
    note?: string;
  }>;
  createdAt?: string;
}

interface IncomeDetailsModalProps {
  income: IncomeRecord;
  onClose: () => void;
}

export default function IncomeDetailsModal({ income, onClose }: IncomeDetailsModalProps) {
  const printRef = useRef<HTMLDivElement>(null);

  const usedUnits = Math.max(0, (income.currentUnit || 0) - (income.previousUnit || 0));
  const electricityBill = usedUnits * (income.rate || 0);
  const currentDue = Math.max(0, (income.totalBill || 0) - (income.totalReceived || 0));
  const isFullyPaid = currentDue <= 0;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-3xl w-full shadow-2xl overflow-hidden border border-gray-100 flex flex-col max-h-[92vh] my-auto">
        {/* Header - Hidden in Print */}
        <div className="flex-shrink-0 flex items-center justify-between px-4 sm:px-6 py-3.5 bg-gradient-to-r from-[#054a48] to-[#086361] text-white print:hidden">
          <div className="flex items-center gap-2">
            <Building2 className="text-emerald-300" size={22} />
            <div>
              <h2 className="text-base sm:text-lg font-bold">ভাড়া ও ইউটিলিটি ভাউচার রিসিট</h2>
              <p className="text-[11px] sm:text-xs text-emerald-100 font-medium">
                {income.month} - {income.year}ইং | {income.building?.name || "N/A"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={handlePrint}
              variant="outline"
              size="sm"
              className="bg-white/10 hover:bg-white/20 text-white border-white/30 gap-1.5 text-xs font-semibold"
            >
              <Printer size={15} />
              <span>প্রিন্ট করুন</span>
            </Button>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white hover:bg-white/10 p-1.5 rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Printable Receipt Card Content */}
        <div ref={printRef} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 sm:space-y-5 print:p-6 print:space-y-4 print:text-black print:overflow-visible">
          {/* Memo Title & Serial */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b pb-3.5 gap-3 border-gray-200">
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-[#054a48] tracking-tight">আইনাল প্রপার্টিজ</h1>
              <p className="text-xs font-medium text-gray-500">বাড়ি ভাড়া ও মাসিক ইউটিলিটি বিল রিসিট</p>
            </div>
            <div className="text-left sm:text-right">
              <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-800">
                ভাউচার নং: #{income._id.slice(-6).toUpperCase()}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                তারিখ: {income.dateString || (income.createdAt ? new Date(income.createdAt).toLocaleDateString("bn-BD") : "N/A")}
              </p>
            </div>
          </div>

          {/* Tenant & Property Overview Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 bg-gray-50 p-3.5 sm:p-4 rounded-xl border border-gray-200 text-xs">
            <div className="space-y-1.5 sm:space-y-2">
              <div className="flex items-center gap-2 text-gray-500 font-semibold">
                <Building2 size={14} className="text-[#054a48]" />
                <span>বিল্ডিং ও ফ্ল্যাট বিবরণ:</span>
              </div>
              <p className="text-sm font-bold text-gray-900">{income.building?.name}</p>
              <p className="text-gray-600">
                ফ্লোর: <span className="font-semibold text-gray-800">{income.floor?.floorNo} তলা</span> | ফ্ল্যাট নং:{" "}
                <span className="font-bold text-[#054a48]">{income.unit?.unitNo}</span>
              </p>
              {income.building?.address && <p className="text-gray-500 text-[11px]">{income.building.address}</p>}
            </div>

            <div className="space-y-1.5 sm:space-y-2 border-t sm:border-t-0 sm:border-l border-gray-200 pt-2.5 sm:pt-0 sm:pl-4">
              <div className="flex items-center gap-2 text-gray-500 font-semibold">
                <User size={14} className="text-[#054a48]" />
                <span>ভাড়াটিয়ার তথ্য:</span>
              </div>
              <p className="text-sm font-bold text-gray-900">{income.user?.name || "N/A"}</p>
              <p className="text-gray-600">
                মোবাইল: <span className="font-semibold text-gray-800">{income.user?.phoneNo || "N/A"}</span>
              </p>
              <p className="text-gray-600">
                মাস: <span className="font-semibold text-[#054a48]">{income.month} - {income.year}ইং</span>
              </p>
            </div>
          </div>

          {/* Breakdown Table */}
          <div>
            <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">বিদের হিসাব ও বিল বিবরণী</h3>
            <div className="overflow-x-auto border border-gray-300 rounded-xl overflow-hidden text-xs">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-100 text-gray-700 font-bold border-b border-gray-300">
                    <th className="p-2 sm:p-2.5 border-r border-gray-300">বিবরণ (Item Description)</th>
                    <th className="p-2 sm:p-2.5 border-r border-gray-300 text-center">মেজারমেন্ট / নোট</th>
                    <th className="p-2 sm:p-2.5 text-right">পরিমাণ (টাকা)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 text-gray-800 font-medium">
                  <tr>
                    <td className="p-2 sm:p-2.5 border-r border-gray-200">পূর্বের বকেয়া (Arrears Due)</td>
                    <td className="p-2 sm:p-2.5 border-r border-gray-200 text-center text-gray-500">বিগত মাসের পাওনা</td>
                    <td className="p-2 sm:p-2.5 text-right font-semibold text-red-600">
                      ৳ {income.previousDue?.toLocaleString() || 0}
                    </td>
                  </tr>
                  <tr>
                    <td className="p-2 sm:p-2.5 border-r border-gray-200 font-semibold">ফ্ল্যাট মূল ভাড়া (Base Rent)</td>
                    <td className="p-2 sm:p-2.5 border-r border-gray-200 text-center text-gray-500">মাসিক নির্ধারিত চুক্তি</td>
                    <td className="p-2 sm:p-2.5 text-right font-bold text-gray-900">
                      ৳ {income.baseFare?.toLocaleString() || 0}
                    </td>
                  </tr>
                  {income.advanced > 0 && (
                    <tr className="bg-blue-50/50">
                      <td className="p-2 sm:p-2.5 border-r border-gray-200 text-blue-900 font-semibold">অগ্রিম সমন্বয় (Advance Deduction)</td>
                      <td className="p-2 sm:p-2.5 border-r border-gray-200 text-center text-blue-700">অগ্রিম থেকে মাইনাস</td>
                      <td className="p-2 sm:p-2.5 text-right font-bold text-blue-700">
                        - ৳ {income.advanced?.toLocaleString()}
                      </td>
                    </tr>
                  )}
                  <tr>
                    <td className="p-2 sm:p-2.5 border-r border-gray-200">লিফট ও মেইনটেইনেন্স ফি</td>
                    <td className="p-2 sm:p-2.5 border-r border-gray-200 text-center text-gray-500">
                      {(income.liftBill || 0) > 0 ? "সাধারণ সুবিধা" : "প্রযোজ্য নয়"}
                    </td>
                    <td className="p-2 sm:p-2.5 text-right">
                      {(income.liftBill || 0) > 0 ? `৳ ${income.liftBill.toLocaleString()}` : "৳ 0"}
                    </td>
                  </tr>
                  <tr className="bg-amber-50/40">
                    <td className="p-2 sm:p-2.5 border-r border-gray-200 font-semibold text-amber-900">
                      <div className="flex items-center gap-1">
                        <Zap size={13} className="text-amber-600" />
                        <span>বিদ্যুৎ বিল (Electricity Bill)</span>
                      </div>
                    </td>
                    <td className="p-2 sm:p-2.5 border-r border-gray-200 text-center text-amber-900 text-[11px]">
                      বর্তমান: {income.currentUnit} | পূর্বের: {income.previousUnit} | ব্যবহৃত: {usedUnits} Unit (৳{income.rate}/Unit)
                    </td>
                    <td className="p-2 sm:p-2.5 text-right font-bold text-amber-900">
                      ৳ {electricityBill.toLocaleString()}
                    </td>
                  </tr>
                  <tr>
                    <td className="p-2 sm:p-2.5 border-r border-gray-200">পানি ও গ্যাস বিল</td>
                    <td className="p-2 sm:p-2.5 border-r border-gray-200 text-center text-gray-500">
                      {(income.gasBill || 0) > 0 ? "ইউটিলিটি চার্জ" : "প্রযোজ্য নয়"}
                    </td>
                    <td className="p-2 sm:p-2.5 text-right">
                      {(income.gasBill || 0) > 0 ? `৳ ${income.gasBill.toLocaleString()}` : "৳ 0"}
                    </td>
                  </tr>
                  <tr>
                    <td className="p-2 sm:p-2.5 border-r border-gray-200">গ্যারেজ ও পার্কিং ভাড়া</td>
                    <td className="p-2 sm:p-2.5 border-r border-gray-200 text-center text-gray-500">
                      {(income.garageBill || 0) > 0 ? "পার্কিং সুবিধা" : "প্রযোজ্য নয়"}
                    </td>
                    <td className="p-2 sm:p-2.5 text-right">
                      {(income.garageBill || 0) > 0 ? `৳ ${income.garageBill.toLocaleString()}` : "৳ 0"}
                    </td>
                  </tr>
                  {(income.discount || 0) > 0 && (
                    <tr className="bg-emerald-50/60">
                      <td className="p-2 sm:p-2.5 border-r border-gray-200 text-emerald-800 font-semibold">মওকুফ / বিশেষ ছাড় (Discount / Waiver)</td>
                      <td className="p-2 sm:p-2.5 border-r border-gray-200 text-center text-emerald-600">ছাড়কৃত অর্থ</td>
                      <td className="p-2 sm:p-2.5 text-right font-bold text-emerald-700">
                        - ৳ {income.discount?.toLocaleString()}
                      </td>
                    </tr>
                  )}
                  <tr className="bg-gray-100 font-black text-sm text-gray-900">
                    <td colSpan={2} className="p-2.5 sm:p-3 border-r border-gray-300 text-right">
                      সর্বমোট দাবিযোগ্য বিল (Total Bill):
                    </td>
                    <td className="p-2.5 sm:p-3 text-right text-[#054a48]">
                      ৳ {income.totalBill?.toLocaleString() || 0}
                    </td>
                  </tr>
                  <tr className="bg-emerald-50 text-emerald-900 font-bold text-sm">
                    <td colSpan={2} className="p-2.5 sm:p-3 border-r border-emerald-200 text-right">
                      আদায়কৃত মোট ভাড়া (Total Received):
                    </td>
                    <td className="p-2.5 sm:p-3 text-right text-emerald-700">
                      ৳ {income.totalReceived?.toLocaleString() || 0}
                    </td>
                  </tr>
                  <tr className={isFullyPaid ? "bg-emerald-100 text-emerald-900 font-black text-sm" : "bg-red-50 text-red-900 font-black text-sm"}>
                    <td colSpan={2} className="p-2.5 sm:p-3 border-r border-gray-300 text-right">
                      অবশিষ্ট বকেয়া (Current Remaining Due):
                    </td>
                    <td className="p-2.5 sm:p-3 text-right">
                      ৳ {currentDue.toLocaleString()}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Payment Status & Notes */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 p-3.5 sm:p-4 rounded-xl border border-gray-200 bg-gray-50">
            <div className="flex items-center gap-3">
              {isFullyPaid ? (
                <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0">
                  <CheckCircle size={22} />
                </div>
              ) : (
                <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center flex-shrink-0">
                  <AlertCircle size={22} />
                </div>
              )}
              <div>
                <p className="text-xs text-gray-500 font-medium">পেমেন্ট স্টেটাস</p>
                <h4 className={`text-sm sm:text-base font-bold ${isFullyPaid ? "text-emerald-700" : "text-amber-700"}`}>
                  {isFullyPaid ? "সম্পূর্ণ পরিশোধিত (Paid)" : `আংশিক বকেয়া রয়েছে (৳${currentDue.toLocaleString()} বকেয়া)`}
                </h4>
              </div>
            </div>

            <div className="text-right text-xs text-gray-500">
              <p>রিসিট প্রস্তুতকারী: ম্যানেজার / এডমিন</p>
              <p className="font-semibold text-gray-700 mt-1">আইনাল প্রপার্টিজ ম্যানেজমেন্ট</p>
            </div>
          </div>

          {/* Printable Signature Area */}
          <div className="hidden print:flex items-end justify-between pt-12 text-xs text-gray-700">
            <div className="border-t border-gray-400 pt-1 w-40 text-center font-semibold">
              ভাড়াটিয়ার স্বাক্ষর
            </div>
            <div className="border-t border-gray-400 pt-1 w-40 text-center font-semibold">
              গ্রহীতা / কর্তৃপক্ষের স্বাক্ষর
            </div>
          </div>
        </div>

        {/* Modal Footer - Hidden in Print */}
        <div className="flex-shrink-0 px-4 sm:px-6 py-3 bg-gray-50 border-t border-gray-200 flex justify-end print:hidden">
          <Button onClick={onClose} variant="outline" className="text-xs font-semibold px-5">
            বন্ধ করুন
          </Button>
        </div>
      </div>
    </div>
  );
}
