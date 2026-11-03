import React, { useState } from "react";
import { X, Save, Receipt } from "lucide-react";
import { Button } from "../../../ui/button";
import { Input } from "../../../ui/input";
import { Label } from "../../../ui/label";
import { toast } from "sonner";
import type { ExpenseRecord } from "../types";
import type { Building } from "../../Building/types";

interface ExpenseFormModalProps {
  buildings: Building[];
  selectedBuildingId: string;
  month: string;
  year: number;
  onClose: () => void;
  onSaveExpense: (expense: ExpenseRecord) => void;
}

export default function ExpenseFormModal({
  buildings,
  selectedBuildingId,
  month,
  year,
  onClose,
  onSaveExpense,
}: ExpenseFormModalProps) {
  const defaultBld = buildings.find((b) => b.id === selectedBuildingId) || buildings[0];

  const [buildingId, setBuildingId] = useState(defaultBld?.id || "");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [receiptNo, setReceiptNo] = useState(`VCH-${Math.floor(1000 + Math.random() * 9000)}`);
  const [vendorName, setVendorName] = useState("");
  const [itemDescription, setItemDescription] = useState("");
  const [quantity, setQuantity] = useState("১ পিস");
  const [unitPrice, setUnitPrice] = useState<number>(0);

  const totalAmount = unitPrice || 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!vendorName.trim()) {
      toast.error("অনুগ্রহ করে দোকানের / প্রতিষ্ঠানের নাম প্রদান করুন!");
      return;
    }

    if (!itemDescription.trim()) {
      toast.error("অনুগ্রহ করে মালামালের বিবরণ প্রদান করুন!");
      return;
    }

    if (totalAmount <= 0) {
      toast.error("অনুগ্রহ করে মোট টাকার পরিমাণ প্রদান করুন!");
      return;
    }

    const currentBld = buildings.find((b) => b.id === buildingId) || defaultBld;

    const newExpense: ExpenseRecord = {
      id: `EXP-${Date.now()}`,
      buildingId: currentBld?.id || "1",
      buildingName: currentBld?.name || "বিল্ডিং",
      date,
      receiptNo,
      vendorName,
      itemDescription,
      quantity,
      unitPrice,
      totalAmount,
      month,
      year,
    };

    onSaveExpense(newExpense);
    toast.success("নতুন খরচের রেকর্ড সফলভাবে যুক্ত করা হয়েছে");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden border border-gray-100 my-6">
        {/* Header */}
        <div className="bg-[#054a48] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Receipt size={20} />
            <h3 className="font-extrabold text-base sm:text-lg">
              নতুন খরচের ভাউচার যুক্ত করুন
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-1.5 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          <div>
            <Label className="text-xs font-bold text-gray-700 mb-1 block">
              ভবন / বিল্ডিং নির্বাচন করুন <span className="text-red-500">*</span>
            </Label>
            <select
              value={buildingId}
              onChange={(e) => setBuildingId(e.target.value)}
              className="w-full h-9 px-3 rounded-xl border border-gray-200 text-xs font-semibold bg-white focus:outline-none"
            >
              {buildings.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name} ({b.code})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs font-bold text-gray-700 mb-1 block">
                তারিখ <span className="text-red-500">*</span>
              </Label>
              <Input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="rounded-xl text-xs"
              />
            </div>
            <div>
              <Label className="text-xs font-bold text-gray-700 mb-1 block">
                রিসিফ্ট / ভাউচার নং
              </Label>
              <Input
                type="text"
                value={receiptNo}
                onChange={(e) => setReceiptNo(e.target.value)}
                placeholder="VCH-1024"
                className="rounded-xl text-xs"
              />
            </div>
          </div>

          <div>
            <Label className="text-xs font-bold text-gray-700 mb-1 block">
              দোকানের / প্রতিষ্ঠানের নাম <span className="text-red-500">*</span>
            </Label>
            <Input
              type="text"
              required
              placeholder="যেমন: মেসার্স রফিক হার্ডওয়্যার & ইলেকট্রিক"
              value={vendorName}
              onChange={(e) => setVendorName(e.target.value)}
              className="rounded-xl text-xs"
            />
          </div>

          <div>
            <Label className="text-xs font-bold text-gray-700 mb-1 block">
              মালামালের বিবরণ <span className="text-red-500">*</span>
            </Label>
            <Input
              type="text"
              required
              placeholder="যেমন: ১০ ওয়াট এলইডি লাইট, পিভিসি পাইপ, সুইচ বোর্ড"
              value={itemDescription}
              onChange={(e) => setItemDescription(e.target.value)}
              className="rounded-xl text-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs font-bold text-gray-700 mb-1 block">
                পরিমাণ
              </Label>
              <Input
                type="text"
                placeholder="যেমন: ১০ পিস / ১ জেন"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="rounded-xl text-xs"
              />
            </div>
            <div>
              <Label className="text-xs font-bold text-gray-700 mb-1 block">
                মোট খরচ (৳) <span className="text-red-500">*</span>
              </Label>
              <Input
                type="number"
                required
                min={1}
                placeholder="2500"
                value={unitPrice || ""}
                onChange={(e) => setUnitPrice(Number(e.target.value))}
                className="rounded-xl text-xs font-bold text-red-700"
              />
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="rounded-xl text-xs"
            >
              বাতিল
            </Button>
            <Button
              type="submit"
              className="bg-[#054a48] hover:bg-[#085f5c] text-white font-bold text-xs rounded-xl px-5 flex items-center gap-1.5 cursor-pointer"
            >
              <Save size={15} /> সংরক্ষণ করুন
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
