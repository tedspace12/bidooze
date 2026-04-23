/* eslint-disable @typescript-eslint/no-explicit-any */
import { withAuth } from "@/services/api";
import type {
  BidsSummaryResponse,
  BidsGroupedResponse,
  BidsTopPicksResponse,
  BidsRegisteredAuctionsResponse,
  WatchlistResponse
} from "../types";

export const bidsService = {
  async getBidsSummary(): Promise<BidsSummaryResponse> {
    try {
      const res = await withAuth.get<BidsSummaryResponse>(`/buyer/bids/summary`);
      return res.data;
    } catch (error: any) {
      throw error?.response?.data || { message: error.message };
    }
  },

  async getBidsGrouped(): Promise<BidsGroupedResponse> {
    try {
      const res = await withAuth.get<BidsGroupedResponse>(`/buyer/bids/grouped`);
      return res.data;
    } catch (error: any) {
      throw error?.response?.data || { message: error.message };
    }
  },

  async getBidsTopPicks(limit?: number): Promise<BidsTopPicksResponse> {
    try {
      const params = limit ? { limit } : {};
      const res = await withAuth.get<BidsTopPicksResponse>(`/buyer/bids/top-picks`, { params });
      return res.data;
    } catch (error: any) {
      throw error?.response?.data || { message: error.message };
    }
  },

  async getBidsRegisteredAuctions(): Promise<BidsRegisteredAuctionsResponse> {
    try {
      const res = await withAuth.get<BidsRegisteredAuctionsResponse>(`/buyer/bids/registered-auctions`);
      return res.data;
    } catch (error: any) {
      throw error?.response?.data || { message: error.message };
    }
  },

  async getWatchlist(perPage?: number): Promise<WatchlistResponse> {
    try {
      const params = perPage ? { per_page: perPage } : {};
      const res = await withAuth.get<WatchlistResponse>(`/buyer/watchlist`, { params });
      return res.data;
    } catch (error: any) {
      throw error?.response?.data || { message: error.message };
    }
  },
};