export type {
  AuctionLifecycle,
  AuctionStatusFilter,
} from "@/lib/auctionLifecycle";

import type { AuctionLifecycle, AuctionStatusFilter } from "@/lib/auctionLifecycle";

/** Filter sidebar / URL — `all` or one or more lifecycle values. */
export type AuctionStatus = AuctionStatusFilter;

/** Card / detail badges — canonical lifecycle only. */
export type AuctionCardStatus = AuctionLifecycle;

export interface IAuctionsResponse {
  data: [
    {
      id: number;
      name: string;
      description: string;
      status: string;
      auction_start_at: string;
      auction_end_at: string;
      bid_type: string;
      bidding_notice: string;
      city: string;
      state: string;
      timezone: string;
      buyer_premium_percentage: string;
      shipping_availability: string;
      feature_image_url?: string;
      image_url?: string;
      registration_status?: string | null;
      auctioneer: {
        id: number;
        company_name: string;
        avatar?: string | null;
        user: {
          id: number;
          name: string;
          email: string;
        };
      };
      lots: {
        id: number;
        lot_number: string;
        title: string;
        starting_bid: string;
        estimate_low: string;
        estimate_high: string;
        primary_image_url?: string;
      }[];
    }
  ];
  pagination: {
    total: number;
    per_page?: number;
    current_page?: number;
    last_page?: number;
  };
}
