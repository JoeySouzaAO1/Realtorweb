import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/general/Navbar";
import { Footer } from "@/components/general/Footer";

// Optimized font loading with display swap and preload
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  title: "Joey Souza - Real Estate Agent | Fathom Realty | Triangle Area",
  description: "Dedicated Realtor with Fathom Realty serving buyers and sellers in the Triangle area. Expert guidance for buying, selling, and market analysis.",
  keywords: "real estate, realtor, Triangle area, home buying, home selling, Fathom Realty, Joey Souza",
  authors: [{ name: "Joey Souza" }],
  creator: "Joey Souza",
  publisher: "Fathom Realty",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://localhost:3000'),
  openGraph: {
    title: "Joey Souza - Real Estate Agent",
    description: "Dedicated Realtor with Fathom Realty serving buyers and sellers in the Triangle area.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Joey Souza - Real Estate Agent",
    description: "Dedicated Realtor with Fathom Realty serving buyers and sellers in the Triangle area.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#ef4444" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://vgjbljjluvlexargpigo.supabase.co" />
        <link rel="dns-prefetch" href="https://cdninstagram.com" />
      </head>
      <body
        className={`${inter.variable} antialiased max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`}
      >
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
