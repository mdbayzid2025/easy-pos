import {
  Building2,
  Car,
  Image as ImageIcon,
  MapPin,
  Phone,
  RotateCcw,
  Save,
  Shield,
  Upload,
  Zap,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { Badge } from "../../ui/badge";
import { Button } from "../../ui/button";
import { Card, CardContent } from "../../ui/card";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import type { Building } from "./types";

interface BuildingFormProps {
  editingBuilding: Building | null;
  onSaveBuilding: (buildingData: Partial<Building>) => void;
  onCancel: () => void;
  onReset: () => void;
}

export default function BuildingForm({
  editingBuilding,
  onSaveBuilding,
  onCancel,
  onReset,
}: BuildingFormProps) {
  const isEditMode = Boolean(editingBuilding);

  // Schema State Fields
  const [name, setName] = useState(editingBuilding?.name || "");
  const [address, setAddress] = useState(editingBuilding?.address || "");
  const [phoneNo, setPhoneNo] = useState(editingBuilding?.phoneNo || "");
  const [emergencyContact, setEmergencyContact] = useState(
    editingBuilding?.emergencyContact || "",
  );

  // Facility Booleans
  const [isParking, setIsParking] = useState<boolean>(
    editingBuilding?.isParking ?? false,
  );
  const [isLift, setIsLift] = useState<boolean>(
    editingBuilding?.isLift ?? false,
  );
  const [isGenerator, setIsGenerator] = useState<boolean>(
    editingBuilding?.isGenerator ?? false,
  );

  // Status ENUM: ACTIVE | BLOCKED
  const [status, setStatus] = useState<"ACTIVE" | "BLOCKED">(
    editingBuilding?.status === "BLOCKED" || editingBuilding?.status === "নিষ্ক্রিয়"
      ? "BLOCKED"
      : "ACTIVE",
  );

  // Photo URL / Upload
  const [photo, setPhoto] = useState(editingBuilding?.photo || "");
  const [photoPreview, setPhotoPreview] = useState<string | null>(
    editingBuilding?.photo || null,
  );

  // Sync state if editingBuilding prop changes
  useEffect(() => {
    if (editingBuilding) {
      setName(editingBuilding.name || "");
      setAddress(editingBuilding.address || "");
      setPhoneNo(editingBuilding.phoneNo || "");
      setEmergencyContact(editingBuilding.emergencyContact || "");
      setIsParking(editingBuilding.isParking ?? false);
      setIsLift(editingBuilding.isLift ?? false);
      setIsGenerator(editingBuilding.isGenerator ?? false);
      setStatus(
        editingBuilding.status === "BLOCKED" || editingBuilding.status === "নিষ্ক্রিয়"
          ? "BLOCKED"
          : "ACTIVE",
      );
      setPhoto(editingBuilding.photo || "");
      setPhotoPreview(editingBuilding.photo || null);
    }
  }, [editingBuilding]);

  // Photo File Change Handler
  const handlePhotoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhoto(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleResetForm = () => {
    setName("");
    setAddress("");
    setPhoneNo("");
    setEmergencyContact("");
    setIsParking(false);
    setIsLift(false);
    setIsGenerator(false);
    setStatus("ACTIVE");
    setPhoto("");
    setPhotoPreview(null);
    onReset();
  };

  // Form Submit Handler matching Schema
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("অনুগ্রহ করে ভবনের নাম প্রদান করুন (Building name is required)!");
      return;
    }

    const buildingPayload: Partial<Building> = {
      name: name.trim(),
      address: address.trim() || undefined,
      phoneNo: phoneNo.trim() || undefined,
      emergencyContact: emergencyContact.trim() || undefined,
      isParking,
      isLift,
      isGenerator,
      status,
      photo: photoPreview || photo || undefined,
    };

    onSaveBuilding(buildingPayload);
  };

  return (
    <div className="w-full space-y-6 pb-16">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 1. Basic Building Information */}
        <Card className="rounded-2xl border-gray-100 shadow-xs overflow-hidden">
          <div className="bg-emerald-50/50 p-4 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-[#054a48] text-white rounded-lg">
                <Building2 size={18} />
              </div>
              <div>
                <h2 className="font-bold text-gray-800 text-base">
                  ১. বিল্ডিং মৌলিক তথ্য (Building Details)
                </h2>
                <p className="text-xs text-gray-500">
                  Name, phone, emergency contact, address & status
                </p>
              </div>
            </div>
            <Badge
              variant="outline"
              className="bg-emerald-100 text-[#054a48] border-emerald-200 text-xs font-bold"
            >
              REQUIRED: Name
            </Badge>
          </div>

          <CardContent className="p-5 grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Building Name (required) */}
            <div>
              <Label className="text-xs font-bold text-gray-700 mb-1.5 block">
                ভবনের নাম (name) <span className="text-red-500">*</span>
              </Label>
              <Input
                type="text"
                required
                placeholder="যেমন: গ্রীন ভিউ টাওয়ার"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="rounded-xl text-sm"
              />
            </div>

            {/* Status (ACTIVE / BLOCKED) */}
            <div>
              <Label className="text-xs font-bold text-gray-700 mb-1.5 block">
                স্ট্যাটাস (status)
              </Label>
              <select
                value={status}
                onChange={(e) =>
                  setStatus(e.target.value as "ACTIVE" | "BLOCKED")
                }
                className="w-full h-10 px-3 rounded-xl border border-gray-200 text-sm font-semibold bg-white focus:outline-none"
              >
                <option value="ACTIVE">ACTIVE (সক্রিয়)</option>
                <option value="BLOCKED">BLOCKED (নিষ্ক্রিয়)</option>
              </select>
            </div>

            {/* Phone Number */}
            <div>
              <Label className="text-xs font-bold text-gray-700 mb-1.5 block flex items-center gap-1">
                <Phone size={13} className="text-[#054a48]" /> ফোন নম্বর
                (phoneNo)
              </Label>
              <Input
                type="tel"
                placeholder="01700000000"
                value={phoneNo}
                onChange={(e) => setPhoneNo(e.target.value)}
                className="rounded-xl text-sm"
              />
            </div>

            {/* Emergency Contact */}
            <div>
              <Label className="text-xs font-bold text-gray-700 mb-1.5 block flex items-center gap-1">
                <Shield size={13} className="text-amber-600" /> জরুরী যোগাযোগ
                (emergencyContact)
              </Label>
              <Input
                type="text"
                placeholder="যেমন: কেয়ারটেকার (01800000000)"
                value={emergencyContact}
                onChange={(e) => setEmergencyContact(e.target.value)}
                className="rounded-xl text-sm"
              />
            </div>

            {/* Address */}
            <div className="md:col-span-2">
              <Label className="text-xs font-bold text-gray-700 mb-1.5 block flex items-center gap-1">
                <MapPin size={14} className="text-emerald-600" /> ঠিকানা
                (address)
              </Label>
              <Input
                type="text"
                placeholder="মাওনা চৌরাস্তা, শ্রীপুর, গাজীপুর"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="rounded-xl text-sm"
              />
            </div>
          </CardContent>
        </Card>

        {/* 2. Facility Flags (isParking, isLift, isGenerator) */}
        <Card className="rounded-2xl border-gray-100 shadow-xs overflow-hidden">
          <div className="bg-purple-50/40 p-4 border-b border-gray-100 flex items-center gap-2">
            <div className="p-2 bg-purple-600 text-white rounded-lg">
              <Car size={18} />
            </div>
            <div>
              <h2 className="font-bold text-gray-800 text-base">
                ২. বিল্ডিং সুবিধা (Facilities)
              </h2>
              <p className="text-xs text-gray-500">
                isParking, isLift, isGenerator switches
              </p>
            </div>
          </div>

          <CardContent className="p-5 grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* isParking */}
            <div className="bg-gray-50/80 p-4 rounded-xl border border-gray-200 flex items-center justify-between">
              <div>
                <Label className="text-xs font-bold text-gray-800 block flex items-center gap-1">
                  <Car size={14} className="text-purple-600" /> پارکিং সুবিধা (isParking)
                </Label>
                <span className="text-[11px] text-gray-500">
                  Parking facility available
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsParking(!isParking)}
                className={`w-12 h-6 rounded-full transition-colors p-1 cursor-pointer flex items-center ${
                  isParking
                    ? "bg-emerald-600 justify-end"
                    : "bg-gray-300 justify-start"
                }`}
              >
                <span className="w-4 h-4 bg-white rounded-full shadow-xs"></span>
              </button>
            </div>

            {/* isLift */}
            <div className="bg-gray-50/80 p-4 rounded-xl border border-gray-200 flex items-center justify-between">
              <div>
                <Label className="text-xs font-bold text-gray-800 block">
                  লিফট সুবিধা (isLift)
                </Label>
                <span className="text-[11px] text-gray-500">
                  Lift / Elevator available
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsLift(!isLift)}
                className={`w-12 h-6 rounded-full transition-colors p-1 cursor-pointer flex items-center ${
                  isLift
                    ? "bg-emerald-600 justify-end"
                    : "bg-gray-300 justify-start"
                }`}
              >
                <span className="w-4 h-4 bg-white rounded-full shadow-xs"></span>
              </button>
            </div>

            {/* isGenerator */}
            <div className="bg-gray-50/80 p-4 rounded-xl border border-gray-200 flex items-center justify-between">
              <div>
                <Label className="text-xs font-bold text-gray-800 block flex items-center gap-1">
                  <Zap size={14} className="text-amber-600" /> জেনারেটর (isGenerator)
                </Label>
                <span className="text-[11px] text-gray-500">
                  Power backup generator available
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsGenerator(!isGenerator)}
                className={`w-12 h-6 rounded-full transition-colors p-1 cursor-pointer flex items-center ${
                  isGenerator
                    ? "bg-emerald-600 justify-end"
                    : "bg-gray-300 justify-start"
                }`}
              >
                <span className="w-4 h-4 bg-white rounded-full shadow-xs"></span>
              </button>
            </div>
          </CardContent>
        </Card>

        {/* 3. Photo Upload (photo) */}
        <Card className="rounded-2xl border-gray-100 shadow-xs overflow-hidden">
          <div className="bg-blue-50/40 p-4 border-b border-gray-100 flex items-center gap-2">
            <div className="p-2 bg-blue-600 text-white rounded-lg">
              <ImageIcon size={18} />
            </div>
            <div>
              <h2 className="font-bold text-gray-800 text-base">
                ৩. বিল্ডিংয়ের ছবি (photo)
              </h2>
              <p className="text-xs text-gray-500">Upload or enter image URL</p>
            </div>
          </div>

          <CardContent className="p-5">
            <div className="flex items-center gap-4">
              {photoPreview ? (
                <img
                  src={photoPreview}
                  alt="Building Preview"
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-300 shadow-xs shrink-0"
                />
              ) : (
                <div className="w-16 h-16 rounded-2xl bg-gray-100 text-gray-400 flex items-center justify-center border border-gray-200 shrink-0">
                  <Building2 size={24} />
                </div>
              )}

              <div className="flex-1 space-y-2">
                <label className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white hover:bg-gray-100 text-xs font-bold text-gray-700 border border-gray-200 cursor-pointer shadow-2xs">
                  <Upload size={14} className="text-[#054a48]" /> ছবি ফাইল
                  সিলেক্ট করুন
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoFileChange}
                    className="hidden"
                  />
                </label>

                <Input
                  type="text"
                  placeholder="অথবা সরাসরি ছবির লিঙ্ক (URL) দিন..."
                  value={photo}
                  onChange={(e) => {
                    setPhoto(e.target.value);
                    setPhotoPreview(e.target.value);
                  }}
                  className="rounded-xl text-xs bg-white"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="p-4 bg-white rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={handleResetForm}
            className="text-red-600 hover:bg-red-50 border-red-200 font-semibold rounded-xl text-xs px-4 py-2.5 flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw size={15} /> রিসেট (Reset)
          </Button>

          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="text-gray-600 rounded-xl text-xs px-4 py-2.5 cursor-pointer"
            >
              বাতিল
            </Button>
            <Button
              type="submit"
              className="bg-[#054a48] hover:bg-[#085f5c] text-white font-extrabold rounded-xl text-xs px-6 py-2.5 shadow-md flex items-center gap-2 cursor-pointer"
            >
              <Save size={16} />{" "}
              {isEditMode
                ? "আপডেট করুন (Update Building)"
                : "সংরক্ষণ করুন (Save Building)"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
