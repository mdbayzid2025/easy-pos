import { useState } from "react";
import { toast } from "sonner";
import Swal from "sweetalert2";
import StaffDetailsModal from "./StaffDetailsModal";
import StaffForm from "./StaffForm";
import StaffHeader from "./StaffHeader";
import StaffTable from "./StaffTable";
import { initialStaffList, type StaffMember } from "./types";

export default function StaffManagement() {
  const [staffList, setStaffList] = useState<StaffMember[]>(initialStaffList);
  const [viewMode, setViewMode] = useState<"list" | "form">("list");
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null);
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);

  const handleOpenAddForm = () => {
    setEditingStaff(null);
    setViewMode("form");
  };

  const handleOpenEditForm = (staff: StaffMember) => {
    setEditingStaff(staff);
    setSelectedStaff(null);
    setViewMode("form");
  };

  const handleDeleteStaff = (staff: StaffMember) => {
    Swal.fire({
      title: "আপনি কি নিশ্চিত?",
      text: `${staff.name} কে স্টাফ তালিকা থেকে মুছে ফেলা হবে।`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#054a48",
      cancelButtonColor: "#dc2626",
      confirmButtonText: "হ্যাঁ, ডিলিট করুন",
      cancelButtonText: "বাতিল",
    }).then((result) => {
      if (result.isConfirmed) {
        setStaffList((prev) => prev.filter((s) => s.id !== staff.id));
        toast.success("স্টাফ সফলভাবে ডিলিট করা হয়েছে");
      }
    });
  };

  const handleSaveStaff = (formData: Partial<StaffMember>) => {
    if (editingStaff) {
      setStaffList((prev) =>
        prev.map((s) =>
          s.id === editingStaff.id
            ? ({
                ...s,
                ...formData,
              } as StaffMember)
            : s,
        ),
      );
      toast.success("স্টাফ তথ্য সফলভাবে আপডেট করা হয়েছে");
    } else {
      const newStaff: StaffMember = {
        id: String(Date.now()),
        staffId:
          formData.staffId || String(Math.floor(10000 + Math.random() * 90000)),
        name: formData.name || "",
        mobile: formData.mobile || "",
        email: formData.email || "",
        address: formData.address || "",
        nid: formData.nid || "",
        fatherName: formData.fatherName || "",
        motherName: formData.motherName || "",
        gender: formData.gender || "পুরুষ",
        dob: formData.dob || "",
        joiningDate:
          formData.joiningDate || new Date().toISOString().split("T")[0],
        role: formData.role || "Helper and Trainee",
        status: (formData.status as "সক্রিয়" | "নিষ্ক্রিয়") || "সক্রিয়",
        deletePermission: (formData.deletePermission as "হ্যাঁ" | "না") || "না",
        basicSalary: formData.basicSalary || "12000.00",
        photoUrl: formData.photoUrl || "",
        pdfDocumentName: formData.pdfDocumentName || "Staff_Document.pdf",
        avatar:
          formData.photoUrl ||
          `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde`,
      };
      setStaffList((prev) => [newStaff, ...prev]);
      toast.success("নতুন স্টাফ সফলভাবে যোগ করা হয়েছে");
    }

    setViewMode("list");
  };

  return (
    <div className="w-full space-y-6 p-4 sm:p-6 pb-16">
      {/* 1. Header Banner */}
      <StaffHeader
        viewMode={viewMode}
        editingStaff={editingStaff}
        onOpenAddForm={handleOpenAddForm}
        onBackToList={() => setViewMode("list")}
      />

      {/* 2. Main Directory Table View */}
      {viewMode === "list" && (
        <StaffTable
          staffList={staffList}
          onOpenEditForm={handleOpenEditForm}
          onSelectStaff={(staff) => setSelectedStaff(staff)}
          onDeleteStaff={handleDeleteStaff}
        />
      )}

      {/* 3. Add / Edit Staff Form View */}
      {viewMode === "form" && (
        <StaffForm
          editingStaff={editingStaff}
          onSaveStaff={handleSaveStaff}
          onCancel={() => setViewMode("list")}
          onReset={() => setEditingStaff(null)}
        />
      )}

      {/* 4. Staff Details Modal */}
      {selectedStaff && (
        <StaffDetailsModal
          staff={selectedStaff}
          onClose={() => setSelectedStaff(null)}
          onEdit={(staff) => handleOpenEditForm(staff)}
        />
      )}
    </div>
  );
}
