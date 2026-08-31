import type { TravelGuide } from '@/lib/guides';
import type { ContentBlock, HeadingBlock, ParagraphBlock, ListBlock, StayAreaBlock } from '@/lib/content/blocks';

export interface StayArea {
  id: string;
  name: string;
  shortDescription: string;
  bestForTitle: string;
  bestForList: string;
  accommodationStyle: string;
  atmosphere?: string;
  transportNotes?: string;
  nearbyHighlights?: string[];
  considerations?: string[];
}

export function extractStayAreasFromGuide(guide: TravelGuide): StayArea[] {
  if (!guide.body) return [];

  const areas: StayArea[] = [];
  let currentArea: Partial<StayArea> | null = null;

  for (const block of guide.body as ContentBlock[]) {
    // 1) Modern structured block
    if (block.type === 'stay_area') {
      areas.push({
        id: block.id,
        name: block.name,
        shortDescription: block.summary,
        bestForTitle: block.bestForTitle || 'Best for',
        bestForList: block.bestFor.join(', '),
        accommodationStyle: block.accommodationTypes.join(', '),
        atmosphere: block.atmosphere,
        transportNotes: block.transportNotes,
        nearbyHighlights: block.nearbyHighlights,
        considerations: block.considerations
      });
      continue;
    }

    // 2) Legacy fallback for unstructured pilot guides
    if (block.type === 'heading' && block.level === 2 && block.id && block.id !== 'overview') {
      if (currentArea && currentArea.id) {
        areas.push(currentArea as StayArea);
      }
      const [name, ...rest] = block.text.split(':');
      currentArea = {
        id: block.id,
        name: name.trim(),
        bestForTitle: rest.length > 0 ? rest.join(':').replace('Best for', '').trim() : 'Best for',
        shortDescription: '',
        bestForList: '',
        accommodationStyle: ''
      };
    } else if (currentArea) {
      if (block.type === 'paragraph' && !currentArea.shortDescription) {
        currentArea.shortDescription = block.nodes.map((n: any) => n.content).join('');
      } else if (block.type === 'list') {
        for (const item of block.items) {
          const text = item.nodes.map((n: any) => n.content).join('');
          if (text.toLowerCase().includes('best for:')) {
            currentArea.bestForList = text.replace(/best for:/i, '').trim();
          }
          if (text.toLowerCase().includes('accommodation style:')) {
            currentArea.accommodationStyle = text.replace(/accommodation style:/i, '').trim();
          }
        }
      }
    }
  }

  if (currentArea && currentArea.id) {
    areas.push(currentArea as StayArea);
  }

  return areas;
}
