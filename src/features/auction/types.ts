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
    minimum?: number;
    maximum?: number | null;
    increment?: number;
  }[];
  bidding_notice?: string | null;
  shipping_info?: string | null;
  terms_and_condition?: string | null;
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
    total_bids_count: number;
    estimate_low: string | null;
    estimate_high: string | null;
    current_bid: number | null;
    shipping_availability: string | null;
    status: string;
    final_price: number | null;
  }[];
  meta: {
    auction_id: number;
    auction_status: string;
    registration_status: string | null;
    currency?: string;
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
