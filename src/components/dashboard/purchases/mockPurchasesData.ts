export interface PurchaseItem {
  id: string;
  name: string;
  sku: string;
  image: string;
  purchasedQty: number;
  prevReturnedQty: number;
  availableReturnQty: number;
  currentStock: number;
  unit: string;
  purchasePrice: number;
  discount: number;
  taxPercent: number;
}

export interface PurchaseRecord {
  id: string;
  purchaseNumber: string;
  invoiceNo: string;
  date: string;
  time?: string;
  warehouse: string;
  createdBy: string;
  supplier: {
    name: string;
    phone: string;
    address: string;
    previousDue: number;
  };
  items: PurchaseItem[];
  subtotal: number;
  invoiceDiscount: number;
  itemDiscount?: number;
  taxAmount: number;
  shippingCost: number;
  otherCost: number;
  grandTotal: number;
  paidAmount: number;
  dueAmount: number;
  paymentStatus: "Paid" | "Partial" | "Due";
  purchaseStatus: "Received" | "Pending" | "Ordered";
  paymentHistory: {
    id: string;
    dateTime: string;
    paymentMethod: string;
    amount: number;
    reference: string;
    receivedBy: string;
  }[];
}

export const mockPurchases: PurchaseRecord[] = [
  {
    id: "pur-1",
    purchaseNumber: "PUR-2026-00125",
    invoiceNo: "PIN-2026-8942",
    date: "Nov 7, 2026",
    time: "12:09 PM",
    warehouse: "Warehouse A",
    createdBy: "Abir Hasan",
    supplier: {
      name: "Meghna Group (Rupchanda)",
      phone: "+880 1712-345678",
      address: "House 12, Road 4, Sector 3, Uttara, Dhaka",
      previousDue: 12500.0,
    },
    items: [
      {
        id: "item-1",
        name: "Rupchanda Soybean Oil 5L",
        sku: "SKU-10851",
        image: "🌻",
        purchasedQty: 50,
        prevReturnedQty: 0,
        availableReturnQty: 50,
        currentStock: 45,
        unit: "Pcs",
        purchasePrice: 845.0,
        discount: 0.0,
        taxPercent: 5.0,
      },
      {
        id: "item-2",
        name: "Chashi Chinigura Rice 1kg",
        sku: "SKU-10243",
        image: "🌾",
        purchasedQty: 100,
        prevReturnedQty: 0,
        availableReturnQty: 100,
        currentStock: 85,
        unit: "Kg",
        purchasePrice: 132.0,
        discount: 0.0,
        taxPercent: 0.0,
      },
      {
        id: "item-3",
        name: "ACI Pure Salt 1kg",
        sku: "SKU-10112",
        image: "🧂",
        purchasedQty: 150,
        prevReturnedQty: 0,
        availableReturnQty: 150,
        currentStock: 120,
        unit: "Pcs",
        purchasePrice: 32.0,
        discount: 0.0,
        taxPercent: 0.0,
      },
      {
        id: "item-4",
        name: "Aarong Dairy Liquid Milk 1L",
        sku: "SKU-10534",
        image: "🥛",
        purchasedQty: 24,
        prevReturnedQty: 0,
        availableReturnQty: 24,
        currentStock: 8,
        unit: "Pack",
        purchasePrice: 82.0,
        discount: 0.0,
        taxPercent: 5.0,
      },
      {
        id: "item-5",
        name: "Poultry Eggs (Dozen)",
        sku: "SKU-10789",
        image: "🥚",
        purchasedQty: 30,
        prevReturnedQty: 0,
        availableReturnQty: 30,
        currentStock: 15,
        unit: "Dozen",
        purchasePrice: 140.0,
        discount: 0.0,
        taxPercent: 0.0,
      },
    ],
    subtotal: 68628.9,
    invoiceDiscount: 500.0,
    itemDiscount: 0.0,
    taxAmount: 2210.9,
    shippingCost: 1200.0,
    otherCost: 350.0,
    grandTotal: 71889.8,
    paidAmount: 50000.0,
    dueAmount: 21889.8,
    paymentStatus: "Partial",
    purchaseStatus: "Received",
    paymentHistory: [
      {
        id: "pay-1",
        dateTime: "Nov 7, 2026, 12:09 PM",
        paymentMethod: "Bank Transfer (Bank Asia)",
        amount: 50000.0,
        reference: "TRX91283910",
        receivedBy: "Abir Hasan",
      },
    ],
  },
  {
    id: "pur-2",
    purchaseNumber: "PUR-2026-00124",
    invoiceNo: "PIN-2026-8903",
    date: "Nov 5, 2026",
    time: "10:30 AM",
    warehouse: "Warehouse A",
    createdBy: "Abir Hasan",
    supplier: {
      name: "Aarong Dairy Ltd.",
      phone: "+880 1823-456789",
      address: "Tejgaon I/A, Dhaka",
      previousDue: 0.0,
    },
    items: [],
    subtotal: 11800.0,
    invoiceDiscount: 200.0,
    taxAmount: 0.0,
    shippingCost: 0.0,
    otherCost: 0.0,
    grandTotal: 11600.0,
    paidAmount: 11600.0,
    dueAmount: 0.0,
    paymentStatus: "Paid",
    purchaseStatus: "Received",
    paymentHistory: [],
  },
  {
    id: "pur-3",
    purchaseNumber: "PUR-2026-00123",
    invoiceNo: "PIN-2026-8851",
    date: "Nov 2, 2026",
    time: "03:15 PM",
    warehouse: "Warehouse B",
    createdBy: "Abir Hasan",
    supplier: {
      name: "Kazi Farms Group",
      phone: "+880 1912-987654",
      address: "Dhanmondi, Dhaka",
      previousDue: 5000.0,
    },
    items: [],
    subtotal: 14200.0,
    invoiceDiscount: 0.0,
    taxAmount: 0.0,
    shippingCost: 0.0,
    otherCost: 0.0,
    grandTotal: 14200.0,
    paidAmount: 0.0,
    dueAmount: 14200.0,
    paymentStatus: "Due",
    purchaseStatus: "Pending",
    paymentHistory: [],
  },
  {
    id: "pur-4",
    purchaseNumber: "PUR-2026-00122",
    invoiceNo: "PIN-2026-8794",
    date: "Oct 28, 2026",
    time: "11:20 AM",
    warehouse: "Warehouse A",
    createdBy: "Admin (Manager)",
    supplier: {
      name: "Nestlé Bangladesh",
      phone: "+880 1700-112233",
      address: "Gulshan 1, Dhaka",
      previousDue: 0.0,
    },
    items: [],
    subtotal: 32450.0,
    invoiceDiscount: 450.0,
    taxAmount: 0.0,
    shippingCost: 0.0,
    otherCost: 0.0,
    grandTotal: 32000.0,
    paidAmount: 32000.0,
    dueAmount: 0.0,
    paymentStatus: "Paid",
    purchaseStatus: "Received",
    paymentHistory: [],
  },
  {
    id: "pur-5",
    purchaseNumber: "PUR-2026-00121",
    invoiceNo: "PIN-2026-8712",
    date: "Oct 24, 2026",
    time: "09:45 AM",
    warehouse: "Warehouse A",
    createdBy: "Abir Hasan",
    supplier: {
      name: "Square Food & Bev",
      phone: "+880 1711-223344",
      address: "Mohakhali, Dhaka",
      previousDue: 0.0,
    },
    items: [],
    subtotal: 85600.0,
    invoiceDiscount: 1200.0,
    taxAmount: 0.0,
    shippingCost: 0.0,
    otherCost: 0.0,
    grandTotal: 84400.0,
    paidAmount: 84400.0,
    dueAmount: 0.0,
    paymentStatus: "Paid",
    purchaseStatus: "Received",
    paymentHistory: [],
  },
  {
    id: "pur-6",
    purchaseNumber: "PUR-2026-00120",
    invoiceNo: "PIN-2026-8650",
    date: "Oct 18, 2026",
    time: "02:10 PM",
    warehouse: "Warehouse B",
    createdBy: "Abir Hasan",
    supplier: {
      name: "Akij Food & Beverage",
      phone: "+880 1819-334455",
      address: "Akij Chamber, Dilkusha, Dhaka",
      previousDue: 0.0,
    },
    items: [],
    subtotal: 15800.0,
    invoiceDiscount: 150.0,
    taxAmount: 0.0,
    shippingCost: 0.0,
    otherCost: 0.0,
    grandTotal: 15650.0,
    paidAmount: 15650.0,
    dueAmount: 0.0,
    paymentStatus: "Paid",
    purchaseStatus: "Received",
    paymentHistory: [],
  },
  {
    id: "pur-7",
    purchaseNumber: "PUR-2026-00119",
    invoiceNo: "PIN-2026-8588",
    date: "Oct 12, 2026",
    time: "04:30 PM",
    warehouse: "Warehouse A",
    createdBy: "Abir Hasan",
    supplier: {
      name: "City Group (Teer)",
      phone: "+880 1713-445566",
      address: "City Seed Crushing Ind., Narayanganj",
      previousDue: 8000.0,
    },
    items: [],
    subtotal: 42300.0,
    invoiceDiscount: 500.0,
    taxAmount: 0.0,
    shippingCost: 0.0,
    otherCost: 0.0,
    grandTotal: 41800.0,
    paidAmount: 30000.0,
    dueAmount: 11800.0,
    paymentStatus: "Partial",
    purchaseStatus: "Received",
    paymentHistory: [],
  },
  {
    id: "pur-8",
    purchaseNumber: "PUR-2026-00118",
    invoiceNo: "PIN-2026-8511",
    date: "Oct 05, 2026",
    time: "11:00 AM",
    warehouse: "Warehouse B",
    createdBy: "Admin (Manager)",
    supplier: {
      name: "PRAN-RFL Group",
      phone: "+880 1844-556677",
      address: "PRAN-RFL Center, Badda, Dhaka",
      previousDue: 25000.0,
    },
    items: [],
    subtotal: 92400.0,
    invoiceDiscount: 1500.0,
    taxAmount: 0.0,
    shippingCost: 0.0,
    otherCost: 0.0,
    grandTotal: 90900.0,
    paidAmount: 0.0,
    dueAmount: 90900.0,
    paymentStatus: "Due",
    purchaseStatus: "Ordered",
    paymentHistory: [],
  },
];

export const mockPurchasesSummary = {
  totalPurchases: "৳14,58,320.00",
  todayPurchases: "৳69,678.90",
  purchaseDue: "৳1,19,678.90",
  paidPurchases: "৳13,38,641.10",
  purchaseReturns: "৳12,800.00",
};

