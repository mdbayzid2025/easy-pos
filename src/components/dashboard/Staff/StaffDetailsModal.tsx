import {
  Calendar,
  CheckCircle2,
  Download,
  Edit,
  FileText,
  User,
  X
} from "lucide-react";
import { Button } from "../../ui/button";
import type { StaffMember } from "./types";
import { downloadPdfDocument } from "../../../utils/downloadPdf";

interface StaffDetailsModalProps {
  staff: StaffMember;
  onClose: () => void;
  onEdit: (staff: StaffMember) => void;
}

export default function StaffDetailsModal({
  staff,
  onClose,
  onEdit,
}: StaffDetailsModalProps) {
  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl overflow-hidden max-w-xl w-full shadow-2xl animate-in fade-in zoom-in duration-200">
        {/* Modal Header */}
        <div className="bg-[#054a48] text-white p-4 px-6 flex items-center justify-between border-b border-emerald-800">
          <span className="text-sm font-bold">
            স্টাফ দেখুন (Staff Details)
          </span>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-emerald-200 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Profile Header Box */}
        <div className="bg-[#054a48] text-white p-6 text-center relative">
          <img
            src={
              staff.photoUrl ||
              staff.avatar ||
              `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde`
            }
            alt={staff.name}
            className="w-24 h-24 rounded-full mx-auto border-4 border-white shadow-md bg-white object-cover"
          />

          <div className="mt-3 flex items-center justify-center gap-2">
            <span
              className={`px-3 py-0.5 rounded-full text-xs font-bold ${
                staff.status === "সক্রিয়"
                  ? "bg-emerald-500 text-white"
                  : "bg-rose-500 text-white"
              }`}
            >
              {staff.status}
            </span>
            <span className="text-xs bg-white/20 px-2.5 py-0.5 rounded-full font-mono font-bold">
              #{staff.staffId}
            </span>
          </div>

          <h2 className="text-2xl font-bold mt-2">{staff.name}</h2>
          <p className="text-xs text-emerald-100 mt-0.5 font-medium">
            {staff.role} · {staff.mobile}
          </p>
        </div>

        {/* Info Grid Cards */}
        <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto bg-slate-50/50">
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="bg-white p-3 rounded-xl border border-slate-200/70 shadow-2xs flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
                <Calendar size={16} />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-semibold uppercase">
                  যোগদানের তারিখ (Join Date)
                </p>
                <p className="font-bold text-slate-900 mt-0.5">
                  {staff.joiningDate}
                </p>
              </div>
            </div>

            <div className="bg-white p-3 rounded-xl border border-slate-200/70 shadow-2xs flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
                <Calendar size={16} />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-semibold uppercase">
                  জন্ম তারিখ (DOB)
                </p>
                <p className="font-bold text-slate-900 mt-0.5">
                  {staff.dob || "2025-02-16"}
                </p>
              </div>
            </div>

            <div className="bg-white p-3 rounded-xl border border-slate-200/70 shadow-2xs flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
                <CheckCircle2 size={16} />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-semibold uppercase">
                  মূল বেতন (Salary)
                </p>
                <p className="font-bold text-emerald-700 mt-0.5">
                  ৳ {Number(staff.basicSalary || 0).toLocaleString()}
                </p>
              </div>
            </div>

            <div className="bg-white p-3 rounded-xl border border-slate-200/70 shadow-2xs flex items-center justify-between gap-2">
              <div className="flex items-center gap-3 min-w-0">
                <div className="p-2 rounded-lg bg-rose-50 text-rose-600 shrink-0">
                  <FileText size={16} />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] text-slate-400 font-semibold uppercase">
                    ডকুমেন্ট (PDF)
                  </p>
                  <p className="font-bold text-slate-900 mt-0.5 truncate text-[11px]" title={staff.pdfDocumentName}>
                    {staff.pdfDocumentName || "Staff_Document.pdf"}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() =>
                  downloadPdfDocument(
                    staff.pdfDocumentName,
                    staff.pdfDocumentUrl,
                    staff.name
                  )
                }
                className="shrink-0 p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer border border-rose-200"
                title="ডাউনলোড করুন"
              >
                <Download size={13} />
                <span className="hidden sm:inline">ডাউনলোড</span>
              </button>
            </div>

            <div className="bg-white p-3 rounded-xl border border-slate-200/70 shadow-2xs flex items-center gap-3 col-span-2 sm:col-span-1">
              <div className="p-2 rounded-lg bg-purple-50 text-purple-600">
                <User size={16} />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] text-slate-400 font-semibold uppercase">
                  ইমেইল
                </p>
                <p className="font-bold text-slate-900 mt-0.5 truncate">
                  {staff.email || "N/A"}
                </p>
              </div>
            </div>

            <div className="bg-white p-3 rounded-xl border border-slate-200/70 shadow-2xs flex items-center gap-3 col-span-2 sm:col-span-1">
              <div className="p-2 rounded-lg bg-amber-50 text-amber-600">
                <User size={16} />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] text-slate-400 font-semibold uppercase">
                  ঠিকানা
                </p>
                <p className="font-bold text-slate-900 mt-0.5 truncate">
                  {staff.address || "N/A"}
                </p>
              </div>
            </div>
          </div>

          {/* Family info */}
          <div className="bg-white p-4 rounded-xl border border-slate-200/70 shadow-2xs text-xs space-y-1">
            <p className="text-slate-700">
              <span className="font-bold text-slate-900">পিতা:</span>{" "}
              {staff.fatherName || "N/A"}
            </p>
            <p className="text-slate-700">
              <span className="font-bold text-slate-900">মাতা:</span>{" "}
              {staff.motherName || "N/A"}
            </p>
            <p className="text-slate-700">
              <span className="font-bold text-slate-900">
                জাতীয় পরিচয়পত্র:
              </span>{" "}
              {staff.nid || "N/A"}
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 px-6 border-t border-slate-100 bg-white flex items-center justify-end">
          <Button
            onClick={() => onEdit(staff)}
            className="bg-[#054a48] hover:bg-[#033634] text-white font-bold px-6 py-2 rounded-xl flex items-center gap-2 cursor-pointer text-xs"
          >
            <Edit size={16} /> Edit Staff Profile
          </Button>
        </div>
      </div>
    </div>
  );
}
