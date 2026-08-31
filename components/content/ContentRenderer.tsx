// ─────────────────────────────────────────────────────────────────────────────
// components/content/ContentRenderer.tsx
// SUNWARD TRAVEL — Structured Content Block Renderer
//
// Renders a ContentBlock[] array to semantic, accessible HTML.
//
// Design:
//   - Server Component (no 'use client') — SSR by default
//   - No dangerouslySetInnerHTML — all output is safe typed React elements
//   - Renders inside .prose-styles wrapper in guide/article pages
//   - Heading IDs match tocSections[] entries for TOC anchor navigation
//   - Uses Next.js Image for ImageBlock (future)
//
// To add a new block type:
//   1. Define it in lib/content/blocks.ts
//   2. Add a case to renderBlock() here
// ─────────────────────────────────────────────────────────────────────────────

import type {
  ContentBlock,
  InlineNode,
  ListItem,
} from '@/lib/content/blocks';

// ─── Inline node renderer ─────────────────────────────────────────────────────

function renderInlineNodes(nodes: InlineNode[]): React.ReactNode[] {
  return nodes.map((node, i) => {
    switch (node.type) {
      case 'text':
        return node.content;
      case 'strong':
        return <strong key={i}>{node.content}</strong>;
      case 'link':
        return (
          <a
            key={i}
            href={node.href}
            {...(node.external
              ? { target: '_blank', rel: 'noopener noreferrer' }
              : {})}
          >
            {node.content}
          </a>
        );
      default:
        return null;
    }
  });
}

// ─── List item renderer ───────────────────────────────────────────────────────

function renderListItem(item: ListItem, i: number): React.ReactNode {
  return (
    <li key={i}>
      {renderInlineNodes(item.nodes)}
      {item.children && item.children.length > 0 && (
        <ul>
          {item.children.map((child, ci) => renderListItem(child, ci))}
        </ul>
      )}
    </li>
  );
}

// ─── Block renderer ───────────────────────────────────────────────────────────

function renderBlock(block: ContentBlock, i: number): React.ReactNode {
  switch (block.type) {
    case 'paragraph':
      return <p key={i}>{renderInlineNodes(block.nodes)}</p>;

    case 'heading': {
      const id = block.id;
      if (block.level === 2) {
        return (
          <h2
            key={i}
            id={id}
            {...(id ? { 'data-section-id': id } : {})}
          >
            {block.text}
          </h2>
        );
      }
      return (
        <h3
          key={i}
          id={id}
          {...(id ? { 'data-section-id': id } : {})}
        >
          {block.text}
        </h3>
      );
    }

    case 'list':
      if (block.ordered) {
        return (
          <ol key={i}>
            {block.items.map((item, ii) => renderListItem(item, ii))}
          </ol>
        );
      }
      return (
        <ul key={i}>
          {block.items.map((item, ii) => renderListItem(item, ii))}
        </ul>
      );

    case 'quote':
      return (
        <blockquote key={i}>
          <p>{renderInlineNodes(block.nodes)}</p>
          {block.attribution && (
            <footer>
              <cite>{block.attribution}</cite>
            </footer>
          )}
        </blockquote>
      );

    case 'callout':
      return (
        <aside
          key={i}
          data-callout={block.variant}
          role="note"
          aria-label={block.heading ?? block.variant}
        >
          {block.heading && <p><strong>{block.heading}</strong></p>}
          <p>{renderInlineNodes(block.nodes)}</p>
        </aside>
      );

    case 'image':
      return (
        <figure key={i}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={block.src}
            alt={block.alt}
            width={block.width}
            height={block.height}
            loading="lazy"
            decoding="async"
          />
          {(block.caption || block.credit) && (
            <figcaption>
              {block.caption}
              {block.credit && (
                <span className="block text-xs text-mist/70 mt-0.5">
                  {block.credit}
                </span>
              )}
            </figcaption>
          )}
        </figure>
      );

    case 'divider':
      return <hr key={i} />;

    case 'stay_area':
      return (
        <div key={i} className="not-prose my-12 p-8 rounded-2xl bg-white shadow-sm border border-gray-100">
          <h2 id={block.id} className="font-display text-2xl font-700 text-ink mb-2">
            {block.name}{block.bestForTitle && block.bestFor.length > 0 ? `: ${block.bestForTitle} ${block.bestFor[0]}` : ''}
          </h2>
          <p className="text-mist mb-6">{block.summary}</p>
          
          <div className="grid sm:grid-cols-2 gap-4 text-sm">
            {block.bestFor.length > 0 && (
              <div>
                <strong className="block text-ink mb-1">Best for:</strong>
                <ul className="text-mist space-y-1 list-disc list-inside">
                  {block.bestFor.map((item, idx) => <li key={idx}>{item}</li>)}
                </ul>
              </div>
            )}
            
            {block.accommodationTypes.length > 0 && (
              <div>
                <strong className="block text-ink mb-1">Accommodation style:</strong>
                <ul className="text-mist space-y-1 list-disc list-inside">
                  {block.accommodationTypes.map((item, idx) => <li key={idx}>{item}</li>)}
                </ul>
              </div>
            )}

            {block.atmosphere && (
              <div>
                <strong className="block text-ink mb-1">Atmosphere:</strong>
                <p className="text-mist">{block.atmosphere}</p>
              </div>
            )}

            {block.transportNotes && (
              <div>
                <strong className="block text-ink mb-1">Transport & Access:</strong>
                <p className="text-mist">{block.transportNotes}</p>
              </div>
            )}
          </div>
          
          {block.considerations && block.considerations.length > 0 && (
            <div className="mt-6 pt-6 border-t border-gray-100">
              <strong className="block text-ink mb-2 text-sm">Trade-offs & Considerations:</strong>
              <ul className="text-mist text-sm space-y-1 list-disc list-inside">
                {block.considerations.map((item, idx) => <li key={idx}>{item}</li>)}
              </ul>
            </div>
          )}
        </div>
      );

    default:
      return null;
  }
}

// ─── Main component ───────────────────────────────────────────────────────────

interface ContentRendererProps {
  blocks: ContentBlock[];
}

/**
 * Renders a ContentBlock[] to semantic HTML.
 *
 * Usage:
 *   <div className="prose-styles">
 *     <ContentRenderer blocks={guide.body} />
 *   </div>
 *
 * This is a Server Component — no client-side JS required.
 */
export default function ContentRenderer({ blocks }: ContentRendererProps) {
  if (!blocks || blocks.length === 0) return null;
  return <>{blocks.map((block, i) => renderBlock(block, i))}</>;
}
