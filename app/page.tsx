import { sigmar } from "@/app/ui/fonts";
import { mont } from "@/app/ui/fonts";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { TopBar } from "@/app/components/topbar";

function ActionButtons() {
  return (
    <div className="mt-10 flex flex-col md:flex-row items-center gap-6">
      {/* Sign up */}
      <Link
        href="/signup"
        className="flex items-center gap-3 rounded-lg bg-gradient-to-r from-blue-500 to-blue-700 px-8 py-4 text-sm font-medium text-white transition-all border border-white/50 md:text-base shadow-md 
        hover:scale-105 hover:shadow-2xl hover:border-white hover:bg-blue-600"
      >
      <span>Sign up</span>
        <ArrowRightIcon className="w-5 md:w-6" />
      </Link>
      {/* Log in */}
      <Link
        href="/login"
        className="flex items-center gap-3 rounded-lg bg-gradient-to-r from-blue-500 to-blue-700 px-8 py-4 text-sm font-medium text-white transition-all border border-white/50 md:text-base shadow-md 
        hover:scale-105 hover:shadow-2xl hover:border-white hover:bg-blue-600"
      >
      <span>Log in</span>
        <ArrowRightIcon className="w-5 md:w-6" />
      </Link>

      {/* Learn More */}
      <Link
        href="/learn-more"
        className="flex items-center gap-3 rounded-lg bg-gradient-to-r from-blue-500 to-blue-700 px-8 py-4 text-sm font-medium text-white transition-all border border-white/50 md:text-base shadow-md 
        hover:scale-105 hover:shadow-2xl hover:border-white hover:bg-blue-600"
      >
        <span>Learn More</span>
        <ArrowRightIcon className="w-5 md:w-6" />
      </Link>
    </div>
  );
}

function Title() {
  return (
    <div className="flex flex-col items-center text-center max-w-3xl px-6">
      <h1 className={`${mont.className} text-5xl md:text-7xl font-bold text-white leading-tight drop-shadow-lg`}>
        Making Investment Simple.
      </h1>

      <p className={`${mont.className} text-lg md:text-2xl text-gray-200 italic mt-4`}>
        Real-time stock summaries with AI.
      </p>

      <div className="mt-3 h-1 w-20 bg-white rounded-full opacity-80" />
    </div>
  );
}

export default function Home() {
  return (
    <div className="relative h-screen bg-gradient-to-b from-sky-400 to-blue-500 flex flex-col items-center justify-center text-center overflow-hidden">
      <TopBar />

      {/* Background */}
      <div className="absolute top-10 left-10 w-16 h-16 bg-white/20 rounded-full blur-2xl opacity-40" />
      <div className="absolute bottom-10 right-10 w-24 h-24 bg-white/20 rounded-full blur-3xl opacity-40" />

      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-blue-700 to-transparent opacity-40" />

      {/* Main */}
      <div className="flex flex-col items-center space-y-8">
        <Title />
        <ActionButtons />
      </div>
    </div>
  );
}
