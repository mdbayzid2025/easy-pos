import {
  ArrowLeft,
  Building2,
  Calendar,
  FileSpreadsheet,
  Loader2,
  Printer,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useGetIncomesQuery } from "../../../../redux/features/income/incomeApi";
import { useGetBuildingsQuery } from "../../../../redux/features/building/buildingApi";
import { Button } from "../../../ui/button";
import type { Building, Flot } from "../../Building/types";
import { monthNamesBengali, yearOptions } from "../types";

interface IncomeReportTableProps {
  buildings?: Building[];
  selectedBuilding?: Building | undefined;
  selectedBuildingId?: string;
  flots?: Flot[];
  month?: string;
  year?: number;
  onBackToCatalog?: () => void;
}

const bengaliToEnglishMonthMap: Record<string, string> = {
  জানুয়ারি: "January",
  ফেব্রুয়ারি: "February",
  মার্চ: "March",
  এপ্রিল: "April",
  মে: "May",
  জুন: "June",
  জুলাই: "July",
  আগস্ট: "August",
  সেপ্টেম্বর: "September",
  অক্টোবর: "October",
  নভেম্বর: "November",
  ডিসেম্বর: "December",
};

const defaultLastMonth = (() => {
  const now = new Date();
  const d = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  return {
    monthName: monthNamesBengali[d.getMonth()] || "আগস্ট",
    yearNum: d.getFullYear(),
  };
})();

export default function IncomeReportTable({
  buildings: propBuildings,
  selectedBuilding: propSelectedBuilding,
  selectedBuildingId: propSelectedBuildingId = "ALL",
  flots = [],
  month: propMonth,
  year: propYear,
  onBackToCatalog,
}: IncomeReportTableProps) {
  const { data: apiBuildingsData } = useGetBuildingsQuery(undefined);
  const buildings = useMemo(() => {
    if (propBuildings && propBuildings.length > 0) return propBuildings;
    if (apiBuildingsData && Array.isArray(apiBuildingsData?.data)) {
      return apiBuildingsData.data;
    }
    return [];
  }, [propBuildings, apiBuildingsData]);

  // Independent Filter State for IncomeReportTable (Defaults to last month & year)
  const [selectedBuildingId, setSelectedBuildingId] = useState<string>(
    propSelectedBuildingId,
  );
  const [selectedMonth, setSelectedMonth] = useState<string>(
    propMonth || defaultLastMonth.monthName,
  );
  const [selectedYear, setSelectedYear] = useState<number>(
    propYear || defaultLastMonth.yearNum,
  );

  // Selected building object calculation
  const selectedBuilding = useMemo(() => {
    if (
      propSelectedBuilding &&
      (propSelectedBuilding.id === selectedBuildingId ||
        (propSelectedBuilding as any)._id === selectedBuildingId)
    ) {
      return propSelectedBuilding;
    }
    return buildings.find(
      (b: any) => b.id === selectedBuildingId || b._id === selectedBuildingId,
    );
  }, [buildings, selectedBuildingId, propSelectedBuilding]);

  // Build query params for backend API call POST /income/get-all
  const queryParams = useMemo(() => {
    const filterObj: Record<string, any> = {};

    const effBuildingId =
      selectedBuildingId !== "ALL" ? selectedBuildingId : undefined;

    if (
      effBuildingId &&
      effBuildingId !== "ALL" &&
      effBuildingId !== "GENERAL"
    ) {
      filterObj["building._id"] = effBuildingId;
    }

    if (selectedMonth && selectedMonth !== "ALL") {
      const engMonth = bengaliToEnglishMonthMap[selectedMonth] || selectedMonth;
      filterObj.month = { $in: [engMonth, selectedMonth] };
    }

    if (selectedYear && selectedYear !== 0) {
      filterObj.year = Number(selectedYear);
    }

    return {
      filter: filterObj,
      pagination: {
        currentPage: 1,
        pageSize: 1000,
      },
    };
  }, [selectedBuildingId, selectedMonth, selectedYear]);

  const {
    data: apiIncomesData,
    isLoading,
    isFetching,
  } = useGetIncomesQuery(queryParams);

  const apiIncomesList = useMemo(() => {
    if (apiIncomesData && Array.isArray(apiIncomesData?.data)) {
      return apiIncomesData.data;
    }
    return [];
  }, [apiIncomesData]);

  // Process rows
  const calculatedRows = useMemo(() => {
    if (apiIncomesList.length > 0) {
      return apiIncomesList.map((income: any, idx: number) => {
        const rate = income.rate || 11;
        const prevUnit = income.previousUnit || 0;
        const currUnit = income.currentUnit || 0;
        const usedUnits = Math.max(0, currUnit - prevUnit);
        const elecBill = usedUnits * rate;

        const previousDue = income.previousDue || 0;
        const baseFare = income.baseFare || 0;
        const advanced = income.advanced || 0;
        const liftBill = income.liftBill || 0;
        const gasBill = income.gasBill || 0;
        const garageBill = income.garageBill || 0;

        const totalBill =
          income.totalBill ||
          previousDue +
            baseFare -
            advanced +
            liftBill +
            elecBill +
            gasBill +
            garageBill;

        const totalReceived = income.totalReceived || 0;
        const currentDue = Math.max(0, totalBill - totalReceived);

        return {
          id: income._id || idx,
          floorNumber: income.floor?.floorNo
            ? `${income.floor.floorNo}তলা`
            : income.floorNo || "-",
          flatNo: income.unit?.unitNo || income.unitNo || "-",
          tenantName: income.user?.name || income.tenantName || "খালি",
          previousDue,
          baseFare,
          advanced,
          liftBill,
          prevUnit,
          currUnit,
          usedUnits,
          rate,
          elecBill,
          gasBill,
          garageBill,
          totalBill,
          totalReceived,
          currentDue,
          remarks: income.remarks || income.note || "",
        };
      });
    }

    // Fallback if no API incomes yet, using prop flots
    return flots.map((flot, idx) => {
      const rate = 11;
      const prevUnit = flot.previousElectricityMeter || 0;
      const currUnit = flot.currentElectricityMeter || 0;
      const usedUnits = Math.max(0, currUnit - prevUnit);
      const elecBill = Math.round(usedUnits * rate);

      const previousDue =
        flot.dueAmount && flot.dueAmount > 0 ? flot.dueAmount : 0;
      const baseFare = flot.baseRent || 0;
      const advanced = flot.advancePaid || 0;
      const liftBill = flot.liftFee || 0;
      const gasBill = flot.waterFee || 0;
      const garageBill = flot.parkingFee || 0;

      const totalBill =
        previousDue +
        baseFare -
        advanced +
        liftBill +
        elecBill +
        gasBill +
        garageBill;

      const totalReceived = flot.rentCollected || 0;
      const currentDue = Math.max(0, totalBill - totalReceived);

      return {
        id: flot.id || idx,
        floorNumber: flot.floorNumber || "-",
        flatNo: flot.flatNo || flot.unitName || "-",
        tenantName: flot.tenantName || "খালি",
        previousDue,
        baseFare,
        advanced,
        liftBill,
        prevUnit,
        currUnit,
        usedUnits,
        rate,
        elecBill,
        gasBill,
        garageBill,
        totalBill,
        totalReceived,
        currentDue,
        remarks: flot.remarks || "",
      };
    });
  }, [apiIncomesList, flots]);

  // Grand totals
  const totalArrears = calculatedRows.reduce(
    (acc: any, f: any) => acc + f.previousDue,
    0,
  );
  const totalBaseRent = calculatedRows.reduce(
    (acc: any, f: any) => acc + f.baseFare,
    0,
  );
  const totalAdvance = calculatedRows.reduce(
    (acc: any, f: any) => acc + f.advanced,
    0,
  );
  const totalLift = calculatedRows.reduce(
    (acc: any, f: any) => acc + f.liftBill,
    0,
  );
  const totalElecUsed = calculatedRows.reduce(
    (acc: any, f: any) => acc + f.usedUnits,
    0,
  );
  const totalElecBill = calculatedRows.reduce(
    (acc: any, f: any) => acc + f.elecBill,
    0,
  );
  const totalWater = calculatedRows.reduce(
    (acc: any, f: any) => acc + f.gasBill,
    0,
  );
  const totalGarage = calculatedRows.reduce(
    (acc: any, f: any) => acc + f.garageBill,
    0,
  );
  const totalAmountSum = calculatedRows.reduce(
    (acc: any, f: any) => acc + f.totalBill,
    0,
  );
  const totalCollectedSum = calculatedRows.reduce(
    (acc: any, f: any) => acc + f.totalReceived,
    0,
  );
  const totalDueSum = calculatedRows.reduce(
    (acc: any, f: any) => acc + f.currentDue,
    0,
  );

  const buildingTitle = selectedBuilding
    ? selectedBuilding.name
    : "সকল ভবন / বিল্ডিংসমূহ";
  const reportSubtitle = `মাসিক ভাড়ার আয় হিসাব (${selectedMonth}, ${selectedYear}ইং)`;
  const reportDateStr = new Date().toLocaleDateString("bn-BD", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const handlePrint = () => {
    window.print();
  };

  // Export to Excel function
  // Export to Excel function
  const handleExportExcel = () => {
    let tableHtml = `
    <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
    <head>
      <meta charset="utf-8" />
      <!--[if gte mso 9]>
      <xml>
        <x:ExcelWorkbook>
          <x:ExcelWorksheets>
            <x:ExcelWorksheet>
              <x:Name>Income Report</x:Name>
              <x:WorksheetOptions>
                <x:PageSetup>
                  <x:Layout x:Orientation="Landscape"/>
                  <x:PageMargins x:Bottom="0.5" x:Left="0.5" x:Right="0.5" x:Top="0.5" x:Header="0.3" x:Footer="0.3"/>
                </x:PageSetup>
                <x:Print>
                  <x:ValidPrinterInfo/>
                  <x:PaperSizeIndex>9</x:PaperSizeIndex>
                  <x:HorizontalResolution>600</x:HorizontalResolution>
                  <x:VerticalResolution>600</x:VerticalResolution>
                  <x:FitWidth>1</x:FitWidth>
                  <x:FitHeight>0</x:FitHeight>
                </x:Print>
                <x:Header x:Data="&amp;C&amp;&quot;Arial,Bold&quot;&amp;48&amp;KBFBFBFAinal Properties"/>
                <x:Selected/>
                <x:DoNotDisplayGridlines/>
              </x:WorksheetOptions>
            </x:ExcelWorksheet>
          </x:ExcelWorksheets>
          <x:WindowHeight>9000</x:WindowHeight>
          <x:WindowWidth>13860</x:WindowWidth>
          <x:ProtectStructure>False</x:ProtectStructure>
          <x:ProtectWindows>False</x:ProtectWindows>
        </x:ExcelWorkbook>
      </xml>
      <![endif]-->
      <style>
        @page {
          size: A4 landscape;
          margin: 0.5in;
        }
        table {
          border-collapse: collapse;
          width: 100%;
          font-family: Arial, sans-serif;
          font-size: 11px;
          text-align: center;
          mso-displayed-decimal-separator: "\\.";
        }
        th, td { border: 1px solid #999999; padding: 6px; text-align: center; mso-number-format: "\\@"; }
        .title-head { font-size: 16px; font-weight: bold; text-align: center; background-color: #ffffff; }
        .subtitle-head { font-size: 13px; font-weight: bold; text-align: center; color: #047857; background-color: #ffffff; }
        .hdr-bg { background-color: #f3f4f6; font-weight: bold; }
        .elec-hdr { background-color: #fef3c7; color: #78350f; font-weight: bold; }
        .total-cell { background-color: #e5e7eb; font-weight: bold; }
        .collected-cell { background-color: #d1e7dd; font-weight: bold; color: #065f46; }
        .due-cell { background-color: #f8d7da; font-weight: bold; color: #991b1b; }
        .tfoot-bg { background-color: #e5e7eb; font-weight: bold; }
        .date-cell { text-align: right; font-weight: bold; font-size: 11px; padding-top: 12px; }
      </style>
    </head>
    <body>
      <table>
        <tr>
          <td colspan="19" class="title-head">${buildingTitle}</td>
        </tr>
        <tr>
          <td colspan="19" class="subtitle-head">${reportSubtitle}</td>
        </tr>
        <tr><td colspan="19"></td></tr>
        <thead>
          <tr class="hdr-bg">
            <th rowspan="2">নং</th>
            <th rowspan="2">ফ্লোর নং</th>
            <th rowspan="2">ফ্ল্যাট নং</th>
            <th rowspan="2">ভাড়াটিয়ার নাম</th>
            <th rowspan="2">বকেয়া</th>
            <th rowspan="2">ফ্ল্যাট ভাড়া</th>
            <th rowspan="2">অগ্রিম দেয়া</th>
            <th rowspan="2">লিফট ভাড়া</th>
            <th colspan="5" class="elec-hdr">বিদ্যুৎ বিল</th>
            <th rowspan="2">পানি/গ্যাস</th>
            <th rowspan="2">গ্যারেজ ভাড়া</th>
            <th rowspan="2" class="total-cell">মোট ভাড়া</th>
            <th rowspan="2" class="collected-cell">ভাড়া আদায়</th>
            <th rowspan="2" class="due-cell">বকেয়া</th>
            <th rowspan="2">মন্তব্য</th>
          </tr>
          <tr class="elec-hdr">
            <th>পূর্বের ইউনিট</th>
            <th>বর্তমান ইউনিট</th>
            <th>ব্যবহৃত ইউনিট</th>
            <th>প্রতি ইউনিট বিল</th>
            <th>বিদ্যুৎ বিল</th>
          </tr>
        </thead>
        <tbody>
  `;

    calculatedRows.forEach((row: any, idx: number) => {
      tableHtml += `
      <tr>
        <td>${idx + 1}</td>
        <td>${row.floorNumber}</td>
        <td>${row.flatNo}</td>
        <td style="text-align: left;">${row.tenantName}</td>
        <td style="color: #dc2626;">${row.previousDue ? row.previousDue.toLocaleString("bn-BD") : 0}</td>
        <td>${row.baseFare ? row.baseFare.toLocaleString("bn-BD") : 0}</td>
        <td style="color: #1d4ed8;">${row.advanced ? row.advanced.toLocaleString("bn-BD") : 0}</td>
        <td>${row.liftBill ? row.liftBill.toLocaleString("bn-BD") : 0}</td>
        <td>${row.prevUnit || 0}</td>
        <td>${row.currUnit || 0}</td>
        <td>${row.usedUnits || 0}</td>
        <td>৳${row.rate}</td>
        <td>৳${row.elecBill ? row.elecBill.toLocaleString("bn-BD") : 0}</td>
        <td>${row.gasBill ? row.gasBill.toLocaleString("bn-BD") : 0}</td>
        <td>${row.garageBill ? row.garageBill.toLocaleString("bn-BD") : 0}</td>
        <td class="total-cell">৳${row.totalBill ? row.totalBill.toLocaleString("bn-BD") : 0}</td>
        <td class="collected-cell">৳${row.totalReceived ? row.totalReceived.toLocaleString("bn-BD") : 0}</td>
        <td class="due-cell">৳${row.currentDue ? row.currentDue.toLocaleString("bn-BD") : 0}</td>
        <td style="text-align: left;">${row.remarks}</td>
      </tr>
    `;
    });

    tableHtml += `
        </tbody>
        <tfoot>
          <tr class="tfoot-bg">
            <td colspan="4" style="text-align: right;">সর্বমোট হিসাব:</td>
            <td style="color: #dc2626;">৳${totalArrears.toLocaleString("bn-BD")}</td>
            <td>৳${totalBaseRent.toLocaleString("bn-BD")}</td>
            <td style="color: #1d4ed8;">৳${totalAdvance.toLocaleString("bn-BD")}</td>
            <td>৳${totalLift.toLocaleString("bn-BD")}</td>
            <td colspan="2" style="text-align: right;">ব্যবহৃত ইউনিট:</td>
            <td>${totalElecUsed} ইউ</td>
            <td>--</td>
            <td>৳${totalElecBill.toLocaleString("bn-BD")}</td>
            <td>৳${totalWater.toLocaleString("bn-BD")}</td>
            <td>৳${totalGarage.toLocaleString("bn-BD")}</td>
            <td class="total-cell">৳${totalAmountSum.toLocaleString("bn-BD")}</td>
            <td class="collected-cell">৳${totalCollectedSum.toLocaleString("bn-BD")}</td>
            <td class="due-cell">৳${totalDueSum.toLocaleString("bn-BD")}</td>
            <td>--</td>
          </tr>
          <tr><td colspan="19"></td></tr>
          <tr>
            <td colspan="19" class="date-cell">রিপোর্ট প্রকাশের তারিখ: ${reportDateStr}</td>
          </tr>
        </tfoot>
      </table>
    </body>
    </html>
  `;

    const blob = new Blob([tableHtml], {
      type: "application/vnd.ms-excel;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    const safeBuilding = buildingTitle.replace(/[/\\?%*:|"<>]/g, "_");
    link.setAttribute(
      "download",
      `Income_Report_${safeBuilding}_${selectedMonth}_${selectedYear}.xls`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4">
      {/* Inject A4 0.5in print margin styles */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @media print {
          @page {
            size: A4 landscape;
            margin: 0.5in;
          }
          body {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
        }
      `,
        }}
      />

      {/* Component-Specific Filter Bar */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-100 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 print:hidden">
        {/* Left Controls: Back button & Dropdowns */}
        <div className="flex flex-wrap items-center gap-3">
          {onBackToCatalog && (
            <Button
              onClick={onBackToCatalog}
              variant="outline"
              className="rounded-xl text-xs font-bold text-[#054a48] bg-emerald-50/50 border-emerald-200 hover:bg-emerald-100 flex items-center gap-1.5 h-9 px-3.5"
            >
              <ArrowLeft size={15} /> ← রিপোর্ট এর তালিকায় ফিরে যান
            </Button>
          )}

          {/* Building Selector */}
          <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-xl">
            <Building2 size={16} className="text-[#054a48] shrink-0" />
            <select
              value={selectedBuildingId}
              onChange={(e) => setSelectedBuildingId(e.target.value)}
              className="bg-transparent text-xs font-bold text-gray-800 focus:outline-hidden cursor-pointer pr-2"
            >
              {buildings.map((b: any) => (
                <option key={b.id || b._id} value={b.id || b._id}>
                  {b.name} {b.code ? `(${b.code})` : ""}
                </option>
              ))}
            </select>
          </div>

          {/* Month Selector */}
          <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-xl">
            <Calendar size={16} className="text-emerald-600 shrink-0" />
            <select
              value={selectedMonth ?? new Date().getMonth() + 1}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="bg-transparent text-xs font-bold text-gray-800 focus:outline-hidden cursor-pointer pr-2"
            >
              {monthNamesBengali.map((m) => (
                <option key={m} value={m}>
                  {m} মাস
                </option>
              ))}
            </select>
          </div>

          {/* Year Selector */}
          <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-xl">
            <span className="text-xs font-bold text-gray-500">সাল:</span>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="bg-transparent text-xs font-bold text-gray-800 focus:outline-hidden cursor-pointer pr-2"
            >
              {yearOptions.map((y) => (
                <option key={y} value={y}>
                  {y} ইং
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Right Actions: Print & Excel Export */}
        <div className="flex items-center gap-3 justify-end">
          <Button
            onClick={handlePrint}
            variant="outline"
            className="rounded-xl text-xs font-bold text-gray-700 hover:text-[#054a48] border-gray-200 flex items-center gap-1.5 h-9 px-3.5"
          >
            <Printer size={15} /> প্রিন্ট / ডাউনলোড
          </Button>

          <Button
            onClick={handleExportExcel}
            className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold px-3.5 h-9 rounded-xl flex items-center gap-1.5 shadow-xs"
          >
            <FileSpreadsheet size={15} />
            <span>এক্সেল শিটে এক্সপোর্ট</span>
          </Button>
        </div>
      </div>

      {/* Main Income Card Container */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-xs p-4 sm:p-6 space-y-4 print:p-0 print:border-none print:shadow-none">
        {/* Header: Title & Subtitle */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-gray-200">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
              {buildingTitle}
            </h2>
            <p className="text-sm font-bold text-emerald-800 underline decoration-emerald-500 underline-offset-4 mt-0.5">
              {reportSubtitle}
            </p>
          </div>
        </div>

        {/* Loading indicator */}
        {(isLoading || isFetching) && (
          <div className="flex items-center justify-center py-4 text-xs font-bold text-emerald-700 gap-2 print:hidden">
            <Loader2 size={16} className="animate-spin" />
            <span>ডেটা লোড হচ্ছে...</span>
          </div>
        )}

        {/* Main 15-Column Income Excel Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-center border-collapse text-xs border border-gray-300">
            <thead>
              {/* Top Multi-Level Header for Electricity Bill */}
              <tr className="bg-gray-100 font-bold text-gray-800 border-b border-gray-300">
                <th rowSpan={2} className="p-2 border-r border-gray-300 w-10">
                  নং
                </th>
                <th rowSpan={2} className="p-2 border-r border-gray-300 w-14">
                  ফ্লোর নং
                </th>
                <th rowSpan={2} className="p-2 border-r border-gray-300 w-16">
                  ফ্ল্যাট নং
                </th>
                <th
                  rowSpan={2}
                  className="p-2 border-r border-gray-300 text-left min-w-[140px]"
                >
                  ভাড়াটিয়া নাম
                </th>
                <th
                  rowSpan={2}
                  className="p-2 border-r border-gray-300 min-w-[75px]"
                >
                  বকেয়া
                </th>
                <th
                  rowSpan={2}
                  className="p-2 border-r border-gray-300 min-w-[85px]"
                >
                  ফ্ল্যাট ভাড়া
                </th>
                <th
                  rowSpan={2}
                  className="p-2 border-r border-gray-300 min-w-[75px]"
                >
                  অগ্রিম দেয়া
                </th>
                <th
                  rowSpan={2}
                  className="p-2 border-r border-gray-300 min-w-[75px]"
                >
                  লিফট ভাড়া
                </th>

                {/* Grouped Electricity Header - "(রেট: ৳.../ইউনিট)" removed as requested */}
                <th
                  colSpan={5}
                  className="p-1.5 border-r border-gray-300 bg-amber-50 text-amber-900 font-extrabold"
                >
                  বিদ্যুৎ বিল
                </th>

                <th
                  rowSpan={2}
                  className="p-2 border-r border-gray-300 min-w-[75px]"
                >
                  পানি/গ্যাস
                </th>
                <th
                  rowSpan={2}
                  className="p-2 border-r border-gray-300 min-w-[80px]"
                >
                  গ্যারেজ ভাড়া
                </th>
                <th
                  rowSpan={2}
                  className="p-2 border-r border-gray-300 min-w-[90px] font-black text-gray-900 bg-gray-200/60"
                >
                  মোট ভাড়া
                </th>
                <th
                  rowSpan={2}
                  className="p-2 border-r border-gray-300 min-w-[95px] font-black text-emerald-900 bg-[#d1e7dd]"
                >
                  ভাড়া আদায়
                </th>
                <th
                  rowSpan={2}
                  className="p-2 border-r border-gray-300 min-w-[90px] font-black text-red-900 bg-[#f8d7da]"
                >
                  বকেয়া
                </th>
                <th rowSpan={2} className="p-2 min-w-[100px]">
                  মন্তব্য
                </th>
              </tr>

              {/* Sub-Header for Electricity details */}
              <tr className="bg-amber-50/80 font-bold text-amber-900 text-[11px] border-b border-gray-300">
                <th className="p-1.5 border-r border-gray-300">
                  পূর্বের ইউনিট
                </th>
                <th className="p-1.5 border-r border-gray-300">
                  বর্তমান ইউনিট
                </th>
                <th className="p-1.5 border-r border-gray-300">
                  ব্যবহৃত ইউনিট
                </th>
                <th className="p-1.5 border-r border-gray-300">
                  প্রতি ইউনিট বিল
                </th>
                <th className="p-1.5 border-r border-gray-300">বিদ্যুৎ বিল</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {calculatedRows.length > 0 ? (
                calculatedRows.map((row: any, idx: any) => (
                  <tr
                    key={row.id}
                    className="hover:bg-gray-50 transition-colors text-gray-800"
                  >
                    <td className="p-2 border-r border-gray-200 font-bold">
                      {idx + 1}
                    </td>
                    <td className="p-2 border-r border-gray-200 font-semibold">
                      {row.floorNumber}
                    </td>
                    <td className="p-2 border-r border-gray-200 font-extrabold text-gray-900">
                      {row.flatNo}
                    </td>
                    <td className="p-2 border-r border-gray-200 text-left font-medium">
                      {row.tenantName}
                    </td>
                    <td className="p-2 border-r border-gray-200 text-red-600 font-semibold">
                      {row.previousDue > 0
                        ? row.previousDue.toLocaleString("bn-BD")
                        : ""}
                    </td>
                    <td className="p-2 border-r border-gray-200 font-bold">
                      {row.baseFare
                        ? row.baseFare.toLocaleString("bn-BD")
                        : "0"}
                    </td>
                    <td className="p-2 border-r border-gray-200 text-blue-700">
                      {row.advanced > 0
                        ? row.advanced.toLocaleString("bn-BD")
                        : ""}
                    </td>
                    <td className="p-2 border-r border-gray-200">
                      {row.liftBill > 0
                        ? row.liftBill.toLocaleString("bn-BD")
                        : ""}
                    </td>

                    {/* Electricity Sub-columns */}
                    <td className="p-1.5 border-r border-gray-200 bg-amber-50/20 text-gray-600">
                      {row.prevUnit || ""}
                    </td>
                    <td className="p-1.5 border-r border-gray-200 bg-amber-50/20 font-semibold">
                      {row.currUnit || ""}
                    </td>
                    <td className="p-1.5 border-r border-gray-200 bg-amber-50/40 font-bold text-amber-900">
                      {row.usedUnits || ""}
                    </td>

                    <td className="p-1.5 border-r border-gray-200 bg-amber-50/20 font-semibold text-amber-900">
                      ৳{row.rate}
                    </td>

                    <td className="p-1.5 border-r border-gray-200 bg-amber-50/60 font-bold text-amber-900">
                      ৳ {row.elecBill.toLocaleString("bn-BD")}
                    </td>

                    <td className="p-2 border-r border-gray-200">
                      {row.gasBill > 0
                        ? row.gasBill.toLocaleString("bn-BD")
                        : ""}
                    </td>
                    <td className="p-2 border-r border-gray-200">
                      {row.garageBill > 0
                        ? row.garageBill.toLocaleString("bn-BD")
                        : ""}
                    </td>
                    <td className="p-2 border-r border-gray-200 font-black text-gray-900 bg-gray-50">
                      ৳ {row.totalBill.toLocaleString("bn-BD")}
                    </td>

                    {/* Green Highlighted Rent Collected Column */}
                    <td className="p-2 border-r border-gray-200 font-black text-emerald-900 bg-[#d1e7dd]">
                      {row.totalReceived > 0
                        ? row.totalReceived.toLocaleString("bn-BD")
                        : "0"}
                    </td>

                    {/* Red Highlighted Remaining Due Column */}
                    <td className="p-2 border-r border-gray-200 font-black text-red-900 bg-[#f8d7da]">
                      {row.currentDue > 0
                        ? row.currentDue.toLocaleString("bn-BD")
                        : "0"}
                    </td>

                    <td className="p-2 text-left text-[11px] text-gray-600">
                      {row.remarks}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={18}
                    className="py-8 text-center text-gray-400 font-semibold"
                  >
                    কোন ভাড়ার রিপোর্ট ডেটা পাওয়া যায়নি।
                  </td>
                </tr>
              )}
            </tbody>

            {/* Footer Summary Row */}
            {calculatedRows.length > 0 && (
              <tfoot>
                <tr className="bg-gray-200 font-black text-gray-900 border-t-2 border-gray-400 text-xs">
                  <td
                    colSpan={4}
                    className="p-2.5 border-r border-gray-300 text-right uppercase"
                  >
                    সর্বমোট হিসাব:
                  </td>
                  <td className="p-2.5 border-r border-gray-300 text-red-700">
                    ৳ {totalArrears.toLocaleString("bn-BD")}
                  </td>
                  <td className="p-2.5 border-r border-gray-300">
                    ৳ {totalBaseRent.toLocaleString("bn-BD")}
                  </td>
                  <td className="p-2.5 border-r border-gray-300 text-blue-700">
                    ৳ {totalAdvance.toLocaleString("bn-BD")}
                  </td>
                  <td className="p-2.5 border-r border-gray-300">
                    ৳ {totalLift.toLocaleString("bn-BD")}
                  </td>
                  <td
                    colSpan={2}
                    className="p-2 border-r border-gray-300 text-amber-900 text-right"
                  >
                    ব্যবহৃত ইউনিট:
                  </td>
                  <td className="p-2 border-r border-gray-300 text-amber-900">
                    {totalElecUsed} ইউ
                  </td>
                  <td className="p-2 border-r border-gray-300 text-amber-900 font-extrabold">
                    --
                  </td>
                  <td className="p-2.5 border-r border-gray-300 text-amber-900">
                    ৳ {totalElecBill.toLocaleString("bn-BD")}
                  </td>
                  <td className="p-2.5 border-r border-gray-300">
                    ৳ {totalWater.toLocaleString("bn-BD")}
                  </td>
                  <td className="p-2.5 border-r border-gray-300">
                    ৳ {totalGarage.toLocaleString("bn-BD")}
                  </td>
                  <td className="p-2.5 border-r border-gray-300 bg-gray-300 text-gray-900 font-black">
                    ৳ {totalAmountSum.toLocaleString("bn-BD")}
                  </td>
                  <td className="p-2.5 border-r border-gray-300 bg-[#a3cfbb] text-emerald-950 font-black">
                    ৳ {totalCollectedSum.toLocaleString("bn-BD")}
                  </td>
                  <td className="p-2.5 border-r border-gray-300 bg-[#f1aeb5] text-red-950 font-black">
                    ৳ {totalDueSum.toLocaleString("bn-BD")}
                  </td>
                  <td className="p-2.5">--</td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>

        {/* Bottom Report Date display */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200 text-xs text-gray-600 font-semibold">
          <div>
            <span>মোট রেকর্ড: {calculatedRows.length} টি</span>
          </div>
          <div className="text-right font-bold text-gray-800">
            <span>রিপোর্ট প্রকাশের তারিখ: {reportDateStr}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
