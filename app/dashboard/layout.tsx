"use client";

import { ClerkProvider } from "@clerk/nextjs";
import DarkModeToggle from "@/app/components/darkmodetoggle";
import { SideNav } from "../components/sidenav";
import { useState, useEffect } from "react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setSidebarOpen] = useState(false); // Sidebar state
  const [darkMode, setDarkMode] = useState<boolean>(false); // Dark mode state

  useEffect(() => {
    // Check the saved theme in localStorage and set darkMode state
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setDarkMode(savedTheme === "dark");
    } else {
      // Default to light mode if no theme is saved
      setDarkMode(false);
    }
  }, []);

  useEffect(() => {
    // Update the class on document element when darkMode changes
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    // Save the theme preference to localStorage
    localStorage.setItem("theme", darkMode ? "dark" : "light");

    // Log to see if dark mode changes
    console.log("Dark Mode:", darkMode ? "Enabled" : "Disabled");
  }, [darkMode]); // Run when darkMode changes

  return (
    <ClerkProvider>
      <div className="min-h-screen transition-all bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-white">
        <main className="flex min-h-screen">
          {/* Sidebar */}
          <div
            className={`transition-all duration-300 ${isSidebarOpen ? "w-64" : "w-0"} dark:bg-gray-800 dark:text-white`}
          >
            <SideNav
              isOpen={isSidebarOpen}
              toggleSidebar={() => setSidebarOpen(!isSidebarOpen)}
            />
          </div>

          {/* Main Content */}
          <div
            className={`flex-1 flex flex-col p-7 transition-all duration-300 ${
              isSidebarOpen ? 'hidden md:flex' : 'flex'
            }`}
          >
            {children}
          </div>
        </main>

        {/* Dark mode toggle button */}
        <DarkModeToggle setDarkMode={setDarkMode} />
      </div>
    </ClerkProvider>
  );
}
