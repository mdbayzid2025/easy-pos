import {
  Building2,
  Phone,
  Shield,
  Layers,
  DoorOpen,
  UserCheck,
  Plus,
  Trash2,
  Car,
  Zap,
} from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import type { BuildingOverviewTabProps } from "./utils/types";

export default function BuildingOverviewTab({
  building,
  buildingFloors,
  allFlots,
  buildingMembers,
  isManagementLoading,
  onOpenAddMember,
  onDeleteMember,
}: BuildingOverviewTabProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (4 Cols): Building Profile Card (Lighter BG) */}
        <div className="lg:col-span-4 bg-emerald-50/80 p-6 rounded-3xl border border-emerald-200/80 shadow-xs space-y-4 relative overflow-hidden">
          {/* Building Photo / Profile */}
          <div className="relative">
            {building.photo ? (
              <img
                src={building.photo}
                alt={building.name}
                className="w-full h-44 rounded-2xl object-contain "
              />
            ) : (
              <div className="w-full h-36 rounded-2xl bg-[#054a48] text-white flex flex-col items-center justify-center border-2 border-emerald-200 shadow-xs space-y-2">
                <Building2 size={44} className="text-emerald-200" />
                <span className="text-xs font-bold text-emerald-100">
                  {building.name}
                </span>
              </div>
            )}
            <Badge
              variant="outline"
              className={`absolute top-3 right-3 text-xs font-bold px-2.5 py-0.5 ${
                building.status === "ACTIVE" || building.status === "সক্রিয়"
                  ? "bg-emerald-600 text-white border-emerald-500"
                  : "bg-red-600 text-white border-red-500"
              }`}
            >
              • {building.status}
            </Badge>
          </div>

          {/* Building Profile Info */}
          <div>
            <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest block">
              BUILDING ROOT NODE
            </span>
            <h3 className="text-xl font-extrabold text-gray-900 mt-0.5">
              {building.name}
            </h3>
            <p className="text-xs text-gray-600 font-medium mt-1">
              {building.address}
            </p>
          </div>

          {/* Stats & Contacts List */}
          <div className="pt-3 border-t border-emerald-200/80 space-y-2 text-xs text-gray-700 font-semibold">
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/80 border border-emerald-100">
              <span className="flex items-center gap-1.5 font-bold text-gray-600">
                <Phone size={13} className="text-[#054a48]" /> ফোন নম্বর:
              </span>
              <span className="font-extrabold text-gray-900">
                {building.phoneNo || "N/A"}
              </span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/80 border border-emerald-100">
              <span className="flex items-center gap-1.5 font-bold text-gray-600">
                <Shield size={13} className="text-amber-600" /> জরুরী নম্বর:
              </span>
              <span className="font-extrabold text-amber-700">
                {building.emergencyContact || "N/A"}
              </span>
            </div>
            <div className="flex items-center justify-between gap-3">
              <div className="flex-1 flex items-center justify-between p-2.5 rounded-xl text-primary bg-primary/30">
                <span className="flex items-center gap-1.5 font-bold text-gray-600 text-md">
                  <Layers size={20} className="text-[#054a48] " /> মোট
                  ফ্লোর:
                </span>
                <span className="font-extrabold text-[#054a48] text-lg">
                  {buildingFloors.length}
                </span>
              </div>

              <div className="flex flex-1 items-center justify-between p-2.5 rounded-xl text-red-500 bg-red-500/30">
                <span className="flex items-center gap-1.5 font-bold text-gray-600 text-md">
                  <DoorOpen size={20} className="text-[#054a48] " /> মোট
                  ইউনিট:
                </span>
                <span className="font-extrabold text-[#054a48] text-lg">
                  {allFlots.length}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (8 Cols): Merged Management Members & Building Facilities */}
        <div className="lg:col-span-8 space-y-6">
          {/* Section 1: Management & Staff Members */}
          <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <UserCheck size={18} className="text-[#054a48]" />{" "}
                ম্যানেজমেন্ট ও স্টাফ মেম্বার ({buildingMembers.length})
              </h3>
              <Button
                size="sm"
                onClick={onOpenAddMember}
                className="bg-[#054a48] hover:bg-[#033433] text-white text-xs font-bold px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <Plus size={14} /> + মেম্বার যোগ
              </Button>
            </div>

            {isManagementLoading ? (
              <div className="p-6 text-center text-xs text-gray-400 font-bold">
                ম্যানেজমেন্ট মেম্বার লোড হচ্ছে...
              </div>
            ) : buildingMembers.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {buildingMembers.map((member: any, idx: number) => (
                  <div
                    key={member._id || idx}
                    className="p-3.5 rounded-2xl border border-gray-200 bg-gray-50/60 space-y-2.5 relative hover:border-[#054a48] transition-all"
                  >
                    <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-xl bg-[#054a48] text-white font-bold flex items-center justify-center text-xs">
                          <UserCheck size={15} />
                        </div>
                        <div>
                          <h4 className="text-xs font-extrabold text-gray-900 truncate">
                            {member.name}
                          </h4>
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md inline-block">
                            {member.role}
                          </span>
                        </div>
                      </div>
                      {member._id && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => onDeleteMember(member)}
                          className="text-red-500 hover:bg-red-50 h-7 w-7 p-0 rounded-lg cursor-pointer"
                          title="রিমুভ করুন"
                        >
                          <Trash2 size={14} />
                        </Button>
                      )}
                    </div>

                    <div className="space-y-1 text-xs text-gray-600">
                      <div className="flex items-center gap-1 font-semibold">
                        <Phone size={12} className="text-[#054a48]" />{" "}
                        মোবাইল:{" "}
                        <span className="font-bold text-gray-900">
                          {member.mobile}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 text-center space-y-2 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                <p className="text-xs text-gray-500 font-semibold">
                  এই বিল্ডিংয়ে কোনো ম্যানেজমেন্ট মেম্বার নিবন্ধিত নেই।
                </p>
              </div>
            )}
          </div>

          {/* Section 2: Building Facilities */}
          <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-3 flex items-center gap-2">
              <Building2 size={18} className="text-[#054a48]" /> বিল্ডিং
              তথ্য ও সুবিধা (Facilities & Amenities)
            </h3>
            <div className="grid grid-cols-1 gap-3 text-xs">
              <div className="flex items-center justify-between p-3 rounded-2xl bg-gray-50/80 border border-gray-100 font-bold">
                <span className="flex items-center gap-1.5">
                  <Car size={15} className="text-purple-600" /> পার্কিং
                </span>
                <span
                  className={
                    building.isParking
                      ? "text-emerald-700 font-extrabold"
                      : "text-gray-400"
                  }
                >
                  {building.isParking ? "✓ Available" : "✕ Not Available"}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-2xl bg-gray-50/80 border border-gray-100 font-bold">
                <span className="flex items-center gap-1.5">
                  <Building2 size={15} className="text-blue-600" /> লিফট
                </span>
                <span
                  className={
                    building.isLift
                      ? "text-emerald-700 font-extrabold"
                      : "text-gray-400"
                  }
                >
                  {building.isLift ? "✓ Available" : "✕ Not Available"}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-2xl bg-gray-50/80 border border-gray-100 font-bold">
                <span className="flex items-center gap-1.5">
                  <Zap size={15} className="text-amber-600" /> জেনারেটর
                </span>
                <span
                  className={
                    building.isGenerator
                      ? "text-emerald-700 font-extrabold"
                      : "text-gray-400"
                  }
                >
                  {building.isGenerator ? "✓ Available" : "✕ Not Available"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
