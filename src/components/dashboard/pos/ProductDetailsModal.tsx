import React from "react";
import { X, QrCode, Tag, Layers, CheckCircle2, AlertTriangle, XCircle } from "lucide-react";
import { type GroceryProduct } from "./mockProducts";

interface ProductDetailsModalProps {
  product: GroceryProduct | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: (product: GroceryProduct) => void;
}

export const ProductDetailsModal: React.FC<ProductDetailsModalProps> = ({
  product,
  isOpen,
  onClose,
  onEdit,
}) => {
  if (!isOpen || !product) return null;

  const renderStatusBadge = (status: GroceryProduct["status"]) => {
    switch (status) {
      case "In Stock":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            In Stock
          </span>
        );
      case "Low Stock":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            Low Stock
          </span>
        );
      case "Out of Stock":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            <XCircle className="w-3.5 h-3.5 text-rose-600" />
            Out of Stock
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop Overlay */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative bg-white rounded-2xl shadow-2xl border border-slate-100 w-full max-w-2xl overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4.5 border-b border-slate-100 bg-slate-50/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center text-xl shadow-2xs">
              {product.image}
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-800 leading-snug">
                {product.name}
              </h2>
              <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5 font-medium">
                <span>SKU: {product.sku}</span>
                <span>•</span>
                <span>Barcode: {product.barcode}</span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Status and Categorization */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-100">
            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-500 font-semibold">Status:</span>
              {renderStatusBadge(product.status)}
            </div>
            <div className="flex items-center gap-4 text-xs font-medium text-slate-600">
              <span className="flex items-center gap-1.5">
                <Tag size={13} className="text-slate-400" />
                Category: <strong className="text-slate-800">{product.category}</strong>
              </span>
              <span className="flex items-center gap-1.5">
                <Layers size={13} className="text-slate-400" />
                Brand: <strong className="text-slate-800">{product.brand}</strong>
              </span>
            </div>
          </div>

          {/* Pricing Grid */}
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">
              Pricing Overview
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 bg-white border border-slate-200/80 rounded-xl">
                <span className="text-[11px] text-slate-400 font-medium block">Purchase Price</span>
                <span className="text-base font-bold text-slate-900 mt-0.5 block">
                  ৳{product.purchasePrice.toFixed(2)}
                </span>
              </div>
              <div className="p-3 bg-white border border-slate-200/80 rounded-xl">
                <span className="text-[11px] text-slate-400 font-medium block">Selling Price</span>
                <span className="text-base font-bold text-emerald-700 mt-0.5 block">
                  ৳{product.sellingPrice.toFixed(2)}
                </span>
              </div>
              <div className="p-3 bg-white border border-slate-200/80 rounded-xl">
                <span className="text-[11px] text-slate-400 font-medium block">Wholesale Price</span>
                <span className="text-base font-bold text-slate-800 mt-0.5 block">
                  ৳{(product.wholesalePrice || product.purchasePrice * 1.05).toFixed(2)}
                </span>
              </div>
              <div className="p-3 bg-white border border-slate-200/80 rounded-xl">
                <span className="text-[11px] text-slate-400 font-medium block">Min. Selling Price</span>
                <span className="text-base font-bold text-slate-800 mt-0.5 block">
                  ৳{(product.minSellingPrice || product.sellingPrice * 0.95).toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Stock & Storage Details */}
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">
              Stock & Storage Info
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 bg-slate-50/70 rounded-xl border border-slate-100">
                <span className="text-slate-400 block text-[11px]">Current Stock</span>
                <span className="text-lg font-bold text-slate-800 mt-0.5 block">
                  {product.currentStock} {product.unit}
                </span>
              </div>
              <div className="p-3 bg-slate-50/70 rounded-xl border border-slate-100">
                <span className="text-slate-400 block text-[11px]">Opening Stock</span>
                <span className="text-base font-bold text-slate-800 mt-0.5 block">
                  {product.openingStock ?? 100} {product.unit}
                </span>
              </div>
              <div className="p-3 bg-slate-50/70 rounded-xl border border-slate-100">
                <span className="text-slate-400 block text-[11px]">Min. Alert Level</span>
                <span className="text-base font-bold text-rose-600 mt-0.5 block">
                  {product.minStockAlert ?? 10} {product.unit}
                </span>
              </div>
              <div className="p-3 bg-slate-50/70 rounded-xl border border-slate-100">
                <span className="text-slate-400 block text-[11px]">Location Shelf</span>
                <span className="text-xs font-bold text-slate-800 mt-1 block truncate">
                  {product.warehouseShelf || "Warehouse A, Section 3"}
                </span>
              </div>
            </div>
          </div>

          {/* Description */}
          {product.description && (
            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Product Description
              </h4>
              <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100 leading-relaxed">
                {product.description}
              </p>
            </div>
          )}

          {/* Barcode Simulation */}
          <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-100">
            <div className="flex items-center gap-3">
              <QrCode size={28} className="text-slate-700" />
              <div>
                <span className="text-xs font-bold text-slate-800 block">Barcode Symbology</span>
                <span className="text-[11px] font-mono text-slate-500">{product.barcode} (Code128)</span>
              </div>
            </div>
            <button
              onClick={() => alert(`Printing barcode for ${product.name}...`)}
              className="text-xs font-semibold px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-lg transition-colors cursor-pointer"
            >
              Print Barcode
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2.5 px-6 py-3.5 bg-slate-50 border-t border-slate-100">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200/60 rounded-lg transition-colors cursor-pointer"
          >
            Close
          </button>
          {onEdit && (
            <button
              onClick={() => {
                onClose();
                onEdit(product);
              }}
              className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-2xs transition-colors cursor-pointer"
            >
              Edit Product
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

