/* @ds-bundle: {"format":4,"namespace":"Off80","components":[{"name":"Button"},{"name":"Icon"},{"name":"Medal"},{"name":"Logo"},{"name":"ServiceTile"},{"name":"FeaturedService"},{"name":"TownCard"},{"name":"UtilityTag"},{"name":"Chip"},{"name":"JumpMenu"},{"name":"QuestionList"},{"name":"TickList"},{"name":"AtAGlance"},{"name":"FaqItem"},{"name":"Steps"},{"name":"FactList"},{"name":"CtaBand"},{"name":"HelpChooser"},{"name":"QuoteForm"},{"name":"EmergencySteps"}]} */
(function () {
  var R = window.React, h = R.createElement;
  var ICONS = {"panel-upgrades":"<rect x=\"14\" y=\"6\" width=\"36\" height=\"52\" rx=\"3\" class=\"s l\"/><rect x=\"20\" y=\"12\" width=\"24\" height=\"7\" rx=\"1.5\" class=\"b l\"/> <rect x=\"20\" y=\"24\" width=\"10\" height=\"4.5\" rx=\"1\" class=\"a l\"/><rect x=\"34\" y=\"24\" width=\"10\" height=\"4.5\" rx=\"1\" class=\"a l\"/><rect x=\"20\" y=\"31\" width=\"10\" height=\"4.5\" rx=\"1\" class=\"a l\"/><rect x=\"34\" y=\"31\" width=\"10\" height=\"4.5\" rx=\"1\" class=\"a l\"/><rect x=\"20\" y=\"38\" width=\"10\" height=\"4.5\" rx=\"1\" class=\"a l\"/><rect x=\"34\" y=\"38\" width=\"10\" height=\"4.5\" rx=\"1\" class=\"a l\"/><rect x=\"20\" y=\"45\" width=\"10\" height=\"4.5\" rx=\"1\" class=\"a l\"/><rect x=\"34\" y=\"45\" width=\"10\" height=\"4.5\" rx=\"1\" class=\"a l\"/> <path d=\"M32 24v26\" class=\"l\"/>","ev-charger-installation":"<rect x=\"8\" y=\"10\" width=\"20\" height=\"32\" rx=\"4\" class=\"a l\"/><path d=\"M19 17l-5 9h6l-4 9\" class=\"l\" fill=\"none\"/> <path d=\"M18 42v6c0 6 6 8 12 8h8\" fill=\"none\" class=\"l\"/><rect x=\"38\" y=\"50\" width=\"10\" height=\"10\" rx=\"2\" class=\"b l\"/> <path d=\"M40 30h18l-3-8H43z\" class=\"s l\"/><rect x=\"38\" y=\"30\" width=\"22\" height=\"10\" rx=\"3\" class=\"s l\"/><circle cx=\"43\" cy=\"41\" r=\"3\" class=\"d\"/><circle cx=\"55\" cy=\"41\" r=\"3\" class=\"d\"/>","generator-installation":"<rect x=\"8\" y=\"18\" width=\"48\" height=\"30\" rx=\"4\" class=\"a l\"/><path d=\"M16 18v-6h32v6\" fill=\"none\" class=\"l\"/> <rect x=\"14\" y=\"24\" width=\"18\" height=\"18\" rx=\"2\" class=\"s l\"/><path d=\"M25 27l-5 7h5l-3 6\" fill=\"none\" class=\"l\"/> <circle cx=\"44\" cy=\"30\" r=\"3\" class=\"b l\"/><path d=\"M38 38h12\" class=\"l\"/><circle cx=\"16\" cy=\"52\" r=\"5\" class=\"d\"/><circle cx=\"48\" cy=\"52\" r=\"5\" class=\"d\"/>","electrical-repair":"<rect x=\"12\" y=\"8\" width=\"30\" height=\"44\" rx=\"5\" class=\"s l\"/><rect x=\"20\" y=\"16\" width=\"14\" height=\"10\" rx=\"4\" class=\"a l\"/><rect x=\"20\" y=\"32\" width=\"14\" height=\"10\" rx=\"4\" class=\"a l\"/> <path d=\"M24 19v4M30 19v4M24 35v4M30 35v4\" class=\"l\"/><path d=\"M38 44l16 16\" stroke-width=\"5\" class=\"l\"/><circle cx=\"36\" cy=\"42\" r=\"6\" class=\"b l\"/>","emergency-electrician":"<path d=\"M32 6L58 54H6z\" class=\"b l\" stroke-linejoin=\"round\"/><path d=\"M35 20l-9 16h8l-5 12 12-18h-8l4-10z\" class=\"s l\" stroke-linejoin=\"round\"/>","home-rewiring":"<rect x=\"4\" y=\"22\" width=\"56\" height=\"14\" class=\"a l\"/><path d=\"M4 29h56\" class=\"l\" opacity=\".35\"/> <circle cx=\"14\" cy=\"18\" r=\"5\" class=\"s l\"/><circle cx=\"32\" cy=\"18\" r=\"5\" class=\"s l\"/><circle cx=\"50\" cy=\"18\" r=\"5\" class=\"s l\"/> <path d=\"M6 14c4 0 4 4 8 4s4-4 9-4 5 4 9 4 4-4 9-4 5 4 9 4 4-4 8-4\" fill=\"none\" class=\"l br\"/> <path d=\"M14 36v14M50 36v14\" class=\"l\"/><rect x=\"9\" y=\"48\" width=\"10\" height=\"10\" rx=\"2\" class=\"s l\"/><rect x=\"45\" y=\"48\" width=\"10\" height=\"10\" rx=\"2\" class=\"s l\"/>","lighting-installation":"<path d=\"M32 4v12\" class=\"l\"/><path d=\"M20 16h24l-4 10H24z\" class=\"d l\"/><circle cx=\"32\" cy=\"36\" r=\"10\" class=\"a l\"/> <path d=\"M32 52v6M14 36H8M56 36h-6M19 49l-4 4M45 49l4 4M19 23l-4-4M45 23l4-4\" class=\"l br\"/>","outbuilding-well-pump-wiring":"<path d=\"M6 30L24 14l18 16v26H6z\" class=\"b l\" stroke-linejoin=\"round\"/><rect x=\"16\" y=\"38\" width=\"16\" height=\"18\" class=\"s l\"/><path d=\"M16 38l16 18M32 38L16 56\" class=\"l\"/> <path d=\"M52 8v48M46 14h12\" class=\"l\"/><path d=\"M46 14c-6 6-12 8-20 6\" fill=\"none\" class=\"l br\"/><rect x=\"44\" y=\"48\" width=\"16\" height=\"8\" rx=\"2\" class=\"a l\"/>","hot-tub-spa-wiring":"<path d=\"M8 30h48v18a6 6 0 0 1-6 6H14a6 6 0 0 1-6-6z\" class=\"a l\"/><path d=\"M8 36c6-4 10 4 16 0s10 4 16 0 10 4 16 0\" fill=\"none\" class=\"l br\"/> <path d=\"M22 24c-3-4 3-6 0-10M32 24c-3-4 3-6 0-10M42 24c-3-4 3-6 0-10\" fill=\"none\" class=\"l\"/><rect x=\"50\" y=\"10\" width=\"10\" height=\"12\" rx=\"2\" class=\"s l\"/>","solar-battery-electrical":"<path d=\"M4 34L16 10h32l-12 24z\" class=\"s l\" stroke-linejoin=\"round\"/><path d=\"M10 22h32M26 10l-8 24M37 10l-8 24\" class=\"l\"/> <circle cx=\"54\" cy=\"12\" r=\"6\" class=\"a l\"/><rect x=\"40\" y=\"38\" width=\"18\" height=\"22\" rx=\"3\" class=\"d l\"/><rect x=\"45\" y=\"35\" width=\"8\" height=\"4\" class=\"d\"/> <path d=\"M49 42l-3 7h5l-3 7\" fill=\"none\" stroke=\"var(--ic-a)\" stroke-width=\"2.5\"/><path d=\"M20 34v12h20\" fill=\"none\" class=\"l\"/>","electrical-inspection":"<rect x=\"12\" y=\"10\" width=\"40\" height=\"48\" rx=\"4\" class=\"s l\"/><rect x=\"24\" y=\"6\" width=\"16\" height=\"9\" rx=\"2\" class=\"b l\"/> <path d=\"M19 24l3 3 5-6\" fill=\"none\" class=\"l br\"/><path d=\"M32 25h13\" class=\"l\"/><path d=\"M19 34l3 3 5-6\" fill=\"none\" class=\"l br\"/><path d=\"M32 35h13\" class=\"l\"/><path d=\"M19 44l3 3 5-6\" fill=\"none\" class=\"l br\"/><path d=\"M32 45h13\" class=\"l\"/>","commercial-electrical":"<rect x=\"8\" y=\"26\" width=\"48\" height=\"32\" class=\"s l\"/><path d=\"M6 16h52l-2 10H8z\" class=\"b l\"/><path d=\"M14 16v10M22 16v10M30 16v10M38 16v10M46 16v10\" class=\"l\" opacity=\".5\"/> <rect x=\"14\" y=\"34\" width=\"16\" height=\"14\" class=\"a l\"/><rect x=\"36\" y=\"34\" width=\"12\" height=\"24\" class=\"d l\"/>","costs":"<path d=\"M6 30L30 6h24v24L30 54z\" class=\"a l\" stroke-linejoin=\"round\"/><circle cx=\"44\" cy=\"16\" r=\"4\" class=\"s l\"/><path d=\"M28 24v20M33 28c-2-2-9-2-9 2s9 2 9 6-7 4-9 2\" fill=\"none\" class=\"l\"/>","safety":"<path d=\"M32 4l22 8v16c0 14-10 24-22 30C20 52 10 42 10 28V12z\" class=\"s l\" stroke-linejoin=\"round\"/><path d=\"M35 16l-9 15h8l-5 13 12-17h-8l4-11z\" class=\"b l\" stroke-linejoin=\"round\"/>","outages":"<path d=\"M20 58V10M10 16h20M12 24h16\" class=\"l\"/><path d=\"M30 16c8 10 14 12 28 10M28 24c8 8 14 10 30 8\" fill=\"none\" class=\"l\" stroke-dasharray=\"3 4\"/><circle cx=\"48\" cy=\"12\" r=\"7\" class=\"a l\"/><circle cx=\"51\" cy=\"10\" r=\"6\" class=\"d\"/>","ev-solar":"<path d=\"M4 30L14 10h28l-10 20z\" class=\"s l\" stroke-linejoin=\"round\"/><path d=\"M9 20h28M24 10l-7 20\" class=\"l\"/><circle cx=\"52\" cy=\"12\" r=\"6\" class=\"a l\"/> <rect x=\"30\" y=\"38\" width=\"28\" height=\"12\" rx=\"4\" class=\"b l\"/><path d=\"M34 38l4-8h14l4 8\" class=\"s l\"/><circle cx=\"37\" cy=\"52\" r=\"4\" class=\"d\"/><circle cx=\"51\" cy=\"52\" r=\"4\" class=\"d\"/>","older":"<path d=\"M6 28L32 8l26 20\" fill=\"none\" class=\"l\" stroke-linejoin=\"round\"/><rect x=\"12\" y=\"26\" width=\"40\" height=\"32\" class=\"a l\"/><path d=\"M44 16V8h6v12\" class=\"b l\"/> <rect x=\"18\" y=\"34\" width=\"10\" height=\"10\" class=\"s l\"/><path d=\"M23 34v10M18 39h10\" class=\"l\"/><rect x=\"34\" y=\"38\" width=\"12\" height=\"20\" class=\"b l\"/>","rules":"<path d=\"M14 6h26l12 12v40H14z\" class=\"s l\" stroke-linejoin=\"round\"/><path d=\"M40 6v12h12\" fill=\"none\" class=\"l\"/><path d=\"M22 28h22M22 36h22M22 44h12\" class=\"l\"/><circle cx=\"44\" cy=\"48\" r=\"7\" class=\"b l\"/><path d=\"M41 48l2 2 4-4\" fill=\"none\" stroke=\"var(--ic-s)\" stroke-width=\"2.5\"/>","phone":"<path d=\"M18 6h8l4 12-6 4c3 7 8 12 15 15l4-6 12 4v8c0 4-3 7-7 7C27 50 14 37 14 13c0-4 0-7 4-7z\" class=\"a l\"/>","mail":"<rect x=\"6\" y=\"14\" width=\"52\" height=\"36\" rx=\"4\" class=\"s l\"/><path d=\"M8 17l24 19 24-19\" fill=\"none\" class=\"l\"/>","quote":"<rect x=\"12\" y=\"6\" width=\"40\" height=\"52\" rx=\"4\" class=\"s l\"/><path d=\"M20 18h24M20 26h24M20 34h14\" class=\"l\"/><circle cx=\"42\" cy=\"46\" r=\"8\" class=\"a l\"/><path d=\"M42 41v10M45 43c-1-1-6-1-6 1s6 2 6 4-5 2-6 1\" fill=\"none\" class=\"l\"/>","check":"<circle cx=\"32\" cy=\"32\" r=\"26\" class=\"b\"/><path d=\"M20 33l8 8 16-17\" fill=\"none\" stroke=\"var(--ic-s)\" stroke-width=\"7\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>","pin":"<path d=\"M32 58S12 36 12 24a20 20 0 0 1 40 0c0 12-20 34-20 34z\" class=\"b l\"/><circle cx=\"32\" cy=\"24\" r=\"7\" class=\"s l\"/>","clock":"<circle cx=\"32\" cy=\"32\" r=\"24\" class=\"s l\"/><path d=\"M32 18v14l10 6\" fill=\"none\" class=\"l br\"/>","permit":"<rect x=\"14\" y=\"8\" width=\"36\" height=\"48\" rx=\"3\" class=\"s l\"/><path d=\"M22 22h20M22 30h20M22 38h12\" class=\"l\"/><circle cx=\"42\" cy=\"46\" r=\"6\" class=\"b l\"/>","tower":"<path d=\"M32 6L18 58M32 6l14 52M22 40h20M25 28h14M14 16h36\" fill=\"none\" class=\"l\"/><circle cx=\"14\" cy=\"16\" r=\"3\" class=\"b\"/><circle cx=\"50\" cy=\"16\" r=\"3\" class=\"b\"/>","mountain":"<path d=\"M2 56L22 22l10 14 10-18 20 38z\" class=\"s l\" stroke-linejoin=\"round\"/><path d=\"M22 22l-5 9 5-2 4 4zM42 18l-5 9 5-2 4 4z\" class=\"a\"/><circle cx=\"50\" cy=\"10\" r=\"5\" class=\"a l\"/>"};
  function cx() { return Array.prototype.filter.call(arguments, Boolean).join(' '); }
  function Icon(p) {
    var size = p.size || 40;
    return h('svg', { className: cx('o8-ic', p.className), viewBox: '0 0 64 64', width: size, height: size, 'aria-hidden': 'true', focusable: 'false', dangerouslySetInnerHTML: { __html: ICONS[p.name] || '' } });
  }
  function Button(p) {
    var cls = cx('o8-btn', 'o8-btn-' + (p.variant || 'primary'), p.size === 'lg' && 'o8-btn-lg', p.block && 'o8-btn-block');
    var kids = [p.icon ? h(Icon, { key: 'i', name: p.icon, size: 20, className: 'o8-btn-ic' }) : null, h('span', { key: 't' }, p.children)];
    return p.href ? h('a', { className: cls, href: p.href }, kids) : h('button', { className: cls, type: p.type || 'button', onClick: p.onClick }, kids);
  }
  function Medal(p) {
    return h('div', { className: cx('o8-medal', p.size === 'sm' && 'o8-medal-sm'), 'aria-hidden': 'true' }, h(Icon, { name: p.icon, size: p.size === 'sm' ? 44 : 120 }));
  }
  var MARK = '<circle cx="60" cy="60" r="57" fill="#16302F"/><circle cx="60" cy="60" r="52" fill="none" stroke="#B9481F" stroke-width="9"/><clipPath id="o8m"><circle cx="60" cy="60" r="47.5"/></clipPath><g clip-path="url(#o8m)"><circle cx="38" cy="36" r="5" fill="#E7CF97"/><path d="M0,104 L30,70 L44,82 L64,52 L86,80 L98,70 L120,96 L120,120 L0,120Z" fill="#D8E3E2"/><path d="M0,112 L22,92 L38,100 L58,84 L80,98 L100,88 L120,104 L120,120 L0,120Z" fill="#1F403E"/><path d="M72,18 L62,46 L70,45 L63,66 L80,38 L72,39 L78,18Z" fill="#fff"/></g>';
  function Logo(p) {
    var mark = h('svg', { className: 'o8-logo-mark', viewBox: '0 0 120 120', width: p.size || 52, height: p.size || 52, 'aria-hidden': 'true', dangerouslySetInnerHTML: { __html: MARK } });
    if (p.variant === 'mark') return h('span', { className: 'o8-logo', role: 'img', 'aria-label': 'Off 80 Electric' }, mark);
    return h('span', { className: 'o8-logo', role: 'img', 'aria-label': 'Off 80 Electric' }, mark, h('span', { className: 'o8-logo-word', 'aria-hidden': 'true' }, h('span', { className: 'o8-logo-off' }, 'Off 80'), h('span', { className: 'o8-logo-sub' }, 'Electric')));
  }
  function ServiceTile(p) {
    return h('a', { className: 'o8-svc', href: p.href || '#' }, h(Icon, { name: p.icon, size: 64, className: 'o8-svc-ic' }),
      h('span', { className: 'o8-svc-text' }, h('span', { className: 'o8-svc-name' }, p.name), p.blurb && h('span', { className: 'o8-svc-blurb' }, p.blurb), p.cost && h('span', { className: 'o8-svc-cost' }, 'Typical cost: ' + p.cost)));
  }
  function FeaturedService(p) {
    return h('a', { className: 'o8-feat', href: p.href || '#' }, h('span', { className: 'o8-feat-medal', 'aria-hidden': 'true' }, h(Icon, { name: p.icon, size: 58 })),
      h('span', { className: 'o8-feat-name' }, p.name), h('span', { className: 'o8-feat-blurb' }, p.blurb),
      h('span', { className: 'o8-feat-cost' }, 'Typical cost ', h('strong', null, p.cost)), h('span', { className: 'o8-feat-go' }, p.linkLabel || 'Details'));
  }
  function UtilityTag(p) {
    var k = /^PG/.test(p.utility) ? 'pge' : /^SMUD/.test(p.utility) ? 'smud' : 'roseville';
    return h('span', { className: 'o8-util o8-util-' + k }, p.utility);
  }
  function TownCard(p) {
    return h('a', { className: cx('o8-town', p.home && 'is-home'), href: p.href || '#' },
      h('span', { className: 'o8-town-head' }, h('span', { className: 'o8-town-name' }, p.name), p.home ? h('span', { className: 'o8-town-tag' }, 'Home base') : null),
      h('span', { className: 'o8-town-blurb' }, p.blurb), p.utility && h('span', null, h(UtilityTag, { utility: p.utility })),
      p.services && h('span', { className: 'o8-town-svcs' }, p.services.map(function (s, i) { return h('span', { key: i }, h(Icon, { name: s.icon, size: 22 }), s.label); })));
  }
  function Chip(p) { return h('a', { className: 'o8-chip', href: p.href || '#' }, p.children); }
  function JumpMenu(p) {
    return h('nav', { className: 'o8-jump', 'aria-label': 'On this page' }, h('span', { className: 'o8-jump-h' }, 'On this page'),
      h('ul', null, (p.items || []).map(function (it, i) { return h('li', { key: i }, h('a', { href: it.href }, it.label)); })));
  }
  function QuestionList(p) {
    return h('ul', { className: 'o8-qs' }, (p.items || []).map(function (q, i) {
      return h('li', { key: i }, h('a', { href: q.href || '#' }, h(Icon, { name: q.icon, size: 40, className: 'o8-qs-ic' }), h('span', { className: 'o8-qs-q' }, q.question), h('span', { className: 'o8-qs-a' }, q.answer)));
    }));
  }
  function TickList(p) {
    return h('ul', { className: 'o8-ticks' }, (p.items || []).map(function (t, i) { return h('li', { key: i }, h(Icon, { name: 'check', size: 22 }), h('span', null, t)); }));
  }
  function AtAGlance(p) {
    return h('div', { className: 'o8-glance' }, h('h3', { className: 'o8-glance-h' }, p.title || 'At a glance'), h('p', { className: 'o8-glance-cost' }, p.cost), p.note && h('p', { className: 'o8-glance-note' }, p.note),
      h('dl', null, (p.rows || []).map(function (r, i) { return h('div', { key: i }, h('dt', null, r.label), h('dd', null, r.value)); })),
      h('p', { className: 'o8-glance-fine' }, p.fine || 'Every job is quoted in writing before work starts.'));
  }
  function FaqItem(p) {
    return h('details', { className: 'o8-faq', open: p.open }, h('summary', null, h('h3', null, p.question)), h('p', null, p.children));
  }
  function Steps(p) {
    return h('ol', { className: 'o8-steps' }, (p.steps || []).map(function (s, i) { return h('li', { key: i }, h('h3', null, s.title), h('p', null, s.text)); }));
  }
  function FactList(p) {
    return h('dl', { className: 'o8-facts' }, (p.facts || []).map(function (f, i) { return h('div', { key: i }, h(Icon, { name: f.icon, size: 34 }), h('dt', null, f.label), h('dd', null, f.value)); }));
  }
  function CtaBand(p) {
    return h('aside', { className: 'o8-cta', 'aria-label': 'Get in touch' }, h('p', null, p.text),
      h('div', { className: 'o8-cta-actions' }, h(Button, { href: p.quoteHref || '#quote' }, 'Request a quote'), h(Button, { variant: 'outline', href: 'tel:' + (p.phone || '+15303685077').replace(/[^+\d]/g, '') }, 'Give us a call')));
  }
  var HELP = [
    { key: 'quote', icon: 'quote', name: 'Request a quote', note: 'Free for projects. Add photos if you have them.' },
    { key: 'call', icon: 'phone', name: 'Give us a call', note: '(530) 368-5077, Mon–Fri 7am–5pm' },
    { key: 'message', icon: 'mail', name: 'Send a message', note: 'Questions or scheduling. We reply within one business day.' },
    { key: 'emergency', icon: 'emergency-electrician', name: 'Electrical emergency', note: 'Burning smell, sparks, or part of the house without power' }
  ];
  function HelpChooser(p) {
    return h('div', { className: 'o8-help' }, p.title !== false && h('h2', { className: 'o8-help-title' }, p.title || 'How can we help?'),
      h('ul', null, HELP.map(function (o) {
        return h('li', { key: o.key }, h('a', { className: 'o8-help-opt o8-help-' + o.key, href: (p.hrefs && p.hrefs[o.key]) || '#' + o.key, onClick: p.onPick ? function (e) { e.preventDefault(); p.onPick(o.key); } : undefined },
          h(Icon, { name: o.icon, size: 56, className: 'o8-help-ic' }), h('span', { className: 'o8-help-text' }, h('span', { className: 'o8-help-name' }, o.name), h('span', { className: 'o8-help-note' }, o.note))));
      })));
  }
  function Field(p) {
    var id = 'o8-' + p.name;
    var ctl = p.as === 'select' ? h('select', { id: id, name: p.name, defaultValue: p.value || '' }, [h('option', { key: '', value: '' }, p.placeholder || 'Choose one')].concat((p.options || []).map(function (o) { return h('option', { key: o }, o); })))
      : p.as === 'textarea' ? h('textarea', { id: id, name: p.name, rows: 3, placeholder: p.placeholder })
      : h('input', { id: id, name: p.name, type: p.type || 'text', required: p.required, placeholder: p.placeholder });
    return h('div', { className: cx('o8-field', p.wide && 'o8-field-wide') }, h('label', { htmlFor: id }, p.label, p.optional ? h('span', { className: 'o8-opt' }, ' (optional)') : null), ctl);
  }
  function QuoteForm(p) {
    return h('form', { className: 'o8-form', onSubmit: function (e) { e.preventDefault(); } },
      h(Field, { name: 'name', label: 'Name', required: true }), h(Field, { name: 'phone', label: 'Phone', type: 'tel', required: true }),
      h(Field, { name: 'email', label: 'Email', type: 'email', optional: true }), h(Field, { name: 'town', label: 'Town', as: 'select', options: p.towns || [], placeholder: 'Choose your town' }),
      h(Field, { name: 'service', label: 'What do you need?', as: 'select', options: p.services || [], value: p.service, wide: true, placeholder: 'Choose a service' }),
      h(Field, { name: 'details', label: 'Details', as: 'textarea', wide: true, placeholder: 'Panel brand, what’s happening, best time to call' }),
      h(Field, { name: 'photos', label: 'Photos', type: 'file', optional: true, wide: true }),
      h(Button, { type: 'submit', block: true }, 'Request a quote'),
      h('p', { className: 'o8-form-note' }, 'We’ll send a confirmation from info@off80electric.com. Can’t find it? Check your spam or promotions folder.'));
  }
  function EmergencySteps(p) {
    var phone = p.phone || '(530) 368-5077';
    return h('div', { className: 'o8-em' }, h('ol', null,
      h('li', null, h('strong', null, 'Turn off the breaker'), ' for that area, or the main breaker if you’re not sure which one.'),
      h('li', null, h('strong', null, 'Smoke or flames?'), ' Get everyone out and call 911.'),
      h('li', null, h('strong', null, 'Power line down?'), ' Stay 30 feet away and call your utility.'),
      h('li', null, h('strong', null, 'Then call us.'), ' We’ll tell you if it’s safe to wait.')),
      h(Button, { variant: 'primary', size: 'lg', block: true, icon: 'phone', href: 'tel:' + phone.replace(/[^\d+]/g, '') }, 'Call ' + phone));
  }
  window.Off80 = Object.assign(window.Off80 || {}, { Button: Button, Icon: Icon, Medal: Medal, Logo: Logo, ServiceTile: ServiceTile, FeaturedService: FeaturedService, TownCard: TownCard, UtilityTag: UtilityTag, Chip: Chip, JumpMenu: JumpMenu, QuestionList: QuestionList, TickList: TickList, AtAGlance: AtAGlance, FaqItem: FaqItem, Steps: Steps, FactList: FactList, CtaBand: CtaBand, HelpChooser: HelpChooser, QuoteForm: QuoteForm, EmergencySteps: EmergencySteps, Field: Field, ICON_NAMES: Object.keys(ICONS) });
})();