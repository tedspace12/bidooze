/* eslint-disable @typescript-eslint/no-explicit-any */

import { withoutAuth } from "@/services/api";
import {
  AuctionsByLocationResponse,
  AuctionsByLocationParams,
  StateFeaturedResponse,
} from "../types";

export const auctionsByLocationService = {
  async getAuctionsByLocation(
    params: AuctionsByLocationParams,
  ): Promise<AuctionsByLocationResponse> {
    try {
      const res = await withoutAuth.get<AuctionsByLocationResponse>(
        "/auctions/by-location",
        { params },
      );
      return res.data;
    } catch (error: any) {
      throw error?.response?.data || { message: error.message };
    }
  },

  async getStateFeatured(stateCode: string): Promise<StateFeaturedResponse> {
    try {
      const res = await withoutAuth.get<StateFeaturedResponse>(
        `/home/states/${stateCode}/featured`,
      );
      return res.data;
    } catch (error: any) {
      throw error?.response?.data || { message: error.message };
    }
  },
};
