export interface BuildingInfo {
  _id: string;
  name: string;
  address?: string;
  phoneNo?: string;
}

export interface FloorInfo {
  _id?: string;
  floorNo: number;
  building?: BuildingInfo;
}

export interface Flot {
  _id?: string;
  id: string;
  buildingId: string;
  building?: BuildingInfo;
  floor?: FloorInfo;
  unitNo: string;
  flatNo: string;
  flotNo?: number | string;
  renatalId?: string;
  advanced?: number;
  floorNumber: number;
  floorNo?: number;
  baseFare: number;
  baseRent?: number;
  utilityBill: number;
  waterBill: number;
  waterFee?: number;
  gasBill: number;
  gasFee?: number;
  wastageFee?: number;
  serviceFee?: number;
  liftBill: number;
  liftFee?: number;
  garageBill: number;
  parkingFee?: number;
  dueBill: number;
  dueAmount?: number;
  totalAmount: number;
  rentCollected?: number;
  advancePaid?: number;
  currentElectricityMeter?: number;
  previousElectricityMeter?: number;
  electricityBill?: number;
  electricityUnitRate?: number;
  status: "active" | "inactive" | "ACTIVE" | "INACTIVE" | "খালি" | "ভাড়া দেওয়া" | "মেরামত চলছে";
  isAccupied: boolean;
  isOccupied?: boolean;
  details?: string;
  unitName?: string;
  tenantName?: string;
  tenantPhone?: string;
  tenant?: any;
  remarks?: string;
  previousTenants?: Array<{
    tenantName?: string;
    tenantPhone?: string;
    tenant?: any;
    moveInDate?: string;
    moveOutDate?: string;
  }>;
}

export interface Floor {
  _id: string;
  floorNo: number;
  building: BuildingInfo;
  units?: Flot[];
}

export interface FloorConfig {
  floorNumber: number;
  unitCount: number;
}

export interface ManagementMember {
  id: string;
  name: string;
  role: "কেয়ারটেকার / ম্যানেজার" | "সিকিউরিটি গার্ড" | "সুপারভাইজার" | "ক্লিনার";
  phone: string;
  joiningDate?: string;
  salary?: string;
  nid?: string;
  photoUrl?: string;
}

export interface BuildingFacilities {
  hasParking?: boolean;
  parkingSpaces?: number;
  liftCount?: number;
  liftBrand?: string;
  hasGenerator?: boolean;
  generatorCapacity?: string;
  gateType?: string;
  guardCount?: number;
  hasCctv?: boolean;
}

export interface Building {
  _id: string;
  id: string;
  code?: string;
  name: string;
  address: string;
  totalUnit: number;
  totalUnits: number;
  occupiedUnits: number;
  vacantUnits: number;
  totalFloors?: number;
  unitsPerFloor?: number;
  isParking: boolean;
  isLift: boolean;
  isGenerator: boolean;
  emergencyContact: string;
  phoneNo: string;
  status: "ACTIVE" | "BLOCKED" | "সক্রিয়" | "নিষ্ক্রিয়";
  photo?: string;
  isDelete: boolean;
  floors?: Floor[];
  flots: Flot[];
  buildingType?: "আবাসিক" | "বাণিজ্যিক" | "মিক্সড";
  complexCode?: string;
  floorConfigs?: FloorConfig[];
  facilities?: BuildingFacilities;
  googleMapLink?: string;
  management?: ManagementMember[];
  createdAt?: string;
}

// Helper generator for realistic initial mock floors & units
const createMockFloorsAndFlots = (
  buildingId: string,
  buildingName: string,
  buildingAddress: string,
  buildingPhone: string,
  totalFloorsCount: number = 3
): { floors: Floor[]; flots: Flot[] } => {
  const floors: Floor[] = [];
  const flots: Flot[] = [];

  const buildingObj: BuildingInfo = {
    _id: buildingId,
    name: buildingName,
    address: buildingAddress,
    phoneNo: buildingPhone,
  };

  const sampleTenants = [
    { name: "মোহাম্মদ রফিকুল ইসলাম", phone: "01711223344" },
    { name: "আব্দুল হান্নান", phone: "01819887766" },
    { name: "মাহমুদা পারভীন", phone: "01912345678" },
    { name: "তানজিল আহমেদ", phone: "01552334455" },
    { name: "নুরুল হক", phone: "01678990011" },
  ];

  let sampleIdx = 0;

  for (let f = 1; f <= totalFloorsCount; f++) {
    const floorId = `flr_${buildingId}_${f}`;
    const floorObj: FloorInfo = {
      _id: floorId,
      floorNo: f,
      building: buildingObj,
    };

    const floorFlots: Flot[] = [];
    const unitPerFloor = f === 1 ? 3 : f === 2 ? 4 : 3;

    for (let u = 1; u <= unitPerFloor; u++) {
      const unitNo = `${f}0${u}`;
      const isOcc = f <= 2 && u <= 2;
      const tenant = isOcc ? sampleTenants[sampleIdx % sampleTenants.length] : undefined;
      if (isOcc) sampleIdx++;

      const baseFare = 8000 + f * 500;
      const utilityBill = 500;
      const waterBill = 1000;
      const gasBill = 1080;
      const liftBill = 500;
      const garageBill = u === 1 ? 500 : 0;
      const dueBill = isOcc && u === 2 ? 2000 : 0;
      const totalAmount = baseFare + utilityBill + waterBill + gasBill + liftBill + garageBill + dueBill;

      const unit: Flot = {
        _id: `unt_${buildingId}_${f}_${u}`,
        id: `${buildingId}-FL-${f}-${unitNo}`,
        buildingId,
        building: buildingObj,
        floor: floorObj,
        unitNo: `${unitNo}`,
        flatNo: `${unitNo}`,
        unitName: `ফ্ল্যাট ${unitNo}`,
        floorNumber: f,
        floorNo: f,
        baseFare,
        baseRent: baseFare,
        utilityBill,
        waterBill,
        waterFee: waterBill,
        gasBill,
        gasFee: gasBill,
        liftBill,
        liftFee: liftBill,
        garageBill,
        parkingFee: garageBill,
        dueBill,
        dueAmount: dueBill,
        totalAmount,
        status: isOcc ? "ভাড়া দেওয়া" : "খালি",
        isAccupied: isOcc,
        isOccupied: isOcc,
        tenantName: tenant?.name,
        tenantPhone: tenant?.phone,
        details: `${f}ম তলার ইউনিট ${unitNo}`,
        remarks: isOcc ? "ভাড়া দেওয়া" : "খালি",
      };

      flots.push(unit);
      floorFlots.push(unit);
    }

    floors.push({
      _id: floorId,
      floorNo: f,
      building: buildingObj,
      units: floorFlots,
    });
  }

  return { floors, flots };
};

export const initialBuildingList: Building[] = [
  {
    _id: "bld_1",
    id: "1",
    code: "BLD-101",
    name: "পাপুয়া টাওয়ার-৩ (Papua Tower-3)",
    address: "মাওনা চৌরাস্তা, শ্রীপুর, গাজীপুর",
    phoneNo: "01711122233",
    emergencyContact: "সেলিম রেজা (01687523864)",
    totalUnit: 10,
    totalUnits: 10,
    totalFloors: 3,
    unitsPerFloor: 3,
    occupiedUnits: 4,
    vacantUnits: 6,
    isParking: true,
    isLift: true,
    isGenerator: true,
    status: "ACTIVE",
    photo: "",
    isDelete: false,
    buildingType: "আবাসিক",
    complexCode: "CMP-MAW-01",
    facilities: {
      hasParking: true,
      parkingSpaces: 10,
      liftCount: 2,
      liftBrand: "Sigma Lift",
      hasGenerator: true,
      generatorCapacity: "100 KVA Diesel Backup",
      guardCount: 3,
      hasCctv: true,
    },
    management: [
      {
        id: "M-1",
        name: "সেলিম রেজা",
        role: "কেয়ারটেকার / ম্যানেজার",
        phone: "01687523864",
        joiningDate: "2022-05-10",
        salary: "25000",
      },
    ],
    createdAt: "2024-01-10",
    floors: [],
    flots: [],
  },
  {
    _id: "bld_2",
    id: "2",
    code: "BLD-102",
    name: "সোনার বাংলা কমপ্লেক্স",
    address: "সেক্টর ৪, উত্তরা, ঢাকা - ১২ ৩০",
    phoneNo: "01822334455",
    emergencyContact: "কবীর হোসেন (01782000000)",
    totalUnit: 8,
    totalUnits: 8,
    totalFloors: 3,
    unitsPerFloor: 3,
    occupiedUnits: 3,
    vacantUnits: 5,
    isParking: true,
    isLift: true,
    isGenerator: false,
    status: "ACTIVE",
    photo: "",
    isDelete: false,
    buildingType: "মিক্সড",
    complexCode: "CMP-UTT-02",
    facilities: {
      hasParking: true,
      parkingSpaces: 8,
      liftCount: 1,
      hasGenerator: false,
      guardCount: 2,
      hasCctv: true,
    },
    management: [],
    createdAt: "2024-02-01",
    floors: [],
    flots: [],
  },
];

// Populate initial mock building floors & flots
initialBuildingList.forEach((bld) => {
  const { floors, flots } = createMockFloorsAndFlots(
    bld._id || bld.id,
    bld.name,
    bld.address,
    bld.phoneNo,
    3
  );
  bld.floors = floors;
  bld.flots = flots;
  bld.totalUnit = flots.length;
  bld.totalUnits = flots.length;
});
