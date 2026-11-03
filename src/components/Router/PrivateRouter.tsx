import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import Cookies from "js-cookie";
import { sidebarItems } from "../../lib/SidebarItems";


const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const isAuthenticated = Cookies.get("accessToken");
  const role = Cookies.get("role");

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const currentPath = location.pathname.replace("/", "");

  const currentPage = sidebarItems.find((item:any) => item.path === currentPath);

  if (!currentPage) return children;

  // 🔹 ADMIN can only access public pages
  if (role === "ADMIN" && !currentPage.public) {
    return <Navigate to="/" replace />;
  }
 
  return children;
};

export default PrivateRoute;