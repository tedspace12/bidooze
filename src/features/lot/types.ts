export type LotDetailsResponse = {
  data: {
    id: number;
    lot_number: string;
    title: string;
    primary_image_url: string;
    images: { id: number; image_url: string; order: number }[];
    description: string;
    status: string;
    current_bid: number | null;
    /** Resolved increment for current/starting price tier from auction schedule */
    bid_increment: number | null;
    total_bids_count: number;
    soft_close_seconds: number | null;
    shipping_availability: string | null;
    bidding_starts_at: string | null;
    bidding_ends_at: string | null;
    is_in_watchlist: boolean;
    starting_bid: number | null;
    auction: {
      id: number;
      code: string;
      name: string;
      type: string;
      dates: {
        auction_start_at: string;
        auction_end_at: string;
        effective_open_bidding_at: string;
        effective_close_bidding_at: string;
        timezone: string;
      };
      location: {
        address_line_1: string | null;
        address_line_2: string | null;
        city: string | null;
        state: string | null;
        zip_code: string | null;
        country: string | null;
      };
      buyer_premium_percentage: number | null;
    };
    auctioneer: {
      id: number;
      avatar_url: string | null;
      company_name: string;
      total_auctions: number;
    };
    shipping_cost: number | null;
    pickup_location: string | null;
    bidding_notice: string | null;
  };
  meta: {
    auction_id: number;
    auction_code: string;
    auction_name: string;
    auction_status: string;
    registration_status: string | null;
    currency?: string;
  };
};

export type LotListItem = {
  id: number;
  lot_number: string;
  title: string;
  status: string;
  starting_bid: number;
  estimate_low: string;
  estimate_high: string;
  current_bid: number | null;
  bid_increment: number;
  bid_count: number;
  is_in_watchlist: boolean;
  starts_at: string | null;
  ends_at: string | null;
  image_url: string;
  auction: {
    id: number;
    code: string;
    name: string;
    status: string;
    auctioneer_company_name: string;
    auction_start_at: string;
    auction_end_at: string;
    currency: string;
    shipping_availability: string;
    registration_status: string | null;
  };
};

export type LotsListResponse = {
  data: LotListItem[];
  pagination: {
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
  };
};
