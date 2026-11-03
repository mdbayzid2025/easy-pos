import {
  Calendar,
  DollarSign,
  FileText,
  Image as ImageIcon,
  Tag,
  Trash2,
  Upload,
  X,
  Loader2,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { type Expense, type ExpenseCategory } from "../../../types/expense";
import { Button } from "../../ui/button";
import { useUploadSingleImageMutation } from "../../../redux/features/user/userApi";
import { imageUrl } from "../../../redux/base/baseAPI";

interface ExpenseFormModalProps {
  editingExpense: Expense | null;
  categories: ExpenseCategory[];
  onClose: () => void;
  onSaveExpense: (expenseData: Partial<Expense>) => void;
  onOpenCategoryModal?: () => void;
}

export default function ExpenseFormModal({
  editingExpense,
  categories,
  onClose,
  onSaveExpense,
}: ExpenseFormModalProps) {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>(
    editingExpense?.category?._id || categories[0]?._id || "",
  );
  const [type, setType] = useState<string>(
    editingExpense?.type || "OfficeCost",
  );
  const [dateString, setDateString] = useState<string>(
    editingExpense?.dateString || new Date().toISOString().split("T")[0],
  );
  const [amount, setAmount] = useState<string>(
    editingExpense ? String(editingExpense.amount) : "",
  );
  const [description, setDescription] = useState<string>(
    editingExpense?.description || "",
  );
  const [images, setImages] = useState<string[]>(editingExpense?.images || []);

  useEffect(() => {
    if (editingExpense) {
      setSelectedCategoryId(editingExpense.category?._id || "");
      setType(editingExpense.type || "OfficeCost");
      setDateString(
        editingExpense.dateString || new Date().toISOString().split("T")[0],
      );
      setAmount(String(editingExpense.amount));
      setDescription(editingExpense.description || "");
      setImages(editingExpense.images || []);
    }
  }, [editingExpense]);

  const [uploadSingleImage] = useUploadSingleImageMutation();
  const [isUploading, setIsUploading] = useState(false);

  // Handle multiple file upload input
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const fileList = Array.from(files);
    setIsUploading(true);

    try {
      const uploadPromises = fileList.map(async (file) => {
        const res = await uploadSingleImage(file).unwrap();
        return res?.url || res?.path || res?.filename;
      });

      const uploadedUrls = await Promise.all(uploadPromises);
      const validUrls = uploadedUrls.filter((url): url is string => Boolean(url));

      setImages((prev) => [...prev, ...validUrls]);
      toast.success(`${validUrls.length} টি ছবি আপলোড করা হয়েছে`);
    } catch (err: any) {
      toast.error(err?.data?.message || err?.message || "ছবি আপলোড সমস্যা হয়েছে");
      console.error(err);
    } finally {
      setIsUploading(false);
      e.target.value = "";
    }
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  // Sample quick image helper
  const handleAddSampleImage = () => {
    const samples = [
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=500&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1508873696983-2df515122519?w=500&auto=format&fit=crop&q=60",
    ];
    const randomSample = samples[Math.floor(Math.random() * samples.length)];
    setImages((prev) => [...prev, randomSample]);
    toast.success("স্যাম্পল ভাউচার ছবি যুক্ত করা হয়েছে");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const categoryObj = categories.find((c) => c._id === selectedCategoryId);
    if (!categoryObj) {
      toast.error("অনুগ্রহ করে খরচের ক্যাটাগরি নির্বাচন করুন");
      return;
    }

    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      toast.error("সঠিক খরচের পরিমাণ লিখুন");
      return;
    }

    const dateObj = new Date(dateString);
    const month = dateObj.getMonth() + 1;
    const year = dateObj.getFullYear();

    const payload: Partial<Expense> = {
      category: {
        _id: categoryObj._id,
        name: categoryObj.name,
      },
      type,
      dateString,
      month,
      year,
      amount: Number(amount),
      description: description.trim(),
      images,
    };

    onSaveExpense(payload);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in duration-200 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <DollarSign size={20} className="text-[#054a48]" />
            <span>
              {editingExpense ? "খরচের তথ্য সংশোধন" : "নতুন খরচ এন্ট্রি"}
            </span>
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-700"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Category & Date & Type in grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Expense Category */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-gray-700 flex items-center gap-1.5">
                  <Tag size={14} className="text-[#054a48]" />
                  <span>ক্যাটাগরি (Category)</span>{" "}
                  <span className="text-rose-500">*</span>
                </label>
              </div>
              <select
                value={selectedCategoryId}
                onChange={(e) => setSelectedCategoryId(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#054a48] focus:outline-hidden"
              >
                <option value="" disabled>
                  -- ক্যাটাগরি বেছে নিন --
                </option>
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Expense Type */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1 flex items-center gap-1.5">
                <Tag size={14} className="text-[#054a48]" />
                <span>খরচের টাইপ (Cost Type)</span>{" "}
                <span className="text-rose-500">*</span>
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#054a48] focus:outline-hidden font-medium"
              >
                <option value="OfficeCost">Cost From Office (OfficeCost)</option>
                <option value="OwnerCost">Cost From Owner (OwnerCost)</option>
              </select>
            </div>

            {/* DateString */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-gray-700 mb-1 flex items-center gap-1.5">
                <Calendar size={14} className="text-[#054a48]" />
                <span>তারিখ (dateString)</span>{" "}
                <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                required
                value={dateString}
                onChange={(e) => setDateString(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#054a48] focus:outline-hidden"
              />
            </div>
          </div>

          {/* Amount */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1 flex items-center gap-1.5">
              <DollarSign size={14} className="text-[#054a48]" />
              <span>টাকার পরিমাণ (Amount in ৳)</span>{" "}
              <span className="text-rose-500">*</span>
            </label>
            <input
              type="number"
              required
              min={1}
              placeholder="যেমন: ২৫০০"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#054a48] focus:outline-hidden font-semibold"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1 flex items-center gap-1.5">
              <FileText size={14} className="text-[#054a48]" />
              <span>খরচের বিস্তারিত বিবরণ (Description)</span>{" "}
              <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={3}
              required
              placeholder="যেমন: ১০ ওয়াট এলইডি লাইট, পিভিসি পাইপ, সুইচ বোর্ড কেনা হয়েছে..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#054a48] focus:outline-hidden"
            />
          </div>

          {/* Multiple Image Input & File Upload Section */}
          <div className="space-y-3 pt-2 border-t border-gray-100">
            <label className="block text-xs font-semibold text-gray-700 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <ImageIcon size={14} className="text-[#054a48]" />
                <span>ভাউচার / রসিদের ছবি (images: [string])</span>
              </span>
              <button
                type="button"
                onClick={handleAddSampleImage}
                className="text-[11px] text-emerald-600 hover:underline font-normal"
              >
                + স্যাম্পল ছবি যোগ করুন
              </button>
            </label>

            {/* Multiple File Upload Field */}
            <div className="relative border-2 border-dashed border-gray-300 hover:border-[#054a48] rounded-xl p-3.5 bg-gray-50/50 text-center transition-colors">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileSelect}
                disabled={isUploading}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
              />
              <div className="flex flex-col items-center justify-center gap-1 pointer-events-none">
                {isUploading ? (
                  <>
                    <Loader2 size={24} className="animate-spin text-[#054a48]" />
                    <p className="text-xs font-semibold text-gray-700">
                      ছবি সার্ভারে আপলোড হচ্ছে...
                    </p>
                  </>
                ) : (
                  <>
                    <Upload size={22} className="text-[#054a48]" />
                    <p className="text-xs font-semibold text-gray-700">
                      ছবি নির্বাচন করুন (একাধিক ফাইল সিলেক্ট করতে পারবেন)
                    </p>
                    <p className="text-[11px] text-gray-400">
                      ডিভাইস থেকে ফাইল নির্বাচন করতে এখানে ক্লিক করুন
                    </p>
                  </>
                )}
              </div>
            </div>

            {/* Image Previews */}
            {images.length > 0 && (
              <div className="grid grid-cols-4 gap-2 pt-2">
                {images.map((imgUrl, idx) => {
                  const src =
                    imgUrl.startsWith("http") || imgUrl.startsWith("data:")
                      ? imgUrl
                      : imageUrl + imgUrl;
                  return (
                    <div
                      key={idx}
                      className="relative group rounded-lg overflow-hidden border border-gray-200 aspect-square shadow-2xs"
                    >
                      <img
                        src={src}
                        alt={`Voucher ${idx}`}
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(idx)}
                        className="absolute top-1 right-1 p-1 bg-rose-600 text-white rounded-full opacity-90 hover:opacity-100 transition-opacity"
                        title="ছবি সরিয়ে ফেলুন"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="px-4 py-2 text-xs border-gray-300 text-gray-700"
            >
              বাতিল
            </Button>
            <Button
              type="submit"
              className="px-5 py-2 text-xs bg-[#054a48] hover:bg-[#043a38] text-white font-medium"
            >
              {editingExpense ? "আপডেট করুন" : "সংরক্ষণ করুন"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
