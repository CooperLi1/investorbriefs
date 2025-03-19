"use client";

import { ClerkProvider } from "@clerk/nextjs";
import DarkModeToggle from "@/app/components/darkmodetoggle";
import { SideNav } from "../components/sidenav";
import { useState, useEffect } from "react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSidebarOpen, setSidebarOpen] = useState(false); // Separate state for sidebar

  useEffect(() => {
    const isDark = localStorage.getItem("theme") === "dark";
    setIsDarkMode(isDark);
    document.documentElement.classList.toggle("dark", isDark);
  }, []);

  return (
    <ClerkProvider>
      <div
        className={`min-h-screen transition-all ${
          isDarkMode ? "dark bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
        }`}
      >
        <main className="flex min-h-screen transition-all">
          {/* Sidebar */}
          <div className={`transition-all duration-300 ${isSidebarOpen ? "w-64" : "w-0"}`}>
            <SideNav isOpen={isSidebarOpen} toggleSidebar={() => setSidebarOpen(!isSidebarOpen)} />
          </div>

          {/* Main Content */}
          <div className="flex-1 flex flex-col p-6">{children}</div>
        </main>

        {/* Dark mode toggle button */}
        <DarkModeToggle setIsDarkMode={setIsDarkMode} />
      </div>
    </ClerkProvider>
  );
}
