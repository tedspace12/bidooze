export type RegistrationRequirements = {
  approval_mode: "immediate" | "approval" | "deposit";
  requires_deposit: boolean;
  requires_card: boolean;
  deposit: {
    type: "fixed" | "percentage";
    value: number;
    cap: number | null;
    requires_max_bid_limit: boolean;
    fixed_amount: number | null;
    currency: string;
  } | null;
};

export type AuctionDetailsResponse = {
  id: number;
  status: string;
  name: string;
  description: string;
  image_url: string | null;
  type: string;
  location: {
    address_line_1?: string | null;
    city?: string | null;
    state?: string | null;
    country: string | null;
  };
  auctioneer: {
    id: number;
    company_name: string;
    avatar: string | null;
    location: {
      address_line_1?: string | null;
      city?: string | null;
      state?: string | null;
      country?: string | null;
    } | null;
    number?: string | null;
    email?: string | null;
    socials?: {
      platform?: string;
      url?: string;
    }[];
  };
  bidding_status: string;
  start_date: string;
  end_date: string;
  registration_status: string | null;
  bid_increments: {
    up_to_amount: number;
    increment: number;
    sort_order: number;
  }[];
  bidding_notice?: string | null;
  shipping_info?: string | null;
  terms_and_condition?: string | null;
  registration_requirements?: RegistrationRequirements;
  featured_lots: {
    id: number;
    lot_number: string;
    image_url: string;
    title: string;
    total_bids: number;
    current_bid: number | null;
  }[];
};

export type AuctionLotsResponse = {
  data: {
    id: number;
    lot_number: string;
    image_url: string;
    title: string;
    description?: string;
    quantity?: number;
    total_bids_count: number;
    starts_at?: string;
    ends_at?: string;
    time_remaining_seconds?: number;
    estimate_low: string | null;
    estimate_high: string | null;
    current_bid: number | null;
    shipping_availability: string | null;
    is_in_watchlist?: boolean;
    next_bid?: number;
    status: string;
    final_price: number | null;
  }[];
  meta: {
    auction_id: number;
    auction_code?: string;
    auction_name?: string;
    auction_status: string;
    registration_status: string | null;
    registration_requirements?: RegistrationRequirements;
    currency?: string;
    bid_visibility?: string;
    bidding?: {
      mode: string;
      allow_proxy: boolean;
      require_proxy: boolean;
      default_amount_type: string;
    };
    buyer_premium_percentage?: number | null;
    effective_open_bidding_at?: string;
    effective_close_bidding_at?: string;
    count?: number;
  };
};

export type AuctionRegistrationPayload = {
  accepted_terms: boolean;
  terms_version: string;
  phone: string;
  max_bid_limit?: number;
  provider?: string;
  return_url?: string;
  payment_method_provider?: string;
  payment_method_ref?: string;
};

export type AuctionRegistrationResponse = {
  message: string;
  registration: {
    id: number;
    auction_id: number;
    user_id: number;
    status: string; // e.g. "pending_deposit"
  };
  approval_option: string;
  deposit?: {
    id: number;
    amount_required: number;
    currency: string;
    status: string;
    provider: string;
    provider_reference: string;
    provider_instructions: {
      provider: string;
      reference: string;
      redirect_url?: string | null;
      authorization_url?: string | null;
      return_url?: string | null;
      amount: number;
      currency: string;
      // stripe-specific
      payment_intent_id?: string;
      client_secret?: string;
      publishable_key?: string;
      // paystack-specific
      access_code?: string;
      callback_url?: string | null;
      message?: string;
    };
  };
};

export type BidPayload = {
  amount: number;
  bid_amount_type?: "fixed_flat" | "maximum_up_to";
  max_amount?: number;
};

export type BidResponse = {
  message: string;
  bid: {
    id: number;
    auction_id: number;
    lot_id: number;
    amount: number;
    status: "accepted" | "pending_approval" | "rejected" | "outbid" | "proxy_active";
    is_proxy: boolean;
    source: string;
  };
};

export type WatchlistResponse = {
  message: string;
  data: {
    lot_id: number;
    watchlist_count: number;
  };
};
