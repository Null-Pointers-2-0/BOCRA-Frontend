// -- Alert Types (public frontend / portal) -----------------------------------

export type AlertCategory = {
  id: string;
  name: string;
  code: string;
  description: string;
  icon: string;
  is_public: boolean;
  is_active: boolean;
  sort_order: number;
};

export type AlertSubscription = {
  id: string;
  email: string;
  categories: AlertCategory[];
  is_confirmed: boolean;
  confirmed_at: string | null;
  operator_filter: string;
  is_active: boolean;
  created_at: string;
};
