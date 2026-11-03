import Cookies from "js-cookie";
import { X } from "lucide-react";
import { FiLogOut } from "react-icons/fi";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { sidebarItems } from "../../lib/SidebarItems";
import { cn } from "../../lib/utils";
import { useGetProfileQuery } from "../../redux/features/user/userApi";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
import { Tooltip, TooltipProvider, TooltipTrigger } from "../ui/tooltip";

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

// ────────────────────────────────────────────────
export default function Sidebar({ isOpen = false, onClose }: SidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const isActive = (path: string) => location.pathname === path;
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
          "fixed top-0 left-0 bottom-0 z-50 bg-white border-r border-neutral-200 transition-transform duration-300 ease-in-out w-70 h-screen flex flex-col",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        )}
      >
        <div className="h-screen flex flex-col">
          {/* Header / Logo + Toggle */}
          <div className="relative flex flex-col py-3 items-center justify-between border-b border-neutral-200 px-4">
            {/* Mobile Close Button */}
            <button
              onClick={onClose}
              className="lg:hidden absolute right-3 top-3 p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-colors"
              aria-label="Close sidebar"
            >
              <X size={20} />
            </button>

            <img className="w-20 mx-auto" src="/logo2.png" alt="Logo" />
            <span className="text-lg font-semibold text-primary uppercase">
              Ainal Properties
            </span>
          </div>

          {/* Main Navigation */}
          <ScrollArea className="h-full px-3 py-4 mb-auto">
            <nav className="space-y-2!">
              {filteredSidebarItems?.map((item, index) => {
                const itemPath = `/${item.path}`;
                const isItemActive = isActive(itemPath);

                return (
                  <TooltipProvider key={item.key}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Link
                          to={itemPath}
                          onClick={() => onClose?.()}
                          className={cn(
                            "group relative mb-2! flex w-full items-center gap-3 rounded-lg transition-all duration-200 min-h-11 justify-start px-3 py-2.5",
                            isItemActive
                              ? "bg-primary text-white!"
                              : "border border-black/20 text-black! hover:bg-primary hover:text-white!",
                          )}
                          data-aos="fade-up-right"
                          data-aos-delay={index * 100}
                        >
                          {item.icon && (
                            <span className="flex-shrink-0">{item.icon}</span>
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

          {/* Logout */}
          <div className="border-t border-neutral-200 p-3">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={handleLogout}
                    className={cn(
                      "w-full justify-center gap-3 bg-transparent! text-black! border-2! border-black/50!",
                    )}
                  >
                    <FiLogOut className="h-5 w-5 shrink-0" />
                    <span>Log Out</span>
                  </Button>
                </TooltipTrigger>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </aside>
    </>
  );
}
