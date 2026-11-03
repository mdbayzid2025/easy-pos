import {
  Edit2,
  Trash2,
  Eye,
  Image as ImageIcon,
  Calendar,
  Tag,
  FileText,
} from "lucide-react";
import { type Expense } from "../../../types/expense";

interface ExpenseTableProps {
  expenses: Expense[];
  onViewDetails: (expense: Expense) => void;
  onEditExpense: (expense: Expense) => void;
  onDeleteExpense: (expense: Expense) => void;
}

export default function ExpenseTable({
  expenses,
  onViewDetails,
  onEditExpense,
  onDeleteExpense,
}: ExpenseTableProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/80 border-b border-gray-200 text-xs font-semibold text-gray-600 uppercase tracking-wider">
              <th className="py-3.5 px-4 w-12 text-center">ক্রমিক</th>
              <th className="py-3.5 px-4 min-w-[120px]">তারিখ (Date)</th>
              <th className="py-3.5 px-4 min-w-[160px]">
                ক্যাটাগরি (Category)
              </th>
              <th className="py-3.5 px-4 min-w-[140px]">টাইপ (Type)</th>
              <th className="py-3.5 px-4 min-w-[240px]">বিবরণ (Description)</th>
              <th className="py-3.5 px-4 min-w-[90px] text-center">
                ছবি (Images)
              </th>
              <th className="py-3.5 px-4 min-w-[130px] text-right">
                পরিমাণ (Amount)
              </th>
              <th className="py-3.5 px-4 w-28 text-center">অ্যাকশন</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm">
            {expenses.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center py-10 text-gray-500">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <FileText className="w-10 h-10 text-gray-300 stroke-[1.5]" />
                    <p className="font-medium text-gray-600">
                      কোন খরচের তথ্য পাওয়া যায়নি
                    </p>
                    <p className="text-xs text-gray-400">
                      নতুন খরচ যোগ করতে বা ফিল্টার পরিবর্তন করে চেষ্টা করুন
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              expenses.map((exp, index) => {
                return (
                  <tr
                    key={exp._id}
                    className="hover:bg-teal-50/30 transition-colors duration-150"
                  >
                    {/* Index */}
                    <td className="py-3.5 px-4 text-center font-medium text-gray-500 text-xs">
                      {index + 1}
                    </td>

                    {/* DateString */}
                    <td className="py-3.5 px-4 text-gray-700 text-xs font-semibold whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <Calendar size={14} className="text-[#054a48]" />
                        <span>{exp.dateString || "N/A"}</span>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200/60">
                        <Tag size={12} />
                        <span>{exp.category?.name || "সাধারণ খরচ"}</span>
                      </span>
                    </td>

                    {/* Type */}
                    <td className="py-3.5 px-4">
                      {exp.type === "OwnerCost" ? (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-semibold border border-amber-200/70">
                          Cost From Owner
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-blue-50 text-blue-800 text-xs font-semibold border border-blue-200/70">
                          Cost From Office
                        </span>
                      )}
                    </td>

                    {/* Description */}
                    <td className="py-3.5 px-4 text-gray-700 text-xs leading-relaxed max-w-sm">
                      <p className="line-clamp-2">{exp.description || "—"}</p>
                    </td>

                    {/* Images Thumbnails */}
                    <td className="py-3.5 px-4 text-center">
                      {exp.images && exp.images.length > 0 ? (
                        <div className="flex items-center justify-center gap-1">
                          <div
                            className="relative group cursor-pointer"
                            onClick={() => onViewDetails(exp)}
                          >
                            <img
                              src={exp.images[0]}
                              alt="Voucher"
                              className="w-9 h-9 object-cover rounded-lg border border-gray-200 shadow-2xs hover:scale-105 transition-transform"
                            />
                            {exp.images.length > 1 && (
                              <span className="absolute -top-1.5 -right-1.5 bg-[#054a48] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-xs">
                                +{exp.images.length - 1}
                              </span>
                            )}
                          </div>
                        </div>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] text-gray-400 italic">
                          <ImageIcon size={14} />
                          <span>নেই</span>
                        </span>
                      )}
                    </td>

                    {/* Amount */}
                    <td className="py-3.5 px-4 text-right font-bold text-emerald-700 text-sm whitespace-nowrap">
                      ৳ {exp.amount?.toLocaleString() || "0"}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => onViewDetails(exp)}
                          title="বিস্তারিত দেখুন"
                          className="p-1.5 rounded-lg text-emerald-700 hover:bg-emerald-50 transition-colors cursor-pointer"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => onEditExpense(exp)}
                          title="সম্পাদনা করুন"
                          className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => onDeleteExpense(exp)}
                          title="মুছে ফেলুন"
                          className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
          {expenses.length > 0 && (
            <tfoot className="bg-emerald-50/50 border-t-2 border-emerald-200 text-xs font-bold text-gray-800">
              <tr>
                <td
                  colSpan={6}
                  className="py-3.5 px-4 text-right uppercase tracking-wider text-emerald-900 font-extrabold"
                >
                  সর্বমোট পরিমাণ (Subtotal):
                </td>
                <td className="py-3.5 px-4 text-right font-black text-emerald-800 text-base whitespace-nowrap">
                  ৳{" "}
                  {expenses
                    .reduce((sum, exp) => sum + (exp.amount || 0), 0)
                    .toLocaleString()}
                </td>
                <td colSpan={1}></td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    </div>
  );
}
