/* ============================================================
   SINCERE DENTA CARE – MAIN JAVASCRIPT
   ============================================================ */

'use strict';

/* ── 1. PAGE TRANSITION ENGINE ── */
const overlay = document.getElementById('pageTransition');

function triggerEnterAnimation() {
  if (!overlay) return;
  overlay.classList.remove('slide-in');
  overlay.classList.add('slide-out');
  overlay.addEventListener('animationend', () => {
    overlay.classList.remove('slide-out');
  }, { once: true });
}

function triggerLeaveAnimation(href) {
  if (!overlay) { window.location.href = href; return; }
  overlay.classList.remove('slide-out');
  overlay.classList.add('slide-in');
  overlay.addEventListener('animationend', () => {
    window.location.href = href;
  }, { once: true });
}

// Intercept all internal page links
document.querySelectorAll('a[data-page], a[href="index.html"], a[href="services.html"], a[href="contact.html"]').forEach(link => {
  // Skip external links and anchors-only
  const href = link.getAttribute('href');
  if (!href || href.startsWith('http') || href.startsWith('mailto') || href.startsWith('tel') || href.startsWith('#')) return;

  link.addEventListener('click', (e) => {
    const dest = link.getAttribute('data-page') || href;
    // Same page? Skip transition
    if (window.location.pathname.endsWith(dest) || (dest === 'index.html' && (window.location.pathname === '/' || window.location.pathname.endsWith('index.html')))) return;
    e.preventDefault();
    triggerLeaveAnimation(dest);
  });
});

// On page load, play slide-out
window.addEventListener('DOMContentLoaded', () => {
  triggerEnterAnimation();
});


/* ── 2. NAVBAR SCROLL BEHAVIOR ── */
const navbar = document.getElementById('navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
  const currentScroll = window.scrollY;
  if (navbar) {
    if (currentScroll > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    // Hide on scroll down, show on scroll up
    if (currentScroll > lastScroll && currentScroll > 200) {
      navbar.style.transform = 'translateY(-100%)';
    } else {
      navbar.style.transform = 'translateY(0)';
    }
    lastScroll = currentScroll;
  }
}, { passive: true });

if (navbar) {
  navbar.style.transition = 'transform 0.4s cubic-bezier(0.4,0,0.2,1), box-shadow 0.3s ease, background 0.3s ease';
}


/* ── 3. HAMBURGER MENU ── */
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
    document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
  });

  // Close on nav link click (mobile)
  navLinks.querySelectorAll('.nav-link:not(.dropdown > .nav-link)').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // Mobile dropdown toggle
  document.querySelectorAll('.dropdown').forEach(dd => {
    dd.querySelector('.nav-link')?.addEventListener('click', (e) => {
      if (window.innerWidth <= 768) {
        e.preventDefault();
        dd.classList.toggle('open');
      }
    });
  });
}


/* ── 4. SCROLL ANIMATIONS (IntersectionObserver) ── */
const scrollObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.animate-on-scroll').forEach(el => scrollObserver.observe(el));


/* ── 5. ANIMATED COUNTER ── */
function animateCounter(el) {
  const target = parseInt(el.getAttribute('data-target'), 10);
  const duration = 2000;
  const step = 16;
  const increment = target / (duration / step);
  let current = 0;

  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    el.textContent = Math.floor(current).toLocaleString();
    // Add '+' suffix for large numbers
    if (target >= 1000) el.textContent = Math.floor(current).toLocaleString() + '+';
  }, step);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
      entry.target.classList.add('counted');
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.counter').forEach(counter => counterObserver.observe(counter));


/* ── 6. ACTIVE NAV HIGHLIGHT ── */
(function setActiveNav() {
  const path = window.location.pathname;
  const filename = path.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (!href) return;
    const linkFile = href.split('/').pop().split('#')[0] || 'index.html';
    if (linkFile === filename) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
})();


/* ── 7. SMOOTH ANCHOR SCROLL ── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const id = anchor.getAttribute('href').slice(1);
    const target = document.getElementById(id);
    if (target) {
      e.preventDefault();
      const offset = 90;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
      // Close mobile menu if open
      if (hamburger && navLinks) {
        hamburger.classList.remove('open');
        navLinks.classList.remove('open');
        document.body.style.overflow = '';
      }
    }
  });
});


/* ── 8. CONTACT FORM HANDLER ── */
const form = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');
const submitBtn = document.getElementById('submitFormBtn');

if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    // Visual feedback
    if (submitBtn) {
      submitBtn.textContent = 'Sending...';
      submitBtn.disabled = true;
      submitBtn.style.opacity = '0.75';
    }
    // Simulate send (no backend)
    setTimeout(() => {
      if (formSuccess) {
        formSuccess.classList.add('show');
        form.reset();
      }
      if (submitBtn) {
        submitBtn.textContent = 'Message Sent ✓';
        submitBtn.style.background = 'linear-gradient(135deg, #16a34a, #15803d)';
        submitBtn.style.opacity = '1';
      }
    }, 1200);
  });
}


/* ── 9. TEXT REVEAL ANIMATION ── */
function splitAndAnimate(selector, stagger = 30) {
  document.querySelectorAll(selector).forEach(el => {
    if (el.dataset.animated) return;
    el.dataset.animated = '1';
    const text = el.textContent;
    el.textContent = '';
    el.style.opacity = '1';
    [...text].forEach((char, i) => {
      const span = document.createElement('span');
      span.textContent = char === ' ' ? '\u00A0' : char;
      span.style.cssText = `
        display: inline-block;
        opacity: 0;
        transform: translateY(20px);
        animation: fadeUp 0.5s cubic-bezier(0.22,1,0.36,1) ${i * stagger}ms forwards;
      `;
      el.appendChild(span);
    });
  });
}

// Apply to hero title after slight delay
setTimeout(() => {
  // Only animate hero badge text if exists
  const badge = document.querySelector('.hero-badge');
  if (badge) {
    badge.style.transition = 'transform 0.6s ease, opacity 0.6s ease';
  }
}, 100);


/* ── 10. PARALLAX SUBTLE EFFECT ── */
const heroShapes = document.querySelectorAll('.hero-bg-shapes .shape');
window.addEventListener('mousemove', (e) => {
  const cx = e.clientX / window.innerWidth - 0.5;
  const cy = e.clientY / window.innerHeight - 0.5;
  heroShapes.forEach((shape, i) => {
    const factor = (i + 1) * 18;
    shape.style.transform = `translate(${cx * factor}px, ${cy * factor}px) scale(1)`;
  });
}, { passive: true });


/* ── 11. FLOATING TOOTH PARALLAX ── */
const floatingTeeth = document.querySelectorAll('.floating-tooth');
window.addEventListener('mousemove', (e) => {
  const cx = e.clientX / window.innerWidth - 0.5;
  const cy = e.clientY / window.innerHeight - 0.5;
  floatingTeeth.forEach((tooth, i) => {
    const f = (i + 1) * 25;
    tooth.style.transform = `translate(${cx * f}px, ${cy * f}px)`;
  });
}, { passive: true });


/* ── 12. SERVICE CARD TILT EFFECT ── */
document.querySelectorAll('.service-card, .v-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const rotX = ((y - cy) / cy) * -5;
    const rotY = ((x - cx) / cx) * 5;
    card.style.transform = `perspective(600px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-6px)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});


/* ── 13. SCROLL PROGRESS BAR ── */
const progressBar = document.createElement('div');
progressBar.style.cssText = `
  position: fixed; top: 70px; left: 0; height: 3px; width: 0%;
  background: linear-gradient(90deg, #0D9488, #14B8A6, #F59E0B);
  z-index: 1001; transition: width 0.1s linear;
  pointer-events: none;
`;
document.body.appendChild(progressBar);

window.addEventListener('scroll', () => {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  progressBar.style.width = progress + '%';
}, { passive: true });


/* ── 14. BACK TO TOP BUTTON ── */
const backTop = document.createElement('button');
backTop.innerHTML = '↑';
backTop.setAttribute('aria-label', 'Back to top');
backTop.style.cssText = `
  position: fixed; bottom: 2rem; right: 2rem; z-index: 500;
  width: 48px; height: 48px; border-radius: 50%;
  background: linear-gradient(135deg, #0D9488, #0F766E);
  color: white; border: none; font-size: 1.3rem; cursor: pointer;
  box-shadow: 0 6px 20px rgba(13,148,136,0.4);
  opacity: 0; visibility: hidden;
  transform: translateY(10px);
  transition: opacity 0.3s, visibility 0.3s, transform 0.3s;
  display: flex; align-items: center; justify-content: center;
`;
backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
document.body.appendChild(backTop);

window.addEventListener('scroll', () => {
  if (window.scrollY > 400) {
    backTop.style.opacity = '1';
    backTop.style.visibility = 'visible';
    backTop.style.transform = 'translateY(0)';
  } else {
    backTop.style.opacity = '0';
    backTop.style.visibility = 'hidden';
    backTop.style.transform = 'translateY(10px)';
  }
}, { passive: true });


/* ── 15. WHATSAPP FLOATING BUTTON ── */
const waBtn = document.createElement('a');
waBtn.href = 'https://wa.me/916238881511';
waBtn.target = '_blank';
waBtn.setAttribute('aria-label', 'Chat on WhatsApp');
waBtn.innerHTML = `
  <svg viewBox="0 0 24 24" fill="white" width="28" height="28">
    <path d="M17.6 6.4A7.94 7.94 0 0 0 12 4a8 8 0 0 0-6.93 12L4 20l4.1-1.07A8 8 0 1 0 17.6 6.4zm-5.6 12.3a6.63 6.63 0 0 1-3.38-.93l-.24-.14-2.5.65.67-2.43-.16-.25A6.65 6.65 0 1 1 12 18.7zm3.65-4.98c-.2-.1-1.18-.58-1.36-.65-.18-.07-.31-.1-.44.1-.13.2-.5.65-.62.79-.11.13-.23.15-.43.05A5.42 5.42 0 0 1 9.5 11.8c-.2-.35.2-.33.58-1.1.07-.13.03-.25-.02-.35-.05-.1-.44-1.06-.6-1.45-.16-.38-.33-.33-.44-.33h-.38c-.13 0-.35.05-.53.25-.18.2-.7.68-.7 1.66s.71 1.93.81 2.06c.1.13 1.4 2.14 3.4 3C13.86 16.3 13.86 16 14.3 15.96c.43-.04 1.4-.57 1.6-1.12.2-.55.2-1.02.14-1.12-.06-.1-.2-.15-.4-.25z"/>
  </svg>
`;
waBtn.style.cssText = `
  position: fixed; bottom: 5.5rem; right: 2rem; z-index: 500;
  width: 56px; height: 56px; border-radius: 50%;
  background: #25D366;
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 6px 24px rgba(37,211,102,0.5);
  animation: waFloat 3s ease-in-out infinite;
  transition: transform 0.3s ease;
`;
waBtn.addEventListener('mouseenter', () => waBtn.style.transform = 'scale(1.1)');
waBtn.addEventListener('mouseleave', () => waBtn.style.transform = '');

const waStyle = document.createElement('style');
waStyle.textContent = `@keyframes waFloat { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }`;
document.head.appendChild(waStyle);
document.body.appendChild(waBtn);

console.log('✅ Sincere Denta Care – Site Initialized');


/* ── 16. DARK MODE TOGGLE ── */
(function initDarkMode() {
  const toggle = document.getElementById('darkModeToggle');
  const body = document.body;

  // Apply saved preference immediately (before paint)
  const savedMode = localStorage.getItem('sincere-dark-mode');
  if (savedMode === 'dark') {
    body.classList.add('dark-mode');
  }

  if (!toggle) return;

  toggle.addEventListener('click', () => {
    const isDark = body.classList.toggle('dark-mode');
    localStorage.setItem('sincere-dark-mode', isDark ? 'dark' : 'light');

    // Update scroll progress bar colour
    if (progressBar) {
      progressBar.style.background = isDark
        ? 'linear-gradient(90deg, #14B8A6, #2DD4BF, #F59E0B)'
        : 'linear-gradient(90deg, #0D9488, #14B8A6, #F59E0B)';
    }
  });
})();


/* ── 17. TESTIMONIALS INFINITE SCROLL SETUP ── */
(function initTestimonialsCarousel() {
  const track = document.getElementById('testimonialsTrack');
  if (!track) return;

  // Clone all children and append to create a seamless loop
  const cards = Array.from(track.children);
  cards.forEach(card => {
    const clone = card.cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');
    track.appendChild(clone);
  });
})();

