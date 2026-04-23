export type BidsSummaryResponse = {
    winning_now: number;
    outbid: number;
    won_lots: number;
    lost_lots: number;
    total_bids: number;
    watchlist_count: number;
    winning_breakdown: {
      manual: number;
      auto: number;
    };
};

export type BidsGroupedLot = {
  lot_id: number;
  lot_number: string;
  title: string;
  status: string;
  lot_bid_count: number;
  estimate_low: string;
  estimate_high: string;
  current_bid: number | null;
  user_max_bid: number | null;
  next_bid: number | null;
  time_remaining_seconds: number | null;
  images: string[];
  is_in_watchlist: boolean;
};

export type BidsGroupedAuction = {
  auction: {
    auction_id: number;
    auction_name: string;
    auction_code: string;
    auction_house_company_name: string;
    auction_start_at: string;
    auction_end_at: string;
    shipping_availability: string;
    registration_status: string;
  };
  lots: BidsGroupedLot[];
};

export type BidsGroupedResponse = {
  data: BidsGroupedAuction[];
};

export type BidsTopPick = {
  lot_id: number;
  lot_number: string;
  title: string;
  status: string;
  estimate_low: string;
  estimate_high: string;
  current_bid: number | null;
  max_bid: number | null;
  next_bid: number | null;
  bid_count: number;
  time_remaining_seconds: number | null;
  image_url: string;
  is_in_watchlist: boolean;
  auction: {
    auction_id: number;
    auction_name: string;
    auction_code: string;
    status: string;
    auctioneer_company_name: string;
    auction_start_at: string;
    auction_end_at: string;
    shipping_availability: string;
    currency: string;
    registration_status?: string | null;
  };
};

export type BidsTopPicksResponse = {
  data: BidsTopPick[];
};

export type BidsRegisteredAuction = {
  registration_id: number;
  registration_status: string;
  registered_at: string;
  auction: {
    auction_id: number;
    auction_name: string;
    auction_code: string;
    status: string;
    auctioneer_company_name: string;
    auction_start_at: string;
    auction_end_at: string;
    shipping_availability: string;
    currency: string;
    description: string;
    cover_image: {
      image_url: string;
    };
    lot_images: Array<{
      image_url: string;
    }>;
    location: {
      address: string;
      city: string;
      state: string;
      country: string;
      postal_code: string;
    };
  };
};

export type BidsRegisteredAuctionsResponse = {
  data: BidsRegisteredAuction[];
};

export type WatchlistItem = {
  watch_id: number;
  added_at: string;
  lot: {
    id: number;
    lot_number: string;
    title: string;
    status: string;
    estimate_low: string;
    estimate_high: string;
    current_bid: number | null;
    next_bid: number;
    max_bid: number | null;
    bid_count: number;
    ends_at: string | null;
    image_url: string;
  };
  auction: {
    id: number;
    code: string;
    name: string;
    status: string;
    auctioneer_company_name: string;
    auction_start_at: string;
    auction_end_at: string;
    shipping_availability: string;
    currency: string;
    registration_status: string | null;
  };
};

export type WatchlistResponse = {
  data: WatchlistItem[];
  pagination: {
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
    from?: number;
    to?: number;
  };
};