// Guides: one question per page, answered first (AEO).
// Each lives at /guides/<slug>/. `services` links to related service pages.
// Facts reflect California rules as of 2026 — TODO: owner to review before launch.

export const guideTopics = [
  { key: 'costs', name: 'Costs and pricing' },
  { key: 'safety', name: 'Safety and warning signs' },
  { key: 'outages', name: 'Outages, PSPS and generators' },
  { key: 'ev-solar', name: 'EV charging, solar and batteries' },
  { key: 'older', name: 'Older homes and wiring' },
  { key: 'rules', name: 'Permits, codes and hiring' },
];

export const guides = [
  // ───────── Costs ─────────
  {
    slug: 'panel-upgrade-cost', topic: 'costs',
    q: 'How much does a panel upgrade cost in Placer County and Sacramento?',
    title: 'Panel Upgrade Cost in Placer County & Sacramento (2026)',
    meta: 'A typical 200-amp panel upgrade costs $3,000–$6,500 in Placer and Sacramento counties. What changes the price, how long it takes and what the utility does.',
    answer: 'A typical 100-to-200-amp panel upgrade in Placer and Sacramento counties costs $3,000 to $6,500, including the permit. Jobs that move the meter, replace an underground service lateral or require a combination meter-main can run $7,000 to $12,000 or more.',
    facts: [
      'Typical range: $3,000–$6,500 for a same-location 200-amp upgrade',
      'Work day: usually one day, power off 4–8 hours',
      'Permit and inspection: always required',
      'Utility scheduling (PG&E, SMUD or Roseville Electric) usually sets the timeline',
      'Since the 2022 California Electrical Code, a whole-home surge protector is required on service upgrades',
    ],
    sections: [
      { h: 'What’s included in the price', p: [
        'A standard quote covers the new panel and breakers, a new main disconnect, the surge protective device now required by code, grounding and bonding upgrades, labeling, the permit fee, and coordination with your utility for the disconnect and reconnect.',
      ]},
      { h: 'What makes a panel upgrade cost more', p: [
        'Moving the panel or meter to a new location, replacing an overhead service mast, or upgrading an underground lateral all add materials and labor. So does fixing problems the inspector will require once the wall is open, like undersized grounding, missing bonding to gas and water lines, or double-tapped breakers.',
        'Rural foothill properties sometimes need a new meter pedestal or longer feeders to outbuildings, which we price separately so you can see each piece.',
      ]},
      { h: 'How long the whole process takes', p: [
        'The electrical work is usually one day. The wait is the utility: PG&E service upgrades often take several weeks to schedule, while SMUD and Roseville Electric are often faster. Pulling the permit typically takes a few days.',
      ]},
    ],
    faqs: [
      { q: 'Is a panel upgrade worth it?', a: 'If your panel is a Federal Pacific or Zinsco, still uses fuses, or can’t carry an EV charger or heat pump you plan to add, yes. If your existing 200-amp panel is in good shape, a load-management device may be the cheaper fix.' },
      { q: 'Does homeowners insurance pay for a panel upgrade?', a: 'Usually not as routine maintenance. Some insurers require replacement of Federal Pacific, Zinsco or fuse panels as a condition of coverage, but the homeowner pays for it.' },
      { q: 'Can I stay home during a panel upgrade?', a: 'Yes, but you will be without power for most of the work day. Plan for no internet, refrigeration or HVAC for 4–8 hours.' },
    ],
    services: ['panel-upgrades', 'ev-charger-installation', 'solar-battery-electrical'],
  },
  {
    slug: 'ev-charger-installation-cost', topic: 'costs',
    q: 'How much does it cost to install a home EV charger?',
    title: 'EV Charger Installation Cost in Sacramento & Placer County',
    meta: 'Most Level 2 home EV charger installs cost $800–$2,500 in the Sacramento and Placer County area, plus the charger. What drives cost and when you need a panel upgrade.',
    answer: 'Installing a Level 2 home EV charger in the Sacramento and Placer County area typically costs $800 to $2,500 for labor, materials and permit, plus $400 to $700 for the charger itself. The biggest cost factors are the distance from your panel and whether the panel has room for a 40–60 amp circuit.',
    facts: [
      'Typical install: $800–$2,500, charger extra',
      'Circuit: 240V, usually 40–60 amps',
      'Time: half a day for most garage installs',
      'Permit and inspection: required',
      'A full panel may need load management ($400–$1,200) or a panel upgrade',
    ],
    sections: [
      { h: 'Low end vs high end', p: [
        'The lowest-cost installs are a charger on the garage wall a few feet from a panel with open breaker space. Costs climb with long runs through finished walls or attics, detached garages that need trenching, exterior chargers at the driveway, and panels that need rearranging or upgrading.',
      ]},
      { h: 'If your panel is full', p: [
        'A load calculation tells us whether your service can take the new circuit. If it can’t, options include a smaller circuit (32 amps still adds about 25 miles of range per hour), an energy-management device that pauses the charger when the house is busy, or a panel upgrade.',
      ]},
    ],
    faqs: [
      { q: 'Is it cheaper to install a 14-50 outlet than a hardwired charger?', a: 'Slightly, but a hardwired charger is usually the better long-term choice. It supports higher charging speeds and avoids the overheating seen on cheap receptacles that are plugged and unplugged often.' },
      { q: 'Are there rebates for EV chargers?', a: 'SMUD and Roseville Electric have both offered EV charger incentives in recent years, and PG&E customers should check current programs. Rebates change often, so confirm what’s available before buying hardware.' },
      { q: 'How long does an EV charger install take?', a: 'Most garage installs take 3–5 hours. Jobs with trenching or a panel upgrade take longer.' },
    ],
    services: ['ev-charger-installation', 'panel-upgrades'],
  },
  {
    slug: 'electrician-cost-per-hour', topic: 'costs',
    q: 'How much does an electrician cost in Placer County?',
    title: 'How Much Does an Electrician Cost in Placer County? (2026)',
    meta: 'Licensed electricians in Placer and Sacramento counties typically charge $110–$175 an hour, with most service calls $150–$450. What’s included and how jobs are priced.',
    answer: 'Licensed electricians in Placer and Sacramento counties typically charge $110 to $175 per hour, and most small repairs and service calls cost $150 to $450 in total. Larger jobs like panel upgrades, EV chargers and rewiring are usually quoted as a fixed price after a site visit.',
    facts: [
      'Hourly rates: about $110–$175 for a licensed electrician',
      'Service calls and small repairs: $150–$450 typical',
      'After-hours and emergency calls cost more',
      'Projects are usually priced per job, not per hour',
      'Work over $1,000 (labor and materials) requires a licensed contractor in California',
    ],
    sections: [
      { h: 'Flat price vs hourly', p: [
        'Troubleshooting is usually billed by time, because finding the fault is the work. Defined projects like a panel upgrade, EV charger or spa hookup are better priced as a flat, written quote, so you know the total before work starts.',
      ]},
      { h: 'Why cheap quotes cost more', p: [
        'Unlicensed or unpermitted work is a common reason foothill home sales stall in escrow and insurance claims get denied. In California, any job over $1,000 in labor and materials must be done by a licensed contractor, and electrical work on that scale almost always needs a permit.',
      ]},
    ],
    faqs: [
      { q: 'Do electricians charge a trip fee?', a: 'Many do, typically $75–$150 for a diagnostic visit, often credited toward the repair. Ask before booking.' },
      { q: 'Are estimates free?', a: 'Most electricians, including us, give free estimates for defined projects. Diagnostic visits for unknown problems usually carry a fee.' },
      { q: 'Why do rural foothill jobs sometimes cost more?', a: 'Longer drives, longer wire runs to outbuildings, rocky trenching and well-pump work add time and materials compared with a valley tract home.' },
    ],
    services: ['electrical-repair', 'panel-upgrades', 'electrical-inspection'],
  },
  {
    slug: 'generator-hookup-cost', topic: 'costs',
    q: 'How much does it cost to hook up a generator to a house?',
    title: 'Generator Hookup Cost: Interlock, Transfer Switch & Standby',
    meta: 'A generator interlock and inlet costs about $900–$2,200 installed. Manual transfer switches and whole-home standby generators cost more. Prices for the Sierra foothills.',
    answer: 'Connecting a portable generator safely with an interlock kit and an outdoor inlet box typically costs $900 to $2,200 installed in the Sierra foothills. A manual transfer switch runs about $1,200 to $2,800, and a whole-home automatic standby generator usually costs $10,000 to $20,000 installed.',
    facts: [
      'Interlock + inlet box: $900–$2,200',
      'Manual transfer switch: $1,200–$2,800',
      'Automatic standby generator: $10,000–$20,000 installed',
      'All methods require a permit',
      'Never back-feed with a double-male cord',
    ],
    sections: [
      { h: 'Which option fits', p: [
        'An interlock is the most affordable way to run a portable generator through your panel and lets you power any circuit, as long as you stay under the generator’s capacity. A transfer switch limits you to pre-selected circuits but is simpler to operate. A standby generator starts on its own and is the choice for medical needs, frequent outages or homes where nobody wants to haul a generator out in a storm.',
      ]},
      { h: 'Extra costs to expect', p: [
        'Standby units need a concrete or composite pad, a gas or propane line sized for the generator, and sometimes a larger propane tank. Long runs from the generator location to the panel add wire and trenching.',
      ]},
    ],
    faqs: [
      { q: 'Is an interlock cheaper than a transfer switch?', a: 'Usually yes. An interlock is a mechanical plate and a breaker, while a transfer switch is a separate subpanel with its own wiring.' },
      { q: 'Does a standby generator add home value?', a: 'In PSPS-prone foothill areas, buyers often see standby power as a strong feature, though the value added varies by market.' },
    ],
    services: ['generator-installation'],
  },

  // ───────── Safety ─────────
  {
    slug: 'breaker-keeps-tripping', topic: 'safety',
    q: 'Why does my breaker keep tripping?',
    title: 'Why Does My Breaker Keep Tripping? Causes & Fixes',
    meta: 'A breaker that keeps tripping is usually an overload, a short circuit, a ground fault or a worn breaker. How to tell which, what you can safely check, and when to call.',
    answer: 'A breaker keeps tripping because of one of four things: too much load on the circuit, a short circuit, a ground fault, or a worn-out breaker. If it trips when a specific appliance runs, it’s usually overload or that appliance. If it trips immediately with nothing plugged in, there’s likely a short in the wiring and it should stay off until an electrician checks it.',
    facts: [
      'Overload: trips after a few minutes of heavy use',
      'Short circuit: trips instantly, sometimes with a pop',
      'Ground fault: trips GFCI/AFCI breakers, often after rain or near water',
      'Old breakers can weaken and trip below their rating',
      'Never replace a breaker with a larger one to stop tripping',
    ],
    sections: [
      { h: 'What you can safely check', p: [
        'Note what was running when it tripped. Unplug everything on that circuit, reset the breaker, then plug things back in one at a time. If one appliance causes the trip every time, the appliance is likely the problem. If the circuit trips under normal use, you may need another circuit.',
      ]},
      { h: 'When to stop and call an electrician', p: [
        'Call if the breaker trips with nothing connected, won’t reset, feels hot, or if you smell burning or see scorch marks on outlets or the panel. Also call if it’s an AFCI breaker that trips repeatedly: these detect arcing in the wiring that you can’t see.',
      ]},
    ],
    faqs: [
      { q: 'Can a breaker go bad?', a: 'Yes. Breakers wear out, especially in older panels, and can trip below their rated load or fail to trip at all. Federal Pacific and Zinsco breakers are known for failing to trip.' },
      { q: 'Is it dangerous if a breaker keeps tripping?', a: 'The breaker is doing its job, but the cause can be dangerous. Repeated tripping should be diagnosed rather than ignored or reset over and over.' },
      { q: 'Why does my GFCI trip when it rains?', a: 'Moisture in an outdoor outlet, light fixture or buried cable creates a ground fault. The fix is finding and sealing or replacing the wet device.' },
    ],
    services: ['electrical-repair', 'panel-upgrades'],
  },
  {
    slug: 'burning-smell-from-outlet', topic: 'safety',
    q: 'What should I do if an outlet smells like burning?',
    title: 'Burning Smell From an Outlet or Panel: What To Do Now',
    meta: 'A burning plastic smell from an outlet, switch or panel means overheating. Turn off the breaker, stop using it and call an electrician. Step-by-step safety guidance.',
    answer: 'If an outlet, switch or panel smells like burning plastic, turn off the breaker for that circuit right away, unplug anything you can reach safely, and don’t use it again until an electrician inspects it. If you see smoke or flames, leave the house and call 911.',
    facts: [
      'Burning plastic or fishy smell = overheating insulation',
      'Turn off that circuit’s breaker (or the main if unsure)',
      'Don’t touch a hot or scorched outlet or panel',
      'Smoke or flames: get out and call 911',
      'Common causes: loose connections, overloaded outlets, failing devices',
    ],
    sections: [
      { h: 'Why outlets overheat', p: [
        'The most common cause is a loose wire connection, often a “backstabbed” wire pushed into the back of a cheap receptacle. Loose connections create resistance and heat. Space heaters and other high-draw appliances on worn outlets are another frequent cause, as are aluminum branch wiring connections in some 1960s–70s homes.',
      ]},
      { h: 'What the repair usually involves', p: [
        'We open the box, check for heat damage to the wires and box, cut back damaged conductors, replace the device with a properly rated one, and test the rest of the circuit for the same problem, since one bad connection is often a sign of others.',
      ]},
    ],
    faqs: [
      { q: 'Why does my outlet smell like fish?', a: 'A fishy smell often comes from overheating plastic or the chemicals in electrical insulation. Treat it the same as a burning smell: shut off the circuit and have it inspected.' },
      { q: 'Can a burning outlet start a fire if nothing is plugged in?', a: 'Yes. A loose connection can overheat whenever current flows through the box, including power passing through to other outlets downstream.' },
    ],
    services: ['emergency-electrician', 'electrical-repair'],
  },
  {
    slug: 'flickering-lights', topic: 'safety',
    q: 'Why are my lights flickering?',
    title: 'Why Are My Lights Flickering? When It’s Serious',
    meta: 'Flickering lights can be a loose bulb, an incompatible dimmer, a loose connection or a failing utility neutral. How to tell which, and which causes need an electrician fast.',
    answer: 'Lights that flicker in one fixture are usually a loose bulb, a failing LED or an incompatible dimmer. Flickering across several rooms, or lights that get brighter and dimmer when big appliances start, can point to a loose connection in the panel or a failing neutral, which needs an electrician or your utility right away.',
    facts: [
      'One fixture: bulb, LED driver or dimmer compatibility',
      'One circuit: loose connection at a switch, outlet or splice',
      'Whole house: loose service connection or failing neutral',
      'Lights that go brighter in some rooms: urgent, possible lost neutral',
    ],
    sections: [
      { h: 'The dangerous kind', p: [
        'If some lights get noticeably brighter while others dim, especially when the AC or dryer starts, your home may have a lost or loose neutral. This can send higher-than-normal voltage to some circuits and damage electronics. Turn off sensitive equipment and call us or your utility the same day.',
      ]},
      { h: 'The common, harmless kind', p: [
        'LED bulbs on older dimmers flicker because the dimmer was designed for incandescent loads. Replacing the dimmer with an LED-rated model usually solves it.',
      ]},
    ],
    faqs: [
      { q: 'Is it normal for lights to dim when the AC turns on?', a: 'A brief dip when a large motor starts is normal. A dip that lasts, is getting worse, or affects the whole house should be checked.' },
      { q: 'Who fixes flickering caused by the utility?', a: 'If the problem is in the service drop or transformer, PG&E, SMUD or Roseville Electric fixes it. Problems in the meter base, panel and home wiring are the homeowner’s responsibility.' },
    ],
    services: ['electrical-repair', 'lighting-installation', 'emergency-electrician'],
  },
  {
    slug: 'gfci-vs-afci', topic: 'safety',
    q: 'What is the difference between GFCI and AFCI protection?',
    title: 'GFCI vs AFCI: What’s the Difference & Where They’re Required',
    meta: 'GFCI protects people from shock; AFCI protects homes from fires caused by arcing wires. Where California code requires each, and what to do in an older home.',
    answer: 'A GFCI (ground-fault circuit interrupter) protects people from electric shock by shutting off power when current leaks to ground, such as through water or a person. An AFCI (arc-fault circuit interrupter) protects against fires by shutting off power when it detects arcing from damaged or loose wiring. Modern homes need both, in different places.',
    facts: [
      'GFCI = shock protection; AFCI = fire protection',
      'GFCI required: bathrooms, kitchens, garages, outdoors, laundry, crawlspaces, near sinks',
      'AFCI required: most living-area circuits in new work, including bedrooms and kitchens',
      'Dual-function breakers provide both',
      'Test GFCIs monthly with the Test button',
    ],
    sections: [
      { h: 'Where you need GFCI protection', p: [
        'The California Electrical Code requires GFCI protection for receptacles in bathrooms, kitchens, garages, outdoors, laundry areas, crawlspaces, unfinished basements, near sinks, and for spas, hot tubs and many appliances. Older homes often lack it, and adding GFCI outlets or breakers is one of the cheapest safety upgrades available.',
      ]},
      { h: 'When AFCI is required in an older home', p: [
        'AFCI protection is required on new circuits in most living spaces, and when existing circuits in those areas are extended or modified. It’s not required to retrofit an entire older home, but it’s a worthwhile upgrade where wiring is old or has been disturbed.',
      ]},
    ],
    faqs: [
      { q: 'Can one GFCI outlet protect other outlets?', a: 'Yes. A GFCI receptacle wired correctly protects all outlets downstream on the same circuit. Those outlets should be labeled “GFCI protected.”' },
      { q: 'Why does my AFCI breaker keep tripping?', a: 'Common causes are damaged wiring, a nail or screw through a cable, loose connections, shared neutrals or certain motor-driven appliances. It should be diagnosed rather than replaced with a standard breaker.' },
    ],
    services: ['electrical-repair', 'electrical-inspection', 'home-rewiring'],
  },
  {
    slug: 'federal-pacific-zinsco-panels', topic: 'safety',
    q: 'Are Federal Pacific and Zinsco panels dangerous?',
    title: 'Federal Pacific & Zinsco Panels: Are They Dangerous?',
    meta: 'Federal Pacific Stab-Lok and Zinsco panels have documented breaker failures and are a common replacement in Sacramento and Placer County homes built in the 1960s–80s.',
    answer: 'Yes. Federal Pacific Electric (FPE) Stab-Lok and Zinsco panels have well-documented problems with breakers that fail to trip during overloads or short circuits, which is a fire risk. Both were common in 1960s–80s homes across Sacramento and Placer County, and replacing them is the recommended fix.',
    facts: [
      'Look for “Federal Pacific,” “FPE,” “Stab-Lok,” “Zinsco” or “Sylvania” on the panel',
      'Main issue: breakers that don’t trip when they should',
      'Zinsco panels also suffer melted bus bar connections',
      'Many insurers ask about or exclude these panels',
      'Replacement typically costs the same as a standard panel upgrade',
    ],
    sections: [
      { h: 'How to tell if you have one', p: [
        'Open the panel door and look at the label inside the door or on the dead front. FPE panels often have breakers with red stripes and the words “Stab-Lok.” Zinsco panels have thin, colorful breakers. If you’re unsure, take a photo and send it to us.',
      ]},
      { h: 'Why not just replace the breakers?', p: [
        'The problems are in the panel design itself, including how breakers connect to the bus bar, not only in individual breakers. Aftermarket replacement breakers don’t fix that, so replacing the whole panel is the standard recommendation.',
      ]},
    ],
    faqs: [
      { q: 'Do I have to replace a Federal Pacific panel to sell my house?', a: 'California doesn’t require it by law, but home inspectors flag these panels and buyers or their insurers often ask for replacement as a condition of the sale.' },
      { q: 'Are Challenger panels a problem too?', a: 'Some Challenger breakers were recalled for overheating. They are not as widely condemned as FPE or Zinsco, but they’re worth having inspected.' },
    ],
    services: ['panel-upgrades', 'electrical-inspection'],
  },
  {
    slug: 'whole-house-surge-protection', topic: 'safety',
    q: 'Do I need whole-house surge protection?',
    title: 'Whole-House Surge Protection: Do You Need It?',
    meta: 'A whole-house surge protector at the panel guards appliances, HVAC and EV chargers from voltage spikes, and is now required on new and upgraded services in California.',
    answer: 'A whole-house surge protector mounts at your electrical panel and limits voltage spikes from lightning, utility switching and large motors before they reach appliances, HVAC equipment and EV chargers. Since the 2022 California Electrical Code, one is required whenever a home’s electrical service is installed or replaced.',
    facts: [
      'Installed at the main panel, usually $300–$700 installed',
      'Required on new or replaced residential services',
      'Protects hardwired equipment that plug-in strips can’t',
      'Pairs with plug-in surge strips for sensitive electronics',
      'Most units have an indicator light showing they’re still working',
    ],
    sections: [
      { h: 'Why it matters in the foothills', p: [
        'Foothill homes see more outages, restorations and switching events than valley neighborhoods, especially during PSPS events and storms. Each restoration can send a spike through the house. Modern appliances, heat pumps and EV chargers all contain sensitive electronics.',
      ]},
    ],
    faqs: [
      { q: 'Does a surge protector protect against lightning?', a: 'It reduces damage from nearby strikes and induced surges, but nothing fully protects against a direct lightning strike.' },
      { q: 'How long does a whole-house surge protector last?', a: 'Many last 5–10 years, but a large surge can use them up early. Check the indicator light, especially after storms.' },
    ],
    services: ['panel-upgrades', 'electrical-inspection'],
  },
  {
    slug: 'smoke-co-alarm-requirements-california', topic: 'safety',
    q: 'What are California’s smoke and carbon monoxide alarm requirements?',
    title: 'California Smoke & CO Alarm Requirements for Homes',
    meta: 'California requires smoke alarms in every bedroom, outside sleeping areas and on each level, and CO alarms in homes with gas appliances, fireplaces or attached garages.',
    answer: 'California requires smoke alarms in every bedroom, in the hallway or area outside sleeping rooms, and on every level of the home. Carbon monoxide alarms are required outside sleeping areas and on every level in homes with a gas appliance, fireplace or attached garage. Battery-only smoke alarms sold in California must have a sealed 10-year battery.',
    facts: [
      'Smoke alarms: each bedroom, outside sleeping areas, every level',
      'CO alarms: homes with fuel-burning appliances, fireplaces or attached garages',
      'Permitted remodels over $1,000 trigger hardwired, interconnected alarms where feasible',
      'Replace smoke alarms every 10 years',
      'Required at the sale of a home',
    ],
    sections: [
      { h: 'When hardwired alarms are required', p: [
        'New construction and many permitted additions and remodels require hardwired, interconnected smoke and CO alarms, so when one sounds, they all sound. During a panel upgrade, rewire or addition, the inspector will check alarm compliance, and we can add or replace alarms as part of the job.',
      ]},
    ],
    faqs: [
      { q: 'Do I need a carbon monoxide alarm if my home is all-electric?', a: 'If there are no fuel-burning appliances, no fireplace and no attached garage, CO alarms are not required, though they are still inexpensive protection.' },
      { q: 'Do smoke alarms need to be interconnected?', a: 'In new construction and in many permitted remodels, yes. In older homes without remodel work, standalone 10-year sealed alarms meet the requirement.' },
    ],
    services: ['electrical-inspection', 'home-rewiring'],
  },

  // ───────── Outages ─────────
  {
    slug: 'prepare-for-pge-psps', topic: 'outages',
    q: 'How do I prepare my home for a PG&E Public Safety Power Shutoff?',
    title: 'How to Prepare for a PG&E Power Shutoff (PSPS) in the Foothills',
    meta: 'Prepare for PG&E Public Safety Power Shutoffs in Auburn, Colfax, Grass Valley and the foothills: alerts, generator hookups, well pumps, medical needs and food safety.',
    answer: 'To prepare for a PG&E Public Safety Power Shutoff, sign up for PG&E address alerts, plan backup power for essential loads like a well pump, refrigerator and medical devices, and have a permitted generator connection or battery system in place before fire season. PSPS events can last from several hours to several days.',
    facts: [
      'Sign up for PG&E PSPS address alerts',
      'PG&E aims to give notice about 48 and 24 hours ahead when possible',
      'Medical Baseline customers get extra notifications',
      'On a well, no power means no water: include the pump in your plan',
      'Run generators outdoors, 20+ feet from doors and windows',
    ],
    sections: [
      { h: 'Who gets shut off', p: [
        'PSPS events mainly affect PG&E customers in high fire-threat areas, which includes much of the foothills above Auburn: Newcastle, Meadow Vista, Applegate, Colfax, Grass Valley, Nevada City and parts of El Dorado County. Valley areas served by SMUD and Roseville Electric are rarely affected in the same way.',
      ]},
      { h: 'Your backup power options', p: [
        'A portable generator with an interlock kit is the most affordable whole-panel option. Standby generators start automatically. Battery systems run silently and pair well with solar, but must be sized to last a multi-day outage. Whichever you choose, the connection to your house must be permitted, so you never back-feed the utility line.',
      ]},
      { h: 'A simple checklist', p: [
        'Know which circuits you need (well pump, fridge, furnace blower, a few lights, internet). Test-run your generator monthly in fire season. Keep fuel stored safely. Know how to open your garage door manually. Keep phones and medical devices charged when a PSPS watch is issued.',
      ]},
    ],
    faqs: [
      { q: 'How long does a PSPS outage last?', a: 'Most last from several hours to a couple of days. PG&E must inspect lines before restoring power, which takes longer in remote terrain.' },
      { q: 'Can I run my well pump on a portable generator?', a: 'Usually, with a generator of about 5,000–7,500 running watts for a typical 1–1.5 HP pump, connected through an interlock or transfer switch.' },
      { q: 'Does solar keep working during a PSPS?', a: 'Not without a battery or backup-capable inverter. Grid-tied solar shuts down during outages.' },
    ],
    services: ['generator-installation', 'solar-battery-electrical', 'outbuilding-well-pump-wiring'],
  },
  {
    slug: 'generator-interlock-vs-transfer-switch', topic: 'outages',
    q: 'Should I get a generator interlock or a transfer switch?',
    title: 'Generator Interlock vs Transfer Switch: Which Is Better?',
    meta: 'An interlock kit is cheaper and lets you power any circuit; a transfer switch powers pre-selected circuits. Both are code-approved. How to choose for your foothill home.',
    answer: 'Both are code-approved ways to connect a portable generator safely. An interlock kit is usually cheaper and lets you choose any circuit in your panel, while a manual transfer switch powers a fixed set of pre-wired circuits and is simpler to use. Automatic transfer switches are used with standby generators that start on their own.',
    facts: [
      'Interlock: $900–$2,200 installed with inlet box',
      'Manual transfer switch: $1,200–$2,800',
      'Interlock = flexible, you manage the load',
      'Transfer switch = simpler, fewer choices',
      'Both prevent back-feeding the utility line',
    ],
    sections: [
      { h: 'How an interlock works', p: [
        'An interlock is a sliding plate that physically prevents the main breaker and the generator breaker from being on at the same time. You switch off the main, slide the plate, turn on the generator breaker, then turn on the circuits you want. Your panel must have a compatible interlock kit made for it.',
      ]},
      { h: 'When a transfer switch is better', p: [
        'If several people in the house might run the generator, or your panel has no listed interlock kit, a transfer switch with clearly labeled circuits is easier and leaves less room for mistakes.',
      ]},
    ],
    faqs: [
      { q: 'Is an interlock kit safe?', a: 'Yes, when it’s a listed kit made for your panel and installed under permit. It is accepted by the electrical code as a transfer method.' },
      { q: 'Can I install an interlock myself?', a: 'Homeowners may pull permits for their own homes in some jurisdictions, but generator connections are a common source of dangerous mistakes. A licensed electrician is strongly recommended.' },
    ],
    services: ['generator-installation'],
  },
  {
    slug: 'what-size-generator-do-i-need', topic: 'outages',
    q: 'What size generator do I need for my house?',
    title: 'What Size Generator Do I Need? Sizing Guide for Foothill Homes',
    meta: 'Most foothill homes need 5,000–7,500 running watts for essentials including a well pump, or 20–26 kW standby for the whole house. How to size a generator.',
    answer: 'For essentials (fridge, freezer, a 1–1.5 HP well pump, furnace blower, lights and internet), most homes need a portable generator with about 5,000 to 7,500 running watts. Running the whole house, including central air, usually takes a 20 to 26 kW standby generator.',
    facts: [
      'Essentials only: 5,000–7,500 running watts',
      'Well pumps need extra starting watts',
      'Whole home with AC: 20–26 kW standby',
      'Electric water heaters, ranges and dryers are the biggest loads',
      'Undersized generators can damage motors',
    ],
    sections: [
      { h: 'Adding up your loads', p: [
        'List what you want to run and their running watts: refrigerator 700–800, chest freezer 500, furnace blower 600–800, well pump 1,000–2,000 running and two to three times that to start, LED lights and internet a few hundred. Add the largest starting surge to the running total and pick a generator above that number.',
      ]},
      { h: 'Why well pumps matter', p: [
        'Submersible well pumps draw a large surge on startup. A generator that can run the pump may still fail to start it if other loads are on. We check the pump nameplate and recommend a size that starts it reliably.',
      ]},
    ],
    faqs: [
      { q: 'Can a 3,500-watt generator run a well pump?', a: 'Rarely. Most 1 HP or larger submersible pumps need more starting power than a 3,500-watt generator can supply.' },
      { q: 'Should I get a 120V or 240V generator?', a: 'For a panel connection and especially for well pumps, which are usually 240V, choose a generator with a 240V outlet such as an L14-30 or 14-50.' },
    ],
    services: ['generator-installation', 'outbuilding-well-pump-wiring'],
  },
  {
    slug: 'who-to-call-power-outage', topic: 'outages',
    q: 'Who do I call when my power goes out?',
    title: 'Power Out? Who To Call: PG&E, SMUD or an Electrician',
    meta: 'If neighbors are out too, call your utility: PG&E, SMUD or Roseville Electric. If only your home or part of it is out, call an electrician. How to tell the difference.',
    answer: 'If your neighbors are also without power, call your utility: PG&E (1-800-743-5002) in most of Placer, Nevada and El Dorado counties, SMUD (1-888-456-7683) in Sacramento and nearby Sacramento County towns, or Roseville Electric Utility in Roseville. If only your home, or only part of your home, is out, check your main breaker and then call an electrician.',
    facts: [
      'Whole street out: call the utility',
      'Only your house out: check the main breaker, then call an electrician',
      'Half the house out: possible lost neutral, call right away',
      'Downed line: stay 30+ feet away and call 911 and the utility',
      'The utility owns up to the meter; you own the meter base and everything after',
    ],
    sections: [
      { h: 'Partial outages need attention', p: [
        'When half the house has power and half doesn’t, one of the two incoming hot legs or the neutral may have failed, either in your panel or on the utility side. Lights that are unusually bright or dim are a warning sign. Turn off sensitive electronics and call.',
      ]},
    ],
    faqs: [
      { q: 'Who fixes a damaged meter base?', a: 'The meter base belongs to the homeowner, so a licensed electrician repairs it. The utility then reinstalls or reconnects the meter, often after an inspection.' },
      { q: 'Who is my electric utility in Roseville?', a: 'Roseville Electric Utility, a city-owned utility, not PG&E. Gas service in Roseville is PG&E.' },
    ],
    services: ['emergency-electrician', 'electrical-repair'],
  },

  // ───────── EV & solar ─────────
  {
    slug: 'level-1-vs-level-2-ev-charging', topic: 'ev-solar',
    q: 'Do I need a Level 2 charger, or is a regular outlet enough?',
    title: 'Level 1 vs Level 2 EV Charging at Home: Which Do You Need?',
    meta: 'Level 1 charging on a 120V outlet adds about 3–5 miles of range per hour; Level 2 on 240V adds about 25–45. How to decide based on your commute in Placer and Sacramento.',
    answer: 'A Level 1 charger plugs into a standard 120-volt outlet and adds about 3 to 5 miles of range per hour, which works if you drive under about 30–40 miles a day. A Level 2 charger uses a 240-volt circuit and adds roughly 25 to 45 miles per hour, enough to fully recharge most EVs overnight.',
    facts: [
      'Level 1: 120V, ~3–5 miles of range per hour',
      'Level 2: 240V, ~25–45 miles of range per hour',
      'Level 2 needs a dedicated 40–60 amp circuit and a permit',
      'Plug-in hybrids often do fine on Level 1',
      'Long foothill commutes usually justify Level 2',
    ],
    sections: [
      { h: 'Commute math for our area', p: [
        'A round trip from Auburn to downtown Sacramento is about 70 miles. Level 1 charging overnight (10 hours) adds only 30–50 miles, so you’d fall behind. A Level 2 charger replaces that in two to three hours. Climbing I-80 also uses more energy than flat valley driving.',
      ]},
    ],
    faqs: [
      { q: 'Can I use an existing dryer outlet for EV charging?', a: 'Sometimes, with an adapter or a splitter device, but dryer circuits are often 30 amps and shared. A dedicated circuit is safer and faster.' },
      { q: 'Does a Level 2 charger need a permit?', a: 'Yes. Any new 240V circuit requires an electrical permit.' },
    ],
    services: ['ev-charger-installation', 'panel-upgrades'],
  },
  {
    slug: 'solar-during-power-outage', topic: 'ev-solar',
    q: 'Will my solar panels work during a power outage?',
    title: 'Will Solar Panels Work During a Power Outage or PSPS?',
    meta: 'Standard grid-tied solar shuts off during outages for safety. To keep power during a PSPS you need a battery or a backup-capable inverter with a transfer switch.',
    answer: 'No, not on their own. Standard grid-tied solar systems shut off automatically when the grid goes down so they don’t send power onto lines that crews are working on. To keep power during an outage or PG&E shutoff, you need a home battery or a backup-capable inverter with an automatic transfer switch.',
    facts: [
      'Grid-tied solar shuts off in an outage (anti-islanding)',
      'Batteries like Tesla Powerwall or Enphase provide backup',
      'Backup usually covers a critical-loads panel, not the whole house',
      'Solar can recharge batteries during multi-day outages',
      'A main panel upgrade is often needed first',
    ],
    sections: [
      { h: 'How backup is wired', p: [
        'Most battery systems power a “critical loads” subpanel: the circuits you choose to keep running, like the fridge, well pump, lights and internet. Whole-home backup is possible with larger batteries and smart load control, but costs more.',
      ]},
    ],
    faqs: [
      { q: 'How long will a home battery last in an outage?', a: 'A 13.5 kWh battery can run essential loads for roughly a day, longer with solar recharging it. Well pumps and electric heat drain batteries quickly.' },
      { q: 'Can I add a battery to my existing solar?', a: 'Usually yes, with an AC-coupled battery. It often requires panel work and a new backup subpanel.' },
    ],
    services: ['solar-battery-electrical', 'generator-installation', 'panel-upgrades'],
  },
  {
    slug: '100-amp-vs-200-amp-service', topic: 'ev-solar',
    q: 'Is 100-amp electrical service enough for my house?',
    title: '100-Amp vs 200-Amp Service: Is 100 Amps Enough?',
    meta: '100-amp service works for many smaller homes with gas appliances, but adding an EV charger, heat pump or solar often needs 200 amps or load management. How to decide.',
    answer: '100-amp service can be enough for a smaller home with gas heat, a gas range and gas water heating. Once you add an EV charger, heat pump, induction range or spa, most homes need either a 200-amp service or a load-management device. A load calculation under the electrical code gives the real answer for your house.',
    facts: [
      '100A: fine for many smaller gas-heated homes',
      '200A: standard for new homes and all-electric upgrades',
      'A load calculation, not panel size alone, decides',
      'Load management can avoid a service upgrade',
      'Your utility may need to upgrade the service drop',
    ],
    sections: [
      { h: 'Why panels “fill up”', p: [
        'A panel can be full in two ways: no physical space for more breakers, or not enough capacity on the service. Tandem breakers or a subpanel fix the first. The second needs either reduced load or a bigger service.',
      ]},
    ],
    faqs: [
      { q: 'How do I know what size my electrical service is?', a: 'Look at the main breaker at the top of your panel, which is usually labeled 100, 125, 150 or 200. Some older homes have 60-amp services or fuses.' },
      { q: 'Can I add solar to a 100-amp panel?', a: 'Often only a small system. Code limits how much solar can back-feed a panel’s bus bar, which is why many solar installs include a panel upgrade.' },
    ],
    services: ['panel-upgrades', 'ev-charger-installation', 'solar-battery-electrical'],
  },

  // ───────── Older homes ─────────
  {
    slug: 'knob-and-tube-wiring-insurance', topic: 'older',
    q: 'Can I get home insurance with knob-and-tube wiring in California?',
    title: 'Knob and Tube Wiring & Home Insurance in California',
    meta: 'Many California insurers won’t write or renew policies on homes with active knob-and-tube wiring. Options: inspection, partial rewire or full replacement.',
    answer: 'It’s difficult. Many California insurers will not write or renew a policy on a home with active knob-and-tube wiring, and others require an electrician’s inspection letter or replacement within a set time. Replacing active knob-and-tube circuits is usually the only long-term solution.',
    facts: [
      'Common in homes built before about 1950',
      'No ground wire, brittle insulation with age',
      'Dangerous when buried in attic insulation',
      'Insurers often require replacement or an inspection letter',
      'Partial rewires of active circuits cost less than a full rewire',
    ],
    sections: [
      { h: 'Where we find it locally', p: [
        'Knob-and-tube is common in Gold Rush–era and early 1900s homes in Auburn, Grass Valley, Nevada City and Colfax, and in 1910s–1940s neighborhoods of East Sacramento, Land Park and Curtis Park. Many homes have a mix of old and new wiring, so an inspection that confirms what’s still active is the first step.',
      ]},
      { h: 'What an insurer usually wants', p: [
        'A written statement from a licensed electrician describing whether any knob-and-tube is still energized, its condition, and a plan or proof of replacement. We provide that letter as part of an electrical inspection.',
      ]},
    ],
    faqs: [
      { q: 'How much does it cost to replace knob-and-tube wiring?', a: 'Full rewires typically run $8,000–$25,000+ depending on home size and access. Replacing only remaining active circuits costs less.' },
      { q: 'Can I leave abandoned knob-and-tube in the walls?', a: 'Yes, if it is fully disconnected and verified dead. Insurers care about energized wiring.' },
    ],
    services: ['home-rewiring', 'electrical-inspection'],
  },
  {
    slug: 'aluminum-wiring', topic: 'older',
    q: 'Is aluminum wiring in my house dangerous?',
    title: 'Aluminum Wiring in Homes: Risks & Repair Options',
    meta: 'Aluminum branch wiring from the mid-1960s to mid-1970s can overheat at connections. Approved AlumiConn or COPALUM repairs fix the risk without a full rewire.',
    answer: 'Aluminum branch-circuit wiring, used in some homes built between about 1965 and 1975, can overheat at outlets, switches and splices because aluminum expands, oxidizes and loosens over time. It’s a known fire risk, but it can usually be fixed by adding approved copper connectors at every connection rather than rewiring the whole house.',
    facts: [
      'Mostly homes built ~1965–1975',
      'Look for “AL” or “ALUMINUM” on cable jackets',
      'Risk is at connections, not the wire runs',
      'Fix: AlumiConn or COPALUM connectors at each device',
      'Large aluminum feeders for ranges or panels are normal and safe when installed correctly',
    ],
    sections: [
      { h: 'Warning signs', p: [
        'Warm cover plates, flickering lights, a burning smell, or outlets that stop working intermittently. Check cable markings in the attic, garage or at the panel.',
      ]},
    ],
    faqs: [
      { q: 'Are “CO/ALR” outlets enough to fix aluminum wiring?', a: 'They’re better than standard devices, but the safest recommended repair is pigtailing every connection with listed connectors such as AlumiConn or COPALUM.' },
      { q: 'Will my insurer care about aluminum wiring?', a: 'Many ask. An electrician’s letter confirming a proper repair often satisfies them.' },
    ],
    services: ['home-rewiring', 'electrical-inspection'],
  },
  {
    slug: 'electrical-inspection-buying-home', topic: 'older',
    q: 'Should I get an electrical inspection before buying a house?',
    title: 'Electrical Inspection Before Buying a House: Is It Worth It?',
    meta: 'If the home inspector says “evaluate by a licensed electrician,” or the home is older, rural or has an FPE/Zinsco panel, a $195–$395 electrical inspection can save thousands.',
    answer: 'Yes, if the home is older than about 1980, has a Federal Pacific or Zinsco panel, knob-and-tube or aluminum wiring, a lot of DIY work, or outbuildings and wells, or if your home inspector wrote “recommend evaluation by a licensed electrician.” A specialist electrical inspection costs about $195 to $395 and gives you itemized repair prices to negotiate with.',
    facts: [
      'Cost: about $195–$395 for most homes',
      'Takes 1–2 hours, report within a day',
      'Goes deeper than a general home inspection',
      'Includes repair pricing for negotiation',
      'Especially useful for foothill properties with outbuildings and wells',
    ],
    sections: [
      { h: 'What we look at', p: [
        'Service size and condition, panel brand, breaker and wire sizing, grounding and bonding, GFCI and AFCI protection, smoke and CO alarms, visible attic and crawlspace wiring, and permits for additions, ADUs, shops and solar. On rural properties we also check well-pump circuits and feeders to outbuildings.',
      ]},
    ],
    faqs: [
      { q: 'Can I get an electrical inspection during the contingency period?', a: 'Yes. We usually schedule within a few days so results arrive before your inspection contingency ends.' },
      { q: 'Will the seller pay for electrical repairs?', a: 'That’s a negotiation, but an itemized report from a licensed electrician makes credit or repair requests much easier.' },
    ],
    services: ['electrical-inspection', 'panel-upgrades', 'home-rewiring'],
  },
  {
    slug: 'well-pump-not-working', topic: 'older',
    q: 'Why is my well pump not working?',
    title: 'Well Pump Not Working? Electrical Causes & What To Check',
    meta: 'No water on a foothill property is often electrical: a tripped breaker, failed pressure switch, bad control box capacitor or low generator voltage. What to check safely.',
    answer: 'When a well stops delivering water, the cause is often electrical: a tripped breaker, a failed or burned pressure switch, a bad start capacitor or relay in the control box, or low voltage from a long wire run or generator. A failing pump motor or waterlogged pressure tank are the other common causes.',
    facts: [
      'Check the breaker first (usually a 240V double breaker)',
      'Pressure switch contacts burn out over time',
      'Three-wire pumps have a control box with a capacitor',
      'Low voltage from long runs or small generators stalls pumps',
      'Turn off power before opening any well equipment',
    ],
    sections: [
      { h: 'What you can check safely', p: [
        'Confirm the well breaker is on. Look at the pressure gauge: if it’s near zero and the pump isn’t running, it may be the pressure switch or the control box. Don’t tap or open the pressure switch with power on, since the contacts carry 240 volts.',
      ]},
      { h: 'When it happens during outages', p: [
        'If the pump won’t run on generator power, the generator may be too small to start it, or voltage drops too much over the wire run. Sizing the generator and wire for the pump’s starting surge fixes this.',
      ]},
    ],
    faqs: [
      { q: 'Who fixes a well pump: an electrician or a pump company?', a: 'Electricians handle the breaker, wiring, pressure switch and control box. A pump company pulls and replaces the pump in the well. We often work together.' },
      { q: 'How much does it cost to replace a pressure switch?', a: 'Usually $175–$350 including the part and labor.' },
    ],
    services: ['outbuilding-well-pump-wiring', 'generator-installation', 'electrical-repair'],
  },

  // ───────── Rules ─────────
  {
    slug: 'electrical-permit-california', topic: 'rules',
    q: 'When do I need an electrical permit in California?',
    title: 'When Do You Need an Electrical Permit in California?',
    meta: 'New circuits, panel changes, EV chargers, generators, spas, solar and rewiring all need an electrical permit in California. Like-for-like device swaps usually don’t.',
    answer: 'In California, you need an electrical permit for new circuits, panel or service changes, EV chargers, generator connections, spas, solar and batteries, rewiring, and most work inside walls. Replacing an outlet, switch or light fixture with the same type on an existing circuit usually doesn’t need one. Your city or county building department makes the final call.',
    facts: [
      'Permit needed: new circuits, panels, EV chargers, generators, spas, solar, rewires',
      'Usually exempt: like-for-like outlet, switch or fixture replacement',
      'Permits come from your city or county, not the utility',
      'Unpermitted work can cause problems at sale and with insurance',
      'Licensed contractors pull permits as part of the job',
    ],
    sections: [
      { h: 'City or county?', p: [
        'Inside city limits, the city building department issues permits (for example the City of Roseville or City of Auburn). Unincorporated areas like Newcastle, Penryn, Granite Bay and Meadow Vista go through Placer County Building Services. Lake of the Pines goes through Nevada County, and El Dorado Hills through El Dorado County.',
      ]},
      { h: 'What happens at inspection', p: [
        'Most jobs get one final inspection, and some get a rough inspection before walls are closed. The inspector checks code compliance, often including smoke and CO alarms in the home. Utility reconnects for panel work happen after the permit is approved.',
      ]},
    ],
    faqs: [
      { q: 'Can a homeowner pull their own electrical permit?', a: 'Many California jurisdictions allow owner-builder permits for your own home, but you take on responsibility for code compliance and the inspection.' },
      { q: 'What happens if electrical work wasn’t permitted?', a: 'It may need to be opened up, inspected and permitted retroactively, which can delay a sale or affect an insurance claim.' },
    ],
    services: ['panel-upgrades', 'ev-charger-installation', 'generator-installation'],
  },
  {
    slug: 'check-electrician-license-cslb', topic: 'rules',
    q: 'How do I check if an electrician is licensed in California?',
    title: 'How to Check an Electrician’s License in California (CSLB)',
    meta: 'Look up any contractor on the CSLB website by license number or name. Electrical contractors hold a C-10 license, and their electricians must be state-certified.',
    answer: 'Look up the contractor on the Contractors State License Board (CSLB) website at cslb.ca.gov using their license number or business name. An electrical contractor should hold an active C-10 license with current workers’ compensation and bond. In California, electricians who work for a C-10 contractor must also be state-certified.',
    facts: [
      'Electrical contractor license class: C-10',
      'Look up at cslb.ca.gov, check status, bond and workers’ comp',
      'Jobs over $1,000 (labor + materials) require a licensed contractor',
      'Employed electricians must hold a state certification card',
      'License number should appear on ads, trucks and quotes',
    ],
    sections: [
      { h: 'Red flags', p: [
        'A contractor who asks for a large cash deposit, won’t pull a permit, or can’t give you a license number. California limits down payments on home improvement contracts to $1,000 or 10% of the contract price, whichever is less.',
      ]},
    ],
    faqs: [
      { q: 'What does C-10 mean?', a: 'C-10 is the California Contractors State License Board classification for electrical contractors.' },
      { q: 'Can a handyman do electrical work in California?', a: 'Only on small jobs under $1,000 total, and they still must follow code and permit requirements. Most electrical work quickly exceeds that limit.' },
    ],
    services: ['electrical-inspection', 'electrical-repair'],
  },
  {
    slug: 'adu-electrical-requirements', topic: 'rules',
    q: 'What electrical work does an ADU need in California?',
    title: 'ADU Electrical Requirements in California: Panels, Meters & Feeders',
    meta: 'An ADU needs its own subpanel fed from the main house or a separate meter, sized by load calculation. What to plan for in Placer, Sacramento and Nevada counties.',
    answer: 'A California ADU needs its own subpanel, fed either from the main house panel or from a separate utility meter, plus circuits that meet current code, including AFCI and GFCI protection and smoke and CO alarms. Whether the existing service can carry the ADU is decided by a load calculation, and many projects need a service upgrade.',
    facts: [
      'Feed from main panel or separate meter',
      'Load calculation decides if the service is big enough',
      'Underground feeder in conduit to detached ADUs',
      'All-electric ADUs need more capacity',
      'Separate meters must be coordinated with the utility early',
    ],
    sections: [
      { h: 'Plan the power early', p: [
        'Electrical capacity is one of the most common reasons ADU projects stall. A detached ADU with a heat pump, induction range and water heater can need 60–100 amps. If your main service is 100 or 125 amps, plan a service upgrade or separate meter before the building permit is submitted.',
      ]},
    ],
    faqs: [
      { q: 'Does an ADU need a separate electric meter in California?', a: 'Usually not. Many ADUs are fed from the main house panel. A separate meter is an option, often chosen for rentals or when the main service is short on capacity. Confirm requirements with your city and utility early.' },
      { q: 'How deep does the ADU feeder need to be buried?', a: 'Generally 18 inches for PVC conduit and 6 inches for rigid metal conduit for residential feeders, subject to local inspector approval.' },
    ],
    services: ['outbuilding-well-pump-wiring', 'panel-upgrades'],
  },
  {
    slug: 'hot-tub-electrical-requirements', topic: 'rules',
    q: 'What are the electrical requirements for a hot tub?',
    title: 'Hot Tub Electrical Requirements: Circuit, GFCI & Disconnect',
    meta: 'Most 240V hot tubs need a dedicated 40–60 amp GFCI-protected circuit and a disconnect at least 5 feet away and within sight. Plug-and-play spas need a 20A GFCI outlet.',
    answer: 'Most 240-volt hot tubs need a dedicated 40 to 60 amp circuit with GFCI protection and an emergency disconnect located at least 5 feet from the tub and within sight of it. 120-volt plug-and-play spas need a dedicated 20-amp GFCI outlet. Both require a permit and inspection.',
    facts: [
      '240V spas: 40–60 amp dedicated circuit',
      'GFCI protection required',
      'Disconnect: within sight, at least 5 feet away',
      'No extension cords, ever',
      'Check panel capacity before the spa is delivered',
    ],
    sections: [
      { h: 'Before delivery day', p: [
        'Read your spa’s spec sheet for the required breaker size, then have the panel checked. On a 100-amp service, a 50-amp spa can push the house over capacity, and solving that before delivery avoids a tub sitting empty for weeks.',
      ]},
    ],
    faqs: [
      { q: 'What wire size does a 50 amp hot tub need?', a: 'Typically 6 AWG copper for a 50-amp circuit, but run length and installation method can change it. Your electrician sizes it for the actual run.' },
      { q: 'Can the hot tub disconnect be on the house wall?', a: 'Yes, if it’s at least 5 feet from the spa and within sight of it.' },
    ],
    services: ['hot-tub-spa-wiring', 'panel-upgrades'],
  },
];

export const guideBySlug = Object.fromEntries(guides.map((g) => [g.slug, g]));
export const guideUrl = (g) => `/guides/${g.slug}/`;
