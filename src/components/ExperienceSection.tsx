"use client";

import React from "react";

export interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  date: string;
  points: React.ReactNode[];
}

const EXPERIENCE_DATA: ExperienceItem[] = [
  {
    id: "exp-1",
    role: "Data Analytics Intern",
    company: "VDart",
    date: "1 Month Internship",
    points: [
      "Analyzed and cleaned datasets using Microsoft Excel and Power Query",
      "Built interactive dashboards using Microsoft Excel and Power BI",
      "Worked on the full data analytics process",
    ],
  },
  {
    id: "exp-2",
    role: "Insurance Support Assistant",
    company: "Star Health & Allied Insurance",
    date: "2022 – Present",
    points: [
      <>
        Logged 100+ policies in the Star Health web portal with high accuracy{" "}
        <em>(Volunteering)</em>
      </>,
      "Prepared and submitted 20+ claim forms, ensuring proper documentation and compliance",
      "Gained experience in insurance processes, claim settlements, troubleshooting & client support",
    ],
  },
  {
    id: "exp-3",
    role: "Secretary & Chairman",
    company: "Interact Club of Boiler Township",
    date: "2020 – 2021",
    points: [
      "Managed club activities, meetings, and records while contributing to social service projects",
      "As Chairman, led multiple events — overseeing planning & execution, building strong leadership and organizational skills",
    ],
  },
];

export default function ExperienceSection() {
  return (
    <section className="portfolio-section" id="experience" aria-label="Experience">
      <div className="section-header reveal">
        <span className="section-eyebrow">My Journey</span>
        <h2 className="section-title">Experience</h2>
      </div>

      <div className="timeline">
        {EXPERIENCE_DATA.map((item) => (
          <div key={item.id} className="timeline-item reveal">
            <h4>
              {item.role} · {item.company}
            </h4>
            <span className="date">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>{" "}
              {item.date}
            </span>
            <ul>
              {item.points.map((point, pIdx) => (
                <li key={pIdx}>{point}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
