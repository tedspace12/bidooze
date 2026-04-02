import { format } from "date-fns";
import type { DateRange } from "react-day-picker";
import type {
  AuctionFilterStatus,
  AuctionPresetStatus,
  CategoryModeValue,
  LotTypeFilterValue,
  ShippingFilterValue,
} from "@/lib/publicAuctionFilters";
import {
  normalizeAuctionPresetValue,
  normalizeAuctionStatusValue,
  normalizeCategoryModeValue,
  normalizeLegacyStatusPreset,
  normalizeLotTypeValue,
  normalizeShippingValue,
  parseBooleanQueryValue,
  toIsoDateTimeQueryValue,
  toLocalDateTimeInputValue,
  uniqueStrings,
} from "@/lib/publicAuctionFilters";

type SearchParamsLike = {
  get(name: string): string | null;
  getAll(name: string): string[];
};

export type ListingDateRange = DateRange;

export type ListingFiltersState = {
  search: string;
  status: AuctionFilterStatus[];
  auctionStatus: AuctionPresetStatus[];
  closingSoonHours: string;
  shipping: ShippingFilterValue[];
  dateRange: ListingDateRange | null;
  startsAfter: string;
  endsBefore: string;
  categories: string[];
  categoryMode: CategoryModeValue;
  lotType: LotTypeFilterValue[];
  state: string;
  country: string;
  zipCode: string;
  city: string;
  currency: string;
  activeOnly: boolean;
  archived: boolean;
};

export function getDefaultListingFilters(): ListingFiltersState {
  return {
    search: "",
    status: [],
    auctionStatus: [],
    closingSoonHours: "",
    shipping: [],
    dateRange: null,
    startsAfter: "",
    endsBefore: "",
    categories: [],
    categoryMode: "or",
    lotType: [],
    state: "all",
    country: "all",
    zipCode: "",
    city: "",
    currency: "",
    activeOnly: false,
    archived: false,
  };
}

const splitValues = (rawValues: string[]) =>
  rawValues
    .flatMap((value) => value.split(","))
    .map((value) => value.trim())
    .filter(Boolean);

const getQueryValues = (searchParams: SearchParamsLike, key: string) => {
  const allValues = searchParams.getAll(key);
  if (allValues.length > 0) return splitValues(allValues);

  const singleValue = searchParams.get(key);
  return singleValue ? splitValues([singleValue]) : [];
};

const normalizeCodeFilter = (value: string | null, fallback = "all") => {
  const normalized = value?.trim().toUpperCase() ?? "";
  return !normalized || normalized === "ALL" ? fallback : normalized;
};

const parseDateOnly = (value: string | null) => {
  if (!value) return undefined;

  const [year, month, day] = value.split("-").map(Number);
  if (!year || !month || !day) return undefined;

  const parsed = new Date(year, month - 1, day);
  return Number.isNaN(parsed.getTime()) ? undefined : parsed;
};

const encodeSingleOrArray = <T extends string>(values: T[]) =>
  values.length === 1 ? values[0] : values;

export function createListingFiltersFromSearchParams(
  searchParams: SearchParamsLike
): ListingFiltersState {
  const defaults = getDefaultListingFilters();

  const rawStatusValues = getQueryValues(searchParams, "status");
  const explicitAuctionStatusValues = getQueryValues(searchParams, "auction_status");
  const categories = uniqueStrings([
    ...getQueryValues(searchParams, "category"),
    ...getQueryValues(searchParams, "categories"),
  ]);

  const status = uniqueStrings(
    rawStatusValues
      .map((value) => normalizeAuctionStatusValue(value))
      .filter((value): value is AuctionFilterStatus => value != null)
  );

  const auctionStatus = uniqueStrings(
    [...rawStatusValues, ...explicitAuctionStatusValues]
      .map((value) => {
        const normalizedPreset = normalizeAuctionPresetValue(value);
        return normalizedPreset ?? normalizeLegacyStatusPreset(value);
      })
      .filter((value): value is AuctionPresetStatus => value != null)
  );

  const lotType = uniqueStrings(
    [...getQueryValues(searchParams, "lot_type"), ...getQueryValues(searchParams, "lotType")]
      .map((value) => normalizeLotTypeValue(value))
      .filter((value): value is LotTypeFilterValue => value != null)
  );

  const shipping = uniqueStrings(
    getQueryValues(searchParams, "shipping")
      .map((value) => normalizeShippingValue(value))
      .filter((value): value is ShippingFilterValue => value != null)
  );

  const dateFrom = parseDateOnly(searchParams.get("date_from"));
  const dateTo = parseDateOnly(searchParams.get("date_to"));

  const country =
    normalizeCodeFilter(searchParams.get("country"), "") ||
    (searchParams.get("state")?.includes("-")
      ? searchParams.get("state")!.split("-")[0].toUpperCase()
      : defaults.country);

  return {
    search: searchParams.get("search")?.trim() ?? defaults.search,
    status,
    auctionStatus,
    closingSoonHours:
      searchParams.get("closing_soon_hours")?.trim() ?? defaults.closingSoonHours,
    shipping,
    dateRange: dateFrom || dateTo ? { from: dateFrom, to: dateTo } : defaults.dateRange,
    startsAfter: toLocalDateTimeInputValue(searchParams.get("starts_after")),
    endsBefore: toLocalDateTimeInputValue(searchParams.get("ends_before")),
    categories,
    categoryMode:
      normalizeCategoryModeValue(searchParams.get("category_mode")) ??
      defaults.categoryMode,
    lotType,
    state: normalizeCodeFilter(searchParams.get("state"), defaults.state),
    country,
    zipCode: searchParams.get("zip_code")?.trim() ?? defaults.zipCode,
    city: searchParams.get("city")?.trim() ?? defaults.city,
    currency: searchParams.get("currency")?.trim().toUpperCase() ?? defaults.currency,
    activeOnly: parseBooleanQueryValue(searchParams.get("active_only")),
    archived: parseBooleanQueryValue(searchParams.get("archived")),
  };
}

export function countActiveListingFilters(filters: ListingFiltersState): number {
  let count = 0;

  if (filters.search.trim()) count++;
  if (filters.country !== "all") count++;
  if (filters.state !== "all") count++;
  if (filters.city.trim()) count++;
  if (filters.zipCode.trim()) count++;
  if (filters.currency.trim()) count++;
  if (filters.status.length > 0) count++;
  if (filters.auctionStatus.length > 0) count++;
  if (
    filters.auctionStatus.includes("closing_soon") &&
    filters.closingSoonHours.trim()
  ) {
    count++;
  }
  if (filters.shipping.length > 0) count++;
  if (filters.dateRange?.from || filters.dateRange?.to) count++;
  if (filters.startsAfter) count++;
  if (filters.endsBefore) count++;
  if (filters.categories.length > 0) count += filters.categories.length;
  if (filters.categories.length > 1 && filters.categoryMode !== "or") count++;
  if (filters.lotType.length > 0) count++;
  if (filters.activeOnly) count++;
  if (filters.archived) count++;

  return count;
}

export function buildAuctionListQueryParams(
  filters: ListingFiltersState
): Record<string, unknown> {
  const out: Record<string, unknown> = {};

  const search = filters.search.trim();
  if (search) out.search = search;

  if (filters.status.length > 0) {
    out.status = encodeSingleOrArray(filters.status);
  }

  if (filters.auctionStatus.length > 0) {
    out.auction_status = encodeSingleOrArray(filters.auctionStatus);

    if (filters.auctionStatus.includes("closing_soon")) {
      const closingSoonHours = Number.parseInt(filters.closingSoonHours, 10);
      if (Number.isFinite(closingSoonHours) && closingSoonHours > 0) {
        out.closing_soon_hours = closingSoonHours;
      }
    }
  }

  if (filters.currency.trim()) out.currency = filters.currency.trim().toUpperCase();
  if (filters.country !== "all") out.country = filters.country;
  if (filters.state !== "all") out.state = filters.state;
  if (filters.zipCode.trim()) out.zip_code = filters.zipCode.trim();
  if (filters.city.trim()) out.city = filters.city.trim();

  if (filters.shipping.length > 0) {
    out.shipping = encodeSingleOrArray(filters.shipping);
  }

  if (filters.dateRange?.from) {
    out.date_from = format(filters.dateRange.from, "yyyy-MM-dd");
  }
  if (filters.dateRange?.to) {
    out.date_to = format(filters.dateRange.to, "yyyy-MM-dd");
  }

  const startsAfter = toIsoDateTimeQueryValue(filters.startsAfter);
  if (startsAfter) out.starts_after = startsAfter;

  const endsBefore = toIsoDateTimeQueryValue(filters.endsBefore);
  if (endsBefore) out.ends_before = endsBefore;

  if (filters.categories.length === 1) {
    out.category = filters.categories[0];
  }

  if (filters.categories.length > 1) {
    out.categories = filters.categories;
    out.category_mode = filters.categoryMode;
  }

  if (filters.lotType.length > 0) {
    out.lot_type = encodeSingleOrArray(filters.lotType);
  }

  if (filters.activeOnly) out.active_only = true;
  if (filters.archived) out.archived = true;

  return out;
}

export function buildLotsListQueryParams(
  filters: ListingFiltersState
): Record<string, unknown> {
  return buildAuctionListQueryParams(filters);
}
