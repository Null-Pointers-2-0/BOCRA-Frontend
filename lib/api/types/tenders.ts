import type { TenderCategory, TenderStatus } from "./common";

// ── Tender Document ──
export type TenderDocument = {
  id: string;
  title: string;
  file: string;
  uploaded_by_name: string;
  created_at: string;
};

// ── Tender Addendum ──
export type TenderAddendum = {
  id: string;
  title: string;
  content: string;
  author_name: string;
  created_at: string;
};

// ── Tender Award ──
export type TenderAward = {
  id: string;
  awardee_name: string;
  award_date: string;
  award_amount: string | null;
  summary: string;
  created_at: string;
};

// ── Tender (public list) ──
export type TenderListItem = {
  id: string;
  title: string;
  slug: string;
  reference_number: string;
  category: TenderCategory;
  category_display: string;
  status: TenderStatus;
  status_display: string;
  opening_date: string | null;
  closing_date: string | null;
  days_until_closing: number | null;
  budget_range: string;
};

// ── Tender (public detail) ──
export type TenderDetail = {
  id: string;
  title: string;
  slug: string;
  reference_number: string;
  description: string;
  category: TenderCategory;
  category_display: string;
  status: TenderStatus;
  status_display: string;
  opening_date: string | null;
  closing_date: string | null;
  days_until_closing: number | null;
  budget_range: string;
  contact_name: string;
  contact_email: string;
  contact_phone: string;
  documents: TenderDocument[];
  addenda: TenderAddendum[];
  award: TenderAward | null;
  created_at: string;
};

// ── Staff variants ──
export type StaffTenderListItem = {
  id: string;
  title: string;
  slug: string;
  reference_number: string;
  category: TenderCategory;
  category_display: string;
  status: TenderStatus;
  status_display: string;
  opening_date: string | null;
  closing_date: string | null;
  days_until_closing: number | null;
  budget_range: string;
  created_at: string;
};

export type StaffTenderDetail = {
  id: string;
  title: string;
  slug: string;
  reference_number: string;
  description: string;
  category: TenderCategory;
  category_display: string;
  status: TenderStatus;
  status_display: string;
  opening_date: string | null;
  closing_date: string | null;
  days_until_closing: number | null;
  budget_range: string;
  contact_name: string;
  contact_email: string;
  contact_phone: string;
  documents: TenderDocument[];
  addenda: TenderAddendum[];
  award: TenderAward | null;
  created_by_name: string;
  created_at: string;
  updated_at: string;
};

// ── Request types ──
export type TenderCreateRequest = {
  title: string;
  reference_number: string;
  description: string;
  category: TenderCategory;
  opening_date?: string;
  closing_date?: string;
  budget_range?: string;
  contact_name?: string;
  contact_email?: string;
  contact_phone?: string;
};

export type TenderUpdateRequest = Partial<TenderCreateRequest>;

export type TenderAwardCreateRequest = {
  awardee_name: string;
  award_date: string;
  award_amount?: string;
  summary?: string;
};

export type TenderAddendumCreateRequest = {
  title: string;
  content: string;
};

export type TenderDocumentUploadRequest = {
  title: string;
  file: File;
};

export type StaffTenderListParams = {
  status?: TenderStatus;
  category?: TenderCategory;
  search?: string;
  ordering?: string;
  page?: number;
};

export type PublicTenderListParams = {
  category?: TenderCategory;
  status?: TenderStatus;
  search?: string;
  ordering?: string;
  page?: number;
};

// ── Tender Application ──
export type TenderApplicationListItem = {
  id: string;
  reference_number: string;
  tender: string;
  tender_title: string;
  tender_reference: string;
  company_name: string;
  status: string;
  status_display: string;
  created_at: string;
};

export type TenderApplicationCreateRequest = {
  tender: string;
  company_name: string;
  company_registration?: string;
  contact_person: string;
  contact_email: string;
  contact_phone?: string;
  proposal_summary: string;
};
