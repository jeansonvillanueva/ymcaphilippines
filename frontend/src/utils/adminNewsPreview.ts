import type { ContentBlock } from '../components/ContentBuilder';

export const ADMIN_NEWS_PREVIEW_STORAGE_KEY = 'ymca_admin_news_preview_draft';

export type AdminNewsPreviewDraft = {
  title: string;
  date?: string;
  subtitle?: string;
  imageUrl?: string;
  category: string;
  topic: string;
  localYMCA?: string;
  contentBlocks: ContentBlock[];
};

export function saveAdminNewsPreviewDraft(draft: AdminNewsPreviewDraft): void {
  localStorage.setItem(ADMIN_NEWS_PREVIEW_STORAGE_KEY, JSON.stringify(draft));
}

export function loadAdminNewsPreviewDraft(): AdminNewsPreviewDraft | null {
  try {
    const raw = localStorage.getItem(ADMIN_NEWS_PREVIEW_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as AdminNewsPreviewDraft;
    if (!parsed || typeof parsed.title !== 'string') return null;
    return {
      ...parsed,
      contentBlocks: Array.isArray(parsed.contentBlocks) ? parsed.contentBlocks : [],
    };
  } catch {
    return null;
  }
}

export const ADMIN_NEWS_PREVIEW_PATH = '/secure-management/v3/k7n4m9p2q8c1x5j3/portal/news/preview';
