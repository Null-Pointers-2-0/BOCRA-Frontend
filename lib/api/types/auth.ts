import type { UserRole, Gender } from "./common";

// ── Profile ──
export type Profile = {
  organisation: string;
  position: string;
  date_of_birth: string | null;
  gender: Gender | "";
  bio: string;
  address: string;
  city: string;
  postal_code: string;
  country: string;
  id_number: string;
  avatar: string | null;
  age: number | null;
  is_complete: boolean;
};

// ── User (full detail) ──
export type User = {
  id: string;
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  full_name: string;
  phone_number: string;
  id_number: string;
  role: UserRole;
  role_display: string;
  email_verified: boolean;
  is_active: boolean;
  is_locked: boolean;
  date_joined: string;
  last_login: string | null;
  profile: Profile;
};

// ── User list item ──
export type UserListItem = {
  id: string;
  email: string;
  username: string;
  full_name: string;
  role: UserRole;
  role_display: string;
  email_verified: boolean;
  is_active: boolean;
  date_joined: string;
};

// ── Auth Request/Response ──
export type LoginRequest = {
  identifier: string;
  password: string;
  remember_me?: boolean;
};

export type LoginResponse = {
  access: string;
  refresh: string;
  user: User;
};

export type RegisterRequest = {
  email: string;
  username: string;
  password: string;
  confirm_password: string;
  first_name: string;
  last_name: string;
  phone_number?: string;
  id_number?: string;
};

export type TokenRefreshRequest = {
  refresh: string;
};

export type TokenRefreshResponse = {
  access: string;
  refresh?: string;
};

export type PasswordResetRequest = {
  email: string;
};

export type PasswordResetConfirmRequest = {
  token: string;
  uid: string;
  new_password: string;
  confirm_password: string;
};

export type PasswordChangeRequest = {
  current_password: string;
  new_password: string;
  confirm_password: string;
};

export type ProfileUpdateRequest = {
  first_name?: string;
  last_name?: string;
  phone_number?: string;
  id_number?: string;
  profile?: Partial<Omit<Profile, "age" | "is_complete" | "avatar">>;
};

// ── Admin user management ──
export type AdminUserUpdateRequest = {
  role?: UserRole;
  is_active?: boolean;
  email_verified?: boolean;
};

export type UserListParams = {
  role?: UserRole;
  is_active?: boolean;
  email_verified?: boolean;
  search?: string;
  ordering?: string;
  page?: number;
};
