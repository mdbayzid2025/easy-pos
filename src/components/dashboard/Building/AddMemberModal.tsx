import React, { useState, useEffect } from "react";
import {
  X,
  UserCheck,
  Plus,
  Building2,
  Phone,
  Briefcase,
  User,
} from "lucide-react";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { toast } from "sonner";
import { useAddManagementMutation } from "../../../redux/features/management/managementApi";
import type { BuildingInfo } from "./types";

export interface ManagementMemberPayload {
  name: string;
  role: string;
  mobile: string;
  building?: {
    _id?: string;
    name?: string;
    address?: string;
    contact?: string;
  };
}

interface AddMemberModalProps {
  isOpen: boolean;
  building?: BuildingInfo | null;
  onClose: () => void;
  onSaveMember?: (memberData: ManagementMemberPayload) => void;
}

export default function AddMemberModal({
  isOpen,
  building,
  onClose,
  onSaveMember,
}: AddMemberModalProps) {
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [mobile, setMobile] = useState("");

  const [addManagement, { isLoading }] = useAddManagementMutation();

  useEffect(() => {
    if (!isOpen) {
      setName("");
      setRole("কেয়ারটেকার / ম্যানেজার");
      setMobile("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("অনুগ্রহ করে স্টাফের নাম প্রদান করুন (Name is required)!");
      return;
    }

    if (!role.trim()) {
      toast.error("অনুগ্রহ করে পদবী / রোল প্রদান করুন (Role is required)!");
      return;
    }

    if (!mobile.trim()) {
      toast.error(
        "অনুগ্রহ করে মোবাইল নম্বর প্রদান করুন (Mobile number is required)!",
      );
      return;
    }

    const payload: ManagementMemberPayload = {
      name: name.trim(),
      role: role.trim(),
      mobile: mobile.trim(),
      building: building
        ? {
            _id: building._id,
            name: building.name,
            address: building.address,
            contact: building.phoneNo,
          }
        : undefined,
    };

    try {
      await addManagement(payload).unwrap();
      toast.success(`ম্যানাজমেন্ট মেম্বার "${name}" সফলভাবে যোগ করা হয়েছে!`);
      if (onSaveMember) {
        onSaveMember(payload);
      }
      onClose();
    } catch (error: any) {
      toast.error(error?.data?.message || "মেম্বার যুক্ত করতে সমস্যা হয়েছে!");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 space-y-5 border border-gray-100 max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 bg-[#054a48] text-white rounded-xl">
              <UserCheck size={18} />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-gray-900">
                নতুন মেম্বার যোগ করুন (Add Member)
              </h3>
              <p className="text-xs text-gray-500 font-semibold mt-0.5">
                বিল্ডিং: {building?.name || "ভবন"}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Member Name */}
          <div>
            <Label className="text-xs font-bold text-gray-700 mb-1.5 block flex items-center gap-1">
              <User size={14} className="text-[#054a48]" /> মেম্বারের নাম (name){" "}
              <span className="text-red-500">*</span>
            </Label>
            <Input
              type="text"
              required
              placeholder="যেমন: সেলিম রেজা"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="rounded-xl text-sm font-semibold"
            />
          </div>

          {/* Member Role */}
          <div>
            <Label className="text-xs font-bold text-gray-700 mb-1.5 block flex items-center gap-1">
              <Briefcase size={14} className="text-[#054a48]" /> পদবী / রোল
              (role) <span className="text-red-500">*</span>
            </Label>
            <Input
              type="text"
              required
              placeholder="পদবী লিখুন..."
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="rounded-xl text-sm mt-1"
            />
          </div>

          {/* Member Mobile */}
          <div>
            <Label className="text-xs font-bold text-gray-700 mb-1.5 block flex items-center gap-1">
              <Phone size={14} className="text-[#054a48]" /> মোবাইল নম্বর
              (mobile) <span className="text-red-500">*</span>
            </Label>
            <Input
              type="tel"
              required
              placeholder="e.g. 01700000000"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              className="rounded-xl text-sm font-semibold"
            />
          </div>

          {/* Associated Building Info Preview */}
          {building && (
            <div className="p-3 bg-emerald-50 rounded-xl text-xs text-[#054a48] space-y-1">
              <div className="font-bold flex items-center gap-1">
                <Building2 size={14} /> লিঙ্ককৃত বিল্ডিং (Building Info):
              </div>
              <div>নাম: {building.name || "N/A"}</div>
              <div>ঠিকানা: {building.address || "N/A"}</div>
              <div>যোগাযোগ: {building.phoneNo || "N/A"}</div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="text-gray-600 text-xs font-semibold rounded-xl px-4 py-2 cursor-pointer"
            >
              বাতিল (Cancel)
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-[#054a48] hover:bg-[#033433] text-white text-xs font-bold px-5 py-2 rounded-xl shadow-md cursor-pointer flex items-center gap-1.5"
            >
              <Plus size={16} />{" "}
              {isLoading ? "সংরক্ষণ হচ্ছে..." : "মেম্বার যুক্ত করুন"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
