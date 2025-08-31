
import './globals.css';
import Navigationbar from '@/components/navigationbar.jsx';
import ErrorWrapper from '@/app/error-wrapper.jsx';
import CursorTrailWrapper from '@/components/cursortrailwrapper';
import { Inter } from 'next/font/google';
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Amritansh | Portfolio Built Differently',
  description: 'Full-Stack Developer, Builder, and Creator',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="shortcut icon" href="/portfolio-logo.svg" type="image/x-icon" />
      </head>
      <body className={`${inter.className} bg-gray-50 text-gray-900`}>
        <div className="flex">
            <main className="flex-1 z-10 min-h-screen rounded-lg border-none outline-none transition-all duration-300 ease-in-out">
              <CursorTrailWrapper>
                <Navigationbar />
                <ErrorWrapper>{children}</ErrorWrapper>
                <Toaster />
              </CursorTrailWrapper>
            </main>
        </div>
      </body>
    </html>
  );
}
