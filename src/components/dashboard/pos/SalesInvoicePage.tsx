import React, { useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Printer,
  Mail,
  MessageSquare,
  FileDown,
  Plus,
  Calendar,
} from "lucide-react";
import { PosReceipt, type ReceiptData } from "./PosReceipt";

export const SalesInvoicePage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const receiptPrintRef = useRef<HTMLDivElement>(null);

  // Default receipt data matching Screenshot 1 or passed via navigation state
  const receiptData: ReceiptData = location.state?.receiptData || {
    invoiceNo: "INV-2026-1107",
    date: "07 Nov 2026, 11:55 AM",
    cashier: "Abir Hasan",
    customer: "Walk-in Customer",
    customerId: "Walk-in",
    paymentMethod: "Cash",
    items: [
      {
        id: "1",
        name: "Rupchanda Soybean Oil 5L",
        qty: 1,
        unitPrice: 890.0,
        discount: 0.0,
        total: 890.0,
      },
      {
        id: "2",
        name: "Aarong Liquid Milk 1L",
        qty: 2,
        unitPrice: 90.0,
        discount: 0.0,
        total: 180.0,
      },
      {
        id: "3",
        name: "ACI Pure Salt 1kg",
        qty: 3,
        unitPrice: 38.0,
        discount: 0.0,
        total: 114.0,
      },
      {
        id: "4",
        name: "All Time Family Bread 400g",
        qty: 1,
        unitPrice: 50.0,
        discount: 0.0,
        total: 50.0,
      },
    ],
    subtotal: 1234.0,
    discount: 20.0,
    taxRate: 5,
    taxAmount: 61.7,
    grandTotal: 1275.7,
    paidAmount: 1300.0,
    changeAmount: 24.3,
    dueAmount: 0.0,
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPdf = () => {
    alert("Invoice PDF generation initiated. Printing dialog will open for 80mm x 60mm thermal receipt.");
    window.print();
  };

  return (
    <div className="w-full min-h-screen bg-[#f8fafc] p-4 sm:p-6 lg:p-8 space-y-5">
      {/* 1. Header with Title and Current Date */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          Sales Invoice / Receipt
        </h1>

        <div className="flex items-center gap-2 bg-white border border-slate-200/80 rounded-lg px-3 py-1.5 shadow-2xs text-slate-600 text-xs font-semibold self-start sm:self-auto">
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
          <span>Nov 7, 2026</span>
        </div>
      </div>

      {/* 2. Main Two-Column View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: Actions & Status (takes 4 cols on lg) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-2xs space-y-4">
            {/* Invoice header & Paid badge */}
            <div>
              <span className="text-xs text-slate-400 font-medium">Invoice</span>
              <div className="flex items-center justify-between mt-0.5">
                <h3 className="text-base font-bold text-slate-900">
                  #{receiptData.invoiceNo}
                </h3>
                <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-600 border border-emerald-200">
                  Paid
                </span>
              </div>
            </div>

            {/* Action Buttons List matching Screenshot 1 */}
            <div className="space-y-2 pt-2">
              {/* Print Invoice Button */}
              <button
                type="button"
                onClick={handlePrint}
                className="w-full h-10 px-4 bg-[#16a34a] hover:bg-[#15803d] text-white font-semibold text-xs sm:text-sm rounded-xl flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
              >
                <Printer size={16} />
                <span>Print Invoice</span>
              </button>

              {/* Email */}
              <button
                type="button"
                onClick={() => alert(`Emailing invoice ${receiptData.invoiceNo} to customer...`)}
                className="w-full h-10 px-4 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs sm:text-sm rounded-xl border border-slate-200 flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Mail size={16} className="text-slate-500" />
                <span>Email</span>
              </button>

              {/* SMS */}
              <button
                type="button"
                onClick={() => alert(`Sending invoice link via SMS...`)}
                className="w-full h-10 px-4 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs sm:text-sm rounded-xl border border-slate-200 flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <MessageSquare size={16} className="text-slate-500" />
                <span>SMS</span>
              </button>

              {/* Download PDF */}
              <button
                type="button"
                onClick={handleDownloadPdf}
                className="w-full h-10 px-4 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs sm:text-sm rounded-xl border border-slate-200 flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <FileDown size={16} className="text-slate-500" />
                <span>Download PDF</span>
              </button>

              {/* + New Sale */}
              <button
                type="button"
                onClick={() => navigate("/pos")}
                className="w-full h-10 px-4 bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs sm:text-sm rounded-xl border border-slate-300 flex items-center justify-center gap-2 transition-colors cursor-pointer mt-3"
              >
                <Plus size={16} />
                <span>New Sale</span>
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Real-time Thermal Receipt Preview (80mm x 60mm styled) */}
        <div className="lg:col-span-8 flex justify-center">
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-100 shadow-sm w-full max-w-lg flex flex-col items-center">
            {/* The Print Paper Container */}
            <div className="border border-slate-200 shadow-md rounded-lg overflow-hidden bg-white p-2">
              <PosReceipt ref={receiptPrintRef} data={receiptData} />
            </div>
            <p className="text-xs text-slate-400 mt-4 text-center">
              Paper Format: <strong>80mm Thermal Receipt</strong> (Auto-scales to 80mm × 60mm / continuous roll)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesInvoicePage;

