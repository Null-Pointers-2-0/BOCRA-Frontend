import type {
  ComplaintCategory,
  ComplaintStatus,
  ComplaintPriority,
} from "./common";

// ── Complaint Document ──
export type ComplaintDocument = {
  id: string;
  name: string;
  file: string;
  file_type: string;
  file_size: number;
  uploaded_by_name: string;
  created_at: string;
};

// ── Complaint Status Log ──
export type ComplaintStatusLog = {
  id: string;
  from_status: ComplaintStatus;
  from_status_display: string;
  to_status: ComplaintStatus;
  to_status_display: string;
  changed_by_name: string;
  reason: string;
  changed_at: string;
};

// ── Case Note ──
export type CaseNote = {
  id: string;
  content: string;
  is_internal: boolean;
  author_name: string;
  created_at: string;
};

// ── Category option ──
export type ComplaintCategoryOption = {
  value: ComplaintCategory;
  label: string;
};

// ── Complaint (list item) ──
export type ComplaintListItem = {
  id: string;
  reference_number: string;
  subject: string;
  category: ComplaintCategory;
  category_display: string;
  against_operator_name: string;
  status: ComplaintStatus;
  status_display: string;
  priority: ComplaintPriority;
  priority_display: string;
  is_overdue: boolean;
  sla_deadline: string | null;
  created_at: string;
  resolved_at: string | null;
};

// ── Complaint (full detail) ──
export type ComplaintDetail = {
  id: string;
  reference_number: string;
  complainant_name: string;
  complainant_email: string;
  complainant_phone: string;
  against_operator_name: string;
  against_licensee: string | null;
  category: ComplaintCategory;
  category_display: string;
  subject: string;
  description: string;
  status: ComplaintStatus;
  status_display: string;
  priority: ComplaintPriority;
  priority_display: string;
  assigned_to_name: string | null;
  resolution: string;
  resolved_at: string | null;
  is_overdue: boolean;
  days_until_sla: number | null;
  sla_deadline: string | null;
  documents: ComplaintDocument[];
  status_timeline: ComplaintStatusLog[];
  case_notes: CaseNote[];
  created_at: string;
  updated_at: string;
};

// ── Staff variants ──
export type StaffComplaintListItem = ComplaintListItem & {
  complainant_name_display: string;
  complainant_email_display: string;
  assigned_to_name: string | null;
  days_until_sla: number | null;
};

export type StaffComplaintDetail = ComplaintDetail;

// ── Complaint Track (public) ──
export type ComplaintTrack = {
  reference_number: string;
  subject: string;
  category: ComplaintCategory;
  category_display: string;
  against_operator_name: string;
  status: ComplaintStatus;
  status_display: string;
  priority: ComplaintPriority;
  priority_display: string;
  is_overdue: boolean;
  sla_deadline: string | null;
  created_at: string;
  resolved_at: string | null;
};

// ── Request types ──
export type ComplaintCreateRequest = {
  complainant_name: string;
  complainant_email: string;
  complainant_phone?: string;
  against_operator_name: string;
  against_licensee?: string;
  category: ComplaintCategory;
  subject: string;
  description: string;
  priority?: ComplaintPriority;
};

export type ComplaintStatusUpdateRequest = {
  status: ComplaintStatus;
  reason?: string;
};

export type ComplaintAssignRequest = {
  assigned_to: string;
};

export type ComplaintResolveRequest = {
  resolution: string;
};

export type CaseNoteCreateRequest = {
  content: string;
  is_internal?: boolean;
};

export type StaffComplaintListParams = {
  status?: ComplaintStatus;
  category?: ComplaintCategory;
  priority?: ComplaintPriority;
  assigned_to?: string;
  search?: string;
  ordering?: string;
  page?: number;
};
