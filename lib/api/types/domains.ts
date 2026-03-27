import type { ApplicationStatus } from "./common";

// ── Domain Zone ──
export type DomainZone = {
  id: string;
  name: string;
  code: string;
  description: string;
  registration_fee: string;
  renewal_fee: string;
  fee_currency: string;
  min_registration_years: number;
  max_registration_years: number;
  is_restricted: boolean;
  eligibility_criteria: string;
  is_active: boolean;
};

// ── Domain Availability ──
export type DomainAvailability = {
  domain_name: string;
  available: boolean;
  zone: DomainZone | null;
  message: string;
};

// ── Domain Whois ──
export type DomainWhois = {
  domain_name: string;
  zone_name: string;
  status: string;
  status_display: string;
  registrant_name: string;
  organisation_name: string;
  registered_at: string;
  expires_at: string;
  nameserver_1: string;
  nameserver_2: string;
};

// ── Application Document ──
export type DomainApplicationDocument = {
  id: string;
  name: string;
  file: string;
  file_type: string;
  file_size: number;
  uploaded_by_name: string;
  created_at: string;
};

// ── Application Status Log ──
export type DomainApplicationStatusLog = {
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
export type DomainApplicationListItem = {
  id: string;
  reference_number: string;
  application_type: string;
  application_type_display: string;
  domain_name: string;
  zone: string;
  zone_name: string;
  organisation_name: string;
  status: ApplicationStatus;
  status_display: string;
  submitted_at: string | null;
  decision_date: string | null;
  created_at: string;
  updated_at: string;
};

// ── Application (full detail) ──
export type DomainApplicationDetail = {
  id: string;
  reference_number: string;
  application_type: string;
  application_type_display: string;
  domain_name: string;
  zone: DomainZone;
  status: ApplicationStatus;
  status_display: string;
  registration_period_years: number;
  organisation_name: string;
  organisation_registration_number: string;
  registrant_name: string;
  registrant_email: string;
  registrant_phone: string;
  registrant_address: string;
  nameserver_1: string;
  nameserver_2: string;
  nameserver_3: string;
  nameserver_4: string;
  tech_contact_name: string;
  tech_contact_email: string;
  transfer_from_registrant: string;
  transfer_auth_code: string;
  justification: string;
  submitted_at: string | null;
  decision_date: string | null;
  decision_reason: string;
  info_request_message: string;
  can_cancel: boolean;
  has_domain: boolean;
  domain_id: string | null;
  documents: DomainApplicationDocument[];
  status_timeline: DomainApplicationStatusLog[];
  created_at: string;
  updated_at: string;
};

// ── Domain (list item) ──
export type DomainListItem = {
  id: string;
  domain_name: string;
  zone_name: string;
  organisation_name: string;
  registrant_name: string;
  status: string;
  status_display: string;
  registered_at: string;
  expires_at: string;
  is_expired: boolean;
  days_until_expiry: number | null;
};

// ── Domain (full detail) ──
export type DomainDetail = {
  id: string;
  domain_name: string;
  zone_name: string;
  organisation_name: string;
  registrant_name: string;
  registrant_email: string;
  registrant_phone: string;
  registrant_address: string;
  status: string;
  status_display: string;
  registered_at: string;
  expires_at: string;
  nameserver_1: string;
  nameserver_2: string;
  nameserver_3: string;
  nameserver_4: string;
  is_expired: boolean;
  days_until_expiry: number | null;
  created_at: string;
  updated_at: string;
};

// ── Request types ──
export type DomainApplicationCreateRequest = {
  application_type?: string;
  domain_name: string;
  zone: string;
  registration_period_years?: number;
  organisation_name: string;
  organisation_registration_number?: string;
  registrant_name: string;
  registrant_email: string;
  registrant_phone?: string;
  registrant_address?: string;
  nameserver_1?: string;
  nameserver_2?: string;
  nameserver_3?: string;
  nameserver_4?: string;
  tech_contact_name?: string;
  tech_contact_email?: string;
  transfer_from_registrant?: string;
  transfer_auth_code?: string;
  justification?: string;
  submit?: boolean;
};

export type DomainApplicationUpdateRequest = Partial<Omit<DomainApplicationCreateRequest, "submit">>;

export type DomainInfoResponseRequest = {
  response_message: string;
  documents?: File[];
};
