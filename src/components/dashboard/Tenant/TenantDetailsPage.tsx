import { useParams, useNavigate } from "react-router-dom";
import { useGetTenantByIdQuery } from "../../../redux/features/tenant/tenantApi";
import TenantDetails from "./TenantDetails";
import { Loader2 } from "lucide-react";
import { useMemo } from "react";
import type { Tenant } from "./types";

export default function TenantDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const {
    data: tenantData,
    isLoading,
    isFetching,
  } = useGetTenantByIdQuery(id);

  const tenant: Tenant | undefined = useMemo(() => {
    if (!tenantData?.data) return undefined;
    const t = tenantData.data;

    return {
      _id: t._id || t.id,
      id: t.id || t._id,
      name: t.name || "N/A",
      phoneNo: t.phoneNo || t.username || "N/A",
      phone: t.phoneNo || t.username || "N/A",
      email: t.email || "",
      fatherName: t.fatherName || "",
      motherName: t.motherName || "",
      nidNo: t.nidNo || "",
      maritalStatus: t.maritalStatus || "Single",
      permanentAddress: typeof t.permanentAddress === "string" ? t.permanentAddress : t.permanentAddress?.fullAddress || "",
      hasAccess: Boolean(t.hasAccess),
      hasUserAccess: Boolean(t.hasAccess),
      profileImg: t.profileImg || "",
      documents: t.documents || "",
      profileType: "ভাড়াটিয়া",
      status: t.status === "inactive" || t.status === "নিষ্ক্রিয়" ? "নিষ্ক্রিয়" : "সক্রিয়",
      building: t.building || { _id: "bld", name: t.buildingName || "N/A" },
      buildingName: t.building?.name || t.buildingName || "N/A",
      floor: t.floor || { floorNo: "1st Floor" },
      unit: t.unit || { flotNo: t.unitName || "101" },
      unitName: t.unit?.unitNo || t.unit?.flotNo || t.unitName || "101",
      emergencyContact: t.emergencyContact || { name: "", phoneNo: "", mobile: "", address: "", relation: "" },
      familyMembers: t.familyMembers || [],
      joinedDate: t.createdAt ? new Date(t.createdAt).toISOString().split("T")[0] : undefined,
    } as Tenant;
  }, [tenantData]);

  const handleBackToList = () => {
    navigate("/tenants");
  };

  const handleEditTenant = (t: Tenant) => {
    console.log("Edit requested for", t);
  };

  if (isLoading || isFetching) {
    return (
      <div className="w-full h-[60vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-10 h-10 animate-spin text-[#054a48]" />
        <p className="text-gray-500 font-medium">ভাড়াটিয়ার তথ্য লোড হচ্ছে...</p>
      </div>
    );
  }

  if (!tenant) {
    return (
      <div className="w-full h-[60vh] flex flex-col items-center justify-center space-y-4">
        <p className="text-red-500 font-medium text-lg">
          ভাড়াটিয়া পাওয়া যায়নি (Tenant not found)
        </p>
        <button
          onClick={handleBackToList}
          className="px-4 py-2 bg-[#054a48] text-white rounded-lg text-sm font-semibold"
        >
          ফিরে যান (Go Back)
        </button>
      </div>
    );
  }

  return (
    <div className="w-full p-4 sm:p-6">
      <TenantDetails
        tenant={tenant}
        onBackToList={handleBackToList}
        onEditTenant={handleEditTenant}
      />
    </div>
  );
}
