const fs = require('fs');
const path = require('path');

const root = process.cwd();

// STEP 7 - lib/guides.ts
let guidesPath = path.join(root, 'lib/guides.ts');
let guidesContent = fs.readFileSync(guidesPath, 'utf8');

// 7a
guidesContent = guidesContent.replace(
  "export type GuideCategory =",
  "import type { ContentBlock } from './content/blocks';\nimport type { ContentStatus } from './content/types';\n\nexport type GuideCategory ="
);

// 7b
guidesContent = guidesContent.replace(
  "featured?: boolean;",
  "featured?: boolean;\n\n  /**\n   * Structured article body — serializable, database-ready.\n   * Rendered by ContentRenderer. Replaces JSX ARTICLE_CONTENT map.\n   * Optional: if absent, the guide page falls back to an excerpt display.\n   */\n  body?: ContentBlock[];\n\n  /**\n   * Publication lifecycle status.\n   * Defaults to 'published' for all existing static guides.\n   * Future CMS will set this explicitly.\n   */\n  status?: ContentStatus;"
);

// update comment block
guidesContent = guidesContent.replace(
  "const ARTICLE_CONTENT: Record<string, React.ReactNode>",
  "body: ContentBlock[]"
);
guidesContent = guidesContent.replace(
  "render content from ARTICLE_CONTENT map",
  "render content from body: ContentBlock[]"
);
guidesContent = guidesContent.replace(
  "NOTE: To edit guide article bodies, modify the ARTICLE_CONTENT map",
  "NOTE: To edit guide article bodies, modify the body: ContentBlock[] property"
);

// 7c
const body1 = `    body: [
      {
        type: 'heading' as const,
        level: 2 as const,
        id: 'overview',
        text: 'Bali Weather Overview',
      },
      {
        type: 'paragraph' as const,
        nodes: [
          { type: 'text' as const, content: "Bali's tropical climate means it's warm year-round — but the difference between dry season and wet season shapes your experience dramatically. Here's a month-by-month breakdown so you can plan the perfect trip." },
        ],
      },
      {
        type: 'heading' as const,
        level: 2 as const,
        id: 'dry-season',
        text: 'Dry Season: May – September (Best Overall)',
      },
      {
        type: 'paragraph' as const,
        nodes: [
          { type: 'text' as const, content: "This is Bali's most popular time to visit — and for good reason. Days are reliably sunny, humidity is lower, and the ocean is calm and clear for snorkelling and diving around Nusa Penida. Expect busy beaches in Seminyak and Kuta, higher accommodation rates, and rice terraces at their most photogenic as the harvest season approaches." },
        ],
      },
      {
        type: 'heading' as const,
        level: 2 as const,
        id: 'shoulder-season',
        text: 'Shoulder Season: April and October',
      },
      {
        type: 'paragraph' as const,
        nodes: [
          { type: 'text' as const, content: 'These transitional months offer a sweet spot: decent weather, lower prices than peak season, and fewer crowds. April still sees occasional showers; October can bring the first rains of the wet season but often stays dry through mid-month.' },
        ],
      },
      {
        type: 'heading' as const,
        level: 2 as const,
        id: 'wet-season',
        text: 'Wet Season: November – March',
      },
      {
        type: 'paragraph' as const,
        nodes: [
          { type: 'text' as const, content: "Rain doesn't mean staying indoors — Bali's wet season typically brings short, intense afternoon downpours rather than all-day rain. The island turns impossibly lush and green, hotel rates drop significantly, and the spiritual calendar peaks with major temple ceremonies around the Balinese New Year (Nyepi) in March." },
        ],
      },
      {
        type: 'heading' as const,
        level: 2 as const,
        id: 'special-events',
        text: 'Special Events Worth Planning Around',
      },
      {
        type: 'list' as const,
        ordered: false,
        items: [
          {
            nodes: [
              { type: 'strong' as const, content: 'Nyepi (March)' },
              { type: 'text' as const, content: ' — The Balinese Day of Silence. The entire island shuts down for 24 hours. A profound, unique experience.' },
            ],
          },
          {
            nodes: [
              { type: 'strong' as const, content: 'Galungan & Kuningan' },
              { type: 'text' as const, content: ' — A 10-day festival celebrating ancestral spirits. Villages are decorated with penjor bamboo poles.' },
            ],
          },
          {
            nodes: [
              { type: 'strong' as const, content: 'Bali Arts Festival (June–July)' },
              { type: 'text' as const, content: ' — Month-long celebration of Balinese culture, dance, and music in Denpasar.' },
            ],
          },
        ],
      },
      {
        type: 'heading' as const,
        level: 2 as const,
        id: 'recommendation',
        text: 'Our Recommendation',
      },
      {
        type: 'paragraph' as const,
        nodes: [
          { type: 'text' as const, content: 'For first-time visitors: aim for ' },
          { type: 'strong' as const, content: 'May or September' },
          { type: 'text' as const, content: " — you get dry-season reliability at slightly lower prices than July–August peak. Experienced travellers who want Bali's soul over its Instagram moments should consider January for the festivals and dramatically lower costs." },
        ],
      },
    ],`;
const body2 = `    body: [
      {
        type: 'paragraph' as const,
        nodes: [
          { type: 'text' as const, content: 'Finding a cheap transatlantic flight requires timing, flexibility, and knowing which tools actually work. These nine strategies are based on how real budget travellers consistently find fares well below the average.' },
        ],
      },
      { type: 'heading' as const, level: 2 as const, id: 'booking-window', text: 'Book at the Right Time' },
      {
        type: 'paragraph' as const,
        nodes: [
          { type: 'text' as const, content: 'For transatlantic routes, the optimal booking window is roughly 3–6 months before departure for peak summer and 6–10 weeks out for shoulder and off-peak dates. Last-minute fares to Europe from North America are almost always expensive. The best deals appear mid-week (Tuesday–Wednesday) and during off-peak periods (November through March, excluding holidays).' },
        ],
      },
      { type: 'heading' as const, level: 2 as const, id: 'budget-airlines', text: 'Use Budget Airlines Strategically' },
      {
        type: 'paragraph' as const,
        nodes: [
          { type: 'text' as const, content: "European budget carriers like Ryanair, easyJet, Wizz Air, and Vueling connect dozens of secondary cities at very low fares — but only once you're already in Europe. Use them for the intra-European leg. For the transatlantic crossing, airlines like Icelandair, LEVEL, and Norse Atlantic have operated low-cost long-haul routes. Availability changes — always check directly before assuming a route exists." },
        ],
      },
      { type: 'heading' as const, level: 2 as const, id: 'flexible-dates', text: 'Stay Flexible on Dates' },
      {
        type: 'paragraph' as const,
        nodes: [
          { type: 'text' as const, content: 'Even a two-day shift can save $150–300 on a transatlantic ticket. Tuesday and Wednesday departures are usually the cheapest. Arriving back mid-week also helps. Use a calendar view or flexible-date tool when searching rather than searching a single date.' },
        ],
      },
      { type: 'heading' as const, level: 2 as const, id: 'fare-alerts', text: 'Set Fare Alerts' },
      {
        type: 'paragraph' as const,
        nodes: [
          { type: 'text' as const, content: "Google Flights' price tracking, Kayak Explore, and dedicated alert services monitor routes and email you when fares drop. These are most useful if your travel dates are flexible and you can move quickly — sale fares often last 24–48 hours." },
        ],
      },
      { type: 'heading' as const, level: 2 as const, id: 'positioning-flights', text: 'Consider Positioning Flights' },
      {
        type: 'paragraph' as const,
        nodes: [
          { type: 'text' as const, content: 'If you live near a smaller regional airport, check whether flying first to a major hub (New York JFK, London Heathrow, Amsterdam, or Frankfurt) and then onward is cheaper overall than a direct routing. Sometimes paying $60–80 for a positioning flight saves $400 on the transatlantic portion.' },
        ],
      },
      { type: 'heading' as const, level: 2 as const, id: 'travel-credit-cards', text: 'Leverage Travel Credit Cards' },
      {
        type: 'paragraph' as const,
        nodes: [
          { type: 'text' as const, content: 'Sign-up bonuses on travel credit cards can cover round-trip transatlantic flights in premium cabins for points equivalent to $200–400. If you use credit cards responsibly and pay them monthly, this is a genuine strategy — not a myth.' },
        ],
      },
      { type: 'heading' as const, level: 2 as const, id: 'indirect-routes', text: 'Try Indirect Routes' },
      {
        type: 'paragraph' as const,
        nodes: [
          { type: 'text' as const, content: "A one-stop itinerary through Reykjavik, Dublin, or Lisbon is often 20–35% cheaper than non-stop. The layover adds time but the savings are real. Icelandair's stopover policy lets you spend days in Reykjavik at no extra fare cost." },
        ],
      },
      { type: 'heading' as const, level: 2 as const, id: 'shoulder-season', text: 'Travel in Shoulder Season' },
      {
        type: 'paragraph' as const,
        nodes: [
          { type: 'text' as const, content: "May, early June, and September are Europe's sweet spot — warm enough for outdoor travel, crowds below peak, and fares 20–40% lower than July–August. October is excellent for city travel before the cold sets in." },
        ],
      },
      { type: 'heading' as const, level: 2 as const, id: 'nearby-airports', text: 'Check Nearby Airports' },
      {
        type: 'paragraph' as const,
        nodes: [
          { type: 'text' as const, content: 'Flying into secondary airports near your destination — Beauvais instead of CDG, Stansted instead of Heathrow, Charleroi instead of Brussels — can be significantly cheaper. Factor in the cost and time of ground transport before deciding.' },
        ],
      },
      {
        type: 'paragraph' as const,
        nodes: [
          { type: 'text' as const, content: 'No single strategy works every time. The travellers who consistently find cheap transatlantic fares combine flexibility, monitoring, and speed. If you see a genuinely good fare, book it — they disappear quickly.' },
        ],
      },
    ],`;
const body3 = `    body: [
      {
        type: 'paragraph' as const,
        nodes: [
          { type: 'text' as const, content: "Tokyo can feel overwhelming before you arrive and remarkably navigable once you do. Japan's capital has excellent signage in English, a famously punctual transport network, and locals who are almost universally helpful to confused visitors. This guide covers everything you need for a first visit to work smoothly." },
        ],
      },
      { type: 'heading' as const, level: 2 as const, id: 'getting-there', text: 'Getting to Tokyo' },
      {
        type: 'paragraph' as const,
        nodes: [
          { type: 'text' as const, content: "Most international flights land at Narita International Airport (NRT), about 60km from central Tokyo, or Haneda Airport (HND), much closer to the city centre. From Narita, the Narita Express (N'EX) train takes about 53 minutes to Shinjuku and costs around \\u00a53,070 one-way. From Haneda, the Tokyo Monorail or Keikyu line connect to the city in 20\\u201330 minutes. Airport limousine buses are also available to major hotels." },
        ],
      },
      { type: 'heading' as const, level: 2 as const, id: 'getting-around', text: 'Getting Around: IC Card & Trains' },
      {
        type: 'paragraph' as const,
        nodes: [
          { type: 'text' as const, content: "Buy a Suica or Pasmo IC card at the airport on arrival. Load money on it and tap in/out of every subway, JR train, and even many buses. It also works at convenience stores, vending machines, and some restaurants. Tokyo's train network is extensive but logical — Google Maps works excellently for routing and shows real-time platform and departure information." },
        ],
      },
      { type: 'heading' as const, level: 2 as const, id: 'best-neighbourhoods', text: 'Best Neighbourhoods to Stay In' },
      {
        type: 'paragraph' as const,
        nodes: [
          { type: 'text' as const, content: 'Shinjuku is the most convenient base: great transport connections, endless food and shopping, and central to the JR network. Shibuya suits younger travellers and those focused on nightlife and fashion. Asakusa has the old-city atmosphere and is close to cultural sites like Senso-ji. Akihabara and Akasaka are quieter but still well-connected.' },
        ],
      },
      { type: 'heading' as const, level: 2 as const, id: 'money-tipping', text: 'Money, Tipping & Costs' },
      {
        type: 'paragraph' as const,
        nodes: [
          { type: 'text' as const, content: 'Japan is still very much a cash society — carry yen at all times. Tipping is not customary and can be considered rude in some contexts. Never leave a tip at a restaurant or for a taxi. ATMs at 7-Eleven, Japan Post, and some convenience stores accept foreign cards reliably. Budget roughly \\u00a55,000\\u20138,000 per day for food eating at local restaurants.' },
        ],
      },
      { type: 'heading' as const, level: 2 as const, id: 'cultural-etiquette', text: 'Cultural Etiquette to Know' },
      {
        type: 'paragraph' as const,
        nodes: [
          { type: 'text' as const, content: "Remove shoes when entering a home or traditional restaurant with tatami mats. Do not eat or drink while walking — it's considered impolite. On trains, keep your phone on silent and avoid phone calls. Bow slightly when thanking or greeting people. Queuing is always single-file and orderly. Rubbish bins are scarce — carry a small bag for your waste." },
        ],
      },
      { type: 'heading' as const, level: 2 as const, id: 'what-to-eat', text: 'What to Eat in Tokyo' },
      {
        type: 'paragraph' as const,
        nodes: [
          { type: 'text' as const, content: "Tokyo has more Michelin stars than any other city in the world and also has the best convenience store food you will ever eat. Don't skip: ramen (especially in the back streets of Shinjuku), sushi at Tsukiji Outer Market or a standing sushi bar, tonkatsu, tempura, and yakitori. Convenience stores (7-Eleven, FamilyMart, Lawson) have legitimately excellent onigiri and hot food for \\u00a5150\\u2013300." },
        ],
      },
      { type: 'heading' as const, level: 2 as const, id: 'must-see', text: 'Must-See Attractions' },
      {
        type: 'paragraph' as const,
        nodes: [
          { type: 'strong' as const, content: 'Senso-ji Temple (Asakusa)' },
          { type: 'text' as const, content: ' — beautiful at dawn before crowds arrive. ' },
          { type: 'strong' as const, content: 'Shibuya Crossing' },
          { type: 'text' as const, content: ' — most atmospheric at night. ' },
          { type: 'strong' as const, content: 'Shinjuku Gyoen' },
          { type: 'text' as const, content: ' — best garden for cherry blossoms. ' },
          { type: 'strong' as const, content: 'teamLab Borderless/Planets' },
          { type: 'text' as const, content: ' — digital art, book ahead. Tokyo Skytree for city views. Meiji Shrine for tranquillity inside the city.' },
        ],
      },
      { type: 'heading' as const, level: 2 as const, id: 'day-trips', text: 'Day Trips from Tokyo' },
      {
        type: 'paragraph' as const,
        nodes: [
          { type: 'strong' as const, content: 'Nikko' },
          { type: 'text' as const, content: ' (2 hours by Tobu line) — ornate shrines and waterfalls. ' },
          { type: 'strong' as const, content: 'Kamakura' },
          { type: 'text' as const, content: ' (1 hour by JR) — Great Buddha and coastal temples. ' },
          { type: 'strong' as const, content: 'Hakone' },
          { type: 'text' as const, content: ' (1.5 hours, Hakone Free Pass) — Mount Fuji views, hot springs, open-air sculpture museum. ' },
          { type: 'strong' as const, content: 'Kyoto' },
          { type: 'text' as const, content: ' (2.5 hours by Shinkansen) — feasible as a very long day trip but better as an overnight.' },
        ],
      },
    ],`;

let match1 = false;
let match2 = false;
let match3 = false;
const lines = guidesContent.split('\\n');
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes("slug: 'best-time-to-visit-bali'")) match1 = true;
  if (lines[i].includes("slug: 'cheapest-ways-to-fly-to-europe'")) match2 = true;
  if (lines[i].includes("slug: 'tokyo-first-timer-guide'")) match3 = true;
  
  if (lines[i].trim() === 'featured: true,') {
    if (match3) {
      lines.splice(i + 1, 0, body3);
      match3 = false;
    } else if (match2) {
      lines.splice(i + 1, 0, body2);
      match2 = false;
    } else if (match1) {
      lines.splice(i + 1, 0, body1);
      match1 = false;
    }
  }
}
guidesContent = lines.join('\\n');
fs.writeFileSync(guidesPath, guidesContent);
console.log('Updated guides.ts');
