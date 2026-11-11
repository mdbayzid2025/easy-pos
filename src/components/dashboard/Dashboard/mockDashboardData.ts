export interface TodayStats {
  sales: { amount: number; change: string; isPositive: boolean };
  orders: { count: number; change: string; isPositive: boolean };
  expenses: { amount: number; change: string; isPositive: boolean };
  profit: { amount: number; change: string; isPositive: boolean };
}

export interface StockSummary {
  totalStockValue: number;
  customerDue: number;
  supplierDue: number;
}

export interface DailySalesData {
  day: string;
  sales: number;
  isPeak?: boolean;
}

export interface PaymentMethodData {
  name: string;
  percentage: number;
  color: string;
}

export interface TopProduct {
  id: string;
  name: string;
  category: string;
  sold: number;
  revenue: number;
  iconBg: string;
  iconText: string;
}

export interface LowStockItem {
  id: string;
  name: string;
  inStock: number;
  reorderLevel: number;
  leftCount: number;
  iconBg: string;
  iconText: string;
}

export const mockDashboardData = {
  userName: "Abir",
  storeName: "Protidin Bazar",
  userRole: "Admin",
  currentDate: "Nov 7, 2026",
  todayStats: {
    sales: { amount: 84250, change: "+12%", isPositive: true },
    orders: { count: 312, change: "+8%", isPositive: true },
    expenses: { amount: 12400, change: "-4%", isPositive: false },
    profit: { amount: 14250, change: "+15%", isPositive: true },
  },
  stockSummary: {
    totalStockValue: 1480500,
    customerDue: 38500,
    supplierDue: 92400,
  },
  dailySales: [
    { day: "Sat", sales: 42000 },
    { day: "Sun", sales: 56000 },
    { day: "Mon", sales: 51000 },
    { day: "Tue", sales: 68000 },
    { day: "Wed", sales: 95000, isPeak: true },
    { day: "Thu", sales: 58000 },
    { day: "Fri", sales: 74000 },
  ],
  paymentMethods: [
    { name: "Cash", percentage: 62, color: "#166534" },
    { name: "Card", percentage: 18, color: "#22c55e" },
    { name: "bKash", percentage: 15, color: "#4ade80" },
    { name: "Nagad", percentage: 5, color: "#86efac" },
  ],
  topSellingProducts: [
    {
      id: "1",
      name: "ACI Pure Salt 1kg",
      category: "Featured",
      sold: 158,
      revenue: 84250,
      iconBg: "bg-blue-100 text-blue-700",
      iconText: "🧂",
    },
    {
      id: "2",
      name: "Rupchanda Soyabean Oil 5L",
      category: "Rupchean",
      sold: 103,
      revenue: 84000,
      iconBg: "bg-amber-100 text-amber-700",
      iconText: "🧴",
    },
    {
      id: "3",
      name: "Chashi Chinigura Rice 1kg",
      category: "Category Rice",
      sold: 107,
      revenue: 12000,
      iconBg: "bg-emerald-100 text-emerald-700",
      iconText: "🍚",
    },
    {
      id: "4",
      name: "Dano Power Milk Powder 1kg",
      category: "Category",
      sold: 64,
      revenue: 14250,
      iconBg: "bg-red-100 text-red-700",
      iconText: "🥛",
    },
    {
      id: "5",
      name: "Radhuni Turmeric Powder 200g",
      category: "Turmeric",
      sold: 20,
      revenue: 14250,
      iconBg: "bg-yellow-100 text-yellow-800",
      iconText: "🌾",
    },
  ],
  lowStockAlerts: [
    {
      id: "1",
      name: "Teer Atta 2kg",
      inStock: 5,
      reorderLevel: 0,
      leftCount: 5,
      iconBg: "bg-orange-100 text-orange-700",
      iconText: "🌾",
    },
    {
      id: "2",
      name: "Pran Tomato Ketchup 500g",
      inStock: 3,
      reorderLevel: 1,
      leftCount: 3,
      iconBg: "bg-red-100 text-red-700",
      iconText: "🥫",
    },
    {
      id: "3",
      name: "Sunsilk Shampoo 375ml",
      inStock: 8,
      reorderLevel: 0,
      leftCount: 8,
      iconBg: "bg-pink-100 text-pink-700",
      iconText: "🧴",
    },
    {
      id: "4",
      name: "Ispahani Mirzapore Tea 400g",
      inStock: 4,
      reorderLevel: 1,
      leftCount: 4,
      iconBg: "bg-emerald-100 text-emerald-700",
      iconText: "🍵",
    },
  ],
};

