const fs = require('fs');
const path = require('path');

const filePath = path.join(process.cwd(), 'app', 'globals.css');
let content = fs.readFileSync(filePath, 'utf8');

const injectContent = `
  /* ── Interactive elements — WCAG AA accessible button colors ─────────────────
     --color-interactive: #C74A1E achieves 4.71:1 contrast with white text.
     Use bg-interactive (not bg-ocean) for all <button> and <Link> CTAs
     that display white text. bg-ocean (#E8622C) is for decorative accents only.
     ──────────────────────────────────────────────────────────────────────── */
  --color-interactive:      #C74A1E;   /* Terracotta — 4.71:1 with white — WCAG AA ✓ */
  --color-interactive-dark: #A83910;   /* Deeper terracotta — hover / active */`;

if (content.includes('--color-border-strong: #D7BEAA;')) {
  content = content.replace(
    '--color-border-strong: #D7BEAA;',
    '--color-border-strong: #D7BEAA;\n' + injectContent
  );
  fs.writeFileSync(filePath, content);
  console.log('globals.css updated.');
} else {
  console.log('Could not find anchor in globals.css');
}
