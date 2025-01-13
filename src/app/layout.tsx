import { Outfit, Space_Grotesk, Fira_Code } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/context/AuthContext";
import { SocketProvider } from "@/context/SocketContext";
import TrialStatus from "@/components/TrialStatus";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const firaCode = Fira_Code({
  subsets: ["latin"],
  variable: "--font-fira-code",
  display: "swap",
});

export const metadata = {
  title: "EventHub - Event Management Platform",
  description:
    "Create, manage and attend events with real-time updates. A modern event management platform for organizing and discovering exciting events.",
  keywords: [
    "events",
    "event management",
    "event planning",
    "event platform",
    "real-time events",
    "public events",
  ],
  authors: [{ name: "EventHub Team" }],
  creator: "EventHub",
  publisher: "EventHub",
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    title: "EventHub - Event Management Platform",
    description: "Create, manage and attend events with real-time updates",
    url: "https://celadon-cajeta-53d661.netlify.app",
    siteName: "EventHub",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "EventHub - Event Management Platform",
    description: "Create, manage and attend events with real-time updates",
    creator: "@eventhub",
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="theme-color" content="#ffffff" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body
        className={`${outfit.variable} ${spaceGrotesk.variable} ${firaCode.variable}`}
      >
        <AuthProvider>
          <SocketProvider>
            <div className="min-h-screen bg-background">
              <Navbar />
              <TrialStatus />
              <main className="container mx-auto py-6 px-4 max-w-7xl">
                {children}
              </main>
            </div>
            <Toaster />
          </SocketProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
