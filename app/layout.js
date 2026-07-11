import Header from "@/components/Header"; // Importing the new smart header
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata = {
  title: "Blossom | Ethnic Wear Store",
  description: "Beautiful sarees, kurtas, and wedding wear.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable}`}>
      <body>
        <Header />
        <main>{children}</main>
        <footer className="site-footer" style={{ textAlign: 'center', padding: '2rem', color: '#666', borderTop: '1px solid #333' }}>
          <p>&copy; {new Date().getFullYear()} Blossom. All rights reserved.</p>
        </footer>
      </body>
    </html>
  );
}