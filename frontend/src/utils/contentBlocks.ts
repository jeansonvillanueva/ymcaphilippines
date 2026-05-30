import type { ContentBlock } from '../components/ContentBuilder';

export function parseContentBlocks(
  contentBlocks?: ContentBlock[] | string | null,
): ContentBlock[] {
  if (!contentBlocks) return [];
  if (Array.isArray(contentBlocks)) return contentBlocks;

  try {
    const parsed = JSON.parse(contentBlocks);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function hasContentBlocks(contentBlocks?: ContentBlock[] | string | null): boolean {
  return parseContentBlocks(contentBlocks).length > 0;
}

export function hasSlideshowBlocks(contentBlocks?: ContentBlock[] | string | null): boolean {
  return parseContentBlocks(contentBlocks).some(
    (block) => block.type === 'slideshow' && (block.slideshow_images?.length ?? 0) > 0,
  );
}
