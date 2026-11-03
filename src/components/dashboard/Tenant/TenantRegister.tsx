import {
  ArrowLeft,
  Building2,
  Check,
  DoorOpen,
  Eye,
  EyeOff,
  FileText,
  Home,
  Image as ImageIcon,
  Layers,
  Lock,
  Plus,
  RotateCcw,
  ShieldAlert,
  Trash2,
  Upload,
  User,
  Users,
  Loader2,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { useGetBuildingsQuery } from "../../../redux/features/building/buildingApi";
import { useGetFloorsMutation } from "../../../redux/features/floor/floorApi";
import {
  useSignupTenantMutation,
  useUpdateTenantByIdMutation,
} from "../../../redux/features/tenant/tenantApi";
import { useGetUnitsMutation } from "../../../redux/features/unit/unitApi";
import { useUploadSingleImageMutation } from "../../../redux/features/user/userApi";
import { imageUrl } from "../../../redux/base/baseAPI";
import { handleApiError } from "../../../utils/errorHandler";
import { Badge } from "../../ui/badge";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { type Building } from "../Building/types";
import type { FamilyMember, Tenant } from "./types";

interface TenantRegisterProps {
  editingTenant?: Tenant | null;
  onSaveTenant?: (tenantData: Tenant) => void;
  onBackToList?: () => void;
  buildingList?: Building[];
  initialBuildingId?: string;
  initialFloorNo?: number | string;
  initialUnitNo?: any;
  initialUnitId?: string;
  isModalMode?: boolean;
  onSuccess?: () => void;
}

export default function TenantRegister({
  editingTenant,
  onSaveTenant,
  onBackToList,
  initialBuildingId,
  initialFloorNo,
  initialUnitNo,
  initialUnitId,
  isModalMode = false,
  onSuccess,
}: TenantRegisterProps) {
  const isEditMode = Boolean(editingTenant);

  // 0. API Data fetching
  const { data: buildingsData, isLoading: isBuildingsLoading } =
    useGetBuildingsQuery({
      pagination: { pageSize: 100, currentPage: 1 },
      filter: null,
    });
  const availableBuildings = buildingsData?.data || [];

  const [getFloorsApi] = useGetFloorsMutation();
  const [getUnitsApi] = useGetUnitsMutation();

  const [apiFloors, setApiFloors] = useState<any[]>([]);
  const [apiUnits, setApiUnits] = useState<any[]>([]);

  // 1. Basic User Schema State
  const [name, setName] = useState(editingTenant?.name || "");
  const [phoneNo, setPhoneNo] = useState(
    editingTenant?.phoneNo || editingTenant?.phone || "",
  );
  const [email, setEmail] = useState(editingTenant?.email || "");
  const [password, setPassword] = useState(
    editingTenant?.password || "tenant12345",
  );
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [hasAccess, setHasAccess] = useState<boolean>(
    editingTenant?.hasAccess ?? editingTenant?.hasUserAccess ?? false,
  );
  const [fatherName, setFatherName] = useState(editingTenant?.fatherName || "");
  const [motherName, setMotherName] = useState(editingTenant?.motherName || "");
  const [nidNo, setNidNo] = useState(editingTenant?.nidNo || "");
  const [maritalStatus, setMaritalStatus] = useState(
    editingTenant?.maritalStatus || "Single",
  );
  const [permanentAddress, setPermanentAddress] = useState(
    typeof editingTenant?.permanentAddress === "string"
      ? editingTenant.permanentAddress
      : (editingTenant?.permanentAddress as any)?.fullAddress || "",
  );

  // Profile Image & Documents (PDF)
  const [profileImg, setProfileImg] = useState(editingTenant?.profileImg || "");
  const [profileImgPreview, setProfileImgPreview] = useState<string | null>(
    editingTenant?.profileImg || null,
  );
  const [documents, setDocuments] = useState(editingTenant?.documents || "");
  const [docFileName, setDocFileName] = useState<string>(
    editingTenant?.documents || "",
  );

  // 2. Dynamic Cascading Building, Floor & Unit Allocation State
  const initialBld = editingTenant
    ? availableBuildings.find(
        (b: any) =>
          b._id === editingTenant?.building?._id ||
          b.id === editingTenant?.building?._id ||
          b.name === editingTenant?.building?.name ||
          b.name === editingTenant?.buildingName,
      )
    : initialBuildingId
      ? availableBuildings.find(
          (b: any) => b._id === initialBuildingId || b.id === initialBuildingId,
        )
      : null;

  const [buildingId, setBuildingId] = useState(
    editingTenant?.building?._id ||
      initialBuildingId ||
      initialBld?._id ||
      initialBld?.id ||
      "",
  );
  const [buildingName, setBuildingName] = useState(
    editingTenant?.building?.name ||
      editingTenant?.buildingName ||
      initialBld?.name ||
      "",
  );
  const [buildingAddress, setBuildingAddress] = useState(
    editingTenant?.building?.address || initialBld?.address || "",
  );
  const [buildingPhone, setBuildingPhone] = useState(
    editingTenant?.building?.phoneNo || initialBld?.phoneNo || "",
  );

  // Selected floor & unit
  const [floorNo, setFloorNo] = useState<number | string>(
    editingTenant?.floor?.floorNo || initialFloorNo || "",
  );
  const [unitNo, setUnitNo] = useState<string>(
    editingTenant?.unit?.flotNo ||
      editingTenant?.unitName ||
      initialUnitNo ||
      "",
  );
  const [unitBaseFare, setUnitBaseFare] = useState<number>(0);

  // Sync initial props when passed
  useEffect(() => {
    if (initialBuildingId && !buildingId) {
      setBuildingId(initialBuildingId);
    }
  }, [initialBuildingId]);

  useEffect(() => {
    if (initialFloorNo !== undefined && initialFloorNo !== "" && !floorNo) {
      setFloorNo(initialFloorNo);
    }
  }, [initialFloorNo]);

  useEffect(() => {
    if (initialUnitNo && !unitNo) {
      setUnitNo(initialUnitNo);
    }
  }, [initialUnitNo]);

  useEffect(() => {
    if (buildingId && availableBuildings.length > 0) {
      const bld = availableBuildings.find(
        (b: any) => b._id === buildingId || b.id === buildingId,
      );
      if (bld) {
        if (!buildingName) setBuildingName(bld.name || "");
        if (!buildingAddress) setBuildingAddress(bld.address || "");
        if (!buildingPhone) setBuildingPhone(bld.phoneNo || "");
      }
    }
  }, [buildingId, availableBuildings]);

  // Fetch floors when building changes
  useEffect(() => {
    if (buildingId) {
      getFloorsApi({
        pagination: { pageSize: 100, currentPage: 1 },
        filter: { "building._id": buildingId },
        select: { floorNo: 1, building: 1, isDelete: 1 },
      })
        .unwrap()
        .then((res: any) => {
          const floors = res?.data || [];
          setApiFloors(floors);
          if (floors.length > 0 && !isEditMode && !initialFloorNo && !floorNo) {
            setFloorNo(floors[0].floorNo);
          } else if (
            floors.length === 0 &&
            !isEditMode &&
            !initialFloorNo &&
            !floorNo
          ) {
            setFloorNo("");
          }
        })
        .catch(console.error);
    } else {
      setApiFloors([]);
      if (!initialFloorNo) setFloorNo("");
    }
  }, [buildingId, getFloorsApi, isEditMode, initialFloorNo]);

  // Fetch units when floor changes
  useEffect(() => {
    if (buildingId && floorNo) {
      const selectedFloor = apiFloors.find(
        (f) =>
          f.floorNo === floorNo ||
          f.floorNo === Number(floorNo) ||
          f._id === floorNo,
      );
      const floorId = selectedFloor?._id;

      const filterObj: any = {
        "building._id": buildingId,
      };
      if (!initialUnitNo) {
        filterObj.isOccupied = false;
      }

      if (floorId) {
        filterObj["floor._id"] = floorId;
      } else {
        filterObj["floor.floorNo"] = Number(floorNo) || floorNo;
      }

      getUnitsApi({
        pagination: { pageSize: 100, currentPage: 1 },
        filter: filterObj,
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
        },
      })
        .unwrap()
        .then((res: any) => {
          const units = res?.data || [];
          setApiUnits(units);
          if (units.length > 0 && !isEditMode && !initialUnitNo && !unitNo) {
            setUnitNo(units[0].unitNo || units[0].flotNo || "");
            setUnitBaseFare(units[0].baseFare || 0);
          } else if (
            units.length === 0 &&
            !isEditMode &&
            !initialUnitNo &&
            !unitNo
          ) {
            setUnitNo("");
            setUnitBaseFare(0);
          }
        })
        .catch(console.error);
    } else {
      setApiUnits([]);
      if (!initialUnitNo) {
        setUnitNo("");
        setUnitBaseFare(0);
      }
    }
  }, [buildingId, floorNo, apiFloors, getUnitsApi, isEditMode, initialUnitNo]);



  // Filter available (vacant) units + current assigned unit if editing
  const availableVacantFlots = apiUnits.filter((f) => {
    const isVacant = !f.isOccupied && f.status !== "INACTIVE";
    const isCurrentTenantUnit =
      editingTenant && (f.unitNo === unitNo || f.unitName?.includes(unitNo));
    return isVacant || isCurrentTenantUnit;
  });

  // 3. Emergency Contact State
  const [emergName, setEmergName] = useState(
    editingTenant?.emergencyContact?.name || "",
  );
  const [emergPhoneNo, setEmergPhoneNo] = useState(
    editingTenant?.emergencyContact?.phoneNo ||
      editingTenant?.emergencyContact?.mobile ||
      "",
  );
  const [emergRelation, setEmergRelation] = useState(
    editingTenant?.emergencyContact?.relation || "",
  );
  const [emergAddress, setEmergAddress] = useState(
    editingTenant?.emergencyContact?.address || "",
  );

  // 4. Family Members Dynamic List State
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>(
    editingTenant?.familyMembers || [],
  );

  // Synchronize state if editingTenant prop changes
  useEffect(() => {
    if (editingTenant) {
      setName(editingTenant.name || "");
      setPhoneNo(editingTenant.phoneNo || editingTenant.phone || "");
      setEmail(editingTenant.email || "");
      setPassword(editingTenant.password || "tenant12345");
      setHasAccess(
        editingTenant.hasAccess ?? editingTenant.hasUserAccess ?? false,
      );
      setFatherName(editingTenant.fatherName || "");
      setMotherName(editingTenant.motherName || "");
      setNidNo(editingTenant.nidNo || "");
      setMaritalStatus(editingTenant.maritalStatus || "Single");
      setPermanentAddress(
        typeof editingTenant.permanentAddress === "string"
          ? editingTenant.permanentAddress
          : (editingTenant.permanentAddress as any)?.fullAddress || "",
      );
      setProfileImg(editingTenant.profileImg || "");
      setProfileImgPreview(editingTenant.profileImg || null);
      setDocuments(editingTenant.documents || "");
      setDocFileName(editingTenant.documents || "");

      const bld =
        availableBuildings.find(
          (b: any) =>
            b._id === editingTenant.building?._id ||
            b.id === editingTenant.building?._id ||
            b.name === editingTenant.building?.name ||
            b.name === editingTenant.buildingName,
        ) || availableBuildings[0];

      setBuildingId(bld?._id || bld?.id || "bld_1");
      setBuildingName(
        editingTenant.building?.name ||
          editingTenant.buildingName ||
          bld?.name ||
          "Master Tower",
      );
      setBuildingAddress(
        editingTenant.building?.address ||
          bld?.address ||
          "মাওনা চৌরাস্তা, গাজীপুর",
      );
      setBuildingPhone(
        editingTenant.building?.phoneNo || bld?.phoneNo || "01711122233",
      );

      setFloorNo(editingTenant.floor?.floorNo || 3);
      setUnitNo(editingTenant.unit?.flotNo || editingTenant.unitName || "3D");

      setEmergName(editingTenant.emergencyContact?.name || "");
      setEmergPhoneNo(
        editingTenant.emergencyContact?.phoneNo ||
          editingTenant.emergencyContact?.mobile ||
          "",
      );
      setEmergRelation(editingTenant.emergencyContact?.relation || "");
      setEmergAddress(editingTenant.emergencyContact?.address || "");

      setFamilyMembers(editingTenant.familyMembers || []);
    }
  }, [editingTenant, availableBuildings]);

  // When selected building changes
  const handleBuildingChange = (selectedBldId: string) => {
    const bld = availableBuildings.find(
      (b: any) => b._id === selectedBldId || b.id === selectedBldId,
    );
    if (bld) {
      setBuildingId(bld._id || bld.id);
      setBuildingName(bld.name);
      setBuildingAddress(bld.address || "");
      setBuildingPhone(bld.phoneNo || "");
    }
  };

  // When selected floor changes
  const handleFloorChange = (newFloorNo: number | string) => {
    setFloorNo(newFloorNo);
  };

  // Family Member Operations
  const handleAddFamilyMember = () => {
    const newMember: FamilyMember = {
      _id: `fam-${Date.now()}`,
      id: `fam-${Date.now()}`,
      name: "",
      age: 25,
      occupation: "",
      relation: "",
      phoneNo: "",
      mobile: "",
    };
    setFamilyMembers((prev) => [...prev, newMember]);
  };

  const handleUpdateFamilyMember = (
    index: number,
    field: keyof FamilyMember,
    val: any,
  ) => {
    setFamilyMembers((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: val };
      if (field === "phoneNo") {
        updated[index].mobile = val;
      }
      return updated;
    });
  };

  const handleRemoveFamilyMember = (index: number) => {
    setFamilyMembers((prev) => prev.filter((_, i) => i !== index));
  };

  const [uploadSingleImage] = useUploadSingleImageMutation();
  const [isPhotoUploading, setIsPhotoUploading] = useState(false);
  const [isDocUploading, setIsDocUploading] = useState(false);

  // Image Upload Handler
  const handlePhotoFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsPhotoUploading(true);
      try {
        const res = await uploadSingleImage(file).unwrap();
        const uploadedUrl = res?.url || res?.path || res?.filename;
        if (uploadedUrl) {
          setProfileImg(uploadedUrl);
          setProfileImgPreview(
            uploadedUrl.startsWith("http")
              ? uploadedUrl
              : imageUrl + uploadedUrl,
          );
          toast.success("প্রোফাইল ছবি সফলভাবে আপলোড হয়েছে");
        } else {
          toast.error("ছবি আপলোড ব্যর্থ হয়েছে");
        }
      } catch (err: any) {
        toast.error(
          err?.data?.message || err?.message || "ছবি আপলোড সমস্যা হয়েছে",
        );
      } finally {
        setIsPhotoUploading(false);
      }
    }
  };

  // PDF Document Upload Handler
  const handleDocumentFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsDocUploading(true);
      try {
        const res = await uploadSingleImage(file).unwrap();
        const uploadedUrl = res?.url || res?.path || res?.filename;
        if (uploadedUrl) {
          setDocuments(uploadedUrl);
          setDocFileName(file.name);
          toast.success("নথিপত্র ফাইল সফলভাবে আপলোড হয়েছে");
        } else {
          toast.error("নথিপত্র আপলোড ব্যর্থ হয়েছে");
        }
      } catch (err: any) {
        toast.error(
          err?.data?.message || err?.message || "নথিপত্র আপলোড সমস্যা হয়েছে",
        );
      } finally {
        setIsDocUploading(false);
      }
    }
  };

  // Reset Form
  const handleReset = () => {
    setName("");
    setPhoneNo("");
    setEmail("");
    setPassword("tenant12345");
    setHasAccess(false);
    setFatherName("");
    setMotherName("");
    setNidNo("");
    setMaritalStatus("Single");
    setPermanentAddress("");
    setProfileImg("");
    setProfileImgPreview(null);
    setDocuments("");
    setDocFileName("");
    setEmergName("");
    setEmergPhoneNo("");
    setEmergRelation("");
    setEmergAddress("");
    setFamilyMembers([]);
    toast.info("ফর্ম রিসেট করা হয়েছে");
  };

  const [signupTenantApi, { isLoading: isSigningUp }] =
    useSignupTenantMutation();
  const [updateTenantApi, { isLoading: isUpdating }] =
    useUpdateTenantByIdMutation();

  const isSubmitting = isSigningUp || isUpdating;

  // Form Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("অনুগ্রহ করে ভাড়াটিয়ার নাম প্রদান করুন!");
      return;
    }

    if (!phoneNo.trim()) {
      toast.error("অনুগ্রহ করে মোবাইল নম্বর প্রদান করুন!");
      return;
    }

    const selectedFloorObj = apiFloors.find(
      (f) =>
        f.floorNo === floorNo ||
        f.floorNo === Number(floorNo) ||
        f._id === floorNo,
    );
    const selectedUnitObj = apiUnits.find(
      (u) => u.unitNo === unitNo || u.flatNo === unitNo || u._id === unitNo,
    );

    const strFloorNo = String(floorNo || "1");

    // Build floor object with valid Mongo ObjectId & string floorNo
    const floorObj: any = {
      floorNo: strFloorNo,
    };
    if (selectedFloorObj?._id) {
      floorObj._id = selectedFloorObj._id;
    }

    // Build unit object with valid Mongo ObjectId & string floorNo
    const unitObj: any = {
      floorNo: strFloorNo,
      unitNo: String(unitNo),
    };
    const targetUnitId = selectedUnitObj?._id || initialUnitId;
    if (targetUnitId) {
      unitObj._id = targetUnitId;
    }

    // Exact expected API Payload requested by user
    const apiPayload: any = {
      name: name.trim(),
      phoneNo: phoneNo.trim(),
      username: phoneNo.trim(), // Always mobile number
      password: password || "123456",
      ...(email.trim() ? { email: email.trim().toLowerCase() } : {}),
      fatherName: fatherName.trim(),
      motherName: motherName.trim(),
      nidNo: nidNo.trim(),
      maritalStatus: maritalStatus,
      profileImg: profileImgPreview || profileImg || "",
      hasAccess: Boolean(hasAccess),
      role: "user",
      building: {
        _id: buildingId,
        name: buildingName,
        address: buildingAddress,
        phoneNo: buildingPhone,
      },
      floor: floorObj,
      unit: unitObj,
      emergencyContact: {
        name: emergName.trim(),
        phoneNo: emergPhoneNo.trim(),
        address: emergAddress.trim(),
        relation: emergRelation.trim(),
      },
      familyMembers: familyMembers.map((m) => ({
        name: m.name.trim(),
        age: Number(m.age) || 0,
        occupation: m.occupation.trim(),
        relation: m.relation.trim(),
        phoneNo: (m.phoneNo || m.mobile || "").trim(),
      })),
      permanentAddress: permanentAddress.trim(),
      documents: documents || docFileName || "",
    };

    const tenantId =
      editingTenant?.id || `#${Math.floor(100 + Math.random() * 900)}`;
    const tenantDbId = editingTenant?._id || `usr_${Date.now()}`;

    const localTenantObject: Tenant = {
      _id: tenantDbId,
      id: tenantId,
      name: apiPayload.name,
      phoneNo: apiPayload.phoneNo,
      phone: apiPayload.phoneNo,
      email: apiPayload.email,
      password: apiPayload.password,
      hasAccess: apiPayload.hasAccess,
      hasUserAccess: apiPayload.hasAccess,
      fatherName: apiPayload.fatherName,
      motherName: apiPayload.motherName,
      nidNo: apiPayload.nidNo,
      maritalStatus: apiPayload.maritalStatus,
      permanentAddress: apiPayload.permanentAddress,
      profileImg: apiPayload.profileImg,
      documents: apiPayload.documents,
      building: apiPayload.building,
      buildingName,
      floor: apiPayload.floor,
      unit: {
        _id: apiPayload.unit._id,
        floorNo: apiPayload.unit.floorNo,
        flotNo: apiPayload.unit.unitNo,
      },
      unitName: unitNo,
      emergencyContact: {
        name: emergName,
        phoneNo: emergPhoneNo,
        mobile: emergPhoneNo,
        relation: emergRelation,
        address: emergAddress,
      },
      familyMembers: familyMembers.map((m, idx) => ({
        _id: m._id || m.id || `fam-${Date.now() + idx}`,
        id: m.id || m._id || `fam-${Date.now() + idx}`,
        name: m.name,
        age: Number(m.age) || 0,
        occupation: m.occupation,
        relation: m.relation,
        phoneNo: m.phoneNo || m.mobile || "",
        mobile: m.phoneNo || m.mobile || "",
      })),
      profileType: editingTenant?.profileType || "ভাড়াটিয়া",
      status: editingTenant?.status || "সক্রিয়",
      monthlyCharges: editingTenant?.monthlyCharges || {
        baseFare: unitBaseFare,
        utilityBill: 500,
        waterBill: 1000,
        gasBill: 1080,
        wastageBill: 100,
        welfareBill: 200,
        securityBill: 500,
        monthlyTotal: unitBaseFare + 3380,
      },
      financialSummary: editingTenant?.financialSummary || {
        monthlyPayable: unitBaseFare + 3380,
        totalBill: unitBaseFare + 3380,
        totalPaid: unitBaseFare + 3380,
        balance: 0,
      },
      joinedDate:
        editingTenant?.joinedDate || new Date().toISOString().split("T")[0],
    };

    try {
      if (isEditMode && editingTenant) {
        const updateId = editingTenant._id || editingTenant.id;
        const res = await updateTenantApi({
          id: updateId,
          data: apiPayload,
        }).unwrap();

        if (res?.success !== false) {
          toast.success(
            res?.message || "ভাড়াটিয়া তথ্য সফলভাবে আপডেট করা হয়েছে!",
          );
          if (onSaveTenant) {
            onSaveTenant(
              res?.data
                ? { ...localTenantObject, ...res.data }
                : localTenantObject,
            );
          }
          if (onSuccess) {
            onSuccess();
          } else if (onBackToList) {
            onBackToList();
          }
        } else {
          handleApiError(res, "ভাড়াটিয়া তথ্য আপডেট করতে সমস্যা হয়েছে!");
        }
      } else {
        const res = await signupTenantApi(apiPayload).unwrap();
        if (res?.success !== false) {
          toast.success(
            res?.message || "নতুন ভাড়াটিয়া সফলভাবে রেজিস্টার করা হয়েছে!",
          );
          if (onSaveTenant) {
            onSaveTenant(
              res?.data
                ? { ...localTenantObject, ...res.data }
                : localTenantObject,
            );
          }
          if (onSuccess) {
            onSuccess();
          } else if (onBackToList) {
            onBackToList();
          }
        } else {
          handleApiError(res, "ভাড়াটিয়া রেজিস্টার করতে সমস্যা হয়েছে!");
        }
      }
    } catch (err: any) {
      handleApiError(err, "ভাড়াটিয়া সংরক্ষণ করতে সমস্যা হয়েছে!");
    }
  };

  return (
    <div className={`w-full space-y-6 ${isModalMode ? "" : "pb-16"}`}>
      {/* Top Banner Header */}
      {!isModalMode && (
        <div className="bg-[#054a48] text-white rounded-2xl p-5 sm:p-7 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-[32px] sm:text-[36px] md:text-[40px] lg:text-[48px] xl:text-[52px] font-extrabold tracking-tight leading-tight">
              {isEditMode
                ? "ভাড়াটিয়া তথ্য আপডেট (Edit Tenant)"
                : "নতুন ভাড়াটিয়া রেজিস্টার (Register Tenant)"}
            </h1>
          </div>

          {onBackToList && (
            <div>
              <Button
                onClick={onBackToList}
                className="bg-white/10 hover:bg-white/20 border border-white/30 text-white font-semibold px-4 py-2.5 rounded-xl backdrop-blur-xs transition-all flex items-center gap-2 cursor-pointer text-xs sm:text-sm"
              >
                <ArrowLeft size={16} /> ← Tenant List
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Main Registration & Update Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 1. Basic User Profile Section */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-gray-100 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <div className="flex items-center gap-2 text-base font-bold text-gray-900">
              <User size={18} className="text-[#054a48]" /> ১. ইউজারের মৌলিক
              তথ্য (Users Schema)
            </div>
            <Badge
              variant="outline"
              className="bg-emerald-50 text-emerald-800 border-emerald-200 text-xs font-bold"
            >
              REQUIRED FIELDS: Name, PhoneNo, Password
            </Badge>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
            {/* Name */}
            <div>
              <Label className="font-bold text-gray-700 block mb-1">
                ভাড়াটিয়ার নাম (name) <span className="text-red-500">*</span>
              </Label>
              <Input
                type="text"
                required
                placeholder="Full name as per NID or passport"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="text-xs rounded-xl"
              />
            </div>

            {/* Phone No */}
            <div>
              <Label className="font-bold text-gray-700 block mb-1">
                ফোন নম্বর (phoneNo) <span className="text-red-500">*</span>
              </Label>
              <Input
                type="tel"
                required
                placeholder="01712345678"
                value={phoneNo}
                onChange={(e) => setPhoneNo(e.target.value)}
                className="text-xs rounded-xl"
              />
            </div>

            {/* Email */}
            <div>
              <Label className="font-semibold text-gray-700 block mb-1">
                ইমেইল এড্রেস (email - Optional, Unique)
              </Label>
              <Input
                type="email"
                placeholder="tenant@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="text-xs rounded-xl"
              />
            </div>

            {/* Password */}
            <div>
              <Label className="font-bold text-gray-700 block mb-1">
                পাসওয়ার্ড (password - Hashed){" "}
                <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Account password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="text-xs rounded-xl pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer p-1"
                  title={showPassword ? "পাসওয়ার্ড লুকান" : "পাসওয়ার্ড দেখুন"}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* User Access (hasAccess) */}
            <div>
              <Label className="font-bold text-gray-700 block mb-1">
                ইউজার প্যানেল অ্যাক্সেস (hasAccess)
              </Label>
              <div className="flex items-center gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => setHasAccess(!hasAccess)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                    hasAccess
                      ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                      : "bg-gray-100 text-gray-600 border-gray-200"
                  }`}
                >
                  {hasAccess ? (
                    <>
                      <Check size={14} className="text-emerald-700" /> Login
                      Allowed (true)
                    </>
                  ) : (
                    <>
                      <Lock size={14} className="text-gray-400" /> No Access
                      (false)
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* NID No */}
            <div>
              <Label className="font-semibold text-gray-700 block mb-1">
                এনআইডি নম্বর (nidNo)
              </Label>
              <Input
                type="text"
                placeholder="10 / 13 / 17 digit NID"
                value={nidNo}
                onChange={(e) => setNidNo(e.target.value)}
                className="text-xs rounded-xl"
              />
            </div>

            {/* Father Name */}
            <div>
              <Label className="font-semibold text-gray-700 block mb-1">
                পিতার নাম (fatherName)
              </Label>
              <Input
                type="text"
                placeholder="Father's full name"
                value={fatherName}
                onChange={(e) => setFatherName(e.target.value)}
                className="text-xs rounded-xl"
              />
            </div>

            {/* Mother Name */}
            <div>
              <Label className="font-semibold text-gray-700 block mb-1">
                মাতার নাম (motherName)
              </Label>
              <Input
                type="text"
                placeholder="Mother's full name"
                value={motherName}
                onChange={(e) => setMotherName(e.target.value)}
                className="text-xs rounded-xl"
              />
            </div>

            {/* Marital Status */}
            <div>
              <Label className="font-semibold text-gray-700 block mb-1">
                বৈবাহিক অবস্থা (maritalStatus)
              </Label>
              <select
                value={maritalStatus}
                onChange={(e) => setMaritalStatus(e.target.value)}
                className="w-full h-9 px-3 border border-gray-200 rounded-xl text-xs bg-white font-semibold text-gray-800 focus:outline-none"
              >
                <option value="Single">অবিবাহিত (Single)</option>
                <option value="Married">বিবাহিত (Married)</option>
                <option value="Others">অন্যান্য (Others)</option>
              </select>
            </div>
          </div>
        </div>

        {/* 2. Dynamic Cascading Building, Floor & Unit Allocation */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-gray-100 shadow-xs space-y-4">
          <div className="border-b border-gray-100 pb-3 flex items-center justify-between">
            <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <Building2 size={18} className="text-[#054a48]" /> ২. ভবন, ফ্লোর ও
              ইউনিট বরাদ্দ (Building, Floor, Unit Objects)
            </h3>
            <Badge
              variant="outline"
              className="bg-blue-50 text-blue-800 border-blue-200 text-xs font-bold"
            >
              CASCADING DROPDOWNS: Building → Floor → Vacant Unit
            </Badge>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
            {/* Building Selection Dropdown */}
            <div>
              <Label className="font-bold text-gray-700 block mb-1 flex items-center gap-1">
                <Building2 size={14} className="text-[#054a48]" /> ভবন নির্বাচন
                (building.name) <span className="text-red-500">*</span>
              </Label>
              <select
                value={buildingId}
                onChange={(e) => handleBuildingChange(e.target.value)}
                className="w-full h-10 px-3 border border-gray-200 rounded-xl text-xs bg-white font-bold text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#054a48]/20 cursor-pointer"
              >
                <option value="">-- ভবন নির্বাচন করুন --</option>
                {isBuildingsLoading ? (
                  <option disabled>Loading buildings...</option>
                ) : null}
                {availableBuildings.map((bld: any) => (
                  <option key={bld._id || bld.id} value={bld._id || bld.id}>
                    {bld.name} ({bld.address || "গাজীপুর"})
                  </option>
                ))}
              </select>
            </div>

            {/* Floor Selection Dropdown */}
            <div>
              <Label className="font-bold text-gray-700 block mb-1 flex items-center gap-1">
                <Layers size={14} className="text-[#054a48]" /> ফ্লোর নির্বাচন
                (floor.floorNo) <span className="text-red-500">*</span>
              </Label>
              <select
                value={floorNo}
                onChange={(e) => handleFloorChange(e.target.value)}
                className="w-full h-10 px-3 border border-gray-200 rounded-xl text-xs bg-white font-bold text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#054a48]/20 cursor-pointer"
                disabled={!buildingId}
              >
                <option value="">-- ফ্লোর নির্বাচন করুন --</option>
                {apiFloors.map((floor) => (
                  <option
                    key={floor._id || floor.floorNo}
                    value={floor.floorNo}
                  >
                    Floor-{floor.floorNo} ({floor.floorNo}ম তলা)
                  </option>
                ))}
              </select>
            </div>

            {/* Unit / Flat Selection Dropdown (Filter Available Vacant Units) */}
            <div>
              <Label className="font-bold text-gray-700 block mb-1 flex items-center gap-1">
                <DoorOpen size={14} className="text-[#054a48]" /> খালি ইউনিট
                নির্বাচন (unit.flotNo) <span className="text-red-500">*</span>
              </Label>
              <select
                value={unitNo}
                onChange={(e) => {
                  const selVal = e.target.value;
                  setUnitNo(selVal);
                  const selectedUnit = apiUnits.find(
                    (u: any) => u.unitNo === selVal || u.flatNo === selVal,
                  );
                  if (selectedUnit) {
                    setUnitBaseFare(selectedUnit.baseFare || 8000);
                  }
                }}
                className="w-full h-10 px-3 border border-gray-200 rounded-xl text-xs bg-white font-extrabold text-[#054a48] focus:outline-none focus:ring-2 focus:ring-[#054a48]/20 cursor-pointer"
                disabled={!floorNo}
              >
                <option value="">-- খালি ইউনিট নির্বাচন করুন --</option>
                {availableVacantFlots.map((unit) => {
                  const uVal = unit.flatNo || unit.unitNo;
                  const isCurrentUnit =
                    editingTenant &&
                    (editingTenant.unit?.flotNo === uVal ||
                      editingTenant.unitName === uVal);
                  return (
                    <option key={unit._id || unit.id} value={uVal}>
                      ফ্ল্যাট {uVal} -{" "}
                      {isCurrentUnit
                        ? "বর্তমান বরাদ্দকৃত (Assigned)"
                        : "খালি (Vacant)"}{" "}
                      (ভাড়া: ৳{unit.baseFare || unit.baseRent || 8000})
                    </option>
                  );
                })}
              </select>
            </div>

            {/* Building Address */}
            <div className="sm:col-span-2">
              <Label className="font-semibold text-gray-700 block mb-1">
                ভবনের ঠিকানা (building.address)
              </Label>
              <Input
                type="text"
                placeholder="House, Road, Area"
                value={buildingAddress}
                onChange={(e) => setBuildingAddress(e.target.value)}
                className="text-xs rounded-xl bg-gray-50"
              />
            </div>

            {/* Building Phone */}
            <div>
              <Label className="font-semibold text-gray-700 block mb-1">
                ভবনের যোগাযোগ নম্বর (building.phoneNo)
              </Label>
              <Input
                type="tel"
                placeholder="Building caretaker / admin phone"
                value={buildingPhone}
                onChange={(e) => setBuildingPhone(e.target.value)}
                className="text-xs rounded-xl bg-gray-50"
              />
            </div>
          </div>
        </div>

        {/* 3. Emergency Contact */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-gray-100 shadow-xs space-y-4">
          <div className="border-b border-gray-100 pb-3">
            <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <ShieldAlert size={18} className="text-[#054a48]" /> ৩. জরুরী
              পরিচিতির তথ্য (emergencyContact Object)
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            <div>
              <Label className="font-semibold text-gray-700 block mb-1">
                জরুরী ব্যক্তির নাম (name)
              </Label>
              <Input
                type="text"
                placeholder="Emergency contact full name"
                value={emergName}
                onChange={(e) => setEmergName(e.target.value)}
                className="text-xs rounded-xl"
              />
            </div>

            <div>
              <Label className="font-semibold text-gray-700 block mb-1">
                মোবাইল নম্বর (phoneNo)
              </Label>
              <Input
                type="tel"
                placeholder="017XXXXXXXX"
                value={emergPhoneNo}
                onChange={(e) => setEmergPhoneNo(e.target.value)}
                className="text-xs rounded-xl"
              />
            </div>

            <div>
              <Label className="font-semibold text-gray-700 block mb-1">
                সম্পর্ক (relation)
              </Label>
              <Input
                type="text"
                placeholder="e.g. Brother, Father, Spouse"
                value={emergRelation}
                onChange={(e) => setEmergRelation(e.target.value)}
                className="text-xs rounded-xl"
              />
            </div>

            <div>
              <Label className="font-semibold text-gray-700 block mb-1">
                ঠিকানা (address)
              </Label>
              <Input
                type="text"
                placeholder="Current address"
                value={emergAddress}
                onChange={(e) => setEmergAddress(e.target.value)}
                className="text-xs rounded-xl"
              />
            </div>
          </div>
        </div>

        {/* 4. Family Members Dynamic Schema List */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-gray-100 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <Users size={18} className="text-[#054a48]" /> ৪. পরিবারের
              সদস্যদের তথ্য (familyMembers Schema Array)
            </h3>
            <Button
              type="button"
              size="sm"
              onClick={handleAddFamilyMember}
              className="bg-[#054a48] hover:bg-[#033433] text-white text-xs font-bold px-3 py-1.5 rounded-xl cursor-pointer flex items-center gap-1.5"
            >
              <Plus size={14} /> + সদস্য যোগ করুন
            </Button>
          </div>

          <div className="space-y-3">
            {familyMembers.length > 0 ? (
              familyMembers.map((member, idx) => (
                <div
                  key={idx}
                  className="grid grid-cols-1 sm:grid-cols-5 gap-3 bg-gray-50/80 p-3.5 rounded-xl border border-gray-200 items-center text-xs"
                >
                  <div>
                    <Label className="text-[10px] font-bold text-gray-500 mb-1 block">
                      সদস্যের নাম (name)
                    </Label>
                    <Input
                      type="text"
                      placeholder="নাম"
                      value={member.name}
                      onChange={(e) =>
                        handleUpdateFamilyMember(idx, "name", e.target.value)
                      }
                      className="text-xs bg-white rounded-lg"
                    />
                  </div>

                  <div>
                    <Label className="text-[10px] font-bold text-gray-500 mb-1 block">
                      বয়স (age - number)
                    </Label>
                    <Input
                      type="number"
                      placeholder="বয়স"
                      value={member.age}
                      onChange={(e) =>
                        handleUpdateFamilyMember(
                          idx,
                          "age",
                          Number(e.target.value),
                        )
                      }
                      className="text-xs bg-white rounded-lg"
                    />
                  </div>

                  <div>
                    <Label className="text-[10px] font-bold text-gray-500 mb-1 block">
                      পেশা (occupation)
                    </Label>
                    <Input
                      type="text"
                      placeholder="পেশা"
                      value={member.occupation}
                      onChange={(e) =>
                        handleUpdateFamilyMember(
                          idx,
                          "occupation",
                          e.target.value,
                        )
                      }
                      className="text-xs bg-white rounded-lg"
                    />
                  </div>

                  <div>
                    <Label className="text-[10px] font-bold text-gray-500 mb-1 block">
                      সম্পর্ক (relation)
                    </Label>
                    <Input
                      type="text"
                      placeholder="সম্পর্ক"
                      value={member.relation}
                      onChange={(e) =>
                        handleUpdateFamilyMember(
                          idx,
                          "relation",
                          e.target.value,
                        )
                      }
                      className="text-xs bg-white rounded-lg"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex-1">
                      <Label className="text-[10px] font-bold text-gray-500 mb-1 block">
                        মোবাইল (phoneNo)
                      </Label>
                      <Input
                        type="tel"
                        placeholder="মোবাইল নম্বর"
                        value={member.phoneNo || member.mobile || ""}
                        onChange={(e) =>
                          handleUpdateFamilyMember(
                            idx,
                            "phoneNo",
                            e.target.value,
                          )
                        }
                        className="text-xs bg-white rounded-lg"
                      />
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveFamilyMember(idx)}
                      className="h-8 w-8 p-0 text-red-600 hover:bg-red-50 rounded-lg shrink-0 mt-4 cursor-pointer"
                      title="মুছুন"
                    >
                      <Trash2 size={15} />
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-gray-400 text-center py-4 bg-gray-50/50 rounded-xl border border-dashed border-gray-200">
                কোনো সদস্য যোগ করা হয়নি। '+ সদস্য যোগ করুন' বাটনে ক্লিক করুন।
              </p>
            )}
          </div>
        </div>

        {/* 5. Permanent Address Section */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-gray-100 shadow-xs space-y-3">
          <div className="border-b border-gray-100 pb-3">
            <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <Home size={18} className="text-[#054a48]" /> ৫. স্থায়ী ঠিকানা
              (permanentAddress String)
            </h3>
          </div>
          <Input
            type="text"
            placeholder="স্থায়ী পূর্ণ ঠিকানা (যেমন: বাড়ি নম্বর, রোড, গ্রাম, থানা, জেলা)"
            value={permanentAddress}
            onChange={(e) => setPermanentAddress(e.target.value)}
            className="text-xs rounded-xl"
          />
        </div>

        {/* 6. Profile Image & PDF Documents Upload */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-gray-100 shadow-xs space-y-4">
          <div className="border-b border-gray-100 pb-3">
            <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <ImageIcon size={18} className="text-[#054a48]" /> ৬. প্রোফাইল ছবি
              ও নথি (profileImg & documents PDF)
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {/* Profile Image */}
            <div className="bg-gray-50/80 p-4 rounded-xl border border-gray-200 space-y-3">
              <Label className="font-bold text-gray-700 block">
                প্রোফাইল ছবি (profileImg)
              </Label>
              <div className="flex items-center gap-3">
                {profileImgPreview ? (
                  <img
                    src={profileImgPreview}
                    alt="Profile Preview"
                    className="w-14 h-14 rounded-full object-cover border-2 border-emerald-400 shadow-xs"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-full bg-emerald-100 text-[#054a48] font-extrabold flex items-center justify-center text-sm border border-emerald-300">
                    {name ? name.slice(0, 2).toUpperCase() : "IMG"}
                  </div>
                )}

                <div className="flex-1 space-y-1.5">
                  <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-gray-100 text-xs font-bold text-gray-700 border border-gray-200 cursor-pointer shadow-2xs">
                    {isPhotoUploading ? (
                      <>
                        <Loader2 size={14} className="animate-spin text-[#054a48]" /> আপলোড হচ্ছে...
                      </>
                    ) : (
                      <>
                        <Upload size={14} className="text-[#054a48]" /> ছবি নির্বাচন করুন
                      </>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoFileChange}
                      disabled={isPhotoUploading}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            </div>

            {/* PDF Documents */}
            <div className="bg-gray-50/80 p-4 rounded-xl border border-gray-200 space-y-3">
              <Label className="font-bold text-gray-700 block">
                নথিপত্র ফাইল (documents - PDF / File)
              </Label>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center font-bold border border-red-200">
                  <FileText size={22} />
                </div>

                <div className="flex-1 space-y-1.5">
                  <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-gray-100 text-xs font-bold text-gray-700 border border-gray-200 cursor-pointer shadow-2xs">
                    {isDocUploading ? (
                      <>
                        <Loader2 size={14} className="animate-spin text-red-600" /> আপলোড হচ্ছে...
                      </>
                    ) : (
                      <>
                        <Upload size={14} className="text-red-600" /> PDF নথি আপলোড করুন
                      </>
                    )}
                    <input
                      type="file"
                      accept=".pdf,image/*"
                      onChange={handleDocumentFileChange}
                      disabled={isDocUploading}
                      className="hidden"
                    />
                  </label>
                  {docFileName && (
                    <span className="text-[11px] font-bold text-emerald-700 block truncate">
                      ✓ Selected: {docFileName}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Form Actions */}
        <div className="flex items-center justify-end gap-3 p-4 bg-white rounded-2xl border border-gray-100 shadow-xs">
          <Button
            type="button"
            variant="outline"
            onClick={handleReset}
            className="border-red-200 text-red-600 hover:bg-red-50 text-xs font-bold px-5 py-2.5 rounded-xl cursor-pointer"
          >
            <RotateCcw size={14} className="mr-1.5" /> রিসেট
          </Button>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-[#054a48] hover:bg-[#033433] text-white text-xs font-bold px-6 py-2.5 rounded-xl transition-all shadow-md cursor-pointer flex items-center gap-1.5"
          >
            <Check size={16} />{" "}
            {isEditMode
              ? "আপডেট করুন (Update Tenant)"
              : "সংরক্ষণ করুন (Save Tenant)"}
          </Button>
        </div>
      </form>
    </div>
  );
}
