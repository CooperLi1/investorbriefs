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

  return (
    <div className="relative h-screen flex flex-col">
      <TopBar />

      {/* Main Content */}
      <div className="flex flex-row items-center justify-between h-full px-12 space-x-12">
        <div className="flex flex-col items-start w-full max-w-xl gap-y-6">
          <Title />
          <ActionButtons />
        </div>

        <div className="relative w-full max-w-7xl">
          <iframe
            className="w-full h-[500px] rounded-xl shadow-xl border-none"
            src="https://www.youtube.com/embed/5BV2vOFly0M?autoplay=1&loop=1&playlist=5BV2vOFly0M&mute=1&controls=0&modestbranding=1&showinfo=0&disablekb=1&fs=0&rel=0&iv_load_policy=3"
            title="YouTube video player"
            allow="autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
          />
         {/* <div className="absolute top-0 left-0 w-full h-[10%] defaultbg"></div>
        <div className="absolute bottom-0 left-0 w-full h-[10%] defaultbg"></div> */}
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
