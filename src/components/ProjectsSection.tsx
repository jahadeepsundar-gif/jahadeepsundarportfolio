"use client";

import React from "react";

export interface ProjectItem {
  id: string;
  num: string;
  title: string;
  description: string;
  tags: string[];
  githubUrl: string;
}

const PROJECTS_DATA: ProjectItem[] = [
  {
    id: "proj-1",
    num: "01",
    title: "Students Report Card",
    description:
      "Developed a report card management tool to efficiently handle student grades, automate calculations, and maintain organized records.",
    tags: ["Python", "MySQL"],
    githubUrl: "https://github.com/jahadeepsundar-gif",
  },
  {
    id: "proj-2",
    num: "02",
    title: "Ticket Booking System",
    description:
      "Developed the core logic for seat selection and booking confirmation, enabling seamless reservation management and real-time updates.",
    tags: ["Python", "MySQL"],
    githubUrl: "https://github.com/jahadeepsundar-gif",
  },
  {
    id: "proj-3",
    num: "03",
    title: "Branch Renewal List Mgmt",
    description:
      "Organized unordered branch renewal data into structured Excel sheets, enhancing clarity and efficiency in processing at Star Health.",
    tags: ["Excel", "MySQL"],
    githubUrl: "https://github.com/jahadeepsundar-gif",
  },
];

export default function ProjectsSection() {
  return (
    <section className="portfolio-section" id="projects" aria-label="Projects">
      <div className="section-header reveal">
        <span className="section-eyebrow">What I&apos;ve Built</span>
        <h2 className="section-title">Projects</h2>
      </div>

      <div className="project-grid">
        {PROJECTS_DATA.map((project) => (
          <div key={project.id} className="project-card reveal">
            <span className="project-num">{project.num}</span>
            <h3>{project.title}</h3>
            <p>{project.description}</p>
            <div className="project-tags">
              {project.tags.map((tag) => (
                <span key={tag} className="tag">
                  {tag}
                </span>
              ))}
            </div>
            <div className="project-links">
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                id={`${project.id}-github`}
                aria-label={`View ${project.title} on GitHub`}
              >
                GitHub ↗
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
