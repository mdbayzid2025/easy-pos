import { Menu, Search, Bell, HelpCircle, ChevronDown } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import NotificationBar from "./NotificationBar";

interface NavbarProps {
  onToggleSidebar?: () => void;
}

const Navbar = ({ onToggleSidebar }: NavbarProps) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const navigate = useNavigate();
  const handleLogout = () => {
    Cookies.remove("accessToken");
    navigate("/login");
  };

  return (
    <nav className="bg-white border-b border-slate-200/80 w-full sticky top-0 z-30">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Mobile Menu Button */}
          <button
            onClick={onToggleSidebar}
            className="lg:hidden flex items-center justify-center p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors focus:outline-none cursor-pointer"
            aria-label="Toggle Navigation Menu"
          >
            <Menu size={20} />
          </button>

          {/* Search Bar matching screenshot */}
          <div className="flex-1 max-w-md">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for products, sales, suppliers..."
                className="w-full h-9.5 pl-3.5 pr-9 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg placeholder-slate-400 text-slate-700 focus:outline-none focus:border-emerald-500 focus:bg-white transition-all"
              />
              <Search className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
            </div>
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center gap-3 sm:gap-5 ml-auto">
            {/* Notification Bell */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 rounded-full text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
                title="Notifications"
              >
                <Bell size={18} />
                {/* Red dot badge */}
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white" />
              </button>
            </div>

            {/* Help Button */}
            <button
              type="button"
              className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer px-2 py-1 rounded-md hover:bg-slate-50"
            >
              <HelpCircle size={16} className="text-slate-500" />
              <span>Help</span>
            </button>

            {/* User Profile Dropdown matching screenshot */}
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-2.5 rounded-lg p-1 transition-colors hover:bg-slate-50 focus:outline-none cursor-pointer">
                <Avatar className="h-9 w-9 ring-1 ring-slate-200">
                  <AvatarImage
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256"
                    alt="Abir Hasan"
                  />
                  <AvatarFallback className="bg-emerald-600 text-xs text-white font-bold">
                    AH
                  </AvatarFallback>
                </Avatar>

                <div className="hidden md:flex flex-col text-left">
                  <span className="text-xs font-bold text-slate-800 leading-tight">
                    Abir Hasan
                  </span>
                  <span className="text-[11px] text-slate-400 leading-tight">
                    Admin | Protidin Bazar
                  </span>
                </div>

                <ChevronDown size={14} className="text-slate-400 hidden sm:inline" />
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-56 bg-white border-slate-200 shadow-md">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-0.5">
                    <p className="text-xs font-bold text-slate-800">Abir Hasan</p>
                    <p className="text-[11px] text-slate-500">abir@protidinbazar.com</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild className="cursor-pointer text-xs">
                  <Link to="/profile">My Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="cursor-pointer text-xs">
                  <Link to="/pos">POS Terminal</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="cursor-pointer text-xs text-rose-600 focus:text-rose-600"
                >
                  Log Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {showNotifications && (
        <NotificationBar onClose={() => setShowNotifications(false)} />
      )}
    </nav>
  );
};

export default Navbar;
