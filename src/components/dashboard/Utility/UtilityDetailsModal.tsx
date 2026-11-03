import { X, Zap, Droplet, Flame, ArrowUpCircle, Car, Calendar, Calculator, CheckCircle2 } from "lucide-react";
import type { Utility } from "../../../types/utility";

interface UtilityDetailsModalProps {
  utility: Utility;
  onClose: () => void;
}

export default function UtilityDetailsModal({
  utility,
  onClose,
}: UtilityDetailsModalProps) {
  const electricity = utility.electricityBill || 0;
  const water = utility.waterBill || 0;
  const gas = utility.gasBill || 0;
  const lift = utility.liftBill || 0;
  const garage = utility.garageBill || 0;
  const totalAmount = electricity + water + gas + lift + garage;

  const formattedDate = utility.createdAt
    ? new Date(utility.createdAt).toLocaleDateString("bn-BD", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "N/A";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 space-y-5 border border-gray-100 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 pb-3.5">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 bg-[#054a48] text-white rounded-2xl shadow-xs">
              <Calculator size={20} />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-gray-900">
                ইউটিলিটি বিল বিস্তারিত বিবরণ
              </h3>
              <p className="text-xs text-gray-500 font-semibold mt-0.5 flex items-center gap-1">
                <Calendar size={13} className="text-[#054a48]" /> {formattedDate}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Breakdown Items */}
        <div className="space-y-2.5 text-xs">
          {/* Electricity */}
          <div className="p-3 bg-amber-50/60 rounded-2xl border border-amber-100 flex items-center justify-between">
            <div className="flex items-center gap-2 font-bold text-amber-800">
              <Zap size={16} className="text-amber-500" />
              <span>বিদ্যুৎ বিল (Electricity Bill)</span>
            </div>
            <span className="font-extrabold text-amber-700 text-sm">৳ {electricity.toLocaleString()}</span>
          </div>

          {/* Water */}
          <div className="p-3 bg-blue-50/60 rounded-2xl border border-blue-100 flex items-center justify-between">
            <div className="flex items-center gap-2 font-bold text-blue-800">
              <Droplet size={16} className="text-blue-500" />
              <span>পানি বিল (Water Bill)</span>
            </div>
            <span className="font-extrabold text-blue-700 text-sm">৳ {water.toLocaleString()}</span>
          </div>

          {/* Gas */}
          <div className="p-3 bg-orange-50/60 rounded-2xl border border-orange-100 flex items-center justify-between">
            <div className="flex items-center gap-2 font-bold text-orange-800">
              <Flame size={16} className="text-orange-500" />
              <span>গ্যাস বিল (Gas Bill)</span>
            </div>
            <span className="font-extrabold text-orange-700 text-sm">৳ {gas.toLocaleString()}</span>
          </div>

          {/* Lift */}
          <div className="p-3 bg-emerald-50/60 rounded-2xl border border-emerald-100 flex items-center justify-between">
            <div className="flex items-center gap-2 font-bold text-emerald-800">
              <ArrowUpCircle size={16} className="text-emerald-600" />
              <span>লিফট সার্ভিস বিল (Lift Bill)</span>
            </div>
            <span className="font-extrabold text-emerald-700 text-sm">৳ {lift.toLocaleString()}</span>
          </div>

          {/* Garage */}
          <div className="p-3 bg-purple-50/60 rounded-2xl border border-purple-100 flex items-center justify-between">
            <div className="flex items-center gap-2 font-bold text-purple-800">
              <Car size={16} className="text-purple-600" />
              <span>গ্যারেজ বিল (Garage Bill)</span>
            </div>
            <span className="font-extrabold text-purple-700 text-sm">৳ {garage.toLocaleString()}</span>
          </div>
        </div>

        {/* Total Sum Card */}
        <div className="p-4 bg-[#054a48] text-white rounded-2xl shadow-md space-y-1">
          <div className="flex items-center justify-between text-xs font-bold text-emerald-100">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 size={16} className="text-emerald-400" /> মোট সমন্বিত ইউটিলিটি পরিমাণ
            </span>
            <span className="bg-emerald-500/30 text-emerald-200 px-2 py-0.5 rounded-md text-[10px]">TOTAL</span>
          </div>
          <div className="text-2xl font-extrabold text-white pt-1">
            ৳ {totalAmount.toLocaleString()}
          </div>
        </div>

        {/* Close Button */}
        <div className="pt-2 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-extrabold text-xs py-2.5 rounded-xl transition-all cursor-pointer"
          >
            বন্ধ করুন (Close)
          </button>
        </div>
      </div>
    </div>
  );
}
