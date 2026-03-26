// ── Domain Zone ──
export type DomainZone = {
  id: string;
  name: string;
  code: string;
  description: string;
  registration_fee: number;
  renewal_fee: number;
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
  registered_at: string;
  expires_at: string;
  nameserver_1: string;
  nameserver_2: string;
};
