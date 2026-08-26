import type { Airport } from '@/lib/types/flights';

// ─────────────────────────────────────────────────────────────────────────────
// Curated list of ~200 major international airports for autocomplete.
// Sorted roughly by passenger volume / search popularity.
// ─────────────────────────────────────────────────────────────────────────────
export const AIRPORTS: Airport[] = [
  // Asia — Southeast
  { iata: 'BKK', name: 'Suvarnabhumi Airport',              city: 'Bangkok',        country: 'Thailand' },
  { iata: 'DMK', name: 'Don Mueang International Airport',  city: 'Bangkok',        country: 'Thailand' },
  { iata: 'SIN', name: 'Changi Airport',                    city: 'Singapore',      country: 'Singapore' },
  { iata: 'KUL', name: 'Kuala Lumpur International Airport',city: 'Kuala Lumpur',   country: 'Malaysia' },
  { iata: 'CGK', name: 'Soekarno-Hatta International',      city: 'Jakarta',        country: 'Indonesia' },
  { iata: 'DPS', name: 'Ngurah Rai International Airport',  city: 'Bali',           country: 'Indonesia' },
  { iata: 'MNL', name: 'Ninoy Aquino International Airport',city: 'Manila',         country: 'Philippines' },
  { iata: 'SGN', name: 'Tan Son Nhat International Airport',city: 'Ho Chi Minh City',country: 'Vietnam' },
  { iata: 'HAN', name: 'Noi Bai International Airport',     city: 'Hanoi',          country: 'Vietnam' },
  { iata: 'RGN', name: 'Yangon International Airport',      city: 'Yangon',         country: 'Myanmar' },
  { iata: 'DAD', name: 'Da Nang International Airport',     city: 'Da Nang',        country: 'Vietnam' },
  { iata: 'PNH', name: 'Phnom Penh International Airport',  city: 'Phnom Penh',     country: 'Cambodia' },
  { iata: 'REP', name: 'Siem Reap International Airport',   city: 'Siem Reap',      country: 'Cambodia' },
  { iata: 'VTE', name: 'Wattay International Airport',      city: 'Vientiane',      country: 'Laos' },

  // Asia — East
  { iata: 'NRT', name: 'Narita International Airport',      city: 'Tokyo',          country: 'Japan' },
  { iata: 'HND', name: 'Haneda Airport',                    city: 'Tokyo',          country: 'Japan' },
  { iata: 'KIX', name: 'Kansai International Airport',      city: 'Osaka',          country: 'Japan' },
  { iata: 'CTS', name: 'New Chitose Airport',               city: 'Sapporo',        country: 'Japan' },
  { iata: 'FUK', name: 'Fukuoka Airport',                   city: 'Fukuoka',        country: 'Japan' },
  { iata: 'ICN', name: 'Incheon International Airport',     city: 'Seoul',          country: 'South Korea' },
  { iata: 'GMP', name: 'Gimpo International Airport',       city: 'Seoul',          country: 'South Korea' },
  { iata: 'PUS', name: 'Gimhae International Airport',      city: 'Busan',          country: 'South Korea' },
  { iata: 'PEK', name: 'Beijing Capital International',     city: 'Beijing',        country: 'China' },
  { iata: 'PKX', name: 'Beijing Daxing International',      city: 'Beijing',        country: 'China' },
  { iata: 'PVG', name: 'Shanghai Pudong International',     city: 'Shanghai',       country: 'China' },
  { iata: 'SHA', name: 'Shanghai Hongqiao International',   city: 'Shanghai',       country: 'China' },
  { iata: 'CAN', name: 'Guangzhou Baiyun International',    city: 'Guangzhou',      country: 'China' },
  { iata: 'SZX', name: 'Shenzhen Bao\'an International',   city: 'Shenzhen',       country: 'China' },
  { iata: 'CTU', name: 'Chengdu Tianfu International',      city: 'Chengdu',        country: 'China' },
  { iata: 'HKG', name: 'Hong Kong International Airport',   city: 'Hong Kong',      country: 'Hong Kong' },
  { iata: 'TPE', name: 'Taiwan Taoyuan International',      city: 'Taipei',         country: 'Taiwan' },
  { iata: 'MFM', name: 'Macau International Airport',       city: 'Macau',          country: 'Macau' },

  // Asia — South
  { iata: 'DEL', name: 'Indira Gandhi International',       city: 'New Delhi',      country: 'India' },
  { iata: 'BOM', name: 'Chhatrapati Shivaji Maharaj International', city: 'Mumbai', country: 'India' },
  { iata: 'BLR', name: 'Kempegowda International Airport',  city: 'Bangalore',      country: 'India' },
  { iata: 'MAA', name: 'Chennai International Airport',     city: 'Chennai',        country: 'India' },
  { iata: 'HYD', name: 'Rajiv Gandhi International Airport',city: 'Hyderabad',      country: 'India' },
  { iata: 'CCU', name: 'Netaji Subhas Chandra Bose International', city: 'Kolkata', country: 'India' },
  { iata: 'CMB', name: 'Bandaranaike International Airport',city: 'Colombo',        country: 'Sri Lanka' },
  { iata: 'DAC', name: 'Hazrat Shahjalal International',    city: 'Dhaka',          country: 'Bangladesh' },
  { iata: 'KTM', name: 'Tribhuvan International Airport',   city: 'Kathmandu',      country: 'Nepal' },
  { iata: 'MLE', name: 'Velana International Airport',      city: 'Malé',           country: 'Maldives' },

  // Middle East
  { iata: 'DXB', name: 'Dubai International Airport',       city: 'Dubai',          country: 'UAE' },
  { iata: 'AUH', name: 'Abu Dhabi International Airport',   city: 'Abu Dhabi',      country: 'UAE' },
  { iata: 'DOH', name: 'Hamad International Airport',       city: 'Doha',           country: 'Qatar' },
  { iata: 'KWI', name: 'Kuwait International Airport',      city: 'Kuwait City',    country: 'Kuwait' },
  { iata: 'BAH', name: 'Bahrain International Airport',     city: 'Manama',         country: 'Bahrain' },
  { iata: 'MCT', name: 'Muscat International Airport',      city: 'Muscat',         country: 'Oman' },
  { iata: 'AMM', name: 'Queen Alia International Airport',  city: 'Amman',          country: 'Jordan' },
  { iata: 'BEY', name: 'Rafic Hariri International Airport',city: 'Beirut',         country: 'Lebanon' },
  { iata: 'TLV', name: 'Ben Gurion International Airport',  city: 'Tel Aviv',       country: 'Israel' },

  // Europe — Western
  { iata: 'LHR', name: 'Heathrow Airport',                  city: 'London',         country: 'UK' },
  { iata: 'LGW', name: 'Gatwick Airport',                   city: 'London',         country: 'UK' },
  { iata: 'STN', name: 'Stansted Airport',                  city: 'London',         country: 'UK' },
  { iata: 'MAN', name: 'Manchester Airport',                city: 'Manchester',     country: 'UK' },
  { iata: 'EDI', name: 'Edinburgh Airport',                 city: 'Edinburgh',      country: 'UK' },
  { iata: 'CDG', name: 'Charles de Gaulle Airport',         city: 'Paris',          country: 'France' },
  { iata: 'ORY', name: 'Orly Airport',                      city: 'Paris',          country: 'France' },
  { iata: 'NCE', name: 'Nice Côte d\'Azur Airport',         city: 'Nice',           country: 'France' },
  { iata: 'AMS', name: 'Amsterdam Airport Schiphol',        city: 'Amsterdam',      country: 'Netherlands' },
  { iata: 'FRA', name: 'Frankfurt Airport',                 city: 'Frankfurt',      country: 'Germany' },
  { iata: 'MUC', name: 'Munich Airport',                    city: 'Munich',         country: 'Germany' },
  { iata: 'BER', name: 'Berlin Brandenburg Airport',        city: 'Berlin',         country: 'Germany' },
  { iata: 'DUS', name: 'Düsseldorf Airport',                city: 'Düsseldorf',     country: 'Germany' },
  { iata: 'ZRH', name: 'Zurich Airport',                    city: 'Zurich',         country: 'Switzerland' },
  { iata: 'GVA', name: 'Geneva Airport',                    city: 'Geneva',         country: 'Switzerland' },
  { iata: 'VIE', name: 'Vienna International Airport',      city: 'Vienna',         country: 'Austria' },
  { iata: 'BRU', name: 'Brussels Airport',                  city: 'Brussels',       country: 'Belgium' },
  { iata: 'MAD', name: 'Adolfo Suárez Madrid-Barajas',      city: 'Madrid',         country: 'Spain' },
  { iata: 'BCN', name: 'Barcelona-El Prat Airport',         city: 'Barcelona',      country: 'Spain' },
  { iata: 'LIS', name: 'Lisbon Humberto Delgado Airport',   city: 'Lisbon',         country: 'Portugal' },
  { iata: 'FCO', name: 'Leonardo da Vinci–Fiumicino Airport',city: 'Rome',          country: 'Italy' },
  { iata: 'MXP', name: 'Milan Malpensa Airport',            city: 'Milan',          country: 'Italy' },
  { iata: 'ATH', name: 'Athens International Airport',      city: 'Athens',         country: 'Greece' },
  { iata: 'JTR', name: 'Santorini (Thira) Airport',         city: 'Santorini',      country: 'Greece' },
  { iata: 'HER', name: 'Heraklion International Airport',   city: 'Crete',          country: 'Greece' },
  { iata: 'CPH', name: 'Copenhagen Airport',                city: 'Copenhagen',     country: 'Denmark' },
  { iata: 'ARN', name: 'Stockholm Arlanda Airport',         city: 'Stockholm',      country: 'Sweden' },
  { iata: 'OSL', name: 'Oslo Airport, Gardermoen',          city: 'Oslo',           country: 'Norway' },
  { iata: 'HEL', name: 'Helsinki-Vantaa Airport',           city: 'Helsinki',       country: 'Finland' },
  { iata: 'DUB', name: 'Dublin Airport',                    city: 'Dublin',         country: 'Ireland' },
  { iata: 'WAW', name: 'Warsaw Chopin Airport',             city: 'Warsaw',         country: 'Poland' },
  { iata: 'PRG', name: 'Václav Havel Airport Prague',       city: 'Prague',         country: 'Czech Republic' },
  { iata: 'BUD', name: 'Budapest Ferenc Liszt International',city: 'Budapest',      country: 'Hungary' },

  // Europe — Eastern & Turkey
  { iata: 'IST', name: 'Istanbul Airport',                  city: 'Istanbul',       country: 'Turkey' },
  { iata: 'SAW', name: 'Istanbul Sabiha Gökçen Airport',    city: 'Istanbul',       country: 'Turkey' },
  { iata: 'AYT', name: 'Antalya Airport',                   city: 'Antalya',        country: 'Turkey' },
  { iata: 'SVO', name: 'Sheremetyevo International Airport',city: 'Moscow',         country: 'Russia' },
  { iata: 'DME', name: 'Domodedovo International Airport',  city: 'Moscow',         country: 'Russia' },

  // North America
  { iata: 'JFK', name: 'John F. Kennedy International',     city: 'New York',       country: 'USA' },
  { iata: 'LGA', name: 'LaGuardia Airport',                 city: 'New York',       country: 'USA' },
  { iata: 'EWR', name: 'Newark Liberty International',      city: 'New York',       country: 'USA' },
  { iata: 'LAX', name: 'Los Angeles International Airport', city: 'Los Angeles',    country: 'USA' },
  { iata: 'ORD', name: 'O\'Hare International Airport',     city: 'Chicago',        country: 'USA' },
  { iata: 'MDW', name: 'Chicago Midway International',      city: 'Chicago',        country: 'USA' },
  { iata: 'DFW', name: 'Dallas/Fort Worth International',   city: 'Dallas',         country: 'USA' },
  { iata: 'ATL', name: 'Hartsfield-Jackson Atlanta International', city: 'Atlanta', country: 'USA' },
  { iata: 'SFO', name: 'San Francisco International Airport',city: 'San Francisco', country: 'USA' },
  { iata: 'MIA', name: 'Miami International Airport',       city: 'Miami',          country: 'USA' },
  { iata: 'BOS', name: 'Logan International Airport',       city: 'Boston',         country: 'USA' },
  { iata: 'SEA', name: 'Seattle-Tacoma International',      city: 'Seattle',        country: 'USA' },
  { iata: 'LAS', name: 'Harry Reid International Airport',  city: 'Las Vegas',      country: 'USA' },
  { iata: 'DEN', name: 'Denver International Airport',      city: 'Denver',         country: 'USA' },
  { iata: 'PHX', name: 'Phoenix Sky Harbor International',  city: 'Phoenix',        country: 'USA' },
  { iata: 'IAD', name: 'Dulles International Airport',      city: 'Washington DC',  country: 'USA' },
  { iata: 'DCA', name: 'Ronald Reagan Washington National', city: 'Washington DC',  country: 'USA' },
  { iata: 'HNL', name: 'Daniel K. Inouye International',    city: 'Honolulu',       country: 'USA' },
  { iata: 'YYZ', name: 'Toronto Pearson International',     city: 'Toronto',        country: 'Canada' },
  { iata: 'YVR', name: 'Vancouver International Airport',   city: 'Vancouver',      country: 'Canada' },
  { iata: 'YUL', name: 'Montréal-Trudeau International',    city: 'Montreal',       country: 'Canada' },
  { iata: 'YYC', name: 'Calgary International Airport',     city: 'Calgary',        country: 'Canada' },
  { iata: 'MEX', name: 'Mexico City International Airport', city: 'Mexico City',    country: 'Mexico' },
  { iata: 'CUN', name: 'Cancún International Airport',      city: 'Cancún',         country: 'Mexico' },

  // Latin America
  { iata: 'GRU', name: 'São Paulo/Guarulhos International', city: 'São Paulo',      country: 'Brazil' },
  { iata: 'GIG', name: 'Rio de Janeiro/Galeão International',city: 'Rio de Janeiro',country: 'Brazil' },
  { iata: 'EZE', name: 'Ministro Pistarini International',  city: 'Buenos Aires',   country: 'Argentina' },
  { iata: 'BOG', name: 'El Dorado International Airport',   city: 'Bogotá',         country: 'Colombia' },
  { iata: 'LIM', name: 'Jorge Chávez International Airport',city: 'Lima',           country: 'Peru' },
  { iata: 'SCL', name: 'Comodoro Arturo Merino Benítez',    city: 'Santiago',       country: 'Chile' },

  // Africa
  { iata: 'CPT', name: 'Cape Town International Airport',   city: 'Cape Town',      country: 'South Africa' },
  { iata: 'JNB', name: 'O.R. Tambo International Airport',  city: 'Johannesburg',   country: 'South Africa' },
  { iata: 'CAI', name: 'Cairo International Airport',       city: 'Cairo',          country: 'Egypt' },
  { iata: 'NBO', name: 'Jomo Kenyatta International Airport',city: 'Nairobi',       country: 'Kenya' },
  { iata: 'LOS', name: 'Murtala Muhammed International',    city: 'Lagos',          country: 'Nigeria' },
  { iata: 'ADD', name: 'Addis Ababa Bole International',    city: 'Addis Ababa',    country: 'Ethiopia' },
  { iata: 'CMN', name: 'Mohammed V International Airport',  city: 'Casablanca',     country: 'Morocco' },
  { iata: 'RUN', name: 'Roland Garros Airport',             city: 'Réunion',        country: 'Réunion' },
  { iata: 'MRU', name: 'Sir Seewoosagur Ramgoolam International', city: 'Mauritius', country: 'Mauritius' },

  // Oceania
  { iata: 'SYD', name: 'Sydney Airport',                    city: 'Sydney',         country: 'Australia' },
  { iata: 'MEL', name: 'Melbourne Airport',                 city: 'Melbourne',      country: 'Australia' },
  { iata: 'BNE', name: 'Brisbane Airport',                  city: 'Brisbane',       country: 'Australia' },
  { iata: 'PER', name: 'Perth Airport',                     city: 'Perth',          country: 'Australia' },
  { iata: 'ADL', name: 'Adelaide Airport',                  city: 'Adelaide',       country: 'Australia' },
  { iata: 'AKL', name: 'Auckland Airport',                  city: 'Auckland',       country: 'New Zealand' },
  { iata: 'CHC', name: 'Christchurch Airport',              city: 'Christchurch',   country: 'New Zealand' },
  { iata: 'PPT', name: 'Faa\'a International Airport',      city: 'Papeete',        country: 'French Polynesia' },
  { iata: 'NAN', name: 'Nadi International Airport',        city: 'Nadi',           country: 'Fiji' },
];

// Airline code → display name lookup
export const AIRLINE_NAMES: Record<string, string> = {
  AA: 'American Airlines',    AC: 'Air Canada',
  AF: 'Air France',           AI: 'Air India',
  AK: 'AirAsia',             BA: 'British Airways',
  BR: 'EVA Air',             CA: 'Air China',
  CI: 'China Airlines',      CX: 'Cathay Pacific',
  DL: 'Delta Air Lines',     EK: 'Emirates',
  EY: 'Etihad Airways',      FD: 'Thai AirAsia',
  FZ: 'flydubai',            GA: 'Garuda Indonesia',
  IB: 'Iberia',              JL: 'Japan Airlines',
  JQ: 'Jetstar',             KE: 'Korean Air',
  KL: 'KLM',                 LA: 'LATAM Airlines',
  LH: 'Lufthansa',           MH: 'Malaysia Airlines',
  MU: 'China Eastern',       NH: 'ANA',
  NZ: 'Air New Zealand',     OZ: 'Asiana Airlines',
  PR: 'Philippine Airlines', QF: 'Qantas',
  QR: 'Qatar Airways',       QZ: 'AirAsia Indonesia',
  SA: 'South African Airways',SQ: 'Singapore Airlines',
  SU: 'Aeroflot',            TG: 'Thai Airways',
  TK: 'Turkish Airlines',    UA: 'United Airlines',
  UL: 'SriLankan Airlines',  VN: 'Vietnam Airlines',
  WY: 'Oman Air',            XJ: 'Thai AirAsia X',
  VZ: 'Thai Vietjet Air',    IT: 'Tigerair Taiwan',
  TR: 'Scoot',               '3K': 'Jetstar Asia',
};

// Airport lookup helper
export function findAirport(iata: string): Airport | undefined {
  return AIRPORTS.find((a) => a.iata === iata.toUpperCase());
}

// Fuzzy search for autocomplete
export function searchAirports(query: string, limit = 8): Airport[] {
  if (!query || query.length < 2) return [];
  const q = query.toLowerCase();
  return AIRPORTS.filter(
    (a) =>
      a.iata.toLowerCase().includes(q) ||
      a.city.toLowerCase().includes(q) ||
      a.name.toLowerCase().includes(q) ||
      a.country.toLowerCase().includes(q)
  ).slice(0, limit);
}
