
import "./globals.css";
import "./fonts.css";
import ErrorWrapper from "./error-wrapper";
import ThemeProvider from "@/components/ThemeProvider";
import ToastifyProvider from "@/components/toastify";

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
      <body className="antialiased">
      <script id='razorpay-script' src="https://checkout.razorpay.com/v1/checkout.js"></script>
        <ThemeProvider>
          <ToastifyProvider>
            <ErrorWrapper>{children}</ErrorWrapper>
          </ToastifyProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
