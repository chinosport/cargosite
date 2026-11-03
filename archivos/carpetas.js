(() => {
  const folders = new Set(['about-yo', 'about-me-1', 'selected-work', 'revista', 'experiments', 'contact-form']);
  const insideFrame = window.parent !== window;
  const home = location.pathname.endsWith('/') || location.pathname.endsWith('/index.html');
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');
  let frame;

  function showFolder() {
    const slug = location.hash.slice(1);
    if (frame?.dataset.slug === slug) return;
    if (frame) {
      const old = frame;
      frame = null;
      old.style.pointerEvents = 'none';
      if (reduceMotion.matches) old.remove();
      else old.animate([{opacity: 1}, {opacity: 0}], {duration: 150, fill: 'forwards'}).finished.then(() => old.remove());
    }
    if (!folders.has(slug)) return;
    const next = document.createElement('iframe');
    next.className = 'folder-view';
    next.dataset.slug = slug;
    next.title = slug;
    next.src = slug + '.html';
    next.addEventListener('load', () => {
      if (frame !== next) return;
      next.style.opacity = '1';
      if (!reduceMotion.matches) next.animate(
        [{opacity: 0, transform: 'translateY(5px)'}, {opacity: 1, transform: 'none'}],
        {duration: 200, easing: 'ease-out'}
      );
      next.focus();
    }, {once: true});
    frame = next;
    document.body.append(next);
  }

  function closeFolder() {
    if (insideFrame) parent.postMessage('cerrar-carpeta', '*');
    else location.href = 'index.html';
  }

  if (home) {
    window.addEventListener('message', event => {
      if (!frame || event.source !== frame.contentWindow || event.data !== 'cerrar-carpeta') return;
      if (history.state?.folder) history.back();
      else {
        history.replaceState(null, '', location.pathname);
        showFolder();
      }
    });
    window.addEventListener('hashchange', showFolder);
    showFolder();
  }
  window.addEventListener('click', event => {
    if (event.button || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const path = event.composedPath();
    const matches = selector => path.some(node => node.matches?.(selector));
    if (home) {
      const link = path.find(node => node.matches?.('a[href],media-item[href]'));
      const slug = link?.getAttribute('href')?.replace(/\.html$/, '');
      if (!folders.has(slug)) return;
      event.preventDefault();
      history.pushState({folder: slug}, '', '#' + slug);
      showFolder();
    } else {
      const closing = matches('.exit,.cancel,[rel="close-overlay"]');
      if (!closing && matches('.overlay-content .page-content,.modal,.cv-lb')) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      closeFolder();
    }
  }, true);
  window.addEventListener('keydown', event => {
    if (!home && event.key === 'Escape' && !document.querySelector('.cv-lb')) {
      event.stopImmediatePropagation();
      closeFolder();
    }
  }, true);
})();
