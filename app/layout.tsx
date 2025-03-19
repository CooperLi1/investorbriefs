import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { sigmar } from '@/app/ui/fonts';
import { mont } from '@/app/ui/fonts';
import Logo from "@/app/ui/images/Logo";
import { ClerkProvider } from '@clerk/nextjs'
import DarkModeToggle from "@/app/components/darkmodetoggle";
import "./globals.css";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
 
export const metadata: Metadata = {
  title: {
    template: '%s | InvestorBriefs',
    default: 'InvestorBriefs',
  },
  description: 'Get real-time AI-generated stock insights to make smarter investments.',

  // Icons for the Browser Tab (Favicon)
  icons: {
    icon: '/favicon.ico', // Standard favicon (default)
    shortcut: '/favicon-32x32.png', // Common shortcut icon
    apple: '/apple-touch-icon.png', // Apple Touch Icon for mobile
  },

  // Open Graph Metadata (For Social Media Previews)
  openGraph: {
    title: 'InvestorBriefs - AI-Powered Stock Summaries',
    description: 'Get real-time AI-generated stock insights to make smarter investments.',
    url: 'https://investorbriefs.com',
    siteName: 'InvestorBriefs',
    images: [
      {
        url: '/og-image.png', // Open Graph preview image
        width: 1200,
        height: 630,
        alt: 'InvestorBriefs - AI-Powered Stock Summaries',
      },
    ],
    type: 'website',
  },

  // Twitter Metadata (For Twitter Link Previews)
  twitter: {
    card: 'summary_large_image',
    title: 'InvestorBriefs - AI-Powered Stock Summaries',
    description: 'Get real-time AI-generated stock insights to make smarter investments.',
    images: ['/og-image.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${mont.className} antialiased`}>
        <ClerkProvider>
          {children}
        </ClerkProvider>
      </body>
    </html>
  );
}
