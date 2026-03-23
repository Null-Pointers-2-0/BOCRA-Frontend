import type { PublicationCategory, PublicationStatus } from "./common";

// ── Attachment ──
export type PublicationAttachment = {
  id: string;
  title: string;
  file: string;
  uploaded_by_name: string;
  created_at: string;
};

// ── Publication (public list) ──
export type PublicationListItem = {
  id: string;
  title: string;
  slug: string;
  summary: string;
  category: PublicationCategory;
  category_display: string;
  published_date: string | null;
  year: number | null;
  version: string;
  is_featured: boolean;
  download_count: number;
};

// ── Publication (public detail) ──
export type PublicationDetail = {
  id: string;
  title: string;
  slug: string;
  summary: string;
  category: PublicationCategory;
  category_display: string;
  file: string;
  published_date: string | null;
  year: number | null;
  version: string;
  is_featured: boolean;
  download_count: number;
  attachments: PublicationAttachment[];
  created_at: string;
};

// ── Staff variants ──
export type StaffPublicationListItem = {
  id: string;
  title: string;
  slug: string;
  category: PublicationCategory;
  category_display: string;
  status: PublicationStatus;
  status_display: string;
  published_date: string | null;
  year: number | null;
  is_featured: boolean;
  download_count: number;
  created_at: string;
};

export type StaffPublicationDetail = {
  id: string;
  title: string;
  slug: string;
  summary: string;
  category: PublicationCategory;
  category_display: string;
  status: PublicationStatus;
  status_display: string;
  file: string;
  published_date: string | null;
  year: number | null;
  version: string;
  is_featured: boolean;
  download_count: number;
  attachments: PublicationAttachment[];
  created_by_name: string;
  created_at: string;
  updated_at: string;
};

// ── Request types ──
export type PublicationCreateRequest = {
  title: string;
  summary: string;
  category: PublicationCategory;
  file?: File;
  published_date?: string;
  version?: string;
  is_featured?: boolean;
};

export type PublicationUpdateRequest = Partial<PublicationCreateRequest>;

export type StaffPublicationListParams = {
  status?: PublicationStatus;
  category?: PublicationCategory;
  year?: number;
  is_featured?: boolean;
  search?: string;
  ordering?: string;
  page?: number;
};

export type PublicPublicationListParams = {
  category?: PublicationCategory;
  year?: number;
  is_featured?: boolean;
  search?: string;
  ordering?: string;
  page?: number;
};
