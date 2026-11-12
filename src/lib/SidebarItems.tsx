import React from "react";
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Truck,
  Users,
  Wallet,
  FileBarChart,
  Settings,
  Boxes,
} from "lucide-react";

export interface SidebarSubItem {
  key: string;
  label: string;
  path: string;
}

export interface SidebarItem {
  key: string;
  label: string;
  path: string;
  icon: React.ReactNode;
  public: boolean;
  children?: SidebarSubItem[];
}

export const sidebarItems: SidebarItem[] = [
  {
    key: "dashboard",
    label: "Dashboard",
    path: "",
    icon: <LayoutDashboard size={18} />,
    public: true,
  },
  {
    key: "pos-sales",
    label: "POS / Sales",
    path: "pos",
    icon: <ShoppingCart size={18} />,
    public: true,
    children: [
      {
        key: "pos-terminal",
        label: "POS Terminal",
        path: "pos",
      },
      {
        key: "daily-sales",
        label: "Daily Sales",
        path: "sales/daily",
      },
      {
        key: "sales-history",
        label: "Sales History",
        path: "sales/history",
      },
      {
        key: "sales-return",
        label: "Sales Return",
        path: "sales/return",
      },
    ],
  },
  {
    key: "products",
    label: "Products",
    path: "products",
    icon: <Package size={18} />,
    public: true,
    children: [
      {
        key: "product-list",
        label: "Product List",
        path: "products",
      },
      {
        key: "add-product",
        label: "Add Product",
        path: "products/add-product",
      },
    ],
  },
  {
    key: "stock-manage",
    label: "Stock Manage",
    path: "inventory",
    icon: <Boxes size={18} />,
    public: true,
    children: [
      {
        key: "stock-overview",
        label: "Stock Overview",
        path: "inventory/stock-overview",
      },
      {
        key: "stock-adjustment",
        label: "Stock Adjustment",
        path: "inventory/stock-adjustment",
      },
      {
        key: "receive-stock",
        label: "Receive Stock",
        path: "inventory/receive-stock",
      },
    ],
  },
  {
    key: "purchases",
    label: "Purchases",
    path: "purchases",
    icon: <ShoppingCart size={18} />,
    public: true,
    children: [
      {
        key: "all-purchases",
        label: "All Purchases",
        path: "purchases",
      },
      {
        key: "new-purchase",
        label: "New Purchase",
        path: "purchases/new",
      },
      {
        key: "purchase-return",
        label: "Purchase Return",
        path: "purchases/return",
      },
    ],
  },
  {
    key: "suppliers",
    label: "Suppliers",
    path: "suppliers",
    icon: <Truck size={18} />,
    public: true,
    children: [
      {
        key: "all-suppliers",
        label: "All Suppliers",
        path: "suppliers",
      },
      {
        key: "add-supplier",
        label: "Add Supplier",
        path: "suppliers/new",
      },
    ],
  },
  {
    key: "customers",
    label: "Customers",
    path: "customers",
    icon: <Users size={18} />,
    public: true,
  },
  {
    key: "accounts",
    label: "Accounts",
    path: "accounts",
    icon: <Wallet size={18} />,
    public: true,
  },
  {
    key: "reports",
    label: "Reports",
    path: "notification",
    icon: <FileBarChart size={18} />,
    public: true,
  },
  {
    key: "settings",
    label: "Settings",
    path: "profile",
    icon: <Settings size={18} />,
    public: true,
  },
];
