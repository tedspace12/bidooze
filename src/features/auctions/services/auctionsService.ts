/* eslint-disable @typescript-eslint/no-explicit-any */

import { withoutAuth } from "@/services/api";
import { IAuctionsResponse } from "../types";

export type AuctionListParams = Record<string, any> & {
  page?: number;
  per_page?: number;
};

export const auctionsService = {
  async getAuctions(config: { params: AuctionListParams }): Promise<IAuctionsResponse> {
    try {
      const res = await withoutAuth.get<IAuctionsResponse>("/auctions", {
        params: config.params,
      });
      return res.data;
    } catch (error: any) {
      throw error?.response?.data || { message: error.message };
    }
  },
};
