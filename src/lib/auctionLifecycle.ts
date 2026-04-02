/**
 * Buyer-facing auction lifecycle — matches DB `auctions.status` values
 * exposed to buyers (excluding draft; completed is treated as ended).
 */
export type AuctionLifecycle = "scheduled" | "live" | "paused" | "closed";

/** Filter / URL values including aggregate "all". */
export type AuctionStatusFilter = "all" | AuctionLifecycle;

const LIFECYCLE: AuctionLifecycle[] = ["scheduled", "live", "paused", "closed"];

function isAuctionLifecycle(s: string): s is AuctionLifecycle {
  return (LIFECYCLE as readonly string[]).includes(s);
}

/**
 * Map API / DB status to buyer lifecycle.
 * - `completed` → `closed` (ended for buyers).
 * - `draft` → `scheduled` (fallback; public listings should not surface draft).
 */
export function normalizeBuyerAuctionStatus(
  raw: string | undefined | null
): AuctionLifecycle {
  const s = (raw ?? "").toLowerCase().trim();
  if (s === "scheduled") return "scheduled";
  if (s === "live") return "live";
  if (s === "paused") return "paused";
  if (s === "closed" || s === "completed") return "closed";
  if (s === "draft") return "scheduled";
  return "scheduled";
}

export function isBuyerAuctionEnded(lifecycle: AuctionLifecycle): boolean {
  return lifecycle === "closed";
}

/** Badge copy aligned with buyer labels (Upcoming / Bidding Open / Paused / Closed). */
export const BUYER_AUCTION_LIFECYCLE_BADGES: Record<
  AuctionLifecycle,
  { label: string; className: string }
> = {
  scheduled: { label: "Upcoming", className: "bg-blue-500 text-white" },
  live: { label: "Bidding Open", className: "bg-emerald-500 text-white" },
  paused: { label: "Paused", className: "bg-amber-500 text-white" },
  closed: { label: "Closed", className: "bg-muted text-muted-foreground" },
};

export function badgeForAuctionLifecycle(
  lifecycle: AuctionLifecycle
): { label: string; className: string } {
  return BUYER_AUCTION_LIFECYCLE_BADGES[lifecycle];
}

/** Parse `?status=` for auctions / lots pages; maps legacy values. */
export function parseAuctionStatusQueryParam(
  param: string | null
): AuctionStatusFilter | null {
  if (!param) return null;
  const p = param.toLowerCase().trim();
  if (p === "all") return "all";
  if (p === "upcoming") return "scheduled";
  if (p === "closing-soon") return "live";
  if (p === "featured" || p === "hot" || p === "top-picks") return "all";
  if (isAuctionLifecycle(p)) return p;
  return null;
}

/**
 * How far before `auction_end_at` we show a “closing soon” hint for **live** auctions only.
 * Not a DB status — combine with {@link isClosingSoon}.
 */
export const CLOSING_SOON_WINDOW_MS = 48 * 60 * 60 * 1000;

/**
 * “Closing soon” is derived, not stored: `lifecycle === "live"` and end time is within
 * {@link CLOSING_SOON_WINDOW_MS} from now (and still in the future).
 */
export function isClosingSoon(
  lifecycle: AuctionLifecycle,
  auctionEndAtIso: string | undefined | null
): boolean {
  if (lifecycle !== "live") return false;
  if (auctionEndAtIso == null || String(auctionEndAtIso).trim() === "")
    return false;
  const end = new Date(auctionEndAtIso).getTime();
  if (Number.isNaN(end)) return false;
  const now = Date.now();
  const diff = end - now;
  return diff > 0 && diff <= CLOSING_SOON_WINDOW_MS;
}
