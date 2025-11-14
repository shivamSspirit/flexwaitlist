import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/components/providers/QueryProvider";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FlexIt - Every Post = Coin. Every Creator = Asset.",
  description: "Join the anti-rug SocialFi revolution on Solana. FlexIt turns every post into a tradable coin and every creator into an asset. Built different.",
  metadataBase: new URL('https://flexit.app'),
  keywords: [
    'SocialFi',
    'Solana',
    'Creator Economy',
    'Crypto',
    'Web3',
    'Creator Tokens',
    'Post Tokens',
    'DeFi',
    'NFT',
    'Blockchain',
    'Social Trading',
    'Copy Trading',
  ],
  authors: [{ name: 'FlexIt Team' }],
  creator: 'FlexIt',
  publisher: 'FlexIt',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://flexit.app',
    title: 'FlexIt - Every Post = Coin. Every Creator = Asset.',
    description: 'Join the anti-rug SocialFi revolution on Solana. FlexIt turns every post into a tradable coin and every creator into an asset. Built different.',
    siteName: 'FlexIt',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FlexIt - Every Post = Coin. Every Creator = Asset.',
    description: 'Join the anti-rug SocialFi revolution on Solana. Built different.',
    creator: '@ShivamSspirit',
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
  icons: {
    icon: [
      { url: '/flexit-logo.svg', type: 'image/svg+xml' },
    ],
    apple: [
      { url: '/flexit-logo.svg' },
    ],
  },
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <QueryProvider>
          {children}
          <Toaster position="top-center" richColors />
        </QueryProvider>
      </body>
    </html>
  );
}
