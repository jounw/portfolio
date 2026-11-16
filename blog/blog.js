/* Blog code blocks: syntax highlighting (highlight.js) + copy button */
(function () {
  /* Posts can be written in Markdown inside <script type="text/markdown"> */
  document.querySelectorAll('script[type="text/markdown"]').forEach(function (src) {
    if (!window.marked) return;
    var out = document.createElement('div');
    out.className = 'post-body';
    out.innerHTML = marked.parse(src.textContent.replace(/^\n+/, ''), { gfm: true });
    src.after(out);
  });

  /* Put each external link's favicon in front of its text */
  document.querySelectorAll('.post a[href^="http"]').forEach(function (a) {
    if (a.hostname === location.hostname || a.querySelector('img')) return;
    var icon = document.createElement('img');
    icon.className = 'link-favicon';
    icon.alt = '';
    icon.src = 'https://www.google.com/s2/favicons?sz=64&domain=' + encodeURIComponent(a.hostname);
    icon.addEventListener('error', function () { icon.remove(); });
    a.prepend(icon);
  });

  /* Paragraphs that contain only images (2 or more) become one equal-size row */
  document.querySelectorAll('.post p').forEach(function (p) {
    if (p.querySelectorAll('img').length > 1 && p.textContent.trim() === '') p.classList.add('img-row');
  });

  document.querySelectorAll('.post img').forEach(function (img) { img.loading = 'lazy'; });

  if (window.hljs) {
    document.querySelectorAll('.post pre code').forEach(function (el) { hljs.highlightElement(el); });
  }

  document.querySelectorAll('.post pre').forEach(function (pre) {
    var button = document.createElement('button');
    button.type = 'button';
    button.className = 'copy-btn';
    button.textContent = 'Copy';
    button.addEventListener('click', function () {
      var text = pre.querySelector('code').innerText;
      var done = function (ok) {
        button.textContent = ok ? 'Copied' : 'Failed';
        setTimeout(function () { button.textContent = 'Copy'; }, 1500);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(function () { done(true); }, function () { done(false); });
      } else {
        done(false);
      }
    });
    pre.appendChild(button);
  });
})();
