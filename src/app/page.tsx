"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import AboutSection from "@/components/AboutSection";
import TransitionalBanner from "@/components/TransitionalBanner";
import ProjectsSection from "@/components/ProjectsSection";
import ExperienceSection from "@/components/ExperienceSection";
import AchievementsSection from "@/components/AchievementsSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

const IntroSplash = dynamic(() => import("@/components/IntroSplash"), {
  ssr: false,
  loading: () => <div className="splash-screen-overlay" aria-hidden="true" />,
});

export default function Home() {
  const [pageReady, setPageReady] = useState<boolean>(false);

  useEffect(() => {
    // Scroll reveal observer (re-triggering both scrolling down and up)
    const elements = document.querySelectorAll(".reveal");
    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const target = entry.target as HTMLElement;
          const parent = target.parentElement;
          if (parent) {
            const siblings = parent.querySelectorAll(".reveal");
            let idx = 0;
            siblings.forEach((el, si) => {
              if (el === target) idx = si;
            });
            target.style.transitionDelay = entry.isIntersecting
              ? `${idx * 0.1}s`
              : "0s";
          }

          if (entry.isIntersecting) {
            target.classList.add("visible");
          } else {
            target.classList.remove("visible");
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );

    elements.forEach((el) => observer.observe(el));

    return () => {
      elements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  return (
    <>
      {/* ✦ Full-Screen Intro Splash Animation (Plays once on page load) */}
      <IntroSplash
        onStartFade={() => setPageReady(true)}
      />

      {/* ✦ Page content smoothly crossfades in simultaneously as loader fades out */}
      <div className={`page-content ${pageReady ? "page-visible" : ""}`}>
        <Navbar />

        {/* ✦ 100vh Permanent Editorial Hero Section */}
        <Hero subtitle="DEVELOPER / ANALYST" year="2026" isReady={pageReady} />

        {/* ✦ 3-Column Editorial About Section */}
        <AboutSection />

        {/* ✦ Full-Width Transitional Torn Paper Marquee Banner */}
        <TransitionalBanner />

        {/* ✦ High-Contrast Stamped Projects Section */}
        <ProjectsSection />

        {/* ✦ High-Contrast Stamped Experience Timeline */}
        <ExperienceSection />

        {/* ✦ High-Contrast Stamped Awards & Achievements */}
        <AchievementsSection />

        {/* ✦ High-Contrast Stamped Contact / Connect Section */}
        <ContactSection />

        {/* ✦ Modern Footer */}
        <Footer />
      </div>
    </>
  );
}
