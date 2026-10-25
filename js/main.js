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

/* Respect reduced motion for autoplaying project videos */
if (prefersReducedMotion) {
  document.querySelectorAll('video[autoplay]').forEach(v => {
    v.removeAttribute('autoplay');
    v.pause();
  });
}

/* Mobile thumbnail popup — thumbnails are hidden on small screens, so each
   item gets a Figure/Video button that opens its media in a dialog */
const mediaDialog = document.getElementById('mediaDialog');
const mediaDialogBody = document.getElementById('mediaDialogBody');

if (mediaDialog && mediaDialogBody) {
  document.querySelectorAll('.pub-item').forEach(item => {
    const media = item.querySelector('.pub-thumb img, .pub-thumb video');
    const links = item.querySelector('.pub-links');
    if (!media || !links) return;

    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'pub-preview';
    button.textContent = media.tagName === 'VIDEO' ? 'Video' : 'Figure';
    button.addEventListener('click', () => {
      const clone = media.cloneNode(true);
      clone.removeAttribute('style');
      mediaDialogBody.replaceChildren(clone);
      mediaDialog.showModal();
      if (clone.tagName === 'VIDEO' && !prefersReducedMotion) clone.play();
    });
    links.prepend(button);
  });

  document.getElementById('mediaDialogClose').addEventListener('click', () => mediaDialog.close());
  // Clicking the dimmed backdrop (the dialog element itself) closes it
  mediaDialog.addEventListener('click', e => {
    if (e.target === mediaDialog) mediaDialog.close();
  });
  // Drop the media so a video stops playing once the popup is closed; the
  // close event can arrive after the popup was already reopened, so check
  mediaDialog.addEventListener('close', () => {
    if (!mediaDialog.open) mediaDialogBody.replaceChildren();
  });
}
