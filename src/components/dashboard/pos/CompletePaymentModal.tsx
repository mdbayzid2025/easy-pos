import React, { useState, useEffect } from "react";
import {
  X,
  CreditCard,
  Banknote,
  Smartphone,
  AlertCircle,
  QrCode,
  Check,
} from "lucide-react";

interface CompletePaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  grandTotal: number;
  initialPaymentMethod?: string;
  customerName: string;
  onConfirmPayment: (details: {
    paymentMethod: string;
    paidAmount: number;
    changeAmount: number;
    transactionId?: string;
  }) => void;
}

export const CompletePaymentModal: React.FC<CompletePaymentModalProps> = ({
  isOpen,
  onClose,
  grandTotal,
  initialPaymentMethod = "Cash",
  customerName,
  onConfirmPayment,
}) => {
  const [paymentMethod, setPaymentMethod] = useState<string>("Cash");
  const [amountReceived, setAmountReceived] = useState<string>("");
  const [hasTransactionId, setHasTransactionId] = useState<boolean>(false);
  const [transactionId, setTransactionId] = useState<string>("");

  // Keep modal state always in sync whenever it opens or grandTotal / initialPaymentMethod changes
  useEffect(() => {
    if (isOpen) {
      setAmountReceived(grandTotal.toFixed(2));
      setPaymentMethod(initialPaymentMethod || "Cash");
      setTransactionId("");
      setHasTransactionId(false);
    }
  }, [isOpen, grandTotal, initialPaymentMethod]);

  if (!isOpen) return null;

  const numericReceived = parseFloat(amountReceived) || 0;
  const changeAmount = Math.max(0, numericReceived - grandTotal);

  const presetAmounts = [500, 1000, 2000, 2500, 3000];

  const handleComplete = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirmPayment({
      paymentMethod,
      paidAmount: numericReceived,
      changeAmount,
      transactionId: hasTransactionId ? transactionId : undefined,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative bg-white rounded-2xl shadow-2xl border border-slate-100 w-full max-w-lg overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              ✓
            </div>
            <h2 className="text-lg font-bold text-slate-800">Complete Payment</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleComplete} className="p-6 space-y-5">
          {/* Total Amount Header */}
          <div>
            <span className="text-xs font-semibold text-slate-400 block">
              Total Amount:
            </span>
            <div className="text-3xl font-extrabold text-[#166534] tracking-tight mt-0.5">
              ৳ {grandTotal.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className="text-xs text-slate-600 mt-1 flex items-center gap-1">
              <span>Customer:</span>
              <strong className="text-slate-800">{customerName}</strong>
              <button
                type="button"
                className="text-emerald-600 hover:underline text-[11px] font-medium ml-1"
              >
                (Change) / Select Customer
              </button>
            </div>
          </div>

          {/* Payment Method Selector Tabs */}
          <div>
            <div className="grid grid-cols-5 gap-2">
              {/* Cash */}
              <button
                type="button"
                onClick={() => setPaymentMethod("Cash")}
                className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  paymentMethod === "Cash"
                    ? "bg-[#166534] text-white border-[#166534] shadow-xs"
                    : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                }`}
              >
                <Banknote size={15} />
                <span>Cash</span>
              </button>

              {/* Card */}
              <button
                type="button"
                onClick={() => setPaymentMethod("Card")}
                className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  paymentMethod === "Card"
                    ? "bg-[#166534] text-white border-[#166534] shadow-xs"
                    : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                }`}
              >
                <CreditCard size={15} />
                <span>Card</span>
              </button>

              {/* bKash */}
              <button
                type="button"
                onClick={() => setPaymentMethod("bKash")}
                className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  paymentMethod === "bKash"
                    ? "bg-[#e2136e] text-white border-[#e2136e] shadow-xs"
                    : "bg-white text-[#e2136e] border-pink-200 hover:bg-pink-50"
                }`}
              >
                <Smartphone size={15} />
                <span>bKash</span>
              </button>

              {/* Nagad */}
              <button
                type="button"
                onClick={() => setPaymentMethod("Nagad")}
                className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  paymentMethod === "Nagad"
                    ? "bg-[#f7941d] text-white border-[#f7941d] shadow-xs"
                    : "bg-white text-[#f7941d] border-orange-200 hover:bg-orange-50"
                }`}
              >
                <Smartphone size={15} />
                <span>Nagad</span>
              </button>

              {/* Due */}
              <button
                type="button"
                onClick={() => setPaymentMethod("Due")}
                className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  paymentMethod === "Due"
                    ? "bg-amber-600 text-white border-amber-600 shadow-xs"
                    : "bg-white text-amber-700 border-amber-200 hover:bg-amber-50"
                }`}
              >
                <AlertCircle size={15} />
                <span>Due</span>
              </button>
            </div>
          </div>

          {/* Amount Received & Change Amount */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 items-center">
            {/* Amount Received Input */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Amount Received
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-3 text-lg font-bold text-slate-800">
                  ৳
                </span>
                <input
                  type="number"
                  step="any"
                  value={amountReceived}
                  onChange={(e) => setAmountReceived(e.target.value)}
                  className="w-full h-12 pl-8 pr-10 text-xl font-bold bg-white border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-emerald-500"
                />
                <QrCode className="w-5 h-5 text-slate-400 absolute right-3 top-3.5 pointer-events-none" />
              </div>
            </div>

            {/* Change Amount Box */}
            <div className="bg-emerald-50/70 border border-emerald-100 rounded-xl p-2.5 px-4 flex flex-col justify-center h-12">
              <span className="text-[11px] font-semibold text-slate-500">
                Change Amount
              </span>
              <span className="text-xl font-extrabold text-emerald-800 tracking-tight">
                ৳ {changeAmount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
          </div>

          {/* Preset Cash Quick Buttons */}
          <div className="flex items-center gap-2">
            {presetAmounts.map((amt) => (
              <button
                key={amt}
                type="button"
                onClick={() => setAmountReceived(amt.toString())}
                className="flex-1 py-1.5 px-2 text-xs font-semibold bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-lg transition-colors cursor-pointer"
              >
                ৳ {amt}
              </button>
            ))}
          </div>

          {/* Optional Card/bKash Transaction ID Toggle */}
          <div className="pt-1">
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => setHasTransactionId(!hasTransactionId)}
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  hasTransactionId ? "bg-emerald-600" : "bg-slate-300"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                    hasTransactionId ? "translate-x-4" : "translate-x-0"
                  }`}
                />
              </button>
              <label
                onClick={() => setHasTransactionId(!hasTransactionId)}
                className="text-xs font-medium text-slate-600 cursor-pointer select-none"
              >
                For Card / bKash: Input Transaction ID
              </label>
            </div>

            {hasTransactionId && (
              <input
                type="text"
                placeholder="Enter Transaction / Reference ID..."
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value)}
                className="mt-2.5 w-full h-9 px-3 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-emerald-500"
              />
            )}
          </div>

          {/* Selected Customer Footnote */}
          <div className="text-[11px] text-slate-500 pt-1">
            Customer: <strong className="text-slate-700">{customerName}</strong>{" "}
            <span className="text-emerald-600 cursor-pointer">(Change)</span>
          </div>

          {/* Action Footer Buttons */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-semibold rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-2 py-2.5 bg-[#16a34a] hover:bg-[#15803d] text-white text-xs sm:text-sm font-semibold rounded-xl flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
            >
              <Check size={16} className="stroke-[2.5]" />
              <span>
                Complete Payment (৳{" "}
                {grandTotal.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                )
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
