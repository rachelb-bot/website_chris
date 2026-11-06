(() => {
  // Mobile menu
  const btn = document.querySelector('.nav-toggle');
  const nav = document.getElementById('site-nav');
  const header = document.querySelector('.site-header');
  const setHdr = () => header && document.documentElement.style.setProperty('--hdr', header.getBoundingClientRect().bottom + 'px');
  if (btn && nav) {
    btn.addEventListener('click', () => {
      setHdr();
      const open = nav.classList.toggle('open');
      btn.setAttribute('aria-expanded', String(open));
      btn.textContent = open ? 'Close' : 'Menu';
      document.documentElement.classList.toggle('nav-open', open);
    });
  }
  // Drop-down menus: hover/focus open them on desktop (CSS); the chevron buttons toggle them on touch and phones
  const menus = [...document.querySelectorAll('.has-menu')];
  const closeMenus = (except) => menus.forEach((m) => { if (m !== except) { m.classList.remove('open'); m.querySelector('.sub-toggle').setAttribute('aria-expanded', 'false'); } });
  menus.forEach((m) => {
    // After Escape, keep the panel shut until the pointer or focus leaves this item
    m.addEventListener('mouseleave', () => m.classList.remove('suppress'));
    m.addEventListener('focusout', (e) => { if (!m.contains(e.relatedTarget)) m.classList.remove('suppress'); });
    const t = m.querySelector('.sub-toggle');
    t.addEventListener('click', () => {
      const open = !m.classList.contains('open');
      if (window.matchMedia('(min-width: 961px)').matches) closeMenus(m);
      m.classList.remove('suppress');
      m.classList.toggle('open', open);
      t.setAttribute('aria-expanded', String(open));
    });
  });
  document.addEventListener('click', (e) => { if (!e.target.closest('.has-menu') && window.matchMedia('(min-width: 961px)').matches) closeMenus(); });
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    const openMenu = menus.find((m) => m.classList.contains('open') || m.matches(':focus-within'));
    if (openMenu) { closeMenus(); openMenu.classList.add('suppress'); openMenu.querySelector('.nav-top').focus(); return; }
    if (nav && nav.classList.contains('open')) { btn.click(); btn.focus(); }
  });

  // Service areas: hovering a town card highlights it on the map
  document.querySelectorAll('[data-town]').forEach((card) => {
    const dot = document.getElementById('map-' + card.dataset.town);
    if (!dot) return;
    const on = () => dot.classList.add('hl'); const off = () => dot.classList.remove('hl');
    card.addEventListener('mouseenter', on); card.addEventListener('mouseleave', off);
    card.addEventListener('focus', on); card.addEventListener('blur', off);
  });

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
      closeMenus();
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
