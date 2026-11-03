import { Plus } from "lucide-react";
import { Button } from "../../ui/button";
import type { StaffMember } from "./types";

interface StaffHeaderProps {
  viewMode: "list" | "form";
  editingStaff: StaffMember | null;
  onOpenAddForm: () => void;
  onBackToList: () => void;
}

export default function StaffHeader({
  viewMode,
  editingStaff,
  onOpenAddForm,
  onBackToList,
}: StaffHeaderProps) {
  return (
    <div className="bg-[#054a48] text-white rounded-2xl p-5 sm:p-7 shadow-lg flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 className="text-[32px] sm:text-[36px] md:text-[40px] lg:text-[48px] xl:text-[52px] font-extrabold tracking-tight leading-tight">
          {viewMode === "list"
            ? "Staff Directory (স্টাফ তালিকা)"
            : editingStaff
              ? "স্টাফ সম্পাদনা করুন"
              : "স্টাফ যোগ করুন"}
        </h1>
      </div>

      <div>
        {viewMode === "list" ? (
          <Button
            onClick={onOpenAddForm}
            className="bg-white hover:bg-emerald-50 text-[#054a48] font-bold px-5 py-2.5 rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer text-sm"
          >
            <Plus size={18} /> স্টাফ যোগ করুন
          </Button>
        ) : (
          <Button
            onClick={onBackToList}
            className="bg-white/10 hover:bg-white/20 border border-white/30 text-white font-semibold px-5 py-2.5 rounded-xl backdrop-blur-xs transition-all flex items-center gap-2 cursor-pointer text-sm"
          >
            ← ব্যাক করুন
          </Button>
        )}
      </div>
    </div>
  );
}
