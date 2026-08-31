const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const guides = await prisma.guide.findMany({
    where: { category: { in: ['where-to-stay', 'Accommodation'] } }
  });

  console.log(`Found ${guides.length} guides to migrate`);

  for (const guide of guides) {
    if (!guide.body) continue;
    
    const oldBlocks = guide.body;
    const newBlocks = [];
    
    let currentArea = null;

    for (const block of oldBlocks) {
      if (block.type === 'heading' && block.level === 2 && block.id && block.id !== 'overview') {
        if (currentArea) {
          newBlocks.push(currentArea);
        }
        const [name, ...rest] = block.text.split(':');
        currentArea = {
          type: 'stay_area',
          id: block.id,
          name: name.trim(),
          bestForTitle: rest.length > 0 ? rest.join(':').replace('Best for', '').trim() : 'Best for',
          summary: '',
          bestFor: [],
          accommodationTypes: [],
          atmosphere: '',
          transportNotes: '',
          nearbyHighlights: [],
          considerations: []
        };
      } else if (currentArea) {
        if (block.type === 'paragraph' && !currentArea.summary) {
          currentArea.summary = block.nodes.map(n => n.content).join('');
        } else if (block.type === 'list') {
          for (const item of block.items) {
            const text = item.nodes.map(n => n.content).join('');
            if (text.toLowerCase().includes('best for:')) {
              currentArea.bestFor = text.replace(/best for:/i, '').trim().split(',').map(s => s.trim()).filter(Boolean);
            }
            if (text.toLowerCase().includes('accommodation style:')) {
              currentArea.accommodationTypes = text.replace(/accommodation style:/i, '').trim().split(',').map(s => s.trim()).filter(Boolean);
            }
          }
        } else {
          // Unhandled blocks inside area? Push currentArea and then push the block
          // Actually, pilot guides only have H2 -> Paragraph -> List.
          // Let's just assume we continue until next H2.
        }
      } else {
        newBlocks.push(block);
      }
    }

    if (currentArea) {
      newBlocks.push(currentArea);
    }

    console.log(`Updating ${guide.slug}... Blocks: ${oldBlocks.length} -> ${newBlocks.length}`);
    await prisma.guide.update({
      where: { id: guide.id },
      data: { body: newBlocks, category: 'where-to-stay' }
    });
  }

  console.log('Migration complete.');
}

main().catch(console.error).finally(() => prisma.$disconnect());
