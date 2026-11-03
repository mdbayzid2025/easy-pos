import { useState } from "react";
import { X, Calendar, Tag, DollarSign, FileText, Image as ImageIcon, CheckCircle } from "lucide-react";
import { type Expense } from "../../../types/expense";
import { Button } from "../../ui/button";

interface ExpenseDetailsModalProps {
  expense: Expense;
  onClose: () => void;
}

export default function ExpenseDetailsModal({ expense, onClose }: ExpenseDetailsModalProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(
    expense.images && expense.images.length > 0 ? expense.images[0] : null
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-6 animate-in fade-in zoom-in duration-200 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
              <DollarSign size={20} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">খরচের বিবরণী</h3>
              <p className="text-xs text-gray-500">আইডি: {expense._id}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Expense Category & Date */}
          <div className="bg-gray-50/80 p-4 rounded-xl border border-gray-200 space-y-2">
            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
              <Tag size={14} className="text-[#054a48]" />
              <span>ক্যাটাগরি & তারিখ</span>
            </h4>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold">
                  {expense.category?.name || "সাধারণ খরচ"}
                </span>
                {expense.type === "OwnerCost" ? (
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-semibold border border-amber-200">
                    Cost From Owner
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-blue-100 text-blue-900 text-xs font-semibold border border-blue-200">
                    Cost From Office
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-600 flex items-center gap-1.5 pt-2">
                <Calendar size={14} className="text-gray-400" />
                <span>তারিখ: {expense.dateString || "N/A"}</span>
              </p>
            </div>
          </div>

          {/* Amount Info */}
          <div className="bg-emerald-50/40 p-4 rounded-xl border border-emerald-200/60 space-y-2">
            <h4 className="text-xs font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1.5">
              <DollarSign size={14} className="text-emerald-700" />
              <span>টাকার পরিমাণ (Amount in ৳)</span>
            </h4>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-extrabold text-emerald-700">
                ৳ {expense.amount?.toLocaleString()}
              </span>
              {expense.receiptNo && (
                <span className="text-xs text-gray-500 font-mono bg-white px-2 py-1 rounded border border-gray-200">
                  {expense.receiptNo}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Description Section */}
        <div className="space-y-1.5 bg-white p-4 rounded-xl border border-gray-200 shadow-2xs">
          <h4 className="text-xs font-bold text-gray-600 uppercase tracking-wider flex items-center gap-1.5">
            <FileText size={14} className="text-[#054a48]" />
            <span>খরচের বিস্তারিত বিবরণ (Description)</span>
          </h4>
          <p className="text-sm text-gray-800 leading-relaxed font-normal">
            {expense.description}
          </p>
        </div>

        {/* Image Gallery & Lightbox Preview */}
        {expense.images && expense.images.length > 0 && (
          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-bold text-gray-600 uppercase tracking-wider flex items-center gap-1.5">
              <ImageIcon size={14} className="text-[#054a48]" />
              <span>সংযুক্ত ভাউচার / রসিদের ছবি ({expense.images.length} টি)</span>
            </h4>

            {/* Main Lightbox View */}
            {selectedImage && (
              <div className="rounded-xl overflow-hidden border border-gray-200 bg-black/5 max-h-72 flex items-center justify-center p-2">
                <img
                  src={selectedImage}
                  alt="Voucher detail"
                  className="max-h-64 object-contain rounded-lg shadow-sm"
                />
              </div>
            )}

            {/* Thumbnail Selectors */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {expense.images.map((imgUrl, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(imgUrl)}
                  className={`w-14 h-14 rounded-lg overflow-hidden border-2 shrink-0 transition-all ${
                    selectedImage === imgUrl ? "border-[#054a48] scale-105 shadow-md" : "border-gray-200 opacity-70 hover:opacity-100"
                  }`}
                >
                  <img src={imgUrl} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-gray-100 pt-4">
          <div className="flex items-center gap-1 text-xs text-emerald-600 font-medium">
            <CheckCircle size={14} />
            <span>সক্রিয় খরচের রেকর্ড</span>
          </div>
          <Button
            onClick={onClose}
            className="bg-[#054a48] hover:bg-[#043a38] text-white px-5 py-2 text-xs"
          >
            বন্ধ করুন
          </Button>
        </div>
      </div>
    </div>
  );
}
