import { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';

import Sidebar from './Sidebar';
import Navbar from '../Shared/Navbar';

import AOS from 'aos';
import 'aos/dist/aos.css';

AOS.init({
  duration: 700,
  easing: "ease-out-cubic",
  once: true,
  mirror: false,
});

export default function DashboardLayout() {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    AOS.refresh();
  }, [location.pathname]);

  // Close mobile sidebar on route change
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  return (
    <div className="min-h-screen w-full bg-[#F7F9FB] flex relative overflow-x-hidden">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0 w-full transition-all duration-300 lg:ml-70">
        <Navbar onToggleSidebar={() => setSidebarOpen((prev) => !prev)} />
        <main className="flex-1 min-h-[calc(100vh-4rem)] w-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
