'use client';

import { useState, useMemo } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  MapPin,
  Phone,
  Mail,
  Star,
  Grid3X3,
  List,
  AlertCircle,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Globe
} from "lucide-react";
import AuctionCard from "../auctions/components/AuctionCard";
import Link from "next/link";
import { useIsMobile } from "@/hooks/use-mobile";
import FilterDrawer from "@/components/shared/FilterDrawer";
import { useAuctioneer } from "./hooks/useAuctioneer";
import { useParams } from "next/navigation";
import type { AuctioneerDetailsResponse } from "./types";
import { normalizeBuyerAuctionStatus } from "@/lib/auctionLifecycle";
import { ensureListingImageSources } from "@/lib/listingImageFallbacks";

const ITEMS_PER_PAGE = 12

const statusOptions = [
  { value: "all", label: "All Auctions" },
  { value: "live", label: "Live" },
  { value: "upcoming", label: "Upcoming" },
  { value: "closing_soon", label: "Closing Soon" },
  { value: "closed", label: "Closed" },
];

const SOCIAL_ICON_MAP: Record<string, React.ReactNode> = {
  facebook: <Facebook className="h-4 w-4 sm:h-5 sm:w-5 text-foreground" />,
  twitter: <Twitter className="h-4 w-4 sm:h-5 sm:w-5 text-foreground" />,
  instagram: <Instagram className="h-4 w-4 sm:h-5 sm:w-5 text-foreground" />,
  linkedin: <Linkedin className="h-4 w-4 sm:h-5 sm:w-5 text-foreground" />,
};

const HeaderSkeleton = () => (
  <div className="bg-card border border-border rounded-xl p-4 sm:p-6 md:p-8 mb-6 md:mb-8">
    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
      <div className="h-20 w-20 sm:h-24 sm:w-24 md:h-32 md:w-32 rounded-full bg-muted animate-pulse shrink-0" />
      <div className="flex-1 w-full">
        <div className="h-8 w-48 bg-muted animate-pulse rounded mb-3" />
        <div className="h-4 w-full bg-muted animate-pulse rounded mb-2" />
        <div className="h-4 w-3/4 bg-muted animate-pulse rounded mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-4 w-40 bg-muted animate-pulse rounded" />
          ))}
        </div>
        <div className="flex gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-9 w-9 rounded-full bg-muted animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  </div>
);

const AuctionCardSkeleton = () => (
  <Card className="overflow-hidden">
    <div className="h-48 bg-muted animate-pulse" />
    <div className="p-4 space-y-3">
      <div className="h-5 w-3/4 bg-muted animate-pulse rounded" />
      <div className="h-4 w-1/2 bg-muted animate-pulse rounded" />
      <div className="h-4 w-2/3 bg-muted animate-pulse rounded" />
    </div>
  </Card>
);

const mapAuction = (a: AuctioneerDetailsResponse["data"]["auctions"][number]) => ({
  id: String(a.auction_id),
  title: a.auction_name,
  coverImage: a.feature_image,
  auctioneer: {
    name: a.auctioneer_company_name,
    avatar: "",
  },
  totalLots: a.lot_count,
  startDate: a.auction_start_at,
  endDate: a.auction_end_at,
  description: a.auction_description,
  lotImages: ensureListingImageSources(
    a.featured_lots.map((lot) => lot.image_url),
    "lot"
  ),
   status: normalizeBuyerAuctionStatus(a.status),
  shippingAvailable: a.shipping_availability === "available",
  location: `${a.state}, ${a.country}`,
});


const AuctioneerDetails = () => {
  const { id } = useParams<{ id: string }>();

  const { useAuctioneerDetails } = useAuctioneer(id);
  const [isFavorite, setIsFavorite] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const isMobile = useIsMobile();

  const params = useMemo(() => ({
    ...(statusFilter !== "all" ? { status: statusFilter } : {}),
    per_page: ITEMS_PER_PAGE,
    page: currentPage,
  }), [statusFilter, currentPage]);

  const { data, isLoading, isError } = useAuctioneerDetails(params);

  const auctioneer = data?.data?.auctioneer;
  const auctions = data?.data?.auctions ?? [];
  const pagination = data?.pagination;
  const totalPages = pagination?.last_page ?? 1;

  const activeFilterCount = statusFilter !== "all" ? 1 : 0;

  const handleStatusChange = (value: string) => {
    setStatusFilter(value);
    setCurrentPage(1);
  };

  const FilterContent = (
    <div className="space-y-4">
      <h4 className="text-sm font-medium text-foreground mb-3">Auction Status</h4>
      <div className="flex flex-col gap-2">
        {statusOptions.map(option => (
          <Button key={option.value} variant={statusFilter === option.value ? "default" : "outline"} size="sm" onClick={() => handleStatusChange(option.value)} className="justify-start">
            {option.label}
          </Button>
        ))}
      </div>
    </div>
  );

  if (isError) {
    return (
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
          <div className="h-16 w-16 rounded-full bg-destructive/10 flex items-center justify-center">
            <AlertCircle className="h-8 w-8 text-destructive" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground mb-1">Failed to load auctioneer</h2>
            <p className="text-sm text-muted-foreground max-w-sm">
              Something went wrong while fetching this auctioneer. Please check your connection and try again.
            </p>
          </div>
          <Button onClick={() => window.location.reload()} variant="outline">
            Try again
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 py-6 md:py-8">
      {/* Auctioneer Header */}
      {isLoading ? (
        <HeaderSkeleton />
      ) : (
        <div className="bg-card border border-border rounded-xl p-4 sm:p-6 md:p-8 mb-6 md:mb-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
            <Avatar className="h-20 w-20 sm:h-24 sm:w-24 md:h-32 md:w-32 shrink-0">
              {/* <AvatarImage src={mockAuctioneer.logo} /> */}
              <AvatarFallback className="text-2xl md:text-4xl">{auctioneer?.company_name[0]}</AvatarFallback>
            </Avatar>

            <div className="flex-1 text-center sm:text-left">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3">
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground">{auctioneer?.company_name}</h1>
                <Button variant={isFavorite ? "default" : "outline"} onClick={() => setIsFavorite(!isFavorite)} size="sm" className="w-full sm:w-auto shrink-0">
                  <Star className={`h-4 w-4 mr-2 ${isFavorite ? "fill-current" : ""}`} />
                  {isFavorite ? "Favorited" : "Add to Favorites"}
                </Button>
              </div>

              {auctioneer?.company_bio && (
                <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6">{auctioneer.company_bio}</p>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 mb-4 sm:mb-6">
                {auctioneer?.full_address && (
                  <div className="flex items-start gap-2 sm:gap-3 justify-center sm:justify-start">
                    <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground shrink-0 mt-0.5" />
                    <span className="text-foreground text-sm">{auctioneer.full_address}</span>
                  </div>
                )}
                {auctioneer?.phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                    <Link
                      href={`tel:${auctioneer.phone}`}
                      className="text-foreground hover:text-primary text-sm"
                    >
                      {auctioneer.phone}
                    </Link>
                  </div>
                )}
                {auctioneer?.email && (
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                    <Link
                      href={`mailto:${auctioneer.email}`}
                      className="text-foreground hover:text-primary text-sm"
                    >
                      {auctioneer.email}
                    </Link>
                  </div>
                )}
              </div>

              {/* Social Links */}
              {auctioneer?.socials && auctioneer.socials.length > 0 && (
                <div className="flex gap-2 sm:gap-3 justify-center sm:justify-start">
                  {auctioneer.socials.map((social) => (
                    <Link
                      key={social.platform}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-full bg-muted hover:bg-muted/80 transition-colors"
                    >
                      {SOCIAL_ICON_MAP[social.platform.toLowerCase()] ?? (
                        <Globe className="h-4 w-4 sm:h-5 sm:w-5 text-foreground" />
                      )}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Auctions Section */}
      <div>
        <div className="flex flex-col gap-4 mb-6">
          <h2 className="text-xl md:text-2xl font-bold text-foreground">
            {isLoading ? (
              <div className="h-7 w-56 bg-muted animate-pulse rounded" />
            ) : (
              `Auctions by ${auctioneer?.company_name}`
            )}
          </h2>

          <div className="flex items-center justify-between gap-3">
            {/* Status Filter */}
            {isMobile ? (
              <FilterDrawer title="Filter Auctions" activeFiltersCount={activeFilterCount} onClear={() => handleStatusChange("all")}>
                {FilterContent}
              </FilterDrawer>
            ) : (
              <div className="flex gap-2 flex-wrap">
                {statusOptions.map(option => (
                  <Button key={option.value} variant={statusFilter === option.value ? "default" : "outline"} size="sm" onClick={() => handleStatusChange(option.value)} disabled={isLoading}>
                    {option.label}
                  </Button>
                ))}
              </div>
            )}

            {/* View Toggle */}
            <div className="hidden md:flex border border-border rounded-lg overflow-hidden shrink-0">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 ${viewMode === "grid" ? "bg-primary text-primary-foreground" : "bg-background hover:bg-muted"}`}
              >
                <Grid3X3 className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 ${viewMode === "list" ? "bg-primary text-primary-foreground" : "bg-background hover:bg-muted"}`}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Auctions */}
        {isLoading ? (
          <div className={
            viewMode === "grid"
              ? "grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6"
              : "space-y-4 md:space-y-6"
          }>
            {Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
              <AuctionCardSkeleton key={i} />
            ))}
          </div>
        ) : auctions.length > 0 ? (
          <div className={
            viewMode === "grid"
              ? "grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6"
              : "space-y-4 md:space-y-6"
          }>
            {auctions.map((auction) => (
              <AuctionCard key={auction.auction_id} auction={mapAuction(auction)} viewMode={viewMode} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-card border border-border rounded-xl">
            <p className="text-muted-foreground">No auctions found with the selected status.</p>
          </div>
        )}

        {!isLoading && totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-8">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              <List className="h-4 w-4 rotate-90" />
            </Button>
            <div className="flex gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  size="icon"
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </Button>
              ))}
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              <List className="h-4 w-4 -rotate-90" />
            </Button>
          </div>
        )}
      </div>
    </main>
  );
};

export default AuctioneerDetails;
