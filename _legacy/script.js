/* ============================================================
   JAHADEEP SUNDAR — Professional Red & Black Theme Script
   - Crimson Particle canvas animation
   - Scroll-reveal observer
   - Navbar scroll effect
   - Typed-text animation
   ============================================================ */

/* ---- Particle Canvas ---- */
(function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H, particles = [];
  const COUNT = window.innerWidth < 768 ? 40 : 85;
  const COLORS = [
    'rgba(255,42,75,',   // Crimson Red
    'rgba(220,38,38,',   // Deep Ruby Red
    'rgba(244,63,94,',   // Rose Red Accent
    'rgba(255,255,255,'  // Pure White Dot Accent
  ];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x  = Math.random() * W;
      this.y  = Math.random() * H;
      this.vx = (Math.random() - 0.5) * 0.35;
      this.vy = (Math.random() - 0.5) * 0.35;
      this.r  = Math.random() * 2.2 + 0.5;
      this.o  = Math.random() * 0.45 + 0.1;
      this.c  = COLORS[Math.floor(Math.random() * COLORS.length)];
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = this.c + this.o + ')';
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
    const MAX_DIST = 130;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const d  = Math.sqrt(dx * dx + dy * dy);
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

  function loop() {
    ctx.clearRect(0, 0, W, H);
    drawLines();
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(loop);
  }
  loop();
})();

/* ---- Navbar scroll shrink ---- */
(function initNavbar() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;
  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      navbar.style.background = 'rgba(8,9,13,0.95)';
      navbar.style.boxShadow  = '0 4px 30px rgba(0,0,0,0.6)';
    } else {
      navbar.style.background = 'rgba(8,9,13,0.75)';
      navbar.style.boxShadow  = 'none';
    }
  }, { passive: true });
})();

/* ---- Scroll-reveal (IntersectionObserver) ---- */
(function initReveal() {
  const elements = document.querySelectorAll('.reveal');
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const siblings = entry.target.parentElement.querySelectorAll('.reveal');
        let idx = 0;
        siblings.forEach((el, si) => { if (el === entry.target) idx = si; });
        entry.target.style.transitionDelay = (idx * 0.1) + 's';
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  elements.forEach(el => observer.observe(el));
})();

/* ---- Typed / rotating subtitle ---- */
(function initTyped() {
  const roles = [
    'Jahadeep Sundar',
    'an MCA Student',
    'a Data Analytics Intern',
    'a Python Developer',
    'a MySQL Expert',
    'a Karate Black Belt',
  ];
  const el = document.getElementById('typed-name');
  if (!el) return;

  let roleIdx = 0, charIdx = 0, deleting = false;
  const typeSpeed   = 80;
  const deleteSpeed = 40;
  const pauseAfter  = 1800;

  function type() {
    const current = roles[roleIdx];
    if (deleting) {
      el.textContent = current.substring(0, charIdx - 1);
      charIdx--;
      if (charIdx === 0) {
        deleting = false;
        roleIdx  = (roleIdx + 1) % roles.length;
        setTimeout(type, 300);
        return;
      }
      setTimeout(type, deleteSpeed);
    } else {
      el.textContent = current.substring(0, charIdx + 1);
      charIdx++;
      if (charIdx === current.length) {
        deleting = true;
        setTimeout(type, pauseAfter);
        return;
      }
      setTimeout(type, typeSpeed);
    }
  }
  setTimeout(type, 1000);
})();

/* ---- Smooth active nav highlight ---- */
(function initActiveNav() {
  const links    = document.querySelectorAll('nav a');
  const sections = document.querySelectorAll('section[id], main[id]');
  if (!links.length || !sections.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        links.forEach(a => {
          a.style.color = a.getAttribute('href') === '#' + id
            ? 'var(--accent)'
            : '';
        });
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(s => observer.observe(s));
})();
