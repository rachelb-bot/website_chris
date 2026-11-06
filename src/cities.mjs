// Service-area pages at /electrician-<slug>-ca/
// `route` = position on the I-80 profile (null = off-route, listed separately).
// `spur`  = on the Hwy 49 branch from Auburn.
// Elevations are approximate town-center figures. Drive times are approximate from Newcastle.

export const cities = [
  {
    slug: 'sacramento', name: 'Sacramento', county: 'Sacramento County', elev: 30, route: 0,
    utility: 'SMUD', permits: 'City of Sacramento Community Development Department',
    zips: ['95814', '95816', '95818', '95819', '95821', '95822', '95825', '95831', '95864'],
    drive: 35, lat: 38.5816, lng: -121.4944,
    lede: 'Sacramento sits on the valley floor at the start of our run up I-80, and it has the oldest housing stock we work on outside the Gold Country towns.',
    notes: [
      'East Sacramento, Land Park, Curtis Park, Midtown and Oak Park are full of 1910s–1940s homes. Many still have live knob-and-tube circuits, ungrounded two-prong outlets, or 60-amp fuse panels that have never been replaced. Those homes are most of our rewiring and service-upgrade work in the city.',
      'Sacramento homes are served by SMUD, not PG&E. SMUD has pushed hard on all-electric conversions, including heat pumps, induction and EV charging, and that often means a 200-amp service upgrade first. We coordinate SMUD’s service release and reconnect, and check what rebates are currently available before you buy equipment.',
    ],
    focus: ['home-rewiring', 'panel-upgrades', 'ev-charger-installation', 'electrical-inspection'],
    faqs: [
      { q: 'Who provides electricity in Sacramento?', a: 'Most of Sacramento is served by SMUD (Sacramento Municipal Utility District), a public utility. SMUD handles meter, service drop and reconnects for panel upgrades.' },
    ],
  },
  {
    slug: 'citrus-heights', name: 'Citrus Heights', county: 'Sacramento County', elev: 140, route: null,
    utility: 'SMUD', permits: 'City of Citrus Heights Building & Safety',
    zips: ['95610', '95621'], drive: 25, lat: 38.7071, lng: -121.2811,
    lede: 'Citrus Heights is mostly 1960s and 1970s tract housing, which puts it squarely in Federal Pacific and Zinsco panel territory.',
    notes: [
      'If your Citrus Heights home still has its original panel, open the door and look for “Federal Pacific,” “Stab-Lok,” or “Zinsco.” Both are a priority replacement. Original 100-amp services here also struggle with today’s loads once an EV or heat pump comes in.',
      'Citrus Heights is in SMUD territory, so service upgrades go through SMUD rather than PG&E.',
    ],
    focus: ['panel-upgrades', 'ev-charger-installation', 'electrical-repair', 'electrical-inspection'],
    faqs: [],
  },
  {
    slug: 'roseville', name: 'Roseville', county: 'Placer County', elev: 165, route: 1,
    utility: 'Roseville Electric Utility', permits: 'City of Roseville Building Division',
    zips: ['95661', '95678', '95747'], drive: 20, lat: 38.7521, lng: -121.288,
    lede: 'Roseville is one of the few cities on our route with its own electric utility, which changes how panel upgrades, solar and EV work get scheduled.',
    notes: [
      'Roseville Electric Utility, not PG&E, owns the meters and service drops here. It has its own service-upgrade release process, its own solar interconnection rules and, at times, its own rebates for EV chargers and electrification. We work with Roseville Electric regularly, so the paperwork side is routine.',
      'West Roseville neighborhoods like Fiddyment Farm, Westpark and Sierra Vista are newer, with 200-amp services that are ready for EV chargers. Older homes around downtown, the Cirby Side and Sierra Gardens date back decades and are more likely to need panel and wiring updates.',
    ],
    focus: ['ev-charger-installation', 'panel-upgrades', 'solar-battery-electrical', 'lighting-installation'],
    faqs: [
      { q: 'Does Roseville use PG&E for electricity?', a: 'No. Roseville is served by Roseville Electric Utility, a city-owned utility. Gas in Roseville is still PG&E.' },
    ],
  },
  {
    slug: 'rocklin', name: 'Rocklin', county: 'Placer County', elev: 249, route: 2,
    utility: 'PG&E', permits: 'City of Rocklin Building Division',
    zips: ['95677', '95765'], drive: 15, lat: 38.7907, lng: -121.2358,
    lede: 'Rocklin’s Whitney Ranch, Stanford Ranch and Sunset West neighborhoods are mostly 1990s–2020s homes, and most calls here are about adding load: EV chargers, solar, spas.',
    notes: [
      'Newer Rocklin homes generally have 200-amp service, but builders often filled the panel. Adding a Level 2 charger can mean rearranging circuits or adding tandem breakers where the panel allows, which is cheaper than a new service.',
      'Older parts of town near downtown Rocklin and along Pacific Street have smaller services and older wiring. Rocklin is PG&E territory, and permits go through the City of Rocklin.',
    ],
    focus: ['ev-charger-installation', 'solar-battery-electrical', 'hot-tub-spa-wiring', 'lighting-installation'],
    faqs: [],
  },
  {
    slug: 'loomis', name: 'Loomis', county: 'Placer County', elev: 400, route: 3,
    utility: 'PG&E', permits: 'Town of Loomis Building Department',
    zips: ['95650'], drive: 10, lat: 38.8213, lng: -121.193,
    lede: 'Loomis is where the valley turns to horse property, with semi-rural lots, barns, arenas and shops that need real power, not extension cords.',
    notes: [
      'A lot of our Loomis work is outbuilding power: subpanels for barns and shops, arena lighting, gate operators and long underground feeders. Distance matters here. We size wire for voltage drop, not just the breaker.',
      'Homes along Horseshoe Bar and Sierra College are a mix of 1970s–90s builds and newer customs. Loomis is PG&E territory and close enough to our Newcastle base that we can often get there the same day.',
    ],
    focus: ['outbuilding-well-pump-wiring', 'panel-upgrades', 'generator-installation', 'lighting-installation'],
    faqs: [],
  },
  {
    slug: 'penryn', name: 'Penryn', county: 'Placer County', elev: 650, route: 4,
    utility: 'PG&E', permits: 'Placer County Building Services',
    zips: ['95663'], drive: 5, lat: 38.8524, lng: -121.1691,
    lede: 'Penryn, one exit down from our Newcastle shop, is granite country: acreage, wells, old quarry ground and long driveways.',
    notes: [
      'Penryn properties are often on wells, so a power outage means no water. We wire well pumps, pressure switches and the generator hookups that keep them running during PG&E shutoffs.',
      'Penryn is unincorporated, so permits go through Placer County Building Services in Auburn. Trenching here usually hits granite, and we plan conduit routes with that in mind.',
    ],
    focus: ['outbuilding-well-pump-wiring', 'generator-installation', 'panel-upgrades', 'electrical-repair'],
    faqs: [],
  },
  {
    slug: 'newcastle', name: 'Newcastle', county: 'Placer County', elev: 970, route: 5, home: true,
    utility: 'PG&E', permits: 'Placer County Building Services',
    zips: ['95658'], drive: 0, lat: 38.8741, lng: -121.1336,
    lede: 'Newcastle is home. Our shop is here, halfway up the I-80 climb between the valley and the Sierra foothills, which is why we can reach both Sacramento and Grass Valley the same day.',
    notes: [
      'Newcastle grew up around fruit-packing sheds and orchards, and plenty of homes here are older ranch houses on acreage, with wells, outbuildings and electrical work added over decades. We see a lot of undersized services, unpermitted shop wiring and ungrounded circuits.',
      'Newcastle sits in PG&E’s high fire-threat area and is regularly included in Public Safety Power Shutoffs. A generator interlock or standby generator is one of the most common jobs we do for our own neighbors.',
    ],
    focus: ['generator-installation', 'outbuilding-well-pump-wiring', 'panel-upgrades', 'electrical-repair'],
    faqs: [
      { q: 'Is there an electrician based in Newcastle, CA?', a: 'Yes. Off 80 Electric is a licensed C-10 electrical contractor based in Newcastle, CA 95658, serving Placer, Sacramento, Nevada and El Dorado counties.' },
    ],
  },
  {
    slug: 'auburn', name: 'Auburn', county: 'Placer County', elev: 1255, route: 6,
    utility: 'PG&E', permits: 'City of Auburn Building Division (inside city limits) or Placer County Building Services (unincorporated Auburn)',
    zips: ['95602', '95603', '95604'], drive: 10, lat: 38.8966, lng: -121.0769,
    lede: 'Auburn is two electricians’ worth of work in one town: Gold Rush–era buildings in Old Town and Downtown, and foothill neighborhoods with fire-season outage risk.',
    notes: [
      'Old Town Auburn and the historic downtown have some of the oldest commercial buildings in Placer County, and homes nearby often have knob-and-tube or patchwork wiring. Further out, along Bell Road, Christian Valley and the Lake of the Pines direction, homes sit on wooded lots in PG&E’s high fire-threat districts.',
      'One thing that trips people up: an “Auburn” mailing address doesn’t mean City of Auburn permits. Properties outside city limits are permitted through Placer County (or Nevada County, north of the Bear River). We sort out which applies before we quote.',
    ],
    focus: ['home-rewiring', 'generator-installation', 'panel-upgrades', 'commercial-electrical'],
    faqs: [
      { q: 'Do I need a City of Auburn or Placer County electrical permit?', a: 'It depends on whether the property is inside Auburn city limits. Many addresses with an Auburn mailing address are unincorporated and permitted through Placer County Building Services instead.' },
    ],
  },
  {
    slug: 'meadow-vista', name: 'Meadow Vista', county: 'Placer County', elev: 1700, route: 7,
    utility: 'PG&E', permits: 'Placer County Building Services',
    zips: ['95722'], drive: 20, lat: 38.9824, lng: -121.0216,
    lede: 'Meadow Vista is pines, long driveways and fire-season shutoffs. Outage planning drives a lot of the electrical work here.',
    notes: [
      'Meadow Vista is frequently in PG&E PSPS zones, and winter storms bring trees down on service lines. We install generator interlocks, inlet boxes and standby generators, and repair masts and meter bases after storm damage so PG&E can reconnect.',
      'Many homes are on wells and septic pumps, both of which need to be on the generator plan. Meadow Vista is unincorporated, with permits through Placer County.',
    ],
    focus: ['generator-installation', 'emergency-electrician', 'outbuilding-well-pump-wiring', 'panel-upgrades'],
    faqs: [],
  },
  {
    slug: 'applegate', name: 'Applegate', county: 'Placer County', elev: 2000, route: 8,
    utility: 'PG&E', permits: 'Placer County Building Services',
    zips: ['95703'], drive: 20, lat: 38.999, lng: -120.9938,
    lede: 'Applegate is rural foothill living: acreage, wells, shops and the kind of long electrical runs most valley electricians don’t plan for.',
    notes: [
      'We regularly wire shops, barns and ADUs on Applegate parcels, where the run from the main panel can be hundreds of feet. Conductor sizing for voltage drop makes the difference between a shop that works and one that dims every time the compressor kicks on.',
      'Applegate is in PG&E high fire-threat territory. Permits go through Placer County.',
    ],
    focus: ['outbuilding-well-pump-wiring', 'generator-installation', 'panel-upgrades', 'emergency-electrician'],
    faqs: [],
  },
  {
    slug: 'colfax', name: 'Colfax', county: 'Placer County', elev: 2425, route: 10,
    utility: 'PG&E', permits: 'City of Colfax (inside city limits) or Placer County Building Services',
    zips: ['95713'], drive: 30, lat: 39.1007, lng: -120.9533,
    lede: 'Colfax is the top of our run, where I-80 starts its real climb into the Sierra. Snow, wind and shutoffs all shape the work here.',
    notes: [
      'Colfax’s small historic downtown has older wiring in both homes and storefronts. Outside town, properties along the Iowa Hill, Canyon Way and Placer Hills corridors are rural, often on wells, and see both PG&E Public Safety Power Shutoffs and winter storm outages.',
      'Snow load and falling limbs are hard on service masts here. We repair storm damage and set up generator connections so the next outage is easier.',
    ],
    focus: ['generator-installation', 'emergency-electrician', 'home-rewiring', 'outbuilding-well-pump-wiring'],
    faqs: [],
  },
  {
    slug: 'grass-valley', name: 'Grass Valley', county: 'Nevada County', elev: 2411, spur: 0,
    utility: 'PG&E', permits: 'City of Grass Valley Building Division (in city) or Nevada County Building Department',
    zips: ['95945', '95949'], drive: 35, lat: 39.2191, lng: -121.0611,
    lede: 'Grass Valley sits up Highway 49 from Auburn: a Gold Rush town with Gold Rush–era wiring problems and serious fire-season outage risk.',
    notes: [
      'Homes in Grass Valley’s historic core, from Victorian cottages to 1920s–40s bungalows, often still carry knob-and-tube, fuse panels or ungrounded circuits. Insurers in Nevada County are increasingly asking about both, alongside wildfire risk.',
      'Outside town toward Alta Sierra, Cedar Ridge and Rough and Ready, most properties are on wells in PG&E high fire-threat districts. Generator hookups and standby systems are a big part of the work.',
    ],
    focus: ['home-rewiring', 'generator-installation', 'panel-upgrades', 'electrical-inspection'],
    faqs: [],
  },
  {
    slug: 'nevada-city', name: 'Nevada City', county: 'Nevada County', elev: 2477, spur: 1,
    utility: 'PG&E', permits: 'City of Nevada City Building Department (in city) or Nevada County Building Department',
    zips: ['95959'], drive: 40, lat: 39.2616, lng: -121.0161,
    lede: 'Nevada City’s downtown is a National Register historic district, and its wiring is often as old as the buildings.',
    notes: [
      'We rewire historic Nevada City homes carefully, fishing new circuits through existing walls and keeping original plaster and trim intact wherever possible. Updates inside the historic district may need design review if anything changes on the outside, like a new meter location.',
      'Surrounding ridges are rural, wooded and on wells, with regular PSPS events. Permits go through the city or Nevada County depending on location.',
    ],
    focus: ['home-rewiring', 'generator-installation', 'electrical-inspection', 'commercial-electrical'],
    faqs: [],
  },
  {
    slug: 'granite-bay', name: 'Granite Bay', county: 'Placer County', elev: 250, route: null,
    utility: 'PG&E', permits: 'Placer County Building Services',
    zips: ['95746'], drive: 20, lat: 38.7632, lng: -121.1638,
    lede: 'Granite Bay’s larger custom homes near Folsom Lake bring larger electrical projects: pools, spas, landscape lighting, multiple EV chargers and battery backup.',
    notes: [
      'Many Granite Bay homes have 200–400 amp services, but they also carry heavy loads, like pool equipment, two HVAC systems and shop or wine-room cooling. We do load calculations before adding EV chargers or spas, and install load management where it saves a service upgrade.',
      'Granite Bay is unincorporated Placer County, with permits through the county, and is PG&E territory.',
    ],
    focus: ['hot-tub-spa-wiring', 'lighting-installation', 'ev-charger-installation', 'solar-battery-electrical'],
    faqs: [],
  },
  {
    slug: 'lincoln', name: 'Lincoln', county: 'Placer County', elev: 167, route: null,
    utility: 'PG&E', permits: 'City of Lincoln Building Division',
    zips: ['95648'], drive: 25, lat: 38.8916, lng: -121.293,
    lede: 'Lincoln is one of Placer County’s fastest-growing cities, including Sun City Lincoln Hills, so most work here is on newer homes adding EVs, solar and backup power.',
    notes: [
      'In Sun City Lincoln Hills and Twelve Bridges, we install EV chargers, battery backup subpanels, generator inlets and safety upgrades like better lighting and grab-bar-height switches. Older downtown Lincoln homes see more panel replacements and repairs.',
      'Lincoln is PG&E territory, with permits through the City of Lincoln.',
    ],
    focus: ['ev-charger-installation', 'solar-battery-electrical', 'generator-installation', 'lighting-installation'],
    faqs: [],
  },
  {
    slug: 'folsom', name: 'Folsom', county: 'Sacramento County', elev: 220, route: null,
    utility: 'PG&E', permits: 'City of Folsom Building Division',
    zips: ['95630'], drive: 30, lat: 38.678, lng: -121.1761,
    lede: 'Folsom runs from the historic Sutter Street district to brand-new neighborhoods south of Highway 50, so the work ranges from old-building rewires to new-home EV setups.',
    notes: [
      'Newer Folsom Ranch homes are typically solar-equipped and EV-ready; calls there are for chargers, batteries and spas. Homes from the 1980s–90s around Briggs Ranch and American River Canyon are hitting the age where panels, breakers and devices start to fail.',
      'Unlike Sacramento, Folsom is PG&E territory, with permits through the City of Folsom.',
    ],
    focus: ['ev-charger-installation', 'panel-upgrades', 'hot-tub-spa-wiring', 'commercial-electrical'],
    faqs: [],
  },
  {
    slug: 'el-dorado-hills', name: 'El Dorado Hills', county: 'El Dorado County', elev: 700, route: null,
    utility: 'PG&E', permits: 'El Dorado County Planning & Building',
    zips: ['95762'], drive: 35, lat: 38.6857, lng: -121.0822,
    lede: 'El Dorado Hills homes are mostly large and newer, and the electrical work leans toward additions: backup power, EV charging, pools and outdoor living.',
    notes: [
      'Parts of El Dorado Hills sit in PG&E fire-threat zones and see PSPS events, so battery backup and standby generators are common requests. We also wire outdoor kitchens, spas and landscape lighting.',
      'El Dorado Hills is unincorporated, so permits go through El Dorado County rather than a city.',
    ],
    focus: ['generator-installation', 'ev-charger-installation', 'hot-tub-spa-wiring', 'lighting-installation'],
    faqs: [],
  },
  {
    slug: 'lake-of-the-pines', name: 'Lake of the Pines', county: 'Nevada County', elev: 1500, route: null,
    utility: 'PG&E', permits: 'Nevada County Building Department',
    zips: ['95602'], drive: 25, lat: 39.0385, lng: -121.0624,
    lede: 'Lake of the Pines is a gated lake community north of Auburn. It has an Auburn ZIP code but sits in Nevada County, which matters for permits.',
    notes: [
      'Homes here date mostly from the 1970s onward, and we see original panels, aluminum branch wiring in some homes, and frequent requests for generator interlocks during fire season.',
      'Because Lake of the Pines is in Nevada County, permits go through the Nevada County Building Department, not Placer County or the City of Auburn.',
    ],
    focus: ['generator-installation', 'panel-upgrades', 'home-rewiring', 'electrical-repair'],
    faqs: [],
  },
  {
    slug: 'weimar', name: 'Weimar', county: 'Placer County', elev: 2260, route: 9,
    utility: 'PG&E', permits: 'Placer County Building Services',
    zips: ['95736'], lat: 39.0371, lng: -120.9735,
    lede: 'Weimar sits right on I-80 between Applegate and Colfax: wooded parcels, wells and some of the most frequent shutoffs on our route.',
    notes: [
      'Most Weimar homes are on acreage with a well, a shop or barn, and long service runs from the road. We size feeders for the real distance and wire well pumps so they keep running on a generator.',
      'Weimar is unincorporated Placer County, so permits go through Placer County Building Services. It is PG&E territory and regularly inside PSPS boundaries during fire season.',
    ],
    focus: ['generator-installation', 'outbuilding-well-pump-wiring', 'panel-upgrades', 'emergency-electrician'],
    faqs: [],
  },
  {
    slug: 'foresthill', name: 'Foresthill', county: 'Placer County', elev: 3200,
    utility: 'PG&E', permits: 'Placer County Building Services',
    zips: ['95631'], lat: 39.0202, lng: -120.818,
    lede: 'Foresthill is up on the ridge east of Auburn, between the North and Middle forks of the American River. Pines, propane, wells and long outages define the work here.',
    notes: [
      'Foresthill is one of the places in Placer County most affected by PG&E Public Safety Power Shutoffs and winter storm outages. Generator interlocks, standby generators and well-pump circuits that run on backup power are the most common jobs we do here.',
      'Many homes were built in stages over decades, so we often find undersized services and unpermitted additions. Permits go through Placer County Building Services.',
    ],
    focus: ['generator-installation', 'outbuilding-well-pump-wiring', 'emergency-electrician', 'panel-upgrades'],
    faqs: [],
  },
  {
    slug: 'cool', name: 'Cool', county: 'El Dorado County', elev: 1500,
    utility: 'PG&E', permits: 'El Dorado County Planning & Building',
    zips: ['95614'], lat: 38.8871, lng: -121.0147,
    lede: 'Cool is just across the American River canyon from Auburn on Highway 49: ranch properties, horse land and wells on the El Dorado County side.',
    notes: [
      'Most of our Cool work is rural: barns, arenas and shops on their own subpanels, well pumps, and generator hookups for fire-season shutoffs.',
      'Even though Cool is minutes from Auburn, it is in El Dorado County, so permits go through El Dorado County Planning & Building, not Placer County.',
    ],
    focus: ['outbuilding-well-pump-wiring', 'generator-installation', 'panel-upgrades', 'electrical-repair'],
    faqs: [],
  },
  {
    slug: 'penn-valley', name: 'Penn Valley', county: 'Nevada County', elev: 1400,
    utility: 'PG&E', permits: 'Nevada County Building Department',
    zips: ['95946'], lat: 39.196, lng: -121.191,
    lede: 'Penn Valley lies west of Grass Valley on Highway 20, from the Lake Wildwood community to ranch land along the creeks.',
    notes: [
      'Lake Wildwood homes mostly date from the 1970s onward, and many still have original panels. Out on the ranch parcels, the work is wells, barns and generator hookups.',
      'Penn Valley is unincorporated Nevada County and PG&E territory, with regular fire-season shutoffs. Permits go through the Nevada County Building Department.',
    ],
    focus: ['generator-installation', 'panel-upgrades', 'outbuilding-well-pump-wiring', 'electrical-inspection'],
    faqs: [],
  },
  {
    slug: 'carmichael', name: 'Carmichael', county: 'Sacramento County', elev: 120,
    utility: 'SMUD', permits: 'Sacramento County Building Permits & Inspection',
    zips: ['95608'], lat: 38.6171, lng: -121.3283,
    lede: 'Carmichael is full of 1940s–60s ranch homes on big lots, and plenty of them still run on their original electrical service.',
    notes: [
      'Original 100-amp panels, Federal Pacific and Zinsco breakers, ungrounded outlets and the occasional run of knob-and-tube are what we find most in Carmichael. Those homes are prime candidates for a panel upgrade before an EV charger, heat pump or pool equipment goes in.',
      'Carmichael is unincorporated Sacramento County, so permits go through Sacramento County Building Permits & Inspection. Power is from SMUD.',
    ],
    focus: ['panel-upgrades', 'home-rewiring', 'ev-charger-installation', 'electrical-inspection'],
    faqs: [],
  },
  {
    slug: 'fair-oaks', name: 'Fair Oaks', county: 'Sacramento County', elev: 160,
    utility: 'SMUD', permits: 'Sacramento County Building Permits & Inspection',
    zips: ['95628'], lat: 38.6446, lng: -121.2722,
    lede: 'Fair Oaks runs from the historic Village to homes on the American River bluffs, with a lot of mid-century houses and large lots.',
    notes: [
      'Bluff-top and creek-side homes here often have pools, spas, outdoor lighting and detached shops, all added over the years to a service that was never upgraded. We do the load calculation first, then upgrade or add load management.',
      'Fair Oaks is unincorporated Sacramento County, with permits through Sacramento County Building Permits & Inspection and power from SMUD.',
    ],
    focus: ['panel-upgrades', 'hot-tub-spa-wiring', 'lighting-installation', 'ev-charger-installation'],
    faqs: [],
  },
  {
    slug: 'orangevale', name: 'Orangevale', county: 'Sacramento County', elev: 200,
    utility: 'SMUD', permits: 'Sacramento County Building Permits & Inspection',
    zips: ['95662'], lat: 38.6785, lng: -121.2258,
    lede: 'Orangevale is semi-rural Sacramento County: larger lots, horse property and backyard shops between Citrus Heights and Folsom.',
    notes: [
      'A lot of our Orangevale work is outbuilding power: subpanels for shops and barns, feeders run underground across big lots, and circuits for RVs and equipment. Many homes date from the 1960s to 1980s and need panel work before adding EV chargers.',
      'Orangevale is unincorporated Sacramento County. Permits go through Sacramento County Building Permits & Inspection, and power is from SMUD.',
    ],
    focus: ['outbuilding-well-pump-wiring', 'panel-upgrades', 'ev-charger-installation', 'electrical-repair'],
    faqs: [],
  },
  {
    slug: 'rancho-cordova', name: 'Rancho Cordova', county: 'Sacramento County', elev: 90,
    utility: 'SMUD', permits: 'City of Rancho Cordova Building & Safety',
    zips: ['95670', '95742'], lat: 38.5891, lng: -121.3027,
    lede: 'Rancho Cordova has two kinds of homes: 1950s–60s tract houses near Folsom Boulevard, and brand-new neighborhoods south of Highway 50.',
    notes: [
      'In the older neighborhoods we replace original panels and add grounded circuits. In newer areas like Anatolia and Capital Village, the calls are EV chargers, battery backup and spa hookups.',
      'Rancho Cordova is its own city, so permits go through the City of Rancho Cordova. Power is from SMUD.',
    ],
    focus: ['panel-upgrades', 'ev-charger-installation', 'solar-battery-electrical', 'electrical-repair'],
    faqs: [],
  },
];

export const cityBySlug = Object.fromEntries(cities.map((c) => [c.slug, c]));
export const cityUrl = (c) => `/electrician-${c.slug}-ca/`;
