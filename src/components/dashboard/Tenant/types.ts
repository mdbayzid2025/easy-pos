export interface BuildingInfo {
  _id: string;
  name: string;
  address?: string;
  phoneNo?: string;
}

export interface FloorInfo {
  _id?: string;
  floorNo: string | number;
}

export interface UnitInfo {
  _id?: string;
  floorNo?: string | number;
  flotNo: string;
}

export interface FamilyMember {
  _id?: string;
  id?: string;
  name: string;
  age: number | string;
  occupation: string;
  relation: string;
  phoneNo: string;
  mobile?: string; // Backward compatibility alias
}

export interface EmergencyContact {
  name: string;
  phoneNo: string;
  address: string;
  relation: string;
  mobile?: string; // Backward compatibility alias
}

export interface MonthlyCharges {
  baseFare: number;
  utilityBill: number;
  waterBill: number;
  gasBill: number;
  wastageBill: number;
  welfareBill: number;
  securityBill: number;
  monthlyTotal: number;
}

export interface FinancialSummary {
  monthlyPayable: number;
  totalBill: number;
  totalPaid: number;
  balance: number;
}

export interface Tenant {
  _id: string;
  id: string; // e.g. "#527"
  name: string;
  building: BuildingInfo;
  floor: FloorInfo;
  unit: UnitInfo;
  phoneNo: string;
  phone?: string; // Alias
  email: string;
  fatherName?: string;
  motherName?: string;
  nidNo?: string;
  maritalStatus?: string;
  emergencyContact: EmergencyContact;
  familyMembers: FamilyMember[];
  permanentAddress: string;
  password?: string;
  hasAccess: boolean;
  hasUserAccess?: boolean; // Alias
  profileImg?: string;
  documents?: string; // PDF / document link
  profileType?: "ভাড়াটিয়া" | "মালিক";
  status: "সক্রিয়" | "নিষ্ক্রিয়";
  buildingName?: string; // Alias
  unitName?: string; // Alias
  passportNo?: string;
  dob?: string;
  officeAddress?: string;
  religion?: string;
  education?: string;
  monthlyCharges?: MonthlyCharges;
  financialSummary?: FinancialSummary;
  joinedDate?: string;
}

export const initialTenants: Tenant[] = [];
