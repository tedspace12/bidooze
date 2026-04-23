/* eslint-disable @typescript-eslint/no-explicit-any */
import { withAuth } from "@/services/api";
import type {
  BuyerSettingsResponse,
  BuyerSettingsUpdatePayload,
} from "../types";

export const settingsService = {
  async getBuyerSettings(): Promise<BuyerSettingsResponse> {
    try {
      const res = await withAuth.get<BuyerSettingsResponse>("/buyer/settings");
      return res.data;
    } catch (error: any) {
      throw error?.response?.data || { message: error.message };
    }
  },

  async updateBuyerSettings(
    data: BuyerSettingsUpdatePayload
  ): Promise<BuyerSettingsResponse> {
    try {
      const res = await withAuth.patch<BuyerSettingsResponse>(
        "/buyer/settings",
        data
      );
      return res.data;
    } catch (error: any) {
      throw error?.response?.data || { message: error.message };
    }
  },
};
