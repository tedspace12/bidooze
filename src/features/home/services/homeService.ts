/* eslint-disable @typescript-eslint/no-explicit-any */
import { withAuth, withoutAuth } from "@/services/api";
import type {
  ApiListResponse,
  Category,
  HomeFeaturedSlot,
  HomeHeroAuction,
  HomeHotAuction,
  HomeRecommendation,
} from "../types";

const unwrap = <T,>(res: { data: ApiListResponse<T> }): ApiListResponse<T> => res.data;

const handleError = (error: any): never => {
  throw error?.response?.data || { message: error.message };
};

export const homeService = {
  async getFeaturedHero(): Promise<ApiListResponse<HomeHeroAuction[]>> {
    try {
      const res = await withAuth.get<ApiListResponse<HomeHeroAuction[]>>(
        "/home/featured-hero"
      );
      return unwrap(res);
    } catch (error: any) {
      return handleError(error);
    }
  },

  async getFeaturedAuctions(): Promise<ApiListResponse<HomeFeaturedSlot[]>> {
    try {
      const res = await withAuth.get<ApiListResponse<HomeFeaturedSlot[]>>(
        "/home/featured-auctions"
      );
      return unwrap(res);
    } catch (error: any) {
      return handleError(error);
    }
  },

  async getRecommendations(): Promise<ApiListResponse<HomeRecommendation[]>> {
    try {
      const res = await withAuth.get<ApiListResponse<HomeRecommendation[]>>(
        "/home/recommendations"
      );
      return unwrap(res);
    } catch (error: any) {
      return handleError(error);
    }
  },

  async getHotAuctions(): Promise<ApiListResponse<HomeHotAuction[]>> {
    try {
      const res = await withAuth.get<ApiListResponse<HomeHotAuction[]>>(
        "/home/hot-auctions"
      );
      return unwrap(res);
    } catch (error: any) {
      return handleError(error);
    }
  },

  async getCategories(): Promise<ApiListResponse<Category[]>> {
    try {
      const res = await withoutAuth.get<ApiListResponse<Category[]>>("/categories");
      return unwrap(res);
    } catch (error: any) {
      return handleError(error);
    }
  },
};

