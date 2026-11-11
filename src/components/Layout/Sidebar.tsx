import Cookies from "js-cookie";
import { X, ShoppingBag, ChevronDown } from "lucide-react";
import { FiLogOut } from "react-icons/fi";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { sidebarItems, type SidebarItem } from "../../lib/SidebarItems";
import { cn } from "../../lib/utils";
import { useGetProfileQuery } from "../../redux/features/user/userApi";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
import { Tooltip, TooltipProvider, TooltipTrigger } from "../ui/tooltip";

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ isOpen = false, onClose }: SidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();

  // State to track open dropdowns, default "products" to open
  const [openDropdowns, setOpenDropdowns] = useState<Record<string, boolean>>({
    products: true,
  });

  const toggleDropdown = (key: string, e: React.MouseEvent) => {
    e.preventDefault();
    setOpenDropdowns((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const isActive = (path: string) => {
    if (path === "") return location.pathname === "/" || location.pathname === "";
    return location.pathname === `/${path}` || location.pathname.startsWith(`/${path}/`);
  };

  const isExactActive = (path: string) => {
    if (path === "") return location.pathname === "/" || location.pathname === "";
    return location.pathname === `/${path}`;
  };

  const { data: profileData } = useGetProfileQuery({});

  const filteredSidebarItems = sidebarItems?.filter((item) =>
    profileData?.role !== "ADMIN" ? true : item?.public,
  );

  const handleLogout = () => {
    Cookies.remove("accessToken");
    navigate("/login");
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-xs lg:hidden transition-opacity"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          "fixed top-0 left-0 bottom-0 z-50 bg-[#162220] border-r border-[#1e2f2c] transition-transform duration-300 ease-in-out w-60 h-screen flex flex-col text-slate-300",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        )}
      >
        <div className="h-screen flex flex-col">
          {/* Header / Brand Logo matching screenshot */}
          <div className="flex items-center justify-between px-5 py-5 border-b border-[#1e2f2c]">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-slate-900 shadow-sm">
                <ShoppingBag className="w-5 h-5 text-white stroke-[2.5]" />
              </div>
              <span className="text-base font-bold text-white tracking-tight">
                Grocery <span className="text-emerald-400">POS</span>
              </span>
            </Link>

            {/* Mobile Close Button */}
            <button
              onClick={onClose}
              className="lg:hidden p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              aria-label="Close sidebar"
            >
              <X size={18} />
            </button>
          </div>

          {/* Main Navigation */}
          <ScrollArea className="h-full px-3 py-4 mb-auto">
            <nav className="space-y-1">
              {filteredSidebarItems?.map((item: SidebarItem) => {
                const itemPath = `/${item.path}`;
                const hasChildren = Boolean(item.children && item.children.length > 0);
                const isItemActive = isActive(item.path);
                const isDropdownOpen = Boolean(openDropdowns[item.key]);

                if (hasChildren) {
                  return (
                    <div key={item.key} className="space-y-1">
                      {/* Parent Item with Dropdown Toggle */}
                      <button
                        type="button"
                        onClick={(e) => toggleDropdown(item.key, e)}
                        className={cn(
                          "group w-full flex items-center justify-between rounded-lg transition-all duration-150 py-2.5 px-3 text-xs font-semibold cursor-pointer",
                          isItemActive
                            ? "bg-[#16a34a] text-white font-bold shadow-xs"
                            : "text-slate-400 hover:text-white hover:bg-[#1a2b28]",
                        )}
                      >
                        <div className="flex items-center gap-3">
                          {item.icon && (
                            <span
                              className={cn(
                                "flex-shrink-0 transition-colors",
                                isItemActive ? "text-white" : "text-slate-400 group-hover:text-white",
                              )}
                            >
                              {item.icon}
                            </span>
                          )}
                          <span>{item.label}</span>
                        </div>
                        <ChevronDown
                          size={14}
                          className={cn(
                            "transition-transform duration-200",
                            isDropdownOpen ? "rotate-180" : "rotate-0",
                            isItemActive ? "text-white" : "text-slate-400",
                          )}
                        />
                      </button>

                      {/* Dropdown Children (Product List, Add Product) */}
                      {isDropdownOpen && (
                        <div className="pl-9 pr-2 py-1 space-y-1 border-l border-emerald-900/40 ml-4">
                          {item.children?.map((sub) => {
                            const isSubActive = isExactActive(sub.path);
                            return (
                              <Link
                                key={sub.key}
                                to={`/${sub.path}`}
                                onClick={() => onClose?.()}
                                className={cn(
                                  "block py-1.5 px-2.5 rounded-md text-[11px] font-medium transition-colors",
                                  isSubActive
                                    ? "text-emerald-400 font-bold bg-[#1a2b28]"
                                    : "text-slate-400 hover:text-white hover:bg-[#1a2b28]/60",
                                )}
                              >
                                {sub.label}
                              </Link>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                }

                return (
                  <TooltipProvider key={item.key}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Link
                          to={itemPath}
                          onClick={() => onClose?.()}
                          className={cn(
                            "group flex w-full items-center gap-3 rounded-lg transition-all duration-150 py-2.5 px-3 text-xs font-semibold",
                            isItemActive
                              ? "bg-[#16a34a] text-white font-bold shadow-xs"
                              : "text-slate-400 hover:text-white hover:bg-[#1a2b28]",
                          )}
                        >
                          {item.icon && (
                            <span
                              className={cn(
                                "flex-shrink-0 transition-colors",
                                isItemActive ? "text-white" : "text-slate-400 group-hover:text-white",
                              )}
                            >
                              {item.icon}
                            </span>
                          )}
                          <span>{item.label}</span>
                        </Link>
                      </TooltipTrigger>
                    </Tooltip>
                  </TooltipProvider>
                );
              })}
            </nav>
          </ScrollArea>

          {/* Logout Button */}
          <div className="border-t border-[#1e2f2c] p-3">
            <Button
              onClick={handleLogout}
              className="w-full justify-center gap-2 bg-[#1a2b28] hover:bg-[#203934] text-slate-300 hover:text-white border border-[#273d39] text-xs font-medium py-2 rounded-lg cursor-pointer"
            >
              <FiLogOut className="h-4 w-4 shrink-0" />
              <span>Log Out</span>
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
}
