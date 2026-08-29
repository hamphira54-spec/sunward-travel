const fs = require('fs');
const path = require('path');

const filePath = path.join(process.cwd(), 'app', 'guides', '[slug]', 'page.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Add import
content = content.replace(
  "import AffiliateDisclosure from '@/components/travel/AffiliateDisclosure';",
  "import AffiliateDisclosure from '@/components/travel/AffiliateDisclosure';\nimport ContentRenderer from '@/components/content/ContentRenderer';"
);

// 2. Remove ARTICLE_CONTENT
const startMarker = "// Article content map — structured React blocks, no dangerouslySetInnerHTML";
const endMarker = "export default async function GuidePage({";

const startIndex = content.indexOf(startMarker);
const endIndex = content.indexOf(endMarker);

if (startIndex !== -1 && endIndex !== -1) {
  content = content.substring(0, startIndex) + content.substring(endIndex);
}

// 3. Remove const content = ARTICLE_CONTENT[slug];
content = content.replace("  const content = ARTICLE_CONTENT[slug];\n", "");

// 4. Update article body rendering
const oldRender = `{content ?? (
                    <div className="bg-white rounded-xl p-8 text-center text-mist border border-gray-100">
                      <p className="font-medium">Full article content coming soon.</p>
                      <p className="text-sm mt-1">{guide.excerpt}</p>
                    </div>
                  )}`;
const newRender = `{guide.body && guide.body.length > 0 ? (
                    <ContentRenderer blocks={guide.body} />
                  ) : (
                    <div className="bg-white rounded-xl p-8 text-center text-mist border border-gray-100">
                      <p className="font-medium">Full article content coming soon.</p>
                      <p className="text-sm mt-1">{guide.excerpt}</p>
                    </div>
                  )}`;
content = content.replace(oldRender, newRender);

// 5. Fix affiliate CTA buttons (WCAG fix)
content = content.replace(
  "bg-ocean text-white text-xs font-700 hover:bg-ocean-dark",
  "bg-interactive text-white text-xs font-700 hover:bg-interactive-dark"
);

fs.writeFileSync(filePath, content);
console.log('page.tsx updated.');
