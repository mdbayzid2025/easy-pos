import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Download,
  Edit,
  Eye,
  FileText,
  Search,
  Trash2
} from "lucide-react";
import { useState } from "react";
import { Button } from "../../ui/button";
import { Card } from "../../ui/card";
import { Input } from "../../ui/input";
import type { StaffMember } from "./types";
import { downloadPdfDocument } from "../../../utils/downloadPdf";

interface StaffTableProps {
  staffList: StaffMember[];
  onOpenEditForm: (staff: StaffMember) => void;
  onSelectStaff: (staff: StaffMember) => void;
  onDeleteStaff: (staff: StaffMember) => void;
}

export default function StaffTable({
  staffList,
  onOpenEditForm,
  onSelectStaff,
  onDeleteStaff,
}: StaffTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Filter staff by search keyword
  const filteredStaff = staffList.filter(
    (staff) =>
      staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staff.mobile.includes(searchTerm) ||
      staff.staffId.includes(searchTerm) ||
      staff.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card className="bg-white rounded-2xl border border-slate-200/70 shadow-xs overflow-hidden">
      {/* Section Header with Integrated Search */}
      <div className="p-5 sm:p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h3 className="text-xl font-extrabold text-slate-900">
            স্টাফ লিস্ট
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Search, edit, manage salaries, joining dates, and PDF documents of staff members.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-72">
            <Input
              type="text"
              placeholder="নাম, ফোন বা আইডি দিয়ে অনুসন্ধান..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 h-10 bg-white border-slate-300 rounded-xl text-xs font-medium text-slate-800 focus:border-emerald-600 shadow-2xs"
            />
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
          </div>

          <span className="bg-emerald-50 text-[#054a48] border border-emerald-200/80 text-xs font-bold px-3.5 py-2.5 rounded-xl whitespace-nowrap shadow-2xs">
            মোট স্টাফ: {filteredStaff.length}
          </span>
        </div>
      </div>

      {/* Table Area (Fully Responsive) */}
      <div className="overflow-x-auto w-full">
        <table className="w-full text-left text-xs border-collapse min-w-[850px]">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-100/70 text-slate-700 font-bold uppercase tracking-wider">
              <th className="py-3.5 px-4 text-center">ছবি</th>
              <th className="py-3.5 px-4">নাম ও মোবাইল</th>
              <th className="py-3.5 px-4">আইডি</th>
              <th className="py-3.5 px-4">ROLE</th>
              <th className="py-3.5 px-4">বেতন (Salary)</th>
              <th className="py-3.5 px-4">যোগদানের তারিখ</th>
              <th className="py-3.5 px-4 text-center">ডকুমেন্ট (PDF)</th>
              <th className="py-3.5 px-4 text-center">স্থিতি</th>
              <th className="py-3.5 px-4 text-center">অ্যাকশন</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {filteredStaff.length === 0 ? (
              <tr>
                <td
                  colSpan={9}
                  className="py-12 text-center text-slate-400 font-semibold"
                >
                  কোন স্টাফ পাওয়া যায়নি
                </td>
              </tr>
            ) : (
              filteredStaff.map((staff) => (
                <tr
                  key={staff.id}
                  className="hover:bg-slate-50/80 transition-colors"
                >
                  {/* Photo Avatar */}
                  <td className="py-3 px-4 text-center">
                    <img
                      src={
                        staff.photoUrl ||
                        staff.avatar ||
                        `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde`
                      }
                      alt={staff.name}
                      className="w-10 h-10 rounded-full mx-auto border-2 border-slate-200 bg-slate-100 object-cover shadow-2xs"
                    />
                  </td>

                  {/* Name & Mobile */}
                  <td className="py-3 px-4">
                    <p className="font-bold text-slate-900 text-sm">
                      {staff.name}
                    </p>
                    <p className="text-[11px] text-slate-500 font-mono mt-0.5 font-semibold">
                      {staff.mobile}
                    </p>
                  </td>

                  {/* Staff ID */}
                  <td className="py-3 px-4 text-slate-700 font-mono font-bold">
                    #{staff.staffId}
                  </td>

                  {/* Role */}
                  <td className="py-3 px-4 text-slate-800 font-semibold">
                    {staff.role}
                  </td>

                  {/* Salary */}
                  <td className="py-3 px-4">
                    <span className="font-extrabold text-emerald-700 text-xs bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200/60 inline-block">
                      ৳ {Number(staff.basicSalary || 0).toLocaleString()}
                    </span>
                  </td>

                  {/* Join Date */}
                  <td className="py-3 px-4 text-slate-600 font-semibold">
                    <div className="flex items-center gap-1.5">
                      <Calendar size={13} className="text-slate-400" />
                      <span>{staff.joiningDate}</span>
                    </div>
                  </td>

                  {/* PDF Document Uploaded */}
                  <td className="py-3 px-4 text-center">
                    {staff.pdfDocumentName ? (
                      <button
                        type="button"
                        onClick={() =>
                          downloadPdfDocument(
                            staff.pdfDocumentName,
                            staff.pdfDocumentUrl,
                            staff.name
                          )
                        }
                        className="inline-flex items-center gap-1.5 bg-red-50 hover:bg-red-100 text-rose-700 border border-red-200 px-2.5 py-1 rounded-lg font-bold text-[11px] transition-colors cursor-pointer"
                        title={`ডাউনলোড করুন: ${staff.pdfDocumentName}`}
                      >
                        <FileText size={13} className="text-rose-600" />
                        <span className="max-w-[100px] truncate">
                          {staff.pdfDocumentName}
                        </span>
                        <Download size={12} className="text-rose-500 shrink-0" />
                      </button>
                    ) : (
                      <span className="text-slate-400 text-[11px]">
                        কোন PDF নেই
                      </span>
                    )}
                  </td>

                  {/* Status */}
                  <td className="py-3 px-4 text-center">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                        staff.status === "সক্রিয়"
                          ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                          : "bg-rose-100 text-rose-800 border border-rose-300"
                      }`}
                    >
                      {staff.status}
                    </span>
                  </td>

                  {/* Action Buttons */}
                  <td className="py-3 px-4 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      {/* Edit Button */}
                      <Button
                        variant="secondary"
                        onClick={() => onOpenEditForm(staff)}
                        className="p-2 rounded-lg border border-primary hover:bg-primary/30 text-primary font-bold shadow-xs transition-colors cursor-pointer flex items-center justify-center"
                        title="সম্পাদনা করুন (Edit Staff)"
                      >
                        <Edit className="w-4 h-4 text-primary stroke-[2.5]" />
                      </Button>

                      {/* View Details Button */}
                      <Button
                        variant="secondary"
                        onClick={() => onSelectStaff(staff)}
                        className="p-2 rounded-lg border border-primary hover:bg-primary/30 text-primary font-bold shadow-xs transition-colors cursor-pointer flex items-center justify-center"
                        title="বিস্তারিত দেখুন (View Details)"
                      >
                        <Eye className="w-4 h-4 text-primary stroke-[2.5]" />
                      </Button>

                      {/* Delete Button */}
                      <Button
                        variant="secondary"
                        onClick={() => onDeleteStaff(staff)}
                        className="p-2 rounded-lg border border-primary hover:bg-primary/30 text-primary font-bold shadow-xs transition-colors cursor-pointer flex items-center justify-center"
                        title="ডিলিট করুন (Delete)"
                      >
                        <Trash2 className="w-4 h-4 text-primary stroke-[2.5]" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="p-4 sm:p-5 border-t border-slate-200 bg-slate-50/70 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <p className="font-bold text-slate-700 text-sm">
          দেখানো হচ্ছে 1 টি থেকে {filteredStaff.length} এন্ট্রি (Total: {staffList.length})
        </p>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            className="h-9 px-3 border-slate-300 text-slate-800 hover:bg-slate-200 font-bold text-xs flex items-center gap-1.5 shadow-2xs"
          >
            <ChevronLeft className="w-4 h-4 text-slate-800 stroke-[2.5]" />
            <span>আগের (Prev)</span>
          </Button>
          <Button
            variant="outline"
            className="h-9 w-9 rounded-xl text-primary font-extrabold text-sm flex items-center justify-center shadow-xs"
          >
            1
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled
            className="h-9 px-3 border-slate-300 text-slate-800 hover:bg-slate-200 font-bold text-xs flex items-center gap-1.5 shadow-2xs"
          >
            <span>পরবর্তী (Next)</span>
            <ChevronRight className="w-4 h-4 text-slate-800 stroke-[2.5]" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
