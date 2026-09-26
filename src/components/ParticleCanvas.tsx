"use client";

import { useEffect, useRef } from "react";

export default function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let W: number, H: number;
    const particles: Particle[] = [];
    const COUNT = window.innerWidth < 768 ? 40 : 85;
    const COLORS = [
      "rgba(255,42,75,", // Crimson Red
      "rgba(220,38,38,", // Deep Ruby Red
      "rgba(244,63,94,", // Rose Red Accent
      "rgba(255,255,255,", // Pure White Dot Accent
    ];

    function resize() {
      if (!canvas) return;
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener("resize", resize);

    class Particle {
      x!: number;
      y!: number;
      vx!: number;
      vy!: number;
      r!: number;
      o!: number;
      c!: string;

      constructor() {
        this.reset();
      }
      reset() {
        this.x = Math.random() * W;
        this.y = Math.random() * H;
        this.vx = (Math.random() - 0.5) * 0.35;
        this.vy = (Math.random() - 0.5) * 0.35;
        this.r = Math.random() * 2.2 + 0.5;
        this.o = Math.random() * 0.45 + 0.1;
        this.c = COLORS[Math.floor(Math.random() * COLORS.length)];
      }
      draw() {
        if (!ctx) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.fillStyle = this.c + this.o + ")";
        ctx.fill();
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
      }
    }

    for (let i = 0; i < COUNT; i++) particles.push(new Particle());

    function drawLines() {
      if (!ctx) return;
      const MAX_DIST = 130;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < MAX_DIST) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(255,42,75,${0.09 * (1 - d / MAX_DIST)})`;
            ctx.lineWidth = 0.65;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
    }

    let animationFrameId: number;
    function loop() {
      if (!ctx) return;
      ctx.clearRect(0, 0, W, H);
      drawLines();
      particles.forEach((p) => {
        p.update();
        p.draw();
      });
      animationFrameId = requestAnimationFrame(loop);
    }
    loop();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas id="particles-canvas" ref={canvasRef}></canvas>;
}
