"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import "./Navbar.css";

const Navbar = () => {
  const router = useRouter();
  const [activePage, setActivePage] = useState("");
  useEffect(() => {
    const path = window.location.pathname;
    const pageName = path.split("/")[1] || "accueil";
    setActivePage(pageName);
  }, []);

  const handleNavigation = (path: string) => {
    router.push(path);
    const pageName = path.split("/")[1] || "accueil";
    setActivePage(pageName);
  };

  const navItems = [
    { path: "/accueil", label: "Home", key: "accueil" },
    { path: "/lost", label: "Lost", key: "lost" },
    { path: "/found", label: "Found", key: "found" },
    { path: "/reportfl", label: "Report Lost or Found Item", key: "reportLFI" },
    { path: "/messages", label: "Messages", key: "msg" },
    { path: "/profile", label: "Profile", key: "profile" },
  ];

  return (
    <nav className="navbar">
      <div className="nav-l">
        <h1>Lost and found</h1>
      </div>
      <div className="nav-r">
        {navItems.map((item) => (
          <button
            key={item.key}
            onClick={() => handleNavigation(item.path)}
            className={activePage === item.key ? "active" : ""}
          >
            {item.label}
          </button>
        ))}

        <button
          onClick={() => {
            //Vider le localStorage
            localStorage.clear();

            // Rediriger vers la page d'accueil
            router.push("/");
          }}
          className="signout-btn"
        >
          Sign Out
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
