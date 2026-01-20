'use client';

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import "./Navbar.css";

const Navbar = () => {
    const router = useRouter();
    const [activePage, setActivePage] = useState("");

    // Détecter la page active
    useEffect(() => {
        const path = window.location.pathname;
        const pageName = path.split('/')[1] || 'accueil';
        setActivePage(pageName);
    }, []);

    const handleNavigation = (path: string) => {
        router.push(path);
        const pageName = path.split('/')[1] || 'accueil';
        setActivePage(pageName);
    };

    const navItems = [
        { path: "/accueil", label: "Home", key: "accueil" },
        { path: "/lost", label: "Lost", key: "lost" },
        { path: "/reportlost", label: "Report Lost", key: "reportlost" },
        { path: "/found", label: "Found", key: "found" },
        { path: "/reportfound", label: "Report Found", key: "reportfound" },
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
                    onClick={() => router.push("/")}
                    className="signout-btn"
                >
                    Sign Out
                </button>
            </div>
        </nav>
    );
};

export default Navbar;