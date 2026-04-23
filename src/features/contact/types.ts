export type ContactReason =
  | "general_inquiry"
  | "auction_support"
  | "bidding_issue"
  | "account_help"
  | "partnership_selling"
  | "feedback";

export type ContactPayload = {
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  reason: ContactReason;
  message: string;
};

export type ContactResponse = {
  message: string;
};
