import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "@/components/theme-provider";
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
  title: "PulseBoard | Public Metrics Engine",
  description: "Ditch the manual stats. Sync your GitHub, Stripe, and Vercel velocity directly to a stunning public dashboard. Transparency as a Service.",
  keywords: ["build in public", "startup metrics", "live dashboard", "GitHub stats", "shipping velocity"],
  authors: [{ name: "PulseBoard Team" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://pulseboard.dev",
    siteName: "PulseBoard",
    title: "The Live Pulse of Your Shipping Speed",
    description: "Connect your tools and get a beautiful, live public dashboard that updates as you ship.",
    images: [{
      url: "/og-image.png",
      width: 1200,
      height: 630,
      alt: "PulseBoard Dashboard Preview",
    }],
  },
  twitter: {
    card: "summary_large_image",
    title: "PulseBoard | Live Startup Metrics",
    description: "Automate your transparency. Ship faster, show your pulse.",
    creator: "@pulseboard",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0c" },
  ],
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
        <body className="min-h-full flex flex-col font-sans bg-background text-foreground transition-colors duration-300">
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
