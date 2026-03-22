// ── Network Operator ──
export type NetworkOperator = {
  id: string;
  name: string;
  code: string;
  logo: string | null;
  is_active: boolean;
};

// ── Telecoms Stat ──
export type TelecomsStat = {
  id: string;
  operator: string;
  operator_name: string;
  operator_code: string;
  period: string;
  technology: "2G" | "3G" | "4G" | "5G";
  subscriber_count: number;
  market_share_percent: string;
  revenue: string | null;
};

// ── QoS Record ──
export type QoSRecord = {
  id: string;
  operator: string;
  operator_name: string;
  operator_code: string;
  period: string;
  metric_type: "CALL_SUCCESS" | "DATA_SPEED" | "LATENCY" | "DROP_RATE";
  metric_type_display: string;
  value: string;
  region: string;
};

// ── QoS By Operator ──
export type QoSByOperator = {
  operator_name: string;
  operator_code: string;
  metric_type: string;
  avg_value: number;
  record_count: number;
};

// ── Dashboard: Public ──
export type PublicDashboard = {
  active_licences: number;
  total_complaints: number;
  total_subscribers: number;
  active_operators: number;
  publications_count: number;
  open_tenders: number;
};

// ── Dashboard: Staff ──
export type StaffDashboard = {
  users: {
    total: number;
    by_role: Record<string, number>;
    new_last_7_days: number;
    new_last_30_days: number;
  };
  licensing: {
    active_licences: number;
    pending_applications: number;
    applications_by_status: Record<string, number>;
  };
  complaints: {
    total: number;
    open: number;
    overdue: number;
    by_status: Record<string, number>;
    by_priority: Record<string, number>;
  };
  content: {
    publications: number;
    tenders: number;
    news: number;
  };
};

// ── Summaries ──
export type UserSummary = {
  total: number;
  by_role: Record<string, number>;
  email_verified: number;
  verification_rate_percent: number;
  locked_accounts: number;
  new_last_7_days: number;
  new_last_30_days: number;
  registration_trend: { month: string; count: number }[];
};

export type ComplaintSummary = {
  total: number;
  open: number;
  resolved: number;
  resolution_rate_percent: number;
  avg_resolution_days: number;
  overdue: number;
  by_status: Record<string, number>;
  by_category: Record<string, number>;
  by_priority: Record<string, number>;
};

export type LicensingSummary = {
  licences: {
    total: number;
    active: number;
    expired: number;
    suspended: number;
    by_type: Record<string, number>;
  };
  renewals_due: {
    "30_days": number;
    "60_days": number;
    "90_days": number;
  };
  applications: {
    total: number;
    by_status: Record<string, number>;
  };
};

export type TrendItem = {
  month: string;
  count: number;
};

export type ContentOverview = {
  publications: { total: number; published: number; draft: number; archived: number };
  tenders: { total: number; draft: number; open: number; closed: number; awarded: number; cancelled: number };
  news: { total: number; published: number; draft: number; archived: number };
};

export type ContentSummary = {
  total: number;
  published?: number;
  draft?: number;
  archived?: number;
  open?: number;
  closed?: number;
  awarded?: number;
  cancelled?: number;
};

// ── Telecoms Overview ──
export type TelecomsOverview = {
  total_subscribers: number;
  operators: {
    name: string;
    code: string;
    subscriber_count: number;
    market_share_percent: number;
  }[];
};

// ── Params ──
export type AnalyticsDateParams = {
  start_date?: string;
  end_date?: string;
};
