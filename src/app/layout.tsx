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

// Space Grotesk font
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

// Fira Code font
const firaCode = Fira_Code({
  subsets: ["latin"],
  variable: "--font-fira-code",
  display: "swap",
});
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Next.js Tailwind CSS Starter</title>
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
