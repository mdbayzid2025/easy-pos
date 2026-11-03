import { useMemo, useState } from "react";
import {
  Search,
  Eye,
  Edit,
  Trash2,
  Building2,
  MapPin,
  ChevronLeft,
  ChevronRight,
  Phone,
  Car,
  Zap,
  Shield,
  Layers,
  Loader2,
} from "lucide-react";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Badge } from "../../ui/badge";
import type { Building } from "./types";
import { useGetBuildingsQuery } from "../../../redux/features/building/buildingApi";

interface BuildingTableProps {
  buildingList: Building[];
  onOpenEditForm: (building: Building) => void;
  onSelectBuildingDetails: (building: Building) => void;
  onDeleteBuilding: (building: Building) => void;
}

export default function BuildingTable({
  buildingList,
  onOpenEditForm,
  onSelectBuildingDetails,
  onDeleteBuilding,
}: BuildingTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Construct expected payload for POST /building/get-all
  const queryPayload = useMemo(() => ({
    pagination: {
      pageSize,
      currentPage,
    },
    filter: statusFilter !== "ALL" || searchTerm ? {
      ...(statusFilter !== "ALL" ? { status: statusFilter } : {}),
      ...(searchTerm ? { search: searchTerm } : {}),
    } : null,
    select: {
      name: 1,
      address: 1,
      totalUnit: 1,
      isParking: 1,
      isLift: 1,
      isGenerator: 1,
      emergencyContact: 1,
      phoneNo: 1,
      status: 1,
      photo: 1,
      isDelete: 1,
      createdAt: 1,
      updatedAt: 1,
    },
    sort: {
      createdAt: -1,
    },
  }), [pageSize, currentPage, statusFilter, searchTerm]);

  const { data: apiData, isLoading, isFetching } = useGetBuildingsQuery(queryPayload);

  // Extract list safely from API response
  const buildingsFromApi = useMemo(() => {
    if (!apiData) return null;
    if (Array.isArray(apiData)) return apiData;
    if (Array.isArray(apiData?.data)) return apiData.data;
    if (Array.isArray(apiData?.data?.result)) return apiData.data.result;
    if (Array.isArray(apiData?.data?.data)) return apiData.data.data;
    if (Array.isArray(apiData?.result)) return apiData.result;
    return [];
  }, [apiData]);

  // Use API data if returned, fallback to buildingList prop
  const currentBuildingsList = buildingsFromApi !== null ? buildingsFromApi : buildingList;

  // Search and Filter Logic fallback
  const filteredBuildings = useMemo(() => {
    return currentBuildingsList.filter((b: Building) => {
      const phone = b.phoneNo || "";
      const emerg = b.emergencyContact || "";
      const bName = b.name || "";
      const addr = b.address || "";

      const matchesSearch =
        !searchTerm ||
        bName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        phone.includes(searchTerm) ||
        emerg.toLowerCase().includes(searchTerm.toLowerCase()) ||
        addr.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "ALL"
          ? true
          : b.status === statusFilter ||
            (statusFilter === "ACTIVE" && (b.status === "ACTIVE" || b.status === "সক্রিয়")) ||
            (statusFilter === "BLOCKED" && (b.status === "BLOCKED" || b.status === "নিষ্ক্রিয়"));

      return matchesSearch && matchesStatus;
    });
  }, [currentBuildingsList, searchTerm, statusFilter]);

  const totalCount = apiData?.pagination?.total || apiData?.totalCount || apiData?.data?.total || filteredBuildings.length;
  const totalPages = apiData?.pagination?.totalPages || Math.ceil(totalCount / pageSize) || 1;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden space-y-4">
      {/* Top Search & Filter Bar */}
      <div className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 bg-gray-50/50">
        <div className="relative flex-1 max-w-md">
          <Search
            size={18}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <Input
            type="text"
            placeholder="Search by building name, phone, emergency contact, address..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="pl-10 pr-4 py-2.5 rounded-xl border-gray-200 text-xs bg-white shadow-2xs"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3 py-2 rounded-xl border border-gray-200 text-xs font-semibold text-gray-700 bg-white shadow-2xs focus:outline-none"
          >
            <option value="ALL">সকল স্ট্যাটাস (All Status)</option>
            <option value="ACTIVE">ACTIVE / সক্রিয়</option>
            <option value="BLOCKED">BLOCKED / নিষ্ক্রিয়</option>
          </select>

          {/* Page Size Selector */}
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="px-3 py-2 rounded-xl border border-gray-200 text-xs font-semibold text-gray-700 bg-white shadow-2xs focus:outline-none"
          >
            <option value={10}>১০টি / পৃষ্ঠা</option>
            <option value={25}>২৫টি / পৃষ্ঠা</option>
            <option value={50}>৫০টি / পৃষ্ঠা</option>
          </select>
        </div>
      </div>

      {/* Directory Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100/70 border-y border-gray-100 text-gray-600 text-xs font-bold uppercase tracking-wider">
              <th className="py-3.5 px-4 sm:px-6">ভবনের ছবি ও নাম (Building)</th>
              <th className="py-3.5 px-4 sm:px-6">যোগাযোগ (Phone & Emergency)</th>
              <th className="py-3.5 px-4 sm:px-6">ঠিকানা (Address)</th>
              <th className="py-3.5 px-4 sm:px-6">মোট ইউনিট (totalUnit)</th>
              <th className="py-3.5 px-4 sm:px-6">বিল্ডিং সুবিধা (Facilities)</th>
              <th className="py-3.5 px-4 sm:px-6">স্ট্যাটাস (Status)</th>
              <th className="py-3.5 px-4 sm:px-6 text-right">অ্যাকশন</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-xs sm:text-sm">
            {isLoading || isFetching ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-gray-500">
                  <div className="flex flex-col items-center justify-center space-y-2 py-8">
                    <Loader2 className="w-8 h-8 animate-spin text-[#054a48]" />
                    <p className="text-sm font-medium">বিল্ডিং তথ্য লোড হচ্ছে...</p>
                  </div>
                </td>
              </tr>
            ) : filteredBuildings.length > 0 ? (
              filteredBuildings.map((building: Building) => {
                const isActive = building.status === "ACTIVE" || building.status === "সক্রিয়";
                const totalUnitsCount = building.totalUnit ?? building.totalUnits ?? building.flots?.length ?? 0;

                return (
                  <tr
                    key={building._id || building.id}
                    className="hover:bg-emerald-50/30 transition-colors duration-150 group"
                  >
                    {/* Building Photo & Name */}
                    <td className="py-4 px-4 sm:px-6 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        {building.photo ? (
                          <img
                            src={building.photo}
                            alt={building.name}
                            className="w-10 h-10 rounded-xl object-cover border border-emerald-300 shadow-2xs shrink-0"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-xl bg-[#054a48] text-white font-extrabold flex items-center justify-center text-xs border border-emerald-200 shrink-0 shadow-2xs">
                            <Building2 size={20} />
                          </div>
                        )}
                        <div>
                          <div className="font-bold text-gray-900 group-hover:text-[#054a48] transition-colors">
                            {building.name}
                          </div>
                          {building.createdAt && (
                            <span className="text-[11px] font-semibold text-gray-400">
                              {new Date(building.createdAt).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Phone & Emergency Contact */}
                    <td className="py-4 px-4 sm:px-6 whitespace-nowrap font-medium text-gray-700">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 font-bold text-gray-900">
                          <Phone size={13} className="text-[#054a48]" />
                          <span>{building.phoneNo || "---"}</span>
                        </div>
                        {building.emergencyContact && (
                          <div className="flex items-center gap-1 text-[11px] text-gray-500">
                            <Shield size={12} className="text-amber-600" />
                            <span>{building.emergencyContact}</span>
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Address */}
                    <td className="py-4 px-4 sm:px-6 max-w-xs">
                      <div className="flex items-start gap-1.5 text-xs text-gray-600">
                        <MapPin
                          size={14}
                          className="text-emerald-600 shrink-0 mt-0.5"
                        />
                        <span className="line-clamp-2">{building.address || "---"}</span>
                      </div>
                    </td>

                    {/* Total Units */}
                    <td className="py-4 px-4 sm:px-6 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-[#054a48] font-extrabold px-3 py-1 rounded-xl border border-emerald-200 text-xs shadow-2xs">
                        <Layers size={13} /> {totalUnitsCount} Units
                      </span>
                    </td>

                    {/* Facilities Badges */}
                    <td className="py-4 px-4 sm:px-6 whitespace-nowrap">
                      <div className="flex flex-wrap items-center gap-1">
                        {building.isParking && (
                          <Badge
                            variant="outline"
                            className="bg-purple-50 text-purple-700 border-purple-200 text-[10px] font-bold px-2 py-0.5 flex items-center gap-1"
                          >
                            <Car size={11} /> Parking
                          </Badge>
                        )}
                        {building.isLift && (
                          <Badge
                            variant="outline"
                            className="bg-blue-50 text-blue-700 border-blue-200 text-[10px] font-bold px-2 py-0.5"
                          >
                            Lift
                          </Badge>
                        )}
                        {building.isGenerator && (
                          <Badge
                            variant="outline"
                            className="bg-amber-50 text-amber-700 border-amber-200 text-[10px] font-bold px-2 py-0.5 flex items-center gap-1"
                          >
                            <Zap size={11} /> Generator
                          </Badge>
                        )}
                        {!building.isParking && !building.isLift && !building.isGenerator && (
                          <span className="text-gray-400 text-[11px]">Standard</span>
                        )}
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-4 px-4 sm:px-6 whitespace-nowrap">
                      <div className="flex flex-col gap-1">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                            isActive
                              ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                              : "bg-red-100 text-red-800 border border-red-200"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              isActive ? "bg-emerald-600" : "bg-red-600"
                            }`}
                          ></span>
                          {building.status || "ACTIVE"}
                        </span>
                        {building.isDelete && (
                          <Badge variant="destructive" className="text-[9px] px-1.5 py-0">
                            Deleted
                          </Badge>
                        )}
                      </div>
                    </td>

                    {/* Action Buttons */}
                    <td className="py-4 px-4 sm:px-6 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => onSelectBuildingDetails(building)}
                          title="বিস্তারিত দেখুন"
                          className="h-8 w-8 p-0 rounded-lg text-[#054a48] hover:bg-emerald-50 cursor-pointer"
                        >
                          <Eye size={16} />
                        </Button>

                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => onOpenEditForm(building)}
                          title="সম্পাদনা (Edit)"
                          className="h-8 w-8 p-0 rounded-lg text-blue-600 hover:bg-blue-50 cursor-pointer"
                        >
                          <Edit size={16} />
                        </Button>

                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => onDeleteBuilding(building)}
                          title="মুছে ফেলুন"
                          className="h-8 w-8 p-0 rounded-lg text-red-600 hover:bg-red-50 cursor-pointer"
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan={7}
                  className="py-12 text-center text-gray-500 space-y-2"
                >
                  <Building2 size={44} className="mx-auto text-gray-300" />
                  <p className="font-semibold text-lg text-gray-700">No data found</p>
                  <p className="text-xs text-gray-400">
                    কোন ভবন বা বিল্ডিং পাওয়া যায়নি (No building records match your request).
                  </p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="p-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
        <div>
          দেখানো হচ্ছে{" "}
          <span className="font-bold text-gray-800">
            {filteredBuildings.length > 0 ? (currentPage - 1) * pageSize + 1 : 0}
          </span>{" "}
          থেকে{" "}
          <span className="font-bold text-gray-800">
            {Math.min(currentPage * pageSize, totalCount)}
          </span>{" "}
          (সর্বমোট{" "}
          <span className="font-bold text-gray-800">
            {totalCount}
          </span>{" "}
          টি রেকর্ডের মধ্যে)
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage <= 1 || isLoading || isFetching}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            className="h-8 px-2.5 rounded-lg text-xs"
          >
            <ChevronLeft size={14} className="mr-1" /> পূর্ববর্তী
          </Button>
          <span className="px-3 py-1 font-bold text-gray-800 bg-gray-100 rounded-lg">
            {currentPage} / {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage >= totalPages || isLoading || isFetching}
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            className="h-8 px-2.5 rounded-lg text-xs"
          >
            পরবর্তী <ChevronRight size={14} className="ml-1" />
          </Button>
        </div>
      </div>
    </div>
  );
}
