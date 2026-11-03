import { Plus, ArrowLeft } from "lucide-react";
import { Button } from "../../ui/button";
import type { Building } from "./types";

interface BuildingHeaderProps {
  viewMode: "list" | "form" | "details";
  editingBuilding: Building | null;
  onOpenAddForm: () => void;
  onBackToList: () => void;
}

export default function BuildingHeader({
  viewMode,
  editingBuilding,
  onOpenAddForm,
  onBackToList,
}: BuildingHeaderProps) {
  return (
    <div className="bg-[#054a48] text-white rounded-2xl p-5 sm:p-7 shadow-lg flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 transition-all duration-300">
      <div>
        <h1 className="text-[32px] sm:text-[36px] md:text-[40px] lg:text-[48px] xl:text-[52px] font-extrabold tracking-tight leading-tight">
          {viewMode === "list"
            ? "বিল্ডিংসমূহ (Building Directory)"
            : editingBuilding
              ? "বিল্ডিং সম্পাদনা করুন"
              : "ভবন তৈরি করুন (Create Building)"}
        </h1>
      </div>

      <div className="shrink-0">
        {viewMode === "list" ? (
          <Button
            onClick={onOpenAddForm}
            className="bg-white hover:bg-emerald-50 text-[#054a48] font-bold px-5 py-2.5 rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer text-sm"
          >
            <Plus size={18} /> নতুন যোগ করুন
          </Button>
        ) : (
          <Button
            onClick={onBackToList}
            className="bg-white/10 hover:bg-white/20 border border-white/30 text-white font-semibold px-5 py-2.5 rounded-xl backdrop-blur-xs transition-all flex items-center gap-2 cursor-pointer text-sm"
          >
            <ArrowLeft size={18} /> ← বিল্ডিং এর তালিকা
          </Button>
        )}
      </div>
    </div>
  );
}
