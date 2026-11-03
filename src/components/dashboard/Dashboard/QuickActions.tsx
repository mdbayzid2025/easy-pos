import {
  Building2,
  FileText,
  Users,
} from "lucide-react";
import { Link } from "react-router-dom";

const actions = [
  {
    title: "Tenants",
    subtitle: "Profiles",
    icon: Users,
    path: "/tenants",
  },
  {
    title: "Buildings",
    subtitle: "Properties",
    icon: Building2,
    path: "/buildings",
  },
  {
    title: "Reports",
    subtitle: "Reports",
    icon: FileText,
    path: "/reports",
  },
  {
    title: "Staffs",
    subtitle: "Staffs",
    icon: Users,
    path: "/staffs",
  },
  // {
  //   title: "Invoices",
  //   subtitle: "Billing",
  //   icon: Receipt,
  //   path: "/bookings",
  // },
  // {
  //   title: "Maintenance",
  //   subtitle: "Service",
  //   icon: Wrench,
  //   path: "/setting",
  // },

  // {
  //   title: "Mechanics",
  //   subtitle: "Workers",
  //   icon: Wrench,
  //   path: "/admins",
  // },
  // {
  //   title: "Fraud",
  //   subtitle: "Records",
  //   icon: ShieldAlert,
  //   path: "/notification",
  // },
];

export default function QuickActions() {
  return (
    <div className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200/70 shadow-2xs w-full">
      <div className="mb-3">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
          WORKSPACE
        </span>
        <h3 className="text-xl font-bold text-slate-900 leading-none mt-0.5">
          Quick Actions
        </h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-3.5">
        {actions.map((action) => {
          const Icon = action.icon;

          return (
            <Link
              key={action.title}
              to={action.path}
              className="flex items-center gap-3 py-5 px-3 rounded-xl border border-slate-200/70 bg-white hover:border-primary/50 hover:bg-slate-50/80 hover:shadow-xs transition-all group"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 group-hover:bg-primary group-hover:text-white transition-colors">
                <Icon className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <h4 className="text-sm font-bold text-slate-900 group-hover:text-primary transition-colors truncate">
                  {action.title}
                </h4>
                <p className="text-xs text-slate-400 font-medium truncate mt-0.5">
                  {action.subtitle}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
