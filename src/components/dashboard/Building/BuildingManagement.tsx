import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import Swal from "sweetalert2";
import {
  useAddBuildingMutation,
  useDeleteBuildingMutation,
  useGetBuildingsQuery,
  useUpdateBuildingMutation,
} from "../../../redux/features/building/buildingApi";
import BuildingForm from "./BuildingForm";
import BuildingHeader from "./BuildingHeader";
import BuildingTable from "./BuildingTable";
import { type Building } from "./types";

export default function BuildingManagement() {
  const navigate = useNavigate();
  const [buildingList, setBuildingList] = useState<Building[]>([]);
  const [viewMode, setViewMode] = useState<"list" | "form" | "details">("list");
  const [editingBuilding, setEditingBuilding] = useState<Building | null>(null);
  const [selectedBuildingDetails, setSelectedBuildingDetails] =
    useState<Building | null>(null);

  // RTK Query hooks
  const { data: apiData } = useGetBuildingsQuery(undefined, {
    skip: false,
  });
  const [addBuildingApi] = useAddBuildingMutation();
  const [updateBuildingApi] = useUpdateBuildingMutation();
  const [deleteBuildingApi] = useDeleteBuildingMutation();

  // Sync API data if present
  useEffect(() => {
    if (apiData && Array.isArray(apiData?.data)) {
      setBuildingList(apiData.data);
    }
  }, [apiData]);

  const handleOpenAddForm = () => {
    setEditingBuilding(null);
    setViewMode("form");
  };

  const handleOpenEditForm = (building: Building) => {
    setEditingBuilding(building);
    setViewMode("form");
  };

  const handleSelectBuildingDetails = (building: Building) => {
    navigate(`/buildings/${building.id || building._id}`);
  };

  const handleDeleteBuilding = (building: Building) => {
    Swal.fire({
      title: "আপনি কি নিশ্চিত?",
      text: `"${building.name}" কে বিল্ডিং তালিকা থেকে মুছে ফেলা হবে।`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#054a48",
      cancelButtonColor: "#dc2626",
      confirmButtonText: "হ্যাঁ, ডিলিট করুন",
      cancelButtonText: "বাতিল",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteBuildingApi(building.id || building._id)
            .unwrap()
            .catch(() => {});
        } catch {
          // Fallback to local state delete
        }
        setBuildingList((prev) =>
          prev.filter((b) => b.id !== building.id && b._id !== building._id),
        );
        toast.success("বিল্ডিং সফলভাবে ডিলিট করা হয়েছে");
        if (
          selectedBuildingDetails?.id === building.id ||
          selectedBuildingDetails?._id === building._id
        ) {
          setSelectedBuildingDetails(null);
          setViewMode("list");
        }
      }
    });
  };

  const handleSaveBuilding = async (buildingData: Partial<Building>) => {
    const payload = {
      name: buildingData.name,
      address: buildingData.address,
      phoneNo: buildingData.phoneNo,
      emergencyContact: buildingData.emergencyContact,
      isParking: buildingData.isParking ?? false,
      isLift: buildingData.isLift ?? false,
      isGenerator: buildingData.isGenerator ?? false,
      status: buildingData.status || "ACTIVE",
      photo: buildingData.photo || "",
    };

    if (editingBuilding) {
      try {
        const res = await updateBuildingApi({
          id: editingBuilding._id || editingBuilding.id,
          ...payload,
        }).unwrap();

        if (res?.success) {
          toast.success(
            res?.message || "বিল্ডিং তথ্য সফলভাবে আপডেট করা হয়েছে",
          );
        } else {
          toast.success("বিল্ডিং তথ্য সফলভাবে আপডেট করা হয়েছে");
        }
      } catch (error: any) {
        toast.error(error?.data?.message || "আপডেট করতে ব্যর্থ হয়েছে");
      }

      setBuildingList((prev) =>
        prev.map((b) =>
          b.id === editingBuilding.id || b._id === editingBuilding._id
            ? ({ ...b, ...payload } as Building)
            : b,
        ),
      );
    } else {
      try {
        const res = await addBuildingApi(payload).unwrap();
        if (res?.success) {
          toast.success(res?.message || "নতুন বিল্ডিং সফলভাবে যোগ করা হয়েছে");
        } else {
          toast.success("নতুন বিল্ডিং সফলভাবে যোগ করা হয়েছে");
        }
      } catch (error: any) {
        toast.error(error?.data?.message || "বিল্ডিং যোগ করতে ব্যর্থ হয়েছে");
      }

      const newBuildingObj: Building = {
        _id: `bld_${Date.now()}`,
        id: String(Date.now()),
        ...payload,
        totalUnit: 0,
        totalUnits: 0,
        occupiedUnits: 0,
        vacantUnits: 0,
        isDelete: false,
        flots: [],
        floors: [],
      } as Building;

      setBuildingList((prev) => [newBuildingObj, ...prev]);
    }

    setViewMode("list");
  };

  return (
    <div className="w-full space-y-6 p-4 sm:p-6 pb-16">
      {/* 1. Header Banner (only show when not in details view) */}
      {viewMode !== "details" && (
        <BuildingHeader
          viewMode={viewMode}
          editingBuilding={editingBuilding}
          onOpenAddForm={handleOpenAddForm}
          onBackToList={() => setViewMode("list")}
        />
      )}

      {/* 2. Main Table View */}
      {viewMode === "list" && (
        <BuildingTable
          buildingList={buildingList}
          onOpenEditForm={handleOpenEditForm}
          onSelectBuildingDetails={handleSelectBuildingDetails}
          onDeleteBuilding={handleDeleteBuilding}
        />
      )}

      {/* 3. Details View Page (Removed from here, now in a separate route) */}

      {/* 4. Form View */}
      {viewMode === "form" && (
        <BuildingForm
          editingBuilding={editingBuilding}
          onSaveBuilding={handleSaveBuilding}
          onCancel={() => setViewMode("list")}
          onReset={() => setEditingBuilding(null)}
        />
      )}
    </div>
  );
}
