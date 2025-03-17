'use client';
import { Form } from './form';
import { SideNav } from '@/app/components/sidenav';
import { useState } from 'react';

export default function Main() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  return (
    <main className="flex min-h-screen bg-gradient-to-b from-sky-400 to-blue-500 transition-all">
      {/* Sidebar  */}
      <div className={`transition-all duration-300 ${isSidebarOpen ? 'w-64' : 'w-16'}`}>
        <SideNav isOpen={isSidebarOpen} toggleSidebar={() => setSidebarOpen(!isSidebarOpen)} />
      </div>

      {/* Form */}
      <div
        className={`flex-1 flex items-center justify-center px-4 transition-all duration-300 ${
          isSidebarOpen ? 'hidden md:flex' : 'flex'
        }`}
      >
        <Form />
      </div>
    </main>
  );
}
