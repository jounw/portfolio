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

/* BibTeX buttons show or hide the citation below the entry */
document.querySelectorAll('.pub-bibtex-toggle').forEach(button => {
  const target = document.getElementById(button.getAttribute('aria-controls'));
  if (!target) return;
  button.addEventListener('click', () => {
    const open = target.hidden;
    target.hidden = !open;
    button.setAttribute('aria-expanded', String(open));
  });
});

/* Mobile thumbnail popup — thumbnails are hidden on small screens, so each
   item gets a Figure/Video button that opens its media in a dialog */
const mediaDialog = document.getElementById('mediaDialog');
const mediaDialogBody = document.getElementById('mediaDialogBody');

if (mediaDialog && mediaDialogBody) {
  document.querySelectorAll('.pub-item').forEach(item => {
    const media = item.querySelector('.pub-thumb img');
    const links = item.querySelector('.pub-links');
    if (!media || !links) return;

    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'pub-preview';
    button.textContent = media.dataset.previewLabel || 'Figure';
    button.addEventListener('click', () => {
      const clone = media.cloneNode(true);
      clone.removeAttribute('class');
      clone.removeAttribute('style');
      mediaDialogBody.replaceChildren(clone);
      mediaDialog.showModal();
    });
    links.prepend(button);
  });

  document.getElementById('mediaDialogClose').addEventListener('click', () => mediaDialog.close());
  // Clicking the dimmed backdrop (the dialog element itself) closes it
  mediaDialog.addEventListener('click', e => {
    if (e.target === mediaDialog) mediaDialog.close();
  });
  // Drop the media once the popup is closed; the
  // close event can arrive after the popup was already reopened, so check
  mediaDialog.addEventListener('close', () => {
    if (!mediaDialog.open) mediaDialogBody.replaceChildren();
  });
}
