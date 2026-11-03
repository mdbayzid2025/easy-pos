import {
  Download,
  FileCheck,
  FileText,
  IdCard,
  Image as ImageIcon,
  RotateCcw,
  Upload,
  User,
  X
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "../../ui/button";
import { Card, CardContent } from "../../ui/card";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import type { StaffMember } from "./types";
import { downloadPdfDocument } from "../../../utils/downloadPdf";

interface StaffFormProps {
  editingStaff: StaffMember | null;
  onSaveStaff: (formData: Partial<StaffMember>) => void;
  onCancel: () => void;
  onReset: () => void;
}

export default function StaffForm({
  editingStaff,
  onSaveStaff,
  onCancel,
  onReset,
}: StaffFormProps) {
  const [formData, setFormData] = useState<Partial<StaffMember>>(
    editingStaff || {
      name: "",
      mobile: "",
      email: "",
      address: "",
      nid: "",
      fatherName: "",
      motherName: "",
      gender: "পুরুষ",
      dob: new Date().toISOString().split("T")[0],
      joiningDate: new Date().toISOString().split("T")[0],
      role: "Helper and Trainee",
      status: "সক্রিয়",
      deletePermission: "না",
      basicSalary: "12000.00",
      organization: "Ainal Properties",
      staffId: "",
      photoUrl: "",
      pdfDocumentName: "",
    }
  );

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const photoPreview = URL.createObjectURL(file);
      setFormData((prev) => ({
        ...prev,
        photoUrl: photoPreview,
        avatar: photoPreview,
      }));
      toast.success(`ছবি আপলোড করা হয়েছে: ${file.name}`);
    }
  };

  const handlePdfUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== "application/pdf" && !file.name.endsWith(".pdf")) {
        toast.error("শুধুমাত্র PDF ফাইল আপলোড করা যাবে");
        return;
      }
      setFormData((prev) => ({
        ...prev,
        pdfDocumentName: file.name,
        pdfDocumentUrl: URL.createObjectURL(file),
      }));
      toast.success(`PDF ডকুমেন্ট সফলভাবে আপলোড করা হয়েছে: ${file.name}`);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.mobile) {
      toast.error("অনুগ্রহ করে স্টাফের নাম এবং মোবাইল নম্বর প্রদান করুন");
      return;
    }
    onSaveStaff(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* 1. Personal Information */}
      <Card className="bg-white rounded-2xl border border-slate-200/70 shadow-xs">
        <div className="p-5 border-b border-slate-100 flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-emerald-50 text-[#054a48] flex items-center justify-center font-bold">
            <User size={20} />
          </div>
          <div>
            <h3 className="text-lg font-extrabold text-slate-900">
              Personal Information (ব্যক্তিগত তথ্য)
            </h3>
            <p className="text-xs text-slate-500">
              Basic identity and family details.
            </p>
          </div>
        </div>

        <CardContent className="p-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          <div>
            <Label className="text-xs font-bold text-slate-800">
              অর্গানাইজেশন
            </Label>
            <Input
              type="text"
              value={formData.organization || "Ainal Properties"}
              onChange={(e) =>
                setFormData({ ...formData, organization: e.target.value })
              }
              className="mt-1.5 text-xs h-10 font-semibold"
            />
          </div>

          <div>
            <Label className="text-xs font-bold text-slate-800">
              স্টাফের নাম <span className="text-rose-600">*</span>
            </Label>
            <Input
              type="text"
              required
              placeholder="Full legal name"
              value={formData.name || ""}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="mt-1.5 text-xs h-10 font-semibold"
            />
          </div>

          <div>
            <Label className="text-xs font-bold text-slate-800">
              যোগদানের তারিখ (Joining Date) <span className="text-rose-600">*</span>
            </Label>
            <Input
              type="date"
              required
              value={formData.joiningDate || ""}
              onChange={(e) =>
                setFormData({ ...formData, joiningDate: e.target.value })
              }
              className="mt-1.5 text-xs h-10 font-semibold"
            />
          </div>

          <div>
            <Label className="text-xs font-bold text-slate-800">
              জন্ম তারিখ (DOB) <span className="text-rose-600">*</span>
            </Label>
            <Input
              type="date"
              required
              value={formData.dob || ""}
              onChange={(e) =>
                setFormData({ ...formData, dob: e.target.value })
              }
              className="mt-1.5 text-xs h-10 font-semibold"
            />
          </div>

          <div>
            <Label className="text-xs font-bold text-slate-800">
              পিতার নাম
            </Label>
            <Input
              type="text"
              placeholder="Father's name"
              value={formData.fatherName || ""}
              onChange={(e) =>
                setFormData({ ...formData, fatherName: e.target.value })
              }
              className="mt-1.5 text-xs h-10 font-semibold"
            />
          </div>

          <div>
            <Label className="text-xs font-bold text-slate-800">
              মাতার নাম
            </Label>
            <Input
              type="text"
              placeholder="Mother's name"
              value={formData.motherName || ""}
              onChange={(e) =>
                setFormData({ ...formData, motherName: e.target.value })
              }
              className="mt-1.5 text-xs h-10 font-semibold"
            />
          </div>

          <div>
            <Label className="text-xs font-bold text-slate-800">
              জাতীয় পরিচয়পত্র (NID) <span className="text-rose-600">*</span>
            </Label>
            <Input
              type="text"
              required
              placeholder="NID Number (10/13/17 digits)"
              value={formData.nid || ""}
              onChange={(e) =>
                setFormData({ ...formData, nid: e.target.value })
              }
              className="mt-1.5 text-xs h-10 font-semibold"
            />
          </div>

          <div>
            <Label className="text-xs font-bold text-slate-800">
              লিঙ্গ
            </Label>
            <select
              value={formData.gender || "পুরুষ"}
              onChange={(e) =>
                setFormData({ ...formData, gender: e.target.value })
              }
              className="mt-1.5 w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-emerald-600 h-10 font-bold text-slate-800"
            >
              <option value="পুরুষ">পুরুষ</option>
              <option value="মহিলা">মহিলা</option>
              <option value="অন্যান্য">অন্যান্য</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* 2. Contact & Address */}
      <Card className="bg-white rounded-2xl border border-slate-200/70 shadow-xs">
        <div className="p-5 border-b border-slate-100 flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <IdCard size={20} />
          </div>
          <div>
            <h3 className="text-lg font-extrabold text-slate-900">
              Contact & Address (যোগাযোগ ও ঠিকানা)
            </h3>
            <p className="text-xs text-slate-500">
              Phone number and address information.
            </p>
          </div>
        </div>

        <CardContent className="p-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          <div>
            <Label className="text-xs font-bold text-slate-800">
              মোবাইল নম্বর <span className="text-rose-600">*</span>
            </Label>
            <Input
              type="text"
              required
              placeholder="01XXXXXXXXX"
              value={formData.mobile || ""}
              onChange={(e) =>
                setFormData({ ...formData, mobile: e.target.value })
              }
              className="mt-1.5 text-xs h-10 font-semibold"
            />
          </div>

          <div>
            <Label className="text-xs font-bold text-slate-800">
              ঠিকানা <span className="text-rose-600">*</span>
            </Label>
            <Input
              type="text"
              required
              placeholder="Current full address"
              value={formData.address || ""}
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
              className="mt-1.5 text-xs h-10 font-semibold"
            />
          </div>

          <div>
            <Label className="text-xs font-bold text-slate-800">
              ইমেইল এড্রেস
            </Label>
            <Input
              type="email"
              placeholder="staff@example.com"
              value={formData.email || ""}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="mt-1.5 text-xs h-10 font-semibold"
            />
          </div>
        </CardContent>
      </Card>

      {/* 3. Employment & Salary Details */}
      <Card className="bg-white rounded-2xl border border-slate-200/70 shadow-xs">
        <div className="p-5 border-b border-slate-100 flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
            <FileText size={20} />
          </div>
          <div>
            <h3 className="text-lg font-extrabold text-slate-900">
              Employment & Salary (পদবী ও বেতন সংক্রান্ত তথ্য)
            </h3>
            <p className="text-xs text-slate-500">
              Role, Staff ID, status, and basic salary amount.
            </p>
          </div>
        </div>

        <CardContent className="p-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
          <div>
            <Label className="text-xs font-bold text-slate-800">
              স্টাফ আইডি (Staff ID)
            </Label>
            <Input
              type="text"
              placeholder="10026"
              value={formData.staffId || ""}
              onChange={(e) =>
                setFormData({ ...formData, staffId: e.target.value })
              }
              className="mt-1.5 text-xs h-10 font-bold"
            />
          </div>

          <div>
            <Label className="text-xs font-bold text-slate-800">
              মূল বেতন (Basic Salary) <span className="text-rose-600">*</span>
            </Label>
            <Input
              type="text"
              required
              placeholder="e.g. 18000.00"
              value={formData.basicSalary || ""}
              onChange={(e) =>
                setFormData({ ...formData, basicSalary: e.target.value })
              }
              className="mt-1.5 text-xs h-10 font-extrabold text-emerald-700"
            />
          </div>

          <div>
            <Label className="text-xs font-bold text-slate-800">
              রোল (Role) <span className="text-rose-600">*</span>
            </Label>
            <select
              value={formData.role || "Helper and Trainee"}
              onChange={(e) =>
                setFormData({ ...formData, role: e.target.value })
              }
              className="mt-1.5 w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-emerald-600 h-10 font-bold text-slate-800"
            >
              <option value="Property Manager">Property Manager</option>
              <option value="Gatekeeper">Gatekeeper</option>
              <option value="Cleaner / Helper">Cleaner / Helper</option>
              <option value="Maintenance Staff / Technician">
                Maintenance Staff / Technician
              </option>
              <option value="Helper and Trainee">Helper and Trainee</option>
            </select>
          </div>

          <div>
            <Label className="text-xs font-bold text-slate-800">
              স্থিতি (Status) <span className="text-rose-600">*</span>
            </Label>
            <select
              value={formData.status || "সক্রিয়"}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  status: e.target.value as "সক্রিয়" | "নিষ্ক্রিয়",
                })
              }
              className="mt-1.5 w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-emerald-600 h-10 font-bold text-slate-800"
            >
              <option value="সক্রিয়">সক্রিয়</option>
              <option value="নিষ্ক্রিয়">নিষ্ক্রিয়</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* 4. Photo & PDF Document Upload Options */}
      <Card className="bg-white rounded-2xl border border-slate-200/70 shadow-xs">
        <div className="p-5 border-b border-slate-100 flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <Upload size={20} />
          </div>
          <div>
            <h3 className="text-lg font-extrabold text-slate-900">
              Photo & PDF Documents Upload (ছবি ও ডকুমেন্ট আপলোড)
            </h3>
            <p className="text-xs text-slate-500">
              Upload staff profile photo and NID/Agreement PDF documents.
            </p>
          </div>
        </div>

        <CardContent className="p-5 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Photo Upload */}
          <div className="border border-dashed border-slate-300 rounded-2xl p-5 bg-slate-50/50 flex flex-col items-center justify-center text-center">
            {formData.photoUrl || formData.avatar ? (
              <div className="relative mb-3">
                <img
                  src={formData.photoUrl || formData.avatar}
                  alt="Preview"
                  className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md mx-auto"
                />
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      photoUrl: "",
                      avatar: "",
                    }))
                  }
                  className="absolute -top-1 -right-4 shadow w-10! text-white rounded-full hover:bg-rose-700"
                >
                  <X size={14} color="red" />
                </Button>
              </div>
            ) : (
              <div className="h-14 w-14 rounded-2xl bg-emerald-100/70 text-[#054a48] flex items-center justify-center mb-3">
                <ImageIcon size={28} />
              </div>
            )}

            <h4 className="text-xs font-bold text-slate-800">
              প্রোফাইল ছবি (Photo Upload)
            </h4>
            <p className="text-[11px] text-slate-400 mt-0.5 mb-3">
              PNG, JPG or WEBP (Max 5MB)
            </p>
            <label className="bg-[#054a48] hover:bg-[#033634] text-white text-xs font-bold px-4 py-2 rounded-xl cursor-pointer shadow-xs transition-colors flex items-center gap-2">
              <Upload size={14} /> Choose Photo File
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
              />
            </label>
          </div>

          {/* PDF Documents Upload */}
          <div className="border border-dashed border-slate-300 rounded-2xl p-5 bg-slate-50/50 flex flex-col items-center justify-center text-center">
            {formData.pdfDocumentName ? (
              <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-rose-700 font-bold text-xs">
                <FileCheck size={18} className="text-rose-600 shrink-0" />
                <span className="truncate max-w-[180px]">
                  {formData.pdfDocumentName}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    downloadPdfDocument(
                      formData.pdfDocumentName,
                      formData.pdfDocumentUrl,
                      formData.name
                    )
                  }
                  className="text-rose-600 hover:text-rose-800 p-1 hover:bg-rose-100 rounded transition-colors ml-1 cursor-pointer"
                  title="ডাউনলোড করুন"
                >
                  <Download size={14} />
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      pdfDocumentName: "",
                      pdfDocumentUrl: "",
                    }))
                  }
                  className="text-slate-400 hover:text-rose-600 p-1 hover:bg-rose-100 rounded transition-colors cursor-pointer"
                  title="ডকুমেন্ট মুছে ফেলুন"
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              <div className="h-14 w-14 rounded-2xl bg-rose-100/70 text-rose-600 flex items-center justify-center mb-3">
                <FileText size={28} />
              </div>
            )}

            <h4 className="text-xs font-bold text-slate-800">
              ডকুমেন্টস আপলোড (PDF Upload)
            </h4>
            <p className="text-[11px] text-slate-400 mt-0.5 mb-3">
              Only PDF files (NID, Contract, Certificate)
            </p>
            <label className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold px-4 py-2 rounded-xl cursor-pointer shadow-xs transition-colors flex items-center gap-2">
              <Upload size={14} /> Choose PDF File
              <input
                type="file"
                accept="application/pdf"
                onChange={handlePdfUpload}
                className="hidden"
              />
            </label>
          </div>
        </CardContent>
      </Card>

      {/* Form Action Buttons */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="px-6 py-2.5 rounded-xl border-slate-300 text-slate-700 font-bold text-xs cursor-pointer"
        >
          বাতিল (Cancel)
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onReset}
          className="px-6 py-2.5 rounded-xl border-slate-300 text-slate-700 font-bold text-xs flex items-center gap-2 cursor-pointer"
        >
          <RotateCcw size={16} /> রিসেট
        </Button>
        <Button
          type="submit"
          className="bg-[#054a48] hover:bg-[#033634] text-white font-bold px-8 py-2.5 rounded-xl shadow-md text-xs cursor-pointer"
        >
          {editingStaff ? "Save Staff Changes" : "Save Staff"}
        </Button>
      </div>
    </form>
  );
}
