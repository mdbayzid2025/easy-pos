import { useState } from "react";
import {
  X,
  Building2,
  Search,
  Filter,
  User,
  Phone,
  CheckCircle2,
  AlertCircle,
  Zap,
  Car,
} from "lucide-react";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Badge } from "../../ui/badge";
import type { Building, Flot } from "./types";

interface FlotListModalProps {
  building: Building;
  onClose: () => void;
}

export default function FlotListModal({ building, onClose }: FlotListModalProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "ভাড়া দেওয়া" | "খালি">("ALL");

  const flots: Flot[] = building.flots || [];

  const filteredFlots = flots.filter((flot) => {
    const unitTitle = flot.unitName || `ফ্ল্যাট ${flot.flatNo}`;
    const matchesSearch =
      unitTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (flot.tenantName && flot.tenantName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (flot.tenantPhone && flot.tenantPhone.includes(searchTerm));

    const matchesStatus =
      statusFilter === "ALL" ? true : flot.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const occupiedCount = flots.filter((f) => f.status === "ভাড়া দেওয়া").length;
  const vacantCount = flots.filter((f) => f.status === "খালি").length;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-5xl w-full shadow-2xl overflow-hidden my-6 border border-gray-100 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-[#054a48] text-white p-5 sm:p-6 flex items-start justify-between relative shrink-0">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-white/20 text-white text-xs font-bold px-2.5 py-0.5 rounded-md backdrop-blur-xs flex items-center gap-1">
                <Building2 size={13} /> {building.code}
              </span>
              <Badge className="bg-emerald-500/20 text-emerald-100 border-emerald-400/30 text-xs">
                {building.buildingType}
              </Badge>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">
              {building.name} - ফ্ল্যাট / ইউনিট ডিরেক্টরি
            </h2>
            <p className="text-xs text-emerald-100 mt-1">
              {building.address} | সর্বমোট {building.totalFloors} ফ্লোরে {building.totalUnits} টি ফ্ল্যাট (ভাড়া: {occupiedCount} | খালি: {vacantCount})
            </p>
          </div>

          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Filter & Search Toolbar */}
        <div className="p-4 bg-gray-50 border-b border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="relative w-full sm:w-80">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="ফ্ল্যাটের নাম বা ভাড়াটিয়ার নাম দিয়ে খুঁজুন..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 text-xs rounded-xl bg-white"
            />
          </div>

          {/* Filter Status Tabs */}
          <div className="flex items-center gap-1.5 self-start sm:self-auto">
            <Button
              size="sm"
              variant={statusFilter === "ALL" ? "default" : "outline"}
              onClick={() => setStatusFilter("ALL")}
              className={`rounded-xl text-xs h-8 px-3 ${
                statusFilter === "ALL"
                  ? "bg-[#054a48] text-white hover:bg-[#085f5c]"
                  : "text-gray-600 bg-white"
              }`}
            >
              <Filter size={13} className="mr-1" /> সকল ({flots.length})
            </Button>
            <Button
              size="sm"
              variant={statusFilter === "ভাড়া দেওয়া" ? "default" : "outline"}
              onClick={() => setStatusFilter("ভাড়া দেওয়া")}
              className={`rounded-xl text-xs h-8 px-3 ${
                statusFilter === "ভাড়া দেওয়া"
                  ? "bg-emerald-600 text-white hover:bg-emerald-700"
                  : "text-gray-600 bg-white"
              }`}
            >
              ভাড়া দেওয়া ({occupiedCount})
            </Button>
            <Button
              size="sm"
              variant={statusFilter === "খালি" ? "default" : "outline"}
              onClick={() => setStatusFilter("খালি")}
              className={`rounded-xl text-xs h-8 px-3 ${
                statusFilter === "খালি"
                  ? "bg-amber-600 text-white hover:bg-amber-700"
                  : "text-gray-600 bg-white"
              }`}
            >
              খালি ({vacantCount})
            </Button>
          </div>
        </div>

        {/* Units Grid */}
        <div className="p-6 overflow-y-auto">
          {filteredFlots.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredFlots.map((flot) => {
                const isOccupied = flot.status === "ভাড়া দেওয়া";
                const elecUnits = Math.max(
                  0,
                  (flot.currentElectricityMeter || 0) - (flot.previousElectricityMeter || 0)
                );
                const elecBill = flot.electricityBill || elecUnits * (flot.electricityUnitRate || 8.5);
                const otherUtilities =
                  (flot.waterFee || 0) +
                  (flot.gasFee || 0) +
                  (flot.wastageFee || 0) +
                  (flot.serviceFee || 0);

                return (
                  <div
                    key={flot.id}
                    className={`rounded-2xl p-4 border transition-all duration-200 flex flex-col justify-between space-y-3 ${
                      isOccupied
                        ? "bg-white border-emerald-200/80 shadow-2xs hover:shadow-md"
                        : "bg-gray-50/60 border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    {/* Unit Title & Status */}
                    <div className="flex items-start justify-between border-b border-gray-100 pb-2.5">
                      <div>
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                          {flot.floorNumber} তলা
                        </span>
                        <h4 className="font-extrabold text-gray-900 text-base">
                          {flot.unitName}
                        </h4>
                      </div>
                      <span
                        className={`inline-flex items-center gap-1 text-[11px] font-extrabold px-2.5 py-1 rounded-full ${
                          isOccupied
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {isOccupied ? (
                          <CheckCircle2 size={12} />
                        ) : (
                          <AlertCircle size={12} />
                        )}
                        {flot.status}
                      </span>
                    </div>

                    {/* Rent & Detailed Utility Breakdown */}
                    <div className="space-y-1.5 text-xs text-gray-600 bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                      <div className="flex justify-between">
                        <span>মূল ভাড়া:</span>
                        <span className="font-bold text-gray-800">
                          ৳ {(flot.baseRent || flot.baseFare || 0).toLocaleString("bn-BD")}
                        </span>
                      </div>

                      {/* Electricity Meter details */}
                      <div className="p-2 bg-amber-50/60 rounded-lg border border-amber-100/60 space-y-0.5">
                        <div className="flex items-center justify-between text-amber-900 font-bold">
                          <span className="flex items-center gap-1">
                            <Zap size={12} className="text-amber-600" /> বিদ্যুৎ বিল:
                          </span>
                          <span>৳ {Math.round(elecBill).toLocaleString("bn-BD")}</span>
                        </div>
                        <div className="text-[10px] text-amber-700">
                          বর্তমান: {flot.currentElectricityMeter || 0} - পূর্বের: {flot.previousElectricityMeter || 0} = {elecUnits} ইউনিট (@ ৳{flot.electricityUnitRate || 8.5}/ইউনিট)
                        </div>
                      </div>

                      {/* Garage / Parking Fee */}
                      {(flot.parkingFee || flot.garageBill || 0) > 0 && (
                        <div className="flex justify-between text-purple-900">
                          <span className="flex items-center gap-1">
                            <Car size={12} className="text-purple-600" /> পার্কিং / গ্যারেজ ফি:
                          </span>
                          <span className="font-bold">
                            ৳ {(flot.parkingFee || flot.garageBill || 0).toLocaleString("bn-BD")}
                          </span>
                        </div>
                      )}

                      {/* Other utilities */}
                      {otherUtilities > 0 && (
                        <div className="flex justify-between">
                          <span>অন্যান্য সার্ভিস ও পানি/গ্যাস বিল:</span>
                          <span className="font-semibold text-gray-700">
                            ৳ {otherUtilities.toLocaleString("bn-BD")}
                          </span>
                        </div>
                      )}

                      <div className="flex justify-between pt-1 border-t border-gray-200 font-extrabold text-[#054a48] text-sm">
                        <span>সর্বমোট মাসিক চার্জ:</span>
                        <span>৳ {flot.totalAmount.toLocaleString("bn-BD")}</span>
                      </div>
                    </div>

                    {/* Tenant Info if occupied */}
                    {isOccupied && (
                      <div className="pt-2 border-t border-gray-100 text-xs space-y-1">
                        <div className="flex items-center gap-1.5 text-gray-800 font-bold">
                          <User size={13} className="text-emerald-600 shrink-0" />
                          <span className="truncate">{flot.tenantName || "ভাড়াটিয়া সংযুক্ত"}</span>
                        </div>
                        {flot.tenantPhone && (
                          <div className="flex items-center gap-1.5 text-gray-500 font-medium">
                            <Phone size={12} className="shrink-0" />
                            <span>{flot.tenantPhone}</span>
                          </div>
                        )}
                        {flot.dueAmount && flot.dueAmount > 0 ? (
                          <span className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded bg-red-100 text-red-700">
                            বকেয়া: ৳ {flot.dueAmount.toLocaleString("bn-BD")}
                          </span>
                        ) : (
                          <span className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                            বিল পরিশোধিত
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-12 text-center text-gray-400 space-y-2">
              <Building2 size={36} className="mx-auto text-gray-300" />
              <p className="font-semibold text-sm">কোন ফ্ল্যাট / ইউনিট খুঁজে পাওয়া যায়নি</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-end shrink-0">
          <Button
            onClick={onClose}
            className="bg-[#054a48] hover:bg-[#085f5c] text-white font-bold text-xs rounded-xl px-5 py-2 cursor-pointer"
          >
            বন্ধ করুন
          </Button>
        </div>
      </div>
    </div>
  );
}
