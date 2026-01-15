export type AuctionStatus =
  | "all"
  | "live"
  | "upcoming"
  | "closing-soon"
  | "featured"
  | "top-picks"
  | "hot"
  | "closed";
export type AuctionCardStatus =
  | "live"
  | "upcoming"
  | "closing-soon"
  | "featured"
  | "top-picks"
  | "hot"
  | "closed";

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
      feature_image_url: string;
      auctioneer: {
        id: number;
        company_name: string;
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
      }[];
    }
  ];
  pagination: {
    total: number;
  };
}
