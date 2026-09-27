"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { INTRO_PLAYED_KEY } from "./introStorage";

/* =========================================================================
   INTRO SPLASH (~10s, GSAP) — plays once per browser session
   Built on the site's own cream grid paper so it blends into the homepage.

   Timeline:
   0.0s        Caption fades in ("Let's cook something different!")
   0.0 - 0.35  Small "x" rotates into a "+" crosshair at the centre
   0.4 - 0.75  Solid guide lines draw in from the top and left edges
   0.8 - 1.1   Guides turn dashed and extend across the whole screen
   1.25 - 1.65 Each guide splits in two, framing a text box
   1.6 - 1.85  "Hello" grows into the box
   2.1 - 2.4   Guides fade; "Hello" blurs into "I'm"
   2.95 - 3.65 Name slams in while the paper pinches into an eye shape
   3.66 - 4.02 Name letters collapse into the centre...
   4.0 - 4.6   ...and become an iris that pops open
   4.55 - 5.0  Iris turns red
   4.95 - 5.25 Eye glances left and squints
   5.2 - 5.7   Pupil dilates until it swallows the screen (black)
   5.4 - 8.3   "YOUR" pops in, "CREATIVE" (red) focuses in,
               rotator: EDITOR -> DESIGNER -> PARTNER
   8.6 - 9.45  Line settles and fades
   9.3 - 10.1  Black closes like an iris onto the homepage
   ========================================================================= */

export interface IntroSplashProps {
  /** Callback fired when exit begins to reveal homepage */
  onStartFade?: () => void;
  /** Callback fired when sequence fully finishes and unmounts */
  onComplete?: () => void;
}

const CAPTION = "Let's cook something different!";
const NAME = "JAHADEEP SUNDAR";
const ROLES = ["EDITOR", "DESIGNER", "PARTNER"] as const;
const ACCENT = "#EA0808";
const INK = "#101010";

function shouldSkipIntro(): boolean {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return true;
  try {
    return sessionStorage.getItem(INTRO_PLAYED_KEY) === "1";
  } catch {
    return false;
  }
}

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export default function IntroSplash({ onStartFade, onComplete }: IntroSplashProps) {
  // Rendered client-only (dynamic ssr:false in page.tsx), so reading storage here is safe
  const [skip] = useState<boolean>(shouldSkipIntro);
  const [visible, setVisible] = useState<boolean>(true);

  const rootRef = useRef<HTMLDivElement>(null);
  const paperRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const eyePosRef = useRef<SVGGElement>(null);
  const eyeScaleRef = useRef<SVGGElement>(null);
  const irisRef = useRef<SVGCircleElement>(null);
  const pupilRef = useRef<SVGCircleElement>(null);
  const glintRef = useRef<SVGCircleElement>(null);
  const helloRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLDivElement>(null);
  const skipRef = useRef<() => void>(() => {});

  const callbacksRef = useRef({ onStartFade, onComplete });
  useEffect(() => {
    callbacksRef.current = { onStartFade, onComplete };
  });

  useEffect(() => {
    if (skip) {
      callbacksRef.current.onStartFade?.();
      callbacksRef.current.onComplete?.();
      return;
    }

    const root = rootRef.current;
    const paper = paperRef.current;
    const svg = svgRef.current;
    if (!root || !paper || !svg) return;

    try {
      sessionStorage.setItem(INTRO_PLAYED_KEY, "1");
    } catch {
      /* storage blocked — intro will simply play again next time */
    }

    let cancelled = false;
    let started = false;
    let finished = false;
    let ctx: gsap.Context | undefined;
    let skipGuard: number | undefined;

    const finish = () => {
      if (finished) return;
      finished = true;
      setVisible(false);
      callbacksRef.current.onComplete?.();
    };

    // Skip pressed before the timeline is built (fonts still loading): leave at once
    skipRef.current = () => {
      cancelled = true;
      callbacksRef.current.onStartFade?.();
      finish();
    };

    // Close the black "iris" onto the homepage — used by the timeline and by Skip
    const closeOnto = (tl: gsap.core.Timeline, at: number | string, duration: number) => {
      tl.add(() => callbacksRef.current.onStartFade?.(), at);
      tl.fromTo(
        root,
        { clipPath: "circle(100% at 50% 50%)" },
        { clipPath: "circle(0% at 50% 50%)", duration, ease: "power3.inOut" },
        at
      );
    };

    const build = () => {
      if (cancelled || started) return;
      started = true;

      ctx = gsap.context(() => {
        const q = gsap.utils.selector(root);
        const vw = window.innerWidth;
        const vh = window.innerHeight;
        const cx = vw / 2;
        const cy = vh / 2;

        /* ---------- Eye geometry (px) ---------- */
        const W = Math.min(vw * 0.94, 1180);
        const H = Math.min(W / 2.3, vh * 0.62);
        const L = cx - W / 2;
        const R = cx + W / 2;
        // Cubic control offset that puts the lens apex exactly H/2 from centre
        const K = (H / 2) / 0.75;

        const lens = { p: 0, squint: 0 };
        const drawLens = () => {
          const { p, squint } = lens;
          const k = K * (1 - 0.3 * squint);
          const pts = [
            // [rectX, rectY, lensX, lensY]
            [0, 0, L, cy],
            [vw * 0.33, 0, L + 0.3 * W, cy - k],
            [vw * 0.67, 0, R - 0.3 * W, cy - k],
            [vw, 0, R, cy],
            [vw, vh, R, cy],
            [vw * 0.67, vh, R - 0.3 * W, cy + k],
            [vw * 0.33, vh, L + 0.3 * W, cy + k],
            [0, vh, L, cy],
          ].map(([ax, ay, bx, by]) => `${lerp(ax, bx, p).toFixed(1)},${lerp(ay, by, p).toFixed(1)}`);
          paper.style.clipPath = `path("M${pts[0]} C${pts[1]} ${pts[2]} ${pts[3]} L${pts[4]} C${pts[5]} ${pts[6]} ${pts[7]} Z")`;
        };
        drawLens();

        const Ro = H * 0.37;
        const Ri = H * 0.29;
        const Rp = H * 0.12;
        svg.setAttribute("viewBox", `0 0 ${vw} ${vh}`);
        gsap.set(q(".intro-eye-ring"), { attr: { r: Ro } });
        gsap.set(irisRef.current, { attr: { r: Ri }, fill: "#bdb6b3" });
        gsap.set(pupilRef.current, { attr: { r: Rp } });
        gsap.set(glintRef.current, { attr: { r: H * 0.07, cx: Ri * 0.42, cy: -Ri * 0.5 } });
        gsap.set(eyePosRef.current, { x: cx, y: cy });
        gsap.set(eyeScaleRef.current, { scale: 0, transformOrigin: "50% 50%" });

        /* ---------- Text measurements ---------- */
        const helloBox = helloRef.current!.getBoundingClientRect();
        const boxW = helloBox.width + helloBox.height * 0.35;
        const boxH = helloBox.height * 0.95;

        const nameLetters = q<HTMLSpanElement>(".intro-name-letter");
        const letterOffsets = nameLetters.map((el) => {
          const r = el.getBoundingClientRect();
          return cx - (r.left + r.width / 2);
        });

        /* ---------- Initial states ---------- */
        gsap.set(q(".intro-caption"), { opacity: 0, y: -6 });
        gsap.set(q(".intro-plus"), { opacity: 0, rotation: 45, scale: 0.4 });
        gsap.set(q(".intro-half-v"), { scaleY: 0 });
        gsap.set(q(".intro-half-h"), { scaleX: 0 });
        gsap.set(q(".intro-dash"), { opacity: 0 });
        gsap.set(q(".intro-dash-v"), { scaleY: 0.3 });
        gsap.set(q(".intro-dash-h"), { scaleX: 0.3 });
        gsap.set(q(".intro-hello, .intro-im"), { opacity: 0 });
        gsap.set(nameRef.current, { opacity: 0, scale: 1.2 });
        gsap.set(q(".intro-your-letter"), { opacity: 0, yPercent: 45, scale: 0.4 });
        gsap.set(q(".intro-creative"), { opacity: 0, scale: 0.7, filter: "blur(12px)" });
        gsap.set(q(".intro-role"), { opacity: 0 });

        const tl = gsap.timeline({ onComplete: finish });
        skipRef.current = () => {
          tl.kill();
          // Reveal the page right away; the timer guarantees we finish even if
          // animation frames are throttled (e.g. tab hidden mid-intro)
          callbacksRef.current.onStartFade?.();
          gsap.fromTo(
            root,
            { clipPath: "circle(100% at 50% 50%)" },
            { clipPath: "circle(0% at 50% 50%)", duration: 0.7, ease: "power3.inOut", onComplete: finish }
          );
          skipGuard = window.setTimeout(finish, 800);
        };

        // Soft light drifting across the paper, like the reference's fabric shadows
        gsap.fromTo(
          q(".intro-paper-shade"),
          { backgroundPosition: "0% 0%" },
          { backgroundPosition: "100% 100%", duration: 6, ease: "sine.inOut" }
        );

        /* ---------- 0.0 – 2.95: crosshair, guides, Hello / I'm ---------- */
        tl.to(q(".intro-caption"), { opacity: 1, y: 0, duration: 0.35, ease: "power2.out" }, 0);
        tl.to(q(".intro-plus"), { opacity: 1, rotation: 0, scale: 1, duration: 0.35, ease: "back.out(2)" }, 0.05);
        tl.to(q(".intro-half-v"), { scaleY: 1, duration: 0.35, ease: "power2.inOut" }, 0.4);
        tl.to(q(".intro-half-h"), { scaleX: 1, duration: 0.35, ease: "power2.inOut" }, 0.45);

        tl.to(q(".intro-half-v, .intro-half-h, .intro-plus"), { opacity: 0, duration: 0.12 }, 0.8);
        tl.to(q(".intro-dash"), { opacity: 1, duration: 0.1 }, 0.8);
        tl.to(q(".intro-dash-v"), { scaleY: 1, duration: 0.3, ease: "power2.out" }, 0.8);
        tl.to(q(".intro-dash-h"), { scaleX: 1, duration: 0.3, ease: "power2.out" }, 0.8);

        tl.to(q(".intro-dash-v1"), { x: -boxW / 2, duration: 0.4, ease: "power3.inOut" }, 1.25);
        tl.to(q(".intro-dash-v2"), { x: boxW / 2, duration: 0.4, ease: "power3.inOut" }, 1.25);
        tl.to(q(".intro-dash-h1"), { y: -boxH / 2, duration: 0.4, ease: "power3.inOut" }, 1.3);
        tl.to(q(".intro-dash-h2"), { y: boxH / 2, duration: 0.4, ease: "power3.inOut" }, 1.3);

        tl.fromTo(
          q(".intro-hello"),
          { opacity: 0, scale: 0.35 },
          { opacity: 1, scale: 1, duration: 0.3, ease: "power3.out" },
          1.6
        );

        tl.to(q(".intro-dash"), { opacity: 0, duration: 0.25, ease: "power1.out" }, 2.05);
        tl.to(q(".intro-hello"), { opacity: 0, filter: "blur(10px)", duration: 0.2, ease: "power1.in" }, 2.12);
        tl.fromTo(
          q(".intro-im"),
          { opacity: 0, filter: "blur(10px)" },
          { opacity: 1, filter: "blur(0px)", duration: 0.25, ease: "power2.out" },
          2.15
        );
        tl.to(q(".intro-im"), { opacity: 0, filter: "blur(10px)", duration: 0.2, ease: "power1.in" }, 2.75);

        /* ---------- 2.95 – 4.05: name + eye pinch + collapse ---------- */
        tl.to(nameRef.current, { opacity: 1, scale: 1, duration: 0.35, ease: "back.out(1.6)" }, 2.95);
        tl.to(lens, { p: 1, duration: 0.7, ease: "power2.inOut", onUpdate: drawLens }, 2.95);

        nameLetters.forEach((el, i) => {
          tl.to(
            el,
            { x: letterOffsets[i] * 0.94, scaleX: 0.55, duration: 0.36, ease: "power2.in" },
            3.66
          );
        });
        tl.to(nameRef.current, { opacity: 0, duration: 0.1 }, 4.0);

        /* ---------- 4.0 – 5.7: iris, red, glance, dilate ---------- */
        tl.to(eyeScaleRef.current, { scale: 0.5, duration: 0.18, ease: "power2.out" }, 4.0);
        tl.to(eyeScaleRef.current, { scale: 1, duration: 0.42, ease: "back.out(1.7)" }, 4.18);
        tl.to(irisRef.current, { fill: "#d98080", duration: 0.2, ease: "none" }, 4.55);
        tl.to(irisRef.current, { fill: ACCENT, duration: 0.25, ease: "none" }, 4.75);

        tl.to(eyePosRef.current, { x: cx - W * 0.2, duration: 0.3, ease: "power2.inOut" }, 4.95);
        tl.to(lens, { squint: 1, duration: 0.3, ease: "power2.inOut", onUpdate: drawLens }, 4.95);

        tl.to(pupilRef.current, { attr: { r: Ri * 0.93 }, duration: 0.15, ease: "power2.in" }, 5.2);
        tl.to(glintRef.current, { opacity: 0, duration: 0.08 }, 5.3);
        tl.to(
          pupilRef.current,
          { attr: { r: Math.hypot(vw, vh) * 1.1 }, duration: 0.35, ease: "power2.in" },
          5.35
        );

        /* ---------- 5.4 – 8.3: YOUR CREATIVE <role> ---------- */
        tl.to(
          q(".intro-your-letter"),
          { opacity: 1, yPercent: 0, scale: 1, duration: 0.35, ease: "back.out(2.4)", stagger: 0.12 },
          5.42
        );
        tl.to(
          q(".intro-creative"),
          { opacity: 1, scale: 1, filter: "blur(0px)", duration: 0.4, ease: "power3.out" },
          6.05
        );

        const [editor, designer, partner] = q(".intro-role");
        tl.fromTo(editor, { opacity: 0, x: 30 }, { opacity: 1, x: 0, duration: 0.25, ease: "power3.out" }, 6.75);

        tl.to(editor, { yPercent: -110, opacity: 0.3, duration: 0.25, ease: "power2.inOut" }, 7.1);
        tl.fromTo(designer, { opacity: 0, yPercent: 110 }, { opacity: 1, yPercent: 0, duration: 0.25, ease: "power2.inOut" }, 7.1);
        tl.to(editor, { opacity: 0, duration: 0.2 }, 7.4);

        tl.to(designer, { yPercent: -110, opacity: 0.3, duration: 0.25, ease: "power2.inOut" }, 7.75);
        tl.fromTo(partner, { opacity: 0, yPercent: 110 }, { opacity: 1, yPercent: 0, duration: 0.25, ease: "power2.inOut" }, 7.75);
        tl.to(designer, { opacity: 0, duration: 0.2 }, 8.05);

        /* ---------- 8.6 – 10.1: settle, fade, close onto the site ---------- */
        tl.to(q(".intro-tagline"), { scale: 0.82, duration: 0.6, ease: "power2.inOut" }, 8.6);
        tl.to(q(".intro-tagline, .intro-caption"), { opacity: 0, duration: 0.35, ease: "power1.in" }, 9.1);
        closeOnto(tl, 9.3, 0.8);
      }, root);
    };

    // Wait for the display fonts so nothing re-flows mid-animation (capped at 1.5s)
    Promise.race([document.fonts.ready, new Promise((r) => setTimeout(r, 1500))]).then(build);

    return () => {
      cancelled = true;
      window.clearTimeout(skipGuard);
      ctx?.revert();
      skipRef.current = () => {};
    };
  }, [skip]);

  if (skip || !visible) return null;

  return (
    <div ref={rootRef} className="splash-screen-overlay intro-live" role="status" aria-label="Intro animation">
      {/* Cream grid paper — pinches into the eye shape */}
      <div ref={paperRef} className="intro-paper">
        <div className="intro-paper-shade" />

        <div className="intro-plus" />
        <div className="intro-half-v" />
        <div className="intro-half-h" />
        <div className="intro-dash intro-dash-v intro-dash-v1" />
        <div className="intro-dash intro-dash-v intro-dash-v2" />
        <div className="intro-dash intro-dash-h intro-dash-h1" />
        <div className="intro-dash intro-dash-h intro-dash-h2" />

        <div ref={helloRef} className="intro-word intro-hello">Hello</div>
        <div className="intro-word intro-im">I&apos;m</div>

        <div ref={nameRef} className="intro-name" aria-label={NAME}>
          {NAME.split("").map((ch, i) => (
            <span key={i} className="intro-name-letter" aria-hidden="true">
              {ch === " " ? " " : ch}
            </span>
          ))}
        </div>
      </div>

      {/* Iris + pupil (the pupil grows to swallow the screen) */}
      <svg ref={svgRef} className="intro-eye" aria-hidden="true">
        <g ref={eyePosRef}>
          <g ref={eyeScaleRef}>
            <circle className="intro-eye-ring" cx="0" cy="0" r="0" fill={INK} />
            <circle ref={irisRef} cx="0" cy="0" r="0" />
            <circle ref={pupilRef} cx="0" cy="0" r="0" fill={INK} />
            <circle ref={glintRef} cx="0" cy="0" r="0" fill="#FFFFFF" />
          </g>
        </g>
      </svg>

      <div className="intro-tagline">
        <span className="intro-your">
          {"YOUR".split("").map((ch, i) => (
            <span key={i} className="intro-your-letter">
              {ch}
            </span>
          ))}
        </span>
        <span className="intro-creative">CREATIVE</span>
        <span className="intro-roles">
          <span className="intro-roles-sizer" aria-hidden="true">
            DESIGNER
          </span>
          {ROLES.map((role) => (
            <span key={role} className="intro-role">
              {role}
            </span>
          ))}
        </span>
      </div>

      <div className="intro-caption">{CAPTION}</div>

      <button type="button" className="intro-skip" onClick={() => skipRef.current()}>
        Skip intro
      </button>
    </div>
  );
}
