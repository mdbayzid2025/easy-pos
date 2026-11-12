import React, { useState } from "react";
import {
  X,
  Check,
  CreditCard,
  DollarSign,
  Smartphone,
  Landmark,
} from "lucide-react";
import {
  type Supplier,
  mockRecentPaymentHistory,
} from "./mockSuppliersData";

interface RecordSupplierPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  supplier: Supplier;
  onPaymentSuccess?: (amount: number) => void;
}

export const RecordSupplierPaymentModal: React.FC<
  RecordSupplierPaymentModalProps
> = ({ isOpen, onClose, supplier, onPaymentSuccess }) => {
  const previousDue = supplier.due || 85500.0;
  const [paymentAmount, setPaymentAmount] = useState<number>(50000.0);
  const [paymentDate, setPaymentDate] = useState("2026-11-07");
  const [paymentMethod, setPaymentMethod] = useState("Bank");
  const [referenceNo, setReferenceNo] = useState(
    "Bank Transfer (Bank Asia) - TR-98218"
  );
  const [notes, setNotes] = useState(
    "Advance payment for winter stock order."
  );

  if (!isOpen) return null;

  const remainingDue = Math.max(0, previousDue - paymentAmount);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onPaymentSuccess) {
      onPaymentSuccess(paymentAmount);
    }
    onClose();
  };

  const paymentMethods = [
    { id: "Cash", label: "Cash", icon: DollarSign },
    { id: "Bank", label: "Bank", icon: Landmark },
    { id: "bKash", label: "bKash", icon: Smartphone },
    { id: "Nagad", label: "Nagad", icon: Smartphone },
    { id: "Card", label: "Card", icon: CreditCard },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-2xl w-full overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-start justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 tracking-tight">
              Record Supplier Payment
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Apply payment to reduce outstanding balance.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Supplier Info Bar matching Image 1 */}
          <div className="px-5 py-3 bg-slate-50 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-1.5 text-slate-700">
              <span className="text-slate-500 font-medium">Supplier Name:</span>
              <strong className="text-slate-900">{supplier.name}</strong>
            </div>

            <div className="flex items-center gap-1.5 text-slate-700">
              <span className="text-slate-500 font-medium">Company:</span>
              <span className="font-semibold text-slate-800">{supplier.company}</span>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-slate-500 font-medium">Current Due:</span>
              <span className="px-2 py-0.5 rounded-md font-bold text-rose-600 bg-rose-50 border border-rose-200 text-xs">
                ৳{previousDue.toLocaleString("en-US", { minimumFractionDigits: 0 })}
              </span>
            </div>
          </div>

          {/* Modal Body: 2 Columns matching Image 1 */}
          <div className="p-5 grid grid-cols-1 md:grid-cols-12 gap-5">
            {/* Left Column (7 cols): Payment Inputs */}
            <div className="md:col-span-7 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Payment Amount */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Payment Amount (৳) <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-xs text-slate-400 font-bold">
                      ৳
                    </span>
                    <input
                      type="number"
                      required
                      value={paymentAmount}
                      onChange={(e) =>
                        setPaymentAmount(Number(e.target.value) || 0)
                      }
                      className="w-full h-9 pl-7 pr-3 text-xs bg-white border border-slate-200 rounded-lg text-slate-900 font-bold focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                {/* Payment Date */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Payment Date <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={paymentDate}
                    onChange={(e) => setPaymentDate(e.target.value)}
                    className="w-full h-9 px-3 text-xs bg-white border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:border-emerald-500 cursor-pointer"
                  />
                </div>
              </div>

              {/* Payment Method Pills matching Image 1 */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1.5">
                  Payment Method
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {paymentMethods.map((m) => {
                    const isSelected = paymentMethod === m.id;
                    return (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setPaymentMethod(m.id)}
                        className={`h-8 px-3 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                          isSelected
                            ? "bg-[#ecfdf5] text-[#16a34a] border border-[#a7f3d0] font-bold"
                            : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        <m.icon size={13} />
                        <span>{m.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Reference / TrxID */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Reference / TrxID Number
                </label>
                <input
                  type="text"
                  value={referenceNo}
                  onChange={(e) => setReferenceNo(e.target.value)}
                  placeholder="e.g., Bank transaction ID, Cheque number"
                  className="w-full h-9 px-3 text-xs bg-white border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Notes */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Notes
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Optional transaction notes..."
                  rows={2}
                  className="w-full p-2.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500 resize-none"
                />
              </div>
            </div>

            {/* Right Column (5 cols): Calculation & Recent History */}
            <div className="md:col-span-5 space-y-4">
              {/* Payment Calculation Card */}
              <div className="bg-slate-50/80 rounded-xl p-3.5 border border-slate-200/80 space-y-2 text-xs">
                <h4 className="text-[11px] font-bold text-slate-800 tracking-tight">
                  Payment Calculation
                </h4>
                <div className="flex items-center justify-between text-slate-600">
                  <span>Previous Due</span>
                  <span className="font-semibold text-slate-800">
                    ৳{previousDue.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex items-center justify-between text-slate-600">
                  <span>Payment Amount</span>
                  <span className="font-bold text-emerald-600">
                    -৳{paymentAmount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                  <span className="font-bold text-slate-800">Remaining Due</span>
                  <span className="px-2 py-0.5 rounded-md font-bold text-rose-600 bg-rose-50 border border-rose-200 text-xs">
                    ৳{remainingDue.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

              {/* Recent Payment History Table matching Image 1 */}
              <div className="bg-white rounded-xl border border-slate-200/80 overflow-hidden">
                <div className="p-2.5 border-b border-slate-100 bg-slate-50/50">
                  <h4 className="text-[11px] font-bold text-slate-800">
                    Recent Payment History
                  </h4>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-[11px]">
                    <thead>
                      <tr className="border-b border-slate-100 bg-slate-50 text-slate-500">
                        <th className="py-1.5 px-2.5">Date</th>
                        <th className="py-1.5 px-2">Ref / Method</th>
                        <th className="py-1.5 px-2 text-right">Amount</th>
                        <th className="py-1.5 px-2.5 text-right">Bal</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {mockRecentPaymentHistory.map((h) => (
                        <tr key={h.id} className="hover:bg-slate-50/50">
                          <td className="py-2 px-2.5 text-slate-600 font-medium whitespace-nowrap">
                            {h.date}
                          </td>
                          <td className="py-2 px-2 text-slate-700">
                            {h.refMethod}
                          </td>
                          <td className="py-2 px-2 text-right font-bold text-emerald-600">
                            ৳{h.amount.toLocaleString("en-US")}
                          </td>
                          <td className="py-2 px-2.5 text-right font-semibold text-slate-700">
                            ৳{h.balance.toLocaleString("en-US")}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Buttons matching Image 1 */}
          <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="h-9 px-4 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="h-9 px-4 bg-[#16a34a] hover:bg-[#15803d] text-white text-xs font-bold rounded-lg flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
            >
              <Check size={14} />
              <span>Save Payment</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RecordSupplierPaymentModal;
