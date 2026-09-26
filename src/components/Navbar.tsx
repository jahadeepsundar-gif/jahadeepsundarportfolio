"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const NAV_LINKS = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "projects", label: "Projects" },
  { id: "experience", label: "Experience" },
  { id: "achievements", label: "Achievements" },
  { id: "connect", label: "Connect" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const sections = document.querySelectorAll("section[id], main[id], header[id]");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.3 }
    );

    sections.forEach((s) => observer.observe(s));

    return () => {
      sections.forEach((s) => observer.unobserve(s));
    };
  }, []);

  // Close mobile menu on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <header
      className={`navbar ${scrolled ? "navbar-scrolled" : ""}`}
      role="banner"
    >
      <div className="navbar-container">
        <Link href="#home" className="logo" onClick={() => setMobileMenuOpen(false)}>
          JAHADEEP SUNDAR S
        </Link>

        {/* Desktop Navigation */}
        <nav className="desktop-nav" aria-label="Main navigation">
          <ul>
            {NAV_LINKS.map((link) => (
              <li key={link.id}>
                <Link
                  href={`#${link.id}`}
                  className={activeSection === link.id ? "active-link" : ""}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Desktop Social Links */}
        <div className="desktop-social-links">
          <a
            href="https://www.linkedin.com/in/jahadeep-sundar-893bbb352/"
            target="_blank"
            rel="noopener noreferrer"
            className="social-icon"
            id="nav-linkedin"
            aria-label="LinkedIn"
          >
            LinkedIn
          </a>
          <a
            href="https://www.instagram.com/_aka_jaha_?igsi=N3MwNnM0azk1anJh"
            target="_blank"
            rel="noopener noreferrer"
            className="social-icon"
            id="nav-instagram"
            aria-label="Instagram"
          >
            Instagram
          </a>
        </div>

        {/* Mobile Hamburger Toggle Button */}
        <button
          type="button"
          className="mobile-menu-btn"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-expanded={mobileMenuOpen}
          aria-label="Toggle navigation menu"
        >
          <span className={`hamburger-bar ${mobileMenuOpen ? "bar-1-open" : ""}`} />
          <span className={`hamburger-bar ${mobileMenuOpen ? "bar-2-open" : ""}`} />
          <span className={`hamburger-bar ${mobileMenuOpen ? "bar-3-open" : ""}`} />
        </button>
      </div>

      {/* Mobile Drawer Overlay */}
      <div className={`mobile-drawer ${mobileMenuOpen ? "drawer-open" : ""}`}>
        <nav aria-label="Mobile navigation">
          <ul className="mobile-nav-list">
            {NAV_LINKS.map((link) => (
              <li key={link.id}>
                <Link
                  href={`#${link.id}`}
                  className={`mobile-nav-link ${
                    activeSection === link.id ? "mobile-active-link" : ""
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="mobile-drawer-socials">
          <a
            href="https://www.linkedin.com/in/jahadeep-sundar-893bbb352/"
            target="_blank"
            rel="noopener noreferrer"
            className="social-icon mobile-social-btn"
            onClick={() => setMobileMenuOpen(false)}
          >
            LinkedIn ↗
          </a>
          <a
            href="https://www.instagram.com/_aka_jaha_?igsi=N3MwNnM0azk1anJh"
            target="_blank"
            rel="noopener noreferrer"
            className="social-icon mobile-social-btn"
            onClick={() => setMobileMenuOpen(false)}
          >
            Instagram ↗
          </a>
        </div>
      </div>
    </header>
  );
}
