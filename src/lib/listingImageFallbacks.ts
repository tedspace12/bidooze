export type ListingImageKind = "auction" | "lot";

export const AUCTION_FALLBACK_IMAGE = "/images/hero-auction-1.jpg";
export const LOT_FALLBACK_IMAGE = "/images/category-art.jpg";

const normalizeImageSrc = (src: string | null | undefined): string =>
  typeof src === "string" ? src.trim() : "";

export const getListingImageFallback = (kind: ListingImageKind): string =>
  kind === "auction" ? AUCTION_FALLBACK_IMAGE : LOT_FALLBACK_IMAGE;

export const resolveListingImageSrc = (
  src: string | null | undefined,
  kind: ListingImageKind
): string => {
  const normalized = normalizeImageSrc(src);

  return normalized.length > 0
    ? normalized
    : getListingImageFallback(kind);
};

export const ensureListingImageSources = (
  sources: Array<string | null | undefined>,
  kind: ListingImageKind
): string[] => {
  const uniqueSources = Array.from(
    new Set(
      sources
        .map(normalizeImageSrc)
        .filter((src) => src.length > 0)
    )
  );

  return uniqueSources.length > 0
    ? uniqueSources
    : [getListingImageFallback(kind)];
};
