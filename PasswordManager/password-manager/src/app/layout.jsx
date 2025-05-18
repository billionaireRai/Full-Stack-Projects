import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// main page related content starts from here...
export const metadata = {
  title: {
    default: "lockRift | Secure Vault & Password Manager",
    template: "%s | lockRift",
    absolute: "lockRift – The Ultimate Digital Vault for Files & Passwords"
  },
  description: "lockRift is a secure and encrypted vault manager for storing passwords, confidential files, and personal data. Protect your digital life with military-grade encryption, seamless access, and intuitive design."
};


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
