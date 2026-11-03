import type { Building, Flot, Floor } from "../../dashboard/Building/types";

export interface BuildingDetailsViewProps {
  building: Building;
  onBackToList: () => void;
  onEditBuilding: (building: Building) => void;
  onAddFlot?: (buildingId: string, newFlot: Flot) => void;
  onAssignTenant?: (
    buildingId: string,
    flotId: string,
    tenantData: any,
  ) => void;
  onCheckoutTenant?: (buildingId: string, flotId: string) => void;
}

export interface BuildingOverviewTabProps {
  building: Building;
  buildingFloors: Floor[];
  allFlots: Flot[];
  buildingMembers: any[];
  isManagementLoading: boolean;
  onOpenAddMember: () => void;
  onDeleteMember: (member: any) => void;
}

export interface UnitsTabProps {
  uniqueFloorNumbers: number[];
  buildingFloors: Floor[];
  getUnitsForFloor: (floorNo: number, floorId?: string) => Flot[];
  groupedUsersData: any[];
  onOpenAddFloor: () => void;
  onOpenAddUnit: (floorNo: number) => void;
  onSelectFlot: (flot: Flot) => void;
  onEditUnit: (flot: Flot) => void;
  onDeleteUnit: (flot: Flot) => void;
  onCheckoutTenant: (flot: Flot) => void;
  onAssignTenant: (flot: Flot) => void;
}
