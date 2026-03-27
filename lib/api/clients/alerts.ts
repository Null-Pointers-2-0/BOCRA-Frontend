import { apiClient } from "../client";
import type { AlertCategory, AlertSubscription } from "../types/alerts";

/**
 * Get all public alert categories.
 */
export async function getAlertCategories() {
  return apiClient<AlertCategory[]>("/alerts/categories/");
}

/**
 * Subscribe an email to alert categories.
 */
export async function subscribe(data: { email: string; categories: string[]; operator_filter?: string }) {
  return apiClient<AlertSubscription>("/alerts/subscribe/", {
    method: "POST",
    body: data,
  });
}

/**
 * Get the current user's alert subscriptions.
 */
export async function getMySubscriptions() {
  return apiClient<AlertSubscription[]>("/alerts/subscriptions/");
}

/**
 * Update alert subscription categories and filters.
 */
export async function updateSubscription(data: { categories: string[]; operator_filter?: string }) {
  return apiClient<AlertSubscription>("/alerts/subscriptions/update/", {
    method: "PATCH",
    body: data,
  });
}

/**
 * Delete (unsubscribe from) alerts.
 */
export async function deleteSubscription() {
  return apiClient<{ deleted: number }>("/alerts/subscriptions/delete/", {
    method: "DELETE",
  });
}
