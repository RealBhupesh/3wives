import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import { DemoProvider } from "@/lib/store";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://3wives.ai"),
  title: {
    default: "3Wives — Relationship intelligence for complex lives",
    template: "%s — 3Wives AI",
  },
  description:
    "The world's first multi-relationship inference engine. One AI that remembers everything, says the right things, and keeps every version of your life running perfectly.",
  applicationName: "3Wives AI",
  keywords: [
    "relationship orchestration",
    "conversational inference",
    "context isolation",
    "AI digital twin",
    "relationship infrastructure",
  ],
  openGraph: {
    title: "3Wives AI — Three wives. One you. Zero collisions.",
    description:
      "Multi-relationship orchestration with 99.9% context isolation, 24/7 emotional availability, and zero forgotten anniversaries.",
    siteName: "3Wives AI",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "3Wives AI — Three wives. One you. Zero collisions.",
    description:
      "The world's first multi-relationship inference engine. Enterprise-grade emotional infrastructure.",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${jakarta.variable} ${geistMono.variable}`}>
      <body className="min-h-screen bg-ground text-ink antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-ink focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-ground"
        >
          Skip to content
        </a>
        <DemoProvider>{children}</DemoProvider>
        <Toaster
          theme="light"
          position="bottom-right"
          toastOptions={{
            style: {
              background: "#ffffff",
              border: "1px solid rgba(11,13,18,0.1)",
              boxShadow: "0 8px 24px -12px rgba(15,23,42,0.18)",
              color: "#0b0d12",
              borderRadius: "10px",
              fontSize: "13px",
            },
          }}
        />
      </body>
    </html>
  );
}
