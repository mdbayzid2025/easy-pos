import {
  ArrowLeft,
  Building2,
  CreditCard,
  DoorOpen,
  Download,
  Edit,
  FileCheck,
  FileText,
  FolderDown,
  Phone,
  Shield,
  User,
  Users,
} from "lucide-react";
import { useState } from "react";
import { Badge } from "../../ui/badge";
import { Button } from "../../ui/button";
import { imageUrl } from "../../../redux/base/baseAPI";
import type { Tenant } from "./types";

interface TenantDetailsProps {
  tenant: Tenant;
  onBackToList: () => void;
  onEditTenant: (tenant: Tenant) => void;
}

const formatFileUrl = (path?: string) => {
  if (!path) return "";
  const cleanPath = path.replace(/\\/g, "/");
  if (cleanPath.startsWith("http")) return cleanPath;
  return imageUrl + (cleanPath.startsWith("/") ? cleanPath : "/" + cleanPath);
};

export default function TenantDetails({
  tenant,
  onBackToList,
  onEditTenant,
}: TenantDetailsProps) {
  const [activeTab, setActiveTab] = useState<
    "general" | "family" | "invoices" | "payments" | "extra" | "documents"
  >("general");

  const bName = tenant.building?.name || tenant.buildingName || "---";
  const bAddress = tenant.building?.address || "---";
  const bPhone = tenant.building?.phoneNo || "---";

  const fNo = tenant.floor?.floorNo || "---";
  const uNo = tenant.unit?.flotNo || tenant.unitName || "---";

  const phone = tenant.phoneNo || tenant.phone || "---";
  const hasAccess = tenant.hasAccess ?? tenant.hasUserAccess ?? false;

  return (
    <div className="w-full space-y-6 pb-16">
      {/* Top Header Card */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-gray-100 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          {tenant.profileImg ? (
            <img
              src={formatFileUrl(tenant.profileImg)}
              alt={tenant.name}
              className="w-16 h-16 rounded-full object-cover border-2 border-emerald-300 shadow-sm shrink-0"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/default-avatar.png";
              }}
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-[#054a48] text-white font-extrabold flex items-center justify-center text-xl border-2 border-emerald-200 shrink-0 shadow-sm">
              {tenant.name.slice(0, 2).toUpperCase()}
            </div>
          )}

          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                TENANT PROFILE • {tenant.id || tenant._id}
              </span>
              <Badge
                variant="outline"
                className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs font-bold px-2.5 py-0.5"
              >
                • {tenant.status}
              </Badge>
              <Badge
                variant="outline"
                className={`text-xs font-bold px-2.5 py-0.5 ${
                  hasAccess
                    ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                    : "bg-gray-100 text-gray-600 border-gray-200"
                }`}
              >
                {hasAccess ? "Login Access Allowed" : "No Login Access"}
              </Badge>
            </div>

            <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight">
              {tenant.name}
            </h1>

            <div className="flex flex-wrap items-center gap-3 text-xs text-gray-600 font-medium mt-1">
              <span className="flex items-center gap-1 font-bold text-gray-800">
                <Building2 size={14} className="text-[#054a48]" /> {bName}
              </span>
              <span className="flex items-center gap-1 font-bold text-gray-800">
                <DoorOpen size={14} className="text-[#054a48]" /> Floor: {fNo} |
                Unit: {uNo}
              </span>
              <span className="flex items-center gap-1 font-bold text-gray-800">
                <Phone size={13} className="text-[#054a48]" /> {phone}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onBackToList}
            className="h-9 px-4 text-xs rounded-xl border-gray-200 text-gray-700 hover:bg-gray-100 font-bold cursor-pointer"
          >
            <ArrowLeft size={16} className="mr-1.5" /> ব্যাক (List)
          </Button>

          <Button
            size="sm"
            onClick={() => onEditTenant(tenant)}
            className="bg-[#054a48] hover:bg-[#033433] text-white text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
          >
            <Edit size={14} /> এডিট করুন (Edit Tenant)
          </Button>
        </div>
      </div>

      {/* Main Grid Layout (Left Sidebar + Right Content Area) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Sidebar Info Cards (4 Cols) */}
        <div className="lg:col-span-3 space-y-4">
          {/* Quick Details Card */}
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs space-y-4">
            <h3 className="text-xs font-extrabold text-gray-800 uppercase tracking-wider flex items-center gap-2 border-b border-gray-100 pb-2.5">
              <User size={15} className="text-[#054a48]" /> Quick Overview
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-[10px] font-semibold text-gray-400 block">
                  ফোন নম্বর (phoneNo)
                </span>
                <span className="font-bold text-gray-900 block mt-0.5">
                  {phone}
                </span>
              </div>

              <div>
                <span className="text-[10px] font-semibold text-gray-400 block">
                  ইমেইল (email)
                </span>
                <span className="font-bold text-gray-900 block mt-0.5 truncate">
                  {tenant.email || "---"}
                </span>
              </div>

              <div>
                <span className="text-[10px] font-semibold text-gray-400 block">
                  ইউজার অ্যাকাউন্ট অ্যাক্সেস
                </span>
                <span
                  className={`font-extrabold inline-block mt-0.5 text-xs ${
                    hasAccess ? "text-emerald-700" : "text-gray-500"
                  }`}
                >
                  {hasAccess ? "✓ Access Enabled" : "✕ Access Disabled"}
                </span>
              </div>

              <div>
                <span className="text-[10px] font-semibold text-gray-400 block">
                  স্থায়ী ঠিকানা
                </span>
                <span className="font-bold text-gray-900 block mt-0.5 leading-relaxed">
                  {tenant.permanentAddress || "---"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Main Content Area (9 Cols) */}
        <div className="lg:col-span-9 space-y-6">
          {/* Main Horizontal Tab Navigation Bar */}
          <div className="bg-white p-2 rounded-2xl border border-gray-100 shadow-xs flex flex-wrap items-center gap-2 text-xs font-bold overflow-x-auto">
            <button
              onClick={() => setActiveTab("general")}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all cursor-pointer ${
                activeTab === "general"
                  ? "bg-[#054a48] text-white shadow-md font-bold"
                  : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 font-semibold"
              }`}
            >
              <User size={15} /> জেনারেল (Users Schema)
            </button>

            <button
              onClick={() => setActiveTab("family")}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all cursor-pointer ${
                activeTab === "family"
                  ? "bg-[#054a48] text-white shadow-md font-bold"
                  : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 font-semibold"
              }`}
            >
              <Users size={15} /> পরিবারের সদস্য (
              {tenant.familyMembers?.length || 0})
            </button>

            <button
              onClick={() => setActiveTab("documents")}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all cursor-pointer ${
                activeTab === "documents"
                  ? "bg-[#054a48] text-white shadow-md font-bold"
                  : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 font-semibold"
              }`}
            >
              <FolderDown size={15} /> Documents (PDF)
            </button>

            <button
              onClick={() => setActiveTab("invoices")}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all cursor-pointer ${
                activeTab === "invoices"
                  ? "bg-[#054a48] text-white shadow-md font-bold"
                  : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 font-semibold"
              }`}
            >
              <FileText size={15} /> ইনভয়েস
            </button>

            <button
              onClick={() => setActiveTab("payments")}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all cursor-pointer ${
                activeTab === "payments"
                  ? "bg-[#054a48] text-white shadow-md font-bold"
                  : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 font-semibold"
              }`}
            >
              <CreditCard size={15} /> পেমেন্টস
            </button>
          </div>

          {/* TAB 1: General Tab Content */}
          {activeTab === "general" && (
            <div className="space-y-6">
              {/* Sub-cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 1. মৌলিক তথ্য (Users Schema) */}
                <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-xs space-y-3">
                  <h4 className="text-xs font-bold text-gray-800 flex items-center gap-1.5 border-b border-gray-100 pb-2">
                    <User size={14} className="text-[#054a48]" /> Users Schema
                    Profile Info
                  </h4>
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-gray-50/80">
                      <span className="font-semibold text-gray-500">
                        নাম (name)
                      </span>
                      <span className="font-bold text-gray-900">
                        {tenant.name}
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-gray-50/80">
                      <span className="font-semibold text-gray-500">
                        ফোন (phoneNo)
                      </span>
                      <span className="font-bold text-gray-900">{phone}</span>
                    </div>

                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-gray-50/80">
                      <span className="font-semibold text-gray-500">
                        ইমেইল (email)
                      </span>
                      <span className="font-bold text-gray-900">
                        {tenant.email || "---"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-gray-50/80">
                      <span className="font-semibold text-gray-500">
                        এনআইডি নম্বর (nidNo)
                      </span>
                      <span className="font-bold text-gray-900">
                        {tenant.nidNo || "---"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-gray-50/80">
                      <span className="font-semibold text-gray-500">
                        পিতার নাম (fatherName)
                      </span>
                      <span className="font-bold text-gray-900">
                        {tenant.fatherName || "---"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-gray-50/80">
                      <span className="font-semibold text-gray-500">
                        মাতার নাম (motherName)
                      </span>
                      <span className="font-bold text-gray-900">
                        {tenant.motherName || "---"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-gray-50/80">
                      <span className="font-semibold text-gray-500">
                        বৈবাহিক অবস্থা (maritalStatus)
                      </span>
                      <span className="font-bold text-gray-900">
                        {tenant.maritalStatus || "Single"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-gray-50/80">
                      <span className="font-semibold text-gray-500">
                        প্যানেল অ্যাক্সেস (hasAccess)
                      </span>
                      <span
                        className={`font-bold ${hasAccess ? "text-emerald-700" : "text-gray-500"}`}
                      >
                        {hasAccess ? "true (Allowed)" : "false (Disabled)"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 2. Building, Floor & Unit Objects */}
                <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-xs space-y-3">
                  <h4 className="text-xs font-bold text-gray-800 flex items-center gap-1.5 border-b border-gray-100 pb-2">
                    <Building2 size={14} className="text-[#054a48]" /> Building,
                    Floor & Unit Assignment
                  </h4>
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-gray-50/80">
                      <span className="font-semibold text-gray-500">
                        ভবনের নাম (building.name)
                      </span>
                      <span className="font-bold text-gray-900">{bName}</span>
                    </div>

                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-gray-50/80">
                      <span className="font-semibold text-gray-500">
                        ভবনের ঠিকানা (building.address)
                      </span>
                      <span className="font-bold text-gray-900">
                        {bAddress}
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-gray-50/80">
                      <span className="font-semibold text-gray-500">
                        ভবনের ফোন (building.phoneNo)
                      </span>
                      <span className="font-bold text-gray-900">{bPhone}</span>
                    </div>

                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-gray-50/80">
                      <span className="font-semibold text-gray-500">
                        ফ্লোর নম্বর (floor.floorNo)
                      </span>
                      <span className="font-bold text-[#054a48]">{fNo}</span>
                    </div>

                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-gray-50/80">
                      <span className="font-semibold text-gray-500">
                        ইউনিট/ফ্ল্যাট (unit.flotNo)
                      </span>
                      <span className="font-extrabold text-gray-900 px-2.5 py-0.5 bg-gray-200 rounded-md">
                        {uNo}
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-gray-50/80">
                      <span className="font-semibold text-gray-500">
                        স্থায়ী ঠিকানা (permanentAddress)
                      </span>
                      <span className="font-bold text-gray-900 leading-normal">
                        {tenant.permanentAddress || "---"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 3. Emergency Contact */}
                <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-xs space-y-3 md:col-span-2">
                  <h4 className="text-xs font-bold text-gray-800 flex items-center gap-1.5 border-b border-gray-100 pb-2">
                    <Shield size={14} className="text-[#054a48]" /> Emergency
                    Contact Details
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                    <div className="p-3 rounded-xl bg-gray-50/80 border border-gray-100">
                      <span className="text-[10px] font-semibold text-gray-400 block">
                        নাম
                      </span>
                      <span className="font-bold text-gray-900 block mt-0.5">
                        {tenant.emergencyContact?.name || "---"}
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-gray-50/80 border border-gray-100">
                      <span className="text-[10px] font-semibold text-gray-400 block">
                        মোবাইল (phoneNo)
                      </span>
                      <span className="font-bold text-gray-900 block mt-0.5">
                        {tenant.emergencyContact?.phoneNo ||
                          tenant.emergencyContact?.mobile ||
                          "---"}
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-gray-50/80 border border-gray-100">
                      <span className="text-[10px] font-semibold text-gray-400 block">
                        সম্পর্ক (relation)
                      </span>
                      <span className="font-bold text-gray-900 block mt-0.5">
                        {tenant.emergencyContact?.relation || "---"}
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-gray-50/80 border border-gray-100">
                      <span className="text-[10px] font-semibold text-gray-400 block">
                        ঠিকানা (address)
                      </span>
                      <span className="font-bold text-gray-900 block mt-0.5">
                        {tenant.emergencyContact?.address || "---"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Family Members Tab Content */}
          {activeTab === "family" && (
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-3">
                <Users size={16} className="text-[#054a48]" /> পরিবারের সদস্যরা
                (familyMembers Array)
              </h3>

              {tenant.familyMembers && tenant.familyMembers.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-gray-100/80 border-b border-gray-200 text-gray-700 font-bold uppercase">
                        <th className="p-3">ID (_id)</th>
                        <th className="p-3">নাম (name)</th>
                        <th className="p-3">বয়স (age)</th>
                        <th className="p-3">পেশা (occupation)</th>
                        <th className="p-3">সম্পর্ক (relation)</th>
                        <th className="p-3">মোবাইল (phoneNo)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {tenant.familyMembers.map((m, idx) => (
                        <tr
                          key={m._id || m.id || idx}
                          className="hover:bg-gray-50"
                        >
                          <td className="p-3 font-semibold text-gray-400">
                            {m._id || m.id || `fam-${idx + 1}`}
                          </td>
                          <td className="p-3 font-bold text-gray-900">
                            {m.name}
                          </td>
                          <td className="p-3 font-medium text-gray-700">
                            {m.age} বছর
                          </td>
                          <td className="p-3 font-medium text-gray-700">
                            {m.occupation}
                          </td>
                          <td className="p-3 font-bold text-emerald-800">
                            {m.relation}
                          </td>
                          <td className="p-3 font-medium text-gray-700">
                            {m.phoneNo || m.mobile || "---"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-xs text-gray-400 text-center py-8 bg-gray-50/50 rounded-xl border border-dashed border-gray-200">
                  কোনো পরিবারের সদস্যের তথ্য রেকর্ড করা নেই।
                </p>
              )}
            </div>
          )}

          {/* TAB 3: Documents Tab Content */}
          {activeTab === "documents" && (
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs space-y-4 min-h-[300px]">
              <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-3">
                <FolderDown size={16} className="text-[#054a48]" /> Attached
                Documents (documents PDF)
              </h3>

              {tenant.documents ? (
                <div className="space-y-4">
                  <div className="p-4 bg-emerald-50/60 border border-emerald-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="p-3 bg-red-100 text-red-600 rounded-xl font-extrabold shrink-0">
                        <FileCheck size={24} />
                      </div>
                      <div className="overflow-hidden">
                        <h4 className="text-xs font-bold text-gray-900 truncate">
                          {formatFileUrl(tenant.documents).split("/").pop() || "Document Attached"}
                        </h4>
                        <p className="text-[11px] text-gray-500 mt-0.5">
                          PDF / Image Document attached to tenant record
                        </p>
                      </div>
                    </div>

                    <a
                      href={formatFileUrl(tenant.documents)}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#054a48] text-white font-bold rounded-xl text-xs hover:bg-[#033433] transition-colors shadow-xs shrink-0"
                    >
                      <Download size={14} /> View in New Tab / Download
                    </a>
                  </div>

                  {/* Document Viewer Frame (Desktop Only) */}
                  <div className="hidden md:flex w-full bg-slate-100/70 border border-slate-200 rounded-2xl p-2 sm:p-4 flex-col items-center justify-center min-h-[450px]">
                    {tenant.documents.toLowerCase().includes(".pdf") ? (
                      <object
                        data={formatFileUrl(tenant.documents)}
                        type="application/pdf"
                        className="w-full h-[650px] rounded-xl border border-gray-300 shadow-sm"
                      >
                        <iframe
                          src={formatFileUrl(tenant.documents)}
                          className="w-full h-[650px] rounded-xl border border-gray-300 shadow-sm"
                          title="PDF Document Viewer"
                        />
                      </object>
                    ) : (
                      <img
                        src={formatFileUrl(tenant.documents)}
                        alt="Attached Document"
                        className="max-w-full max-h-[650px] object-contain rounded-xl border border-gray-300 shadow-sm"
                        onError={(e) => {
                          (e.target as HTMLImageElement).alt = "Could not load document preview.";
                        }}
                      />
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 border-2 border-dashed border-gray-200 rounded-2xl text-center space-y-3 bg-gray-50/50">
                  <FolderDown size={48} className="text-gray-300 stroke-1" />
                  <p className="text-xs font-bold text-gray-500">
                    No PDF documents attached for this tenant.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Fallback for other tabs */}
          {(activeTab === "invoices" ||
            activeTab === "payments" ||
            activeTab === "extra") && (
            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-xs text-center space-y-2">
              <FileText size={36} className="mx-auto text-gray-300" />
              <p className="text-sm font-bold text-gray-700">
                {activeTab === "invoices"
                  ? "ইনভয়েস তথ্য শীঘ্রই আপডেট করা হবে"
                  : activeTab === "payments"
                    ? "পেমেন্ট হিস্ট্রি সম্বলিত রেকর্ড"
                    : "অতিরিক্ত তথ্য সংক্রান্ত বিবরণ"}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
