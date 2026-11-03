import {
  X,
  MapPin,
  ShieldCheck,
  Car,
  Zap,
  Edit,
  Grid,
  ExternalLink,
  Phone,
  CheckCircle2,
} from "lucide-react";
import { Button } from "../../ui/button";
import { Badge } from "../../ui/badge";
import type { Building } from "./types";

interface BuildingDetailsModalProps {
  building: Building;
  onClose: () => void;
  onEdit: (building: Building) => void;
  onViewFlots: (building: Building) => void;
}

export default function BuildingDetailsModal({
  building,
  onClose,
  onEdit,
  onViewFlots,
}: BuildingDetailsModalProps) {
  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-3xl w-full shadow-2xl overflow-hidden my-8 border border-gray-100 flex flex-col max-h-[90vh]">
        {/* Modal Top Banner */}
        <div className="bg-[#054a48] text-white p-5 sm:p-6 flex items-start justify-between relative shrink-0">
          <div className="space-y-1 pr-8">
            <div className="flex items-center gap-2">
              <span className="bg-white/20 text-white text-xs font-bold px-2.5 py-0.5 rounded-md backdrop-blur-xs">
                {building.code}
              </span>
              <Badge
                variant="outline"
                className="bg-emerald-500/20 text-emerald-100 border-emerald-400/30 text-xs"
              >
                {building.buildingType}
              </Badge>
              <span
                className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                  building.status === "সক্রিয়"
                    ? "bg-emerald-400/30 text-emerald-200"
                    : "bg-red-400/30 text-red-200"
                }`}
              >
                {building.status}
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">
              {building.name}
            </h2>

            <div className="flex items-center gap-1.5 text-emerald-100 text-xs">
              <MapPin size={14} className="shrink-0" />
              <span>{building.address}</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm text-gray-700">
          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-gray-50 p-4 rounded-2xl border border-gray-100">
            <div className="space-y-0.5">
              <p className="text-[11px] font-bold text-gray-400 uppercase">মোট ফ্লোর</p>
              <p className="text-lg font-black text-gray-900">{building.totalFloors} তলা</p>
            </div>
            <div className="space-y-0.5">
              <p className="text-[11px] font-bold text-gray-400 uppercase">মোট ফ্ল্যাট / ইউনিট</p>
              <p className="text-lg font-black text-emerald-700">{building.totalUnits} টি</p>
            </div>
            <div className="space-y-0.5">
              <p className="text-[11px] font-bold text-gray-400 uppercase">ভাড়া দেওয়া (Occupied)</p>
              <p className="text-lg font-black text-blue-700">{building.occupiedUnits} টি</p>
            </div>
            <div className="space-y-0.5">
              <p className="text-[11px] font-bold text-gray-400 uppercase">খালি (Vacant)</p>
              <p className="text-lg font-black text-amber-700">{building.vacantUnits} টি</p>
            </div>
          </div>

          {/* Facilities Breakdown Card */}
          <div className="bg-white rounded-2xl p-5 border border-gray-200">
            <div className="flex items-center gap-2 mb-3">
              <Car size={18} className="text-[#054a48]" />
              <h3 className="font-extrabold text-gray-900 text-base">
                ভবনের সুযোগ সুবিধা (Facilities & Security)
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-gray-50 flex items-center justify-between">
                <span className="text-gray-600">পার্কিং স্থান:</span>
                <span className="font-bold text-gray-800">
                  {building.facilities?.parkingSpaces || 0} টি
                </span>
              </div>

              <div className="p-3 rounded-xl bg-gray-50 flex items-center justify-between">
                <span className="text-gray-600">লিফট সুবিধা:</span>
                <span className="font-bold text-gray-800">
                  {building.facilities?.liftCount || 0} টি ({building.facilities?.liftBrand || "N/A"})
                </span>
              </div>

              <div className="p-3 rounded-xl bg-gray-50 flex items-center justify-between">
                <span className="text-gray-600">জেনারেটর ব্যাকআপ:</span>
                <span className="font-bold text-emerald-700 flex items-center gap-1">
                  {building.facilities?.hasGenerator ? (
                    <>
                      <Zap size={13} /> {building.facilities.generatorCapacity || "আছে"}
                    </>
                  ) : (
                    "নেই"
                  )}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-gray-50 flex items-center justify-between">
                <span className="text-gray-600">সিকিউরিটি গেট:</span>
                <span className="font-bold text-gray-800">
                  {building.facilities?.gateType || "সাধারণ গেট"}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-gray-50 flex items-center justify-between">
                <span className="text-gray-600">গার্ড সংখ্যা:</span>
                <span className="font-bold text-gray-800">
                  {building.facilities?.guardCount || 0} জন
                </span>
              </div>

              <div className="p-3 rounded-xl bg-gray-50 flex items-center justify-between">
                <span className="text-gray-600">সিসিটিভি ক্যামেরা:</span>
                <span className="font-bold text-emerald-700 flex items-center gap-1">
                  {building.facilities?.hasCctv ? (
                    <>
                      <CheckCircle2 size={13} /> কভারেজ রয়েছে
                    </>
                  ) : (
                    "নেই"
                  )}
                </span>
              </div>
            </div>
          </div>

          {/* Management Team List */}
          {building.management && building.management.length > 0 && (
            <div className="bg-white rounded-2xl p-5 border border-gray-200 space-y-3">
              <div className="flex items-center gap-2">
                <ShieldCheck size={18} className="text-[#054a48]" />
                <h3 className="font-extrabold text-gray-900 text-base">
                  বিল্ডিং ম্যানেজমেন্ট ও কেয়ারটেকার টিম ({building.management.length} জন)
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {building.management.map((m) => (
                  <div
                    key={m.id}
                    className="p-3.5 rounded-xl border border-gray-100 bg-gray-50/60 flex items-center justify-between"
                  >
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm">{m.name}</h4>
                      <p className="text-xs text-emerald-700 font-semibold">{m.role}</p>
                      <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                        <Phone size={12} /> {m.phone}
                      </p>
                    </div>
                    {m.salary && (
                      <div className="text-right">
                        <span className="text-[10px] text-gray-400 uppercase block">মাসিক বেতন</span>
                        <span className="text-xs font-extrabold text-gray-800">৳ {m.salary}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Map Link button if available */}
          {building.googleMapLink && (
            <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-100 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-blue-900 font-medium">
                <MapPin size={16} className="text-blue-600" />
                <span>ভবনের সঠিক লোকেশন গুগল ম্যাপে পিন করা আছে।</span>
              </div>
              <a
                href={building.googleMapLink}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-2xs transition-colors"
              >
                গুগল ম্যাপে দেখুন <ExternalLink size={13} />
              </a>
            </div>
          )}
        </div>

        {/* Modal Actions Footer */}
        <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between shrink-0">
          <Button
            variant="outline"
            onClick={onClose}
            className="rounded-xl text-xs font-semibold"
          >
            বন্ধ করুন
          </Button>

          <div className="flex items-center gap-2">
            <Button
              onClick={() => {
                onClose();
                onViewFlots(building);
              }}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl px-4 py-2 flex items-center gap-1.5"
            >
              <Grid size={15} /> ফ্ল্যাটসমূহ দেখুন
            </Button>

            <Button
              onClick={() => {
                onClose();
                onEdit(building);
              }}
              className="bg-[#054a48] hover:bg-[#085f5c] text-white font-bold text-xs rounded-xl px-4 py-2 flex items-center gap-1.5"
            >
              <Edit size={15} /> ভবন সম্পাদনা
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
