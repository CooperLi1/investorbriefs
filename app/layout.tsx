'use client'

import { ClerkProvider } from '@clerk/nextjs'
import { mont } from '@/app/ui/fonts'
import Head from 'next/head'
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import DarkModeToggle from "@/app/components/darkmodetoggle";
import "./globals.css"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  // Define dynamic titles based on the current route
  const getPageTitle = (path: string) => {
    const titles: { [key: string]: string } = {
      '/dashboard': 'Summary | InvestorBriefs',
      '/dashboard/visualize': 'Visualize | InvestorBriefs',
    }
    return titles[path] || 'InvestorBriefs - AI-Powered Stock Summaries'
  }

  const [title, setTitle] = useState(getPageTitle(pathname))

  useEffect(() => {
    setTitle(getPageTitle(pathname))
    document.title = getPageTitle(pathname)
  }, [pathname])

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
    <html lang="en">
          <Head>
            {/* Dynamic Title */}
            <title>{title}</title>
            <meta name="description" content="Get real-time AI-generated stock insights to make smarter investments." />

            {/* Favicon */}
            <link rel="icon" href="/favicon.ico" />
            <link rel="shortcut icon" href="/favicon-32x32.png" />
            <link rel="apple-touch-icon" href="/apple-touch-icon.png" />

            {/* Open Graph Metadata */}
            <meta property="og:title" content={title} />
            <meta property="og:description" content="Get real-time AI-generated stock insights to make smarter investments." />
            <meta property="og:url" content="https://investorbriefs.vercel.app" />
            <meta property="og:site_name" content="InvestorBriefs" />
            <meta property="og:image" content="/og-image.png" />
            <meta property="og:image:width" content="1200" />
            <meta property="og:image:height" content="630" />
            <meta property="og:type" content="website" />

            {/* Twitter Metadata */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content="Get real-time AI-generated stock insights to make smarter investments." />
            <meta name="twitter:image" content="/og-image.png" />
          </Head>
      <body className={`${mont.className } antialiased bg-gray-50 dark:bg-gray-900`}>
        <ClerkProvider>
          {children}
          <DarkModeToggle setDarkMode={setDarkMode} />
        </ClerkProvider>
      </body>
    </html>
  )
}
