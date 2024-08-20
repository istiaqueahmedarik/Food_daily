import localFont from "next/font/local";
import "./globals.css";
import NavBar from "@/components/NavBar";
import { GeistSans } from "geist/font/sans";
import { Toaster } from "@/components/ui/toaster"
import { ThemeProvider } from "@/components/theme-provider";

const geistSans = localFont({
  src: "./fonts/Geist-Light.woff",
  variable: "--font-geist-sans",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
});

export const metadata = {
  title: "Food-daily",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${GeistSans.className}  bg-background`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
        >
        <NavBar/>
        {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
