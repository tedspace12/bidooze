'use client';

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Grid3x3,
  List,
  Search,
  Heart,
  Clock,
  DollarSign,
  Package,
  AlertCircle,
  RefreshCw,
  Eye,
  EyeOff
} from "lucide-react";
import { useBids } from "./hooks/useBids";
import LotCard from "../auction/components/LotCard";
import { normalizeBuyerAuctionStatus } from "@/lib/auctionLifecycle";
import { ensureListingImageSources } from "@/lib/listingImageFallbacks";
import { register } from "module";

const Watchlist = () => {
  const { useWatchlist } = useBids();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("added-newest");

  const watchlistQuery = useWatchlist(20);

  const handleRefresh = () => {
    watchlistQuery.refetch();
  };

  const filteredAndSortedItems = (watchlistQuery.data?.data || [])
    .filter(item =>
      item.lot.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.auction.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "added-newest":
          return new Date(b.added_at).getTime() - new Date(a.added_at).getTime();
        case "added-oldest":
          return new Date(a.added_at).getTime() - new Date(b.added_at).getTime();
        case "price-low":
          return (a.lot.current_bid || 0) - (b.lot.current_bid || 0);
        case "price-high":
          return (b.lot.current_bid || 0) - (a.lot.current_bid || 0);
        case "ending-soon":
          return new Date(a.auction.auction_end_at).getTime() - new Date(b.auction.auction_end_at).getTime();
        default:
          return 0;
      }
    });

  const mappedItems = filteredAndSortedItems.map(item => ({
    id: String(item.lot.id),
    lotNumber: parseInt(item.lot.lot_number),
    title: item.lot.title,
    image: item.lot.image_url,
    currentBid: item.lot.current_bid || 0,
    estimateLow: parseFloat(item.lot.estimate_low),
    estimateHigh: parseFloat(item.lot.estimate_high),
    bids: item.lot.bid_count,
    status: item.lot.status as "open" | "closed",
    timeRemaining: item.lot.ends_at ? `${Math.floor((new Date(item.lot.ends_at).getTime() - Date.now()) / (1000 * 60 * 60))}h ${Math.floor(((new Date(item.lot.ends_at).getTime() - Date.now()) % (1000 * 60 * 60)) / (1000 * 60))}m` : "N/A",
    maxBid: item.lot.max_bid || 0,
    shippingAvailable: item.auction.shipping_availability === "available",
    auctionId: String(item.auction.id),
    auctionName: item.auction.name,
    registrationStatus: item.auction.registration_status || null,
    isInWatchlist: true,
  }));

  if (watchlistQuery.isLoading) {
    return (
      <main className="container mx-auto px-4 py-6 md:py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">My Watchlist</h1>
            <p className="text-muted-foreground">Keep track of lots you're interested in</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <div className="aspect-6/3 md:aspect-4/3 bg-muted animate-pulse" />
              <div className="p-4 space-y-3">
                <div className="h-4 bg-muted animate-pulse rounded" />
                <div className="h-3 bg-muted animate-pulse rounded w-3/4" />
                <div className="h-3 bg-muted animate-pulse rounded w-1/2" />
                <div className="flex gap-2">
                  <div className="h-6 bg-muted animate-pulse rounded w-16" />
                  <div className="h-6 bg-muted animate-pulse rounded w-20" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </main>
    );
  }

  if (watchlistQuery.isError) {
    return (
      <main className="container mx-auto px-4 py-6 md:py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">My Watchlist</h1>
            <p className="text-muted-foreground">Keep track of lots you're interested in</p>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center py-24 gap-6 text-center">
          <div className="h-24 w-24 rounded-full bg-destructive/10 flex items-center justify-center">
            <AlertCircle className="h-12 w-12 text-destructive" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-foreground">Unable to load watchlist</h2>
            <p className="text-muted-foreground max-w-md">
              We couldn't load your watchlist right now. This might be due to a connection issue or server problem.
            </p>
          </div>
          <div className="flex gap-3">
            <Button onClick={handleRefresh} variant="outline" className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Try again
            </Button>
            <Button onClick={() => window.location.reload()} variant="default">
              Reload page
            </Button>
          </div>
        </div>
      </main>
    );
  }

  if (!watchlistQuery.data?.data || watchlistQuery.data.data.length === 0) {
    return (
      <main className="container mx-auto px-4 py-6 md:py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">My Watchlist</h1>
            <p className="text-muted-foreground">Keep track of lots you're interested in</p>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center py-24 gap-6 text-center">
          <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center">
            <Heart className="h-12 w-12 text-muted-foreground" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-foreground">Your watchlist is empty</h2>
            <p className="text-muted-foreground max-w-md">
              Start building your watchlist by clicking the heart icon on lots you're interested in.
              You'll be notified of updates and can easily track items you want to bid on.
            </p>
          </div>
          <Button onClick={() => window.location.href = '/auctions'} className="gap-2">
            <Search className="h-4 w-4" />
            Browse Auctions
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 py-6 md:py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">My Watchlist</h1>
          <p className="text-muted-foreground">
            {watchlistQuery.data.pagination.total} lots saved • Updated just now
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={handleRefresh} className="gap-2">
          <RefreshCw className="h-4 w-4" />
          Refresh
        </Button>
      </div>

      {/* Filters and Controls */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search watchlist..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-full sm:w-45">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="added-newest">Recently Added</SelectItem>
            <SelectItem value="added-oldest">Oldest First</SelectItem>
            <SelectItem value="price-low">Price: Low to High</SelectItem>
            <SelectItem value="price-high">Price: High to Low</SelectItem>
            <SelectItem value="ending-soon">Ending Soon</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex border border-border rounded-lg overflow-hidden">
          <Button
            variant={viewMode === "grid" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setViewMode("grid")}
            className="rounded-none"
          >
            <Grid3x3 className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === "list" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setViewMode("list")}
            className="rounded-none"
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Results Summary */}
      <div className="flex items-center justify-between mb-6 text-sm text-muted-foreground">
        <span>Showing {mappedItems.length} of {watchlistQuery.data.pagination.total} lots</span>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <Heart className="h-4 w-4 text-red-500 fill-current" />
            {mappedItems.filter(item => item.isInWatchlist).length} in watchlist
          </span>
        </div>
      </div>

      {/* Watchlist Items */}
      <div className={viewMode === "grid"
        ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        : "space-y-4"
      }>
        {mappedItems.map((item) => (
          <LotCard
            key={item.id}
            lot={item}
            viewMode={viewMode}
            isRegistered={item.registrationStatus === "approved"}
            auctionId={item.auctionId}
          />
        ))}
      </div>

      {/* Pagination would go here if needed */}
      {watchlistQuery.data.pagination.last_page > 1 && (
        <div className="flex justify-center mt-8">
          <div className="text-sm text-muted-foreground">
            Page {watchlistQuery.data.pagination.current_page} of {watchlistQuery.data.pagination.last_page}
          </div>
        </div>
      )}
    </main>
  );
};

export default Watchlist;