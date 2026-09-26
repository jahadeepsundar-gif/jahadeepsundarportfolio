"use client";

import React from "react";

export interface AchievementItem {
  id: string;
  icon: React.ReactNode;
  text: string;
}

const ACHIEVEMENTS_DATA: AchievementItem[] = [
  {
    id: "ach-1",
    icon: (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
        <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
        <path d="M4 22h16" />
        <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
        <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
        <path d="M18 2H6v7a6 6 0 0 0 12 0V2z" />
      </svg>
    ),
    text: "Karate Professional (Black Belt) | Karate Mentor – Karate Budokon International",
  },
  {
    id: "ach-2",
    icon: (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <circle cx="12" cy="8" r="6" />
        <path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11" />
      </svg>
    ),
    text: "Won 2nd Prize in Karate Championship – State Level",
  },
  {
    id: "ach-3",
    icon: (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M12 15a7 7 0 1 0 0-14 7 7 0 0 0 0 14z" />
        <path d="M8.21 13.89L7 23l5-3 5 3-1.21-9.11" />
      </svg>
    ),
    text: "Secured 3rd Prize in Karate Competitions – District Level",
  },
];

export default function AchievementsSection() {
  return (
    <section className="portfolio-section" id="achievements" aria-label="Achievements">
      <div className="section-header reveal">
        <span className="section-eyebrow">Recognition</span>
        <h2 className="section-title">Awards &amp; Achievements</h2>
      </div>

      <div className="achievement-list">
        {ACHIEVEMENTS_DATA.map((item) => (
          <div key={item.id} className="achievement-item reveal">
            <span className="highlight">{item.icon}</span>
            <span>{item.text}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
