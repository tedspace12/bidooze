/* eslint-disable @typescript-eslint/no-explicit-any */
import { withoutAuth, withAuth } from "@/services/api";
import type { AuctionDetailsResponse, AuctionLotsResponse, AuctionRegistrationPayload, AuctionRegistrationResponse } from "../types";

export const auctionService = {
  async getAuctionDetails(identifier: string): Promise<AuctionDetailsResponse> {
    try {
      const res = await withoutAuth.get<AuctionDetailsResponse>(`/auctions/${identifier}`);
      return res.data;
    } catch (error: any) {
      throw error?.response?.data || { message: error.message };
    }
  },

  async getAuctionLots(identifier: string,): Promise<AuctionLotsResponse> {
    try {
      const res = await withoutAuth.get<AuctionLotsResponse>(`/auctions/${identifier}/lots`);
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
};

