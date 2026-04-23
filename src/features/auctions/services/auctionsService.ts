/* eslint-disable @typescript-eslint/no-explicit-any */

import { withAuth } from "@/services/api";
import {
  IAuctionsResponse,
  CalendarAuctionResponse,
  CalendarFilters,
  AuctionsByDateResponse,
  ReminderRequest,
  ReminderResponse,
  AuctionStatesSummaryCountry,
  AuctionStatesSummaryResponse,
  AuctionStatesSummaryStatus,
} from "../types";

export type AuctionListParams = Record<string, any> & {
  page?: number;
  per_page?: number;
};

export type AuctionStatesSummaryParams = {
  country: AuctionStatesSummaryCountry;
  status?: AuctionStatesSummaryStatus;
};

export const auctionsService = {
  async getAuctions(config: { params: AuctionListParams }): Promise<IAuctionsResponse> {
    try {
      const res = await withAuth.get<IAuctionsResponse>("/auctions", {
        params: config.params,
      });
      return res.data;
    } catch (error: any) {
      throw error?.response?.data || { message: error.message };
    }
  },

  async getCalendarAuctions(filters: CalendarFilters): Promise<CalendarAuctionResponse> {
    try {
      const res = await withAuth.get<CalendarAuctionResponse>("/auctions/calendar", {
        params: filters,
      });
      return res.data;
    } catch (error: any) {
      throw error?.response?.data || { message: error.message };
    }
  },

  async getAuctionsByDate(date: string): Promise<AuctionsByDateResponse> {
    try {
      const res = await withAuth.get<AuctionsByDateResponse>("/auctions/by-date", {
        params: { date },
      });
      return res.data;
    } catch (error: any) {
      throw error?.response?.data || { message: error.message };
    }
  },

  async setAuctionReminder(auctionId: string, reminderData: ReminderRequest): Promise<ReminderResponse> {
    try {
      const res = await withAuth.post<ReminderResponse>(`/auctions/${auctionId}/remind`, reminderData);
      return res.data;
    } catch (error: any) {
      throw error?.response?.data || { message: error.message };
    }
  },

  async getAuctionStatesSummary(
    params: AuctionStatesSummaryParams
  ): Promise<AuctionStatesSummaryResponse> {
    try {
      const res = await withAuth.get<AuctionStatesSummaryResponse>(
        "/auctions/states-summary",
        { params }
      );
      return res.data;
    } catch (error: any) {
      throw error?.response?.data || { message: error.message };
    }
  },
};
