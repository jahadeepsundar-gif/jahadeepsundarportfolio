"use client";

import React, { useEffect, useRef } from "react";

export default function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      // Ensure video plays smoothly inline
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          video.muted = true;
          video.play().catch(() => {});
        });
      }
    }

    // Scroll reveal observer (re-triggers both scrolling down and up)
    const elements = sectionRef.current?.querySelectorAll(".editorial-reveal");
    if (elements && elements.length > 0) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            const target = entry.target as HTMLElement;
            const parent = target.parentElement;
            if (parent) {
              const siblings = parent.querySelectorAll(".editorial-reveal");
              let idx = 0;
              siblings.forEach((el, si) => {
                if (el === target) idx = si;
              });
              target.style.transitionDelay = entry.isIntersecting
                ? `${idx * 0.08}s`
                : "0s";
            }

            if (entry.isIntersecting) {
              target.classList.add("visible");
            } else {
              target.classList.remove("visible");
            }
          });
        },
        { threshold: 0.08, rootMargin: "0px 0px -30px 0px" }
      );

      elements.forEach((el) => observer.observe(el));

      return () => {
        elements.forEach((el) => observer.unobserve(el));
      };
    }
  }, []);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="about-intro-section"
      aria-label="Introduction and About Me"
    >
      {/* Subtle paper grain texture overlay */}
      <div className="about-paper-grain" aria-hidden="true" />

      {/* Faint thin-grey square grid overlay */}
      <div className="about-square-grid" aria-hidden="true" />

      {/* Content Container: max-width 1440px, top padding clearing navbar */}
      <div className="about-content-container">
        <div className="about-editorial-grid">
          
          {/* ============================================================
              LEFT COLUMN (360px): The Original Full-Colour MP4 Video
              Direct HTML5 <video> without canvas, CV, filters, or masking
              Positioned at top beside HELLO, spanning beside both rows
              Size: ~330px wide x 700px high on desktop
              ============================================================ */}
          <div className="about-col-left editorial-reveal">
            <div className="person-figure-wrap">
              <video
                ref={videoRef}
                src="/Man_walking_toward_camera_202608291824.mp4"
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
                className="about-person-direct-video"
                aria-label="Man walking toward camera"
              />
            </div>
          </div>

          {/* ============================================================
              CENTER COLUMN (580px): HELLO + Intro Copy + EDUCATION
              ============================================================ */}
          <div className="about-col-center">
            {/* HELLO Heading + Greeting + Paragraphs */}
            <div className="editorial-reveal">
              <h2 className="heading-hello">HELLO</h2>
              <p className="greeting-text">Hi, I&apos;m Jahadeep Sundar.</p>
              
              <div className="about-paragraphs">
                <p>
                  MCA student and recent BCA graduate with a passion for Python,
                  MySQL, and practical problem-solving. My technical background is
                  grounded in developing hands-on, real-world applications,
                  alongside recent industry experience as a Data Analytics Intern at
                  VDart.
                </p>
                <p>
                  Outside of tech, my background as an Interact Club Chairman and
                  Black Belt Karate mentor fuels my approach to leadership,
                  discipline, and teamwork in all environments.
                </p>
              </div>
            </div>

            {/* EDUCATION Heading + Compact Entries (Matching Reference) */}
            <div className="education-section-block editorial-reveal">
              <h3 className="heading-education">EDUCATION</h3>
              
              <div className="edu-compact-list">
                <div className="edu-compact-item editorial-reveal">
                  <h4 className="edu-degree-title">Master of Computer Applications (MCA)</h4>
                  <p className="edu-desc-text">
                    Advanced Computing &amp; Relational Database Systems | 2026 – 2028
                  </p>
                </div>

                <div className="edu-compact-item editorial-reveal">
                  <h4 className="edu-degree-title">Bachelor of Computer Applications (BCA)</h4>
                  <p className="edu-desc-text">
                    Core Computer Science &amp; Programming Fundamentals | 2023 – 2026
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ============================================================
              RIGHT COLUMN (460px): SKILLS + 3x2 App Icon Grid + EXPERIENCE
              ============================================================ */}
          <div className="about-col-right">
            {/* SKILLS Heading + 3x2 App Icon Grid */}
            <div className="editorial-reveal">
              <h3 className="heading-skills">SKILLS</h3>
              
              <div className="skills-3x2-editorial-grid">
                {/* 1. Python (Deep Navy / Yellow Icon) */}
                <div className="skill-app-squircle skill-bg-python editorial-reveal" title="Python">
                  <svg viewBox="0 0 128 128" className="skill-app-glyph">
                    <path fill="#3776AB" d="M63.7 3.3c-28.5 0-26.7 12.3-26.7 12.3l.1 12.8h27.1v3.9H26.3S3.3 30.6 3.3 64.2c0 33.6 20.1 32.5 20.1 32.5h12v-17s-.7-20.1 19.8-20.1h26.7s19.1.3 19.1-18.7V16.3S102.8 3.3 63.7 3.3zM49.3 13.9c3.9 0 7.1 3.2 7.1 7.1s-3.2 7.1-7.1 7.1-7.1-3.2-7.1-7.1 3.2-7.1 7.1-7.1z"/>
                    <path fill="#FFD43B" d="M64.3 124.7c28.5 0 26.7-12.3 26.7-12.3l-.1-12.8H63.8v-3.9h37.9s23 1.7 23-31.9c0-33.6-20.1-32.5-20.1-32.5h-12v17s.7 20.1-19.8 20.1H46.1s-19.1-.3-19.1 18.7v24.6s-1.8 13 37.3 13zm14.4-10.6c-3.9 0-7.1-3.2-7.1-7.1s3.2-7.1 7.1-7.1 7.1 3.2 7.1 7.1-3.2 7.1-7.1 7.1z"/>
                  </svg>
                </div>

                {/* 2. MySQL (Deep Teal Navy / Orange Icon) */}
                <div className="skill-app-squircle skill-bg-mysql editorial-reveal" title="MySQL">
                  <svg viewBox="0 0 24 24" className="skill-app-glyph">
                    <path fill="#00758F" d="M12 3C6.5 3 2 4.8 2 7v10c0 2.2 4.5 4 10 4s10-1.8 10-4V7c0-2.2-4.5-4-10-4z"/>
                    <path fill="#F29111" d="M12 5.5c-4.4 0-8 1.1-8 2.5s3.6 2.5 8 2.5 8-1.1 8-2.5-3.6-2.5-8-2.5z"/>
                    <ellipse cx="12" cy="8" rx="8" ry="2.5" fill="#00758F"/>
                    <path fill="#ffffff" d="M12 12c-3.5 0-6.5-.7-7.5-1.7V13c0 1.4 3.6 2.5 8 2.5s8-1.1 8-2.5v-2.7c-1 1-4 1.7-8.5 1.7z"/>
                    <path fill="#ffffff" d="M12 16.5c-3.5 0-6.5-.7-7.5-1.7v2.7c0 1.4 3.6 2.5 8 2.5s8-1.1 8-2.5v-2.7c-1 1-4 1.7-8.5 1.7z"/>
                  </svg>
                </div>

                {/* 3. Excel (Rich Microsoft Green Icon) */}
                <div className="skill-app-squircle skill-bg-excel editorial-reveal" title="Excel">
                  <svg viewBox="0 0 24 24" className="skill-app-glyph">
                    <rect x="2" y="2" width="20" height="20" rx="4" fill="#107C41"/>
                    <path fill="#ffffff" d="M7 6l4.5 6L7 18h2.5l3.25-4.5L16 18h2.5l-4.5-6 4.5-6H16l-3.25 4.5L9.5 6H7z"/>
                  </svg>
                </div>

                {/* 4. DB Mgmt (Terracotta / Coral Icon) */}
                <div className="skill-app-squircle skill-bg-db editorial-reveal" title="Database Management">
                  <svg viewBox="0 0 24 24" className="skill-app-glyph" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <ellipse cx="12" cy="5" rx="8" ry="3"/>
                    <path d="M20 12c0 1.66-3.58 3-8 3s-8-1.34-8-3"/>
                    <path d="M4 5v14c0 1.66 3.58 3 8 3s8-1.34 8-3V5"/>
                  </svg>
                </div>

                {/* 5. Web Logic (Charcoal / Code Glyph Icon) */}
                <div className="skill-app-squircle skill-bg-web editorial-reveal" title="Web Logic & Architecture">
                  <svg viewBox="0 0 24 24" className="skill-app-glyph" fill="none" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="16 18 22 12 16 6"/>
                    <polyline points="8 6 2 12 8 18"/>
                    <line x1="14" y1="4" x2="10" y2="20" stroke="#FFD43B"/>
                  </svg>
                </div>

                {/* 6. Troubleshooting / Debug (Dark Indigo / Target Icon) */}
                <div className="skill-app-squircle skill-bg-debug editorial-reveal" title="Troubleshooting & Analysis">
                  <svg viewBox="0 0 24 24" className="skill-app-glyph" fill="none" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="4 17 10 11 4 5"/>
                    <line x1="12" y1="19" x2="20" y2="19"/>
                  </svg>
                </div>
              </div>
            </div>

            {/* EXPERIENCE Heading + Compact Entries (Matching Reference) */}
            <div className="experience-section-block editorial-reveal">
              <h3 className="heading-experience">EXPERIENCE</h3>
              
              <div className="exp-compact-list">
                {/* 1. VDart */}
                <div className="exp-compact-item editorial-reveal">
                  <span className="exp-date-label">1 Month Internship</span>
                  <h4 className="exp-role-title">Data Analytics Intern</h4>
                  <span className="exp-org-title">VDart</span>
                </div>

                {/* 2. Star Health */}
                <div className="exp-compact-item editorial-reveal">
                  <span className="exp-date-label">2022 – Present</span>
                  <h4 className="exp-role-title">Insurance Support Assistant</h4>
                  <span className="exp-org-title">Star Health &amp; Allied Insurance</span>
                </div>

                {/* 3. Interact Club */}
                <div className="exp-compact-item editorial-reveal">
                  <span className="exp-date-label">2020 – 2021</span>
                  <h4 className="exp-role-title">Secretary &amp; Chairman</h4>
                  <span className="exp-org-title">Interact Club of Boiler Township</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
