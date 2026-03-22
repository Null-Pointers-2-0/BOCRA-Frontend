import type { NewsCategory, ArticleStatus } from "./common";

// ── Article (public list) ──
export type ArticleListItem = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  category: NewsCategory;
  category_display: string;
  author_name: string;
  featured_image: string | null;
  published_at: string | null;
  is_featured: boolean;
  view_count: number;
};

// ── Article (public detail) ──
export type ArticleDetail = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: NewsCategory;
  category_display: string;
  author_name: string;
  featured_image: string | null;
  published_at: string | null;
  is_featured: boolean;
  view_count: number;
  created_at: string;
};

// ── Staff variants ──
export type StaffArticleListItem = {
  id: string;
  title: string;
  slug: string;
  category: NewsCategory;
  category_display: string;
  status: ArticleStatus;
  status_display: string;
  author_name: string;
  published_at: string | null;
  is_featured: boolean;
  view_count: number;
  created_at: string;
};

export type StaffArticleDetail = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: NewsCategory;
  category_display: string;
  status: ArticleStatus;
  status_display: string;
  author_name: string;
  featured_image: string | null;
  published_at: string | null;
  is_featured: boolean;
  view_count: number;
  created_by_name: string;
  created_at: string;
  updated_at: string;
};

// ── Request types ──
export type ArticleCreateRequest = {
  title: string;
  excerpt: string;
  content: string;
  category: NewsCategory;
  featured_image?: File;
  is_featured?: boolean;
};

export type ArticleUpdateRequest = Partial<ArticleCreateRequest>;

export type StaffArticleListParams = {
  status?: ArticleStatus;
  category?: NewsCategory;
  is_featured?: boolean;
  search?: string;
  ordering?: string;
  page?: number;
};

export type PublicArticleListParams = {
  category?: NewsCategory;
  is_featured?: boolean;
  search?: string;
  ordering?: string;
  page?: number;
};
