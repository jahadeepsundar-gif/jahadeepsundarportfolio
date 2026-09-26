"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";

export default function EditorialBanner() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    // Staggered reveal matching reference site entrance animations
    const section = sectionRef.current;
    if (!section) return;

    const revealEls = section.querySelectorAll<HTMLElement>("[data-reveal]");
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement;
            const delay = el.dataset.delay ?? "0";
            setTimeout(() => {
              el.classList.add("eb-in");
            }, Number(delay));
            obs.unobserve(el);
          }
        });
      },
      { threshold: 0.06 }
    );
    revealEls.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="portfolio-banner"
      className="eb-section"
      aria-label="Portfolio – Jahadeep Sundar"
    >
      {/* Paper texture layers — cream grid + subtle noise */}
      <div className="eb-paper-grid" aria-hidden="true" />

      {/* ── Centred lockup ──────────────────────────────────────────── */}
      <div className="eb-stage">
        {/*
          .eb-lockup drives the entire composition via font-size.
          font-size: clamp(2.25rem, 10.47vw, 17rem)  ← exact reference value
          All child sizes are in em so they scale together.
        */}
        <div className="eb-lockup">
          {/*
            Labels row: sits just ABOVE the PORTFOLIO word.
            position: absolute; bottom: 100%; left/right: 0
            so "DEVELOPER / ANALYST" aligns with the left of PORTF
            and "2026" aligns with the right of LIO.
          */}
          <div className="eb-lockup-labels" data-reveal data-delay="80">
            <p className="eb-eyebrow">DEVELOPER / ANALYST</p>
            <p className="eb-year">2026</p>
          </div>

          {/*
            The giant PORTFOLIO word.
            We use the same ghost+real double technique as the reference:
            - .eb-word-ghost: opacity ~0.07, provides layout dimension
            - The real letters sit on top via position: relative
          */}
          <h1 className="eb-display" aria-label="PORTFOLIO">
            {/* Ghost — provides exact layout footprint, near-invisible */}
            <span className="eb-word-ghost" aria-hidden="true">
              <span>P</span>
              <span>O</span>
              <span>R</span>
              <span>T</span>
              <span>F</span>
              {/* O slot — same width as person container */}
              <span className="eb-o-ghost">O</span>
              <span>L</span>
              <span>I</span>
              <span>O</span>
            </span>

            {/* Real visible letters */}
            <span className="eb-word-real" aria-hidden="true">
              <span data-reveal data-delay="120">P</span>
              <span data-reveal data-delay="150">O</span>
              <span data-reveal data-delay="180">R</span>
              <span data-reveal data-delay="210">T</span>
              <span data-reveal data-delay="240">F</span>

              {/* Person slot — exactly 1.257em wide, same as the "O" */}
              <span className="eb-person-slot">
                <span className="eb-person-inner">
                  <Image
                    src="/images/jahadeep_portrait.png"
                    alt="Jahadeep Sundar"
                    fill
                    className="eb-person-img"
                    priority
                    sizes="(max-width: 768px) 18vw, 13vw"
                  />
                </span>
              </span>

              <span data-reveal data-delay="290">L</span>
              <span data-reveal data-delay="320">I</span>
              <span data-reveal data-delay="350">O</span>
            </span>
          </h1>
        </div>
      </div>

      {/*
        Name label — absolute positioned at left:45vw, top:57%
        matching reference exactly.
      */}
      <div className="eb-name-badge" data-reveal data-delay="500">
        {/* Decorative curved arrow matching reference scroll indicator */}
        <svg
          viewBox="0 0 190 210"
          fill="none"
          className="eb-scroll-arrow"
          aria-hidden="true"
        >
          <path
            d="M 176 6 C 173 48, 156 78, 127 98 C 95 120, 55 133, 40 170 M 21 147 C 28 155, 35 161, 40 173 C 48 163, 57 156, 66 151"
            stroke="#121211"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="1"
            strokeDashoffset="0"
            pathLength="1"
          />
        </svg>
        <p className="eb-name-label">JAHADEEP SUNDAR</p>
      </div>
    </section>
  );
}
