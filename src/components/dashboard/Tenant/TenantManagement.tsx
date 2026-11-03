import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import Swal from "sweetalert2";
import { useGetBuildingsQuery } from "../../../redux/features/building/buildingApi";
import {
  initialTenantQueryPayload,
  useDeleteTenantByIdMutation,
  useGetTenantsMutation,
  useUpdateTenantByIdMutation,
} from "../../../redux/features/tenant/tenantApi";
import { handleApiError } from "../../../utils/errorHandler";
import AddTenantModal, { type TenantUser } from "../Building/AddTenantModal";
import TenantList from "./TenantList";
import TenantRegister from "./TenantRegister";
import { type Tenant } from "./types";

export default function TenantManagement() {
  const navigate = useNavigate();
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [accessFilter, setAccessFilter] = useState<boolean>(true);
  const [selectedBuilding, setSelectedBuilding] = useState<string>("ALL");
  const [viewMode, setViewMode] = useState<"list" | "register" | "details">(
    "list",
  );
  const [editingTenant, setEditingTenant] = useState<Tenant | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const { data: buildingsData } = useGetBuildingsQuery({
    pagination: { pageSize: 100, currentPage: 1 },
    filter: null,
  });
  const buildings = buildingsData?.data || [];

  const [getTenantsApi, { isLoading: isFetchingTenants }] = useGetTenantsMutation();
  const [deleteTenantApi] = useDeleteTenantByIdMutation();
  const [updateTenantApi] = useUpdateTenantByIdMutation();

  const fetchTenants = useCallback(
    async (
      filterVal: boolean = accessFilter,
      buildingId: string = selectedBuilding,
    ) => {
      try {
        const filterObj: any = {
          hasAccess: filterVal,
        };
        if (buildingId && buildingId !== "ALL") {
          filterObj["building._id"] = buildingId;
        }

        const payload: any = {
          ...initialTenantQueryPayload,
          filter: {
            ...(initialTenantQueryPayload.filter || {}),
            ...filterObj,
          },
        };
        const res = await getTenantsApi(payload).unwrap();
        if (res?.data && Array.isArray(res.data)) {
          // Map backend tenant items to local Tenant interface
          const mappedTenants: Tenant[] = res.data.map((t: any, idx: number) => ({
            _id: t._id || t.id,
            id: t.id || `#${100 + idx}`,
            name: t.name || "N/A",
            phoneNo: t.phoneNo || t.username || "N/A",
            phone: t.phoneNo || t.username || "N/A",
            email: t.email || "",
            fatherName: t.fatherName || "",
            motherName: t.motherName || "",
            nidNo: t.nidNo || "",
            maritalStatus: t.maritalStatus || "Single",
            permanentAddress:
              typeof t.permanentAddress === "string"
                ? t.permanentAddress
                : t.permanentAddress?.fullAddress || "",
            hasAccess: Boolean(t.hasAccess),
            hasUserAccess: Boolean(t.hasAccess),
            profileImg: t.profileImg || "",
            documents: t.documents || "",
            profileType: "ভাড়াটিয়া",
            status:
              t.hasAccess === false || t.status === "inactive" || t.status === "নিষ্ক্রিয়"
                ? "নিষ্ক্রিয়"
                : "সক্রিয়",
            building: t.building || { _id: "bld", name: t.buildingName || "N/A" },
            buildingName: t.building?.name || t.buildingName || "N/A",
            floor: t.floor || { floorNo: "1st Floor" },
            unit: t.unit || { flotNo: t.unitName || "101" },
            unitName: t.unit?.unitNo || t.unit?.flotNo || t.unitName || "101",
            emergencyContact: t.emergencyContact || {
              name: "",
              phoneNo: "",
              mobile: "",
              address: "",
              relation: "",
            },
            familyMembers: t.familyMembers || [],
            joinedDate: t.createdAt
              ? new Date(t.createdAt).toISOString().split("T")[0]
              : undefined,
          }));
          setTenants(mappedTenants);
        } else {
          setTenants([]);
        }
      } catch (e: any) {
        console.error("Error fetching tenants from API:", e);
        setTenants([]);
      }
    },
    [getTenantsApi, accessFilter, selectedBuilding],
  );

  useEffect(() => {
    fetchTenants(accessFilter, selectedBuilding);
  }, [fetchTenants, accessFilter, selectedBuilding]);

  const handleAccessFilterChange = (newFilter: boolean) => {
    setAccessFilter(newFilter);
  };

  const handleBuildingChange = (bId: string) => {
    setSelectedBuilding(bId);
  };

  // Open Register Form for creating a new tenant
  const handleOpenRegisterForm = () => {
    setEditingTenant(null);
    setViewMode("register");
  };

  // Open Register Form pre-populated for updating/editing an existing tenant
  const handleOpenEditTenant = (tenant: Tenant) => {
    setEditingTenant(tenant);
    setViewMode("register");
  };

  // Open Tenant Details Page
  const handleSelectTenantDetails = (tenant: Tenant) => {
    navigate(`/tenants/${tenant._id}`);
  };

  // Delete Tenant from List
  const handleDeleteTenant = (tenant: Tenant) => {
    const tenantId = tenant._id || tenant.id;
    Swal.fire({
      title: "আপনি কি নিশ্চিত?",
      text: `"${tenant.name}" কে তালিকা থেকে মুছে ফেলা হবে।`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#054a48",
      cancelButtonColor: "#dc2626",
      confirmButtonText: "হ্যাঁ, ডিলিট করুন",
      cancelButtonText: "বাতিল",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await deleteTenantApi(tenantId).unwrap();
          if (res?.success !== false) {
            toast.success(res?.message || "ভাড়াটিয়া সফলভাবে মুছে ফেলা হয়েছে");
            fetchTenants(accessFilter, selectedBuilding);
          } else {
            handleApiError(res, "মুছে ফেলতে ব্যর্থ হয়েছে!");
          }
        } catch (e: any) {
          handleApiError(e, "মুছে ফেলতে ব্যর্থ হয়েছে!");
        }
      }
    });
  };

  // Toggle User Panel Login Access (hasAccess) with Confirmation Dialog
  const handleToggleUserAccess = (tenant: Tenant) => {
    const currentAccess = tenant.hasAccess ?? tenant.hasUserAccess ?? false;
    const newAccess = !currentAccess;
    const tenantId = tenant._id || tenant.id;

    const actionText = currentAccess ? "বন্ধ / স্থগিত" : "সক্রিয় / অনুমোদন";
    const confirmButtonColor = currentAccess ? "#dc2626" : "#054a48";
    const confirmButtonText = currentAccess
      ? "হ্যাঁ, অ্যাকসেস বন্ধ করুন"
      : "হ্যাঁ, অ্যাকসেস দিন";

    Swal.fire({
      title: "আপনি কি নিশ্চিত?",
      text: `ভাড়াটিয়া "${tenant.name}" এর ইউজার প্যানেল লগইন অ্যাকসেস ${actionText} করতে চান?`,
      icon: currentAccess ? "warning" : "question",
      showCancelButton: true,
      confirmButtonColor: confirmButtonColor,
      cancelButtonColor: "#64748b",
      confirmButtonText: confirmButtonText,
      cancelButtonText: "বাতিল",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await updateTenantApi({
            id: tenantId,
            data: { hasAccess: newAccess },
          }).unwrap();

          if (res?.success !== false) {
            toast.success(
              res?.message ||
                `অ্যাকসেস সফলভাবে ${newAccess ? "অনুমোদিত" : "স্থগিত"} করা হয়েছে`,
            );
            fetchTenants(accessFilter, selectedBuilding);
          } else {
            handleApiError(res, "অ্যাকসেস আপডেট করতে ব্যর্থ হয়েছে!");
          }
        } catch (e) {
          handleApiError(e, "অ্যাকসেস আপডেট করতে ব্যর্থ হয়েছে!");
        }
      }
    });
  };

  // Save Tenant from Full Registration & Update Page
  const handleSaveTenant = (_savedTenant: Tenant) => {
    fetchTenants(accessFilter, selectedBuilding);
    setEditingTenant(null);
    setViewMode("list");
  };

  // Save Tenant from Modal Callback (for quick modal registration)
  const handleSaveTenantFromModal = (
    _flotId: string,
    tenantUser: TenantUser,
  ) => {
    const newId = `#${Math.floor(100 + Math.random() * 900)}`;
    const newTenant: Tenant = {
      _id: tenantUser._id || `usr_${Date.now()}`,
      id: newId,
      name: tenantUser.name,
      phoneNo: tenantUser.phone || tenantUser.altPhone || "01700000000",
      phone: tenantUser.phone || "01700000000",
      email: tenantUser.email,
      fatherName: tenantUser.fatherName || "",
      motherName: tenantUser.motherName || "",
      nidNo: tenantUser.nidNo || "",
      maritalStatus: tenantUser.maritalStatus || "Single",
      permanentAddress: tenantUser.permanentAddress || "",
      password: tenantUser.password || "tenant12345",
      hasAccess: true,
      hasUserAccess: true,
      profileImg: tenantUser.photo || "",
      documents: tenantUser.documents || "",
      profileType: "ভাড়াটিয়া",
      building: {
        _id: tenantUser.buildingId || "bld_1",
        name: tenantUser.buildingName || "Master Tower",
        address: "মাওনা চৌরাস্তা, গাজীপুর",
        phoneNo: "01711122233",
      },
      buildingName: tenantUser.buildingName || "Master Tower",
      floor: {
        _id: "flr_1",
        floorNo: "1st Floor",
      },
      unit: {
        _id: tenantUser.flotId || "unt_101",
        floorNo: "1st Floor",
        flotNo: tenantUser.unitName || "101",
      },
      unitName: tenantUser.unitName || "101",
      status: "সক্রিয়",
      emergencyContact: tenantUser.emergencyContact
        ? {
            name: tenantUser.emergencyContact.name,
            phoneNo: tenantUser.emergencyContact.mobile,
            mobile: tenantUser.emergencyContact.mobile,
            address: tenantUser.emergencyContact.address,
            relation: tenantUser.emergencyContact.relation,
          }
        : {
            name: "",
            phoneNo: "",
            mobile: "",
            address: "",
            relation: "",
          },
      familyMembers: (tenantUser.familyMembers || []).map((m, idx) => ({
        _id: m.id || `fam-${Date.now() + idx}`,
        id: m.id || `fam-${Date.now() + idx}`,
        name: m.name,
        age: m.age,
        occupation: m.occupation,
        relation: m.relation,
        phoneNo: m.mobile,
        mobile: m.mobile,
      })),
      monthlyCharges: {
        baseFare: 15000,
        utilityBill: 500,
        waterBill: 1000,
        gasBill: 1080,
        wastageBill: 100,
        welfareBill: 200,
        securityBill: 500,
        monthlyTotal: 18380,
      },
      financialSummary: {
        monthlyPayable: 18380,
        totalBill: 147040,
        totalPaid: 147040,
        balance: 0,
      },
      joinedDate: new Date().toISOString().split("T")[0],
    };

    setTenants((prev) => [newTenant, ...prev]);
    setIsAddModalOpen(false);
    toast.success("নতুন ভাড়াটিয়া সফলভাবে যোগ করা হয়েছে");
  };

  return (
    <div className="w-full space-y-6 p-4 sm:p-6 pb-16">
      {/* 1. Tenant Directory List View with Access Control Filtering */}
      {viewMode === "list" && (
        <TenantList
          tenantList={tenants}
          accessFilter={accessFilter}
          onAccessFilterChange={handleAccessFilterChange}
          selectedBuilding={selectedBuilding}
          onBuildingChange={handleBuildingChange}
          buildings={buildings}
          isLoading={isFetchingTenants}
          onOpenRegisterForm={handleOpenRegisterForm}
          onSelectTenantDetails={handleSelectTenantDetails}
          onOpenEditTenant={handleOpenEditTenant}
          onDeleteTenant={handleDeleteTenant}
          onToggleUserAccess={handleToggleUserAccess}
        />
      )}

      {/* 2. Tenant Full Registration & Update Page View */}
      {viewMode === "register" && (
        <TenantRegister
          editingTenant={editingTenant}
          onSaveTenant={handleSaveTenant}
          onBackToList={() => {
            setEditingTenant(null);
            setViewMode("list");
          }}
        />
      )}

      {/* 3. Tenant Details View (Removed from here, now in a separate route) */}

      {/* 4. Optional Quick Add Modal */}
      <AddTenantModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSaveTenant={handleSaveTenantFromModal}
      />
    </div>
  );
}
