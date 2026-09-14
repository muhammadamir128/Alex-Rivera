import type { Metadata } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import { GrainOverlay } from "@/components/site/grain-overlay";
import { CursorGlow } from "@/components/site/cursor-glow";
import { ScrollProgress } from "@/components/site/scroll-progress";
import { ThemeProvider } from "@/components/site/theme-provider";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Alex Rivera — Full-Stack Developer",
  description:
    "Full-stack developer crafting fast, accessible web experiences with React, Next.js, Node.js and PostgreSQL. 3 years of professional experience.",
  keywords: [
    "full-stack developer",
    "React",
    "Next.js",
    "TypeScript",
    "Node.js",
    "portfolio",
    "web developer",
  ],
  authors: [{ name: "Alex Rivera" }],
  icons: {
    icon: "/logo.svg",
  },
  openGraph: {
    title: "Alex Rivera — Full-Stack Developer",
    description:
      "Full-stack developer crafting fast, accessible web experiences with React, Next.js, Node.js and PostgreSQL.",
    url: "https://alexrivera.dev",
    siteName: "Alex Rivera",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Alex Rivera — Full-Stack Developer",
    description: "Full-stack developer crafting fast, accessible web experiences.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <body
        className={`${spaceGrotesk.variable} ${inter.variable} font-sans antialiased bg-background text-foreground min-h-screen`}
      >
        <ThemeProvider>
          <GrainOverlay />
          <CursorGlow />
          <ScrollProgress />
          {children}
          <Toaster />
          <SonnerToaster position="bottom-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}
