import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { validateContentBlocks } from '../lib/content/validation';

describe('validateContentBlocks', () => {
  test('rejects unknown ContentBlock type', () => {
    const blocks = [{ type: 'unknown_magic_block', data: 'hello' }];
    assert.throws(
      () => validateContentBlocks(blocks),
      /Unknown content block type: unknown_magic_block/
    );
  });

  test('normalizes legacy paragraph block', () => {
    const legacyBlocks = [
      {
        type: 'paragraph',
        data: { text: 'This is legacy text' }
      }
    ];
    
    const validated = validateContentBlocks(legacyBlocks);
    assert.deepEqual(validated, [
      {
        type: 'paragraph',
        nodes: [{ type: 'text', content: 'This is legacy text' }]
      }
    ]);
  });
});
