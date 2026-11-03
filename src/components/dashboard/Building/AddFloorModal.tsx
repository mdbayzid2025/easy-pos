import { Layers, Loader2, Plus, X } from "lucide-react";
import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { useAddFloorMutation } from "../../../redux/features/floor/floorApi";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import type { BuildingInfo, Floor } from "./types";

interface AddFloorModalProps {
  isOpen: boolean;
  building: BuildingInfo;
  existingFloorCount?: number;
  existingFloors?: Floor[];
  onClose: () => void;
  onSuccess?: () => void;
}

export default function AddFloorModal({
  isOpen,
  building,
  existingFloorCount = 0,
  existingFloors = [],
  onClose,
  onSuccess,
}: AddFloorModalProps) {
  const [floorNo, setFloorNo] = useState<number | string>(1);
  const [addFloor, { isLoading }] = useAddFloorMutation();

  useEffect(() => {
    if (isOpen) {
      if (existingFloors && existingFloors.length > 0) {
        const maxFloor = existingFloors.reduce(
          (max, f) => (Number(f.floorNo) > max ? Number(f.floorNo) : max),
          0,
        );
        setFloorNo(maxFloor + 1);
      } else if (existingFloorCount > 0) {
        setFloorNo(existingFloorCount + 1);
      } else {
        setFloorNo(1);
      }
    }
  }, [isOpen, existingFloors, existingFloorCount]);

  if (!isOpen) return null;

  const handleFloorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value;
    if (rawVal === "") {
      setFloorNo("");
      return;
    }

    // Convert to positive integer, stripping leading zeros and negative/zero values
    const numVal = parseInt(rawVal, 10);
    if (isNaN(numVal) || numVal <= 0) {
      setFloorNo("");
    } else {
      setFloorNo(numVal);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const numericFloorNo = Number(floorNo);
    if (!numericFloorNo || numericFloorNo <= 0) {
      toast.error(
        "০ (Zero) গ্রহণযোগ্য নয়! অনুগ্রহ করে ১ বা তার থেকে বড় সঠিক ফ্লোর নম্বর দিন।",
      );
      return;
    }

    // Duplicate check
    const isDuplicate = existingFloors.some(
      (f) => Number(f.floorNo) === numericFloorNo,
    );
    if (isDuplicate) {
      toast.error(
        `ফ্লোর-${numericFloorNo} ইতিমধ্যেই বিল্ডিংয়ে বিদ্যমান! ডুপ্লিকেট ফ্লোর গ্রহণযোগ্য নয়।`,
      );
      return;
    }

    const payload = {
      floorNo: numericFloorNo,
      building: {
        _id: building._id || "bld",
        name: building.name || "ভবন",
        address: building.address || "",
        phoneNo: building.phoneNo || "",
      },
    };

    try {
      await addFloor(payload).unwrap();
      toast.success(`ফ্লোর-${numericFloorNo} সফলভাবে যোগ করা হয়েছে!`);
      if (onSuccess) {
        onSuccess();
      }
      onClose();
    } catch (err: any) {
      toast.error(
        err?.data?.message || `ফ্লোর-${numericFloorNo} যোগ করতে সমস্যা হয়েছে!`,
      );
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 space-y-5 border border-gray-100">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2.5 bg-[#054a48] text-white rounded-xl">
              <Layers size={18} />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-gray-900">
                নতুন ফ্লোর যোগ করুন (Add Floor)
              </h3>
              <p className="text-xs text-gray-500 font-semibold mt-0.5">
                বিল্ডিং: {building.name}
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label className="text-xs font-bold text-gray-700 mb-1.5 block">
              ফ্লোর নম্বর (floorNo - Number){" "}
              <span className="text-red-500">*</span>
            </Label>
            <Input
              type="number"
              required
              min={1}
              max={100}
              placeholder="e.g. 1, 2, 3..."
              value={floorNo}
              onKeyDown={(e) => {
                if (["e", "E", "-", "+", "."].includes(e.key)) {
                  e.preventDefault();
                }
              }}
              onChange={handleFloorChange}
              className="rounded-xl text-sm font-bold"
            />
            <p className="text-[11px] text-gray-400 mt-1">
              যেমন: ১ (১ম তলা), ২ (২য় তলা), ৩ (৩য় তলা)। (০ গ্রহণযোগ্য নয়)
            </p>
          </div>

          <div className="p-3 bg-emerald-50 rounded-xl text-xs text-[#054a48] space-y-1">
            <div className="font-bold flex items-center gap-1">
              <Layers size={14} /> Schema Floor Linked:
            </div>
            <div>
              Building ID:{" "}
              <span className="font-mono text-[11px]">{building._id}</span>
            </div>
            <div>Building Name: {building.name}</div>
            <div>Address: {building.address || "N/A"}</div>
            <div>Phone: {building.phoneNo || "N/A"}</div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              disabled={isLoading}
              onClick={onClose}
              className="text-gray-600 text-xs font-semibold rounded-xl px-4 py-2 cursor-pointer"
            >
              বাতিল (Cancel)
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-[#054a48] hover:bg-[#033433] text-white text-xs font-bold px-5 py-2 rounded-xl shadow-md cursor-pointer flex items-center gap-1.5"
            >
              {isLoading ? (
                <>
                  <Loader2 size={16} className="animate-spin" /> যুক্ত করা
                  হচ্ছে...
                </>
              ) : (
                <>
                  <Plus size={16} /> ফ্লোর যুক্ত করুন
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
