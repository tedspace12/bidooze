/* eslint-disable @typescript-eslint/no-explicit-any */
import { withoutAuth } from "@/services/api";
import type { BlogListResponse, BlogDetailResponse, BlogListParams } from "../types";

export const blogService = {
  async getBlogs(params?: BlogListParams): Promise<BlogListResponse> {
    try {
      const res = await withoutAuth.get<BlogListResponse>("/blogs", { params });
      return res.data;
    } catch (error: any) {
      throw error?.response?.data || { message: error.message };
    }
  },

  async getBlogBySlug(slug: string): Promise<BlogDetailResponse> {
    try {
      const res = await withoutAuth.get<BlogDetailResponse>(`/blogs/${slug}`);
      return res.data;
    } catch (error: any) {
      throw error?.response?.data || { message: error.message };
    }
  },
};
