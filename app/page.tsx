'use client'
import { SignInButton, SignUpButton } from "@clerk/nextjs";
import { mont } from "@/app/ui/fonts";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { TopBar } from "@/app/components/topbar";
import DarkModeToggle from "@/app/components/darkmodetoggle";
import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import  VideoComponent from "@/app/components/video";

export default function Home() {
  const [darkMode, setDarkMode] = useState<boolean>(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setDarkMode(savedTheme === "dark");
    }
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  return (
    <div className="relative h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      <TopBar />

      {/* Main Content */}
      <div className="flex flex-row items-center justify-between h-full px-12 space-x-12">
        {/*Title & Buttons */}
        <div className="flex flex-col items-start w-full max-w-xl gap-y-6">
          <Title />
          <ActionButtons />
          <DarkModeToggle setDarkMode={setDarkMode} />
        </div>

        {/* Right Section */}
        <div className="w-full max-w-7xl">
          <VideoComponent/>
        </div>
      </div>
    </div>
  );
}

function Title() {
  return (
    <div className="w-full">
      <h1 className={`${mont.className} text-5xl md:text-7xl font-bold defaulttext leading-tight`}>
        Making Investment Simple.
      </h1>
      <p className={`${mont.className} text-lg md:text-2xl defaulttext italic mt-4`}>
        Real-time stock summaries with AI.
      </p>
      <div className="mt-3 h-1 w-20 bg-gray-800 rounded-full opacity-80" />
    </div>
  );
}

function ActionButtons() {
  const { user } = useUser();

  if (user) {
    return (
      <Link href="/dashboard" className="submitbutton w-full max-w-xs">
        <span>Go to Dashboard</span>
        <ArrowRightIcon className="w-5 md:w-6" />
      </Link>
    );
  }

  return (
    <div className="flex space-x-4">
      <SignInButton mode="modal">
        <button className="submitbutton w-48">
          <span>Log in</span>
          <ArrowRightIcon className="w-5 md:w-6" />
        </button>
      </SignInButton>

      <SignUpButton mode="modal">
        <button className="submitbutton w-48">
          <span>Sign up</span>
          <ArrowRightIcon className="w-5 md:w-6" />
        </button>
      </SignUpButton>
    </div>
  );
}
