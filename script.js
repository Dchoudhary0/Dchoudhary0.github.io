// ✦ DILPREET CHOUDHARY PORTFOLIO — INTERACTIVE SCRIPTS ✦

/* ══════════════════════════════════════════════════════════════
   1. CUSTOM CURSOR + SPARKLE TRAIL
   ══════════════════════════════════════════════════════════════ */
const cursorDot = document.getElementById('cursorDot');
const cursorRing = document.getElementById('cursorRing');
let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;
const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

if (canHover) {
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursorDot.style.left = mouseX + 'px';
    cursorDot.style.top = mouseY + 'px';

    // occasional sparkle
    if (Math.random() > 0.82) {
      spawnSparkle(mouseX, mouseY);
    }
  });

  // smooth trailing ring
  function animateRing() {
    ringX += (mouseX - ringX) * 0.18;
    ringY += (mouseY - ringY) * 0.18;
    cursorRing.style.left = ringX + 'px';
    cursorRing.style.top = ringY + 'px';
    requestAnimationFrame(animateRing);
  }
  animateRing();

  // enlarge ring over interactive elements
  document.querySelectorAll('a, button, .timeline-card, .skill-pills span, .project-card, .stat-card, .contact-card').forEach((el) => {
    el.addEventListener('mouseenter', () => cursorRing.classList.add('hovering'));
    el.addEventListener('mouseleave', () => cursorRing.classList.remove('hovering'));
  });
}

const sparkleChars = ['✦', '✧', '·'];
function spawnSparkle(x, y) {
  const s = document.createElement('div');
  s.className = 'sparkle';
  s.textContent = sparkleChars[Math.floor(Math.random() * sparkleChars.length)];
  s.style.left = x + 'px';
  s.style.top = y + 'px';
  s.style.color = Math.random() > 0.5 ? '#d4547a' : '#c9a96e';
  document.body.appendChild(s);
  setTimeout(() => s.remove(), 900);
}

// click burst
document.addEventListener('click', (e) => {
  for (let i = 0; i < 6; i++) {
    setTimeout(() => {
      const angle = (Math.PI * 2 * i) / 6;
      spawnSparkle(e.clientX + Math.cos(angle) * 20, e.clientY + Math.sin(angle) * 20);
    }, i * 25);
  }
});

/* ══════════════════════════════════════════════════════════════
   2. FALLING PETALS CANVAS ANIMATION
   ══════════════════════════════════════════════════════════════ */
const canvas = document.getElementById('petalsCanvas');
const ctx = canvas.getContext('2d');
let petals = [];

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const petalColors = ['#f8d0de', '#e8a0b8', '#fce8ef', '#d4547a', '#e8d5a3', '#c9a3e8'];
const glowColors = ['#f0d98a', '#fff6e0', '#f8d0de', '#c9a3e8'];

// Drifting petals
class Petal {
  constructor() { this.reset(true); }
  reset(initial = false) {
    this.x = Math.random() * canvas.width;
    this.y = initial ? Math.random() * canvas.height : -20;
    this.size = Math.random() * 8 + 4;
    this.speedY = Math.random() * 1 + 0.4;
    this.speedX = Math.random() * 0.8 - 0.4;
    this.rotation = Math.random() * 360;
    this.rotationSpeed = Math.random() * 2 - 1;
    this.color = petalColors[Math.floor(Math.random() * petalColors.length)];
    this.opacity = Math.random() * 0.5 + 0.3;
    this.sway = Math.random() * 0.02 + 0.01;
    this.swayOffset = Math.random() * Math.PI * 2;
  }
  update() {
    this.y += this.speedY;
    this.x += this.speedX + Math.sin(this.y * this.sway + this.swayOffset) * 0.5;
    this.rotation += this.rotationSpeed;
    if (this.y > canvas.height + 20) this.reset();
  }
  draw() {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate((this.rotation * Math.PI) / 180);
    ctx.globalAlpha = this.opacity;
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.ellipse(0, 0, this.size, this.size / 2, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

// Glowing twinkling sparkles / bokeh orbs
class Glow {
  constructor() { this.reset(true); }
  reset(initial = false) {
    this.x = Math.random() * canvas.width;
    this.y = initial ? Math.random() * canvas.height : canvas.height + 20;
    this.radius = Math.random() * 3 + 1;
    this.speedY = -(Math.random() * 0.5 + 0.2);
    this.speedX = Math.random() * 0.4 - 0.2;
    this.color = glowColors[Math.floor(Math.random() * glowColors.length)];
    this.twinkleSpeed = Math.random() * 0.04 + 0.01;
    this.twinkle = Math.random() * Math.PI * 2;
    this.baseOpacity = Math.random() * 0.5 + 0.3;
  }
  update() {
    this.y += this.speedY;
    this.x += this.speedX;
    this.twinkle += this.twinkleSpeed;
    if (this.y < -20) this.reset();
  }
  draw() {
    const op = this.baseOpacity * (0.5 + 0.5 * Math.sin(this.twinkle));
    ctx.save();
    ctx.globalAlpha = op;
    const grad = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius * 4);
    grad.addColorStop(0, this.color);
    grad.addColorStop(1, 'transparent');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius * 4, 0, Math.PI * 2);
    ctx.fill();
    // bright core
    ctx.globalAlpha = op;
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius * 0.6, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

const isMobile = window.innerWidth < 768;
const petalCount = isMobile ? 14 : 28;
const glowCount = isMobile ? 20 : 45;
for (let i = 0; i < petalCount; i++) petals.push(new Petal());
const glows = [];
for (let i = 0; i < glowCount; i++) glows.push(new Glow());

function animatePetals() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  glows.forEach((g) => { g.update(); g.draw(); });
  petals.forEach((p) => { p.update(); p.draw(); });
  requestAnimationFrame(animatePetals);
}
animatePetals();

/* ══════════════════════════════════════════════════════════════
   3. SCROLL PROGRESS BAR
   ══════════════════════════════════════════════════════════════ */
const progressBar = document.getElementById('scrollProgress');
window.addEventListener('scroll', () => {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const pct = (scrollTop / docHeight) * 100;
  progressBar.style.width = pct + '%';
});

/* ══════════════════════════════════════════════════════════════
   4. EXPANDABLE EXPERIENCE CARDS (click to open/close)
   ══════════════════════════════════════════════════════════════ */
const expCards = document.querySelectorAll('.timeline-card');
expCards.forEach((card) => {
  const toggle = () => {
    const isOpen = card.classList.contains('expanded');
    // close others for accordion feel
    expCards.forEach((c) => c.classList.remove('expanded'));
    if (!isOpen) card.classList.add('expanded');
  };
  card.addEventListener('click', toggle);
  card.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); }
  });
});
// open the first one by default so visitors see the format
if (expCards[0]) expCards[0].classList.add('expanded');

/* ══════════════════════════════════════════════════════════════
   5. EXPERIENCE FILTER BUTTONS
   ══════════════════════════════════════════════════════════════ */
const filterBtns = document.querySelectorAll('.filter-btn');
const timelineItems = document.querySelectorAll('.timeline-item');

filterBtns.forEach((btn) => {
  btn.addEventListener('click', () => {
    filterBtns.forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;

    timelineItems.forEach((item) => {
      const categories = item.dataset.category || '';
      if (filter === 'all' || categories.includes(filter)) {
        item.classList.remove('hidden');
      } else {
        item.classList.add('hidden');
      }
    });
  });
});

/* ══════════════════════════════════════════════════════════════
   6. SCROLL FADE-IN REVEALS
   ══════════════════════════════════════════════════════════════ */
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.12 });

document.querySelectorAll(
  '.timeline-item, .project-card, .skill-category, .stat-card, .contact-card, .edu-card, .about-card'
).forEach((el) => {
  el.classList.add('fade-in');
  observer.observe(el);
});

/* ══════════════════════════════════════════════════════════════
   7. NAVBAR — shrink + active link highlight
   ══════════════════════════════════════════════════════════════ */
const navbar = document.querySelector('.navbar');
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    navbar.style.padding = '12px 60px';
    navbar.style.boxShadow = '0 4px 30px rgba(201, 107, 138, 0.15)';
  } else {
    navbar.style.padding = '18px 60px';
    navbar.style.boxShadow = '0 2px 20px rgba(201, 107, 138, 0.08)';
  }

  let current = '';
  sections.forEach((section) => {
    if (window.scrollY >= section.offsetTop - 120) current = section.getAttribute('id');
  });
  navLinks.forEach((link) => {
    link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
  });
});

const style = document.createElement('style');
style.textContent = `.nav-links a.active { color: var(--pink-deep); }
.nav-links a.active::after { width: 100%; }`;
document.head.appendChild(style);

/* ══════════════════════════════════════════════════════════════
   8. HERO PHOTO PARALLAX + TILT
   ══════════════════════════════════════════════════════════════ */
const heroPhoto = document.querySelector('.hero-photo-wrapper');
if (heroPhoto) {
  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    if (scrolled < window.innerHeight) {
      heroPhoto.style.transform = `translateY(${scrolled * 0.08}px)`;
    }
  });

  // subtle 3D tilt following mouse
  if (canHover) {
    const hero = document.querySelector('.hero');
    hero.addEventListener('mousemove', (e) => {
      const rect = hero.getBoundingClientRect();
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const dx = (e.clientX - rect.left - cx) / cx;
      const dy = (e.clientY - rect.top - cy) / cy;
      heroPhoto.style.transform = `perspective(800px) rotateY(${dx * 6}deg) rotateX(${-dy * 6}deg)`;
    });
    hero.addEventListener('mouseleave', () => {
      heroPhoto.style.transform = 'perspective(800px) rotateY(0) rotateX(0)';
    });
  }
}

/* ══════════════════════════════════════════════════════════════
   9. ANIMATED STAT COUNTERS
   ══════════════════════════════════════════════════════════════ */
const statObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const text = el.textContent.trim();
      const num = parseFloat(text);
      if (!isNaN(num) && !el.dataset.counted) {
        el.dataset.counted = 'true';
        const suffix = text.replace(/[0-9.]/g, '');
        let current = 0;
        const steps = 30;
        const inc = num / steps;
        const timer = setInterval(() => {
          current += inc;
          if (current >= num) { current = num; clearInterval(timer); }
          el.textContent = (Number.isInteger(num) ? Math.floor(current) : current.toFixed(1)) + suffix;
        }, 30);
      }
    }
  });
}, { threshold: 0.5 });
document.querySelectorAll('.stat-number').forEach((el) => statObserver.observe(el));

/* ══════════════════════════════════════════════════════════════
   10. PAGE LOAD INTRO
   ══════════════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.6s ease';
  setTimeout(() => { document.body.style.opacity = '1'; }, 100);
});

console.log('✦ Portfolio of Dilpreet Choudhary');

/* ══════════════════════════════════════════════════════════════
   11. SUBTLE SPARKLES ON CONTACT CARD & BUTTON HOVER
   ══════════════════════════════════════════════════════════════ */
const sparkleTargets = document.querySelectorAll('.contact-card, .btn-primary, .btn-secondary, .project-cta');
const prissyChars = ['✦', '✧', '·'];

sparkleTargets.forEach((el) => {
  el.addEventListener('mouseenter', (e) => {
    const rect = el.getBoundingClientRect();
    for (let i = 0; i < 5; i++) {
      setTimeout(() => {
        const s = document.createElement('div');
        s.textContent = prissyChars[Math.floor(Math.random() * prissyChars.length)];
        const x = rect.left + Math.random() * rect.width;
        const y = rect.top + Math.random() * rect.height * 0.5;
        s.style.cssText = `position:fixed;left:${x}px;top:${y}px;font-size:${0.7 + Math.random() * 0.6}rem;` +
          `pointer-events:none;z-index:9997;color:${Math.random() > 0.5 ? '#b32d5e' : '#c9a96e'};` +
          `transition:all 0.9s ease;opacity:1;`;
        document.body.appendChild(s);
        requestAnimationFrame(() => {
          s.style.transform = `translateY(-${30 + Math.random() * 30}px) rotate(${Math.random() * 90 - 45}deg) scale(0.2)`;
          s.style.opacity = '0';
        });
        setTimeout(() => s.remove(), 900);
      }, i * 60);
    }
  });
});
