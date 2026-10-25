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
