import { TopBar } from '@/app/ui/topbar';
import Link from 'next/link';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Learn More',
};

export default function PlaceholderPage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen px-4 bg-gradient-to-b from-sky-400 to-blue-500">
      <TopBar />

      {/* Placeholder Content */}
      <div className="text-center text-white">
        <h1 className="text-4xl font-bold md:text-6xl">Coming Soon</h1>
        <p className="mt-4 text-lg md:text-xl opacity-80">We're working on it!</p>
      </div>

      {/* Back Button */}
      <Link
        href="/"
        className="mt-8 flex items-center gap-3 rounded-lg bg-gradient-to-r from-blue-500 to-blue-700 px-6 py-3 text-white text-sm font-medium transition-all hover:bg-white/30 md:text-base"
      >
        <ArrowLeftIcon className="w-5 md:w-6" />
        <span>Back to Home</span>
      </Link>
    </main>
  );
}
