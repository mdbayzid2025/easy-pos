import { forwardRef } from "react";
import { ShoppingCart, QrCode } from "lucide-react";

export interface ReceiptItem {
  id: string;
  name: string;
  qty: number;
  unitPrice: number;
  discount: number;
  total: number;
}

export interface ReceiptData {
  invoiceNo: string;
  date: string;
  cashier: string;
  customer: string;
  customerId: string;
  paymentMethod: string;
  items: ReceiptItem[];
  subtotal: number;
  discount: number;
  taxRate: number;
  taxAmount: number;
  grandTotal: number;
  paidAmount: number;
  changeAmount: number;
  dueAmount: number;
}

export const PosReceipt = forwardRef<HTMLDivElement, { data: ReceiptData }>(
  ({ data }, ref) => {
    return (
      <div
        ref={ref}
        className="pos-receipt-container font-mono bg-white text-slate-900 mx-auto p-4 select-none"
        style={{
          width: "80mm",
          minHeight: "60mm",
          boxSizing: "border-box",
          fontSize: "11px",
          lineHeight: "1.25",
        }}
      >
        {/* Store Header */}
        <div className="text-center mb-3">
          <div className="w-8 h-8 mx-auto rounded-lg bg-emerald-600 flex items-center justify-center text-white mb-1.5 print:bg-black">
            <ShoppingCart size={18} className="stroke-[2.5]" />
          </div>
          <h1 className="text-base font-extrabold tracking-tight uppercase text-slate-900">
            Pratidin Bazar
          </h1>
          <p className="text-[9.5px] text-slate-600">
            House 12, Road 4, Sector 3, Uttara, Dhaka-1230, Bangladesh
          </p>
          <p className="text-[9.5px] text-slate-600">
            Phone: +880 1712-345678 | Email: info@pratidinbazar.com
          </p>
        </div>

        <div className="border-b border-dashed border-slate-400 my-2" />

        {/* Invoice Metadata */}
        <div className="grid grid-cols-2 gap-1 text-[10px] text-slate-700 mb-2">
          <div>
            <p>
              <strong className="text-slate-900">Invoice No:</strong> {data.invoiceNo}
            </p>
            <p>
              <strong className="text-slate-900">Date:</strong> {data.date}
            </p>
            <p>
              <strong className="text-slate-900">Payment:</strong> {data.paymentMethod}
            </p>
          </div>
          <div className="text-right">
            <p>
              <strong className="text-slate-900">Cashier:</strong> {data.cashier}
            </p>
            <p>
              <strong className="text-slate-900">Customer:</strong> {data.customer}
            </p>
            <p>
              <strong className="text-slate-900">ID:</strong> {data.customerId}
            </p>
          </div>
        </div>

        {/* Itemized Table */}
        <table className="w-full text-left text-[10px] border-collapse mb-2">
          <thead>
            <tr className="border-b border-t border-slate-300 font-bold text-slate-800">
              <th className="py-1">Item</th>
              <th className="py-1 text-center">Qty</th>
              <th className="py-1 text-right">Unit Price</th>
              <th className="py-1 text-right">Discount</th>
              <th className="py-1 text-right">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-dotted divide-slate-200">
            {data.items.map((item, idx) => (
              <tr key={item.id}>
                <td className="py-1 pr-1 font-sans">
                  {idx + 1}. {item.name}
                </td>
                <td className="py-1 text-center font-bold">{item.qty}</td>
                <td className="py-1 text-right">৳{item.unitPrice.toFixed(2)}</td>
                <td className="py-1 text-right">৳{item.discount.toFixed(2)}</td>
                <td className="py-1 text-right font-bold text-slate-900">
                  ৳{item.total.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Totals Section */}
        <div className="border-t border-dashed border-slate-400 pt-1.5 space-y-0.5 text-[10.5px]">
          <div className="flex justify-between">
            <span className="text-slate-600">Subtotal</span>
            <span className="font-semibold">৳{data.subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-600">Discount</span>
            <span className="font-semibold text-rose-600">-৳{data.discount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-600">VAT/Tax ({data.taxRate}%)</span>
            <span className="font-semibold">৳{data.taxAmount.toFixed(2)}</span>
          </div>

          <div className="border-t-2 border-slate-800 my-1 pt-1 flex justify-between text-xs font-bold text-slate-900">
            <span>Grand Total</span>
            <span>৳{data.grandTotal.toFixed(2)}</span>
          </div>

          <div className="flex justify-between text-[10px] pt-1">
            <span className="text-slate-600">Paid Amount</span>
            <span className="font-semibold">৳{data.paidAmount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-[10px]">
            <span className="text-slate-600">Change / Return</span>
            <span className="font-semibold">৳{data.changeAmount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-[10px]">
            <span className="text-slate-600">Due Amount</span>
            <span className="font-semibold">৳{data.dueAmount.toFixed(2)}</span>
          </div>
        </div>

        {/* Payment Summary */}
        <div className="mt-2.5 p-1.5 bg-slate-50 border border-slate-200 rounded text-[9.5px]">
          <p>
            <strong className="text-slate-900">Payment Method:</strong> Paid via {data.paymentMethod}
          </p>
          <p className="text-slate-600">
            Received: ৳{data.paidAmount.toFixed(2)}, Change: ৳{data.changeAmount.toFixed(2)}
          </p>
        </div>

        {/* Footer Notes & Barcode */}
        <div className="text-center mt-3 pt-1 space-y-1">
          <p className="text-[10px] font-semibold text-slate-700">
            Thank you for shopping with us!
          </p>
          <p className="text-[9px] text-slate-500">Please come again.</p>

          <div className="flex items-center justify-between pt-2">
            <div className="flex flex-col items-center">
              <QrCode size={36} className="text-slate-800" />
              <span className="text-[8px] text-slate-500 mt-0.5">Scan to Verify</span>
            </div>

            {/* Simulated 1D Barcode */}
            <div className="flex flex-col items-center flex-1 pl-4">
              <div className="flex h-8 items-stretch gap-[1.5px] px-1 bg-white">
                <span className="w-[2px] bg-black" />
                <span className="w-[1px] bg-black" />
                <span className="w-[3px] bg-black" />
                <span className="w-[1px] bg-black" />
                <span className="w-[2px] bg-black" />
                <span className="w-[3px] bg-black" />
                <span className="w-[1px] bg-black" />
                <span className="w-[2px] bg-black" />
                <span className="w-[1px] bg-black" />
                <span className="w-[3px] bg-black" />
                <span className="w-[2px] bg-black" />
                <span className="w-[1px] bg-black" />
                <span className="w-[3px] bg-black" />
                <span className="w-[2px] bg-black" />
                <span className="w-[1px] bg-black" />
                <span className="w-[2px] bg-black" />
              </div>
              <span className="text-[9px] tracking-widest font-mono text-slate-600 mt-0.5">
                {data.invoiceNo}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

PosReceipt.displayName = "PosReceipt";

