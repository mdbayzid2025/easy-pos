import {
  ShoppingBag,
  PlusCircle,
  User,
  ShieldCheck,
  Bell,
} from "lucide-react";
import { RxDashboard } from "react-icons/rx";

export const sidebarItems = [
  {
    key: "dashboard",
    label: "Dashboard",
    path: "",
    icon: <RxDashboard size={20} />,
    public: true,
  },
  {
    key: "pos",
    label: "Products",
    path: "pos",
    icon: <ShoppingBag size={20} />,
    public: true,
  },
  {
    key: "add-product",
    label: "Add Product",
    path: "pos/add-product",
    icon: <PlusCircle size={20} />,
    public: true,
  },
  {
    key: "profile",
    label: "Profile",
    path: "profile",
    icon: <User size={20} />,
    public: true,
  },
  {
    key: "notification",
    label: "Notifications",
    path: "notification",
    icon: <Bell size={20} />,
    public: true,
  },
  {
    key: "admins",
    label: "Admin",
    path: "admins",
    icon: <ShieldCheck size={20} />,
    public: false,
  },
];
