'use client';

import { useState } from 'react';
import { Plus, Trash2, ArrowUp, ArrowDown } from 'lucide-react';

interface ContentBlockEditorProps {
  initialBlocks?: any[];
}

export default function ContentBlockEditor({ initialBlocks = [] }: ContentBlockEditorProps) {
  const [blocks, setBlocks] = useState<any[]>(initialBlocks);

  const addBlock = (type: string) => {
    let newBlock: any = { type };
    switch (type) {
      case 'paragraph':
        newBlock.nodes = [{ type: 'text', content: '' }];
        break;
      case 'heading':
        newBlock.level = 2;
        newBlock.text = '';
        newBlock.id = '';
        break;
      case 'image':
        newBlock.src = '';
        newBlock.alt = '';
        break;
      case 'list':
        newBlock.ordered = false;
        newBlock.items = [{ nodes: [{ type: 'text', content: '' }] }];
        break;
      case 'quote':
        newBlock.nodes = [{ type: 'text', content: '' }];
        newBlock.attribution = '';
        break;
      case 'callout':
        newBlock.variant = 'info';
        newBlock.heading = '';
        newBlock.nodes = [{ type: 'text', content: '' }];
        break;
      case 'divider':
        break;
    }
    setBlocks([...blocks, newBlock]);
  };

  const removeBlock = (index: number) => {
    const newBlocks = [...blocks];
    newBlocks.splice(index, 1);
    setBlocks(newBlocks);
  };

  const moveBlock = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === blocks.length - 1) return;
    
    const newBlocks = [...blocks];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const temp = newBlocks[index];
    newBlocks[index] = newBlocks[targetIndex];
    newBlocks[targetIndex] = temp;
    setBlocks(newBlocks);
  };

  const updateBlock = (index: number, newData: any) => {
    const newBlocks = [...blocks];
    newBlocks[index] = { ...newBlocks[index], ...newData };
    setBlocks(newBlocks);
  };

  // Helper to edit raw nodes JSON safely
  const handleNodesChange = (index: number, jsonString: string) => {
    try {
      const parsed = JSON.parse(jsonString);
      updateBlock(index, { nodes: parsed });
    } catch (e) {
      // invalid JSON, ignore until valid
    }
  };

  return (
    <div className="space-y-4">
      <input type="hidden" name="body" value={JSON.stringify(blocks)} />
      
      <div className="space-y-4">
        {blocks.map((block, idx) => (
          <div key={idx} className="border border-[#E9D9CA] rounded-md p-4 bg-white relative group">
            <div className="absolute right-2 top-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button type="button" onClick={() => moveBlock(idx, 'up')} disabled={idx === 0} className="p-1 text-[#76675D] hover:text-[#2B221C] disabled:opacity-30">
                <ArrowUp className="w-4 h-4" />
              </button>
              <button type="button" onClick={() => moveBlock(idx, 'down')} disabled={idx === blocks.length - 1} className="p-1 text-[#76675D] hover:text-[#2B221C] disabled:opacity-30">
                <ArrowDown className="w-4 h-4" />
              </button>
              <button type="button" onClick={() => removeBlock(idx)} className="p-1 text-red-500 hover:text-red-700 ml-2">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#8B5E3C] bg-[#F0EDE8] px-2 py-1 rounded">
                {block.type}
              </span>
            </div>

            {block.type === 'paragraph' && (
              <div className="space-y-2">
                <label className="text-xs font-medium text-[#76675D]">Inline Nodes (JSON)</label>
                <textarea
                  defaultValue={JSON.stringify(block.nodes, null, 2)}
                  onChange={(e) => handleNodesChange(idx, e.target.value)}
                  className="w-full font-mono text-xs border border-[#E9D9CA] rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#E8622C]"
                  rows={4}
                />
              </div>
            )}

            {block.type === 'heading' && (
              <div className="space-y-3">
                <div className="flex gap-4">
                  <div className="w-24">
                    <label className="block text-xs font-medium text-[#76675D] mb-1">Level</label>
                    <select
                      value={block.level || 2}
                      onChange={(e) => updateBlock(idx, { level: parseInt(e.target.value) })}
                      className="w-full border border-[#E9D9CA] rounded-md px-2 py-1.5 text-sm"
                    >
                      <option value={2}>H2</option>
                      <option value={3}>H3</option>
                    </select>
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs font-medium text-[#76675D] mb-1">ID (for TOC)</label>
                    <input
                      type="text"
                      value={block.id || ''}
                      onChange={(e) => updateBlock(idx, { id: e.target.value })}
                      className="w-full border border-[#E9D9CA] rounded-md px-3 py-1.5 text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#76675D] mb-1">Text</label>
                  <input
                    type="text"
                    value={block.text || ''}
                    onChange={(e) => updateBlock(idx, { text: e.target.value })}
                    className="w-full border border-[#E9D9CA] rounded-md px-3 py-1.5 text-sm"
                  />
                </div>
              </div>
            )}

            {block.type === 'image' && (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-[#76675D] mb-1">Source URL</label>
                  <input
                    type="text"
                    value={block.src || ''}
                    onChange={(e) => updateBlock(idx, { src: e.target.value })}
                    className="w-full border border-[#E9D9CA] rounded-md px-3 py-1.5 text-sm"
                  />
                </div>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-xs font-medium text-[#76675D] mb-1">Alt Text</label>
                    <input
                      type="text"
                      value={block.alt || ''}
                      onChange={(e) => updateBlock(idx, { alt: e.target.value })}
                      className="w-full border border-[#E9D9CA] rounded-md px-3 py-1.5 text-sm"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs font-medium text-[#76675D] mb-1">Caption</label>
                    <input
                      type="text"
                      value={block.caption || ''}
                      onChange={(e) => updateBlock(idx, { caption: e.target.value })}
                      className="w-full border border-[#E9D9CA] rounded-md px-3 py-1.5 text-sm"
                    />
                  </div>
                </div>
              </div>
            )}

            {block.type === 'callout' && (
              <div className="space-y-3">
                <div className="flex gap-4">
                  <div className="w-32">
                    <label className="block text-xs font-medium text-[#76675D] mb-1">Variant</label>
                    <select
                      value={block.variant || 'info'}
                      onChange={(e) => updateBlock(idx, { variant: e.target.value })}
                      className="w-full border border-[#E9D9CA] rounded-md px-2 py-1.5 text-sm"
                    >
                      <option value="info">Info</option>
                      <option value="tip">Tip</option>
                      <option value="warning">Warning</option>
                    </select>
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs font-medium text-[#76675D] mb-1">Heading</label>
                    <input
                      type="text"
                      value={block.heading || ''}
                      onChange={(e) => updateBlock(idx, { heading: e.target.value })}
                      className="w-full border border-[#E9D9CA] rounded-md px-3 py-1.5 text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#76675D] mb-1">Inline Nodes (JSON)</label>
                  <textarea
                    defaultValue={JSON.stringify(block.nodes, null, 2)}
                    onChange={(e) => handleNodesChange(idx, e.target.value)}
                    className="w-full font-mono text-xs border border-[#E9D9CA] rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#E8622C]"
                    rows={4}
                  />
                </div>
              </div>
            )}

            {(block.type === 'list' || block.type === 'quote') && (
              <div className="space-y-2">
                <label className="text-xs font-medium text-[#76675D] mb-1">Raw Block Data (JSON)</label>
                <textarea
                  defaultValue={JSON.stringify(block, null, 2)}
                  onChange={(e) => {
                    try {
                      const parsed = JSON.parse(e.target.value);
                      updateBlock(idx, parsed);
                    } catch (err) {}
                  }}
                  className="w-full font-mono text-xs border border-[#E9D9CA] rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#E8622C]"
                  rows={8}
                />
              </div>
            )}
            
            {block.type === 'divider' && (
              <div className="text-sm text-[#76675D] italic">Horizontal divider line</div>
            )}
          </div>
        ))}
        {blocks.length === 0 && (
          <div className="p-8 border-2 border-dashed border-[#E9D9CA] rounded-lg text-center text-[#76675D] text-sm">
            No content blocks yet. Add one below.
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-2 pt-2 border-t border-[#E9D9CA]">
        {['paragraph', 'heading', 'image', 'list', 'quote', 'callout', 'divider'].map(type => (
          <button
            key={type}
            type="button"
            onClick={() => addBlock(type)}
            className="flex items-center gap-1 bg-[#F0EDE8] hover:bg-[#E9D9CA] text-[#2B221C] px-3 py-1.5 rounded text-xs font-medium transition-colors"
          >
            <Plus className="w-3 h-3" />
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>
    </div>
  );
}
