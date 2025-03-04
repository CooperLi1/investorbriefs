import LoginForm from '@/login/login-form';
import { Suspense } from 'react';
import { TopBar } from '@/app/components/topbar';
import Link from 'next/link';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Login',
};

export default function LoginPage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen px-4 bg-gradient-to-b from-sky-400 to-blue-500">
      <TopBar />

      {/* Spacing to push form lower */}
      <div className="flex-grow" />

      {/* Login Form Container */}
      <div className="relative flex w-full max-w-[400px] flex-col space-y-6 p-6 bg-white rounded-lg shadow-lg">
        
        {/* Back Button */}
        <Link href="/" className="flex items-center text-blue-600 hover:text-blue-800 transition">
          <ArrowLeftIcon className="w-5 h-5 mr-2" />
          <span className="text-sm font-medium">Back to Home</span>
        </Link>

        <Suspense fallback={<div className="text-center text-gray-500">Loading...</div>}>
          <LoginForm />
        </Suspense>
      </div>

      {/* Extra spacing at the bottom */}
      <div className="h-48" />
    </main>
  );
}
