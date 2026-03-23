import { apiClient } from "../client";
import type { ApiResponse, PaginatedData } from "../types/common";
import type {
  StaffArticleListItem,
  StaffArticleDetail,
  ArticleCreateRequest,
  ArticleUpdateRequest,
  StaffArticleListParams,
} from "../types/news";

export async function getArticles(
  params?: StaffArticleListParams
): Promise<ApiResponse<PaginatedData<StaffArticleListItem>>> {
  return apiClient<PaginatedData<StaffArticleListItem>>(
    "/news/staff/list/",
    { params: params as Record<string, string | number | boolean | undefined> }
  );
}

export async function getArticle(
  id: string
): Promise<ApiResponse<StaffArticleDetail>> {
  return apiClient<StaffArticleDetail>(`/news/staff/${id}/`);
}

export async function createArticle(
  data: ArticleCreateRequest
): Promise<ApiResponse<StaffArticleDetail>> {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined) {
      formData.append(key, value instanceof File ? value : String(value));
    }
  });
  return apiClient<StaffArticleDetail>("/news/staff/", {
    method: "POST",
    body: formData,
    isFormData: true,
  });
}

export async function updateArticle(
  id: string,
  data: ArticleUpdateRequest
): Promise<ApiResponse<StaffArticleDetail>> {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined) {
      formData.append(key, value instanceof File ? value : String(value));
    }
  });
  return apiClient<StaffArticleDetail>(`/news/staff/${id}/edit/`, {
    method: "PATCH",
    body: formData,
    isFormData: true,
  });
}

export async function publishArticle(
  id: string
): Promise<ApiResponse<StaffArticleDetail>> {
  return apiClient<StaffArticleDetail>(`/news/staff/${id}/publish/`, {
    method: "PATCH",
  });
}

export async function archiveArticle(
  id: string
): Promise<ApiResponse<StaffArticleDetail>> {
  return apiClient<StaffArticleDetail>(`/news/staff/${id}/archive/`, {
    method: "PATCH",
  });
}

export async function deleteArticle(
  id: string
): Promise<ApiResponse<null>> {
  return apiClient<null>(`/news/staff/${id}/delete/`, {
    method: "DELETE",
  });
}
