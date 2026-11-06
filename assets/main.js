(() => {
  // Mobile menu
  const btn = document.querySelector('.nav-toggle');
  const nav = document.getElementById('site-nav');
  if (btn && nav) {
    btn.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      btn.setAttribute('aria-expanded', String(open));
      btn.textContent = open ? 'Close' : 'Menu';
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && nav.classList.contains('open')) { btn.click(); btn.focus(); }
    });
  }

  document.querySelectorAll('form[name="quote"]').forEach((f) => {
    const email = f.querySelector('input[type="email"]');
    const sync = () => { const v = (f.querySelector('input[name="reply"]:checked') || {}).value; if (email) email.required = v === 'Email'; };
    f.addEventListener('change', sync); sync();
  });

  // "How can we help?" chooser
  const dlg = document.getElementById('help');
  if (!dlg || typeof dlg.showModal !== 'function') return; // links fall back to /contact/
  const title = dlg.querySelector('.help-title');
  const back = dlg.querySelector('[data-back]');
  const titles = { menu: 'How can we help?', quote: 'Request a quote', message: 'Send a message', emergency: 'Electrical emergency' };
  const show = (view) => {
    dlg.querySelectorAll('[data-view]').forEach((el) => { el.hidden = el.dataset.view !== view; });
    title.textContent = titles[view] || titles.menu;
    back.hidden = view === 'menu';
    dlg.dataset.view = view;
    const first = dlg.querySelector(`[data-view="${view}"] input:not([type=hidden]):not([tabindex="-1"]), [data-view="${view}"] a`);
    if (first && view !== 'menu') first.focus({ preventScroll: true });
  };
  const prefill = () => {
    const svc = document.querySelector('[data-service]');
    const sel = dlg.querySelector('.svc-select');
    if (svc && sel && !sel.value) sel.value = svc.dataset.service;
  };
  document.addEventListener('click', (e) => {
    const opener = e.target.closest('[data-open]');
    if (opener) {
      e.preventDefault();
      if (nav && nav.classList.contains('open')) btn.click();
      show(opener.dataset.open);
      prefill();
      if (!dlg.open) dlg.showModal();
      return;
    }
    if (e.target.closest('[data-back]')) show('menu');
    if (e.target.closest('[data-close]')) dlg.close();
  });
  // Click on the dimmed backdrop closes the chooser
  dlg.addEventListener('click', (e) => { if (e.target === dlg) dlg.close(); });
  dlg.addEventListener('close', () => document.body.classList.remove('help-open'));
  dlg.addEventListener('show', () => document.body.classList.add('help-open'));

})();
