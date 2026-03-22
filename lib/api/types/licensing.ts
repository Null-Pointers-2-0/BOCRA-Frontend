import type { ApplicationStatus, LicenceStatus } from "./common";

// ── Licence Type ──
export type LicenceType = {
  id: string;
  name: string;
  code: string;
  description: string;
  fee_amount: string;
  fee_currency: string;
  validity_period_months: number;
  is_active: boolean;
};

export type LicenceTypeDetail = LicenceType & {
  requirements: string;
  created_at: string;
  updated_at: string;
};

// ── Application Document ──
export type ApplicationDocument = {
  id: string;
  name: string;
  file: string;
  file_type: string;
  file_size: number;
  uploaded_by_name: string;
  created_at: string;
};

// ── Application Status Log ──
export type ApplicationStatusLog = {
  id: string;
  from_status: ApplicationStatus;
  from_status_display: string;
  to_status: ApplicationStatus;
  to_status_display: string;
  changed_by_name: string;
  reason: string;
  changed_at: string;
};

// ── Application (list item) ──
export type ApplicationListItem = {
  id: string;
  reference_number: string;
  licence_type_name: string;
  licence_type_code: string;
  organisation_name: string;
  status: ApplicationStatus;
  status_display: string;
  submitted_at: string | null;
  decision_date: string | null;
  has_licence: boolean;
  created_at: string;
  updated_at: string;
};

// ── Application (full detail) ──
export type ApplicationDetail = {
  id: string;
  reference_number: string;
  licence_type: LicenceType;
  organisation_name: string;
  organisation_registration: string;
  contact_person: string;
  contact_email: string;
  contact_phone: string;
  description: string;
  status: ApplicationStatus;
  status_display: string;
  submitted_at: string | null;
  decision_date: string | null;
  decision_reason: string;
  info_request_message: string;
  can_cancel: boolean;
  has_licence: boolean;
  licence_id: string | null;
  documents: ApplicationDocument[];
  status_timeline: ApplicationStatusLog[];
  created_at: string;
  updated_at: string;
};

// ── Staff Application (extends base with staff-only fields) ──
export type StaffApplicationListItem = ApplicationListItem & {
  applicant_name: string;
  applicant_email: string;
};

export type StaffApplicationDetail = ApplicationDetail & {
  notes: string;
  reviewed_by_name: string | null;
};

// ── Licence (list item) ──
export type LicenceListItem = {
  id: string;
  licence_number: string;
  licence_type_name: string;
  licence_type_code: string;
  organisation_name: string;
  issued_date: string;
  expiry_date: string;
  status: LicenceStatus;
  status_display: string;
  is_expired: boolean;
  days_until_expiry: number | null;
};

// ── Licence (full detail) ──
export type LicenceDetail = {
  id: string;
  licence_number: string;
  licence_type: LicenceType;
  organisation_name: string;
  holder: string;
  issued_date: string;
  expiry_date: string;
  status: LicenceStatus;
  status_display: string;
  conditions: string;
  is_expired: boolean;
  days_until_expiry: number | null;
  has_certificate: boolean;
  application_reference: string;
  created_at: string;
  updated_at: string;
};

// ── Licence Verify ──
export type LicenceVerify = {
  licence_number: string;
  licence_type_name: string;
  licence_type_code: string;
  organisation_name: string;
  issued_date: string;
  expiry_date: string;
  status: LicenceStatus;
  status_display: string;
  is_expired: boolean;
};

// ── Request types ──
export type ApplicationCreateRequest = {
  licence_type: string;
  organisation_name: string;
  organisation_registration?: string;
  contact_person: string;
  contact_email: string;
  contact_phone?: string;
  description: string;
  submit?: boolean;
};

export type StatusUpdateRequest = {
  status: ApplicationStatus;
  reason?: string;
  info_request_message?: string;
  internal_notes?: string;
};

export type DocumentUploadRequest = {
  name: string;
  file: File;
};

export type StaffApplicationListParams = {
  status?: ApplicationStatus;
  licence_type?: string;
  search?: string;
  ordering?: string;
  page?: number;
};
