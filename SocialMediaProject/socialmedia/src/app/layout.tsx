
import type { Metadata } from "next";
import Providers from "@/app/provider";
import Sidenavbar from "@/components/sidenavbar";
import UnAuthorize from "@/components/unAuthorize-wrapper";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Geist, Geist_Mono, Poppins } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "Briezly - Connecting made easy",
  description: "Its a social media website made for connecting people to their loved ones...",
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({children, params}: {children: React.ReactNode; params: Promise<{}>}) {
  return (
    <html lang="en" suppressHydrationWarning={true} >
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${poppins.variable} antialiased`}
      >
        <div className="flex h-screen">
          <ThemeProvider>
            <Providers>
              <Sidenavbar/>
              <div className="flex-1">
                <UnAuthorize>
                  {children}
                </UnAuthorize>
              </div>
            </Providers>
          </ThemeProvider>
        </div>
      </body>
    </html>
  );
}
