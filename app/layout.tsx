import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/components/providers/QueryProvider";
import { Toaster } from "sonner";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
  fallback: ["system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
});

export const metadata: Metadata = {
  title: "FlexIt - Every Post = Coin. Every Creator = Asset.",
  description: "Join the anti-rug SocialFi revolution on Solana. FlexIt turns every post into a tradable coin and every creator into an asset. Built different.",
  metadataBase: new URL('https://www.flexitsol.fun'),
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
    url: 'https://www.flexitsol.fun',
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
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} antialiased font-sans`}
        suppressHydrationWarning
      >
        <QueryProvider>
          {children}
          <Toaster position="top-center" richColors />
        </QueryProvider>
      </body>
    </html>
  );
}
