'use client';

import { useState, useEffect } from 'react';
import { Plus, Trash2, ArrowUp, ArrowDown, Copy, Image as ImageIcon } from 'lucide-react';
import { parseInlineNodes, serializeInlineNodes } from '@/lib/content/inline-parser';
import MediaPicker from './MediaPicker';
import { ContentBlock, InlineNode, ListItem } from '@/lib/content/blocks';

interface ContentBlockEditorProps {
  initialBlocks?: ContentBlock[];
}

export default function ContentBlockEditor({ initialBlocks = [] }: ContentBlockEditorProps) {
  const [blocks, setBlocks] = useState<ContentBlock[]>(initialBlocks);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Update hidden input when blocks change
  useEffect(() => {
    const hiddenInput = document.getElementById('content-blocks-hidden-input') as HTMLInputElement;
    if (hiddenInput) {
      hiddenInput.value = JSON.stringify(blocks);
      // Dispatch a change event so the form knows it's dirty
      hiddenInput.dispatchEvent(new Event('change', { bubbles: true }));
    }
  }, [blocks]);

  const addBlock = (type: string) => {
    let newBlock: ContentBlock;
    switch (type) {
      case 'paragraph':
        newBlock = { type: 'paragraph', nodes: [] };
        break;
      case 'heading':
        newBlock = { type: 'heading', level: 2, text: '', id: '' };
        break;
      case 'image':
        newBlock = { type: 'image', src: '', alt: '' };
        break;
      case 'list':
        newBlock = { type: 'list', ordered: false, items: [{ nodes: [] }] };
        break;
      case 'quote':
        newBlock = { type: 'quote', nodes: [], attribution: '' };
        break;
      case 'callout':
        newBlock = { type: 'callout', variant: 'info', heading: '', nodes: [] };
        break;
      case 'divider':
        newBlock = { type: 'divider' };
        break;
      case 'stay_area':
        newBlock = { type: 'stay_area', id: '', name: '', summary: '', bestForTitle: 'Best for', bestFor: [], accommodationTypes: [], atmosphere: '', transportNotes: '', nearbyHighlights: [], considerations: [] };
        break;
      default:
        return;
    }
    setBlocks([...blocks, newBlock]);
  };

  const removeBlock = (index: number) => {
    const block = blocks[index];
    const isEmpty = block.type === 'divider' || 
      (block.type === 'paragraph' && (!block.nodes || block.nodes.length === 0)) ||
      (block.type === 'heading' && !block.text) ||
      (block.type === 'image' && !block.src);

    if (isEmpty || window.confirm('Are you sure you want to delete this block?')) {
      const newBlocks = [...blocks];
      newBlocks.splice(index, 1);
      setBlocks(newBlocks);
    }
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

  const duplicateBlock = (index: number) => {
    const newBlocks = [...blocks];
    const cloned = JSON.parse(JSON.stringify(newBlocks[index]));
    newBlocks.splice(index + 1, 0, cloned);
    setBlocks(newBlocks);
  };

  const updateBlock = (index: number, updates: Partial<ContentBlock>) => {
    const newBlocks = [...blocks];
    newBlocks[index] = { ...newBlocks[index], ...updates } as ContentBlock;
    setBlocks(newBlocks);
  };

  // Helper for inline nodes text area
  const InlineEditor = ({ nodes, onChange, label = "Text Content (Supports **bold** and [link](url))" }: { nodes: InlineNode[], onChange: (n: InlineNode[]) => void, label?: string }) => {
    const [text, setText] = useState(() => serializeInlineNodes(nodes));
    
    // Update internal state when external nodes change (e.g. duplicate or reorder)
    useEffect(() => {
      setText(serializeInlineNodes(nodes));
    }, [nodes]);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setText(e.target.value);
      onChange(parseInlineNodes(e.target.value));
    };

    return (
      <div className="space-y-1">
        <label className="block text-xs font-medium text-[#76675D]">{label}</label>
        <textarea
          value={text}
          onChange={handleChange}
          className="w-full border border-[#E9D9CA] rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8622C]"
          rows={3}
        />
      </div>
    );
  };

  if (!isClient) return <div className="h-32 bg-[#F0EDE8] animate-pulse rounded-lg" />;

  const supportedTypes = ['paragraph', 'heading', 'image', 'list', 'quote', 'callout', 'divider', 'stay_area'];

  return (
    <div className="space-y-4">
      <input type="hidden" id="content-blocks-hidden-input" name="body" value={JSON.stringify(blocks)} />
      
      <div className="space-y-4">
        {blocks.map((block, idx) => {
          const isUnsupported = !supportedTypes.includes(block.type);

          return (
            <div key={idx} className="bg-white border border-[#E9D9CA] rounded-lg p-4 shadow-sm relative group">
              <div className="absolute -left-3 top-4 bottom-4 w-1 bg-[#E8622C] rounded-r opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-white bg-[#8B5E3C] px-2 py-1 rounded">
                    {block.type}
                  </span>
                  {isUnsupported && (
                    <span className="text-xs font-medium text-red-600 bg-red-100 px-2 py-1 rounded">
                      Unsupported Block
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <button type="button" onClick={() => moveBlock(idx, 'up')} disabled={idx === 0} aria-label="Move Block Up" className="p-1 text-[#76675D] hover:bg-[#F0EDE8] rounded disabled:opacity-30">
                    <ArrowUp className="w-4 h-4" />
                  </button>
                  <button type="button" onClick={() => moveBlock(idx, 'down')} disabled={idx === blocks.length - 1} aria-label="Move Block Down" className="p-1 text-[#76675D] hover:bg-[#F0EDE8] rounded disabled:opacity-30">
                    <ArrowDown className="w-4 h-4" />
                  </button>
                  <div className="w-px h-4 bg-[#E9D9CA] mx-1" />
                  <button type="button" onClick={() => duplicateBlock(idx)} aria-label="Duplicate Block" className="p-1 text-[#76675D] hover:bg-[#F0EDE8] rounded" title="Duplicate">
                    <Copy className="w-4 h-4" />
                  </button>
                  <button type="button" onClick={() => removeBlock(idx)} aria-label="Delete Block" className="p-1 text-red-500 hover:bg-red-50 rounded ml-1" title="Delete">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {isUnsupported ? (
                 <div className="text-sm text-[#76675D] italic py-2">
                    This block type is not supported by the editor yet, but its data is preserved.
                 </div>
              ) : (
                <div className="mt-4">
                  {block.type === 'paragraph' && (
                    <InlineEditor nodes={block.nodes} onChange={(nodes) => updateBlock(idx, { nodes })} />
                  )}

                  {block.type === 'heading' && (
                    <div className="space-y-3">
                      <div className="flex gap-4">
                        <div className="w-24">
                          <label className="block text-xs font-medium text-[#76675D] mb-1">Level</label>
                          <select
                            value={block.level || 2}
                            onChange={(e) => updateBlock(idx, { level: parseInt(e.target.value) as 2 | 3 })}
                            className="w-full border border-[#E9D9CA] rounded-md px-2 py-1.5 text-sm"
                          >
                            <option value={2}>H2</option>
                            <option value={3}>H3</option>
                          </select>
                        </div>
                        <div className="flex-1">
                          <label className="block text-xs font-medium text-[#76675D] mb-1">ID (for TOC anchor)</label>
                          <input
                            type="text"
                            value={block.id || ''}
                            onChange={(e) => updateBlock(idx, { id: e.target.value })}
                            className="w-full border border-[#E9D9CA] rounded-md px-3 py-1.5 text-sm"
                            placeholder="e.g. best-time-to-visit"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-[#76675D] mb-1">Text</label>
                        <input
                          type="text"
                          value={block.text || ''}
                          onChange={(e) => updateBlock(idx, { text: e.target.value })}
                          className="w-full border border-[#E9D9CA] rounded-md px-3 py-1.5 text-sm font-medium"
                        />
                      </div>
                    </div>
                  )}

                  {block.type === 'image' && (
                    <div className="space-y-3">
                      <div className="border border-[#E9D9CA] p-4 rounded-md bg-[#FBF8F4]">
                        <label className="block text-xs font-medium text-[#76675D] mb-3">Select Media</label>
                        <MediaPicker 
                          label=""
                          value={block.src ? { src: block.src, alt: block.alt || '' } : null}
                          onChange={(media) => {
                            if (media) {
                              updateBlock(idx, { src: media.src, alt: media.alt || block.alt, caption: media.caption || block.caption, credit: media.credit || block.credit });
                            } else {
                              updateBlock(idx, { src: '' });
                            }
                          }}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-[#76675D] mb-1">Alt Text (Fallback)</label>
                        <input
                          type="text"
                          value={block.alt || ''}
                          onChange={(e) => updateBlock(idx, { alt: e.target.value })}
                          className="w-full border border-[#E9D9CA] rounded-md px-3 py-1.5 text-sm"
                        />
                      </div>
                      <div className="flex gap-4">
                        <div className="flex-1">
                          <label className="block text-xs font-medium text-[#76675D] mb-1">Caption</label>
                          <input
                            type="text"
                            value={block.caption || ''}
                            onChange={(e) => updateBlock(idx, { caption: e.target.value })}
                            className="w-full border border-[#E9D9CA] rounded-md px-3 py-1.5 text-sm"
                          />
                        </div>
                        <div className="flex-1">
                          <label className="block text-xs font-medium text-[#76675D] mb-1">Credit</label>
                          <input
                            type="text"
                            value={block.credit || ''}
                            onChange={(e) => updateBlock(idx, { credit: e.target.value })}
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
                            onChange={(e) => updateBlock(idx, { variant: e.target.value as 'tip' | 'info' | 'warning' })}
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
                            className="w-full border border-[#E9D9CA] rounded-md px-3 py-1.5 text-sm font-medium"
                          />
                        </div>
                      </div>
                      <InlineEditor nodes={block.nodes} onChange={(nodes) => updateBlock(idx, { nodes })} />
                    </div>
                  )}

                  {block.type === 'quote' && (
                    <div className="space-y-3">
                      <InlineEditor nodes={block.nodes} onChange={(nodes) => updateBlock(idx, { nodes })} label="Quote Text" />
                      <div>
                        <label className="block text-xs font-medium text-[#76675D] mb-1">Attribution (Optional)</label>
                        <input
                          type="text"
                          value={block.attribution || ''}
                          onChange={(e) => updateBlock(idx, { attribution: e.target.value })}
                          className="w-full border border-[#E9D9CA] rounded-md px-3 py-1.5 text-sm"
                          placeholder="e.g. John Doe, Travel Magazine"
                        />
                      </div>
                    </div>
                  )}

                  {block.type === 'list' && (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 mb-2">
                        <label className="text-xs font-medium text-[#76675D]">List Type:</label>
                        <select
                          value={block.ordered ? 'ordered' : 'unordered'}
                          onChange={(e) => updateBlock(idx, { ordered: e.target.value === 'ordered' })}
                          className="border border-[#E9D9CA] rounded-md px-2 py-1 text-sm"
                        >
                          <option value="unordered">Bullet Points</option>
                          <option value="ordered">Numbered</option>
                        </select>
                      </div>
                      
                      <div className="space-y-2 pl-2 border-l-2 border-[#E9D9CA]">
                        {(block.items || []).map((item: ListItem, itemIdx: number) => (
                          <div key={itemIdx} className="flex gap-2">
                            <div className="pt-2 text-[#76675D]">
                              {block.ordered ? `${itemIdx + 1}.` : '•'}
                            </div>
                            <div className="flex-1">
                              <InlineEditor 
                                nodes={item.nodes || []} 
                                onChange={(nodes) => {
                                  const newItems = [...(block.items || [])];
                                  newItems[itemIdx] = { ...newItems[itemIdx], nodes };
                                  updateBlock(idx, { items: newItems });
                                }}
                                label=""
                              />
                            </div>
                            
                            <button
                              type="button"
                              onClick={() => {
                                if (itemIdx === 0) return;
                                const newItems = [...(block.items || [])];
                                const temp = newItems[itemIdx];
                                newItems[itemIdx] = newItems[itemIdx - 1];
                                newItems[itemIdx - 1] = temp;
                                updateBlock(idx, { items: newItems });
                              }}
                              disabled={itemIdx === 0}
                              aria-label="Move List Item Up"
                              className="p-1.5 text-[#76675D] hover:text-[#0D6E7A] disabled:opacity-30 rounded h-fit mt-1"
                            >
                              <ArrowUp className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                if (itemIdx === (block.items || []).length - 1) return;
                                const newItems = [...(block.items || [])];
                                const temp = newItems[itemIdx];
                                newItems[itemIdx] = newItems[itemIdx + 1];
                                newItems[itemIdx + 1] = temp;
                                updateBlock(idx, { items: newItems });
                              }}
                              disabled={itemIdx === (block.items || []).length - 1}
                              aria-label="Move List Item Down"
                              className="p-1.5 text-[#76675D] hover:text-[#0D6E7A] disabled:opacity-30 rounded h-fit mt-1"
                            >
                              <ArrowDown className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                const newItems = [...(block.items || [])];
                                newItems.splice(itemIdx, 1);
                                updateBlock(idx, { items: newItems });
                              }}
                              aria-label="Delete List Item"
                              className="p-1.5 text-[#76675D] hover:text-red-500 rounded h-fit mt-1"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>

                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => {
                            const newItems = [...(block.items || []), { nodes: [] }];
                            updateBlock(idx, { items: newItems });
                          }}
                          className="text-xs font-medium text-[#0D6E7A] hover:underline flex items-center gap-1 pt-1"
                        >
                          <Plus className="w-3 h-3" /> Add Item
                        </button>
                      </div>
                    </div>
                  )}

                  {block.type === 'divider' && (
                    <div className="flex items-center justify-center py-4 text-[#E9D9CA]">
                      <div className="w-full h-px bg-[#E9D9CA]" />
                      <span className="px-4 text-xs tracking-widest text-[#76675D]">DIVIDER</span>
                      <div className="w-full h-px bg-[#E9D9CA]" />
                    </div>
                  )}

                  {block.type === 'stay_area' && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-medium text-[#76675D] mb-1">Name <span className="text-red-500">*</span></label>
                          <input
                            type="text"
                            value={block.name || ''}
                            onChange={(e) => updateBlock(idx, { name: e.target.value })}
                            className="w-full border border-[#E9D9CA] rounded-md px-3 py-1.5 text-sm"
                            placeholder="e.g. Seminyak"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-[#76675D] mb-1">Slug (ID) <span className="text-red-500">*</span></label>
                          <input
                            type="text"
                            value={block.id || ''}
                            onChange={(e) => updateBlock(idx, { id: e.target.value })}
                            className="w-full border border-[#E9D9CA] rounded-md px-3 py-1.5 text-sm"
                            placeholder="e.g. seminyak"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-[#76675D] mb-1">Summary (Short Description)</label>
                        <textarea
                          value={block.summary || ''}
                          onChange={(e) => updateBlock(idx, { summary: e.target.value })}
                          className="w-full border border-[#E9D9CA] rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8622C]"
                          rows={2}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-medium text-[#76675D] mb-1">Best For Title (default: Best for)</label>
                          <input
                            type="text"
                            value={block.bestForTitle || ''}
                            onChange={(e) => updateBlock(idx, { bestForTitle: e.target.value })}
                            className="w-full border border-[#E9D9CA] rounded-md px-3 py-1.5 text-sm"
                            placeholder="e.g. Best for"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-[#76675D] mb-1">Atmosphere</label>
                          <input
                            type="text"
                            value={block.atmosphere || ''}
                            onChange={(e) => updateBlock(idx, { atmosphere: e.target.value })}
                            className="w-full border border-[#E9D9CA] rounded-md px-3 py-1.5 text-sm"
                            placeholder="e.g. Busy, upscale, trendy"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-medium text-[#76675D] mb-1">Best For (comma-separated)</label>
                          <input
                            type="text"
                            value={(block.bestFor || []).join(', ')}
                            onChange={(e) => updateBlock(idx, { bestFor: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
                            className="w-full border border-[#E9D9CA] rounded-md px-3 py-1.5 text-sm"
                            placeholder="e.g. Beach clubs, surfing, shopping"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-[#76675D] mb-1">Accommodation Types (comma-separated)</label>
                          <input
                            type="text"
                            value={(block.accommodationTypes || []).join(', ')}
                            onChange={(e) => updateBlock(idx, { accommodationTypes: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
                            className="w-full border border-[#E9D9CA] rounded-md px-3 py-1.5 text-sm"
                            placeholder="e.g. Luxury resorts, private villas"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-[#76675D] mb-1">Transport & Access Notes</label>
                        <input
                          type="text"
                          value={block.transportNotes || ''}
                          onChange={(e) => updateBlock(idx, { transportNotes: e.target.value })}
                          className="w-full border border-[#E9D9CA] rounded-md px-3 py-1.5 text-sm"
                          placeholder="e.g. 30 mins from airport, heavy traffic"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-xs font-medium text-[#76675D] mb-1">Trade-offs & Considerations (comma-separated)</label>
                        <input
                          type="text"
                          value={(block.considerations || []).join(', ')}
                          onChange={(e) => updateBlock(idx, { considerations: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
                          className="w-full border border-[#E9D9CA] rounded-md px-3 py-1.5 text-sm"
                          placeholder="e.g. Traffic is notoriously bad, beaches not swimmable"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
        
        {blocks.length === 0 && (
          <div className="p-8 border-2 border-dashed border-[#E9D9CA] rounded-lg text-center bg-[#F0EDE8]/50">
            <p className="text-[#76675D] font-medium text-sm mb-1">No content blocks yet</p>
            <p className="text-xs text-[#76675D]/70">Add a block to start writing.</p>
          </div>
        )}
      </div>

      <div className="bg-white border border-[#E9D9CA] rounded-lg p-3 shadow-sm mt-4">
        <span className="block text-xs font-bold text-[#76675D] uppercase tracking-wider mb-2">Add Block</span>
        <div className="flex flex-wrap gap-2">
          {supportedTypes.map(type => (
            <button
              key={type}
              type="button"
              onClick={() => addBlock(type)}
              className="flex items-center gap-1.5 bg-[#F0EDE8] hover:bg-[#E9D9CA] text-[#2B221C] px-3 py-1.5 rounded-md text-xs font-medium transition-colors border border-transparent hover:border-[#8B5E3C]/20"
            >
              <Plus className="w-3 h-3 text-[#0D6E7A]" />
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
