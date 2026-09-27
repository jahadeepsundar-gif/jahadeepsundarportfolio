"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

/* =========================================================================
   MOTION LAYER — additive animation layer for the whole page.

   Everything here is layered ON TOP of the existing sections without
   changing their markup, styles or existing animations:
   - Uses only data-attributes, CSS custom properties and the independent
     `translate` / `rotate` / `scale` properties, so it never overrides the
     `transform` / `transition` values the existing CSS and GSAP code use.
   - Elements animated by Hero's GSAP timeline are never touched directly.
   - All styles live in app/motion.css and are gated behind html[data-motion],
     which is only set here — so with JS off or reduced motion, nothing changes.

   Features: scroll-progress ink line, custom cursor, in-view triggers,
   hero scroll + pointer parallax, velocity-reactive marquee, banner portrait
   parallax, experience-timeline progress thread, 3D tilt + grid spotlight
   cards, magnetic buttons, and an ink-curtain transition for navbar links.
   ========================================================================= */

const SECTION_LABELS: Record<string, string> = {
  home: "Home",
  about: "About",
  projects: "Projects",
  experience: "Experience",
  achievements: "Achievements",
  connect: "Connect",
};

// Elements that get data-m-in once they scroll into view (see motion.css)
const IN_VIEW_TARGETS = [
  ".section-header",
  ".section-title",
  ".heading-hello",
  ".heading-education",
  ".heading-skills",
  ".heading-experience",
  ".project-card",
  ".timeline-item",
  ".achievement-item",
  ".contact-form-container",
  ".footer",
].join(",");

const TILT_TARGETS = ".project-card, .skill-app-squircle";
const MAGNETIC_TARGETS = ".social-icon, .cta-button";

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

interface TiltState {
  el: HTMLElement;
  max: number;
  tx: number; // target tilt (deg) around the X axis
  ty: number; // target tilt (deg) around the Y axis
  x: number;
  y: number;
}

interface MagnetState {
  el: HTMLElement;
  tx: number;
  ty: number;
  x: number;
  y: number;
}

export default function MotionLayer() {
  const progressRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const curtainRef = useRef<HTMLDivElement>(null);
  const curtainLabelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const html = document.documentElement;
    html.setAttribute("data-motion", "");
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const cleanups: Array<() => void> = [];
    const touched = new Set<HTMLElement>();

    /* ---------- In-view triggers (fire once) ----------
       Checked in the main loop rather than with an IntersectionObserver so that
       anything jumped past (fast scroll, nav transition, reload mid-page) is also
       marked — otherwise headings above the viewport would stay hidden. */
    let pendingInView = Array.from(document.querySelectorAll<HTMLElement>(IN_VIEW_TARGETS));

    /* ---------- Cached elements ---------- */
    const heroStage = document.querySelector<HTMLElement>(".hero-stage");
    const heroVideo = document.querySelector<HTMLElement>(".hero-video-bg");
    const heroAvatarImg = document.querySelector<HTMLElement>(".hero-avatar-img");
    const banner = document.querySelector<HTMLElement>(".transitional-banner-section");
    const marquee = document.querySelector<HTMLElement>(".banner-marquee-container");
    const marqueeTrack = document.querySelector<HTMLElement>(".banner-marquee-track");
    const portrait = document.querySelector<HTMLElement>(".banner-portrait-wrapper");
    const timelines = Array.from(document.querySelectorAll<HTMLElement>(".timeline"));
    [heroStage, heroVideo, heroAvatarImg, marquee, portrait, ...timelines].forEach(
      (el) => el && touched.add(el)
    );

    /* ---------- Pointer tracking ---------- */
    const pointer = { x: window.innerWidth / 2, y: window.innerHeight / 2, active: false };
    const cursor = { dx: pointer.x, dy: pointer.y, rx: pointer.x, ry: pointer.y };
    const heroTilt = { x: 0, y: 0 };

    const onPointerMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      pointer.x = e.clientX;
      pointer.y = e.clientY;
      if (!pointer.active) {
        pointer.active = true;
        cursor.dx = cursor.rx = e.clientX;
        cursor.dy = cursor.ry = e.clientY;
        html.setAttribute("data-motion-cursor", "");
      }
    };
    const onPointerLeaveWindow = () => {
      pointer.active = false;
      html.removeAttribute("data-motion-cursor");
    };

    /* ---------- Custom cursor states ---------- */
    const ring = ringRef.current;
    const onPointerOver = (e: PointerEvent) => {
      if (!ring) return;
      const t = e.target as Element | null;
      if (!t || !t.closest) return;
      if (t.closest("input, textarea")) ring.dataset.state = "text";
      else if (t.closest("a, button, [role='button'], label")) ring.dataset.state = "link";
      else if (t.closest(".project-card, .timeline-item, .achievement-item")) ring.dataset.state = "card";
      else ring.dataset.state = "";
    };
    const onPointerDown = () => ring?.setAttribute("data-press", "");
    const onPointerUp = () => ring?.removeAttribute("data-press");

    if (finePointer) {
      window.addEventListener("pointermove", onPointerMove, { passive: true });
      document.addEventListener("pointerover", onPointerOver, { passive: true });
      document.addEventListener("pointerdown", onPointerDown, { passive: true });
      document.addEventListener("pointerup", onPointerUp, { passive: true });
      document.documentElement.addEventListener("pointerleave", onPointerLeaveWindow);
      cleanups.push(() => {
        window.removeEventListener("pointermove", onPointerMove);
        document.removeEventListener("pointerover", onPointerOver);
        document.removeEventListener("pointerdown", onPointerDown);
        document.removeEventListener("pointerup", onPointerUp);
        document.documentElement.removeEventListener("pointerleave", onPointerLeaveWindow);
      });
    }

    /* ---------- 3D tilt + grid spotlight ---------- */
    const tilts: TiltState[] = [];
    if (finePointer) {
      document.querySelectorAll<HTMLElement>(TILT_TARGETS).forEach((el) => {
        const state: TiltState = {
          el,
          max: el.classList.contains("project-card") ? 7 : 14,
          tx: 0,
          ty: 0,
          x: 0,
          y: 0,
        };
        const move = (e: PointerEvent) => {
          const r = el.getBoundingClientRect();
          const px = (e.clientX - r.left) / r.width;
          const py = (e.clientY - r.top) / r.height;
          state.tx = (0.5 - py) * state.max;
          state.ty = (px - 0.5) * state.max;
          el.style.setProperty("--mx", `${(px * 100).toFixed(1)}%`);
          el.style.setProperty("--my", `${(py * 100).toFixed(1)}%`);
        };
        const leave = () => {
          state.tx = 0;
          state.ty = 0;
        };
        el.addEventListener("pointermove", move, { passive: true });
        el.addEventListener("pointerleave", leave, { passive: true });
        cleanups.push(() => {
          el.removeEventListener("pointermove", move);
          el.removeEventListener("pointerleave", leave);
        });
        tilts.push(state);
        touched.add(el);
      });
    }

    /* ---------- Magnetic buttons ---------- */
    const magnets: MagnetState[] = [];
    if (finePointer) {
      document.querySelectorAll<HTMLElement>(MAGNETIC_TARGETS).forEach((el) => {
        magnets.push({ el, tx: 0, ty: 0, x: 0, y: 0 });
        touched.add(el);
      });
    }

    /* ---------- Main loop ---------- */
    let lastScrollY = window.scrollY;
    let velocity = 0;
    let skew = 0;
    let lastRate = 1;
    let marqueeAnim: Animation | undefined;
    let raf = 0;

    const tick = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const y = window.scrollY;

      // Scroll progress ink line
      const max = document.documentElement.scrollHeight - vh;
      if (progressRef.current) {
        progressRef.current.style.transform = `scaleX(${max > 0 ? clamp(y / max, 0, 1) : 0})`;
      }

      // Reveal elements once their top passes 88% of the viewport (or they're above it)
      if (pendingInView.length) {
        pendingInView = pendingInView.filter((el) => {
          const r = el.getBoundingClientRect();
          if (r.height === 0 || r.top > vh * 0.88) return true;
          el.setAttribute("data-m-in", "");
          return false;
        });
      }

      // Smoothed scroll velocity (px / frame)
      velocity += (y - lastScrollY - velocity) * 0.12;
      lastScrollY = y;

      // Hero: stage drifts slower than the page and softens; video zooms gently
      const heroP = clamp(y / vh, 0, 1);
      if (heroStage) {
        heroStage.style.translate = `0 ${(heroP * vh * 0.2).toFixed(1)}px`;
        heroStage.style.opacity = `${(1 - heroP * 0.55).toFixed(3)}`;
      }
      if (heroVideo) heroVideo.style.scale = `${(1 + heroP * 0.08).toFixed(4)}`;

      // Hero avatar follows the pointer (fine pointers, while hero is on screen)
      if (heroAvatarImg && finePointer && heroP < 1) {
        const nx = pointer.active ? pointer.x / vw - 0.5 : 0;
        const ny = pointer.active ? pointer.y / vh - 0.5 : 0;
        heroTilt.x += (nx - heroTilt.x) * 0.08;
        heroTilt.y += (ny - heroTilt.y) * 0.08;
        heroAvatarImg.style.translate = `${(heroTilt.x * 18).toFixed(2)}px ${(heroTilt.y * 12).toFixed(2)}px`;
        heroAvatarImg.style.rotate = `${(heroTilt.x * 5).toFixed(2)}deg`;
      }

      // Marquee banner reacts to scroll speed: skews and speeds up, then settles
      if (banner && marquee) {
        const r = banner.getBoundingClientRect();
        if (r.bottom > 0 && r.top < vh) {
          skew += (clamp(velocity * 0.35, -9, 9) - skew) * 0.15;
          marquee.style.transform = `skewX(${(-skew).toFixed(2)}deg)`;

          if (!marqueeAnim && marqueeTrack) marqueeAnim = marqueeTrack.getAnimations()[0];
          const rate = 1 + Math.min(Math.abs(velocity) * 0.08, 3);
          if (marqueeAnim && Math.abs(rate - lastRate) > 0.01) {
            marqueeAnim.playbackRate = rate;
            lastRate = rate;
          }

          if (portrait) {
            const p = (r.top + r.height / 2 - vh / 2) / vh; // -0.5 .. 0.5 across the viewport
            portrait.style.translate = `0 ${(p * 50).toFixed(1)}px`;
          }
        }
      }

      // Experience timeline: red thread fills as you read down it
      timelines.forEach((tl) => {
        const r = tl.getBoundingClientRect();
        const p = clamp((vh * 0.62 - r.top) / r.height, 0, 1);
        tl.style.setProperty("--m-progress", p.toFixed(4));
      });

      // Tilt
      tilts.forEach((s) => {
        s.x += (s.tx - s.x) * 0.12;
        s.y += (s.ty - s.y) * 0.12;
        const angle = Math.hypot(s.x, s.y);
        s.el.style.rotate = angle < 0.02 ? "" : `${s.x.toFixed(3)} ${s.y.toFixed(3)} 0 ${angle.toFixed(3)}deg`;
      });

      // Magnetic pull toward the pointer when close
      magnets.forEach((m) => {
        if (pointer.active) {
          const r = m.el.getBoundingClientRect();
          const cx = r.left + r.width / 2;
          const cy = r.top + r.height / 2;
          const dx = pointer.x - cx;
          const dy = pointer.y - cy;
          const reach = Math.max(r.width, r.height) * 0.85 + 24;
          const inRange = r.width > 0 && Math.abs(dx) < reach && Math.abs(dy) < reach;
          m.tx = inRange ? dx * 0.28 : 0;
          m.ty = inRange ? dy * 0.38 : 0;
        } else {
          m.tx = 0;
          m.ty = 0;
        }
        m.x += (m.tx - m.x) * 0.16;
        m.y += (m.ty - m.y) * 0.16;
        m.el.style.translate = Math.abs(m.x) + Math.abs(m.y) < 0.05 ? "" : `${m.x.toFixed(2)}px ${m.y.toFixed(2)}px`;
      });

      // Cursor
      if (finePointer && dotRef.current && ringRef.current) {
        cursor.dx += (pointer.x - cursor.dx) * 0.5;
        cursor.dy += (pointer.y - cursor.dy) * 0.5;
        cursor.rx += (pointer.x - cursor.rx) * 0.16;
        cursor.ry += (pointer.y - cursor.ry) * 0.16;
        dotRef.current.style.transform = `translate3d(${cursor.dx}px, ${cursor.dy}px, 0)`;
        ringRef.current.style.transform = `translate3d(${cursor.rx}px, ${cursor.ry}px, 0)`;
      }

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    cleanups.push(() => cancelAnimationFrame(raf));

    /* ---------- Ink-curtain transition for navbar section links ---------- */
    const curtain = curtainRef.current;
    const curtainLabel = curtainLabelRef.current;
    let transitioning = false;

    const onNavClick = (e: MouseEvent) => {
      if (transitioning || e.defaultPrevented || e.button !== 0) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const link = (e.target as Element | null)?.closest?.<HTMLAnchorElement>("a[href^='#']");
      if (!link || !link.closest(".navbar") || !curtain || !curtainLabel) return;

      const id = link.getAttribute("href")!.slice(1);
      const target = id ? document.getElementById(id) : null;
      if (!target) return;

      // Stop Next's Link from jumping — the curtain does the navigation instead.
      // Link still runs its own onClick first (e.g. closing the mobile drawer).
      e.preventDefault();
      transitioning = true;
      curtainLabel.textContent = SECTION_LABELS[id] ?? id;

      const tl = gsap.timeline({
        onComplete: () => {
          transitioning = false;
          gsap.set(curtain, { visibility: "hidden" });
        },
      });
      tl.set(curtain, { visibility: "visible", clipPath: "inset(100% 0% 0% 0%)" });
      tl.to(curtain, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.5, ease: "power4.inOut" });
      tl.fromTo(
        curtainLabel,
        { yPercent: 110 },
        { yPercent: 0, duration: 0.45, ease: "power3.out" },
        0.22
      );
      tl.add(() => {
        const top = target.getBoundingClientRect().top + window.scrollY;
        window.scrollTo({ top, behavior: "instant" });
        if (location.hash !== `#${id}`) history.pushState(null, "", `#${id}`);
      }, 0.62);
      tl.to(curtainLabel, { yPercent: -110, duration: 0.35, ease: "power3.in" }, 0.72);
      tl.to(curtain, { clipPath: "inset(0% 0% 100% 0%)", duration: 0.55, ease: "power4.inOut" }, 0.8);
    };
    document.addEventListener("click", onNavClick, true);
    cleanups.push(() => document.removeEventListener("click", onNavClick, true));

    return () => {
      cleanups.forEach((fn) => fn());
      touched.forEach((el) => {
        el.style.translate = "";
        el.style.rotate = "";
        el.style.scale = "";
        el.style.removeProperty("--mx");
        el.style.removeProperty("--my");
        el.style.removeProperty("--m-progress");
      });
      if (heroStage) heroStage.style.opacity = "";
      if (marquee) marquee.style.transform = "";
      if (marqueeAnim) marqueeAnim.playbackRate = 1;
      html.removeAttribute("data-motion");
      html.removeAttribute("data-motion-cursor");
    };
  }, []);

  return (
    <>
      {/* Returning-visitor loader: pure CSS, only shown when the intro already played */}
      <div className="m-loader" aria-hidden="true">
        <span className="m-loader-name">
          <span>JAHADEEP SUNDAR S</span>
        </span>
        <span className="m-loader-bar" />
      </div>

      <div ref={progressRef} className="m-progress" aria-hidden="true" />

      <div ref={curtainRef} className="m-curtain" aria-hidden="true">
        <span className="m-curtain-label-wrap">
          <span ref={curtainLabelRef} className="m-curtain-label" />
          <span className="m-curtain-dot" />
        </span>
      </div>

      <div ref={ringRef} className="m-cursor-ring" aria-hidden="true" />
      <div ref={dotRef} className="m-cursor-dot" aria-hidden="true" />
    </>
  );
}
