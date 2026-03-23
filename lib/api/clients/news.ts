import { apiClient } from "../client";
import type { ApiResponse, PaginatedData } from "../types/common";
import type {
  ArticleListItem,
  ArticleDetail,
  PublicArticleListParams,
} from "../types/news";

export async function getArticles(
  params?: PublicArticleListParams
): Promise<ApiResponse<PaginatedData<ArticleListItem>>> {
  return apiClient<PaginatedData<ArticleListItem>>("/news/", {
    params: params as Record<string, string | number | boolean | undefined>,
  });
}

export async function getArticle(
  id: string
): Promise<ApiResponse<ArticleDetail>> {
  return apiClient<ArticleDetail>(`/news/${id}/`);
}

export async function getNewsCategories(): Promise<
  ApiResponse<{ value: string; label: string }[]>
> {
  return apiClient<{ value: string; label: string }[]>(
    "/news/categories/"
  );
}
