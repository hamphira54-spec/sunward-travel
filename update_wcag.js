const fs = require('fs');
const path = require('path');

const root = process.cwd();

const replacements = [
  {
    file: 'components/ui/Button.tsx',
    regex: /bg-ocean text-white hover:bg-ocean-dark/g,
    replace: 'bg-interactive text-white hover:bg-interactive-dark'
  },
  {
    file: 'components/flights/FlightSearchForm.tsx',
    regex: /bg-ocean text-white hover:bg-ocean-dark/g,
    replace: 'bg-interactive text-white hover:bg-interactive-dark'
  },
  {
    file: 'components/home/NewsletterSignup.tsx',
    regex: /bg-ocean text-white hover:bg-ocean-dark/g,
    replace: 'bg-interactive text-white hover:bg-interactive-dark'
  },
  {
    file: 'app/cars/page.tsx',
    regex: /bg-ocean text-white hover:bg-ocean-dark/g,
    replace: 'bg-interactive text-white hover:bg-interactive-dark'
  },
  {
    file: 'app/contact/page.tsx',
    regex: /bg-ocean text-white hover:bg-ocean-dark/g,
    replace: 'bg-interactive text-white hover:bg-interactive-dark'
  },
  {
    file: 'app/destinations/[country]/[destination]/page.tsx',
    regex: /bg-ocean text-white hover:bg-ocean-dark/g,
    replace: 'bg-interactive text-white hover:bg-interactive-dark'
  },
  {
    file: 'app/destinations/[country]/page.tsx',
    regex: /bg-ocean text-white hover:bg-ocean-dark/g,
    replace: 'bg-interactive text-white hover:bg-interactive-dark'
  },
  {
    file: 'app/destinations/page.tsx',
    regex: /bg-ocean text-white hover:bg-ocean-dark/g,
    replace: 'bg-interactive text-white hover:bg-interactive-dark'
  },
  {
    file: 'app/flights/[...route]/page.tsx',
    regex: /bg-ocean text-white/g, // The prompt states "change bg-ocean text-white to bg-interactive text-white"
    replace: 'bg-interactive text-white'
  },
  {
    file: 'components/widgets/TravelpayoutsWidget.tsx',
    regex: /bg-ocean text-white hover:bg-ocean-dark/g,
    replace: 'bg-interactive text-white hover:bg-interactive-dark'
  }
];

replacements.forEach(({ file, regex, replace }) => {
  const p = path.join(root, file);
  if (fs.existsSync(p)) {
    let content = fs.readFileSync(p, 'utf8');
    
    // In [...route]/page.tsx, if it only has bg-ocean text-white, we might accidentally match tabs if they exist, but the prompt says line 109 back Link. Let's make sure it's the right one.
    if (file === 'app/flights/[...route]/page.tsx') {
      content = content.replace(
        /bg-ocean text-white hover:bg-ocean-dark/g, // Just in case it has hover
        'bg-interactive text-white hover:bg-interactive-dark'
      );
      content = content.replace(
        /className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-ocean text-white hover:bg-ocean-dark/g,
        'className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-interactive text-white hover:bg-interactive-dark'
      );
      content = content.replace(
        /bg-ocean text-white/g,
        'bg-interactive text-white'
      );
    } else {
      content = content.replace(regex, replace);
    }
    
    fs.writeFileSync(p, content);
    console.log('Updated ' + file);
  } else {
    console.log('File not found: ' + file);
  }
});
