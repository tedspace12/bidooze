/* eslint-disable @typescript-eslint/no-explicit-any */

import { withoutAuth } from "@/services/api";
import { IAuctionsResponse } from "../types";

export const auctionsService = {
 async getAuctions(params: { params: Record<string, any> }): Promise<IAuctionsResponse> {
    try {
      const res = await withoutAuth.get("/auctions", params);
      return res.data;
    } catch (error: any) {
      throw error?.response?.data || { message: error.message };
    }
  },
};
