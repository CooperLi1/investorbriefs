"use client";

import { useEffect, useState } from "react";
import { MoonIcon, SunIcon } from "@heroicons/react/24/outline";

export default function DarkModeToggle({ setIsDarkMode }: { setIsDarkMode: (value: boolean) => void }) {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const isDark = localStorage.getItem("theme") === "dark";
      setDarkMode(isDark);
      document.documentElement.classList.toggle("dark", isDark);
    }
  }, []);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    document.documentElement.classList.toggle("dark", newMode);
    localStorage.setItem("theme", newMode ? "dark" : "light");
    setIsDarkMode(newMode); // Notify parent layout

    console.log("Dark Mode:", newMode ? "Enabled" : "Disabled");
  };

  return (
    <button
      onClick={toggleDarkMode}
      className="fixed top-2 right-2 flex items-center justify-center gap-1 p-2 text-xl rounded-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-lg border border-gray-300 dark:border-gray-600
                focus:ring-2 focus:ring-blue-500 transition-all duration-300 ease-in-out 
                hover:scale-110 hover:shadow-xl"
    >
      {darkMode ? (
        <SunIcon className="w-6 h-6 text-yellow-400" />
      ) : (
        <MoonIcon className="w-6 h-6 text-gray-900" />
      )}
    </button>
  );
}
