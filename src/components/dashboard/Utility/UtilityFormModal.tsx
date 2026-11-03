import React, { useState, useEffect } from "react";
import { X, Zap, Droplet, Flame, ArrowUpCircle, Car, Plus, Save, Calculator } from "lucide-react";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { toast } from "sonner";
import {
  useAddUtilityMutation,
  useUpdateUtilityByIdMutation,
} from "../../../redux/features/utility/utilityApi";
import type { Utility } from "../../../types/utility";

interface UtilityFormModalProps {
  isOpen: boolean;
  editingUtility?: Utility | null;
  onClose: () => void;
}

export default function UtilityFormModal({
  isOpen,
  editingUtility,
  onClose,
}: UtilityFormModalProps) {
  const [electricityBill, setElectricityBill] = useState<string>("0");
  const [waterBill, setWaterBill] = useState<string>("0");
  const [gasBill, setGasBill] = useState<string>("0");
  const [liftBill, setLiftBill] = useState<string>("0");
  const [garageBill, setGarageBill] = useState<string>("0");

  const [addUtility, { isLoading: isAdding }] = useAddUtilityMutation();
  const [updateUtility, { isLoading: isUpdating }] = useUpdateUtilityByIdMutation();

  const isEditing = Boolean(editingUtility && (editingUtility._id || editingUtility.id));

  useEffect(() => {
    if (editingUtility) {
      setElectricityBill(String(editingUtility.electricityBill ?? 0));
      setWaterBill(String(editingUtility.waterBill ?? 0));
      setGasBill(String(editingUtility.gasBill ?? 0));
      setLiftBill(String(editingUtility.liftBill ?? 0));
      setGarageBill(String(editingUtility.garageBill ?? 0));
    } else {
      setElectricityBill("0");
      setWaterBill("0");
      setGasBill("0");
      setLiftBill("0");
      setGarageBill("0");
    }
  }, [editingUtility, isOpen]);

  if (!isOpen) return null;

  const numElectricity = Number(electricityBill) || 0;
  const numWater = Number(waterBill) || 0;
  const numGas = Number(gasBill) || 0;
  const numLift = Number(liftBill) || 0;
  const numGarage = Number(garageBill) || 0;
  const totalBill = numElectricity + numWater + numGas + numLift + numGarage;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      electricityBill: numElectricity,
      waterBill: numWater,
      gasBill: numGas,
      liftBill: numLift,
      garageBill: numGarage,
      isDelete: false,
    };

    try {
      if (isEditing && (editingUtility?._id || editingUtility?.id)) {
        const id = editingUtility._id || editingUtility.id;
        await updateUtility({ id, data: payload }).unwrap();
        toast.success("ইউটিলিটি বিল সফলভাবে আপডেট করা হয়েছে!");
      } else {
        await addUtility(payload).unwrap();
        toast.success("নতুন ইউটিলিটি বিল সফলভাবে তৈরি করা হয়েছে!");
      }
      onClose();
    } catch (err: any) {
      toast.error(err?.data?.message || "ইউটিলিটি সেভ করতে সমস্যা হয়েছে!");
    }
  };

  const isLoading = isAdding || isUpdating;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-6 sm:p-7 space-y-5 border border-gray-100 max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-gray-100 pb-3.5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#054a48] text-white rounded-2xl shadow-xs">
              <Zap size={20} />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-gray-900">
                {isEditing ? "ইউটিলিটি বিল এডিট করুন" : "নতুন ইউটিলিটি বিল যোগ করুন"}
              </h3>
              <p className="text-xs text-gray-500 font-semibold mt-0.5">
                (Electricity, Water, Gas, Lift & Garage Bills)
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

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            {/* Electricity Bill */}
            <div>
              <Label className="font-bold text-gray-700 mb-1.5 flex items-center gap-1.5">
                <Zap size={14} className="text-amber-500" /> বিদ্যুৎ বিল (electricityBill ৳)
              </Label>
              <Input
                type="number"
                min={0}
                placeholder="0"
                value={electricityBill}
                onChange={(e) => setElectricityBill(e.target.value)}
                className="rounded-xl text-sm font-semibold"
              />
            </div>

            {/* Water Bill */}
            <div>
              <Label className="font-bold text-gray-700 mb-1.5 flex items-center gap-1.5">
                <Droplet size={14} className="text-blue-500" /> পানি বিল (waterBill ৳)
              </Label>
              <Input
                type="number"
                min={0}
                placeholder="0"
                value={waterBill}
                onChange={(e) => setWaterBill(e.target.value)}
                className="rounded-xl text-sm font-semibold"
              />
            </div>

            {/* Gas Bill */}
            <div>
              <Label className="font-bold text-gray-700 mb-1.5 flex items-center gap-1.5">
                <Flame size={14} className="text-orange-500" /> গ্যাস বিল (gasBill ৳)
              </Label>
              <Input
                type="number"
                min={0}
                placeholder="0"
                value={gasBill}
                onChange={(e) => setGasBill(e.target.value)}
                className="rounded-xl text-sm font-semibold"
              />
            </div>

            {/* Lift Bill */}
            <div>
              <Label className="font-bold text-gray-700 mb-1.5 flex items-center gap-1.5">
                <ArrowUpCircle size={14} className="text-emerald-600" /> লিফট বিল (liftBill ৳)
              </Label>
              <Input
                type="number"
                min={0}
                placeholder="0"
                value={liftBill}
                onChange={(e) => setLiftBill(e.target.value)}
                className="rounded-xl text-sm font-semibold"
              />
            </div>

            {/* Garage Bill */}
            <div className="sm:col-span-2">
              <Label className="font-bold text-gray-700 mb-1.5 flex items-center gap-1.5">
                <Car size={14} className="text-purple-600" /> গ্যারেজ / পার্কিং বিল (garageBill ৳)
              </Label>
              <Input
                type="number"
                min={0}
                placeholder="0"
                value={garageBill}
                onChange={(e) => setGarageBill(e.target.value)}
                className="rounded-xl text-sm font-semibold"
              />
            </div>
          </div>

          {/* Calculated Total Bill Summary */}
          <div className="p-3.5 bg-emerald-50/70 border border-emerald-200/70 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-2 text-[#054a48] font-bold text-xs">
              <Calculator size={16} />
              <span>সর্বমোট ইউটিলিটি চার্জ (Total Calculation):</span>
            </div>
            <span className="text-base font-extrabold text-[#054a48]">
              ৳ {totalBill.toLocaleString()}
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="text-gray-600 text-xs font-semibold rounded-xl px-4 py-2 cursor-pointer"
            >
              বাতিল (Cancel)
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-[#054a48] hover:bg-[#033433] text-white text-xs font-extrabold px-5 py-2.5 rounded-xl shadow-md cursor-pointer flex items-center gap-1.5"
            >
              {isEditing ? <Save size={15} /> : <Plus size={15} />}
              {isLoading ? "সংরক্ষণ হচ্ছে..." : isEditing ? "আপডেট করুন" : "সংরক্ষণ করুন"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
