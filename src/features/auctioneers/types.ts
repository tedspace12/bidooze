interface Location {
  state: string | null;
  country: string | null;
}

interface Company {
  id: number;
  company_name: string;
  location: Location;
  is_favourite: boolean;
  auctions_count: number;
  avatar_url: string | null;
}

interface Pagination {
  total: number;
  per_page: number;
  current_page: number;
  last_page: number;
}

export interface AuctioneerResponse {
  data: Company[];
  pagination: Pagination;
}

export type AuctioneerDetailsResponse = {
  data: {
    auctioneer: {
      id: number;
      company_name: string;
      company_bio: string | null;
      full_address: string | null;
      phone: string | null;
      email: string | null;
      socials: { platform: string; url: string }[];
      is_favourite: boolean;
    };
    auctions: {
      auction_id: number;
      auction_name: string;
      auctioneer_company_name: string;
      auction_description: string;
      auction_start_at: string;
      auction_end_at: string;
      status: string;
      feature_image: string;
      lot_count: number;
      state: string;
      country: string;
      shipping_availability: string;
      registration_status: string | null;
      featured_lots: {
        lot_id: number;
        lot_number: string;
        title: string;
        status: string;
        current_bid: string | null;
        estimate_low: string;
        estimate_high: string;
        image_url: string;
      }[];
    }[];
  };
  pagination: Pagination;
};