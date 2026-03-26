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

// ── Domain Availability Check ──
export type DomainAvailability = {
  domain_name: string;
  available: boolean;
  zone: DomainZone | null;
  message: string;
};

// ── Domain WHOIS ──
export type DomainWhois = {
  domain_name: string;
  zone_name: string;
  status: string;
  status_display: string;
  registrant_name: string;
  organisation_name: string;
  registered_at: string | null;
  expires_at: string | null;
  nameserver_1: string;
  nameserver_2: string;
};

// ── Domain Application (list item) ──
export type DomainApplicationListItem = {
  id: string;
  reference_number: string;
  application_type: string;
  application_type_display: string;
  domain_name: string;
  zone: string;
  zone_name: string;
  organisation_name: string;
  status: string;
  status_display: string;
  submitted_at: string | null;
  decision_date: string | null;
  created_at: string;
  updated_at: string;
};

// ── Domain Application Create Request ──
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
  justification?: string;
  submit?: boolean;
};
