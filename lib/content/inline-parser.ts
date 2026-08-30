import { InlineNode } from './blocks';

/**
 * Very lightweight parser to convert simple Markdown-like text to InlineNode[]
 * Supports:
 * - **bold**
 * - [text](href)
 * 
 * Example: "Hello **world** check [this](https://example.com) out."
 */
export function parseInlineNodes(text: string): InlineNode[] {
  if (!text) return [];
  
  const nodes: InlineNode[] = [];
  // Regex to match **bold** or [text](href)
  // Group 1: strong text (**)
  // Group 2: link text ([])
  // Group 3: link href (())
  const regex = /(\*\*([^\*]+)\*\*)|(\[([^\]]+)\]\(([^)]+)\))/g;
  
  let lastIndex = 0;
  let match;
  
  while ((match = regex.exec(text)) !== null) {
    // Add text before match
    if (match.index > lastIndex) {
      nodes.push({ type: 'text', content: text.substring(lastIndex, match.index) });
    }
    
    if (match[1]) {
      // It's strong
      nodes.push({ type: 'strong', content: match[2] });
    } else if (match[3]) {
      // It's a link
      const href = match[5];
      const isExternal = href.startsWith('http');
      nodes.push({ type: 'link', content: match[4], href, external: isExternal });
    }
    
    lastIndex = regex.lastIndex;
  }
  
  // Add remaining text
  if (lastIndex < text.length) {
    nodes.push({ type: 'text', content: text.substring(lastIndex) });
  }
  
  return nodes;
}

/**
 * Serializes InlineNode[] back to simple Markdown string
 */
export function serializeInlineNodes(nodes: InlineNode[]): string {
  if (!nodes || !Array.isArray(nodes)) return '';
  
  return nodes.map(node => {
    switch (node.type) {
      case 'text':
        return node.content;
      case 'strong':
        return `**${node.content}**`;
      case 'link':
        return `[${node.content}](${node.href})`;
      default:
        return '';
    }
  }).join('');
}
