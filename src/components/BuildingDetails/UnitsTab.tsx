import {
  DoorOpen,
  Plus,
  Layers,
  ChevronDown,
  CheckCircle2,
  Home,
  User,
  CreditCard,
  Eye,
  Edit,
  Trash2,
  LogOut,
  UserPlus,
} from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import type { UnitsTabProps } from "./utils/types";
import type { Flot } from "../dashboard/Building/types";
import {
  calculateTotalBillAmount,
  resolveUnitOccupancy,
} from "./utils/unitHelpers";

function UnitCard({
  unit,
  isOcc,
  tenantNameDisplay,
  totalBillAmount,
  onSelectFlot,
  onEditUnit,
  onDeleteUnit,
  onCheckoutTenant,
  onAssignTenant,
}: {
  unit: Flot;
  isOcc: boolean;
  tenantNameDisplay: string;
  totalBillAmount: number;
  onSelectFlot: (flot: Flot) => void;
  onEditUnit: (flot: Flot) => void;
  onDeleteUnit: (flot: Flot) => void;
  onCheckoutTenant: (flot: Flot) => void;
  onAssignTenant: (flot: Flot) => void;
}) {
  return (
    <div
      key={unit._id || unit.id}
      className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs space-y-3 hover:shadow-md transition-all relative group"
    >
      {/* Card Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold shrink-0">
            <DoorOpen size={20} />
          </div>
          <div>
            <span className="text-[11px] font-medium text-gray-400 block uppercase tracking-wider">
              ইউনিট
            </span>
            <h4 className="text-base font-extrabold text-gray-900 leading-none mt-0.5">
              {unit.unitNo || unit.flatNo || unit.unitName || "1A"}
            </h4>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onSelectFlot(unit)}
          className="w-8 h-8 rounded-xl bg-blue-50/70 text-blue-600 flex items-center justify-center cursor-pointer hover:bg-blue-100 transition-colors"
          title="বিস্তারিত দেখুন"
        >
          <ChevronDown size={16} />
        </button>
      </div>

      {/* Badges */}
      <div className="flex items-center gap-2 pt-0.5">
        <Badge
          variant="outline"
          className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[11px] font-semibold px-2 py-0.5 flex items-center gap-1"
        >
          <CheckCircle2 size={12} className="text-emerald-600" />
          <span>
            {unit.status === "inactive" ||
            (unit.status as string) === "নিষ্ক্রিয়"
              ? "নিষ্ক্রিয়"
              : "সক্রিয়"}
          </span>
        </Badge>

        <Badge
          variant="outline"
          className={`text-[11px] font-semibold px-2 py-0.5 flex items-center gap-1 ${
            isOcc
              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
              : "bg-amber-50 text-amber-700 border-amber-200"
          }`}
        >
          <Home size={12} />
          <span>{isOcc ? "Occupied" : "Vacant"}</span>
        </Badge>
      </div>

      {/* Info Boxes Grid (2 cols) */}
      <div className="grid grid-cols-2 gap-2 pt-0.5">
        {/* Left Box: Tenant */}
        <div className="bg-gray-50/80 border border-gray-100 p-2.5 rounded-xl space-y-1">
          <div className="flex items-center gap-1.5 text-[11px] font-medium text-gray-400">
            <User size={13} className="text-gray-400" />
            <span>ভাড়াটিয়া</span>
          </div>
          <div className="text-xs font-bold text-gray-800 truncate">
            {tenantNameDisplay}
          </div>
        </div>

        {/* Right Box: Monthly Charge */}
        <div className="bg-gray-50/80 border border-gray-100 p-2.5 rounded-xl space-y-1">
          <div className="flex items-center gap-1.5 text-[11px] font-medium text-gray-400">
            <CreditCard size={13} className="text-gray-400" />
            <span>Monthly Charge</span>
          </div>
          <div className="text-xs font-bold text-gray-900">
            ৳{" "}
            {(totalBillAmount || 0).toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </div>
        </div>
      </div>

      {/* Card Actions */}
      <div className="flex items-center gap-1.5 pt-1 border-t border-gray-100">
        <Button
          size="sm"
          variant="ghost"
          onClick={() => onSelectFlot(unit)}
          className="h-7 text-[11px] font-bold text-[#054a48] hover:bg-emerald-50 rounded-lg flex-1 cursor-pointer"
        >
          <Eye size={13} className="mr-1" /> বিস্তারিত
        </Button>

        <Button
          size="sm"
          variant="outline"
          onClick={() => onEditUnit(unit)}
          className="h-7 w-7 p-0 text-blue-600 border-blue-200 hover:bg-blue-50 rounded-lg cursor-pointer flex items-center justify-center shrink-0"
          title="এডিট (Edit Unit)"
        >
          <Edit size={13} />
        </Button>

        <Button
          size="sm"
          variant="outline"
          onClick={() => onDeleteUnit(unit)}
          className="h-7 w-7 p-0 text-red-600 border-red-200 hover:bg-red-50 rounded-lg cursor-pointer flex items-center justify-center shrink-0"
          title="ডিলিট (Delete Unit)"
        >
          <Trash2 size={13} />
        </Button>

        {isOcc ? (
          <Button
            size="sm"
            variant="outline"
            onClick={() => onCheckoutTenant(unit)}
            className="h-7 text-[11px] font-bold text-red-600 border-red-200 hover:bg-red-50 rounded-lg px-2 cursor-pointer"
          >
            <LogOut size={13} className="mr-1" /> খালি
          </Button>
        ) : (
          <Button
            size="sm"
            onClick={() => onAssignTenant(unit)}
            className="h-7 text-[11px] font-bold bg-[#857228] hover:bg-[#6e5e20] text-white rounded-lg px-2 cursor-pointer flex items-center"
          >
            <UserPlus size={13} className="mr-1" /> ভাড়া
          </Button>
        )}
      </div>
    </div>
  );
}

export default function UnitsTab({
  uniqueFloorNumbers,
  buildingFloors,
  getUnitsForFloor,
  groupedUsersData,
  onOpenAddFloor,
  onOpenAddUnit,
  onSelectFlot,
  onEditUnit,
  onDeleteUnit,
  onCheckoutTenant,
  onAssignTenant,
}: UnitsTabProps) {
  const totalUnitsCount = uniqueFloorNumbers.reduce((acc, fNo) => {
    const floorObj = buildingFloors.find(
      (f) => Number(f.floorNo) === Number(fNo),
    );
    return acc + getUnitsForFloor(fNo, floorObj?._id).length;
  }, 0);

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-gray-900 font-extrabold text-base">
          <DoorOpen size={20} className="text-[#054a48]" />
          <span>সকল ইউনিট (ফ্লোর অনুসারে বিন্যস্ত) ({totalUnitsCount})</span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={onOpenAddFloor}
            className="bg-emerald-50 hover:bg-emerald-100 text-[#054a48] border border-emerald-200 text-xs font-bold px-3.5 py-2 rounded-xl cursor-pointer flex items-center gap-1.5"
          >
            <Plus size={14} /> + ফ্লোর যোগ
          </Button>
          <Button
            size="sm"
            disabled={buildingFloors.length === 0}
            onClick={() => onOpenAddUnit(buildingFloors[0]?.floorNo || 1)}
            className="bg-[#054a48] hover:bg-[#033433] text-white text-xs font-bold px-4 py-2 rounded-xl cursor-pointer flex items-center gap-1.5 shadow-xs"
          >
            <Plus size={14} /> + নতুন ইউনিট যোগ
          </Button>
        </div>
      </div>

      {/* Grouped Floors Container */}
      {uniqueFloorNumbers.length > 0 ? (
        uniqueFloorNumbers.map((fNo) => {
          const floorObj = buildingFloors.find(
            (f) => Number(f.floorNo) === Number(fNo),
          );
          const floorUnits = getUnitsForFloor(fNo, floorObj?._id);

          return (
            <div
              key={fNo}
              className="bg-white rounded-3xl p-5 border border-gray-200 shadow-xs space-y-4 relative overflow-hidden"
            >
              {/* Floor Header Bar */}
              <div className="flex items-center justify-between border-b border-gray-100 pb-3 bg-emerald-50/60 p-3 rounded-2xl border-l-4 border-l-[#054a48]">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-[#054a48] text-white rounded-xl font-bold">
                    <Layers size={16} />
                  </div>
                  <div>
                    <h4 className="text-sm font-extrabold text-gray-900">
                      Floor-{fNo} ({fNo}ম তলা)
                    </h4>
                    <span className="text-xs text-gray-500 font-medium">
                      {floorUnits.length}{" "}
                      {floorUnits.length === 1 ? "Unit" : "Units"} under
                      Floor-{fNo}
                    </span>
                  </div>
                </div>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onOpenAddUnit(fNo)}
                  className="bg-white hover:bg-emerald-50 text-[#054a48] border-emerald-200 text-xs font-bold px-3 py-1.5 rounded-xl cursor-pointer flex items-center gap-1"
                >
                  <Plus size={13} /> + Floor-{fNo} এ ইউনিট যোগ
                </Button>
              </div>

              {/* Floor Units Grid */}
              {floorUnits.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {floorUnits.map((unit) => {
                    const currentFloorUsers = groupedUsersData
                      .filter((g: any) => {
                        const groupFloorNo = g.floor?.floorNo;
                        const groupFloorId = g.floor?._id;
                        const targetFloorNo = fNo;
                        const targetFloorId = floorObj?._id;

                        const isFloorNoMatch =
                          groupFloorNo !== undefined &&
                          groupFloorNo !== null &&
                          Number(groupFloorNo) === Number(targetFloorNo);

                        const isFloorIdMatch =
                          groupFloorId &&
                          targetFloorId &&
                          String(groupFloorId) === String(targetFloorId);

                        return isFloorNoMatch || isFloorIdMatch;
                      })
                      .flatMap((g: any) => g.users || []);

                    const currentUnitId = unit._id
                      ? String(unit._id)
                      : unit.id
                        ? String(unit.id)
                        : null;
                    const currentUnitNo = String(
                      unit.unitNo || unit.flatNo || unit.unitName || "",
                    )
                      .trim()
                      .toLowerCase();

                    const matchedUser = currentFloorUsers.find((u: any) => {
                      const uUnitId = u.unit?._id
                        ? String(u.unit._id)
                        : u.unit?.id
                          ? String(u.unit.id)
                          : null;
                      const uUnitNo = String(
                        u.unit?.unitNo || u.unit?.flatNo || u.unit?.flotNo || "",
                      )
                        .trim()
                        .toLowerCase();

                      // 1. If both have valid non-empty unit IDs, match by unit ID
                      if (currentUnitId && uUnitId && currentUnitId === uUnitId) {
                        return true;
                      }

                      // 2. Otherwise match by unit number (both must be non-empty)
                      if (currentUnitNo && uUnitNo && currentUnitNo === uUnitNo) {
                        return true;
                      }

                      return false;
                    });

                    const { isOcc, tenantNameDisplay } = resolveUnitOccupancy(
                      unit,
                      matchedUser,
                    );
                    const totalBillAmount = calculateTotalBillAmount(unit);

                    const unitWithTenant: Flot = matchedUser
                      ? ({
                          ...unit,
                          isOccupied: true,
                          tenant: matchedUser,
                          tenantId: matchedUser._id || matchedUser.id,
                          tenantName:
                            matchedUser.name ||
                            unit.tenantName ||
                            tenantNameDisplay,
                        } as any as Flot)
                      : ({
                          ...unit,
                          isOccupied: isOcc,
                          tenant: isOcc ? unit.tenant : null,
                          tenantId: isOcc ? (unit as any).tenantId : undefined,
                          tenantName: isOcc
                            ? unit.tenantName || tenantNameDisplay
                            : undefined,
                        } as any as Flot);

                    return (
                      <UnitCard
                        key={unit._id || unit.id}
                        unit={unitWithTenant}
                        isOcc={isOcc}
                        tenantNameDisplay={tenantNameDisplay}
                        totalBillAmount={totalBillAmount}
                        onSelectFlot={onSelectFlot}
                        onEditUnit={onEditUnit}
                        onDeleteUnit={onDeleteUnit}
                        onCheckoutTenant={onCheckoutTenant}
                        onAssignTenant={onAssignTenant}
                      />
                    );
                  })}
                </div>
              ) : (
                <div className="p-6 text-center text-xs text-gray-400 bg-gray-50 rounded-2xl border border-dashed border-gray-200 font-semibold">
                  Floor-{fNo} এ এখনো কোনো ইউনিট যুক্ত করা হয়নি। '+ Floor-{fNo}{" "}
                  এ ইউনিট যোগ' বাটনে ক্লিক করে যোগ করতে পারেন।
                </div>
              )}
            </div>
          );
        })
      ) : (
        <div className="bg-white rounded-3xl p-8 sm:p-10 border-2 border-dashed border-gray-200 text-center space-y-4 shadow-xs">
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-[#054a48] mx-auto flex items-center justify-center border border-emerald-100">
            <Layers size={32} />
          </div>
          <div className="max-w-md mx-auto space-y-1">
            <h4 className="text-base font-extrabold text-gray-900">
              কোনো ফ্লোর বা ইউনিট পাওয়া যায়নি (No Floors/Units Found)
            </h4>
            <p className="text-xs text-gray-500 font-medium leading-relaxed">
              এই বিল্ডিংয়ে এখনো কোনো ফ্লোর যুক্ত করা হয়নি। প্রথমে একটি ফ্লোর
              যোগ করুন।
            </p>
          </div>
          <Button
            size="sm"
            onClick={onOpenAddFloor}
            className="bg-[#054a48] hover:bg-[#033433] text-white font-extrabold text-xs rounded-xl px-6 py-2.5 shadow-md cursor-pointer inline-flex items-center gap-2"
          >
            <Plus size={16} /> + ফ্লোর যোগ করুন (Add Floor)
          </Button>
        </div>
      )}
    </div>
  );
}
