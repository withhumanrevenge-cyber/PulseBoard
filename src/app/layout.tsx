import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "@/components/theme-provider";
import { Navbar } from "@/components/navbar";
import { WelcomeBot } from "@/components/welcome-bot";
import { BotProvider } from "@/components/bot-context";
import { PulseAIProvider } from "@/components/pulse-ai-context";
import { PulseAIPanel } from "@/components/pulse-ai-panel";
import { PulseAIFab } from "@/components/pulse-ai-fab";
import { RouteProgress } from "@/components/route-progress";
import { NavigationLoader } from "@/components/navigation-loader";
import { ReducedMotionProvider } from "@/components/motion-config";
import "./globals.css";

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  title: "PulseBoard | Proof-of-work developer profiles",
  description:
    "Verified developer profiles built from code other maintainers merged — not self-reported resumes. Find, compare, and shortlist engineers by real shipped work.",
  openGraph: { siteName: "PulseBoard", type: "website" },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html
        lang="en"
        className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
        suppressHydrationWarning
      >
        <body className="min-h-full flex flex-col font-sans bg-background text-foreground transition-colors duration-300 overflow-x-hidden">
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <ReducedMotionProvider>
              <BotProvider>
                <PulseAIProvider>
                  <Navbar />
                  <NavigationLoader />
                  <RouteProgress />
                  <WelcomeBot />
                  <PulseAIFab />
                  <PulseAIPanel />
                  {children}
                </PulseAIProvider>
              </BotProvider>
            </ReducedMotionProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
