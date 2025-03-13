import { TopBar } from '@/app/components/topbar';
import Link from 'next/link';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { Metadata } from 'next';
import { UserProfile } from '@/app/components/showlogin';
import {Form} from './form'
import {SideNav} from '@/app/components/sidenav'


export const metadata: Metadata = {
    title: 'Dashboard',
};

export default function PlaceholderPage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen px-4 bg-gradient-to-b from-sky-400 to-blue-500">
      <SideNav />

      {/* Form */}
      <Form/>

    </main>
  );
}