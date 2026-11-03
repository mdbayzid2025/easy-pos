import { Menu } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { useSocket } from "../../hooks/socketConnection";
import { imageUrl } from "../../redux/base/baseAPI";
import { useGetNotificationsCountQuery } from "../../redux/features/notification/notificationApi";
import { useGetLoggedInAdminDataQuery } from "../../redux/features/user/userApi";
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
  const { data: profileData } = useGetLoggedInAdminDataQuery(
    "name username email role readOnly permissions profileImg",
  );
  const [showNotifications, setShowNotifications] = useState(false);

  const { refetch } = useGetNotificationsCountQuery({});

  const navigate = useNavigate();
  const handleLogout = () => {
    Cookies.remove("accessToken");
    navigate("/login");
  };

  const socket = useSocket();

  useEffect(() => {
    if (!socket) return;

    socket.on(`send-notification::${profileData?._id}`, () => {
      refetch();
    });

    socket.on(`unreadCountUpdate::${profileData?._id}`, () => {
      refetch();
    });

    return () => {
      socket.off(`send-notification::${profileData?._id}`);
      socket.off(`unreadCountUpdate::${profileData?._id}`);
    };
  }, []);

  return (
    <nav className="bg-gradient-info shadow-lg w-full">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between gap-2">
          {/* Mobile Menu Button */}
          <button
            onClick={onToggleSidebar}
            className="lg:hidden flex items-center justify-center p-2 rounded-md text-white hover:bg-white/10 transition-colors focus:outline-none cursor-pointer"
            aria-label="Toggle Navigation Menu"
          >
            <Menu size={24} />
          </button>

          <div className="flex items-center gap-3 ml-auto">
            {/* <div className="relative p-2 bg-white rounded-md">
            <Bell onClick={() => setShowNotifications(!showNotifications)} className="text-secondary" size={22} />
            <div className="absolute -top-1 -right-1 shadow-lg w-5 h-5 rounded-full bg-secondary text-white flex items-center justify-center">{unreadCount ?? 0}</div>
          </div> */}
            {/* User Menu */}
            <div className="hidden md:flex  pl-0.5">
              <DropdownMenu>
                <DropdownMenuTrigger className="flex bg-transparent! items-center gap-2 rounded-lg px-2 py-1.5 transition-colors  hover:bg-slate-200/50 focus:outline-none">
                  <Avatar className="h-10 w-10">
                    <AvatarImage
                      src={
                        profileData?.profileImg
                          ? profileData?.profileImg.startsWith("http")
                            ? profileData.profileImg
                            : imageUrl + profileData.profileImg
                          : profileData?.profileImage
                            ? imageUrl + profileData.profileImage
                            : "/default-avatar.png"
                      }
                      alt={profileData?.name || "Admin Avatar"}
                    />
                    <AvatarFallback className="bg-slate-700 text-xs text-white">
                      {profileData?.name?.charAt(0) || "A"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex  flex-col  items-start">
                    <p className="hidden text-sm font-semibold text-white lg:inline-block">
                      {profileData?.name || "Admin"}
                    </p>
                    <p className="hidden text-sm font-semibold text-white lg:inline-block">
                      {profileData?.email || profileData?.role || ""}
                    </p>
                  </div>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  align="end"
                  className="w-56 bg-white border-slate-300  text-black"
                >
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium">Welcome!</p>
                    </div>
                  </DropdownMenuLabel>

                  <DropdownMenuSeparator className="bg-slate-700" />

                  <DropdownMenuItem
                    asChild
                    className="cursor-pointer focus:bg-slate-200 focus:text-white"
                  >
                    <Link to="/profile" className="flex items-center">
                      <svg
                        className="mr-2 h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                      <span>My profile</span>
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    asChild
                    className="cursor-pointer focus:bg-slate-200 focus:text-white"
                  >
                    <Link to="/setting" className="flex items-center">
                      <svg
                        className="mr-2 h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      <span>Settings</span>
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    className="cursor-pointer text-white! bg-red-600!  "
                    onClick={() => handleLogout()}
                  >
                    <svg
                      className="mr-2 h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="#fff"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                      />
                    </svg>
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          {showNotifications && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowNotifications(false)}
              />
              <NotificationBar profileData={profileData} />
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
