/* ============================================
   smellsbased — Cosmic Interactive Engine
   ============================================ */

(function() {
  'use strict';

  // ── Loading Screen ──────────────────────────
  const loader = document.getElementById('loader');
  window.addEventListener('load', () => {
    setTimeout(() => {
      loader.classList.add('hidden');
      document.body.style.overflow = '';
      initAnimations();
    }, 800);
  });

  // Prevent scroll during load
  document.body.style.overflow = 'hidden';

  // ── Star Field (Canvas) ─────────────────────
  const starCanvas = document.getElementById('starfield');
  const starCtx = starCanvas.getContext('2d');
  let stars = [];
  let shootingStars = [];

  function resizeStarfield() {
    starCanvas.width = window.innerWidth;
    starCanvas.height = window.innerHeight;
  }

  function createStars() {
    stars = [];
    const count = Math.floor((window.innerWidth * window.innerHeight) / 3000);
    for (let i = 0; i < count; i++) {
      stars.push({
        x: Math.random() * starCanvas.width,
        y: Math.random() * starCanvas.height,
        radius: Math.random() * 1.5 + 0.3,
        opacity: Math.random() * 0.8 + 0.2,
        twinkleSpeed: Math.random() * 0.02 + 0.005,
        twinkleOffset: Math.random() * Math.PI * 2,
      });
    }
  }

  function createShootingStar() {
    if (shootingStars.length > 2) return;
    shootingStars.push({
      x: Math.random() * starCanvas.width,
      y: Math.random() * starCanvas.height * 0.5,
      length: Math.random() * 80 + 40,
      speed: Math.random() * 8 + 4,
      angle: Math.PI / 4 + (Math.random() - 0.5) * 0.3,
      opacity: 1,
      decay: Math.random() * 0.02 + 0.01,
    });
  }

  let starTime = 0;
  function animateStars() {
    starCtx.clearRect(0, 0, starCanvas.width, starCanvas.height);
    starTime += 0.016;

    // Draw stars
    stars.forEach(star => {
      const twinkle = Math.sin(starTime * star.twinkleSpeed * 60 + star.twinkleOffset) * 0.5 + 0.5;
      const alpha = star.opacity * (0.4 + twinkle * 0.6);
      starCtx.beginPath();
      starCtx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
      starCtx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
      starCtx.fill();
    });

    // Draw shooting stars
    shootingStars.forEach((ss, i) => {
      ss.x += Math.cos(ss.angle) * ss.speed;
      ss.y += Math.sin(ss.angle) * ss.speed;
      ss.opacity -= ss.decay;

      if (ss.opacity <= 0) {
        shootingStars.splice(i, 1);
        return;
      }

      const tailX = ss.x - Math.cos(ss.angle) * ss.length;
      const tailY = ss.y - Math.sin(ss.angle) * ss.length;

      const grad = starCtx.createLinearGradient(tailX, tailY, ss.x, ss.y);
      grad.addColorStop(0, `rgba(255, 255, 255, 0)`);
      grad.addColorStop(1, `rgba(255, 255, 255, ${ss.opacity})`);

      starCtx.beginPath();
      starCtx.moveTo(tailX, tailY);
      starCtx.lineTo(ss.x, ss.y);
      starCtx.strokeStyle = grad;
      starCtx.lineWidth = 1.5;
      starCtx.stroke();
    });

    requestAnimationFrame(animateStars);
  }

  // Random shooting stars
  setInterval(() => {
    if (Math.random() > 0.6) createShootingStar();
  }, 3000);

  resizeStarfield();
  createStars();
  animateStars();
  window.addEventListener('resize', () => {
    resizeStarfield();
    createStars();
  });

  // ── Parallax Stars on Scroll ────────────────
  let scrollY = 0;
  window.addEventListener('scroll', () => {
    scrollY = window.pageYOffset;
    starCanvas.style.transform = `translateY(${scrollY * 0.3}px)`;
  });

  // ── Cursor Glow Trail ───────────────────────
  const cursorCanvas = document.getElementById('cursor-canvas');
  const cursorCtx = cursorCanvas.getContext('2d');
  let mouseX = -100, mouseY = -100;
  let cursorTrail = [];

  function resizeCursorCanvas() {
    cursorCanvas.width = window.innerWidth;
    cursorCanvas.height = window.innerHeight;
  }

  resizeCursorCanvas();
  window.addEventListener('resize', resizeCursorCanvas);

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursorTrail.push({ x: mouseX, y: mouseY, alpha: 0.4, radius: 3 });
    if (cursorTrail.length > 20) cursorTrail.shift();
  });

  function animateCursor() {
    cursorCtx.clearRect(0, 0, cursorCanvas.width, cursorCanvas.height);

    cursorTrail.forEach((point, i) => {
      point.alpha -= 0.02;
      point.radius *= 0.97;
      if (point.alpha <= 0) return;

      cursorCtx.beginPath();
      cursorCtx.arc(point.x, point.y, point.radius, 0, Math.PI * 2);
      cursorCtx.fillStyle = `rgba(255, 255, 255, ${point.alpha})`;
      cursorCtx.fill();
    });

    // Soft glow around cursor
    const glow = cursorCtx.createRadialGradient(mouseX, mouseY, 0, mouseX, mouseY, 60);
    glow.addColorStop(0, 'rgba(255, 255, 255, 0.03)');
    glow.addColorStop(1, 'rgba(255, 255, 255, 0)');
    cursorCtx.beginPath();
    cursorCtx.arc(mouseX, mouseY, 60, 0, Math.PI * 2);
    cursorCtx.fillStyle = glow;
    cursorCtx.fill();

    // Clean dead trail points
    cursorTrail = cursorTrail.filter(p => p.alpha > 0);

    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  // ── Nav Scroll Effect ───────────────────────
  const nav = document.getElementById('nav');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 80) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  });

  // ── Scroll Reveal ───────────────────────────
  function initAnimations() {
    const revealElements = document.querySelectorAll('[data-reveal]');

    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          // Stagger the animation
          const delay = Array.from(revealElements).indexOf(entry.target) * 150;
          setTimeout(() => {
            entry.target.classList.add('visible');
          }, delay);
          revealObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -60px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  }

  // ── Magnetic Hover Effect ───────────────────
  const magneticElements = document.querySelectorAll('[data-magnetic]');

  magneticElements.forEach(el => {
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      el.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
    });

    el.addEventListener('mouseleave', () => {
      el.style.transform = 'translate(0, 0)';
    });
  });

  // ── Smooth Scroll for Anchor Links ──────────
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ── Active Nav Link ─────────────────────────
  const navLinks = document.querySelectorAll('.nav-links a');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');
    });
  });

})();
