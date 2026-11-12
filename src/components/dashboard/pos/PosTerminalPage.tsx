import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Barcode,
  Plus,
  Minus,
  X,
  UserPlus,
  ChevronDown,
  Printer,
  PauseCircle,
  Trash2,
  Check,
} from "lucide-react";
import { CompletePaymentModal } from "./CompletePaymentModal";
import { type ReceiptData } from "./PosReceipt";

interface CartItem {
  id: string;
  name: string;
  image: string;
  price: number;
  qty: number;
  unit: string;
}

interface PosProduct {
  id: string;
  name: string;
  price: number;
  stock: number;
  stockWarning?: "low stock" | "out of stock";
  category: string;
  image: string;
}

export const PosTerminalPage: React.FC = () => {
  const navigate = useNavigate();

  // Search & Category Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Customer state
  const [customerName, setCustomerName] = useState("Walk-in Customer");

  // Cart State (Initialized with items matching Screenshot 1 & 2)
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: "1",
      name: "Rupchanda Soybean Oil 5L",
      image: "🧴",
      price: 890.0,
      qty: 1,
      unit: "pc",
    },
    {
      id: "2",
      name: "Aarong Liquid Milk 1L",
      image: "🥛",
      price: 90.0,
      qty: 2,
      unit: "pcs",
    },
    {
      id: "3",
      name: "ACI Pure Salt 1kg",
      image: "🧂",
      price: 38.0,
      qty: 3,
      unit: "pcs",
    },
    {
      id: "4",
      name: "All Time Family Bread 400g",
      image: "🍞",
      price: 50.0,
      qty: 1,
      unit: "pc",
    },
    {
      id: "5",
      name: "Poultry Eggs (Dozen)",
      image: "🥚",
      price: 50.0,
      qty: 1,
      unit: "pc",
    },
  ]);

  // Discount & Tax States
  const [discountInput, setDiscountInput] = useState<string>("20.00");
  const [isTaxEnabled, setIsTaxEnabled] = useState<boolean>(false);
  const taxRatePercent = 5; // 5%

  // Payment method selection: Left side Cash, right side other method dropdown (default "Cash")
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>("Cash");
  const [secondaryPaymentMethod, setSecondaryPaymentMethod] = useState<string>("Card");

  // Modal State
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  // Available Categories
  const categories = [
    "All",
    "Rice & Grains",
    "Oil & Fats",
    "Snacks & Biscuits",
    "Drinks & Beverages",
    "Dairy & Eggs",
    "Household & Cleaning",
    "Baby Care",
    "Spices",
  ];

  // POS Product Catalog matching screenshot grid
  const catalogProducts: PosProduct[] = [
    {
      id: "p1",
      name: "ACI Pure Salt 1kg",
      price: 38.0,
      stock: 120,
      category: "Spices",
      image: "🧂",
    },
    {
      id: "p2",
      name: "Rupchanda Soybean Oil 5L",
      price: 890.0,
      stock: 45,
      category: "Oil & Fats",
      image: "🧴",
    },
    {
      id: "p3",
      name: "Chashi Chinigura Rice 1kg",
      price: 145.0,
      stock: 85,
      stockWarning: "low stock",
      category: "Rice & Grains",
      image: "🍚",
    },
    {
      id: "p4",
      name: "All Time Family Bread 400g",
      price: 50.0,
      stock: 32,
      category: "Dairy & Eggs",
      image: "🍞",
    },
    {
      id: "p5",
      name: "Poultry Eggs (Dozen)",
      price: 50.0,
      stock: 32,
      category: "Dairy & Eggs",
      image: "🥚",
    },
    {
      id: "p6",
      name: "Poultry Eggs (Dozen)",
      price: 150.0,
      stock: 15,
      category: "Dairy & Eggs",
      image: "🥚",
    },
    {
      id: "p7",
      name: "Ispahani Mirzapore Tea 400g",
      price: 230.0,
      stock: 60,
      category: "Drinks & Beverages",
      image: "🍵",
    },
    {
      id: "p8",
      name: "Maggi 2-Min Noodles 8-Pack",
      price: 175.0,
      stock: 5,
      stockWarning: "low stock",
      category: "Snacks & Biscuits",
      image: "🍜",
    },
    {
      id: "p9",
      name: "Pran Potata Spicy Biscuits 100g",
      price: 15.0,
      stock: 250,
      category: "Snacks & Biscuits",
      image: "🥔",
    },
    {
      id: "p10",
      name: "Fresh Refined Sugar 1kg",
      price: 135.0,
      stock: 0,
      stockWarning: "out of stock",
      category: "Rice & Grains",
      image: "🍬",
    },
    {
      id: "p11",
      name: "Teer Atta 2kg",
      price: 145.0,
      stock: 5,
      stockWarning: "low stock",
      category: "Rice & Grains",
      image: "🌾",
    },
    {
      id: "p12",
      name: "Pran Tomato Ketchup 500g",
      price: 130.0,
      stock: 3,
      stockWarning: "low stock",
      category: "Spices",
      image: "🥫",
    },
  ];

  // Filter Catalog
  const filteredCatalog = catalogProducts.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Cart operations
  const addToCart = (product: PosProduct) => {
    if (product.stock <= 0) {
      alert("This item is currently out of stock!");
      return;
    }
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [
        ...prev,
        {
          id: product.id,
          name: product.name,
          image: product.image,
          price: product.price,
          qty: 1,
          unit: "pc",
        },
      ];
    });
  };

  const updateQuantity = (id: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQty = item.qty + delta;
            return newQty > 0 ? { ...item, qty: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  // Editable unit price in marked area
  const updateItemPrice = (id: string, newPriceStr: string) => {
    const newPrice = parseFloat(newPriceStr) || 0;
    setCartItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, price: newPrice } : item))
    );
  };

  const removeItem = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    if (window.confirm("Are you sure you want to clear the cart?")) {
      setCartItems([]);
    }
  };

  // Calculations
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
  const parsedDiscount = parseFloat(discountInput) || 0;
  const discount = Math.min(subtotal, Math.max(0, parsedDiscount));
  const taxableAmount = Math.max(0, subtotal - discount);
  const taxAmount = isTaxEnabled ? taxableAmount * (taxRatePercent / 100) : 0;
  const grandTotal = taxableAmount + taxAmount;

  const handleConfirmPayment = (paymentDetails: {
    paymentMethod: string;
    paidAmount: number;
    changeAmount: number;
    transactionId?: string;
  }) => {
    setIsPaymentModalOpen(false);

    // Prepare receipt data
    const receiptData: ReceiptData = {
      invoiceNo: `INV-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
      cashier: "Abir Hasan",
      customer: customerName,
      customerId: "Walk-in",
      paymentMethod: paymentDetails.paymentMethod,
      items: cartItems.map((c) => ({
        id: c.id,
        name: c.name,
        qty: c.qty,
        unitPrice: c.price,
        discount: 0.0,
        total: c.price * c.qty,
      })),
      subtotal,
      discount,
      taxRate: isTaxEnabled ? taxRatePercent : 0,
      taxAmount,
      grandTotal,
      paidAmount: paymentDetails.paidAmount,
      changeAmount: paymentDetails.changeAmount,
      dueAmount: Math.max(0, grandTotal - paymentDetails.paidAmount),
    };

    // Navigate to Sales Invoice / Receipt page with updated data
    navigate("/pos/invoice", { state: { receiptData } });
  };

  return (
    <div className="w-full min-h-screen bg-[#f8fafc] p-3 sm:p-5 lg:p-6 space-y-4">
      {/* Top Header / Store Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-200/80 gap-2">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-800">Pratidin Bazar</h2>
          <span className="text-xs text-slate-400">Store Name</span>
        </div>

        <div className="text-right text-xs text-slate-500">
          <span className="font-semibold text-slate-800">Cashier: Abir Hasan</span>
          <p className="text-[11px] text-slate-400">Saturday, Nov 7, 2026 • 11:55 AM</p>
        </div>
      </div>

      {/* Main 2-Column POS Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* LEFT COLUMN: Product Catalog & Category Filters (takes 7 cols on lg) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Search Bar with Barcode Scanner Icon */}
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by product name or scan barcode..."
              className="w-full h-10 pl-10 pr-10 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl placeholder-slate-400 text-slate-800 focus:outline-none focus:border-emerald-500 shadow-2xs transition-colors"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
            <button
              type="button"
              title="Barcode Scanner Mode"
              className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <Barcode className="w-5 h-5" />
            </button>
          </div>

          {/* Category Filter Pills Horizontal Scroll */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1.5 scrollbar-thin">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-[#166534] text-white shadow-xs"
                    : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Product Cards Grid matching Screenshot */}
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-3 gap-3">
            {filteredCatalog.map((prod) => {
              const isOutOfStock = prod.stock <= 0;
              return (
                <div
                  key={prod.id}
                  onClick={() => addToCart(prod)}
                  className={`bg-white rounded-xl p-3 border transition-all cursor-pointer flex flex-col justify-between relative shadow-2xs hover:shadow-xs group ${
                    isOutOfStock
                      ? "border-slate-200 opacity-60 pointer-events-none"
                      : "border-slate-100 hover:border-emerald-500/60"
                  }`}
                >
                  {/* Top Thumbnail Image */}
                  <div className="w-full h-20 bg-slate-50 rounded-lg flex items-center justify-center text-3xl mb-2">
                    {prod.image}
                  </div>

                  {/* Title & Price */}
                  <div>
                    <h4 className="text-xs font-semibold text-slate-800 line-clamp-2 leading-tight group-hover:text-emerald-700 transition-colors">
                      {prod.name}
                    </h4>
                    <div className="text-sm font-bold text-slate-900 mt-1">
                      ৳{prod.price.toFixed(2)}
                    </div>
                  </div>

                  {/* Stock Warning Badge / Stock Counter */}
                  <div className="mt-2 pt-1 border-t border-slate-50 flex items-center justify-between text-[11px]">
                    <span className="text-slate-400 font-medium">
                      Stock: {prod.stock}
                    </span>
                    {prod.stockWarning === "low stock" && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-50 text-amber-600 border border-amber-200">
                        Low
                      </span>
                    )}
                    {isOutOfStock && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-500">
                        Out of Stock
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT COLUMN: Interactive Cart, Totals & Checkout (takes 5 cols on lg) */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-4 sm:p-5 border border-slate-100 shadow-2xs space-y-4">
          {/* Customer Selection Box */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide block mb-0.5">
                Search or Add Customer
              </span>
              <div className="relative">
                <select
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full h-9 pl-3 pr-8 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-emerald-500 appearance-none cursor-pointer"
                >
                  <option value="Walk-in Customer">(e.g., Walk-in Customer)</option>
                  <option value="Karim Uddin">Karim Uddin (01712-112233)</option>
                  <option value="Fatima Begum">Fatima Begum (01819-445566)</option>
                  <option value="Tanvir Ahmed">Tanvir Ahmed (01911-778899)</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-3 pointer-events-none" />
              </div>
            </div>

            {/* Add Customer Button */}
            <button
              type="button"
              onClick={() => {
                const name = prompt("Enter new customer name & phone:");
                if (name) setCustomerName(name);
              }}
              className="mt-4 px-2.5 h-9 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg flex items-center gap-1 transition-colors cursor-pointer shrink-0"
              title="Add Customer"
            >
              <UserPlus size={14} />
              <span className="hidden sm:inline">Add Customer</span>
            </button>
          </div>

          {/* Cart Items List */}
          <div className="border-t border-b border-slate-100 py-2 space-y-2.5 max-h-[380px] overflow-y-auto">
            {cartItems.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400">
                Cart is empty. Click on products to add items.
              </div>
            ) : (
              cartItems.map((item) => (
                <div
                  key={item.id}
                  className="p-2.5 bg-slate-50/70 hover:bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between gap-3 transition-colors"
                >
                  {/* Thumbnail & Name */}
                  <div className="flex items-center gap-2.5 flex-1 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-white border border-slate-200/80 flex items-center justify-center text-lg shrink-0">
                      {item.image}
                    </div>
                    <div className="min-w-0">
                      <h5 className="text-xs font-bold text-slate-800 truncate">
                        {item.name}
                      </h5>
                      <span className="text-[11px] text-slate-500 font-medium">
                        {item.qty} {item.unit}
                      </span>
                    </div>
                  </div>

                  {/* 1. Marked Area: Editable Unit Price */}
                  <div className="flex items-center gap-1 shrink-0">
                    <span className="text-xs font-bold text-slate-500">৳</span>
                    <input
                      type="number"
                      step="any"
                      value={item.price}
                      onChange={(e) => updateItemPrice(item.id, e.target.value)}
                      title="Edit unit price"
                      className="w-16 h-7 text-xs font-semibold text-slate-800 bg-white border border-slate-200 rounded-md px-1.5 text-center focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>

                  {/* Qty Controls */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, -1)}
                      className="w-6 h-6 rounded-md bg-white border border-slate-200 hover:bg-slate-100 flex items-center justify-center text-slate-600 transition-colors"
                    >
                      <Minus size={12} />
                    </button>
                    <span className="w-6 text-center text-xs font-bold text-slate-800">
                      {item.qty}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, 1)}
                      className="w-6 h-6 rounded-md bg-white border border-slate-200 hover:bg-slate-100 flex items-center justify-center text-slate-600 transition-colors"
                    >
                      <Plus size={12} />
                    </button>
                  </div>

                  {/* Total & Delete Button */}
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs font-bold text-slate-900 min-w-[55px] text-right">
                      ৳{(item.price * item.qty).toFixed(2)}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      className="text-slate-400 hover:text-rose-500 transition-colors p-1"
                      title="Remove"
                    >
                      <X size={14} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Cart Summary Details */}
          <div className="space-y-2 text-xs text-slate-600">
            <div className="text-[11px] font-semibold text-slate-400 mb-1">
              {cartItems.length} Items in Cart
            </div>

            {/* Subtotal */}
            <div className="flex justify-between items-center">
              <span>Subtotal</span>
              <span className="font-semibold text-slate-800">৳{subtotal.toFixed(2)}</span>
            </div>

            {/* 2. Editable Discount */}
            <div className="flex justify-between items-center">
              <span className="font-medium text-slate-700">Discount</span>
              <div className="flex items-center gap-1">
                <span className="text-rose-600 font-bold">-৳</span>
                <input
                  type="number"
                  step="any"
                  min="0"
                  value={discountInput}
                  onChange={(e) => setDiscountInput(e.target.value)}
                  className="w-20 h-7 text-xs font-bold text-rose-600 bg-white border border-rose-200 rounded-md px-1.5 text-right focus:outline-none focus:border-rose-500"
                />
              </div>
            </div>

            {/* 3. Tax with Checkmark (Initially disabled) */}
            <div className="flex justify-between items-center">
              <label className="inline-flex items-center gap-1.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={isTaxEnabled}
                  onChange={(e) => setIsTaxEnabled(e.target.checked)}
                  className="w-3.5 h-3.5 rounded text-emerald-600 focus:ring-0 border-slate-300 cursor-pointer"
                />
                <span className={isTaxEnabled ? "font-semibold text-slate-800" : "text-slate-500"}>
                  Tax ({taxRatePercent}%)
                </span>
              </label>
              <span className={`font-semibold ${isTaxEnabled ? "text-slate-800" : "text-slate-400"}`}>
                ৳{taxAmount.toFixed(2)}
              </span>
            </div>

            {/* Grand Total */}
            <div className="border-t border-slate-200 pt-2 flex justify-between items-baseline text-sm font-bold text-slate-900">
              <span>Grand Total</span>
              <span className="text-xl font-extrabold text-[#166534]">
                ৳{grandTotal.toFixed(2)}
              </span>
            </div>
          </div>

          {/* 4. Payment Method: Left side Cash, Right side Dropdown for other methods */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            {/* Left Side: Cash Button (Default selected) */}
            <button
              type="button"
              onClick={() => setSelectedPaymentMethod("Cash")}
              className={`py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedPaymentMethod === "Cash"
                  ? "bg-[#166534] text-white shadow-xs"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              Cash
            </button>

            {/* Right Side: Dropdown for Other Methods */}
            <div className="relative">
              <select
                value={selectedPaymentMethod !== "Cash" ? selectedPaymentMethod : secondaryPaymentMethod}
                onChange={(e) => {
                  const val = e.target.value;
                  setSecondaryPaymentMethod(val);
                  setSelectedPaymentMethod(val);
                }}
                className={`w-full h-full py-2 pl-3 pr-8 rounded-xl text-xs font-bold transition-all appearance-none cursor-pointer border ${
                  selectedPaymentMethod !== "Cash"
                    ? "bg-[#166534] text-white border-[#166534] shadow-xs"
                    : "bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200"
                }`}
              >
                <option value="Card" className="text-slate-800 bg-white">Card</option>
                <option value="bKash" className="text-slate-800 bg-white">bKash</option>
                <option value="Nagad" className="text-slate-800 bg-white">Nagad</option>
                <option value="Due" className="text-slate-800 bg-white">Due</option>
              </select>
              <ChevronDown
                size={14}
                className={`absolute right-3 top-3 pointer-events-none ${
                  selectedPaymentMethod !== "Cash" ? "text-white" : "text-slate-500"
                }`}
              />
            </div>
          </div>

          {/* 5. Complete Sale Action Button - Always updates Complete Payment Modal */}
          <button
            type="button"
            disabled={cartItems.length === 0}
            onClick={() => setIsPaymentModalOpen(true)}
            className="w-full py-3 bg-[#16a34a] hover:bg-[#15803d] disabled:opacity-50 text-white font-bold text-sm rounded-xl flex items-center justify-between px-4 shadow-sm transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <Check size={18} className="stroke-[3]" />
              <span>COMPLETE SALE</span>
            </div>
            <span>৳{grandTotal.toFixed(2)}</span>
          </button>

          {/* Tertiary Action Bar: Hold Sale, Clear Cart, Print Invoice */}
          <div className="grid grid-cols-3 gap-2 pt-1 text-xs font-semibold">
            <button
              type="button"
              onClick={() => alert("Sale put on hold.")}
              className="py-1.5 px-2 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded-lg flex items-center justify-center gap-1 transition-colors cursor-pointer"
            >
              <PauseCircle size={14} />
              <span className="hidden sm:inline">Hold Sale</span>
            </button>

            <button
              type="button"
              onClick={clearCart}
              className="py-1.5 px-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg flex items-center justify-center gap-1 transition-colors cursor-pointer"
            >
              <Trash2 size={14} />
              <span className="hidden sm:inline">Clear Cart</span>
            </button>

            <button
              type="button"
              onClick={() => navigate("/pos/invoice")}
              className="py-1.5 px-2 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-lg flex items-center justify-center gap-1 transition-colors cursor-pointer"
            >
              <Printer size={14} />
              <span className="hidden sm:inline">Print Invoice</span>
            </button>
          </div>
        </div>
      </div>

      {/* 5. Complete Payment Modal Dialog - Synced with Grand Total and Selected Payment Method */}
      <CompletePaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        grandTotal={grandTotal}
        initialPaymentMethod={selectedPaymentMethod}
        customerName={customerName}
        onConfirmPayment={handleConfirmPayment}
      />
    </div>
  );
};

export default PosTerminalPage;
