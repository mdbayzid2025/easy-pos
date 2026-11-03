export type ReportCategory = "Financial" | "আয়" | "ব্যয়" | "ভবন" | "ডিপোজিট";

export interface ReportCatalogItem {
  id: string;
  code: string; // e.g. "#1", "#2"
  title: string; // e.g. "মাসিক মোট ভাড়ার (আয়) হিসাব রিপোর্ট / Monthly Rent Income Report"
  subtitle: string;
  category: ReportCategory;
  type: "income" | "expense" | "summary" | "deposit";
  slug: string;
  iconType: "dollar" | "receipt" | "building" | "bank";
}

export interface ExpenseRecord {
  id: string;
  buildingId: string;
  buildingName: string;
  date: string; // e.g. "2026-07-15"
  receiptNo: string; // e.g. "VCH-1024"
  vendorName: string; // e.g. "মেসার্স রফিক হার্ডওয়্যার & ইলেকট্রিক"
  itemDescription: string; // e.g. "১০ ওয়াট এলইডি লাইট, পিভিসি পাইপ, সুইচ বোর্ড"
  quantity: string; // e.g. "১০ পিস"
  unitPrice: number; // e.g. 250
  totalAmount: number; // e.g. 2500
  month: string; // e.g. "জুলাই"
  year: number; // e.g. 2026
}

export const reportCatalogList: ReportCatalogItem[] = [
  {
    id: "REP-01",
    code: "#1",
    title: "মাসিক মোট ভাড়ার (আয়) হিসাব রিপোর্ট / Monthly Rent Income Collection Report",
    subtitle: "ভবন ভিত্তিক সকল ফ্ল্যাটের ভাড়া, বিদ্যুৎ বিল মিটার হিসাব, গ্যারেজ চার্জ ও বকেয়া আদায়ের বিস্তারিত প্রতিবেদন।",
    category: "আয়",
    type: "income",
    slug: "monthly-income-report",
    iconType: "dollar",
  },
  {
    id: "REP-02",
    code: "#2",
    title: "মাসিক খরচ (ব্যয়) হিসাব রিপোর্ট / Monthly Maintenance & Purchase Expense Report",
    subtitle: "বিল্ডিং মেইনটেন্যান্স, মালামাল কেনাকাটা, ইলেকট্রিক ও স্যানিটারি খরচের ভাউচার ভিত্তিক বিবরণী।",
    category: "ব্যয়",
    type: "expense",
    slug: "monthly-expense-report",
    iconType: "receipt",
  },
  {
    id: "REP-03",
    code: "#3",
    title: "বিল্ডিং ভিত্তিক সংক্ষিপ্ত আয়-ব্যয় রিপোর্ট / Building wise Monthly Income-Expense Summary",
    subtitle: "সকল ভবনের মাসিক মোট আদায়কৃত আয় ও খরচের সংক্ষিপ্ত লাভ-ক্ষতির সমাপনী বিশ্লেষণ।",
    category: "ভবন",
    type: "summary",
    slug: "income-expense-summary",
    iconType: "building",
  },
  {
    id: "REP-04",
    code: "#4",
    title: "ব্যাংক ডিপোজিট হিসাব রিপোর্ট / Bank Deposit Account Report",
    subtitle: "ব্যাংকে জমাকৃত টাকা, তারিখ, বিবরণ ও খরচের বিস্তারিত রেকর্ড এবং ব্যবস্থাপনা।",
    category: "ডিপোজিট",
    type: "deposit",
    slug: "bank-deposit-report",
    iconType: "bank",
  },
];

export const initialExpenseList: ExpenseRecord[] = [
  {
    id: "EXP-101",
    buildingId: "1",
    buildingName: "পাপুয়া টাওয়ার-৩",
    date: "2026-07-05",
    receiptNo: "VCH-2026-001",
    vendorName: "মেসার্স রহমান হার্ডওয়্যার এন্ড কন্সট্রাকশন",
    itemDescription: "সিঁড়ি ঘরের ১০ ওয়াট এলইডি বাল্ব ও পিভিসি ওয়ারিং ক্যাবল",
    quantity: "১২ পিস",
    unitPrice: 350,
    totalAmount: 4200,
    month: "জুলাই",
    year: 2026,
  },
  {
    id: "EXP-102",
    buildingId: "1",
    buildingName: "পাপুয়া টাওয়ার-৩",
    date: "2026-07-10",
    receiptNo: "VCH-2026-002",
    vendorName: "সানি ইলেকট্রনিক্স & লিফট সার্ভিস",
    itemDescription: "লিফটের ডোর সেন্সর সার্ভিসিং ও মেইনটেইনেন্স ওয়েল",
    quantity: "১ জেন",
    unitPrice: 6500,
    totalAmount: 6500,
    month: "জুলাই",
    year: 2026,
  },
  {
    id: "EXP-103",
    buildingId: "1",
    buildingName: "পাপুয়া টাওয়ার-৩",
    date: "2026-07-18",
    receiptNo: "VCH-2026-003",
    vendorName: "মোল্লা প্লাম্বিং সলিউশন",
    itemDescription: "ওয়াটার পাম্পের ১.৫ ইঞ্চি গেট বাল্ব ও জিআই পাইপ ফিটিং",
    quantity: "২ সেট",
    unitPrice: 2800,
    totalAmount: 5600,
    month: "জুলাই",
    year: 2026,
  },
  {
    id: "EXP-104",
    buildingId: "1",
    buildingName: "পাপুয়া টাওয়ার-৩",
    date: "2026-07-25",
    receiptNo: "VCH-2026-004",
    vendorName: "আল-আকসা জেনারেটর সার্ভিসেস",
    itemDescription: "ডিজেল জেনারেটরের ইঞ্জিনের ফিল্টার ও ৫০ লিটার ফুয়েল",
    quantity: "৫০ লিটার",
    unitPrice: 115,
    totalAmount: 5750,
    month: "জুলাই",
    year: 2026,
  },
  {
    id: "EXP-105",
    buildingId: "2",
    buildingName: "সোনার বাংলা কমপ্লেক্স",
    date: "2026-07-08",
    receiptNo: "VCH-UTT-101",
    vendorName: "উত্তরা স্যানিটারি মার্ট",
    itemDescription: "মেইন ওয়াটার ট্যাংকের অটোমেটিক ফ্লোট সুইচ ও পাইপ",
    quantity: "৩ সেট",
    unitPrice: 1200,
    totalAmount: 3600,
    month: "জুলাই",
    year: 2026,
  },
  {
    id: "EXP-106",
    buildingId: "2",
    buildingName: "সোনার বাংলা কমপ্লেক্স",
    date: "2026-07-20",
    receiptNo: "VCH-UTT-102",
    vendorName: "গ্রিন ভ্যালি সিকিউরিটি সার্ভিস",
    itemDescription: "সিসিটিভি ক্যামেরার এডিবি কেবল ও নতুন চার্জিং এডাপ্টার",
    quantity: "৪ পিস",
    unitPrice: 850,
    totalAmount: 3400,
    month: "জুলাই",
    year: 2026,
  },
];

export const monthNamesBengali = [
  "জানুয়ারি",
  "ফেব্রুয়ারি",
  "মার্চ",
  "এপ্রিল",
  "মে",
  "জুন",
  "জুলাই",
  "আগস্ট",
  "সেপ্টেম্বর",
  "অক্টোবর",
  "নভেম্বর",
  "ডিসেম্বর",
];

export const yearOptions = [2024, 2025, 2026, 2027];
