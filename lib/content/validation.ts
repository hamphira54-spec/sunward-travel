export function validateUrl(url: string | undefined | null): string {
  if (!url) return '';
  const trimmed = url.trim();
  if (trimmed === '') return '';

  // Allow relative paths (e.g. /guides/bangkok)
  if (trimmed.startsWith('/') && !trimmed.startsWith('//')) {
    return trimmed;
  }

  // Check for allowed protocols
  const lowerUrl = trimmed.toLowerCase();
  if (lowerUrl.startsWith('http://') || lowerUrl.startsWith('https://')) {
    try {
      new URL(trimmed); // ensure it's parseable
      return trimmed;
    } catch {
      throw new Error(`Malformed URL: ${trimmed}`);
    }
  }

  throw new Error(`Invalid URL protocol or format. Only http, https, and absolute relative paths are allowed: ${trimmed}`);
}

export function validateInlineNodes(nodes: any[]): any[] {
  if (!Array.isArray(nodes)) throw new Error("Inline nodes must be an array");
  
  return nodes.map((node, i) => {
    if (!node || typeof node !== 'object') throw new Error(`Invalid inline node at index ${i}`);
    
    switch (node.type) {
      case 'text':
      case 'strong':
        if (typeof node.content !== 'string') throw new Error(`Inline ${node.type} must have string content`);
        return { type: node.type, content: node.content };
      
      case 'link':
        if (typeof node.content !== 'string') throw new Error("Inline link must have string content");
        const safeHref = validateUrl(node.href);
        return { type: 'link', content: node.content, href: safeHref, external: !!node.external };
      
      default:
        throw new Error(`Unknown inline node type: ${node.type}`);
    }
  });
}

export function validateContentBlocks(blocks: any): any[] {
  if (!Array.isArray(blocks)) throw new Error("ContentBlocks must be an array");

  return blocks.map((block, i) => {
    if (!block || typeof block !== 'object' || !block.type) {
      throw new Error(`Invalid block at index ${i}`);
    }

    switch (block.type) {
      case 'paragraph':
        return { type: 'paragraph', nodes: validateInlineNodes(block.nodes) };
      
      case 'heading':
        return { 
          type: 'heading', 
          level: (block.level === 2 || block.level === 3) ? block.level : 2, 
          id: typeof block.id === 'string' ? block.id : '', 
          text: typeof block.text === 'string' ? block.text : '' 
        };
      
      case 'image':
        return { 
          type: 'image', 
          src: validateUrl(block.src), 
          alt: typeof block.alt === 'string' ? block.alt : '', 
          caption: typeof block.caption === 'string' ? block.caption : undefined, 
          credit: typeof block.credit === 'string' ? block.credit : undefined, 
          width: typeof block.width === 'number' ? block.width : undefined, 
          height: typeof block.height === 'number' ? block.height : undefined 
        };
      
      case 'list':
        return { 
          type: 'list', 
          ordered: !!block.ordered, 
          items: Array.isArray(block.items) ? block.items.map((item: any, j: number) => {
            if (!item || typeof item !== 'object') throw new Error(`Invalid list item at block ${i} index ${j}`);
            return { nodes: validateInlineNodes(item.nodes) };
          }) : [] 
        };
      
      case 'quote':
        return { 
          type: 'quote', 
          nodes: validateInlineNodes(block.nodes),
          attribution: typeof block.attribution === 'string' ? block.attribution : undefined
        };
        
      case 'callout':
        return { 
          type: 'callout', 
          variant: ['tip', 'info', 'warning'].includes(block.variant) ? block.variant : 'info', 
          heading: typeof block.heading === 'string' ? block.heading : undefined, 
          nodes: validateInlineNodes(block.nodes) 
        };
      
      case 'stay_area': return block; case 'divider':
        return { type: 'divider' };
      
      default:
        // Instead of silently destroying, reject the save.
        throw new Error(`Unsupported or unknown block type: ${block.type}`);
    }
  });
}
