"use client";

import React from "react";
import Image from "next/image";

export interface TransitionalBannerProps {
  bannerText?: string;
  imageSrc?: string;
  imageAlt?: string;
  accentColor?: string;
  scrollSpeed?: number;
  showGeneratedOutline?: boolean;
}

export default function TransitionalBanner({
  bannerText = "JAHADEEP SUNDAR PORTFOLIO",
  imageSrc = "/images/my_pic_final_cutout.png",
  imageAlt = "Jahadeep Sundar S cutout portrait",
  accentColor = "#FF2A4B",
  scrollSpeed = 25,
  showGeneratedOutline = false,
}: TransitionalBannerProps) {
  return (
    <section
      className="transitional-banner-section"
      aria-label={`${bannerText} showcase marquee banner`}
      style={
        {
          "--banner-accent": accentColor,
          "--marquee-speed": `${scrollSpeed}s`,
        } as React.CSSProperties
      }
    >
      {/* Master Torn Paper Band:
          Single mathematical source of truth for both top and bottom jagged tear lines.
          Clips black background, marquee text, red silhouette, and portrait image simultaneously. */}
      <div className="torn-paper-band">
        {/* Infinite Smooth Scrolling Marquee Track (Behind Photo) */}
        <div className="banner-marquee-container" aria-hidden="true">
          <div className="banner-marquee-track">
            {/* Group 1 */}
            <div className="banner-marquee-group">
              <span className="banner-marquee-text">{bannerText}</span>
              <span className="banner-marquee-text">{bannerText}</span>
            </div>
            {/* Group 2 */}
            <div className="banner-marquee-group" aria-hidden="true">
              <span className="banner-marquee-text">{bannerText}</span>
              <span className="banner-marquee-text">{bannerText}</span>
            </div>
          </div>
        </div>

        {/* Static Centered Cutout Portrait with Real Alpha Red Silhouette (z-index: 5) */}
        <div className="banner-portrait-wrapper">
          <div className="banner-portrait-crop-box">
            <Image
              src={imageSrc}
              alt={imageAlt}
              width={480}
              height={700}
              priority
              className={
                showGeneratedOutline
                  ? "banner-portrait-img-filtered"
                  : "banner-portrait-img-clean"
              }
            />
          </div>
        </div>
      </div>
    </section>
  );
}
