const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', isOpen);
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* Scroll reveal via IntersectionObserver */
if (!prefersReducedMotion) {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

  document.querySelectorAll('[data-reveal]').forEach(el => revealObserver.observe(el));
} else {
  document.querySelectorAll('[data-reveal]').forEach(el => el.classList.add('is-visible'));
}

/* Kinetic hero typography — split into characters and stagger them in */
const kineticEl = document.querySelector('[data-kinetic]');

if (kineticEl) {
  const text = kineticEl.textContent;
  kineticEl.textContent = '';
  const chars = [...text].map(ch => {
    const span = document.createElement('span');
    span.className = 'char';
    span.textContent = ch === ' ' ? ' ' : ch;
    kineticEl.appendChild(span);
    return span;
  });

  if (prefersReducedMotion) {
    chars.forEach(c => c.classList.add('is-in'));
  } else {
    chars.forEach((c, i) => {
      c.style.transitionDelay = (i * 40) + 'ms';
      requestAnimationFrame(() => {
        setTimeout(() => c.classList.add('is-in'), 50);
      });
    });
  }
}

/* Hero shrink-on-scroll */
const heroInner = document.querySelector('.hero-inner');
const heroSection = document.getElementById('hero');

function updateHeroScrollEffects() {
  if (!heroSection) return;
  const heroHeight = heroSection.offsetHeight;
  const progress = Math.min(window.scrollY / heroHeight, 1);

  if (heroInner) {
    heroInner.style.transform = `scale(${1 - progress * 0.12}) translateY(${progress * -20}px)`;
    heroInner.style.opacity = String(1 - progress * 0.8);
  }
}

let ticking = false;

function onScroll() {
  if (!prefersReducedMotion && !ticking) {
    ticking = true;
    requestAnimationFrame(() => {
      updateHeroScrollEffects();
      ticking = false;
    });
  }
}

window.addEventListener('scroll', onScroll, { passive: true });
if (!prefersReducedMotion) updateHeroScrollEffects();
