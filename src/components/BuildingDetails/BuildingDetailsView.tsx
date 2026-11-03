import {
  ArrowLeft,
  Building2,
  Car,
  DoorOpen,
  GitBranch,
  Home,
  Phone,
  Plus,
  Shield,
  Zap,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import Swal from "sweetalert2";
import { useGetFloorsMutation } from "../../redux/features/floor/floorApi";
import {
  useDeleteManagementByIdMutation,
  useGetManagementsQuery,
} from "../../redux/features/management/managementApi";
import {
  useCheckoutTenantMutation,
  useDeleteUnitByIdMutation,
  useGetUnitsMutation,
} from "../../redux/features/unit/unitApi";
import { useGetUsersGroupedByFloorQuery } from "../../redux/features/user/userApi";
import AddFloorModal from "../dashboard/Building/AddFloorModal";
import AddMemberModal from "../dashboard/Building/AddMemberModal";
import AddTenantModal from "../dashboard/Building/AddTenantModal";
import AddUnitModal from "../dashboard/Building/AddUnitModal";
import EditUnitModal from "../dashboard/Building/EditUnitModal";
import FlatDetailsModal from "../dashboard/Building/FlatDetailsModal";
import type { Floor, Flot } from "../dashboard/Building/types";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import BuildingOverviewTab from "./BuildingOverviewTab";
import UnitsTab from "./UnitsTab";
import type { BuildingDetailsViewProps } from "./utils/types";
import { getUniqueFloorNumbers, getUnitsForFloor } from "./utils/unitHelpers";

export default function BuildingDetailsView({
  building,
  onBackToList,
  onAddFlot,
  onAssignTenant,
  onCheckoutTenant,
}: BuildingDetailsViewProps) {
  const [activeTab, setActiveTab] = useState<"flowchart" | "units">(
    "flowchart",
  );

  const [selectedFlot, setSelectedFlot] = useState<Flot | null>(null);
  const [editingUnit, setEditingUnit] = useState<Flot | null>(null);
  const [isAddFloorModalOpen, setIsAddFloorModalOpen] = useState(false);
  const [isAddUnitModalOpen, setIsAddUnitModalOpen] = useState(false);
  const [isAddTenantModalOpen, setIsAddTenantModalOpen] = useState(false);
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);
  const [targetFlotForTenant, setTargetFlotForTenant] = useState<Flot | null>(
    null,
  );
  const [selectedFloorForUnit, setSelectedFloorForUnit] = useState<number>(1);

  // Fetch Management Members API
  const { data: managementRes, isLoading: isManagementLoading } =
    useGetManagementsQuery({
      pagination: {
        pageSize: 10,
        currentPage: 0,
      },
      filter: null,
      select: {
        name: 1,
        role: 1,
        mobile: 1,
        isDelete: 1,
        building: 1,
        createdAt: 1,
        updatedAt: 1,
      },
      sort: {
        createdAt: -1,
      },
    });

  const [deleteManagement] = useDeleteManagementByIdMutation();

  const rawMembers = managementRes?.data || [];
  const buildingMembers = rawMembers.filter((m: any) => {
    if (!m.building) return true;
    return (
      m.building._id === building._id ||
      m.building._id === building.id ||
      m.building.name === building.name
    );
  });

  // Get All Floors & Units Mutations
  const [getFloorsApi] = useGetFloorsMutation();
  const [apiFloors, setApiFloors] = useState<Floor[]>([]);

  const [getUnitsApi] = useGetUnitsMutation();
  const [deleteUnitApi] = useDeleteUnitByIdMutation();
  const [apiUnits, setApiUnits] = useState<Flot[]>([]);

  // Grouped Users API
  const currentBuildingId = building._id || building.id;
  const { data: groupedUsersRes, refetch: refetchGroupedUsers } =
    useGetUsersGroupedByFloorQuery(currentBuildingId, {
      skip: !currentBuildingId || activeTab !== "units",
    });
  const groupedUsersData = groupedUsersRes?.data || [];

  const fetchBuildingFloorsAndUnits = useCallback(async () => {
    const buildingId = building._id || building.id;

    try {
      const floorRes = await getFloorsApi({
        pagination: {
          pageSize: 100,
          currentPage: 1,
        },
        filter: buildingId ? { "building._id": buildingId } : null,
        select: {
          floorNo: 1,
          building: 1,
          isDelete: 1,
          createdAt: 1,
          updatedAt: 1,
        },
        sort: {
          floorNo: 1,
        },
      }).unwrap();

      if (floorRes?.data && Array.isArray(floorRes.data)) {
        setApiFloors(floorRes.data);
      }
    } catch (e) {
      console.error("Error fetching floors via API:", e);
    }

    try {
      const unitRes = await getUnitsApi({
        pagination: {
          pageSize: 100,
          currentPage: 1,
        },
        filter: buildingId ? { "building._id": buildingId } : null,
        select: {
          floor: 1,
          building: 1,
          unitNo: 1,
          baseFare: 1,
          utilityBill: 1,
          waterBill: 1,
          gasBill: 1,
          liftBill: 1,
          garageBill: 1,
          dueBill: 1,
          status: 1,
          isOccupied: 1,
          details: 1,
          isDelete: 1,
          createdAt: 1,
          updatedAt: 1,
        },
        sort: {
          unitNo: 1,
        },
      }).unwrap();

      if (unitRes?.data && Array.isArray(unitRes.data)) {
        setApiUnits(unitRes.data);
      }
    } catch (e) {
      console.error("Error fetching units via API:", e);
    }
  }, [building, getFloorsApi, getUnitsApi]);

  useEffect(() => {
    fetchBuildingFloorsAndUnits();
  }, [fetchBuildingFloorsAndUnits]);

  const handleOpenAssignTenantModal = (flot: Flot) => {
    setTargetFlotForTenant(flot);
    setIsAddTenantModalOpen(true);
  };

  const [checkoutTenantApi] = useCheckoutTenantMutation();

  const handleCheckoutTenantConfirm = (flot: Flot) => {
    const tenantName = flot.tenantName || flot.tenant?.name || "ভাড়াটিয়া";
    const unitId = flot.id || flot._id;

    if (flot.dueBill && flot.dueBill > 0) {
      Swal.fire({
        title: "বকেয়া বিল বিদ্যমান!",
        text: `ফ্ল্যাট ${flot.flatNo || flot.unitNo} এ ৳${flot.dueBill} বকেয়া আছে। চেক-আউট করতে প্রথমে বকেয়া বিল পরিশোধ করুন।`,
        icon: "error",
        confirmButtonColor: "#054a48",
        confirmButtonText: "ঠিক আছে",
      });
      return;
    }

    Swal.fire({
      title: "চেক-আউট নিশ্চিতকরণ",
      text: `ফ্ল্যাট ${flot.flatNo || flot.unitNo} থেকে "${tenantName}" কে খালি করতে চান?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#054a48",
      confirmButtonText: "হ্যাঁ, খালি করুন",
      cancelButtonText: "বাতিল",
    }).then(async (result) => {
      if (result.isConfirmed) {
        if (!unitId) {
          toast.error("ইউনিটের আইডি পাওয়া যায়নি");
          return;
        }

        try {
          const tenantId =
            flot.tenant?._id || flot.tenant?.id || (flot as any).tenantId;

          const res: any = await checkoutTenantApi({
            id: unitId,
            tenantId,
          }).unwrap();

          if (res?.success) {
            toast.success(
              `ফ্ল্যাট ${flot.flatNo || flot.unitNo} সফলভাবে খালি করা হয়েছে`,
            );
            if (onCheckoutTenant) {
              onCheckoutTenant(building.id || building._id, unitId);
            }
            fetchBuildingFloorsAndUnits();
            refetchGroupedUsers();
          } else {
            toast.error(res?.message || "চেক-আউট করতে সমস্যা হয়েছে");
          }
        } catch (err: any) {
          const errMsg =
            err?.data?.message || err?.message || "চেক-আউট করতে সমস্যা হয়েছে";
          Swal.fire({
            title: "চেক-আউট ব্যর্থ হয়েছে",
            text: Array.isArray(errMsg) ? errMsg.join(", ") : errMsg,
            icon: "error",
            confirmButtonColor: "#054a48",
            confirmButtonText: "ঠিক আছে",
          });
        }
      }
    });
  };

  const handleDeleteUnitConfirm = (unit: Flot) => {
    const unitName = unit.unitNo || unit.flatNo || unit.unitName || "ইউনিট";
    Swal.fire({
      title: "ইউনিট রিমুভ নিশ্চিতকরণ",
      text: `"${unitName}" মুছে ফেলতে চান?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#054a48",
      confirmButtonText: "হ্যাঁ, মুছে ফেলুন",
      cancelButtonText: "বাতিল",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const unitId = unit._id || unit.id;
          const res = await deleteUnitApi(unitId).unwrap();
          toast.success(
            res?.message || `ইউনিট ${unitName} সফলভাবে মুছে ফেলা হয়েছে!`,
          );
          fetchBuildingFloorsAndUnits();
        } catch (e: any) {
          console.error("Error deleting unit:", e);
          toast.error(e?.data?.message || "ইউনিট মুছে ফেলতে ব্যর্থ হয়েছে!");
        }
      }
    });
  };

  const handleDeleteMember = (member: any) => {
    Swal.fire({
      title: "মেম্বার রিমুভ নিশ্চিতকরণ",
      text: `"${member.name}" কে ম্যানেজমেন্ট তালিকা থেকে রিমুভ করতে চান?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#054a48",
      confirmButtonText: "হ্যাঁ, রিমুভ করুন",
      cancelButtonText: "বাতিল",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteManagement(member._id).unwrap();
          toast.success(`মেম্বার "${member.name}" রিমুভ করা হয়েছে`);
        } catch (e: any) {
          toast.error(e?.data?.message || "রিমুভ করতে ব্যর্থ হয়েছে!");
        }
      }
    });
  };

  // Derive Floors
  const buildingFloors: Floor[] = (
    apiFloors.length > 0 ? apiFloors : building.floors || []
  )
    .slice()
    .sort((a: any, b: any) => (a.floorNo || 0) - (b.floorNo || 0));

  const allFlots: Flot[] =
    apiUnits.length > 0 ? apiUnits : building.flots || [];

  const uniqueFloorNumbers = getUniqueFloorNumbers(buildingFloors, allFlots);

  const handleOpenAddUnit = (floorNo: number) => {
    if (buildingFloors.length === 0) {
      toast.error(
        "ইউনিট যোগ করার আগে প্রথমে একটি ফ্লোর যোগ করুন (Please add a floor first)!",
      );
      return;
    }
    setSelectedFloorForUnit(floorNo);
    setIsAddUnitModalOpen(true);
  };

  return (
    <div className="w-full space-y-6 pb-16">
      {/* 1. Header Profile Banner */}
      <div className="bg-white p-5 sm:p-7 rounded-3xl border border-gray-100 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="flex items-center gap-4">
          {building.photo ? (
            <img
              src={building.photo}
              alt={building.name}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-emerald-300 shadow-xs shrink-0"
            />
          ) : (
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-[#054a48] text-white font-extrabold flex items-center justify-center text-2xl border-2 border-emerald-200 shrink-0 shadow-xs">
              <Building2 size={32} />
            </div>
          )}

          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                BUILDING CODE • {building.code || building._id || building.id}
              </span>
              <Badge
                variant="outline"
                className={`text-xs font-bold px-2.5 py-0.5 ${
                  building.status === "ACTIVE" || building.status === "সক্রিয়"
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                    : "bg-red-50 text-red-700 border-red-200"
                }`}
              >
                • {building.status}
              </Badge>
            </div>

            <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight">
              {building.name}
            </h1>

            <div className="flex flex-wrap items-center gap-3 text-xs text-gray-600 font-medium mt-1">
              <span className="flex items-center gap-1 font-bold text-gray-800">
                <Home size={14} className="text-[#054a48]" />{" "}
                {building.address || "---"}
              </span>
              <span className="flex items-center gap-1 font-bold text-gray-800">
                <Phone size={13} className="text-[#054a48]" /> Phone:{" "}
                {building.phoneNo || "---"}
              </span>
              {building.emergencyContact && (
                <span className="flex items-center gap-1 font-bold text-amber-700">
                  <Shield size={13} /> Emergency: {building.emergencyContact}
                </span>
              )}
            </div>

            {/* Facilities Badges */}
            <div className="flex flex-wrap items-center gap-1.5 mt-2">
              {building.isParking && (
                <Badge
                  variant="outline"
                  className="bg-purple-50 text-purple-700 border-purple-200 text-[10px] font-bold"
                >
                  <Car size={11} className="mr-1" /> Parking
                </Badge>
              )}
              {building.isLift && (
                <Badge
                  variant="outline"
                  className="bg-blue-50 text-blue-700 border-blue-200 text-[10px] font-bold"
                >
                  Lift
                </Badge>
              )}
              {building.isGenerator && (
                <Badge
                  variant="outline"
                  className="bg-amber-50 text-amber-700 border-amber-200 text-[10px] font-bold"
                >
                  <Zap size={11} className="mr-1" /> Generator
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Action Header Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onBackToList}
            className="h-9 px-4 text-xs rounded-xl border-gray-200 text-gray-700 hover:bg-gray-100 font-bold cursor-pointer"
          >
            <ArrowLeft size={16} className="mr-1.5" /> ব্যাক (List)
          </Button>

          <Button
            size="sm"
            onClick={() => setIsAddFloorModalOpen(true)}
            className="bg-[#054a48] hover:bg-[#033433] text-white text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
          >
            <Plus size={15} /> + ফ্লোর যোগ করুন
          </Button>

          <Button
            size="sm"
            disabled={buildingFloors.length === 0}
            onClick={() => handleOpenAddUnit(buildingFloors[0]?.floorNo || 1)}
            className={`text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-xs flex items-center gap-1.5 ${
              buildingFloors.length === 0
                ? "bg-gray-200 text-gray-400 border border-gray-200 cursor-not-allowed"
                : "bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer"
            }`}
            title={
              buildingFloors.length === 0
                ? "ইউনিট যোগ করার আগে ফ্লোর যোগ করুন"
                : "নতুন ইউনিট যোগ করুন"
            }
          >
            <Plus size={15} /> + ইউনিট যোগ করুন
          </Button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white p-2 rounded-2xl border border-gray-100 shadow-xs flex flex-wrap items-center gap-2 text-xs font-bold">
        <button
          onClick={() => setActiveTab("flowchart")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all cursor-pointer ${
            activeTab === "flowchart"
              ? "bg-[#054a48] text-white shadow-md font-bold"
              : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 font-semibold"
          }`}
        >
          <GitBranch size={15} /> বিল্ডিং বিবরণ ও ম্যানেজমেন্ট (Building
          Overview)
        </button>

        <button
          onClick={() => {
            setActiveTab("units");
          }}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all cursor-pointer ${
            activeTab === "units"
              ? "bg-[#054a48] text-white shadow-md font-bold"
              : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 font-semibold"
          }`}
        >
          <DoorOpen size={15} /> সকল ইউনিট / ফ্ল্যাট ({allFlots.length})
        </button>
      </div>

      {/* TAB 1: MAIN BUILDING OVERVIEW TAB */}
      {activeTab === "flowchart" && (
        <BuildingOverviewTab
          building={building}
          buildingFloors={buildingFloors}
          allFlots={allFlots}
          buildingMembers={buildingMembers}
          isManagementLoading={isManagementLoading}
          onOpenAddMember={() => setIsAddMemberModalOpen(true)}
          onDeleteMember={handleDeleteMember}
        />
      )}

      {/* TAB 2: ALL UNITS GROUPED BY FLOOR */}
      {activeTab === "units" && (
        <UnitsTab
          uniqueFloorNumbers={uniqueFloorNumbers}
          buildingFloors={buildingFloors}
          getUnitsForFloor={(fNo, fId) => getUnitsForFloor(allFlots, fNo, fId)}
          groupedUsersData={groupedUsersData}
          onOpenAddFloor={() => setIsAddFloorModalOpen(false || true)}
          onOpenAddUnit={handleOpenAddUnit}
          onSelectFlot={(flot) => setSelectedFlot(flot)}
          onEditUnit={(flot) => setEditingUnit(flot)}
          onDeleteUnit={handleDeleteUnitConfirm}
          onCheckoutTenant={handleCheckoutTenantConfirm}
          onAssignTenant={handleOpenAssignTenantModal}
        />
      )}

      {/* Add Member Modal */}
      <AddMemberModal
        isOpen={isAddMemberModalOpen}
        building={{
          _id: building._id || building.id,
          name: building.name,
          address: building.address,
          phoneNo: building.phoneNo,
        }}
        onClose={() => setIsAddMemberModalOpen(false)}
      />

      {/* Add Floor Modal */}
      <AddFloorModal
        isOpen={isAddFloorModalOpen}
        building={{
          _id: building._id || building.id,
          name: building.name,
          address: building.address,
          phoneNo: building.phoneNo,
        }}
        existingFloorCount={buildingFloors.length}
        existingFloors={buildingFloors}
        onClose={() => setIsAddFloorModalOpen(false)}
        onSuccess={() => fetchBuildingFloorsAndUnits()}
      />

      {/* Add Unit Modal */}
      <AddUnitModal
        isOpen={isAddUnitModalOpen}
        buildingId={building.id || building._id}
        buildingName={building.name}
        buildingAddress={building.address}
        buildingPhone={building.phoneNo}
        floors={buildingFloors.map((f) => ({ _id: f._id, floorNo: f.floorNo }))}
        defaultFloorNo={selectedFloorForUnit}
        onClose={() => setIsAddUnitModalOpen(false)}
        onSave={(newUnit: any) => {
          fetchBuildingFloorsAndUnits();
          if (onAddFlot) {
            onAddFlot(building.id || building._id, newUnit);
          }
        }}
      />

      {/* Assign Tenant Modal */}
      {targetFlotForTenant && (
        <AddTenantModal
          isOpen={isAddTenantModalOpen}
          buildingId={building.id || building._id}
          flot={targetFlotForTenant}
          onClose={() => {
            setIsAddTenantModalOpen(false);
            setTargetFlotForTenant(null);
          }}
          onSuccess={() => {
            fetchBuildingFloorsAndUnits();
            refetchGroupedUsers();
          }}
          onSaveTenant={(_fId, tenantUser) => {
            if (onAssignTenant && targetFlotForTenant) {
              onAssignTenant(
                building.id || building._id,
                targetFlotForTenant.id || targetFlotForTenant._id || "",
                tenantUser,
              );
            }
            fetchBuildingFloorsAndUnits();
            refetchGroupedUsers();
          }}
        />
      )}

      {/* Flat Details Modal */}
      {selectedFlot && (
        <FlatDetailsModal
          flot={selectedFlot}
          onClose={() => setSelectedFlot(null)}
          onOpenAddTenant={() => handleOpenAssignTenantModal(selectedFlot)}
          onCheckoutTenant={() => handleCheckoutTenantConfirm(selectedFlot)}
          onEditUnit={(unitToEdit) => setEditingUnit(unitToEdit)}
          onDeleteUnit={(unitToDelete) => handleDeleteUnitConfirm(unitToDelete)}
        />
      )}

      {/* Edit Unit Modal */}
      {editingUnit && (
        <EditUnitModal
          isOpen={Boolean(editingUnit)}
          unit={editingUnit}
          buildingId={building.id || building._id}
          buildingName={building.name}
          buildingAddress={building.address}
          buildingPhone={building.phoneNo}
          floors={buildingFloors.map((f) => ({
            _id: f._id,
            floorNo: f.floorNo,
          }))}
          onClose={() => setEditingUnit(null)}
          onSaved={() => fetchBuildingFloorsAndUnits()}
        />
      )}
    </div>
  );
}
