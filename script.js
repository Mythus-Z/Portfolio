// ─── PARTICLE CANVAS ───────────────────────────────────────────
(function () {
  const canvas = document.getElementById('particle-canvas');
  const ctx = canvas.getContext('2d');
  let W, H, particles = [];
  const PARTICLE_COUNT = 90;
  const mouse = { x: -9999, y: -9999 };

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function rand(min, max) { return Math.random() * (max - min) + min; }

  function createParticle() {
    return {
      x: rand(0, W),
      y: rand(0, H),
      vx: rand(-0.18, 0.18),
      vy: rand(-0.12, 0.12),
      r: rand(1, 2.5),
      alpha: rand(0.1, 0.5),
      alphaDir: rand(0.002, 0.006),
    };
  }

  function init() {
    resize();
    particles = Array.from({ length: PARTICLE_COUNT }, createParticle);
  }

  function drawParticle(p) {
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(30, 144, 255, ${p.alpha})`;
    ctx.fill();
  }

  function connectParticles() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 110) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(30, 144, 255, ${0.07 * (1 - dist / 110)})`;
          ctx.lineWidth = 0.5;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => {
      // Subtle mouse attraction
      const dx = mouse.x - p.x;
      const dy = mouse.y - p.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 200) {
        const force = (200 - dist) / 200 * 0.012;
        p.vx += dx / dist * force;
        p.vy += dy / dist * force;
      }

      // Damping
      p.vx *= 0.98;
      p.vy *= 0.98;

      // Clamp speed
      const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
      if (speed > 0.5) { p.vx = p.vx / speed * 0.5; p.vy = p.vy / speed * 0.5; }

      p.x += p.vx;
      p.y += p.vy;

      // Wrap
      if (p.x < 0) p.x = W;
      if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H;
      if (p.y > H) p.y = 0;

      // Pulse alpha
      p.alpha += p.alphaDir;
      if (p.alpha > 0.55 || p.alpha < 0.05) p.alphaDir *= -1;

      drawParticle(p);
    });
    connectParticles();
    requestAnimationFrame(animate);
  }

  window.addEventListener('resize', () => { resize(); });
  window.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });

  init();
  animate();
})();


// ─── HERO LETTER ANIMATION ─────────────────────────────────────
(function () {
  const title = document.querySelector('.hero-title');
  if (!title) return;
  const letters = title.querySelectorAll('.letter');
  letters.forEach((el, i) => {
    el.style.animation = `letterIn 0.55s cubic-bezier(0.22, 1, 0.36, 1) ${0.4 + i * 0.08}s forwards`;
  });
})();


// ─── NAVBAR ────────────────────────────────────────────────────
(function () {
  const nav = document.getElementById('navbar');
  const sections = document.querySelectorAll('section[id]');
  const links = document.querySelectorAll('.nav-links a');

  function onScroll() {
    if (window.scrollY > 60) {
      nav.classList.add('visible');
    } else {
      nav.classList.remove('visible');
    }

    // Active link highlighting
    let current = '';
    sections.forEach(s => {
      const top = s.offsetTop - 100;
      if (window.scrollY >= top) current = s.id;
    });

    links.forEach(a => {
      a.classList.toggle('active', a.getAttribute('href') === '#' + current);
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();


// ─── SCROLL REVEAL ─────────────────────────────────────────────
(function () {
  const els = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((e, i) => {
        if (e.isIntersecting) {
          const delay = e.target.dataset.delay || 0;
          setTimeout(() => e.target.classList.add('visible'), Number(delay));
          observer.unobserve(e.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );
  els.forEach(el => observer.observe(el));
})();




// ─── SMOOTH SCROLL FOR CTA ─────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});
