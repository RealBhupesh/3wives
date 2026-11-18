import type { Metadata, Viewport } from "next";
import { Inter_Tight, JetBrains_Mono } from "next/font/google";
import { Toaster } from "sonner";
import { DemoProvider } from "@/lib/store";
import "./globals.css";

const interTight = Inter_Tight({
  subsets: ["latin"],
  variable: "--font-inter-tight",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://3wives.ai"),
  title: {
    default: "3Wives AI — Three wives. One you. Zero collisions.",
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
  themeColor: "#08090d",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${interTight.variable} ${jetbrains.variable}`}>
      <body className="min-h-screen bg-ground text-ink antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-ink focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-ground"
        >
          Skip to content
        </a>
        <DemoProvider>{children}</DemoProvider>
        <Toaster
          theme="dark"
          position="bottom-right"
          toastOptions={{
            style: {
              background: "#12131b",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "#f4f4f6",
              borderRadius: "10px",
              fontSize: "13px",
            },
          }}
        />
      </body>
    </html>
  );
}
