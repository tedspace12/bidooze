export const AUCTION_STATUS_VALUES = ["scheduled", "live", "closed"] as const;
export type AuctionFilterStatus = (typeof AUCTION_STATUS_VALUES)[number];

export const AUCTION_PRESET_VALUES = [
  "live",
  "upcoming",
  "closing_soon",
  "featured",
  "top_picks",
  "hot",
  "closed",
] as const;
export type AuctionPresetStatus = (typeof AUCTION_PRESET_VALUES)[number];

export const SHIPPING_VALUES = [
  "available",
  "pickup-only",
  "not-available",
] as const;
export type ShippingFilterValue = (typeof SHIPPING_VALUES)[number];

export const LOT_TYPE_VALUES = [
  "biddable_lots",
  "live_webcast_lots",
  "online_only_lots",
  "absentee_lots",
  "listing_only_lots",
] as const;
export type LotTypeFilterValue = (typeof LOT_TYPE_VALUES)[number];

export const CATEGORY_MODE_VALUES = ["or", "and"] as const;
export type CategoryModeValue = (typeof CATEGORY_MODE_VALUES)[number];

export const auctionStatusOptions: Array<{
  value: AuctionFilterStatus;
  label: string;
}> = [
  { value: "scheduled", label: "Scheduled" },
  { value: "live", label: "Live" },
  { value: "closed", label: "Closed" },
];

export const auctionPresetOptions: Array<{
  value: AuctionPresetStatus;
  label: string;
}> = [
  { value: "live", label: "Live" },
  { value: "upcoming", label: "Upcoming" },
  { value: "closing_soon", label: "Closing Soon" },
  { value: "featured", label: "Featured" },
  { value: "top_picks", label: "Top Picks" },
  { value: "hot", label: "Hot" },
  { value: "closed", label: "Closed" },
];

export const shippingOptions: Array<{
  value: ShippingFilterValue;
  label: string;
}> = [
  { value: "available", label: "Shipping available" },
  { value: "pickup-only", label: "Pickup only" },
];

export const lotTypeOptions: Array<{
  value: LotTypeFilterValue;
  label: string;
}> = [
  { value: "biddable_lots", label: "Biddable lots" },
  { value: "live_webcast_lots", label: "Live webcast lots" },
  { value: "online_only_lots", label: "Online-only lots" },
  { value: "absentee_lots", label: "Absentee lots" },
  { value: "listing_only_lots", label: "Listing-only lots" },
];

export const categoryModeOptions: Array<{
  value: CategoryModeValue;
  label: string;
}> = [
  { value: "or", label: "Match any selected category" },
  { value: "and", label: "Match all selected categories" },
];

const AUCTION_STATUS_SET = new Set<string>(AUCTION_STATUS_VALUES);
const AUCTION_PRESET_SET = new Set<string>(AUCTION_PRESET_VALUES);
const SHIPPING_SET = new Set<string>(SHIPPING_VALUES);
const LOT_TYPE_SET = new Set<string>(LOT_TYPE_VALUES);
const CATEGORY_MODE_SET = new Set<string>(CATEGORY_MODE_VALUES);

const normalize = (value: string | null | undefined) =>
  (value ?? "").trim().toLowerCase();

export const uniqueStrings = <T extends string>(values: T[]): T[] =>
  Array.from(new Set(values));

export function normalizeAuctionStatusValue(
  value: string | null | undefined
): AuctionFilterStatus | null {
  const normalized = normalize(value);
  return AUCTION_STATUS_SET.has(normalized)
    ? (normalized as AuctionFilterStatus)
    : null;
}

export function normalizeAuctionPresetValue(
  value: string | null | undefined
): AuctionPresetStatus | null {
  const normalized = normalize(value).replace(/-/g, "_");
  return AUCTION_PRESET_SET.has(normalized)
    ? (normalized as AuctionPresetStatus)
    : null;
}

export function normalizeLegacyStatusPreset(
  value: string | null | undefined
): AuctionPresetStatus | null {
  const normalized = normalize(value).replace(/-/g, "_");

  switch (normalized) {
    case "upcoming":
      return "upcoming";
    case "closing_soon":
      return "closing_soon";
    case "featured":
      return "featured";
    case "top_picks":
      return "top_picks";
    case "hot":
      return "hot";
    default:
      return null;
  }
}

export function normalizeShippingValue(
  value: string | null | undefined
): ShippingFilterValue | null {
  const normalized = normalize(value).replace(/_/g, "-");

  switch (normalized) {
    case "shipping":
      return "available";
    case "pickup":
      return "pickup-only";
    default:
      return SHIPPING_SET.has(normalized)
        ? (normalized as ShippingFilterValue)
        : null;
  }
}

export function normalizeLotTypeValue(
  value: string | null | undefined
): LotTypeFilterValue | null {
  const normalized = normalize(value).replace(/-/g, "_");

  switch (normalized) {
    case "biddable":
      return "biddable_lots";
    case "webcast":
    case "live_webcast":
      return "live_webcast_lots";
    case "online_only":
      return "online_only_lots";
    case "absentee":
      return "absentee_lots";
    case "listing_only":
      return "listing_only_lots";
    default:
      return LOT_TYPE_SET.has(normalized)
        ? (normalized as LotTypeFilterValue)
        : null;
  }
}

export function normalizeCategoryModeValue(
  value: string | null | undefined
): CategoryModeValue | null {
  const normalized = normalize(value);
  return CATEGORY_MODE_SET.has(normalized)
    ? (normalized as CategoryModeValue)
    : null;
}

export function parseBooleanQueryValue(
  value: string | null | undefined
): boolean {
  const normalized = normalize(value);
  return normalized === "1" || normalized === "true" || normalized === "yes";
}

export function toLocalDateTimeInputValue(
  isoValue: string | null | undefined
): string {
  if (!isoValue) return "";

  const parsed = new Date(isoValue);
  if (Number.isNaN(parsed.getTime())) return "";

  const localTime = new Date(parsed.getTime() - parsed.getTimezoneOffset() * 60000);
  return localTime.toISOString().slice(0, 16);
}

export function toIsoDateTimeQueryValue(
  localValue: string | null | undefined
): string | undefined {
  if (!localValue) return undefined;

  const parsed = new Date(localValue);
  if (Number.isNaN(parsed.getTime())) return undefined;

  return parsed.toISOString();
}
