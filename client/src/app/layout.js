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

const uberMove = localFont({
  src: "./fonts/UberMove.woff2",
  variable: "--font-uber-move",
});

export const metadata = {
  title: "Food-daily",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${uberMove.className} font-[--font-uber-move]  bg-background`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
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
