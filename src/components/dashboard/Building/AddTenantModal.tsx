import { User, X } from "lucide-react";
import TenantRegister from "../Tenant/TenantRegister";
import type { Tenant } from "../Tenant/types";
import type { Building, Flot } from "./types";

export interface EmergencyContact {
  name: string;
  relation: string;
  address: string;
  mobile: string;
  phoneNo?: string;
}

export interface FamilyMember {
  id?: string;
  _id?: string;
  name: string;
  age: number;
  occupation: string;
  relation: string;
  mobile: string;
  phoneNo?: string;
}

export interface TenantUser {
  _id: string;
  name: string;
  phone?: string;
  phoneNo?: string;
  altPhone?: string;
  email: string;
  fatherName?: string;
  motherName?: string;
  nidNo?: string;
  maritalStatus?: string;
  emergencyContact?: EmergencyContact;
  familyMembers?: FamilyMember[];
  permanentAddress?: string;
  password?: string;
  status: "ACTIVE" | "BLOCKED";
  photo?: string;
  documents?: string;
  isDelete?: boolean;
  buildingId?: string;
  buildingName?: string;
  flotId?: string;
  unitName?: string;
  hasAccess?: boolean;
}

interface AddTenantModalProps {
  isOpen: boolean;
  buildingId?: string;
  flot?: Flot | null;
  buildingList?: Building[];
  onClose: () => void;
  onSaveTenant?: (
    flotId: string,
    tenantData: any,
    targetBuildingId?: string,
  ) => void;
  onSuccess?: () => void;
}

export default function AddTenantModal({
  isOpen,
  buildingId,
  flot,
  buildingList,
  onClose,
  onSaveTenant,
  onSuccess,
}: AddTenantModalProps) {
  if (!isOpen) return null;

  const targetFloorNo =
    flot?.floorNumber ||
    flot?.floorNo ||
    (typeof flot?.floor === "object"
      ? (flot?.floor as any)?.floorNo
      : flot?.floor) ||
    "";
  const targetUnitNo = flot?.unitNo || flot?.flatNo || flot?.flotNo || "";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl max-w-5xl w-full p-4 sm:p-6 space-y-4 my-6 max-h-[92vh] overflow-y-auto border border-gray-100 relative">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 bg-[#054a48] text-white rounded-2xl shadow-sm">
              <User size={20} />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-gray-900">
                নতুন ভাড়াটিয়া যোগ করুন (Add New Tenant)
              </h3>
              <p className="text-xs text-gray-500 font-semibold mt-0.5">
                {flot || buildingId
                  ? `ইউনিট ${targetUnitNo ? targetUnitNo : ""} (ফ্লোর ${targetFloorNo}) এ ভাড়াটিয়া সাবমিশন`
                  : "সব প্রপার্টি থেকে ভাড়াটিয়া নিবন্ধনের ফরম"}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Embedded Full TenantRegister Form */}
        <TenantRegister
          editingTenant={null}
          initialBuildingId={buildingId || flot?.buildingId}
          initialFloorNo={targetFloorNo}
          initialUnitNo={targetUnitNo ? String(targetUnitNo) : undefined}
          initialUnitId={flot?._id || flot?.id}
          buildingList={buildingList}
          isModalMode={true}
          onBackToList={onClose}
          onSaveTenant={(tenantData: Tenant) => {
            if (onSaveTenant) {
              const targetFlotId = flot?._id || flot?.id || "";
              const targetBldId = buildingId || flot?.buildingId;
              onSaveTenant(targetFlotId, tenantData, targetBldId);
            }
          }}
          onSuccess={() => {
            if (onSuccess) onSuccess();
            onClose();
          }}
        />
      </div>
    </div>
  );
}
