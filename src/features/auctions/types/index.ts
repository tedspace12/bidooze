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

export type AuctionStatesSummaryCountry = "US" | "CA";

export type AuctionStatesSummaryStatus = AuctionLifecycle;

export interface AuctionStateSummaryItem {
  code: string;
  name: string;
  auction_count: number;
}

export interface AuctionStatesSummaryResponse {
  country: AuctionStatesSummaryCountry;
  total_auctions: number;
  states: AuctionStateSummaryItem[];
  updated_at: string;
}

// Calendar API Types
export interface CalendarAuction {
  id: string;
  name: string;
  status: AuctionLifecycle;
  start_at: string;
  end_at: string;
  auctioneer: {
    id: string;
    name: string;
    image: string;
  };
}

export interface CalendarAuctionResponse {
  data: CalendarAuction[];
}

export interface AuctionsByDateResponse {
  data: CalendarAuction[];
}

export interface ReminderRequest {
  minutes_before: number;
}

export interface ReminderResponse {
  message: string;
  reminder: {
    id: number;
    user_id: number;
    auction_id: string;
    remind_before_minutes: number;
    reminded_at: string | null;
    created_at: string;
    updated_at: string;
  };
}

export interface CalendarFilters {
  year?: number;
  month?: number;
  auctioneer_id?: number[];
  status?: AuctionStatusFilter;
  per_page?: number;
  page?: number;
}
