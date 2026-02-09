"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react"; // Ajoute lucide-react si pas déjà installé
import "./Navbar.css";

const Navbar = () => {
  const router = useRouter();
  const [activePage, setActivePage] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const path = window.location.pathname;
    const pageName = path.split("/")[1] || "home";
    setActivePage(pageName);
  }, []);

  const handleNavigation = (path: string) => {
    router.push(path);
    const pageName = path.split("/")[1] || "home";
    setActivePage(pageName);
    setIsMobileMenuOpen(false); // Ferme le menu mobile après clic
  };

  const navItems = [
    { path: "/accueil", label: "Home", key: "accueil" },
    { path: "/lost", label: "Lost", key: "lost" },
    { path: "/found", label: "Found", key: "found" },
    { path: "/reportfl", label: "Report Item", key: "reportLFI" },
    { path: "/messages", label: "Messages", key: "messages" },
    { path: "/profile", label: "Profile", key: "profile" },
  ];

  return (
    <nav className="navbar">
      <div className="nav-left">
        <h1 className="logo">Lost & Found</h1>
      </div>

      {/* Desktop Menu */}
      <div className="nav-right desktop-menu">
        {navItems.map((item) => (
          <button
            key={item.key}
            onClick={() => handleNavigation(item.path)}
            className={`nav-link ${activePage === item.key ? "active" : ""}`}
            aria-current={activePage === item.key ? "page" : undefined}
          >
            {item.label}
          </button>
        ))}

        <button
          onClick={() => {
            localStorage.clear();
            router.push("/");
          }}
          className="signout-btn"
          aria-label="Sign out"
        >
          Sign Out
        </button>
      </div>

      {/* Mobile Hamburger */}
      <button
        className="mobile-toggle"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
        aria-expanded={isMobileMenuOpen}
      >
        {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
      </button>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="mobile-menu">
          {navItems.map((item) => (
            <button
              key={item.key}
              onClick={() => handleNavigation(item.path)}
              className={`mobile-link ${activePage === item.key ? "active" : ""}`}
            >
              {item.label}
            </button>
          ))}
          <button
            onClick={() => {
              localStorage.clear();
              router.push("/");
            }}
            className="mobile-signout"
          >
            Sign Out
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;