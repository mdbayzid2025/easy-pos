import {
  AlertCircle,
  ArrowUpCircle,
  Car,
  CheckCircle2,
  DollarSign,
  DoorOpen,
  Droplet,
  Edit,
  Flame,
  History,
  LogOut,
  Trash2,
  UserPlus,
  Wallet,
  X,
  XCircle,
  Zap,
} from "lucide-react";
import { Badge } from "../../ui/badge";
import { Button } from "../../ui/button";
import type { Flot } from "./types";

interface FlatDetailsModalProps {
  flot: Flot;
  onClose: () => void;
  onOpenAddTenant?: (flot: Flot) => void;
  onCheckoutTenant?: (flot: Flot) => void;
  onEditUnit?: (flot: Flot) => void;
  onDeleteUnit?: (flot: Flot) => void;
}

export default function FlatDetailsModal({
  flot,
  onClose,
  onOpenAddTenant,
  onCheckoutTenant,
  onEditUnit,
  onDeleteUnit,
}: FlatDetailsModalProps) {
  // Mapping schema values with fallbacks following unit.schema.ts

  const floorNo =
    typeof flot?.floor === "object"
      ? (flot.floor as any)?.floorNo
      : typeof flot?.floor === "number"
        ? flot.floor
        : (flot?.floorNo ?? flot?.floorNumber ?? "N/A");

  const flotNo =
    flot?.unitNo || flot?.flatNo || flot?.flotNo || flot?.unitName || "N/A";
  const isOccupied = Boolean(
    flot?.isOccupied ||
      flot?.isAccupied ||
      flot?.status === "ভাড়া দেওয়া" ||
      flot?.tenant ||
      flot?.tenantName,
  );
  const advanced =
    ((flot as any)?.advanced ?? (flot as any)?.advancePaid ?? 0) || 0;
  const baseFare = (flot?.baseFare ?? (flot as any)?.baseRent ?? 0) || 0;
  const utilityBill =
    (flot?.utilityBill ?? (flot as any)?.electricityBill ?? 0) || 0;
  const waterBill = (flot?.waterBill ?? (flot as any)?.waterFee ?? 0) || 0;
  const gasBill = (flot?.gasBill ?? (flot as any)?.gasFee ?? 0) || 0;
  const liftBill = (flot?.liftBill ?? (flot as any)?.liftFee ?? 0) || 0;
  const garageBill = (flot?.garageBill ?? (flot as any)?.parkingFee ?? 0) || 0;
  const dueBill = (flot?.dueBill ?? (flot as any)?.dueAmount ?? 0) || 0;
  const rentCollected = ((flot as any)?.rentCollected ?? 0) || 0;
  const statusStr =
    flot?.status === "inactive" ||
    flot?.status === "INACTIVE" ||
    flot?.status === "মেরামত চলছে"
      ? "INACTIVE"
      : "ACTIVE";
  const details = flot?.details || "";

  const totalCalculatedBill =
    baseFare + utilityBill + waterBill + gasBill + liftBill + garageBill;

  const displayTotalAmount =
    (totalCalculatedBill > 0
      ? totalCalculatedBill
      : flot?.totalAmount || (flot as any)?.totalBill) || 0;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-2xl w-full border border-gray-100 shadow-2xl overflow-hidden my-8 transform transition-all">
        {/* Modal Header */}
        <div className="bg-[#054a48] text-white p-6 relative flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-white/10 border border-white/20 rounded-2xl backdrop-blur-xs">
              <DoorOpen size={28} className="text-emerald-200" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold bg-white/20 text-white px-2.5 py-0.5 rounded-full">
                  ফ্লোর {floorNo}
                </span>
                <Badge
                  variant="outline"
                  className={`text-xs font-bold px-2.5 py-0.5 border ${
                    statusStr === "ACTIVE"
                      ? "bg-emerald-500/20 text-emerald-100 border-emerald-300/40"
                      : "bg-red-500/20 text-red-100 border-red-300/40"
                  }`}
                >
                  Status: {statusStr}
                </Badge>
                <Badge
                  variant="outline"
                  className={`text-xs font-bold px-2.5 py-0.5 border ${
                    isOccupied
                      ? "bg-teal-500/20 text-teal-100 border-teal-300/40"
                      : "bg-amber-500/20 text-amber-100 border-amber-300/40"
                  }`}
                >
                  {isOccupied ? "Occupied" : "Vacant"}
                </Badge>
              </div>
              <h2 className="text-2xl font-extrabold text-white mt-1">
                ইউনিট / ফ্ল্যাট {flotNo}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* 1. Overview Summary Bar */}
          <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                ফ্লোর নম্বর
              </span>
              <span className="font-extrabold text-gray-900 text-sm">
                Floor-{floorNo}
              </span>
            </div>

            <div>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                স্ট্যাটাস (Status)
              </span>
              <span className="font-extrabold text-gray-900 text-xs capitalize flex items-center gap-1 mt-0.5">
                {statusStr === "ACTIVE" ? (
                  <CheckCircle2 size={13} className="text-emerald-600" />
                ) : (
                  <XCircle size={13} className="text-red-600" />
                )}
                {statusStr}
              </span>
            </div>

            <div>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                অকুপেন্সি
              </span>
              <span className="font-extrabold text-gray-900 text-xs mt-0.5 block">
                {isOccupied ? "Occupied (ভাড়া)" : "Vacant (খালি)"}
              </span>
            </div>

            <div>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                বর্তমান ভাড়াটিয়া
              </span>
              <span className="font-extrabold text-gray-900 text-xs truncate mt-0.5 block">
                {flot.tenantName ||
                  flot.tenant?.name ||
                  (isOccupied ? "ভাড়াটিয়া" : "খালি")}
              </span>
            </div>
          </div>

          {/* 2. Financial Breakdown Table */}
          <div className="border border-gray-200 rounded-2xl overflow-hidden bg-white shadow-2xs">
            <div className="bg-gray-100/80 px-4 py-2.5 border-b border-gray-200 flex items-center justify-between">
              <span className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
                <DollarSign size={14} className="text-[#054a48]" /> আর্থিক ও বিল
                বিবরণী
              </span>
              <span className="text-[11px] font-bold text-[#054a48] bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                মোট বিল: ৳ {displayTotalAmount.toLocaleString()}
              </span>
            </div>

            <div className="divide-y divide-gray-100 text-xs">
              <div className="flex items-center justify-between px-4 py-2.5 hover:bg-gray-50/60">
                <span className="text-gray-600 font-medium flex items-center gap-2">
                  <DollarSign size={14} className="text-emerald-600" /> মূল ভাড়া
                  (Base Fare)
                </span>
                <span className="font-bold text-gray-900">
                  ৳ {baseFare.toLocaleString()}
                </span>
              </div>

              <div className="flex items-center justify-between px-4 py-2.5 hover:bg-gray-50/60">
                <span className="text-gray-600 font-medium flex items-center gap-2">
                  <Wallet size={14} className="text-blue-600" /> অগ্রিম জমা
                  (Advanced)
                </span>
                <span className="font-bold text-blue-700">
                  ৳ {advanced.toLocaleString()}
                </span>
              </div>

              <div className="flex items-center justify-between px-4 py-2.5 hover:bg-gray-50/60">
                <span className="text-gray-600 font-medium flex items-center gap-2">
                  <Zap size={14} className="text-amber-500" /> ইউটিলিটি বিল
                  (Utility)
                </span>
                <span className="font-semibold text-gray-900">
                  ৳ {utilityBill.toLocaleString()}
                </span>
              </div>

              <div className="flex items-center justify-between px-4 py-2.5 hover:bg-gray-50/60">
                <span className="text-gray-600 font-medium flex items-center gap-2">
                  <Droplet size={14} className="text-sky-500" /> পানি বিল (Water
                  Fee)
                </span>
                <span className="font-semibold text-gray-900">
                  ৳ {waterBill.toLocaleString()}
                </span>
              </div>

              <div className="flex items-center justify-between px-4 py-2.5 hover:bg-gray-50/60">
                <span className="text-gray-600 font-medium flex items-center gap-2">
                  <Flame size={14} className="text-orange-500" /> গ্যাস বিল (Gas
                  Fee)
                </span>
                <span className="font-semibold text-gray-900">
                  ৳ {gasBill.toLocaleString()}
                </span>
              </div>

              <div className="flex items-center justify-between px-4 py-2.5 hover:bg-gray-50/60">
                <span className="text-gray-600 font-medium flex items-center gap-2">
                  <ArrowUpCircle size={14} className="text-indigo-500" /> লিফট
                  বিল (Lift Fee)
                </span>
                <span className="font-semibold text-gray-900">
                  ৳ {liftBill.toLocaleString()}
                </span>
              </div>

              <div className="flex items-center justify-between px-4 py-2.5 hover:bg-gray-50/60">
                <span className="text-gray-600 font-medium flex items-center gap-2">
                  <Car size={14} className="text-purple-500" /> গ্যারেজ / পারকিং
                  বিল
                </span>
                <span className="font-semibold text-gray-900">
                  ৳ {garageBill.toLocaleString()}
                </span>
              </div>

              <div className="flex items-center justify-between px-4 py-2.5 bg-red-50/40">
                <span className="text-red-700 font-bold flex items-center gap-2">
                  <AlertCircle size={14} className="text-red-600" /> বকেয়া
                  পরিমাণ (Due Bill)
                </span>
                <span className="font-extrabold text-red-600">
                  ৳ {dueBill.toLocaleString()}
                </span>
              </div>

              <div className="flex items-center justify-between px-4 py-2.5 bg-emerald-50/40">
                <span className="text-emerald-800 font-bold flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-emerald-600" />{" "}
                  সংগৃহীত ভাড়া (Rent Collected)
                </span>
                <span className="font-extrabold text-emerald-800">
                  ৳ {rentCollected.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Details Section */}
          {details && (
            <div className="bg-gray-50 p-3.5 rounded-2xl border border-gray-100 space-y-1">
              <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">
                ইউনিট বিবরণী (Details)
              </span>
              <p className="text-xs text-gray-700 font-medium leading-relaxed">
                {details}
              </p>
            </div>
          )}

          {/* 3. Previous Tenants History Records */}
          {flot?.previousTenants && flot.previousTenants.length > 0 && (
            <div className="space-y-2">
              <span className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
                <History size={14} className="text-[#054a48]" /> পূর্বের
                ভাড়াটিয়া ইতিহাস
              </span>
              <div className="border border-gray-200 rounded-xl overflow-hidden divide-y divide-gray-100 bg-white">
                {flot.previousTenants.map((rec, idx) => (
                  <div
                    key={idx}
                    className="p-3 flex items-center justify-between text-xs"
                  >
                    <div>
                      <p className="font-bold text-gray-900">
                        {rec.tenantName ||
                          rec.tenant?.name ||
                          "রেকর্ডকৃত ভাড়াটিয়া"}
                      </p>
                      <p className="text-[11px] text-gray-500">
                        {rec.tenantPhone ||
                          rec.tenant?.phone ||
                          "ফোন নম্বর দেওয়া হয়নি"}
                      </p>
                    </div>
                    <span className="text-[10px] font-semibold bg-gray-100 text-gray-700 px-2 py-0.5 rounded">
                      প্রস্থান: {rec.moveOutDate || "সংরক্ষিত"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-gray-50 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {!isOccupied ? (
              <Button
                onClick={() => {
                  onClose();
                  onOpenAddTenant?.(flot);
                }}
                className="bg-[#054a48] hover:bg-[#085f5c] text-white font-extrabold text-xs px-4 py-2.5 rounded-xl cursor-pointer flex items-center gap-1.5 shadow-sm"
              >
                <UserPlus size={15} /> + ভাড়াটিয়া যোগ করুন (Add Tenant)
              </Button>
            ) : (
              <Button
                onClick={() => {
                  onClose();
                  onCheckoutTenant?.(flot);
                }}
                variant="outline"
                className="text-red-600 border-red-200 hover:bg-red-50 font-bold text-xs px-4 py-2.5 rounded-xl cursor-pointer flex items-center gap-1.5"
              >
                <LogOut size={15} /> চেকআউট / প্রস্থান (Checkout)
              </Button>
            )}

            {onEditUnit && (
              <Button
                onClick={() => {
                  onClose();
                  onEditUnit(flot);
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl cursor-pointer flex items-center gap-1.5 shadow-xs"
              >
                <Edit size={14} /> এডিট (Edit)
              </Button>
            )}

            {onDeleteUnit && (
              <Button
                onClick={() => {
                  onClose();
                  onDeleteUnit(flot);
                }}
                className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl cursor-pointer flex items-center gap-1.5 shadow-xs"
              >
                <Trash2 size={14} /> ডিলিট (Delete)
              </Button>
            )}
          </div>

          <Button
            onClick={onClose}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold text-xs px-6 py-2.5 rounded-xl cursor-pointer shadow-2xs"
          >
            বন্ধ করুন
          </Button>
        </div>
      </div>
    </div>
  );
}
