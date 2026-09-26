"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";

interface HeroProps {
  subtitle?: string;
  year?: string;
  isReady?: boolean;
}

export default function Hero({
  subtitle = "DEVELOPER / ANALYST",
  year = "2026",
  isReady = true,
}: HeroProps) {
  const heroRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const portfRef = useRef<HTMLDivElement>(null);
  const lioRef = useRef<HTMLDivElement>(null);
  const avatarRef = useRef<HTMLDivElement>(null);
  const metaLeftRef = useRef<HTMLDivElement>(null);
  const metaRightRef = useRef<HTMLDivElement>(null);
  const scrollHintRef = useRef<HTMLAnchorElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const [reducedMotion, setReducedMotion] = useState<boolean>(false);

  // Hook 1: Handle reduced motion preferences and video playback
  useEffect(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handleMotionChange = () => {
      const isReduced = motionQuery.matches;
      setReducedMotion(isReduced);
      if (videoRef.current) {
        if (isReduced) {
          videoRef.current.pause();
        } else {
          videoRef.current.play().catch(() => {});
        }
      }
    };

    handleMotionChange();
    motionQuery.addEventListener("change", handleMotionChange);

    return () => {
      motionQuery.removeEventListener("change", handleMotionChange);
    };
  }, []);

  // Hook 2: Headline Text and Avatar Entrance Animation
  useEffect(() => {
    if (reducedMotion) {
      gsap.set(
        [
          portfRef.current,
          lioRef.current,
          avatarRef.current,
          metaLeftRef.current,
          metaRightRef.current,
          scrollHintRef.current,
        ],
        { opacity: 1, color: "#101010", y: 0, scale: 1, filter: "none" }
      );
      return;
    }

    // Set initial desaturated / faded state
    gsap.set([portfRef.current, lioRef.current], {
      opacity: 0.12,
      color: "#8A94A0",
      y: 8,
      filter: "blur(3px)",
    });

    gsap.set([metaLeftRef.current, metaRightRef.current], {
      opacity: 0.12,
      color: "#8A94A0",
      y: 6,
    });

    gsap.set(avatarRef.current, {
      opacity: 0.12,
      scale: 0.9,
      filter: "blur(2px)",
    });

    gsap.set(scrollHintRef.current, {
      opacity: 0,
      y: 8,
    });

    // When isReady is true (as IntroLoader fades out), run the color reveal animation
    if (isReady) {
      const tl = gsap.timeline();
      tlRef.current = tl;

      // 1. Headline "PORTFOLIO" color & opacity reveal: solidifies into bold #101010
      tl.to(
        [portfRef.current, lioRef.current],
        {
          opacity: 1,
          color: "#101010",
          y: 0,
          filter: "blur(0px)",
          duration: 1.1,
          ease: "power2.out",
        },
        0.1
      );

      // 2. Illustrated Face Avatar sharpens & fades into place
      tl.to(
        avatarRef.current,
        {
          opacity: 1,
          scale: 1,
          filter: "blur(0px)",
          duration: 1.0,
          ease: "power2.out",
        },
        0.2
      );

      // 3. Subtitle "DEVELOPER / ANALYST" & Year "2026" solidify to #101010
      tl.to(
        [metaLeftRef.current, metaRightRef.current],
        {
          opacity: 1,
          color: "#101010",
          y: 0,
          duration: 0.9,
          ease: "power2.out",
        },
        0.25
      );

      // 4. Subtle "SCROLL TO EXPLORE" hint fades in
      tl.to(
        scrollHintRef.current,
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power2.out",
        },
        0.75
      );
    }

    return () => {
      if (tlRef.current) tlRef.current.kill();
    };
  }, [isReady, reducedMotion]);

  return (
    <header
      ref={heroRef}
      id="home"
      className="editorial-hero"
      role="banner"
      aria-label="Editorial Hero Portfolio Opening"
    >
      {/* Looping Background Video scoped strictly to Hero section */}
      <div className="hero-video-bg-container" aria-hidden="true">
        <video
          ref={videoRef}
          className="hero-video-bg"
          src="/Asteroids_drifting_in_space_202608300216.mp4"
          poster="/images/hero_video_poster.jpg"
          autoPlay={!reducedMotion}
          loop
          muted
          playsInline
          preload="auto"
        />
        {/* Warm cream paper tint overlay keeping text 100% legible */}
        <div className="hero-video-tint-overlay" />
        {/* Soft-edge corner vignette masking any bottom-right video artifacts */}
        <div className="hero-video-corner-mask" />
      </div>

      {/* Paper grain overlay */}
      <div className="hero-grain" aria-hidden="true" />

      {/* Main Editorial Composition Frame */}
      <div className="hero-stage">
        {/* Unified Title Block containing Meta + PORTFOLIO + Avatar */}
        <div className="hero-title-block">
          {/* Top Metadata Row anchored directly to the outer edges of PORTFOLIO */}
          <div className="hero-meta-row">
            <div ref={metaLeftRef} className="hero-subtitle">
              {subtitle}
            </div>
            <div ref={metaRightRef} className="hero-year">
              {year}
            </div>
          </div>

          {/* Center Typography & Vector Avatar Row */}
          <div className="hero-title-row">
            {/* Left Word Segment: PORTF */}
            <div ref={portfRef} className="hero-word-left">
              PORTF
            </div>

            {/* Central Illustrated Avatar Image */}
            <div ref={avatarRef} className="hero-avatar-container">
              <Image
                src="/images/face-icon.png"
                alt="Illustrated avatar"
                width={220}
                height={220}
                priority
                style={{ width: "auto", height: "auto" }}
                className="hero-avatar-img"
              />
            </div>

            {/* Right Word Segment: LIO */}
            <div ref={lioRef} className="hero-word-right">
              LIO
            </div>
          </div>
        </div>

        {/* Clean "SCROLL TO EXPLORE" Indicator */}
        <a
          ref={scrollHintRef}
          href="#about"
          className="hero-scroll-hint"
          aria-label="Scroll down to explore portfolio"
        >
          <span className="scroll-hint-text">SCROLL TO EXPLORE</span>
        </a>
      </div>
    </header>
  );
}
