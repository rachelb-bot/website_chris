// Spot illustrations in the style of the badge: flat fills of snow, tan and rust with a night-teal line.
// Each is a 64×64 symbol. Classes: l = line, a = tan fill, b = rust fill, s = snow fill, d = dark fill.
// Colors come from CSS custom properties so the same drawing works on light and dark surfaces.
const L = 'class="l"';
export const icons = {
  'panel-upgrades': `<rect x="14" y="6" width="36" height="52" rx="3" class="s" ${L}/><rect x="20" y="12" width="24" height="7" rx="1.5" class="b" ${L}/>
    ${[24, 31, 38, 45].map((y) => `<rect x="20" y="${y}" width="10" height="4.5" rx="1" class="a" ${L}/><rect x="34" y="${y}" width="10" height="4.5" rx="1" class="a" ${L}/>`).join('')}
    <path d="M32 24v26" ${L}/>`,
  'ev-charger-installation': `<rect x="8" y="10" width="20" height="32" rx="4" class="a" ${L}/><path d="M19 17l-5 9h6l-4 9" class="l" fill="none"/>
    <path d="M18 42v6c0 6 6 8 12 8h8" fill="none" ${L}/><rect x="38" y="50" width="10" height="10" rx="2" class="b" ${L}/>
    <path d="M40 30h18l-3-8H43z" class="s" ${L}/><rect x="38" y="30" width="22" height="10" rx="3" class="s" ${L}/><circle cx="43" cy="41" r="3" class="d"/><circle cx="55" cy="41" r="3" class="d"/>`,
  'generator-installation': `<rect x="8" y="18" width="48" height="30" rx="4" class="a" ${L}/><path d="M16 18v-6h32v6" fill="none" ${L}/>
    <rect x="14" y="24" width="18" height="18" rx="2" class="s" ${L}/><path d="M25 27l-5 7h5l-3 6" fill="none" ${L}/>
    <circle cx="44" cy="30" r="3" class="b" ${L}/><path d="M38 38h12" ${L}/><circle cx="16" cy="52" r="5" class="d"/><circle cx="48" cy="52" r="5" class="d"/>`,
  'electrical-repair': `<rect x="12" y="8" width="30" height="44" rx="5" class="s" ${L}/><rect x="20" y="16" width="14" height="10" rx="4" class="a" ${L}/><rect x="20" y="32" width="14" height="10" rx="4" class="a" ${L}/>
    <path d="M24 19v4M30 19v4M24 35v4M30 35v4" ${L}/><path d="M38 44l16 16" stroke-width="5" class="l"/><circle cx="36" cy="42" r="6" class="b" ${L}/>`,
  'emergency-electrician': `<path d="M32 6L58 54H6z" class="b" ${L} stroke-linejoin="round"/><path d="M35 20l-9 16h8l-5 12 12-18h-8l4-10z" class="s" ${L} stroke-linejoin="round"/>`,
  'home-rewiring': `<rect x="4" y="22" width="56" height="14" class="a" ${L}/><path d="M4 29h56" class="l" opacity=".35"/>
    ${[14, 32, 50].map((x) => `<circle cx="${x}" cy="18" r="5" class="s" ${L}/>`).join('')}
    <path d="M6 14c4 0 4 4 8 4s4-4 9-4 5 4 9 4 4-4 9-4 5 4 9 4 4-4 8-4" fill="none" class="l br"/>
    <path d="M14 36v14M50 36v14" ${L}/><rect x="9" y="48" width="10" height="10" rx="2" class="s" ${L}/><rect x="45" y="48" width="10" height="10" rx="2" class="s" ${L}/>`,
  'lighting-installation': `<path d="M32 4v12" ${L}/><path d="M20 16h24l-4 10H24z" class="d" ${L}/><circle cx="32" cy="36" r="10" class="a" ${L}/>
    <path d="M32 52v6M14 36H8M56 36h-6M19 49l-4 4M45 49l4 4M19 23l-4-4M45 23l4-4" class="l br"/>`,
  'outbuilding-well-pump-wiring': `<path d="M6 30L24 14l18 16v26H6z" class="b" ${L} stroke-linejoin="round"/><rect x="16" y="38" width="16" height="18" class="s" ${L}/><path d="M16 38l16 18M32 38L16 56" ${L}/>
    <path d="M52 8v48M46 14h12" ${L}/><path d="M46 14c-6 6-12 8-20 6" fill="none" class="l br"/><rect x="44" y="48" width="16" height="8" rx="2" class="a" ${L}/>`,
  'hot-tub-spa-wiring': `<path d="M8 30h48v18a6 6 0 0 1-6 6H14a6 6 0 0 1-6-6z" class="a" ${L}/><path d="M8 36c6-4 10 4 16 0s10 4 16 0 10 4 16 0" fill="none" class="l br"/>
    <path d="M22 24c-3-4 3-6 0-10M32 24c-3-4 3-6 0-10M42 24c-3-4 3-6 0-10" fill="none" ${L}/><rect x="50" y="10" width="10" height="12" rx="2" class="s" ${L}/>`,
  'solar-battery-electrical': `<path d="M4 34L16 10h32l-12 24z" class="s" ${L} stroke-linejoin="round"/><path d="M10 22h32M26 10l-8 24M37 10l-8 24" ${L}/>
    <circle cx="54" cy="12" r="6" class="a" ${L}/><rect x="40" y="38" width="18" height="22" rx="3" class="d" ${L}/><rect x="45" y="35" width="8" height="4" class="d"/>
    <path d="M49 42l-3 7h5l-3 7" fill="none" stroke="var(--ic-a)" stroke-width="2.5"/><path d="M20 34v12h20" fill="none" ${L}/>`,
  'electrical-inspection': `<rect x="12" y="10" width="40" height="48" rx="4" class="s" ${L}/><rect x="24" y="6" width="16" height="9" rx="2" class="b" ${L}/>
    ${[24, 34, 44].map((y) => `<path d="M19 ${y}l3 3 5-6" fill="none" class="l br"/><path d="M32 ${y + 1}h13" ${L}/>`).join('')}`,
  'commercial-electrical': `<rect x="8" y="26" width="48" height="32" class="s" ${L}/><path d="M6 16h52l-2 10H8z" class="b" ${L}/><path d="M14 16v10M22 16v10M30 16v10M38 16v10M46 16v10" class="l" opacity=".5"/>
    <rect x="14" y="34" width="16" height="14" class="a" ${L}/><rect x="36" y="34" width="12" height="24" class="d" ${L}/>`,
  // guide topics
  costs: `<path d="M6 30L30 6h24v24L30 54z" class="a" ${L} stroke-linejoin="round"/><circle cx="44" cy="16" r="4" class="s" ${L}/><path d="M28 24v20M33 28c-2-2-9-2-9 2s9 2 9 6-7 4-9 2" fill="none" class="l"/>`,
  safety: `<path d="M32 4l22 8v16c0 14-10 24-22 30C20 52 10 42 10 28V12z" class="s" ${L} stroke-linejoin="round"/><path d="M35 16l-9 15h8l-5 13 12-17h-8l4-11z" class="b" ${L} stroke-linejoin="round"/>`,
  outages: `<path d="M20 58V10M10 16h20M12 24h16" ${L}/><path d="M30 16c8 10 14 12 28 10M28 24c8 8 14 10 30 8" fill="none" class="l" stroke-dasharray="3 4"/><circle cx="48" cy="12" r="7" class="a" ${L}/><circle cx="51" cy="10" r="6" class="d"/>`,
  'ev-solar': `<path d="M4 30L14 10h28l-10 20z" class="s" ${L} stroke-linejoin="round"/><path d="M9 20h28M24 10l-7 20" ${L}/><circle cx="52" cy="12" r="6" class="a" ${L}/>
    <rect x="30" y="38" width="28" height="12" rx="4" class="b" ${L}/><path d="M34 38l4-8h14l4 8" class="s" ${L}/><circle cx="37" cy="52" r="4" class="d"/><circle cx="51" cy="52" r="4" class="d"/>`,
  older: `<path d="M6 28L32 8l26 20" fill="none" ${L} stroke-linejoin="round"/><rect x="12" y="26" width="40" height="32" class="a" ${L}/><path d="M44 16V8h6v12" class="b" ${L}/>
    <rect x="18" y="34" width="10" height="10" class="s" ${L}/><path d="M23 34v10M18 39h10" ${L}/><rect x="34" y="38" width="12" height="20" class="b" ${L}/>`,
  rules: `<path d="M14 6h26l12 12v40H14z" class="s" ${L} stroke-linejoin="round"/><path d="M40 6v12h12" fill="none" ${L}/><path d="M22 28h22M22 36h22M22 44h12" ${L}/><circle cx="44" cy="48" r="7" class="b" ${L}/><path d="M41 48l2 2 4-4" fill="none" stroke="var(--ic-s)" stroke-width="2.5"/>`,
  phone: `<path d="M18 6h8l4 12-6 4c3 7 8 12 15 15l4-6 12 4v8c0 4-3 7-7 7C27 50 14 37 14 13c0-4 0-7 4-7z" class="a" class="l"/>`,
  mail: `<rect x="6" y="14" width="52" height="36" rx="4" class="s" class="l"/><path d="M8 17l24 19 24-19" fill="none" class="l"/>`,
  quote: `<rect x="12" y="6" width="40" height="52" rx="4" class="s" class="l"/><path d="M20 18h24M20 26h24M20 34h14" class="l"/><circle cx="42" cy="46" r="8" class="a" class="l"/><path d="M42 41v10M45 43c-1-1-6-1-6 1s6 2 6 4-5 2-6 1" fill="none" class="l"/>`,
  check: `<circle cx="32" cy="32" r="26" class="b"/><path d="M20 33l8 8 16-17" fill="none" stroke="var(--ic-s)" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>`,
  pin: `<path d="M32 58S12 36 12 24a20 20 0 0 1 40 0c0 12-20 34-20 34z" class="b" ${L}/><circle cx="32" cy="24" r="7" class="s" ${L}/>`,
  clock: `<circle cx="32" cy="32" r="24" class="s" ${L}/><path d="M32 18v14l10 6" fill="none" class="l br"/>`,
  permit: `<rect x="14" y="8" width="36" height="48" rx="3" class="s" ${L}/><path d="M22 22h20M22 30h20M22 38h12" ${L}/><circle cx="42" cy="46" r="6" class="b" ${L}/>`,
  tower: `<path d="M32 6L18 58M32 6l14 52M22 40h20M25 28h14M14 16h36" fill="none" ${L}/><circle cx="14" cy="16" r="3" class="b"/><circle cx="50" cy="16" r="3" class="b"/>`,
  mountain: `<path d="M2 56L22 22l10 14 10-18 20 38z" class="s" ${L} stroke-linejoin="round"/><path d="M22 22l-5 9 5-2 4 4zM42 18l-5 9 5-2 4 4z" class="a"/><circle cx="50" cy="10" r="5" class="a" ${L}/>`,
};

// Merge the separate class attributes (class="s" class="l") into one, since duplicate attributes are dropped.
const tidy = (v) => v.replace(/class="([^"]+)"\s+class="([^"]+)"/g, 'class="$1 $2"').replace(/\s+/g, ' ');
export const iconSprite = () => `<svg class="sprite" width="0" height="0" style="position:absolute" aria-hidden="true" focusable="false"><defs>${Object.entries(icons).map(([k, v]) => `<symbol id="ic-${k}" viewBox="0 0 64 64">${tidy(v)}</symbol>`).join('')}</defs></svg>`;
export const icon = (name, cls = 'ic') => `<svg class="${cls}" aria-hidden="true" focusable="false"><use href="#ic-${name}"/></svg>`;
