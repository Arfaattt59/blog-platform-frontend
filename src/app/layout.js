// file: frontend/src/app/layout.js
import { Inter, Pacifico } from "next/font/google";
import "./globals.css";
import { Toaster } from 'react-hot-toast';
import Header from "@/components/Header";
import BottomNavBar from "@/components/BottomNavBar"; // 1. Re-import the BottomNavBar

const inter = Inter({ subsets: ["latin"] });
const pacifico = Pacifico({ subsets: ['latin'], weight: '400', variable: '--font-pacifico' });

export const metadata = { title: "AI Blog Platform", description: "A modern, AI-powered blogging platform." };

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} ${pacifico.variable} bg-gray-50`}>
        <Toaster position="top-center" />
        <Header />
        {/* 2. Add padding to top AND bottom */}
        <main className="container mx-auto px-6 pt-24 pb-24">
          {children}
        </main>
        <BottomNavBar /> {/* 3. Add the BottomNavBar back */}
      </body>
    </html>
  );
}