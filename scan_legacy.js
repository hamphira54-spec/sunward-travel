const fs = require('fs');
const path = require('path');

const root = process.cwd();
const regex = /from.*destinations\.ts|from.*'\.\.\/destinations'|from.*lib\/destinations'|FeaturedDestinations|TicketCard|ui\/DestinationCard/;
const excludes = [
  'lib\\destinations.ts',
  'components\\home\\FeaturedDestinations.tsx',
  'components\\ui\\TicketCard.tsx',
  'components\\ui\\DestinationCard.tsx'
];

function scan(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    if (file === 'node_modules' || file === '.next' || file === '.git') continue;
    const p = path.join(dir, file);
    if (fs.statSync(p).isDirectory()) {
      scan(p);
    } else if (p.endsWith('.ts') || p.endsWith('.tsx')) {
      if (excludes.some(e => p.endsWith(e))) continue;
      const content = fs.readFileSync(p, 'utf8');
      if (regex.test(content)) {
        console.log('Found in ' + p);
      }
    }
  }
}
scan(root);
console.log('Done scanning.');
