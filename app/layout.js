/*import "./globals.css";

export const metadata = {
  title: "Samagosain | Ethnic Wear Store",
  description: "Beautiful sarees, kurtas, and wedding wear.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <header className="site-header">
          <a href="/" className="logo">
            Samagosain
          </a>
          <nav>
            <a href="/">Shop</a>
            <a href="/contact">Contact</a>
          </nav>
        </header>
        <main>{children}</main>
        <footer className="site-footer">
          <p>&copy; {new Date().getFullYear()} Samagosain. All rights reserved.</p>
        </footer>
      </body>
    </html>
  );
}*/


import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });

export const metadata = {
  title: "Samagosain | Ethnic Wear Store",
  description: "Beautiful sarees, kurtas, and wedding wear.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body>
        <header className="site-header sticky-header">
          <a href="/" className="logo">
            Blossom_Threads
          </a>
          <nav>
            <a href="/">Shop</a>
            <a href="/contact">Contact</a>
          </nav>
        </header>
        <main>{children}</main>
        <footer className="site-footer">
          <p>&copy; {new Date().getFullYear()} Samagosain. All rights reserved.</p>
        </footer>
      </body>
    </html>
  );
}
