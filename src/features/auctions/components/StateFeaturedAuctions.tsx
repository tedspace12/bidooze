import Link from "next/link";
import { Clock, TrendingUp, Gavel } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { badgeForAuctionLifecycle, normalizeBuyerAuctionStatus } from "@/lib/auctionLifecycle";
import type { StateFeaturedSlot } from "../types";
import ListingImage from "@/components/shared/listing-image";

const FeaturedSlotSkeleton = () => (
  <Card className="overflow-hidden">
    <div className="h-52 bg-muted animate-pulse" />
    <div className="p-4 space-y-3">
      <div className="h-5 w-3/4 bg-muted animate-pulse rounded" />
      <div className="h-4 w-1/2 bg-muted animate-pulse rounded" />
      <div className="h-8 w-full bg-muted animate-pulse rounded" />
    </div>
  </Card>
);

const FeaturedSlotCard = ({ slot }: { slot: StateFeaturedSlot }) => {
  if (!slot.auction) return null;

  const { auction, highlight_lot } = slot;
  const statusBadge = badgeForAuctionLifecycle(normalizeBuyerAuctionStatus(auction.status));

  return (
    <Link href={`/auction/${auction.auction_id}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow group cursor-pointer h-full">
        {/* Image */}
        <div className="relative h-52 overflow-hidden">
          <ListingImage
            kind="auction"
            src={auction.image_url}
            alt={auction.title}
            width={600}
            height={400}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <Badge className={`absolute top-3 left-3 ${statusBadge.className}`}>
            <TrendingUp className="h-3 w-3 mr-1" />
            {statusBadge.label}
          </Badge>
          <div className="absolute top-3 right-3 bg-background/80 backdrop-blur-sm text-xs font-medium px-2 py-1 rounded-full">
            #{slot.position}
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1 mb-2">
            {auction.title}
          </h3>
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-3">
            <Clock className="h-3.5 w-3.5 shrink-0" />
            {new Date(auction.start_datetime).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
            {" – "}
            {new Date(auction.end_datetime).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
          </div>

          {/* Stats */}
          <div className="flex items-center gap-3 text-sm mb-3">
            <span className="text-muted-foreground">{auction.stats.bid_count} bids</span>
            {auction.stats.highest_bid > 0 && (
              <span className="font-medium text-foreground">
                High: {auction.currency} {auction.stats.highest_bid.toLocaleString()}
              </span>
            )}
          </div>

          {/* Highlight lot */}
          {highlight_lot && (
            <div className="bg-muted/50 rounded-lg p-3 border border-border">
              <div className="flex items-center gap-1.5 mb-1">
                <Gavel className="h-3.5 w-3.5 text-primary" />
                <span className="text-xs font-medium text-primary">Featured Lot</span>
                <span className="text-xs text-muted-foreground ml-auto">{highlight_lot.time_remaining}</span>
              </div>
              <p className="text-sm font-medium text-foreground line-clamp-1">{highlight_lot.title}</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {highlight_lot.bid_count} bids · High bid: {auction.currency} {highlight_lot.highest_bid.toLocaleString()}
              </p>
            </div>
          )}
        </div>
      </Card>
    </Link>
  );
};

interface StateFeaturedAuctionsProps {
  stateCode: string | null;
  stateName: string;
  isLoading: boolean;
  slots: StateFeaturedSlot[];
}

const StateFeaturedAuctions = ({ stateCode, stateName, isLoading, slots }: StateFeaturedAuctionsProps) => {
  const filledSlots = slots.filter((s) => s.auction !== null);

  // Don't render the section at all if loaded and nothing to show
  if (!isLoading && filledSlots.length === 0) return null;

  return (
    <section className="px-4 mt-10">
      <div className="mb-4">
        <h2 className="text-xl md:text-2xl font-bold text-foreground">
          Featured Auctions in {stateName}
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Hand-picked auctions happening right now
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => <FeaturedSlotSkeleton key={i} />)
          : filledSlots.map((slot) => <FeaturedSlotCard key={slot.slot_id} slot={slot} />)}
      </div>
    </section>
  );
};

export default StateFeaturedAuctions;
