/* eslint-disable @typescript-eslint/no-explicit-any */
import { withAuth } from "@/services/api";
import type { LotDetailsResponse, LotsListResponse } from "../types";

export type LotsListParams = Record<string, any> & {
  page?: number;
  per_page?: number;
};

export const lotService = {
  async getLotDetails(auctionId: string, lotId: string): Promise<LotDetailsResponse> {
    try {
      const res = await withAuth.get<LotDetailsResponse>(
        `/auctions/${auctionId}/lots/${lotId}`
      );
      return res.data;
    } catch (error: any) {
      throw error?.response?.data || { message: error.message };
    }
  },

  async getLots(params: LotsListParams = {}): Promise<LotsListResponse> {
    try {
      const res = await withAuth.get<LotsListResponse>("/lots", { params });
      return res.data;
    } catch (error: any) {
      throw error?.response?.data || { message: error.message };
    }
  },
};
