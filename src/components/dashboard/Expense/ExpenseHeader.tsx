import { Plus, Tag } from "lucide-react";
import { Button } from "../../ui/button";

interface ExpenseHeaderProps {
  onOpenAddModal: () => void;
  onOpenCategoryModal?: () => void;
}

export default function ExpenseHeader({ onOpenAddModal, onOpenCategoryModal }: ExpenseHeaderProps) {
  return (
    <div className="space-y-4">
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#054a48] via-[#086361] to-[#043634] p-6 text-white shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-[32px] sm:text-[36px] md:text-[40px] lg:text-[48px] xl:text-[52px] font-extrabold tracking-tight leading-tight">
              খরচ ব্যবস্থাপনা (Expense Management)
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {onOpenCategoryModal && (
              <Button
                onClick={onOpenCategoryModal}
                variant="outline"
                className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white border-white/30 font-semibold px-4 py-3 rounded-xl backdrop-blur-xs transition-all duration-200 cursor-pointer"
              >
                <Tag size={18} />
                <span>নতুন ক্যাটাগরি</span>
              </Button>
            )}
            <Button
              onClick={onOpenAddModal}
              className="inline-flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold px-5 py-3 rounded-xl shadow-lg hover:shadow-emerald-500/25 transition-all duration-200 cursor-pointer"
            >
              <Plus size={18} />
              <span>নতুন খরচ যোগ করুন</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
