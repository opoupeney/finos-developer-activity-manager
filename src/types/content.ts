
export type ContentType = 'document' | 'presentation' | 'video';
export type ContentProvider = 'gdoc' | 'gslide' | 'linkedin' | 'youtube';
export type ContentStatus = 'logged' | 'in progress' | 'draft' | 'published' | 'archived';

export interface Content {
  id: string;
  title: string;
  description: string | null;
  author: string | null;
  url: string | null;
  type: ContentType;
  provider: ContentProvider;
  status: ContentStatus;
  created_at: string;
  updated_at: string;
  publication_date: string | null;
}
