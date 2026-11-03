import React, { useState } from "react";
import { X, Tag, PlusCircle } from "lucide-react";
import { Button } from "../../ui/button";
import { toast } from "sonner";
import { useAddExpenseCategoryMutation } from "../../../redux/features/expense/expenseApi";

interface ExpenseCategoryFormModalProps {
  onClose: () => void;
  onCategoryAdded?: (newCategoryName: string) => void;
}

export default function ExpenseCategoryFormModal({
  onClose,
  onCategoryAdded,
}: ExpenseCategoryFormModalProps) {
  const [name, setName] = useState("");
  const [addExpenseCategory, { isLoading }] = useAddExpenseCategoryMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("অনুগ্রহ করে ক্যাটাগরির নাম লিখুন");
      return;
    }

    try {
      const res = await addExpenseCategory({ name: name.trim() }).unwrap();
      toast.success(res?.message || "ক্যাটাগরি সফলভাবে যোগ করা হয়েছে");
      if (onCategoryAdded) {
        onCategoryAdded(name.trim());
      }
      onClose();
    } catch (err: any) {
      toast.error(err?.data?.message || "ক্যাটাগরি যোগ করতে ব্যর্থ হয়েছে");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Tag size={20} className="text-[#054a48]" />
            <span>নতুন খরচের ক্যাটাগরি যোগ করুন</span>
          </h3>
          <button
            onClick={onClose}
            type="button"
            className="p-1 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-700"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1 flex items-center gap-1.5">
              <Tag size={14} className="text-[#054a48]" />
              <span>ক্যাটাগরির নাম (Category Name)</span> <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="যেমন: ইলেকট্রিক বিল, মেরামত ইত্যাদি"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#054a48] focus:outline-hidden font-medium"
            />
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="px-4 py-2 text-xs border-gray-300 text-gray-700"
              disabled={isLoading}
            >
              বাতিল
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="px-5 py-2 text-xs bg-[#054a48] hover:bg-[#043a38] text-white font-medium inline-flex items-center gap-1.5"
            >
              <PlusCircle size={15} />
              <span>{isLoading ? "সংরক্ষণ হচ্ছে..." : "সংরক্ষণ করুন"}</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
