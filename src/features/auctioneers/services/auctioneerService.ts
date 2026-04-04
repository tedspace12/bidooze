/* eslint-disable @typescript-eslint/no-explicit-any */
import { withAuth, withoutAuth } from "@/services/api";
import type { AuctioneerResponse, AuctioneerDetailsResponse } from "../types";

export interface AuctioneerParams {
  name?: string;
  country?: string;
  state?: string;
  favourites?: boolean;
  per_page?: number;
  page?: number;
}

export const auctioneerService = {
  async getAuctioneerDetails(identifier: string, params?: { status?: string; per_page?: number; page?: number }): Promise<AuctioneerDetailsResponse> {
    try {
        const res = await withoutAuth.get<AuctioneerDetailsResponse>(`/auctioneers/${identifier}`, { params });
        return res.data;
    } catch (error: any) {
        throw error?.response?.data || { message: error.message };
    }
    },

    async getAuctioneers(params?: AuctioneerParams): Promise<AuctioneerResponse> {
        try {
            const client = params?.favourites ? withAuth : withoutAuth;
            const res = await client.get<AuctioneerResponse>(`/auctioneers`, { params});
            return res.data;
        } catch (error: any) {
            throw error?.response?.data || { message: error.message };
        }
    },
};