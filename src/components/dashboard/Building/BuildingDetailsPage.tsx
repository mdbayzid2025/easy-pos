import { Loader2 } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useGetBuildingByIdQuery } from "../../../redux/features/building/buildingApi";

import type { Building } from "./types";
import BuildingDetailsView from "./BuildingDetailsView";

export default function BuildingDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: buildingData, isLoading } = useGetBuildingByIdQuery(id);

  const handleBackToList = () => {
    navigate("/buildings");
  };

  const handleEditBuilding = (b: Building) => {
    console.log("Edit requested for", b);
  };

  if (isLoading && !(buildingData as any)?.data) {
    return (
      <div className="w-full h-[60vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-10 h-10 animate-spin text-[#054a48]" />
        <p className="text-gray-500 font-medium">বিল্ডিং তথ্য লোড হচ্ছে...</p>
      </div>
    );
  }

  if (!buildingData?.data) {
    return (
      <div className="w-full h-[60vh] flex flex-col items-center justify-center space-y-4">
        <p className="text-red-500 font-medium text-lg">
          বিল্ডিং পাওয়া যায়নি (Building not found)
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
      <BuildingDetailsView
        building={buildingData?.data}
        onBackToList={handleBackToList}
        onEditBuilding={handleEditBuilding}
      />
    </div>
  );
}
