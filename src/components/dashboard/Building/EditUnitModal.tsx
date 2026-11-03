import React, { useState, useEffect } from "react";
import { X, Edit, Layers, Loader2 } from "lucide-react";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { toast } from "sonner";
import type { Flot, FloorInfo } from "./types";
import { useUpdateUnitByIdMutation } from "../../../redux/features/unit/unitApi";

interface EditUnitModalProps {
  isOpen: boolean;
  unit: Flot | null;
  buildingId: string;
  buildingName?: string;
  buildingAddress?: string;
  buildingPhone?: string;
  floors?: FloorInfo[];
  onClose: () => void;
  onSaved?: () => void;
}

export default function EditUnitModal({
  isOpen,
  unit,
  buildingId,
  buildingName = "",
  buildingAddress = "",
  buildingPhone = "",
  floors = [],
  onClose,
  onSaved,
}: EditUnitModalProps) {
  const initialFloorNo =
    typeof unit?.floor === "object"
      ? (unit.floor as any)?.floorNo
      : typeof unit?.floor === "number"
      ? unit.floor
      : unit?.floorNo ?? unit?.floorNumber ?? 1;

  const [selectedFloorNo, setSelectedFloorNo] = useState<number>(initialFloorNo);
  const [unitNo, setUnitNo] = useState("");
  const [baseFare, setBaseFare] = useState("8000");
  const [utilityBill, setUtilityBill] = useState("500");
  const [waterBill, setWaterBill] = useState("1000");
  const [gasBill, setGasBill] = useState("1080");
  const [liftBill, setLiftBill] = useState("500");
  const [garageBill, setGarageBill] = useState("0");
  const [dueBill, setDueBill] = useState("0");
  const [isAccupied, setIsAccupied] = useState<boolean>(false);
  const [details, setDetails] = useState("");

  const [updateUnitApi, { isLoading: isUpdating }] = useUpdateUnitByIdMutation();

  useEffect(() => {
    if (unit) {
      const fNo =
        typeof unit.floor === "object"
          ? (unit.floor as any)?.floorNo
          : typeof unit.floor === "number"
          ? unit.floor
          : unit.floorNo ?? unit.floorNumber ?? 1;

      setSelectedFloorNo(fNo);
      setUnitNo(unit.unitNo || unit.flatNo || "");
      setBaseFare(String(unit.baseFare || unit.baseRent || 0));
      setUtilityBill(String(unit.utilityBill || unit.electricityBill || 0));
      setWaterBill(String(unit.waterBill || unit.waterFee || 0));
      setGasBill(String(unit.gasBill || unit.gasFee || 0));
      setLiftBill(String(unit.liftBill || unit.liftFee || 0));
      setGarageBill(String(unit.garageBill || unit.parkingFee || 0));
      setDueBill(String(unit.dueBill || unit.dueAmount || 0));
      setIsAccupied(
        Boolean(
          unit.isOccupied ||
            unit.isAccupied ||
            unit.status === "active" ||
            unit.status === "ভাড়া দেওয়া",
        ),
      );
      setDetails(unit.details || "");
    }
  }, [unit]);

  if (!isOpen || !unit) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!unitNo.trim()) {
      toast.error("অনুগ্রহ করে ইউনিট নম্বর প্রদান করুন!");
      return;
    }

    const selectedFloorObj =
      floors.find((f) => Number(f.floorNo) === Number(selectedFloorNo)) ||
      floors[0];

    const unitId = unit._id || unit.id;

    const payload = {
      building: {
        _id: buildingId,
        name: buildingName,
        address: buildingAddress,
        phoneNo: buildingPhone,
      },
      floor: {
        _id: selectedFloorObj?._id || `flr_${buildingId}_${selectedFloorNo}`,
        floorNo: Number(selectedFloorNo),
      },
      unitNo: String(unitNo),
      baseFare: Number(baseFare) || 0,
      utilityBill: Number(utilityBill) || 0,
      waterBill: Number(waterBill) || 0,
      gasBill: Number(gasBill) || 0,
      liftBill: Number(liftBill) || 0,
      garageBill: Number(garageBill) || 0,
      dueBill: Number(dueBill) || 0,
      isOccupied: isAccupied,
      details: details,
    };

    try {
      const res = await updateUnitApi({
        id: unitId,
        data: payload,
      }).unwrap();

      toast.success(
        res?.message || `ইউনিট ${unitNo} সফলভাবে আপডেট করা হয়েছে!`,
      );
      if (onSaved) onSaved();
      onClose();
    } catch (error: any) {
      console.error("Error updating unit:", error);
      toast.error(
        error?.data?.message || "ইউনিট আপডেট করতে সমস্যা হয়েছে!",
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl max-w-xl w-full p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto border border-gray-100">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <div>
            <h3 className="text-lg font-extrabold text-gray-900 flex items-center gap-2">
              <Edit className="text-[#054a48]" size={20} />
              ইউনিট এডিট করুন (Edit Unit)
            </h3>
            <p className="text-xs text-gray-500 font-medium mt-0.5">
              বিল্ডিং: {buildingName} | ইউনিট: {unitNo}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {/* Floor Selection */}
            <div>
              <Label className="font-bold text-gray-700 mb-1.5 block flex items-center gap-1">
                <Layers size={13} className="text-[#054a48]" /> ফ্লোর নির্বাচন <span className="text-red-500">*</span>
              </Label>
              {floors.length > 0 ? (
                <select
                  value={selectedFloorNo}
                  onChange={(e) => setSelectedFloorNo(Number(e.target.value))}
                  className="w-full h-10 px-3 rounded-xl border border-gray-200 text-xs font-bold bg-white focus:outline-none"
                >
                  {floors.map((f, idx) => (
                    <option key={f._id || idx} value={f.floorNo}>
                      Floor-{f.floorNo} ({f.floorNo}ম তলা)
                    </option>
                  ))}
                </select>
              ) : (
                <Input
                  type="number"
                  required
                  min={1}
                  value={selectedFloorNo}
                  onChange={(e) => setSelectedFloorNo(Number(e.target.value))}
                  className="rounded-xl text-xs font-bold"
                />
              )}
            </div>

            {/* Unit No */}
            <div>
              <Label className="font-bold text-gray-700 mb-1.5 block">
                ইউনিট নম্বর (unitNo) <span className="text-red-500">*</span>
              </Label>
              <Input
                type="text"
                required
                placeholder="e.g. 101, 1A"
                value={unitNo}
                onChange={(e) => setUnitNo(e.target.value)}
                className="rounded-xl text-xs font-bold"
              />
            </div>

            {/* Base Fare */}
            <div>
              <Label className="font-bold text-gray-700 mb-1.5 block">
                মূল ভাড়া (baseFare ৳) <span className="text-red-500">*</span>
              </Label>
              <Input
                type="number"
                required
                min={0}
                placeholder="8000"
                value={baseFare}
                onChange={(e) => setBaseFare(e.target.value)}
                className="rounded-xl text-xs font-bold"
              />
            </div>

            {/* Utility Bill */}
            <div>
              <Label className="font-semibold text-gray-700 mb-1.5 block">
                ইউটিলিটি বিল (utilityBill ৳)
              </Label>
              <Input
                type="number"
                min={0}
                placeholder="500"
                value={utilityBill}
                onChange={(e) => setUtilityBill(e.target.value)}
                className="rounded-xl text-xs"
              />
            </div>

            {/* Water Bill */}
            <div>
              <Label className="font-semibold text-gray-700 mb-1.5 block">
                পানি বিল (waterBill ৳)
              </Label>
              <Input
                type="number"
                min={0}
                placeholder="1000"
                value={waterBill}
                onChange={(e) => setWaterBill(e.target.value)}
                className="rounded-xl text-xs"
              />
            </div>

            {/* Gas Bill */}
            <div>
              <Label className="font-semibold text-gray-700 mb-1.5 block">
                গ্যাস বিল (gasBill ৳)
              </Label>
              <Input
                type="number"
                min={0}
                placeholder="1080"
                value={gasBill}
                onChange={(e) => setGasBill(e.target.value)}
                className="rounded-xl text-xs"
              />
            </div>

            {/* Lift Bill */}
            <div>
              <Label className="font-semibold text-gray-700 mb-1.5 block">
                লিফট বিল (liftBill ৳)
              </Label>
              <Input
                type="number"
                min={0}
                placeholder="500"
                value={liftBill}
                onChange={(e) => setLiftBill(e.target.value)}
                className="rounded-xl text-xs"
              />
            </div>

            {/* Garage Bill */}
            <div>
              <Label className="font-semibold text-gray-700 mb-1.5 block">
                গ্যারেজ বিল (garageBill ৳)
              </Label>
              <Input
                type="number"
                min={0}
                placeholder="0"
                value={garageBill}
                onChange={(e) => setGarageBill(e.target.value)}
                className="rounded-xl text-xs"
              />
            </div>

            {/* Due Bill */}
            <div>
              <Label className="font-semibold text-gray-700 mb-1.5 block">
                বকেয়া বিল (dueBill ৳)
              </Label>
              <Input
                type="number"
                min={0}
                placeholder="0"
                value={dueBill}
                onChange={(e) => setDueBill(e.target.value)}
                className="rounded-xl text-xs"
              />
            </div>

            {/* Is Occupied */}
            <div>
              <Label className="font-bold text-gray-700 mb-1.5 block">
                অকুপেন্সি (isOccupied Boolean)
              </Label>
              <select
                value={isAccupied ? "YES" : "NO"}
                onChange={(e) => setIsAccupied(e.target.value === "YES")}
                className="w-full h-9 px-3 rounded-xl border border-gray-200 text-xs font-semibold bg-white focus:outline-none"
              >
                <option value="NO">false (খালি)</option>
                <option value="YES">true (ভাড়া দেওয়া)</option>
              </select>
            </div>

            {/* Details */}
            <div className="md:col-span-2">
              <Label className="font-semibold text-gray-700 mb-1.5 block">
                ইউনিট বিবরন (details string)
              </Label>
              <Input
                type="text"
                placeholder="ইউনিটের বিবরণ..."
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                className="rounded-xl text-xs"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="text-gray-600 font-semibold rounded-xl text-xs px-5 py-2.5 cursor-pointer"
            >
              বাতিল (Cancel)
            </Button>
            <Button
              type="submit"
              disabled={isUpdating}
              className="bg-[#054a48] hover:bg-[#085f5c] disabled:opacity-50 text-white font-extrabold rounded-xl text-xs px-6 py-2.5 shadow-md cursor-pointer flex items-center gap-1.5"
            >
              {isUpdating ? (
                <>
                  <Loader2 size={16} className="animate-spin" /> আপডেটের কাজ চলছে...
                </>
              ) : (
                <>
                  <Edit size={16} /> আপডেট করুন (Update Unit)
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
