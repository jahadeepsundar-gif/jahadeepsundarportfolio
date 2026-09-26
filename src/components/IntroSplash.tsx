"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";

/* =========================================================================
   GSAP INTRO SPLASH - PURE PLAIN TEXT ON SOLID BLACK (~6.8s Total Sequence)
   - "YOUR CREATIVE" stays pure white
   - Rotating words ("EDITOR" -> "DESIGNER" -> "PARTNER") are red #EA0808
   - Name "JAHADEEP SUNDAR" highlighted with red accent on surname

   Timeline:
   0.0s - 0.3s: Caption fades in ("Let's build something different.", stays visible)
   0.3s - 0.7s: "Hello" (bold white centered text) fades/scales in, holds until 1.1s
   1.1s - 1.5s: "I'm" swaps in replacing "Hello", holds until 1.9s
   1.9s - 2.3s: "JAHADEEP SUNDAR" (with "SUNDAR" in red accent + scale bounce pop), holds until 3.3s
   3.3s - 3.7s: Name text fades out
   3.7s:        "YOUR" appears instantly (white uppercase, left-aligned)
   3.8s - 4.3s: "CREATIVE" fades/slides in (white uppercase)
   4.3s - 4.5s: Word rotator: "EDITOR" (red #EA0808) slides up from below into position
   4.8s - 5.0s: Word rotator: "DESIGNER" (red #EA0808) slides up, "EDITOR" slides up/fades
   5.3s - 5.5s: Word rotator: "PARTNER" (red #EA0808) slides up, "DESIGNER" slides up/fades; settles
   6.2s - 6.8s: Exit crossfade (entire splash fades opacity 1->0; homepage reveals)
   ========================================================================= */

export interface IntroSplashProps {
  /** Top caption text (holds for entire sequence) */
  captionText?: string;
  /** Name text inside center stage */
  nameText?: string;
  /** Callback fired when exit fade begins to reveal homepage */
  onStartFade?: () => void;
  /** Callback fired when sequence fully finishes and unmounts */
  onComplete?: () => void;
}

const DEFAULT_CAPTION = "Let's build something different.";
const DEFAULT_NAME = "JAHADEEP SUNDAR";

export default function IntroSplash({
  captionText = DEFAULT_CAPTION,
  nameText = DEFAULT_NAME,
  onStartFade,
  onComplete,
}: IntroSplashProps) {
  const [mounted, setMounted] = useState<boolean>(false);
  const [visible, setVisible] = useState<boolean>(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const onStartFadeRef = useRef(onStartFade);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onStartFadeRef.current = onStartFade;
    onCompleteRef.current = onComplete;
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    // Respect prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      onStartFadeRef.current?.();
      onCompleteRef.current?.();
      setVisible(false);
      return;
    }

    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(containerRef);

      const captionEl = q(".splash-caption");
      const helloTextEl = q(".text-hello");
      const imTextEl = q(".text-im");
      const nameTextEl = q(".text-name");

      const headlineBoxEl = q(".splash-headline-box");
      const wordYourEl = q(".word-your");
      const wordCreativeEl = q(".word-creative");
      const wordEditorEl = q(".word-rotator-editor");
      const wordDesignerEl = q(".word-rotator-designer");
      const wordPartnerEl = q(".word-rotator-partner");

      // --- INITIAL GSAP STATES ---
      gsap.set(containerRef.current, { opacity: 1 });
      gsap.set(captionEl, { opacity: 0, y: -6 });
      gsap.set(helloTextEl, { opacity: 0, scale: 0.92 });
      gsap.set(imTextEl, { opacity: 0, scale: 0.92 });
      gsap.set(nameTextEl, { opacity: 0, scale: 1.14 });

      gsap.set(headlineBoxEl, { opacity: 0 });
      gsap.set(wordYourEl, { opacity: 0, x: 20 });
      gsap.set(wordCreativeEl, { opacity: 0, x: 20 });
      gsap.set(wordEditorEl, { opacity: 0, y: 35 });
      gsap.set(wordDesignerEl, { opacity: 0, y: 35 });
      gsap.set(wordPartnerEl, { opacity: 0, y: 35 });

      /* =========================================================================
         EXACT TIMELINE - GSAP TIMELINE (~6.8s Total Duration)
         ========================================================================= */
      const tl = gsap.timeline({
        onComplete: () => {
          setVisible(false);
          onCompleteRef.current?.();
        },
      });

      // -----------------------------------------------------------------------
      // 0.0s, Dur 0.3s -> Caption text (0->1, top-center, stays whole sequence)
      // -----------------------------------------------------------------------
      tl.fromTo(
        captionEl,
        { opacity: 0, y: -6 },
        { opacity: 1, y: 0, duration: 0.3, ease: "power2.out" },
        0.0
      );

      // -----------------------------------------------------------------------
      // 0.3s, Dur 0.4s -> "Hello" (bold white centered text)
      // -----------------------------------------------------------------------
      tl.fromTo(
        helloTextEl,
        { opacity: 0, scale: 0.92 },
        { opacity: 1, scale: 1.0, duration: 0.4, ease: "power2.out" },
        0.3
      );

      // -----------------------------------------------------------------------
      // 1.1s, Dur 0.4s -> "I'm" (swaps in replacing "Hello", same plain style)
      // -----------------------------------------------------------------------
      tl.to(
        helloTextEl,
        { opacity: 0, scale: 1.04, duration: 0.08, ease: "power2.in" },
        1.04
      );
      tl.fromTo(
        imTextEl,
        { opacity: 0, scale: 0.92 },
        { opacity: 1, scale: 1.0, duration: 0.4, ease: "power2.out" },
        1.1
      );

      // -----------------------------------------------------------------------
      // 1.9s, Dur 0.4s -> Name reveal with scale bounce pop & red accent on surname
      // -----------------------------------------------------------------------
      tl.to(
        imTextEl,
        { opacity: 0, scale: 1.04, duration: 0.08, ease: "power2.in" },
        1.84
      );
      tl.fromTo(
        nameTextEl,
        { opacity: 0, scale: 1.14 },
        { opacity: 1, scale: 1.0, duration: 0.4, ease: "back.out(1.8)" },
        1.9
      );

      // -----------------------------------------------------------------------
      // 3.3s, Dur 0.4s -> Name text fades out
      // -----------------------------------------------------------------------
      tl.to(
        nameTextEl,
        { opacity: 0, scale: 1.04, duration: 0.4, ease: "power2.inOut" },
        3.3
      );

      // -----------------------------------------------------------------------
      // 3.7s, instant -> "YOUR" (white, bold, uppercase, left-aligned)
      // -----------------------------------------------------------------------
      tl.set(headlineBoxEl, { opacity: 1 }, 3.7);
      tl.fromTo(
        wordYourEl,
        { opacity: 0, x: 20 },
        { opacity: 1, x: 0, duration: 0.08, ease: "power2.out" },
        3.7
      );

      // -----------------------------------------------------------------------
      // 3.8s–4.3s, Dur 0.5s -> "CREATIVE" (plain white, slides in cleanly)
      // -----------------------------------------------------------------------
      tl.fromTo(
        wordCreativeEl,
        { opacity: 0, x: 20 },
        { opacity: 1, x: 0, duration: 0.5, ease: "power2.out" },
        3.8
      );

      // -----------------------------------------------------------------------
      // 4.3s, Dur 0.2s -> Word rotator: "EDITOR" (red #EA0808, slides up)
      // -----------------------------------------------------------------------
      tl.fromTo(
        wordEditorEl,
        { y: 35, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.2, ease: "power3.out" },
        4.3
      );

      // -----------------------------------------------------------------------
      // 4.8s, Dur 0.2s -> Word rotator: "DESIGNER" (red #EA0808, slides up, EDITOR slides up/fades)
      // -----------------------------------------------------------------------
      tl.to(
        wordEditorEl,
        { y: -35, opacity: 0, duration: 0.16, ease: "power2.in" },
        4.8
      );
      tl.fromTo(
        wordDesignerEl,
        { y: 35, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.2, ease: "power3.out" },
        4.8
      );

      // -----------------------------------------------------------------------
      // 5.3s, Dur 0.2s -> Word rotator: "PARTNER" (red #EA0808, slides up, DESIGNER slides up/fades)
      // -----------------------------------------------------------------------
      tl.to(
        wordDesignerEl,
        { y: -35, opacity: 0, duration: 0.16, ease: "power2.in" },
        5.3
      );
      tl.fromTo(
        wordPartnerEl,
        { y: 35, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.2, ease: "power3.out" },
        5.3
      );

      // -----------------------------------------------------------------------
      // 6.2s–6.8s, Dur 0.6s -> Exit (entire splash fades opacity 1->0 together)
      // -----------------------------------------------------------------------
      tl.add(() => {
        onStartFadeRef.current?.();
      }, 6.2);

      tl.to(
        containerRef.current,
        { opacity: 0, duration: 0.6, ease: "power2.inOut" },
        6.2
      );
    }, containerRef);

    return () => {
      ctx.revert();
    };
  }, [mounted]);

  if (!visible) return null;

  if (!mounted) {
    return <div className="splash-screen-overlay" aria-hidden="true" />;
  }

  // Split name for red accent highlight on surname
  const nameParts = nameText.trim().split(" ");
  const firstName = nameParts.slice(0, -1).join(" ") || nameParts[0];
  const lastName = nameParts.length > 1 ? nameParts[nameParts.length - 1] : "";

  return (
    <div
      ref={containerRef}
      className="splash-screen-overlay"
      aria-label="Intro splash presentation"
      role="status"
    >
      {/* 0.0s - 6.2s: Top Caption */}
      <div className="splash-caption" style={{ opacity: 0 }}>
        {captionText}
      </div>

      {/* 0.3s - 3.7s: Plain Text Center Stage on Pure Solid Black */}
      <div className="splash-center-text-stage">
        <div className="splash-center-text text-hello" style={{ opacity: 0 }}>
          Hello
        </div>
        <div className="splash-center-text text-im" style={{ opacity: 0 }}>
          I&apos;m
        </div>
        <div
          className="splash-center-text text-name"
          style={{ opacity: 0, whiteSpace: "nowrap", flexWrap: "nowrap" }}
        >
          <span className="name-first" style={{ whiteSpace: "nowrap" }}>
            {firstName}
          </span>
          {lastName && (
            <span
              className="name-last name-accent"
              style={{ whiteSpace: "nowrap" }}
            >
              {lastName}
            </span>
          )}
        </div>
      </div>

      {/* 3.7s - 6.2s: Bold Uppercase Headline ("YOUR CREATIVE" in white + Red Word Rotator) */}
      <div className="splash-headline-box" style={{ opacity: 0 }}>
        {/* Line 1: "YOUR" + "CREATIVE" (both plain white) */}
        <div className="splash-headline-line line-1">
          <span className="splash-word word-your" style={{ opacity: 0 }}>
            YOUR
          </span>
          <span className="splash-word word-creative" style={{ opacity: 0 }}>
            CREATIVE
          </span>
        </div>

        {/* Line 2: Red Word Rotator ("EDITOR" -> "DESIGNER" -> "PARTNER" in #EA0808) */}
        <div className="splash-headline-line line-2">
          <div className="splash-rotator-wrapper">
            <span
              className="splash-word splash-word-accent word-rotator-editor"
              style={{ opacity: 0 }}
            >
              EDITOR
            </span>
            <span
              className="splash-word splash-word-accent word-rotator-designer"
              style={{ opacity: 0 }}
            >
              DESIGNER
            </span>
            <span
              className="splash-word splash-word-accent word-rotator-partner"
              style={{ opacity: 0 }}
            >
              PARTNER
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
