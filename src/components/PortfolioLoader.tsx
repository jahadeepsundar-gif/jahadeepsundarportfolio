"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";

interface PortfolioLoaderProps {
  onComplete?: () => void;
  subtitle?: string;
  year?: string;
}

export default function PortfolioLoader({
  onComplete,
  subtitle = "DEVELOPER / ANALYST",
  year = "2026",
}: PortfolioLoaderProps) {
  const [isDone, setIsDone] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const portfRef = useRef<HTMLDivElement>(null);
  const lioRef = useRef<HTMLDivElement>(null);
  const avatarRef = useRef<HTMLDivElement>(null);
  const metaLeftRef = useRef<HTMLDivElement>(null);
  const metaRightRef = useRef<HTMLDivElement>(null);
  const curvePathRef = useRef<SVGPathElement>(null);
  const checkPathRef = useRef<SVGPathElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    // Prevent background scrolling while loader is visible
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    // Measure SVG stroke path lengths
    const curvePath = curvePathRef.current;
    const checkPath = checkPathRef.current;

    let curveLength = 250;
    let checkLength = 60;

    if (curvePath) {
      curveLength = curvePath.getTotalLength();
      gsap.set(curvePath, {
        strokeDasharray: curveLength,
        strokeDashoffset: curveLength,
      });
    }

    if (checkPath) {
      checkLength = checkPath.getTotalLength();
      gsap.set(checkPath, {
        strokeDasharray: checkLength,
        strokeDashoffset: checkLength,
      });
    }

    if (prefersReducedMotion) {
      // Reduced motion fallback: show static state then fade out swiftly
      gsap.set(
        [
          portfRef.current,
          lioRef.current,
          avatarRef.current,
          metaLeftRef.current,
          metaRightRef.current,
        ],
        { opacity: 1, xPercent: 0, y: 0, scale: 1 }
      );
      if (curvePath) gsap.set(curvePath, { strokeDashoffset: 0 });
      if (checkPath) gsap.set(checkPath, { strokeDashoffset: 0 });

      const timer = setTimeout(() => {
        gsap.to(containerRef.current, {
          opacity: 0,
          duration: 0.4,
          ease: "power2.inOut",
          onComplete: () => {
            document.body.style.overflow = originalOverflow;
            setIsDone(true);
            if (onComplete) onComplete();
          },
        });
      }, 1000);

      return () => clearTimeout(timer);
    }

    // Kinetic typography and illustration entrance timeline
    const tl = gsap.timeline({
      onComplete: () => {
        document.body.style.overflow = originalOverflow;
        setIsDone(true);
        if (onComplete) onComplete();
      },
    });
    tlRef.current = tl;

    // Initial positioning:
    // "PORTF" begins offset to the left
    // "LIO" begins offset to the right
    // Avatar is scaled down slightly & invisible
    gsap.set(portfRef.current, { xPercent: -35, opacity: 0 });
    gsap.set(lioRef.current, { xPercent: 35, opacity: 0 });
    gsap.set([metaLeftRef.current, metaRightRef.current], {
      opacity: 0,
      y: 6,
    });
    gsap.set(avatarRef.current, {
      opacity: 0,
      scale: 0.85,
      transformOrigin: "50% 50%",
    });

    // 1. Kinetic title slide into place (smooth soft ease-out, 0.9s–1.1s, no bounce)
    tl.to(
      portfRef.current,
      {
        xPercent: 0,
        opacity: 1,
        duration: 1.05,
        ease: "power3.out",
      },
      0
    );

    tl.to(
      lioRef.current,
      {
        xPercent: 0,
        opacity: 1,
        duration: 1.05,
        ease: "power3.out",
      },
      0
    );

    // 2. Subtitle & Year fade in aligned with title motion
    tl.to(
      [metaLeftRef.current, metaRightRef.current],
      {
        opacity: 1,
        y: 0,
        duration: 0.75,
        ease: "power2.out",
      },
      0.25
    );

    // 3. Avatar head revealed between 'F' and 'L' as title settles
    tl.to(
      avatarRef.current,
      {
        opacity: 1,
        scale: 1,
        duration: 0.7,
        ease: "power2.out",
      },
      0.65
    );

    // 4. Hand-drawn curved line draws downwards from beneath the avatar
    if (curvePath) {
      tl.to(
        curvePath,
        {
          strokeDashoffset: 0,
          duration: 0.65,
          ease: "power2.inOut",
        },
        1.1
      );
    }

    // 5. Hand-drawn minimal checkmark draws at the end of the curve
    if (checkPath) {
      tl.to(
        checkPath,
        {
          strokeDashoffset: 0,
          duration: 0.35,
          ease: "power2.out",
        },
        1.65
      );
    }

    // 6. Hold final composition briefly
    tl.to({}, { duration: 0.9 });

    // 7. Smooth exit transition to reveal the main portfolio page
    tl.to(containerRef.current, {
      opacity: 0,
      yPercent: -100,
      duration: 0.85,
      ease: "power3.inOut",
    });

    // Support replay event for testing / review
    const handleReplay = () => {
      setIsDone(false);
      document.body.style.overflow = "hidden";
      if (tlRef.current) tlRef.current.restart();
    };

    window.addEventListener("portfolio-loader-replay", handleReplay);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("portfolio-loader-replay", handleReplay);
      if (tlRef.current) tlRef.current.kill();
    };
  }, [onComplete]);

  if (isDone) return null;

  return (
    <div
      ref={containerRef}
      role="status"
      aria-label="Loading portfolio"
      aria-live="polite"
      aria-busy={!isDone}
      className="portfolio-loader"
    >
      {/* Paper grain overlay */}
      <div className="loader-grain" aria-hidden="true" />

      {/* Grid overlay */}
      <div className="loader-grid" aria-hidden="true" />

      {/* Main 16:9 Editorial Composition Frame */}
      <div className="loader-stage">
        {/* Top Metadata Row */}
        <div className="loader-meta-row">
          <div ref={metaLeftRef} className="loader-subtitle">
            {subtitle}
          </div>
          <div ref={metaRightRef} className="loader-year">
            {year}
          </div>
        </div>

        {/* Center Typography & Avatar Row */}
        <div className="loader-title-row">
          {/* Left Word Segment: PORTF */}
          <div ref={portfRef} className="loader-word-left">
            PORTF
          </div>

          {/* Central Hand-Drawn Illustrated Avatar */}
          <div ref={avatarRef} className="loader-avatar-container">
            <svg
              className="loader-avatar-svg"
              viewBox="0 0 240 230"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-label="Illustrated Avatar"
            >
              {/* Afro Hair Silhouette - Voluminous Afro Texture with black fill */}
              <g className="avatar-hair">
                {/* Hair main canopy */}
                <path
                  d="M 32 110
                     C 22 90, 24 60, 42 42
                     C 60 24, 85 18, 120 18
                     C 155 18, 180 24, 198 42
                     C 216 60, 218 90, 208 110
                     C 222 125, 218 150, 202 165
                     C 192 175, 178 180, 168 182
                     C 162 195, 148 212, 120 212
                     C 92 212, 78 195, 72 182
                     C 62 180, 48 175, 38 165
                     C 22 150, 18 125, 32 110 Z"
                  fill="#101010"
                />

                {/* Afro outer curly edge scallops */}
                {/* Left side afro curls */}
                <circle cx="34" cy="72" r="14" fill="#101010" />
                <circle cx="28" cy="98" r="13" fill="#101010" />
                <circle cx="26" cy="122" r="12" fill="#101010" />
                <circle cx="32" cy="144" r="11" fill="#101010" />
                <circle cx="44" cy="162" r="9" fill="#101010" />
                <circle cx="56" cy="174" r="9" fill="#101010" />

                {/* Top afro curls */}
                <circle cx="52" cy="36" r="13" fill="#101010" />
                <circle cx="76" cy="24" r="14" fill="#101010" />
                <circle cx="104" cy="19" r="15" fill="#101010" />
                <circle cx="136" cy="19" r="15" fill="#101010" />
                <circle cx="164" cy="24" r="14" fill="#101010" />
                <circle cx="188" cy="36" r="13" fill="#101010" />

                {/* Right side afro curls */}
                <circle cx="206" cy="72" r="14" fill="#101010" />
                <circle cx="212" cy="98" r="13" fill="#101010" />
                <circle cx="214" cy="122" r="12" fill="#101010" />
                <circle cx="208" cy="144" r="11" fill="#101010" />
                <circle cx="196" cy="162" r="9" fill="#101010" />
                <circle cx="184" cy="174" r="9" fill="#101010" />

                {/* Afro subtle white texture dots */}
                <circle cx="78" cy="46" r="1.4" fill="#F4F2EC" opacity="0.9" />
                <circle cx="95" cy="38" r="1.2" fill="#F4F2EC" opacity="0.85" />
                <circle cx="124" cy="34" r="1.5" fill="#F4F2EC" opacity="0.95" />
                <circle cx="148" cy="42" r="1.3" fill="#F4F2EC" opacity="0.85" />
                <circle cx="166" cy="52" r="1.4" fill="#F4F2EC" opacity="0.9" />
                <circle cx="62" cy="68" r="1.2" fill="#F4F2EC" opacity="0.75" />
                <circle cx="178" cy="72" r="1.3" fill="#F4F2EC" opacity="0.8" />
              </g>

              {/* Ears */}
              {/* Left ear */}
              <path
                d="M 52 112 C 42 115, 40 135, 52 142"
                fill="#F4F2EC"
                stroke="#101010"
                strokeWidth="4"
                strokeLinecap="round"
              />
              <path
                d="M 48 122 C 45 128, 48 134, 52 135"
                fill="none"
                stroke="#101010"
                strokeWidth="2.5"
                strokeLinecap="round"
              />

              {/* Right ear */}
              <path
                d="M 188 112 C 198 115, 200 135, 188 142"
                fill="#F4F2EC"
                stroke="#101010"
                strokeWidth="4"
                strokeLinecap="round"
              />
              <path
                d="M 192 122 C 195 128, 192 134, 188 135"
                fill="none"
                stroke="#101010"
                strokeWidth="2.5"
                strokeLinecap="round"
              />

              {/* Face Contour Fill and Outline */}
              <path
                d="M 54 100
                   C 54 75, 78 62, 120 62
                   C 162 62, 186 75, 186 100
                   C 186 130, 178 165, 148 184
                   C 134 192, 106 192, 92 184
                   C 62 165, 54 130, 54 100 Z"
                fill="#F4F2EC"
                stroke="#101010"
                strokeWidth="4.5"
                strokeLinejoin="round"
              />

              {/* Forehead hairline shadow curve */}
              <path
                d="M 62 88 C 88 74, 152 74, 178 88"
                fill="none"
                stroke="#101010"
                strokeWidth="3.5"
                strokeLinecap="round"
              />

              {/* Eyebrows - Bold, angled, intense expression */}
              {/* Left eyebrow */}
              <path
                d="M 68 104 C 82 92, 102 96, 110 106"
                fill="#101010"
                stroke="#101010"
                strokeWidth="6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {/* Right eyebrow */}
              <path
                d="M 172 104 C 158 92, 138 96, 130 106"
                fill="#101010"
                stroke="#101010"
                strokeWidth="6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Eyes */}
              {/* Left Eye */}
              <g className="avatar-left-eye">
                {/* Upper lash / contour */}
                <path
                  d="M 72 120 C 82 112, 100 112, 108 121"
                  fill="none"
                  stroke="#101010"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
                {/* Lower lid */}
                <path
                  d="M 76 122 C 84 128, 98 128, 104 123"
                  fill="none"
                  stroke="#101010"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                {/* Iris & Pupil */}
                <ellipse cx="90" cy="119" rx="6" ry="6" fill="#101010" />
                {/* Specular Highlight */}
                <circle cx="88.5" cy="117.5" r="1.8" fill="#F4F2EC" />
              </g>

              {/* Right Eye */}
              <g className="avatar-right-eye">
                {/* Upper lash / contour */}
                <path
                  d="M 168 120 C 158 112, 140 112, 132 121"
                  fill="none"
                  stroke="#101010"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
                {/* Lower lid */}
                <path
                  d="M 164 122 C 156 128, 142 128, 136 123"
                  fill="none"
                  stroke="#101010"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                {/* Iris & Pupil */}
                <ellipse cx="150" cy="119" rx="6" ry="6" fill="#101010" />
                {/* Specular Highlight */}
                <circle cx="148.5" cy="117.5" r="1.8" fill="#F4F2EC" />
              </g>

              {/* Nose */}
              <path
                d="M 116 122 L 115 138 C 115 143, 125 143, 125 138"
                fill="none"
                stroke="#101010"
                strokeWidth="3.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M 111 138 C 114 140, 117 141, 120 141 C 123 141, 126 140, 129 138"
                fill="none"
                stroke="#101010"
                strokeWidth="3.2"
                strokeLinecap="round"
              />

              {/* Mustache */}
              <path
                d="M 98 152
                   C 106 148, 115 149, 120 152
                   C 125 149, 134 148, 142 152
                   C 134 157, 126 156, 120 154
                   C 114 156, 106 157, 98 152 Z"
                fill="#101010"
              />

              {/* Mouth & Confident Expression */}
              <path
                d="M 104 162 C 112 163, 128 163, 136 162"
                fill="none"
                stroke="#101010"
                strokeWidth="3.8"
                strokeLinecap="round"
              />
              {/* Lower lip shadow */}
              <path
                d="M 112 168 C 116 170, 124 170, 128 168"
                fill="none"
                stroke="#101010"
                strokeWidth="2.8"
                strokeLinecap="round"
              />

              {/* Beard / Goatee / Chin Hair with Afro bottom curls */}
              <path
                d="M 68 148
                   C 66 166, 84 186, 102 195
                   C 112 200, 128 200, 138 195
                   C 156 186, 174 166, 172 148
                   C 176 158, 174 174, 160 188
                   C 146 200, 132 208, 120 208
                   C 108 208, 94 200, 80 188
                   C 66 174, 64 158, 68 148 Z"
                fill="#101010"
              />

              {/* Chin afro beard curls along bottom edge */}
              <circle cx="94" cy="194" r="6" fill="#101010" />
              <circle cx="106" cy="201" r="6.5" fill="#101010" />
              <circle cx="120" cy="204" r="7" fill="#101010" />
              <circle cx="134" cy="201" r="6.5" fill="#101010" />
              <circle cx="146" cy="194" r="6" fill="#101010" />

              {/* Soul patch under lip */}
              <path
                d="M 116 172 L 124 172 L 122 179 L 118 179 Z"
                fill="#101010"
              />
            </svg>
          </div>

          {/* Right Word Segment: LIO */}
          <div ref={lioRef} className="loader-word-right">
            LIO
          </div>
        </div>

        {/* Hand-Drawn SVG Curved Line and Checkmark */}
        <div className="loader-draw-layer" aria-hidden="true">
          <svg
            className="loader-draw-svg"
            viewBox="0 0 400 320"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Smooth curved stroke descending from center beneath avatar */}
            <path
              ref={curvePathRef}
              d="M 200 10
                 C 198 50, 185 85, 178 120
                 C 170 160, 162 195, 150 230"
              stroke="#101010"
              strokeWidth="3.2"
              strokeLinecap="round"
              fill="none"
            />

            {/* Hand-drawn minimal checkmark */}
            <path
              ref={checkPathRef}
              d="M 140 248
                 L 150 262
                 L 174 238"
              stroke="#101010"
              strokeWidth="3.6"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
