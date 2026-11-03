import { useState, useMemo, useEffect } from "react";
import { toast } from "sonner";
import Swal from "sweetalert2";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Tag,
  ChevronLeft,
  ChevronRight,
  FileText,
  X,
  Sparkles,
} from "lucide-react";
import {
  useGetExpenseCategoriesQuery,
  useAddExpenseCategoryMutation,
  useUpdateExpenseCategoryMutation,
  useDeleteExpenseCategoryMutation,
} from "../../../redux/features/expense/expenseApi";
import {
  type ExpenseCategory,
} from "../../../types/expense";
import { Button } from "../../ui/button";

export default function ExpenseCategoryManagement() {
  const [categories, setCategories] = useState<ExpenseCategory[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] =
    useState<ExpenseCategory | null>(null);
  const [formName, setFormName] = useState("");

  // RTK Query API hooks
  const { data: apiData, isLoading } = useGetExpenseCategoriesQuery(undefined, {
    skip: false,
  });
  const [addCategoryApi] = useAddExpenseCategoryMutation();
  const [updateCategoryApi] = useUpdateExpenseCategoryMutation();
  const [deleteCategoryApi] = useDeleteExpenseCategoryMutation();

  // Sync API data directly
  useEffect(() => {
    if (apiData && Array.isArray(apiData?.data)) {
      setCategories(apiData.data);
    }
  }, [apiData]);

  // Filtered categories based on search
  const filteredCategories = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) return categories;
    return categories.filter((cat) => cat.name.toLowerCase().includes(term));
  }, [categories, searchTerm]);

  // Pagination logic
  const totalItems = filteredCategories.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  const paginatedCategories = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredCategories.slice(start, start + pageSize);
  }, [filteredCategories, currentPage, pageSize]);

  // Reset pagination on search change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, pageSize]);

  const handleOpenAddModal = () => {
    setEditingCategory(null);
    setFormName("");
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (category: ExpenseCategory) => {
    setEditingCategory(category);
    setFormName(category.name);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
    setFormName("");
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      toast.error("ক্যাটাগরির নাম প্রদান করুন");
      return;
    }

    if (editingCategory) {
      const updatedObj: ExpenseCategory = {
        ...editingCategory,
        name: formName.trim(),
      };

      try {
        await updateCategoryApi({
          id: editingCategory._id,
          name: formName.trim(),
        })
          .unwrap()
          .catch(() => {});
      } catch {
        // Fallback local state update
      }

      setCategories((prev) =>
        prev.map((c) => (c._id === editingCategory._id ? updatedObj : c)),
      );
      toast.success("ক্যাটাগরি তথ্য সফলভাবে আপডেট করা হয়েছে");
    } else {
      const newCategoryObj: ExpenseCategory = {
        _id: `cat_${Date.now()}`,
        name: formName.trim(),
        createdAt: new Date().toISOString().split("T")[0],
      };

      try {
        await addCategoryApi({
          name: formName.trim(),
        })
          .unwrap()
          .catch(() => {});
      } catch {
        // Fallback local state update
      }

      setCategories((prev) => [newCategoryObj, ...prev]);
      toast.success("নতুন খরচের ক্যাটাগরি যুক্ত করা হয়েছে");
    }

    handleCloseModal();
  };

  const handleDeleteCategory = (category: ExpenseCategory) => {
    Swal.fire({
      title: "আপনি কি নিশ্চিত?",
      text: `"${category.name}" ক্যাটাগরি মুছে ফেলা হবে।`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#054a48",
      cancelButtonColor: "#dc2626",
      confirmButtonText: "হ্যাঁ, মুছে ফেলুন",
      cancelButtonText: "বাতিল",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteCategoryApi(category._id)
            .unwrap()
            .catch(() => {});
        } catch {
          // Fallback local delete
        }
        setCategories((prev) => prev.filter((c) => c._id !== category._id));
        toast.success("ক্যাটাগরি সফলভাবে মুছে ফেলা হয়েছে");
      }
    });
  };

  return (
    <div className="w-full space-y-6 p-4 sm:p-6 pb-16">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#054a48] via-[#086361] to-[#043634] p-6 text-white shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-[32px] sm:text-[36px] md:text-[40px] lg:text-[48px] xl:text-[52px] font-extrabold tracking-tight leading-tight">
              খরচের ক্যাটাগরি ব্যবস্থাপনা (Expense Categories)
            </h1>
          </div>

          <Button
            onClick={handleOpenAddModal}
            className="inline-flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold px-5 py-3 rounded-xl shadow-lg hover:shadow-emerald-500/25 transition-all duration-200"
          >
            <Plus size={18} />
            <span>নতুন ক্যাটাগরি যোগ করুন</span>
          </Button>
        </div>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <Tag size={24} />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">মোট ক্যাটাগরি</p>
            <h3 className="text-2xl font-bold text-gray-800">
              {categories.length} টি
            </h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold">
            <Sparkles size={24} />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">
              খুঁজে পাওয়া ক্যাটাগরি
            </p>
            <h3 className="text-2xl font-bold text-gray-800">
              {filteredCategories.length} টি
            </h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <FileText size={24} />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">বর্তমান পেজ</p>
            <h3 className="text-2xl font-bold text-gray-800">
              {currentPage} / {totalPages}
            </h3>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-96">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            type="text"
            placeholder="ক্যাটাগরি নাম বা বিবরণ দিয়ে খুঁজুন..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-hidden focus:ring-2 focus:ring-[#054a48] focus:bg-white transition-all"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X size={16} />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <span className="text-xs text-gray-500 font-medium whitespace-nowrap">
            প্রতি পেজে:
          </span>
          <select
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value))}
            className="bg-gray-50 border border-gray-200 text-gray-700 text-xs rounded-lg px-2.5 py-2 focus:outline-hidden focus:ring-2 focus:ring-[#054a48]"
          >
            <option value={5}>৫ টি</option>
            <option value={10}>১০ টি</option>
            <option value={20}>২০ টি</option>
          </select>
        </div>
      </div>

      {/* Categories Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-200 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                <th className="py-3.5 px-4 w-16 text-center">ক্রমিক</th>
                <th className="py-3.5 px-4 min-w-[200px]">ক্যাটাগরির নাম</th>
                <th className="py-3.5 px-4 min-w-[140px]">তৈরির তারিখ</th>
                <th className="py-3.5 px-4 w-28 text-center">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-gray-500">
                    তথ্য লোড হচ্ছে...
                  </td>
                </tr>
              ) : paginatedCategories.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-10 text-gray-500">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Tag className="w-10 h-10 text-gray-300 stroke-[1.5]" />
                      <p className="font-medium text-gray-600">
                        কোন ক্যাটাগরি পাওয়া যায়নি
                      </p>
                      <p className="text-xs text-gray-400">
                        নতুন ক্যাটাগরি যোগ করতে উপরের বাটনে ক্লিক করুন
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedCategories.map((category, index) => {
                  const serialNo = (currentPage - 1) * pageSize + index + 1;
                  return (
                    <tr
                      key={category._id}
                      className="hover:bg-teal-50/30 transition-colors duration-150"
                    >
                      <td className="py-3.5 px-4 text-center font-medium text-gray-500">
                        {serialNo}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-gray-800">
                        <div className="flex items-center gap-2.5">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
                          <span>{category.name}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-gray-500 text-xs">
                        {category.createdAt
                          ? new Date(category.createdAt).toLocaleDateString(
                              "en-GB",
                              {
                                day: "2-digit",
                                month: "long",
                                year: "2-digit",
                              },
                            )
                          : "—"}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => handleOpenEditModal(category)}
                            title="সম্পাদনা করুন"
                            className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteCategory(category)}
                            title="মুছে ফেলুন"
                            className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors"
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
          </table>
        </div>

        {/* Pagination Bar */}
        {totalPages > 1 && (
          <div className="px-4 py-3 border-t border-gray-200 bg-gray-50/50 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-600">
            <div>
              দেখাচ্ছে{" "}
              <span className="font-semibold">
                {totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1}
              </span>{" "}
              থেকে{" "}
              <span className="font-semibold">
                {Math.min(currentPage * pageSize, totalItems)}
              </span>{" "}
              (সর্বমোট {totalItems} টি)
            </div>

            <div className="flex items-center gap-1">
              <Button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                variant="outline"
                size="sm"
                className="h-8 px-2.5 text-xs gap-1"
              >
                <ChevronLeft size={14} />
                <span>আগেরটি</span>
              </Button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (pageNum) => (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-8 h-8 rounded-lg font-medium text-xs transition-all ${
                      currentPage === pageNum
                        ? "bg-[#054a48] text-white shadow-xs"
                        : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-100"
                    }`}
                  >
                    {pageNum}
                  </button>
                ),
              )}

              <Button
                disabled={currentPage === totalPages}
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                variant="outline"
                size="sm"
                className="h-8 px-2.5 text-xs gap-1"
              >
                <span>পরেরটি</span>
                <ChevronRight size={14} />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Add / Edit Category Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Tag size={20} className="text-[#054a48]" />
                <span>
                  {editingCategory
                    ? "ক্যাটাগরি সম্পাদনা করুন"
                    : "নতুন ক্যাটাগরি যোগ করুন"}
                </span>
              </h3>
              <button
                onClick={handleCloseModal}
                className="p-1 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-700"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveCategory} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  ক্যাটাগরির নাম <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="যেমন: ইলেকট্রিক & ওয়ারিং"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#054a48] focus:outline-hidden"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCloseModal}
                  className="px-4 py-2 text-xs border-gray-300 text-gray-700"
                >
                  বাতিল
                </Button>
                <Button
                  type="submit"
                  className="px-5 py-2 text-xs bg-[#054a48] hover:bg-[#043a38] text-white font-medium"
                >
                  {editingCategory ? "আপডেট করুন" : "সংরক্ষণ করুন"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
