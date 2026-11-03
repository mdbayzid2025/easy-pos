import {
  Calculator,
  CheckCircle2,
  ChevronDown,
  DollarSign,
  Loader2,
  Save,
  Search,
  User,
  X,
  Zap,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useGetTenantsMutation } from "../../../redux/features/tenant/tenantApi";
import { useGetUtilitiesQuery } from "../../../redux/features/utility/utilityApi";
import { Button } from "../../ui/button";
import { type IncomeRecord } from "./IncomeDetailsModal";
import type { Utility } from "../../../types/utility";

interface IncomeFormModalProps {
  isOpen: boolean;
  editingIncome: IncomeRecord | null;
  onClose: () => void;
  onSaveIncome: (data: any) => Promise<void>;
}

export default function IncomeFormModal({
  isOpen,
  editingIncome,
  onClose,
  onSaveIncome,
}: IncomeFormModalProps) {
  const isEdit = Boolean(editingIncome);

  // Separate Query for utility calculation defaults (with its own dedicated loading state)
  const {
    data: apiUtilitiesData,
    isLoading: isUtilitiesLoading,
    isFetching: isUtilitiesFetching,
  } = useGetUtilitiesQuery(
    {
      pagination: { pageSize: 1, currentPage: 1 },
      filter: { isDelete: false },
      sort: { createdAt: -1 },
    },
    { refetchOnMountOrArgChange: true },
  );

  const latestUtility: Utility | undefined = apiUtilitiesData?.data?.[0];
  const isUtilityRatesLoading = isUtilitiesLoading || isUtilitiesFetching;

  // Single on-demand search API for tenants (by unit no, name, etc.)
  const [getTenantsApi, { isLoading: isSearchingTenants }] =
    useGetTenantsMutation();

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [debouncedSearch, setDebouncedSearch] = useState<string>("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Selected Tenant & Property Info
  const [tenantProfile, setTenantProfile] = useState<any>(null);
  const [selectedTenantId, setSelectedTenantId] = useState<string>("");
  const [selectedBuildingId, setSelectedBuildingId] = useState<string>("");
  const [buildingName, setBuildingName] = useState<string>("");
  const [floorNo, setFloorNo] = useState<number>(1);
  const [unitNo, setUnitNo] = useState<string>("");

  // Dates & Month/Year
  const currentDate = new Date();
  const monthsList = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const currentMonthName = monthsList[currentDate.getMonth()];
  const currentYearNum = currentDate.getFullYear();

  const [month, setMonth] = useState<string>(currentMonthName);
  const [year, setYear] = useState<number>(currentYearNum);
  const [dateString, setDateString] = useState<string>(
    new Date().toISOString().split("T")[0],
  );

  // Financial fields
  const [previousDue, setPreviousDue] = useState<number>(0);
  const [baseFare, setBaseFare] = useState<number>(0);
  const [advanced, setAdvanced] = useState<number>(0);
  const [liftBill, setLiftBill] = useState<number>(
    Number(latestUtility?.liftBill) || 0,
  );
  const [gasBill, setGasBill] = useState<number>(
    Number(latestUtility?.gasBill) || 0,
  );
  const [garageBill, setGarageBill] = useState<number>(
    Number(latestUtility?.garageBill) || 0,
  );
  const [discount, setDiscount] = useState<number>(0);

  // Checkboxes for exempting utility charges (প্রযোজ্য নয়)
  const [noLiftBill, setNoLiftBill] = useState<boolean>(false);
  const [noGasBill, setNoGasBill] = useState<boolean>(false);
  const [noGarageBill, setNoGarageBill] = useState<boolean>(false);

  // Electricity Meter
  const [previousUnit, setPreviousUnit] = useState<number>(0);
  const [currentUnit, setCurrentUnit] = useState<number>(0);
  const [rate, setRate] = useState<number>(
    Number(latestUtility?.electricityBill) || 11,
  );

  // Received Amount
  const [totalReceived, setTotalReceived] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Debounce search input (300ms delay)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Close search dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Reset all form fields to default
  const resetForm = () => {
    setSearchQuery("");
    setDebouncedSearch("");
    setSearchResults([]);
    setIsDropdownOpen(false);
    setTenantProfile(null);
    setSelectedTenantId("");
    setSelectedBuildingId("");
    setBuildingName("");
    setFloorNo(1);
    setUnitNo("");
    setMonth(currentMonthName);
    setYear(currentYearNum);
    setDateString(new Date().toISOString().split("T")[0]);
    setPreviousDue(0);
    setBaseFare(0);
    setAdvanced(0);
    setLiftBill(Number(latestUtility?.liftBill) || 0);
    setGasBill(Number(latestUtility?.gasBill) || 0);
    setGarageBill(Number(latestUtility?.garageBill) || 0);
    setDiscount(0);
    setNoLiftBill(false);
    setNoGasBill(false);
    setNoGarageBill(false);
    setPreviousUnit(0);
    setCurrentUnit(0);
    setRate(Number(latestUtility?.electricityBill) || 11);
    setTotalReceived(0);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  // Reset form whenever modal closes
  useEffect(() => {
    if (!isOpen) {
      resetForm();
    }
  }, [isOpen]);

  // Apply tenant and utility defaults when a tenant is selected
  const applyTenantDefaults = (tenant: any, utilityData?: Utility) => {
    if (!tenant) return;
    setTenantProfile(tenant);
    setSelectedTenantId(tenant._id || tenant.id || "");

    if (tenant.building?._id) {
      setSelectedBuildingId(tenant.building._id);
    }
    if (tenant.building?.name) {
      setBuildingName(tenant.building.name);
    }

    const fNo = Number(tenant.floor?.floorNo) || 1;
    setFloorNo(fNo);

    const uNumber = tenant.unit?.unitNo || tenant.unit?.flotNo || "";
    if (uNumber) {
      setUnitNo(uNumber);
    }

    const uBaseFare =
      Number(tenant.unit?.baseRent || tenant.unit?.baseFare) || 0;
    setBaseFare(uBaseFare);

    const utility = utilityData || latestUtility;
    if (utility) {
      // Floor 1-3 lift bill rule
      if (fNo <= 3) {
        setLiftBill(0);
        setNoLiftBill(true);
      } else {
        const uLift = Number(tenant.unit?.liftBill);
        const lBill = uLift > 0 ? uLift : Number(utility.liftBill) || 0;
        setLiftBill(lBill);
        setNoLiftBill(lBill === 0);
      }

      const uGas = Number(tenant.unit?.gasBill);
      const gBill = uGas > 0 ? uGas : Number(utility.gasBill) || 0;
      setGasBill(gBill);
      setNoGasBill(gBill === 0);

      const uGarage = Number(tenant.unit?.garageBill);
      const grgBill = uGarage > 0 ? uGarage : Number(utility.garageBill) || 0;
      setGarageBill(grgBill);
      setNoGarageBill(grgBill === 0);

      if (utility.electricityBill) {
        setRate(Number(utility.electricityBill));
      }
    }
  };

  // Handle selecting a tenant from dropdown
  const handleSelectTenant = (tenant: any) => {
    applyTenantDefaults(tenant, latestUtility);
    const uNo = tenant.unit?.unitNo || tenant.unit?.flotNo || "";
    setSearchQuery(uNo ? `${uNo} - ${tenant.name || ""}` : tenant.name || "");
    setIsDropdownOpen(false);
  };

  // Trigger tenant search when user types in search input
  useEffect(() => {
    async function searchTenants() {
      if (!isOpen || !debouncedSearch.trim()) {
        setSearchResults([]);
        return;
      }
      try {
        const payload: any = {
          search: debouncedSearch.trim(),
          q: debouncedSearch.trim(),
          pagination: { pageSize: 15, currentPage: 1 },
          select: {
            name: 1,
            phoneNo: 1,
            username: 1,
            email: 1,
            profileImg: 1,
            hasAccess: 1,
            role: 1,
            building: 1,
            floor: 1,
            unit: 1,
            createdAt: 1,
          },
        };
        const res = await getTenantsApi(payload).unwrap();
        if (res?.data && Array.isArray(res.data)) {
          const s = debouncedSearch.trim().toLowerCase();
          const filtered = res.data.filter((t: any) => {
            const uNo = (t.unit?.unitNo || t.unit?.flotNo || "").toLowerCase();
            const name = (t.name || "").toLowerCase();
            const phone = (t.phoneNo || t.username || "").toLowerCase();
            const bName = (t.building?.name || "").toLowerCase();
            return (
              uNo.includes(s) ||
              name.includes(s) ||
              phone.includes(s) ||
              bName.includes(s)
            );
          });
          setSearchResults(filtered);
          setIsDropdownOpen(true);
        }
      } catch (err) {
        console.error("Failed to search tenants:", err);
      }
    }

    if (isOpen && debouncedSearch.trim()) {
      searchTenants();
    }
  }, [getTenantsApi, debouncedSearch, isOpen]);

  // Sync edit mode data when editingIncome is provided
  useEffect(() => {
    if (isOpen && editingIncome) {
      if (editingIncome.user) {
        setTenantProfile(editingIncome.user);
        setSelectedTenantId(editingIncome.user._id || "");
        setSearchQuery(
          editingIncome.unit?.unitNo
            ? `${editingIncome.unit.unitNo} - ${editingIncome.user.name || ""}`
            : editingIncome.user.name || "",
        );
      }
      if (editingIncome.building) {
        setSelectedBuildingId(editingIncome.building._id || "");
        setBuildingName(editingIncome.building.name || "");
      }
      if (editingIncome.floor?.floorNo) {
        setFloorNo(Number(editingIncome.floor.floorNo));
      }
      if (editingIncome.unit?.unitNo) {
        setUnitNo(editingIncome.unit.unitNo);
      }
      setTotalReceived(editingIncome.totalReceived || 0);
      setPreviousDue(editingIncome.previousDue || 0);
      setBaseFare(editingIncome.baseFare || 0);
      setAdvanced(editingIncome.advanced || 0);
      setLiftBill(editingIncome.liftBill || 0);
      setGasBill(editingIncome.gasBill || 0);
      setGarageBill(editingIncome.garageBill || 0);
      setDiscount(editingIncome.discount || 0);
      setNoLiftBill((editingIncome.liftBill || 0) === 0);
      setNoGasBill((editingIncome.gasBill || 0) === 0);
      setNoGarageBill((editingIncome.garageBill || 0) === 0);
      setPreviousUnit(editingIncome.previousUnit || 0);
      setCurrentUnit(editingIncome.currentUnit || 0);
      setRate(editingIncome.rate || 11);
      setMonth(editingIncome.month || currentMonthName);
      setYear(editingIncome.year || currentYearNum);
      if (editingIncome.dateString) setDateString(editingIncome.dateString);
    }
  }, [isOpen, editingIncome]);

  // Track whether utility defaults have been synchronized for the active modal session
  const hasAppliedUtilityDefaultsRef = useRef(false);

  // Synchronize utility rates into form when modal opens or latestUtility loads in Add Mode
  useEffect(() => {
    if (!isOpen) {
      hasAppliedUtilityDefaultsRef.current = false;
      return;
    }

    if (!isEdit && latestUtility && !hasAppliedUtilityDefaultsRef.current) {
      hasAppliedUtilityDefaultsRef.current = true;
      if (!tenantProfile) {
        if (!noLiftBill) setLiftBill(Number(latestUtility.liftBill) || 0);
        if (!noGasBill) setGasBill(Number(latestUtility.gasBill) || 0);
        if (!noGarageBill) setGarageBill(Number(latestUtility.garageBill) || 0);
        if (latestUtility.electricityBill) {
          setRate(Number(latestUtility.electricityBill));
        }
      } else {
        applyTenantDefaults(tenantProfile, latestUtility);
      }
    }
  }, [
    isOpen,
    isEdit,
    latestUtility,
    tenantProfile,
    noLiftBill,
    noGasBill,
    noGarageBill,
  ]);

  // Calculations
  const usedUnits = useMemo(
    () => Math.max(0, currentUnit - previousUnit),
    [currentUnit, previousUnit],
  );
  const electricityTotal = useMemo(() => usedUnits * rate, [usedUnits, rate]);
  const effectiveLiftBill = noLiftBill ? 0 : liftBill;
  const effectiveGasBill = noGasBill ? 0 : gasBill;
  const effectiveGarageBill = noGarageBill ? 0 : garageBill;

  const defaultUnitBaseFare = useMemo(() => {
    return (
      Number(tenantProfile?.unit?.baseFare) ||
      Number(tenantProfile?.unit?.baseRent) ||
      Number(editingIncome?.baseFare) ||
      0
    );
  }, [tenantProfile, editingIncome]);

  const effectiveBaseFare = useMemo(() => {
    return Number(baseFare) > 0 ? Number(baseFare) : defaultUnitBaseFare;
  }, [baseFare, defaultUnitBaseFare]);

  const calculatedTotalBill = useMemo(() => {
    return Math.max(
      0,
      previousDue +
        effectiveBaseFare -
        advanced +
        effectiveLiftBill +
        effectiveGasBill +
        effectiveGarageBill +
        electricityTotal -
        (discount || 0),
    );
  }, [
    previousDue,
    effectiveBaseFare,
    advanced,
    effectiveLiftBill,
    effectiveGasBill,
    effectiveGarageBill,
    electricityTotal,
    discount,
  ]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload: any = {
      user: {
        _id: tenantProfile?._id || tenantProfile?.id || selectedTenantId,
        name: tenantProfile?.name || "N/A",
        phoneNo: tenantProfile?.phoneNo || tenantProfile?.username || "",
        email: tenantProfile?.email || "",
      },
      building: {
        _id: selectedBuildingId || tenantProfile?.building?._id,
        name:
          buildingName ||
          tenantProfile?.building?.name ||
          editingIncome?.building?.name ||
          "N/A",
      },
      floor: {
        _id: tenantProfile?.floor?._id || editingIncome?.floor?._id,
        floorNo: Number(floorNo) || 1,
      },
      unit: {
        _id: tenantProfile?.unit?._id || editingIncome?.unit?._id,
        unitNo: String(unitNo || "101"),
      },
      month,
      year: Number(year),
      dateString,
    };

    payload.previousDue = Number(previousDue) || 0;
    payload.advanced = Number(advanced) || 0;
    payload.baseFare = Number(effectiveBaseFare) || 0;
    payload.liftBill = Number(effectiveLiftBill) || 0;
    payload.garageBill = Number(effectiveGarageBill) || 0;
    payload.gasBill = Number(effectiveGasBill) || 0;
    payload.discount = Number(discount) || 0;
    payload.previousUnit = Number(previousUnit) || 0;
    payload.currentUnit = Number(currentUnit) || 0;
    payload.rate = Number(rate) || 0;
    payload.totalBill = Number(calculatedTotalBill) || 0;
    if (totalReceived !== undefined)
      payload.totalReceived = Number(totalReceived);

    try {
      setIsSubmitting(true);
      await onSaveIncome(payload);
      handleClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-4xl w-full shadow-2xl overflow-hidden border border-gray-100 flex flex-col max-h-[92vh] my-auto">
        {/* Header - Always clean and instant */}
        <div className="flex-shrink-0 flex items-center justify-between px-4 sm:px-6 py-3.5 bg-gradient-to-r from-[#054a48] to-[#086361] text-white">
          <div className="flex items-center gap-3">
            {tenantProfile ? (
              <div className="flex items-center gap-3">
                {tenantProfile.profileImg || tenantProfile.image ? (
                  <img
                    src={tenantProfile.profileImg || tenantProfile.image}
                    alt={tenantProfile.name}
                    className="w-10 h-10 rounded-full object-cover border-2 border-emerald-300 shadow-xs"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-emerald-700 text-white font-bold text-sm flex items-center justify-center border-2 border-emerald-300">
                    {tenantProfile.name ? (
                      tenantProfile.name.charAt(0).toUpperCase()
                    ) : (
                      <User size={18} />
                    )}
                  </div>
                )}
                <div>
                  <h2 className="text-base font-bold leading-tight">
                    {tenantProfile.name || "N/A"}
                  </h2>
                  <p className="text-xs text-emerald-200">
                    {tenantProfile.phoneNo ||
                      tenantProfile.username ||
                      "ফোন নেই"}{" "}
                    | {buildingName || tenantProfile.building?.name || ""} |
                    ফ্ল্যাট: {unitNo || "N/A"}
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Calculator className="text-emerald-300" size={22} />
                <h2 className="text-lg font-bold">
                  {isEdit
                    ? "ভাড়া ও বিল এডিট করুন"
                    : "নতুন মাস ভাড়ার বিল তৈরি করুন"}
                </h2>
              </div>
            )}
          </div>
          <button
            onClick={handleClose}
            className="text-white/80 hover:text-white hover:bg-white/10 p-1.5 rounded-lg transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Body - Always rendered instantly without blocking loaders */}
        <form
          onSubmit={handleSubmit}
          className="p-4 sm:p-6 space-y-6 max-h-[80vh] overflow-y-auto"
        >
          {/* Section 1: Tenant & Unit Search & Building Selection */}
          <div className="bg-emerald-50/40 p-4 rounded-xl border border-emerald-100 space-y-4">
            <h3 className="text-xs font-bold text-[#054a48] uppercase tracking-wider flex items-center justify-between">
              <span className="flex items-center gap-2">
                <User size={15} />
                <span>১. ইউনিট ও ভাড়াটিয়া নির্বাচন</span>
              </span>
              {tenantProfile && (
                <span className="text-[11px] text-emerald-800 font-semibold bg-emerald-100/70 px-2.5 py-0.5 rounded-full border border-emerald-300">
                  ✓ নির্বাচিত: {tenantProfile.name} (ইউনিট: {unitNo || "N/A"})
                </span>
              )}
            </h3>

            {/* Search Input with Rich Dropdown */}
            <div className="relative" ref={searchContainerRef}>
              <label className="block text-gray-700 font-semibold mb-1 flex items-center justify-between text-xs">
                <span>ইউনিট নং দিয়ে সার্চ করুন (Unit No Search)</span>
                {isSearchingTenants && (
                  <span className="text-[10px] text-emerald-700 font-medium flex items-center gap-1">
                    <Loader2 size={11} className="animate-spin" />
                    সার্চ হচ্ছে...
                  </span>
                )}
              </label>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Search size={15} />
                </div>
                <input
                  type="text"
                  placeholder="ইউনিট নং বা নাম লিখুন (যেমন: 101, 202, বা রফিক)..."
                  value={searchQuery}
                  onFocus={() => {
                    if (searchResults.length > 0) setIsDropdownOpen(true);
                  }}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                  }}
                  className="w-full pl-9 pr-20 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#054a48] focus:border-[#054a48] focus:outline-hidden font-medium text-xs text-gray-900 shadow-2xs"
                />

                <div className="absolute inset-y-0 right-0 pr-2 flex items-center gap-1">
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => {
                        setSearchQuery("");
                        setSearchResults([]);
                        setTenantProfile(null);
                        setSelectedTenantId("");
                        setSelectedBuildingId("");
                        setBuildingName("");
                        setFloorNo(1);
                        setUnitNo("");
                        setBaseFare(0);
                      }}
                      className="text-gray-400 hover:text-gray-600 p-1 rounded-md cursor-pointer"
                      title="ক্লিয়ার করুন"
                    >
                      <X size={14} />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      if (searchResults.length > 0) {
                        setIsDropdownOpen((prev) => !prev);
                      }
                    }}
                    className="text-gray-400 hover:text-gray-600 p-1 rounded-md cursor-pointer"
                  >
                    <ChevronDown size={14} />
                  </button>
                </div>
              </div>

              {/* Rich Dropdown showing: Tenant Image, Name, Building Name, Unit No */}
              {isDropdownOpen && searchResults.length > 0 && (
                <div className="absolute left-0 right-0 top-full mt-1.5 z-50 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden max-h-72 overflow-y-auto">
                  <div className="p-1 space-y-1">
                    {searchResults.map((t: any) => {
                      const tId = t._id || t.id;
                      const isSelected = selectedTenantId === tId;
                      const unitDisplay =
                        t.unit?.unitNo || t.unit?.flotNo || "N/A";
                      const floorDisplay = t.floor?.floorNo
                        ? `${t.floor.floorNo} তলা`
                        : "১ তলা";
                      const bName = t.building?.name || "বিল্ডিং নেই";
                      const rentDisplay = t.unit?.baseRent || t.unit?.baseFare;

                      return (
                        <div
                          key={tId}
                          onClick={() => handleSelectTenant(t)}
                          className={`flex items-center gap-3 p-2.5 rounded-lg cursor-pointer transition-colors ${
                            isSelected
                              ? "bg-emerald-50 border border-emerald-300 text-[#054a48]"
                              : "hover:bg-gray-50 text-gray-800"
                          }`}
                        >
                          {/* Tenant Image */}
                          {t.profileImg ? (
                            <img
                              src={t.profileImg}
                              alt={t.name}
                              className="w-10 h-10 rounded-full object-cover border border-emerald-300 shrink-0"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-emerald-100 text-[#054a48] font-bold text-sm flex items-center justify-center shrink-0 border border-emerald-200">
                              {t.name ? (
                                t.name.charAt(0).toUpperCase()
                              ) : (
                                <User size={18} />
                              )}
                            </div>
                          )}

                          {/* Tenant Details */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-1">
                              <h4 className="text-xs font-bold text-gray-900 truncate">
                                {t.name || "N/A"}
                              </h4>
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-[#054a48]/10 text-[#054a48] shrink-0">
                                🚪 ফ্ল্যাট: {unitDisplay}
                              </span>
                            </div>
                            <div className="flex items-center flex-wrap gap-x-2 gap-y-0.5 text-[11px] text-gray-500 mt-0.5">
                              <span className="font-semibold text-emerald-800">
                                🏢 {bName}
                              </span>
                              <span>•</span>
                              <span>{floorDisplay}</span>
                              {t.phoneNo && (
                                <>
                                  <span>•</span>
                                  <span>📞 {t.phoneNo}</span>
                                </>
                              )}
                              {rentDisplay && (
                                <>
                                  <span>•</span>
                                  <span className="text-gray-700 font-medium">
                                    ভাড়া: ৳{rentDisplay}
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* No results message */}
              {isDropdownOpen &&
                !isSearchingTenants &&
                searchQuery.trim() &&
                searchResults.length === 0 && (
                  <div className="absolute left-0 right-0 top-full mt-1.5 z-50 bg-white rounded-xl shadow-xl border border-gray-200 p-4 text-center text-xs text-gray-500">
                    "{searchQuery}" দিয়ে কোনো ভাড়াটিয়া বা ইউনিট পাওয়া যায়নি
                  </div>
                )}
            </div>

            {/* Auto-populated details grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs pt-1">
              {/* Building */}
              <div>
                <label className="block text-gray-700 font-semibold mb-1">
                  বিল্ডিং (Building)
                </label>
                <input
                  disabled
                  type="text"
                  placeholder="বিল্ডিং নাম"
                  value={buildingName || "স্বয়ংক্রিয় আসবে"}
                  className="w-full p-2.5 bg-gray-100 border border-gray-200 rounded-lg text-gray-800 font-medium"
                />
              </div>

              {/* Floor & Flat No */}
              <div>
                <label className="block text-gray-700 font-semibold mb-1">
                  ফ্লোর ও ফ্ল্যাট নং
                </label>
                <div className="flex gap-2">
                  <input
                    disabled
                    type="text"
                    placeholder="ফ্লোর"
                    value={floorNo ? `${floorNo} তলা` : "১ তলা"}
                    className="w-1/2 p-2.5 bg-gray-100 border border-gray-200 rounded-lg text-center font-bold text-gray-800"
                  />
                  <input
                    disabled
                    type="text"
                    placeholder="ফ্ল্যাট"
                    value={unitNo || "ইউনিট"}
                    className="w-1/2 p-2.5 bg-gray-100 border border-gray-200 rounded-lg text-center font-bold text-[#054a48]"
                  />
                </div>
              </div>

              {/* Month */}
              <div>
                <label className="block text-gray-700 font-semibold mb-1">
                  মাস (Month)
                </label>
                <select
                  value={month}
                  onChange={(e) => setMonth(e.target.value)}
                  className="w-full p-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#054a48] focus:outline-hidden"
                >
                  {monthsList.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>

              {/* Year */}
              <div>
                <label className="block text-gray-700 font-semibold mb-1">
                  বছর ও তারিখ
                </label>
                <div className="flex gap-1.5">
                  <select
                    value={year}
                    onChange={(e) => setYear(Number(e.target.value))}
                    className="w-24 p-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#054a48] focus:outline-hidden text-xs"
                  >
                    <option value={2024}>২০২৪</option>
                    <option value={2025}>২০২৫</option>
                    <option value={2026}>২০২৬</option>
                    <option value={2027}>২০২৭</option>
                  </select>
                  <input
                    type="date"
                    value={dateString}
                    onChange={(e) => setDateString(e.target.value)}
                    className="w-full p-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#054a48] focus:outline-hidden text-xs"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Electricity Meter Calculation */}
          <div className="bg-amber-50/50 p-4 rounded-xl border border-amber-200 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-amber-900 uppercase tracking-wider flex items-center gap-2">
                <Zap size={15} className="text-amber-600" />
                <span>২. বিদ্যুৎ মিটারের তথ্য ও হিসাব</span>
              </h3>
              {isUtilityRatesLoading && (
                <span className="text-[10px] text-amber-700 flex items-center gap-1 font-medium bg-amber-100/60 px-2 py-0.5 rounded-full">
                  <Loader2 size={11} className="animate-spin text-amber-600" />
                  মিটার রেট লোড হচ্ছে...
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <label className="block text-gray-700 font-semibold mb-1">
                  পূর্বের মিটার ইউনিট
                </label>
                <input
                  type="number"
                  min={0}
                  value={previousUnit}
                  onChange={(e) => setPreviousUnit(Number(e.target.value))}
                  className="w-full p-2 bg-white border border-amber-300 rounded-lg font-semibold"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">
                  বর্তমান মিটার ইউনিট
                </label>
                <input
                  type="number"
                  min={0}
                  value={currentUnit}
                  onChange={(e) => setCurrentUnit(Number(e.target.value))}
                  className="w-full p-2 bg-white border border-amber-300 rounded-lg font-semibold"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">
                  রেট (টাকা / ইউনিট)
                </label>
                <input
                  type="number"
                  step="0.5"
                  min={0}
                  value={rate}
                  onChange={(e) => setRate(Number(e.target.value))}
                  className="w-full p-2 bg-white border border-amber-300 rounded-lg font-bold text-amber-900"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">
                  মোট বিদ্যুৎ বিল
                </label>
                <div className="p-2 bg-amber-100 border border-amber-300 rounded-lg text-amber-900 font-extrabold text-sm text-center">
                  ৳ {electricityTotal.toLocaleString()} ({usedUnits} unit)
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Financial Rent & Utility Breakdown (with Separate Utility Loading Status) */}
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-4">
            <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <span className="flex items-center gap-2">
                <DollarSign size={15} />
                <span>৩. ফ্ল্যাট ভাড়া ও অন্যান্য ফি বিবরণ</span>
              </span>
              <div className="flex items-center gap-2">
                {isUtilityRatesLoading ? (
                  <span className="text-[11px] text-amber-600 font-semibold flex items-center gap-1 bg-amber-100/70 px-2.5 py-0.5 rounded-full border border-amber-200">
                    <Loader2 size={12} className="animate-spin text-amber-600" />
                    ইউটিলিটি রেট লোড হচ্ছে...
                  </span>
                ) : latestUtility ? (
                  <span className="text-[10px] text-emerald-700 font-medium bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                    <CheckCircle2 size={11} className="text-emerald-600" />
                    ইউটিলিটি রেট প্রস্তুত
                  </span>
                ) : null}
                <span className="text-[11px] text-gray-500 font-normal">
                  (প্রযোজ্য না হলে চেকবক্সে টিক দিন, বিল অটো ০ হবে)
                </span>
              </div>
            </h3>

            {/* Exemptions Checkboxes Row */}
            <div className="bg-white p-2.5 rounded-lg border border-gray-200 flex flex-wrap items-center gap-4 text-xs font-semibold text-gray-700">
              <span className="text-gray-500 font-bold">বিল প্রযোজ্য নয়:</span>
              <label className="inline-flex items-center gap-2 cursor-pointer hover:text-emerald-800">
                <input
                  type="checkbox"
                  checked={noLiftBill}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    setNoLiftBill(checked);
                    if (checked) {
                      setLiftBill(0);
                    } else {
                      const restored =
                        Number(tenantProfile?.unit?.liftBill) ||
                        Number(latestUtility?.liftBill) ||
                        Number(editingIncome?.liftBill) ||
                        0;
                      setLiftBill(restored);
                    }
                  }}
                  className="rounded border-gray-300 text-[#054a48] focus:ring-[#054a48]"
                />
                <span>লিফট বিল প্রযোজ্য নয়</span>
              </label>

              <label className="inline-flex items-center gap-2 cursor-pointer hover:text-emerald-800">
                <input
                  type="checkbox"
                  checked={noGasBill}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    setNoGasBill(checked);
                    if (checked) {
                      setGasBill(0);
                    } else {
                      const restored =
                        Number(tenantProfile?.unit?.gasBill) ||
                        Number(latestUtility?.gasBill) ||
                        Number(editingIncome?.gasBill) ||
                        0;
                      setGasBill(restored);
                    }
                  }}
                  className="rounded border-gray-300 text-[#054a48] focus:ring-[#054a48]"
                />
                <span>গ্যাস / পানি বিল প্রযোজ্য নয়</span>
              </label>

              <label className="inline-flex items-center gap-2 cursor-pointer hover:text-emerald-800">
                <input
                  type="checkbox"
                  checked={noGarageBill}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    setNoGarageBill(checked);
                    if (checked) {
                      setGarageBill(0);
                    } else {
                      const restored =
                        Number(tenantProfile?.unit?.garageBill) ||
                        Number(latestUtility?.garageBill) ||
                        Number(editingIncome?.garageBill) ||
                        0;
                      setGarageBill(restored);
                    }
                  }}
                  className="rounded border-gray-300 text-[#054a48] focus:ring-[#054a48]"
                />
                <span>গ্যারেজ বিল প্রযোজ্য নয়</span>
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <label className="block text-gray-700 font-semibold mb-1">
                  পূর্বের বকেয়া (৳)
                </label>
                <input
                  type="number"
                  min={0}
                  value={previousDue}
                  onChange={(e) => setPreviousDue(Number(e.target.value))}
                  className="w-full p-2 bg-white border border-gray-200 rounded-lg text-red-600 font-semibold"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1 flex items-center justify-between">
                  <span>ফ্ল্যাট মূল ভাড়া (৳)</span>
                  {(!baseFare || Number(baseFare) === 0) &&
                    defaultUnitBaseFare > 0 && (
                      <span className="text-[10px] text-emerald-600 font-semibold">
                        (ইউনিট থেকে: ৳{defaultUnitBaseFare.toLocaleString()})
                      </span>
                    )}
                </label>
                <input
                  type="number"
                  min={0}
                  placeholder={
                    defaultUnitBaseFare > 0
                      ? `ডিফল্ট: ৳${defaultUnitBaseFare}`
                      : "ফ্ল্যাট ভাড়া"
                  }
                  value={baseFare || ""}
                  onChange={(e) =>
                    setBaseFare(
                      e.target.value === "" ? 0 : Number(e.target.value),
                    )
                  }
                  className="w-full p-2 bg-white border border-gray-200 rounded-lg font-bold text-gray-900"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">
                  অগ্রিম কমানো (৳)
                </label>
                <input
                  type="number"
                  min={0}
                  value={advanced}
                  onChange={(e) => setAdvanced(Number(e.target.value))}
                  className="w-full p-2 bg-white border border-gray-200 rounded-lg text-blue-600 font-semibold"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1 flex items-center justify-between">
                  <span>লিফট ফি (৳)</span>
                  {noLiftBill ? (
                    <span className="text-[10px] text-red-500 font-bold">
                      প্রযোজ্য নয়
                    </span>
                  ) : (
                    (latestUtility?.liftBill || editingIncome?.liftBill) && (
                      <span className="text-[10px] text-gray-400 font-normal">
                        (ডিফল্ট: ৳
                        {latestUtility?.liftBill || editingIncome?.liftBill})
                      </span>
                    )
                  )}
                </label>
                <input
                  type="number"
                  min={0}
                  disabled={noLiftBill}
                  value={noLiftBill ? 0 : liftBill}
                  onChange={(e) => setLiftBill(Number(e.target.value) || 0)}
                  className={`w-full p-2 border rounded-lg ${
                    noLiftBill
                      ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                      : "bg-white border-gray-200"
                  }`}
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1 flex items-center justify-between">
                  <span>পানি / গ্যাস বিল (৳)</span>
                  {noGasBill ? (
                    <span className="text-[10px] text-red-500 font-bold">
                      প্রযোজ্য নয়
                    </span>
                  ) : (
                    (latestUtility?.gasBill || editingIncome?.gasBill) && (
                      <span className="text-[10px] text-gray-400 font-normal">
                        (ডিফল্ট: ৳
                        {latestUtility?.gasBill || editingIncome?.gasBill})
                      </span>
                    )
                  )}
                </label>
                <input
                  type="number"
                  min={0}
                  disabled={noGasBill}
                  value={noGasBill ? 0 : gasBill}
                  onChange={(e) => setGasBill(Number(e.target.value) || 0)}
                  className={`w-full p-2 border rounded-lg ${
                    noGasBill
                      ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                      : "bg-white border-gray-200"
                  }`}
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1 flex items-center justify-between">
                  <span>গ্যারেজ ভাড়া (৳)</span>
                  {noGarageBill ? (
                    <span className="text-[10px] text-red-500 font-bold">
                      প্রযোজ্য নয়
                    </span>
                  ) : (
                    (latestUtility?.garageBill ||
                      editingIncome?.garageBill) && (
                      <span className="text-[10px] text-gray-400 font-normal">
                        (ডিফল্ট: ৳
                        {latestUtility?.garageBill || editingIncome?.garageBill})
                      </span>
                    )
                  )}
                </label>
                <input
                  type="number"
                  min={0}
                  disabled={noGarageBill}
                  value={noGarageBill ? 0 : garageBill}
                  onChange={(e) => setGarageBill(Number(e.target.value) || 0)}
                  className={`w-full p-2 border rounded-lg ${
                    noGarageBill
                      ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                      : "bg-white border-gray-200"
                  }`}
                />
              </div>

              <div>
                <label className="block text-emerald-800 font-bold mb-1">
                  মওকুফ / ছাড় (৳) [Waiver]
                </label>
                <input
                  type="number"
                  min={0}
                  placeholder="যেমন: ২০, ৩০, ৫০"
                  value={discount === 0 ? "" : discount}
                  onChange={(e) => setDiscount(Number(e.target.value) || 0)}
                  className="w-full p-2 bg-emerald-50/50 border border-emerald-300 rounded-lg text-emerald-900 font-bold placeholder:text-gray-400"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Total Bill & Received Amount */}
          <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
            <div>
              <p className="text-gray-600 font-semibold">
                সর্বমোট বিল (Total Bill):
              </p>
              <h4 className="text-xl font-black text-[#054a48]">
                ৳ {calculatedTotalBill.toLocaleString()}
              </h4>
              {discount > 0 && (
                <p className="text-[11px] text-emerald-700 font-semibold mt-0.5">
                  (ছাড়: ৳{discount} সমন্বয় করা হয়েছে)
                </p>
              )}
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-1">
                আদায়কৃত / প্রাপ্ত টাকা (৳)
              </label>
              <input
                type="number"
                min={0}
                value={totalReceived}
                onChange={(e) => setTotalReceived(Number(e.target.value))}
                className="w-full sm:w-48 p-2.5 bg-white border border-emerald-300 rounded-lg text-emerald-800 font-bold text-sm focus:ring-2 focus:ring-[#054a48] focus:outline-hidden"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
            <Button
              type="button"
              onClick={handleClose}
              variant="outline"
              className="text-xs px-5 cursor-pointer"
            >
              বাতিল
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !selectedTenantId}
              className="bg-[#054a48] hover:bg-[#043634] text-white text-xs px-6 gap-2 font-bold disabled:opacity-50 cursor-pointer"
            >
              <Save size={16} />
              <span>
                {isSubmitting
                  ? "সংরক্ষণ হচ্ছে..."
                  : isEdit
                    ? "আপডেট সংরক্ষণ করুন"
                    : "বিল সেভ করুন"}
              </span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
