import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Check,
  UploadCloud,
} from "lucide-react";

export const AddSupplierPage: React.FC = () => {
  const navigate = useNavigate();

  // Form states matching Image 2
  const [supplierName, setSupplierName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [alternativePhone, setAlternativePhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("Dhaka");
  const [supplierType, setSupplierType] = useState("Wholesaler / Manufacturer");
  const [notes, setNotes] = useState("");

  const [openingDue, setOpeningDue] = useState("0.00");
  const [creditLimit, setCreditLimit] = useState("500000.00");
  const [paymentTerms, setPaymentTerms] = useState("Net 30");
  const [preferredPaymentMethod, setPreferredPaymentMethod] =
    useState("Bank Transfer");
  const [isActive, setIsActive] = useState(true);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      navigate("/suppliers");
    }, 1500);
  };

  return (
    <div className="w-full min-h-screen bg-[#F7F9FB] p-4 sm:p-6 lg:p-7 space-y-5">
      {/* 1. Header & Breadcrumbs & Action Buttons */}
      <form onSubmit={handleSave} className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium mb-1">
              <Link to="/" className="hover:text-slate-600 transition-colors">
                Dashboard
              </Link>
              <span>/</span>
              <Link
                to="/suppliers"
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                Suppliers
              </Link>
              <span>/</span>
              <span className="text-slate-600 font-semibold">
                Add New Supplier
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Add New Supplier
            </h1>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => navigate("/suppliers")}
              className="h-9 px-4 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg shadow-2xs transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="h-9 px-4 bg-[#16a34a] hover:bg-[#15803d] text-white text-xs font-bold rounded-lg flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
            >
              <Check size={14} />
              <span>Save Supplier</span>
            </button>
          </div>
        </div>

        {isSuccess && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-2">
            <Check size={16} className="text-emerald-600" />
            <span>Supplier created successfully! Redirecting to supplier list...</span>
          </div>
        )}

        {/* 2. Main Two Column Layout matching Image 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Left Column (7 cols): Supplier Information */}
          <div className="lg:col-span-7 bg-white rounded-xl p-4 sm:p-5 border border-slate-200/80 shadow-2xs space-y-4">
            <h2 className="text-xs font-bold text-slate-900 tracking-tight">
              Supplier Information
            </h2>

            {/* Supplier Name */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Supplier Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={supplierName}
                onChange={(e) => setSupplierName(e.target.value)}
                placeholder="e.g., Mizanur Rahman"
                className="w-full h-9 px-3 text-xs bg-white border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Company Name */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Company Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="e.g., Meghna Group"
                className="w-full h-9 px-3 text-xs bg-white border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Phone & Alt Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Phone Number <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="e.g., +880 1712-345678"
                  className="w-full h-9 px-3 text-xs bg-white border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Alternative Phone
                </label>
                <input
                  type="text"
                  value={alternativePhone}
                  onChange={(e) => setAlternativePhone(e.target.value)}
                  placeholder="e.g., +880 1819-234567"
                  className="w-full h-9 px-3 text-xs bg-white border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g., mizan.meghna@group.com"
                className="w-full h-9 px-3 text-xs bg-white border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Address */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Address <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="e.g., House 12, Road 4, Sector 3"
                className="w-full h-9 px-3 text-xs bg-white border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* City & Supplier Type */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  City <span className="text-rose-500">*</span>
                </label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full h-9 px-3 text-xs bg-white border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:border-emerald-500 cursor-pointer"
                >
                  <option value="Dhaka">Dhaka</option>
                  <option value="Chittagong">Chittagong</option>
                  <option value="Sylhet">Sylhet</option>
                  <option value="Rajshahi">Rajshahi</option>
                  <option value="Khulna">Khulna</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Supplier Type
                </label>
                <select
                  value={supplierType}
                  onChange={(e) => setSupplierType(e.target.value)}
                  className="w-full h-9 px-3 text-xs bg-white border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:border-emerald-500 cursor-pointer"
                >
                  <option value="Wholesaler / Manufacturer">
                    Wholesaler / Manufacturer
                  </option>
                  <option value="Distributor">Distributor</option>
                  <option value="Importer">Importer</option>
                </select>
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Notes
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add supplier notes, delivery schedule, etc..."
                rows={3}
                className="w-full p-2.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500 resize-none"
              />
            </div>
          </div>

          {/* Right Column (5 cols): Financial Information */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200/80 shadow-2xs space-y-4">
              <h2 className="text-xs font-bold text-slate-900 tracking-tight">
                Financial Information
              </h2>

              {/* Opening Due & Credit Limit */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Opening Due (৳) <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-xs text-slate-400 font-bold">
                      ৳
                    </span>
                    <input
                      type="number"
                      value={openingDue}
                      onChange={(e) => setOpeningDue(e.target.value)}
                      className="w-full h-9 pl-7 pr-3 text-xs bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Credit Limit (৳)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-xs text-slate-400 font-bold">
                      ৳
                    </span>
                    <input
                      type="number"
                      value={creditLimit}
                      onChange={(e) => setCreditLimit(e.target.value)}
                      className="w-full h-9 pl-7 pr-3 text-xs bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Terms & Preferred Payment Method */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Payment Terms
                  </label>
                  <select
                    value={paymentTerms}
                    onChange={(e) => setPaymentTerms(e.target.value)}
                    className="w-full h-9 px-3 text-xs bg-white border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:border-emerald-500 cursor-pointer"
                  >
                    <option value="Net 30">Net 30</option>
                    <option value="Net 15">Net 15</option>
                    <option value="Due on Receipt">Due on Receipt</option>
                    <option value="Net 45">Net 45</option>
                    <option value="COD">COD</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Preferred Payment Method
                  </label>
                  <select
                    value={preferredPaymentMethod}
                    onChange={(e) => setPreferredPaymentMethod(e.target.value)}
                    className="w-full h-9 px-3 text-xs bg-white border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:border-emerald-500 cursor-pointer"
                  >
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="Cash">Cash</option>
                    <option value="bKash">bKash</option>
                    <option value="Cheque">Cheque</option>
                  </select>
                </div>
              </div>

              {/* Logo / Document Upload Box matching Image 2 */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1.5">
                  Supplier Logo / Document Upload
                </label>
                <label className="border-2 border-dashed border-slate-200 hover:border-emerald-400 rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-colors bg-slate-50/50 hover:bg-emerald-50/20 group">
                  <input
                    type="file"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setUploadedFile(e.target.files[0]);
                      }
                    }}
                  />
                  <UploadCloud
                    size={28}
                    className="text-slate-400 group-hover:text-emerald-500 mb-2 transition-colors"
                  />
                  <span className="text-xs font-bold text-slate-700 group-hover:text-emerald-600 block">
                    {uploadedFile ? uploadedFile.name : "Supplier Logo / Document Upload"}
                  </span>
                  <span className="text-[10px] text-slate-400 mt-1">
                    Drag and drop or click to upload (PNG, JPG, PDF, max 5MB)
                  </span>
                </label>
              </div>

              {/* Supplier Status Toggle matching Image 2 */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold text-slate-700 block">
                    Supplier Status
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {isActive ? "Active in system" : "Inactive (hidden from new orders)"}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setIsActive(!isActive)}
                  className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                    isActive ? "bg-[#16a34a]" : "bg-slate-300"
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                      isActive ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Bottom Buttons */}
            <div className="flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => navigate("/suppliers")}
                className="h-9 px-4 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg shadow-2xs transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="h-9 px-4 bg-[#16a34a] hover:bg-[#15803d] text-white text-xs font-bold rounded-lg flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
              >
                <Check size={14} />
                <span>Save Supplier</span>
              </button>
            </div>
          </div>
        </div>
      </form>

      {/* Footer Branding */}
      <div className="text-center text-[11px] text-slate-400 py-1">
        v2.4.1 copyright © 2021
      </div>
    </div>
  );
};

export default AddSupplierPage;

