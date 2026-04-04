export type ApiListResponse<T> = {
  message?: string;
  data: T;
};

export type AuctionRegistrationStatus = string | null;

export type HomeHeroAuction = {
  auction_id: number;
  status: string;
  title: string;
  auctioneer_company_name: string;
  start_datetime: string;
  end_datetime: string;
  lot_count: number;
  image_url: string;
  currency: string;
  registration_status: AuctionRegistrationStatus;
};

export type HomeFeaturedSlot = {
  slot_id: number;
  position: number;
  source: "win" | "fallback";

  auction: {
    auction_id: number;
    title: string;
    status: "draft" | "live" | "ended";
    image_url: string;
    start_datetime: string;
    end_datetime: string;
    currency: string;

    registration_status: AuctionRegistrationStatus;

    stats?: {
      bid_count: number;
      highest_bid: number | null;
    };
  };

  highlight_lot?: {
    lot_id: number;
    title: string;
    highest_bid: number | null;
    bid_count: number;

    ends_at: string | null;
    time_remaining: string | null;
  };
};

export type HomeRecommendation = {
  lot: {
    lot_id: number;
    title: string;
    image_url: string;
    auction_id: number;
    auction_title: string;
    currency: string;
  };
  stats?: {
    bid_count: number;
    highest_bid: number | null;
  };
  timing: {
    ends_at: string | null,
    time_remaining: string | null
  },
  mode: string;
};

export type HomeHotAuction = {
  auction: {
    auction_id: number;
    status: string;
    title: string;
    auctioneer_company_name: string;
    description: string;
    start_datetime: string;
    end_datetime: string;
    lot_count: number;
    location: string;
    image_url: string;
    currency: string;
    registration_status: AuctionRegistrationStatus;
  };
  stats?: {
    bid_count: number;
    current_bid: number | null;
  };
  hot_score: number;
};

export type Category = {
  id: number;
  parent_id: number | null;
  name: string;
  slug: string;
  image_url: string;
  sort_order: number;
  published_auctions_count: number;
  subcategories?: Category[];
};

