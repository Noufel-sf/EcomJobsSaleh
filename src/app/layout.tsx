import type { Metadata } from "next";
import { Alexandria, Outfit } from "next/font/google";
import dynamic from "next/dynamic";
import "./globals.css";
import ClientProviders from "@/lib/ClientProviders";
import BackToTopButton from "@/components/BackToTopButton";
import LayoutWrapper from "@/lib/Layout";

const DeferredToaster = dynamic(
  () => import("@/components/Toaster").then((mod) => mod.Toaster),
  // { ssr: false },
);


const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
  weight: ["400", "500", "600", "700"],
  preload: true,
});

const alexandria = Alexandria({
  subsets: ["arabic", "latin"],
  variable: "--font-alexandria",
  display: "swap",
  weight: ["400", "500", "600", "700"],
  preload: true,
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';


export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Saleh Store - Your Trusted Online Marketplace',
    template: '%s | Saleh Store',
  },
  description: 'Shop quality products at great prices. Browse electronics, fashion, home goods and more. Fast shipping, secure checkout, and excellent customer service.',
  keywords: ['online store', 'ecommerce', 'electronics', 'shopping', 'marketplace', 'best deals', 'buy online'],
  authors: [{ name: 'Saleh Store' }],
  creator: 'Saleh Store',
  publisher: 'Saleh Store',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    title: 'Saleh Store - Your Trusted Online Marketplace',
    description: 'Shop quality products at great prices with fast shipping and secure checkout.',
    siteName: 'Saleh Store',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Saleh Store - Your Trusted Online Marketplace',
    description: 'Shop quality products at great prices with fast shipping and secure checkout.',
    creator: '@salehstore',
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
  manifest: '/manifest.json',
  verification: {
    // Add your verification codes here when you have them
    // google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
    // bing: 'your-bing-verification-code',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://res.cloudinary.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://wadkniss-r6ar.onrender.com" crossOrigin="anonymous" />
      </head>
      <body className={`antialiased ${outfit.variable} ${alexandria.variable}`}>
        <ClientProviders>
          <LayoutWrapper>
            {children}
            <BackToTopButton />
          </LayoutWrapper>
        </ClientProviders>
        <DeferredToaster />
      </body>
    </html>
  );
}
