// ─────────────────────────────────────────────────────────────────────────────
// lib/content/blocks.ts
// SUNWARD TRAVEL — Structured Content Block Model
//
// Replaces JSX-in-data-file editorial content with serializable block data.
//
// Design principles:
//   - Serializable: every block is a plain JSON-compatible object
//   - Safe: no raw HTML strings, no dangerouslySetInnerHTML storage
//   - Server-renderable: ContentRenderer converts these to semantic HTML
//   - Database-ready: blocks map to JSONB columns in PostgreSQL / Supabase
//   - CMS-ready: each block type maps to a future CMS block type
//   - Mobile-ready: React Native / native apps can consume block data directly
//
// To add a new block type:
//   1. Define the interface below
//   2. Add it to the ContentBlock union
//   3. Add a case to ContentRenderer
// ─────────────────────────────────────────────────────────────────────────────

// ─── Inline nodes ─────────────────────────────────────────────────────────────
// Inline nodes represent formatted text within a block.
// Paragraphs and list items contain arrays of inline nodes.

/** Plain unformatted text */
export interface InlineText {
  type: 'text';
  content: string;
}

/** Bold/strong text */
export interface InlineStrong {
  type: 'strong';
  content: string;
}

/** Inline hyperlink */
export interface InlineLink {
  type: 'link';
  content: string;
  href: string;
  /** Set true for external links — adds target=_blank + rel=noopener */
  external?: boolean;
}

/** Union of all supported inline content types */
export type InlineNode = InlineText | InlineStrong | InlineLink;

// ─── Block types ──────────────────────────────────────────────────────────────

/**
 * A paragraph of body text.
 * May contain mixed inline nodes (text, strong, links).
 */
export interface ParagraphBlock {
  type: 'paragraph';
  nodes: InlineNode[];
}

/**
 * A section heading.
 * id is used for anchor links and Table of Contents navigation.
 * Must match the corresponding tocSections entry id in TravelGuide.
 */
export interface HeadingBlock {
  type: 'heading';
  /** H2 for major sections, H3 for sub-sections */
  level: 2 | 3;
  /** Stable anchor id — used by TOC links. e.g. 'dry-season' */
  id?: string;
  text: string;
}

/** An inline image within the article body */
export interface ImageBlock {
  type: 'image';
  src: string;
  alt: string;
  caption?: string;
  credit?: string;
  width?: number;
  height?: number;
}

/** A single list item containing inline nodes and optional nested items */
export interface ListItem {
  nodes: InlineNode[];
  /** Future: nested list support */
  children?: ListItem[];
}

/** Ordered or unordered list */
export interface ListBlock {
  type: 'list';
  ordered: boolean;
  items: ListItem[];
}

/** Pull quote or blockquote */
export interface QuoteBlock {
  type: 'quote';
  nodes: InlineNode[];
  /** Optional attribution: author, source, etc. */
  attribution?: string;
}

/** Highlighted callout/info box */
export interface CalloutBlock {
  type: 'callout';
  variant: 'tip' | 'info' | 'warning';
  heading?: string;
  nodes: InlineNode[];
}

/** Horizontal rule / visual divider */
export interface DividerBlock {
  type: 'divider';
}

/**
 * Structured data for a specific accommodation area / neighborhood.
 */
export interface StayAreaBlock {
  type: 'stay_area';
  id: string; // url-friendly slug
  name: string;
  summary: string;
  bestForTitle?: string;
  bestFor: string[];
  atmosphere?: string;
  transportNotes?: string;
  nearbyHighlights?: string[];
  considerations?: string[];
  accommodationTypes: string[];
}

/**
 * Union of all supported content block types.
 * Used as the type for TravelGuide.body, TravelNews.body, TravelEvent.body.
 */
export type ContentBlock =
  | ParagraphBlock
  | HeadingBlock
  | ImageBlock
  | ListBlock
  | QuoteBlock
  | CalloutBlock
  | DividerBlock
  | StayAreaBlock;
