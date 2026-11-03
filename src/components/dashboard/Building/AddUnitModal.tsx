import { Home, Layers, Loader2, Plus, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { useAddUnitMutation } from "../../../redux/features/unit/unitApi";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import type { FloorInfo } from "./types";

interface AddUnitModalProps {
  isOpen: boolean;
  buildingId: string;
  buildingName?: string;
  buildingAddress?: string;
  buildingPhone?: string;
  floors?: FloorInfo[];
  defaultFloorNo?: number;
  onClose: () => void;
  onSave?: (unitData: any) => void;
}

export default function AddUnitModal({
  isOpen,
  buildingId,
  buildingName = "",
  buildingAddress = "",
  buildingPhone = "",
  floors = [],
  defaultFloorNo = 1,
  onClose,
  onSave,
}: AddUnitModalProps) {
  const [selectedFloorNo, setSelectedFloorNo] =
    useState<number>(defaultFloorNo);
  const [unitNo, setUnitNo] = useState("");
  const [baseFare, setBaseFare] = useState("0");
  const [utilityBill, setUtilityBill] = useState("0");
  const [waterBill, setWaterBill] = useState("0");
  const [gasBill, setGasBill] = useState("0");
  const [liftBill, setLiftBill] = useState("0");
  const [garageBill, setGarageBill] = useState("0");
  const [dueBill, setDueBill] = useState("0");
  const [status, setStatus] = useState<"ACTIVE" | "INACTIVE">("ACTIVE");
  const [isAccupied, setIsAccupied] = useState<boolean>(false);
  const [details, setDetails] = useState("");

  const [addUnitApi, { isLoading: isAddingUnit }] = useAddUnitMutation();

  useEffect(() => {
    setSelectedFloorNo(defaultFloorNo || (floors[0]?.floorNo ?? 1));
  }, [defaultFloorNo, floors]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!unitNo.trim()) {
      toast.error("অনুগ্রহ করে ইউনিট নম্বর প্রদান করুন (যেমন: 101, 1A)!");
      return;
    }

    const selectedFloorObj =
      floors.find((f) => Number(f.floorNo) === Number(selectedFloorNo)) ||
      floors[0];

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
      status: status,
      isOccupied: isAccupied,
      details: details,
    };

    try {
      const res = await addUnitApi(payload).unwrap();
      toast.success(res?.message || `ইউনিট ${unitNo} সফলভাবে যোগ করা হয়েছে!`);
      if (onSave) {
        onSave(res?.data || payload);
      }
      onClose();
    } catch (error: any) {
      console.error("Error adding unit:", error);
      toast.error(error?.data?.message || "ইউনিট যোগ করতে সমস্যা হয়েছে!");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl max-w-xl w-full p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto border border-gray-100">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <div>
            <h3 className="text-lg font-extrabold text-gray-900 flex items-center gap-2">
              <Home className="text-[#054a48]" size={20} />
              নতুন ইউনিট যোগ করুন (Unit Schema Form)
            </h3>
            <p className="text-xs text-gray-500 font-medium mt-0.5">
              বিল্ডিং: {buildingName} | ফ্লোর নির্বাচন
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
                <Layers size={13} className="text-[#054a48]" /> ফ্লোর নির্বাচন
                (floor.floorNo) <span className="text-red-500">*</span>
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
                placeholder="e.g. 1A, 101, unit-1"
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

            {/* Status (ACTIVE / INACTIVE) */}
            <div>
              <Label className="font-bold text-gray-700 mb-1.5 block">
                স্ট্যাটাস (status ENUM)
              </Label>
              <select
                value={status}
                onChange={(e) =>
                  setStatus(e.target.value as "ACTIVE" | "INACTIVE")
                }
                className="w-full h-9 px-3 rounded-xl border border-gray-200 text-xs font-semibold bg-white focus:outline-none"
              >
                <option value="ACTIVE">ACTIVE (সক্রিয়)</option>
                <option value="INACTIVE">INACTIVE (নিষ্ক্রিয়)</option>
              </select>
            </div>

            {/* Is Occupied (isAccupied) */}
            <div>
              <Label className="font-bold text-gray-700 mb-1.5 block">
                অকুপেন্সি (isAccupied Boolean)
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
                placeholder="ইউনিটের অতিরিক্ত ফিচার বা বিবরণ..."
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
              disabled={isAddingUnit}
              className="bg-[#054a48] hover:bg-[#085f5c] disabled:opacity-50 text-white font-extrabold rounded-xl text-xs px-6 py-2.5 shadow-md cursor-pointer flex items-center gap-1.5"
            >
              {isAddingUnit ? (
                <>
                  <Loader2 size={16} className="animate-spin" /> সংরক্ষণের কাজ
                  চলছে...
                </>
              ) : (
                <>
                  <Plus size={16} /> সংরক্ষণ করুন (Save Unit)
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
