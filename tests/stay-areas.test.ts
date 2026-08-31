import { test, describe } from 'node:test';
import assert from 'node:assert';
import { extractStayAreasFromGuide } from '../lib/hotels/stay-areas';
import type { TravelGuide } from '../lib/guides';

describe('extractStayAreasFromGuide', () => {
  test('1. valid StayArea accepted', () => {
    const guide = {
      body: [{
        type: 'stay_area',
        id: 'valid-slug',
        name: 'Valid Name',
        summary: 'A valid area.',
        bestForTitle: 'Best for',
        bestFor: ['Families', 'Couples'],
        accommodationTypes: ['Resorts', 'Villas'],
        atmosphere: 'Relaxing',
        transportNotes: 'Easy walking',
        nearbyHighlights: ['Beach'],
        considerations: ['Expensive']
      }]
    } as any;
    const result = extractStayAreasFromGuide(guide);
    assert.strictEqual(result.length, 1);
    assert.strictEqual(result[0].id, 'valid-slug');
    assert.strictEqual(result[0].name, 'Valid Name');
  });

  test('2. missing name rejected', () => {
    const guide = {
      body: [{
        type: 'stay_area',
        id: 'valid-slug',
        name: '',
        summary: 'A valid area.',
        bestFor: ['Families'],
        accommodationTypes: ['Resorts']
      }]
    } as any;
    const result = extractStayAreasFromGuide(guide);
    assert.strictEqual(result.length, 0);
  });

  test('3. missing/invalid id or slug rejected', () => {
    const guide = {
      body: [{
        type: 'stay_area',
        id: 'Invalid Slug!',
        name: 'Name',
        summary: 'A valid area.',
        bestFor: ['Families'],
        accommodationTypes: ['Resorts']
      }]
    } as any;
    const result = extractStayAreasFromGuide(guide);
    assert.strictEqual(result.length, 0);
  });

  test('4. duplicate StayAreas rejected safely', () => {
    const guide = {
      body: [{
        type: 'stay_area',
        id: 'duplicate',
        name: 'Duplicate 1',
        summary: '1',
        bestFor: [],
        accommodationTypes: []
      }, {
        type: 'stay_area',
        id: 'duplicate',
        name: 'Duplicate 2',
        summary: '2',
        bestFor: [],
        accommodationTypes: []
      }]
    } as any;
    const result = extractStayAreasFromGuide(guide);
    assert.strictEqual(result.length, 1);
    assert.strictEqual(result[0].name, 'Duplicate 1');
  });

  test('5. malformed bestFor safely normalized', () => {
    const guide = {
      body: [{
        type: 'stay_area',
        id: 'slug',
        name: 'Name',
        summary: 'A valid area.',
        bestFor: ['Valid', null, 123, ' ', 'Another Valid'],
        accommodationTypes: []
      }]
    } as any;
    const result = extractStayAreasFromGuide(guide);
    assert.strictEqual(result[0].bestForList, 'Valid, Another Valid');
  });

  test('6. invalid traveler intent rejected', () => {
    const guide = {
      body: [{
        type: 'stay_area',
        id: 'slug',
        name: 'Name',
        summary: 'A valid area.',
        bestFor: [{}],
        accommodationTypes: []
      }]
    } as any;
    const result = extractStayAreasFromGuide(guide);
    assert.strictEqual(result[0].bestForList, '');
  });

  test('7. malformed accommodationTypes safely normalized', () => {
    const guide = {
      body: [{
        type: 'stay_area',
        id: 'slug',
        name: 'Name',
        summary: 'A valid area.',
        bestFor: [],
        accommodationTypes: 'not-an-array'
      }]
    } as any;
    const result = extractStayAreasFromGuide(guide);
    assert.strictEqual(result[0].accommodationStyle, '');
  });

  test('8. invalid accommodation type rejected', () => {
    const guide = {
      body: [{
        type: 'stay_area',
        id: 'slug',
        name: 'Name',
        summary: 'A valid area.',
        bestFor: [],
        accommodationTypes: [1, true, null, 'Hostels']
      }]
    } as any;
    const result = extractStayAreasFromGuide(guide);
    assert.strictEqual(result[0].accommodationStyle, 'Hostels');
  });

  test('9. malformed stay_area ContentBlock does not crash extraction', () => {
    const guide = {
      body: [null, undefined, 123, 'string', { type: 'stay_area' }]
    } as any;
    const result = extractStayAreasFromGuide(guide);
    assert.strictEqual(result.length, 0);
  });

  test('10. legacy accommodation parsing backward compatible', () => {
    const guide = {
      body: [
        { type: 'heading', level: 2, id: 'legacy-id', text: 'Legacy Name : Best for Families' },
        { type: 'paragraph', nodes: [{ content: 'Legacy summary.' }] },
        { type: 'list', items: [{ nodes: [{ content: 'Best for: Couples' }] }] }
      ]
    } as any;
    const result = extractStayAreasFromGuide(guide);
    assert.strictEqual(result.length, 1);
    assert.strictEqual(result[0].id, 'legacy-id');
    assert.strictEqual(result[0].name, 'Legacy Name');
    assert.strictEqual(result[0].bestForList, 'Couples');
  });
});
