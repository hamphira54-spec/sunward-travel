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
  if (!guide.body || !Array.isArray(guide.body)) return [];

  const areas: StayArea[] = [];
  let currentArea: Partial<StayArea> | null = null;
  const seenIds = new Set<string>();

  for (const block of guide.body as ContentBlock[]) {
    if (!block || typeof block !== 'object') continue;

    // 1) Modern structured block
    if (block.type === 'stay_area') {
      const b = block as Partial<StayAreaBlock>;
      
      const id = typeof b.id === 'string' ? b.id.trim() : '';
      const name = typeof b.name === 'string' ? b.name.trim() : '';
      
      if (!id || !name || !/^[a-z0-9-]+$/.test(id)) {
        continue; // missing/invalid slug or name rejected
      }

      if (seenIds.has(id)) {
        continue; // duplicate StayAreas safely handled/rejected
      }
      seenIds.add(id);

      const bestForListArray = Array.isArray(b.bestFor) ? b.bestFor : [];
      // Invalid traveler intent rejected? We could filter empty strings, etc.
      const validBestFor = bestForListArray.filter(i => typeof i === 'string' && i.trim().length > 0);

      const accTypesArray = Array.isArray(b.accommodationTypes) ? b.accommodationTypes : [];
      const validAccTypes = accTypesArray.filter(i => typeof i === 'string' && i.trim().length > 0);

      areas.push({
        id,
        name,
        shortDescription: b.summary || '',
        bestForTitle: b.bestForTitle || 'Best for',
        bestForList: validBestFor.join(', '),
        accommodationStyle: validAccTypes.join(', '),
        atmosphere: b.atmosphere,
        transportNotes: b.transportNotes,
        nearbyHighlights: Array.isArray(b.nearbyHighlights) ? b.nearbyHighlights : [],
        considerations: Array.isArray(b.considerations) ? b.considerations : []
      });
      continue;
    }

    // 2) Legacy fallback for unstructured pilot guides
    if (block.type === 'heading' && (block as any).level === 2 && (block as any).id && (block as any).id !== 'overview') {
      if (currentArea && currentArea.id && !seenIds.has(currentArea.id)) {
        areas.push(currentArea as StayArea);
        seenIds.add(currentArea.id);
      }
      const [name, ...rest] = ((block as any).text || '').split(':');
      currentArea = {
        id: (block as any).id,
        name: name.trim(),
        bestForTitle: rest.length > 0 ? rest.join(':').replace('Best for', '').trim() : 'Best for',
        shortDescription: '',
        bestForList: '',
        accommodationStyle: ''
      };
    } else if (currentArea) {
      if (block.type === 'paragraph' && !currentArea.shortDescription) {
        currentArea.shortDescription = ((block as any).nodes || []).map((n: any) => n.content).join('');
      } else if (block.type === 'list') {
        for (const item of ((block as any).items || [])) {
          const text = (item.nodes || []).map((n: any) => n.content).join('');
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

  if (currentArea && currentArea.id && !seenIds.has(currentArea.id)) {
    areas.push(currentArea as StayArea);
  }

  return areas;
}
