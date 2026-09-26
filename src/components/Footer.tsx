"use client";

import React from "react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer" role="contentinfo">
      <p>
        Designed &amp; Developed by <strong>Jahadeep Sundar S</strong>{" "}
        &nbsp;·&nbsp; © {currentYear}
      </p>
      <div className="social-links">
        <a
          href="https://www.linkedin.com/in/jahadeep-sundar-893bbb352/"
          target="_blank"
          rel="noopener noreferrer"
          className="social-icon"
          id="footer-linkedin"
          aria-label="Jahadeep Sundar LinkedIn"
        >
          LinkedIn
        </a>
        <a
          href="https://www.instagram.com/_aka_jaha_?igsi=N3MwNnM0azk1anJh"
          target="_blank"
          rel="noopener noreferrer"
          className="social-icon"
          id="footer-instagram"
          aria-label="Jahadeep Sundar Instagram"
        >
          Instagram
        </a>
      </div>
    </footer>
  );
}
