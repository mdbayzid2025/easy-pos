import {
  Users,
  UserStar,
  Building2,
  FileText,
  Receipt,
  Tag,
  Zap,
  DollarSign,
} from "lucide-react";
import { RxDashboard } from "react-icons/rx";

export const sidebarItems = [
  {
    key: "",
    label: "Dashboard",
    path: "",
    icon: <RxDashboard size={20} />,
    public: true,
  },

  {
    key: "buildings",
    label: "বিল্ডিংসমূহ",
    path: "buildings",
    icon: <Building2 size={20} />,
    public: true,
  },

  {
    key: "tenants",
    label: "ভাড়াটিয়া তালিকা",
    path: "tenants",
    icon: <Users size={20} />,
    public: true,
  },

  {
    key: "income",
    label: "আদায় ও ভাড়া",
    path: "income",
    icon: <DollarSign size={20} />,
    public: true,
  },

  {
    key: "utilities",
    label: "ইউটিলিটি ব্যবস্থাপনা",
    path: "utilities",
    icon: <Zap size={20} />,
    public: true,
  },

  {
    key: "expenses",
    label: "খরচ ব্যবস্থাপনা",
    path: "expenses",
    icon: <Receipt size={20} />,
    public: true,
  },

  {
    key: "expense-categories",
    label: "খরচের ক্যাটাগরি",
    path: "expense-categories",
    icon: <Tag size={20} />,
    public: true,
  },

  {
    key: "reports",
    label: "রিপোর্টস",
    path: "reports",
    icon: <FileText size={20} />,
    public: true,
  },

  // {
  //   key: "staff",
  //   label: "স্টাফ তালিকা",
  //   path: "staff",
  //   icon: <Users size={20} />,
  //   public: true,
  // },
  {
    key: "admins",
    label: "Admin",
    path: "admins",
    icon: <UserStar size={20} />,
    public: false,
  },
];
