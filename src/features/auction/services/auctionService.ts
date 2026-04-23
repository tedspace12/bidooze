/* eslint-disable @typescript-eslint/no-explicit-any */
import { withoutAuth, withAuth } from "@/services/api";
import type { AuctionDetailsResponse, AuctionLotsResponse, AuctionRegistrationPayload, AuctionRegistrationResponse, BidPayload, BidResponse, WatchlistResponse } from "../types";

export const auctionService = {
  async getAuctionDetails(identifier: string): Promise<AuctionDetailsResponse> {
    try {
      const res = await withAuth.get<AuctionDetailsResponse>(`/auctions/${identifier}`);
      return res.data;
    } catch (error: any) {
      throw error?.response?.data || { message: error.message };
    }
  },

  async getAuctionLots(identifier: string,): Promise<AuctionLotsResponse> {
    try {
      const res = await withAuth.get<AuctionLotsResponse>(`/auctions/${identifier}/lots`);
      return res.data;
    } catch (error: any) {
      throw error?.response?.data || { message: error.message };
    }
  },

  async registerForAuction(identifier: string, data: AuctionRegistrationPayload): Promise<AuctionRegistrationResponse> {
    try {
      const res = await withAuth.post(`/auctions/${identifier}/register`, data);
      return res.data;
    } catch (error: any) {
      throw error?.response?.data || { message: error.message };
    }
  },

  async placeBid(auctionId: string | number, lotId: string | number, data: BidPayload): Promise<BidResponse> {
    try {
      const res = await withAuth.post<BidResponse>(`/auctions/${auctionId}/lots/${lotId}/bids`, data);
      return res.data;
    } catch (error: any) {
      throw error?.response?.data || { message: error.message };
    }
  },

  async addToWatchlist(lotId: string | number): Promise<WatchlistResponse> {
    try {
      const res = await withAuth.post<WatchlistResponse>(`/lots/${lotId}/watchlist`);
      return res.data;
    } catch (error: any) {
      throw error?.response?.data || { message: error.message };
    }
  },

  async removeFromWatchlist(lotId: string | number): Promise<WatchlistResponse> {
    try {
      const res = await withAuth.delete<WatchlistResponse>(`/lots/${lotId}/watchlist`);
      return res.data;
    } catch (error: any) {
      throw error?.response?.data || { message: error.message };
    }
  },
};

