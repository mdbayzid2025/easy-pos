import { useState } from "react";
import ReportsCatalogHeader from "./ReportsCatalogHeader";
import ReportsCatalogTable from "./ReportsCatalogTable";
import IncomeReportTable from "./incomeReport/IncomeReportTable";
import ExpenseReportTable from "./expenseReport/ExpenseReportTable";
import BankDepositReportTable from "./depositReport/BankDepositReportTable";
import SummaryReportView from "./summary/SummaryReportView";
import { reportCatalogList, type ReportCatalogItem } from "./types";

export default function ReportsManagement() {
  const [activeView, setActiveView] = useState<"catalog" | "report_detail">(
    "catalog",
  );
  const [openedReport, setOpenedReport] = useState<ReportCatalogItem | null>(
    null,
  );

  const handleOpenReport = (report: ReportCatalogItem) => {
    setOpenedReport(report);
    setActiveView("report_detail");
  };

  return (
    <div className="w-full space-y-6 p-4 sm:p-6 pb-16">
      {/* 1. CATALOG DIRECTORY VIEW */}
      {activeView === "catalog" && (
        <>
          <ReportsCatalogHeader />
          <ReportsCatalogTable
            catalogList={reportCatalogList}
            onOpenReport={handleOpenReport}
          />
        </>
      )}

      {/* 2. OPENED REPORT VIEWER VIEW */}
      {activeView === "report_detail" && openedReport && (
        <div className="space-y-6">
          {openedReport.type === "income" && (
            <IncomeReportTable
              onBackToCatalog={() => setActiveView("catalog")}
            />
          )}

          {openedReport.type === "expense" && (
            <ExpenseReportTable
              onBackToCatalog={() => setActiveView("catalog")}
            />
          )}

          {openedReport.type === "deposit" && (
            <BankDepositReportTable
              onBackToCatalog={() => setActiveView("catalog")}
            />
          )}

          {openedReport.type === "summary" && (
            <SummaryReportView
              onBackToCatalog={() => setActiveView("catalog")}
            />
          )}
        </div>
      )}
    </div>
  );
}
