export interface Supplier {
  id: string;
  name: string;
  company: string;
  phone: string;
  altPhone?: string;
  email: string;
  address: string;
  city: string;
  supplierType: "Wholesaler / Manufacturer" | "Distributor" | "Importer";
  totalPurchase: number;
  paid: number;
  due: number;
  status: "Active" | "Inactive";
  openingDue?: number;
  creditLimit?: number;
  paymentTerms?: string;
  preferredPaymentMethod?: string;
  notes?: string;
  avatar?: string;
  totalReturns?: number;
}

export interface SupplierPurchaseInvoice {
  id: string;
  invoiceNo: string;
  date: string;
  itemsCount: number;
  total: number;
  paid: number;
  due: number;
  status: "Paid" | "Partial" | "Due";
}

export interface SupplierPaymentRecord {
  id: string;
  date: string;
  refMethod: string;
  amount: number;
  balance: number;
  referenceNo?: string;
  notes?: string;
}

export const mockSuppliersList: Supplier[] = [
  {
    id: "sup-1",
    name: "Mizanur Rahman",
    company: "Meghna Group (Rupchanda)",
    phone: "+880 1712-345678",
    altPhone: "+880 1819-234567",
    email: "mizan.meghna@group.com",
    address: "House 12, Road 4, Sector 3, Uttara, Dhaka-1230, Bangladesh",
    city: "Dhaka",
    supplierType: "Wholesaler / Manufacturer",
    totalPurchase: 450000.0,
    paid: 430321.1,
    due: 19678.9,
    status: "Active",
    openingDue: 0.0,
    creditLimit: 500000.0,
    paymentTerms: "Net 30",
    preferredPaymentMethod: "Bank Transfer",
    notes: "Key supplier for Soybean oil, sugar and grains.",
    totalReturns: 4225.0,
  },
  {
    id: "sup-2",
    name: "Anisul Haque",
    company: "Aarong Dairy Ltd.",
    phone: "+880 1819-234567",
    altPhone: "+880 1711-001122",
    email: "haque.aarong@brac.net",
    address: "Aarong House, Tejgaon I/A, Dhaka",
    city: "Dhaka",
    supplierType: "Distributor",
    totalPurchase: 112000.0,
    paid: 112000.0,
    due: 0.0,
    status: "Active",
    openingDue: 0.0,
    creditLimit: 300000.0,
    paymentTerms: "Net 15",
    preferredPaymentMethod: "Cash",
    notes: "Daily delivery scheduled at 7:00 AM.",
    totalReturns: 0.0,
  },
  {
    id: "sup-3",
    name: "Kamal Uddin",
    company: "Kazi Farms Group",
    phone: "+880 1611-987654",
    altPhone: "+880 1912-334455",
    email: "kamal.kazi@kazifarms.com",
    address: "Kazi Tower, Dhanmondi, Dhaka",
    city: "Dhaka",
    supplierType: "Wholesaler / Manufacturer",
    totalPurchase: 142000.0,
    paid: 127800.0,
    due: 14200.0,
    status: "Active",
    openingDue: 5000.0,
    creditLimit: 250000.0,
    paymentTerms: "Net 30",
    preferredPaymentMethod: "Bank Transfer",
    notes: "Fresh egg and poultry supplier.",
    totalReturns: 1200.0,
  },
  {
    id: "sup-4",
    name: "Shafiul Islam",
    company: "Nestlé Bangladesh",
    phone: "+880 1515-456123",
    altPhone: "+880 1715-667788",
    email: "shafiul.islam@bd.nestle.com",
    address: "Gulshan Tower, Gulshan-2, Dhaka",
    city: "Dhaka",
    supplierType: "Importer",
    totalPurchase: 232000.0,
    paid: 232000.0,
    due: 0.0,
    status: "Active",
    openingDue: 0.0,
    creditLimit: 1000000.0,
    paymentTerms: "Net 45",
    preferredPaymentMethod: "Bank Transfer",
    notes: "Noodles, coffee, cereals and baby food.",
    totalReturns: 0.0,
  },
  {
    id: "sup-5",
    name: "Nurul Huda",
    company: "Square Food & Beverage",
    phone: "+880 1711-876543",
    altPhone: "+880 1811-998877",
    email: "huda.sfbl@squaregroup.com",
    address: "Square Centre, Mohakhali, Dhaka",
    city: "Dhaka",
    supplierType: "Wholesaler / Manufacturer",
    totalPurchase: 285600.0,
    paid: 285600.0,
    due: 0.0,
    status: "Active",
    openingDue: 0.0,
    creditLimit: 600000.0,
    paymentTerms: "Net 30",
    preferredPaymentMethod: "Bank Transfer",
    notes: "Radhuni spices, Ruchi chanachur and Chashi rice.",
    totalReturns: 500.0,
  },
  {
    id: "sup-6",
    name: "Rafiqul Alam",
    company: "Akij Food & Beverage",
    phone: "+880 1912-345600",
    altPhone: "+880 1712-445566",
    email: "rafiq.akij@akij.net",
    address: "Akij House, Baridhara, Dhaka",
    city: "Dhaka",
    supplierType: "Wholesaler / Manufacturer",
    totalPurchase: 85800.0,
    paid: 85800.0,
    due: 0.0,
    status: "Active",
    openingDue: 0.0,
    creditLimit: 200000.0,
    paymentTerms: "Net 15",
    preferredPaymentMethod: "bKash",
    notes: "Mojo, Frutika and snacks.",
    totalReturns: 0.0,
  },
  {
    id: "sup-7",
    name: "Zahirul Islam",
    company: "City Group (Teer)",
    phone: "+880 1811-112233",
    altPhone: "+880 1611-223344",
    email: "zahir.city@teer.com.bd",
    address: "City Centre, Motijheel, Dhaka",
    city: "Dhaka",
    supplierType: "Wholesaler / Manufacturer",
    totalPurchase: 142300.0,
    paid: 130500.0,
    due: 11800.0,
    status: "Active",
    openingDue: 0.0,
    creditLimit: 400000.0,
    paymentTerms: "Net 30",
    preferredPaymentMethod: "Bank Transfer",
    notes: "Teer oil, flour and sugar.",
    totalReturns: 0.0,
  },
  {
    id: "sup-8",
    name: "Monirul Islam",
    company: "PRAN-RFL Group",
    phone: "+880 1713-223344",
    altPhone: "+880 1913-445566",
    email: "monir.pran@prangroup.com",
    address: "PRAN Centre, Badda, Dhaka",
    city: "Dhaka",
    supplierType: "Wholesaler / Manufacturer",
    totalPurchase: 92400.0,
    paid: 1500.0,
    due: 90900.0,
    status: "Inactive",
    openingDue: 0.0,
    creditLimit: 150000.0,
    paymentTerms: "COD",
    preferredPaymentMethod: "Cheque",
    notes: "Account temporarily on hold due to pending due balance.",
    totalReturns: 0.0,
  },
];

export const mockSupplierPurchases: SupplierPurchaseInvoice[] = [
  {
    id: "sp-1",
    invoiceNo: "PIN-2026-8942",
    date: "Nov 7, 2026",
    itemsCount: 5,
    total: 69678.9,
    paid: 50000.0,
    due: 19678.9,
    status: "Partial",
  },
  {
    id: "sp-2",
    invoiceNo: "PIN-2026-8903",
    date: "Nov 5, 2026",
    itemsCount: 2,
    total: 11600.0,
    paid: 11600.0,
    due: 0.0,
    status: "Paid",
  },
  {
    id: "sp-3",
    invoiceNo: "PIN-2026-8851",
    date: "Nov 2, 2026",
    itemsCount: 1,
    total: 14200.0,
    paid: 0.0,
    due: 14200.0,
    status: "Due",
  },
  {
    id: "sp-4",
    invoiceNo: "PIN-2026-8794",
    date: "Oct 28, 2026",
    itemsCount: 8,
    total: 32000.0,
    paid: 32000.0,
    due: 0.0,
    status: "Paid",
  },
  {
    id: "sp-5",
    invoiceNo: "PIN-2026-8712",
    date: "Oct 24, 2026",
    itemsCount: 12,
    total: 84400.0,
    paid: 84400.0,
    due: 0.0,
    status: "Paid",
  },
  {
    id: "sp-6",
    invoiceNo: "PIN-2026-8650",
    date: "Oct 18, 2026",
    itemsCount: 3,
    total: 15650.0,
    paid: 15650.0,
    due: 0.0,
    status: "Paid",
  },
  {
    id: "sp-7",
    invoiceNo: "PIN-2026-8588",
    date: "Oct 12, 2026",
    itemsCount: 6,
    total: 41800.0,
    paid: 30000.0,
    due: 11800.0,
    status: "Partial",
  },
  {
    id: "sp-8",
    invoiceNo: "PIN-2026-8511",
    date: "Oct 05, 2026",
    itemsCount: 15,
    total: 90900.0,
    paid: 90900.0,
    due: 0.0,
    status: "Paid",
  },
];

export const mockRecentPaymentHistory: SupplierPaymentRecord[] = [
  {
    id: "pay-1",
    date: "Nov 2, 2026",
    refMethod: "Cash",
    amount: 10000.0,
    balance: 85500.0,
  },
  {
    id: "pay-2",
    date: "Oct 24, 2026",
    refMethod: "bKash",
    amount: 15000.0,
    balance: 95500.0,
  },
  {
    id: "pay-3",
    date: "Oct 12, 2026",
    refMethod: "Bank",
    amount: 50000.0,
    balance: 110500.0,
  },
];

