"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function Header() {
  const pathname = usePathname();
  const [activeHash, setActiveHash] = useState("");

  // Listen for hash changes (like clicking "Shop" to go to #collection)
  useEffect(() => {
    const handleHashChange = () => setActiveHash(window.location.hash);
    window.addEventListener("hashchange", handleHashChange);
    // Set initial hash on load
    handleHashChange(); 
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  return (
    <header className="site-header sticky-header">
      <div className="header-left">
        <Link href="/" onClick={() => setActiveHash("")} className="logo-link logo-container">
          <img src="/logo.png" alt="Blossom Logo" className="logo-image" />
        </Link>
      </div>

      <nav className="header-nav">
        <Link 
          href="/" 
          onClick={() => setActiveHash("")}
          className={`nav-pill ${pathname === '/' && activeHash !== '#collection' ? 'active-pill' : ''}`}
        >
          Home
        </Link>
        <Link 
          href="/#collection" 
          onClick={() => setActiveHash("#collection")}
          className={`nav-pill ${activeHash === '#collection' ? 'active-pill' : ''}`}
        >
          Shop
        </Link>
        <Link 
          href="/contact" 
          onClick={() => setActiveHash("")}
          className={`nav-pill ${pathname === '/contact' ? 'active-pill' : ''}`}
        >
          Contact
        </Link>
      </nav>
<div className="header-right">
        <button className="icon-btn">🛒</button>
        
      </div>
      
    </header>
  );
}


/*
  The Header component is a sticky navigation bar that includes links to Home, Shop, and Contact pages. It uses Next.js's usePathname hook to determine the current route and highlight the active link. Additionally, it listens for hash changes in the URL to manage the active state of the "Shop" link when navigating to the #collection section. The logo is clickable and resets the active state when clicked.
*/