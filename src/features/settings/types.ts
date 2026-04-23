export interface BuyerNotificationSettings {
  outbid: boolean;
  winAuction: boolean;
  auctionEndingSoon: boolean;
  watchedPriceChange: boolean;
  watchedClosingSoon: boolean;
  registeredReminders: boolean;
  auctionsStartingSoon: boolean;
  dailySummary: boolean;
  paymentStatus: boolean;
  securityUpdates: boolean;
  policyUpdates: boolean;
  productUpdates: boolean;
  newRecommendations: boolean;
  promotions: boolean;
}

export const defaultBuyerNotificationSettings: BuyerNotificationSettings = {
  outbid: true,
  winAuction: true,
  auctionEndingSoon: true,
  watchedPriceChange: false,
  watchedClosingSoon: true,
  registeredReminders: true,
  auctionsStartingSoon: true,
  dailySummary: false,
  paymentStatus: true,
  securityUpdates: true,
  policyUpdates: true,
  productUpdates: false,
  newRecommendations: true,
  promotions: false,
};

export interface BuyerSettingsResponse {
  data: BuyerNotificationSettings;
}

export type BuyerSettingsUpdatePayload = Partial<BuyerNotificationSettings>;
