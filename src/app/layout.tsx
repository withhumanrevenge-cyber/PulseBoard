import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "@/components/theme-provider";
import { Navbar } from "@/components/navbar";
import { WelcomeBot } from "@/components/welcome-bot";
import { BotProvider } from "@/components/bot-context";
import { LoadingOverlay } from "@/components/loading-overlay";
import { NavigationLoader } from "@/components/navigation-loader";
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
  title: "PulseBoard | Developer Reputation Platform",
  description: "Connect your stack and publish a verified developer profile that updates as you ship.",
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
            defaultTheme="light"
            enableSystem={false}
            disableTransitionOnChange
          >
            <BotProvider>
              <Navbar />
              <NavigationLoader />
              <LoadingOverlay />
              <WelcomeBot />
              {children}
            </BotProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
