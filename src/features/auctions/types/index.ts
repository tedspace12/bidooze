export type {
  AuctionLifecycle,
  AuctionStatusFilter,
} from "@/lib/auctionLifecycle";

import type { AuctionLifecycle, AuctionStatusFilter } from "@/lib/auctionLifecycle";

export type AuctionStatus = AuctionStatusFilter;

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


export interface AuctionsByLocationParams {
  state?: string;
  country?: string;
  zip_code?: string;
  per_page?: number;
  page?: number;
}

export interface AuctionByLocation {
  id: number;
  name: string;
  code: string;
  description: string;
  auction_start_at: string;
  auction_end_at: string;
  status: string;
  image_url: string;
  registration_status: string | null;
  is_in_watchlist: boolean;
  lot_count: number;
  city: string;
  state: string;
  shipping_availability: string;
  auctioneer: { company_name: string };
  lots: { id: number; title: string; primary_image_url: string }[];
}

export interface AuctionsByLocationResponse {
  data: AuctionByLocation[];
  pagination: {
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
  };
}

export interface StateFeaturedSlot {
  slot_id: number;
  position: number;
  source: "assignment" | "fallback";
  auction: {
    auction_id: number;
    title: string;
    status: string;
    image_url: string;
    start_datetime: string;
    end_datetime: string;
    currency: string;
    stats: { bid_count: number; highest_bid: number };
  } | null;
  highlight_lot: {
    lot_id: number;
    title: string;
    highest_bid: number;
    bid_count: number;
    ends_at: string;
    time_remaining: string;
  } | null;
}

export interface StateFeaturedResponse {
  data: StateFeaturedSlot[];
}
