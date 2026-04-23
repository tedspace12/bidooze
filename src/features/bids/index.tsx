'use client';
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Grid3x3, List, Search, ArrowUpDown, Grid3X3 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import LotCard from "../auction/components/LotCard";
import AuctionCard from "../auctions/components/AuctionCard";
import AuctionGroupHeader from "./components/AuctionGroupHeader";
import BidsFilters from "./components/BidsFilters";
import BidsSummary from "./components/BidsSummary";
import FilterDrawer from "@/components/shared/FilterDrawer";
import { useBids } from "./hooks/useBids";
import { AuctionCardStatus } from "../auctions/types";
import { BidsListSkeleton, MyAuctionsTabSkeleton, MyBidsTabSkeleton } from "./components/BidsSkeletons";
import { ErrorState, EmptyState } from "./components/BidsStates";

const Bids = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { useBidsSummary, useBidsGrouped, useBidsTopPicks, useBidsRegisteredAuctions } = useBids();

    const [activeTab, setActiveTab] = useState(searchParams.get("tab") || "my-bids");
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
    const [auctionViewMode, setAuctionViewMode] = useState<"grid" | "list">("grid");
    const [sortBy, setSortBy] = useState("ending-soonest");
    const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
    const [auctionSearch, setAuctionSearch] = useState("");
    const [auctioneerFilter, setAuctioneerFilter] = useState("all");

    // My Bids filters
    const [auctionFilter, setAuctionFilter] = useState("all");
    const [statusFilter, setStatusFilter] = useState("all");
    const [groupByAuction, setGroupByAuction] = useState(true);
    const [hideClosedLots, setHideClosedLots] = useState(false);
    const [pastBidsFilter, setPastBidsFilter] = useState("3");

    // API calls
    const bidsSummaryQuery = useBidsSummary();
    const bidsGroupedQuery = useBidsGrouped();
    const bidsTopPicksQuery = useBidsTopPicks(8);
    const bidsRegisteredAuctionsQuery = useBidsRegisteredAuctions();

    useEffect(() => {
        router.push(`/bids?tab=${activeTab}`);
    }, [activeTab, router]);

    const handleRefresh = () => {
        bidsSummaryQuery.refetch();
        bidsGroupedQuery.refetch();
        bidsTopPicksQuery.refetch();
        bidsRegisteredAuctionsQuery.refetch();
    };

    // Map API data to component format
    const mappedStats = bidsSummaryQuery.data ? {
        winningHighBid: bidsSummaryQuery.data.winning_now,
        winningMaxBid: bidsSummaryQuery.data.winning_breakdown.auto,
        winning: bidsSummaryQuery.data.winning_now,
        total_bids: bidsSummaryQuery.data.total_bids,
        losingDeclined: bidsSummaryQuery.data.outbid,
        watched: bidsSummaryQuery.data.watchlist_count,
        winningBreakdown: bidsSummaryQuery.data.winning_breakdown,
        wonLots: bidsSummaryQuery.data.won_lots,
        lostLots: bidsSummaryQuery.data.lost_lots,
    } : null;

    // Map registered auctions to component format
    const mappedRegisteredAuctions = bidsRegisteredAuctionsQuery.data?.data.map((regAuction) => ({
        id: String(regAuction.auction.auction_id),
        title: regAuction.auction.auction_name,
        coverImage: regAuction.auction.cover_image?.image_url || "",
        auctioneer: { name: regAuction.auction.auctioneer_company_name, avatar: "" },
        totalLots: 0, // API doesn't provide total lots
        startDate: regAuction.auction.auction_start_at,
        endDate: regAuction.auction.auction_end_at,
        description: regAuction.auction.description || "",
        lotImages: regAuction.auction.lot_images?.map((img) => img.image_url) || [],
        status: regAuction.auction.status as AuctionCardStatus,
        shippingAvailable: regAuction.auction.shipping_availability === "available",
        location: `${regAuction.auction.location?.address}, ${regAuction.auction.location?.city}, ${regAuction.auction.location?.state}`,
        registrationStatus: regAuction.registration_status,
        currency: regAuction.auction.currency,
    })) || [];

    const filteredAuctions = mappedRegisteredAuctions.filter(auction => {
        if (auctionSearch && !auction.title.toLowerCase().includes(auctionSearch.toLowerCase())) {
            return false;
        }
        if (auctioneerFilter !== "all" && auction.auctioneer.name !== auctioneerFilter) {
            return false;
        }
        return true;
    });

    const uniqueAuctioneers = [...new Set(mappedRegisteredAuctions.map(a => a.auctioneer.name))];

    const isMyBidsLoading = bidsSummaryQuery.isLoading || bidsGroupedQuery.isLoading;
    const isMyBidsError = bidsSummaryQuery.isError || bidsGroupedQuery.isError;
    const isMyAuctionsLoading = bidsRegisteredAuctionsQuery.isLoading;
    const isMyAuctionsError = bidsRegisteredAuctionsQuery.isError;

    // Map grouped bids to component format
    const mappedAuctionGroups = bidsGroupedQuery.data?.data.map((group) => ({
        id: String(group.auction.auction_id),
        title: group.auction.auction_name,
        auctioneer: { name: group.auction.auction_house_company_name, avatar: "" },
        date: group.auction.auction_end_at,
        lots: group.lots.map((lot) => ({
            id: String(lot.lot_id),
            lotNumber: parseInt(lot.lot_number),
            title: lot.title,
            image: lot.images?.[0] || "",
            currentBid: lot.current_bid || 0,
            estimateLow: parseFloat(lot.estimate_low),
            estimateHigh: parseFloat(lot.estimate_high),
            bids: lot.lot_bid_count,
            status: lot.status as "open" | "closed",
            timeRemaining: lot.time_remaining_seconds ? `${Math.floor(lot.time_remaining_seconds / 3600)}h ${Math.floor((lot.time_remaining_seconds % 3600) / 60)}m` : "N/A",
            maxBid: lot.user_max_bid || 0,
            nextBid: lot.next_bid || undefined,
            isInWatchlist: lot.is_in_watchlist,
            shippingAvailable: group.auction.shipping_availability === "available",
            auctionId: String(group.auction.auction_id),
            auctionName: group.auction.auction_name,
        })),
    })) || [];

    // Map top picks to component format
    const mappedTopPicks = bidsTopPicksQuery.data?.data.map((pick) => ({
        id: String(pick.lot_id),
        lotNumber: parseInt(pick.lot_number),
        title: pick.title,
        image: pick.image_url || "",
        currentBid: pick.current_bid || 0,
        estimateLow: parseFloat(pick.estimate_low),
        estimateHigh: parseFloat(pick.estimate_high),
        bids: pick.bid_count,
        status: pick.status as "open" | "closed",
        timeRemaining: pick.time_remaining_seconds ? `${Math.floor(pick.time_remaining_seconds / 3600)}h ${Math.floor((pick.time_remaining_seconds % 3600) / 60)}m` : "N/A",
        maxBid: pick.max_bid || 0,
        nextBid: pick.next_bid || undefined,
        isInWatchlist: pick.is_in_watchlist,
        shippingAvailable: pick.auction.shipping_availability === "available",
        auctionId: String(pick.auction.auction_id),
        auctionName: pick.auction.auction_name,
        isRegistered: !!(pick.auction as { registration_status?: string | null }).registration_status,
    })) || [];

    const activeFiltersCount =
        (auctionFilter !== "all" ? 1 : 0) +
        (statusFilter !== "all" ? 1 : 0) +
        (hideClosedLots ? 1 : 0);

    const clearFilters = () => {
        setAuctionFilter("all");
        setStatusFilter("all");
        setGroupByAuction(true);
        setHideClosedLots(false);
        setPastBidsFilter("3");
    };

    return (
        <main className="container mx-auto px-4 py-6 md:py-8">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-4 md:mb-6">My Bids & Activity</h1>

            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="mb-4 md:mb-6 w-full sm:w-auto overflow-x-auto">
                    <TabsTrigger value="my-bids" className="text-xs sm:text-sm">My Bids</TabsTrigger>
                    <TabsTrigger value="top-picks" className="text-xs sm:text-sm">Top Picks</TabsTrigger>
                    <TabsTrigger value="my-auctions" className="text-xs sm:text-sm">My Auctions</TabsTrigger>
                </TabsList>

                {/* MY BIDS TAB */}
                <TabsContent value="my-bids">
                    {isMyBidsLoading && <MyBidsTabSkeleton viewMode={viewMode} />}
                    {isMyBidsError && (
                        <ErrorState
                            title="Failed to Load My Bids"
                            message="We couldn't load your bids dashboard. Please check your connection and try again."
                            onRetry={() => {
                                bidsSummaryQuery.refetch();
                                bidsGroupedQuery.refetch();
                            }}
                        />
                    )}
                    {!isMyBidsLoading && !isMyBidsError && mappedStats && (
                        <BidsSummary stats={mappedStats} onRefresh={handleRefresh} />
                    )}

                    {/* Bids List */}
                    {!isMyBidsLoading && !isMyBidsError && mappedAuctionGroups.length === 0 && (
                        <EmptyState
                            title="No Bids Found"
                            message="You haven't placed any bids yet. Browse auctions to find items you're interested in."
                            actionLabel="Browse Auctions"
                            actionHref="/auctions"
                        />
                    )}
                    {!isMyBidsLoading && !isMyBidsError && mappedAuctionGroups.length > 0 && (
                        <>
                            <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
                                {/* Mobile Filter Button */}
                                <div className="lg:hidden">
                                    <FilterDrawer
                                        title="Filter Bids"
                                        activeFiltersCount={activeFiltersCount}
                                        onClear={clearFilters}
                                    >
                                        <BidsFilters
                                            auctionFilter={auctionFilter}
                                            statusFilter={statusFilter}
                                            groupByAuction={groupByAuction}
                                            hideClosedLots={hideClosedLots}
                                            pastBidsFilter={pastBidsFilter}
                                            onAuctionFilterChange={setAuctionFilter}
                                            onStatusFilterChange={setStatusFilter}
                                            onGroupByAuctionChange={setGroupByAuction}
                                            onHideClosedLotsChange={setHideClosedLots}
                                            onPastBidsFilterChange={setPastBidsFilter}
                                        />
                                    </FilterDrawer>
                                </div>

                                {/* Desktop Sidebar Filters */}
                                <aside className="hidden w-64 shrink-0 lg:block">
                                    <div className="bg-card border border-border rounded-lg p-4">
                                        <h3 className="font-semibold mb-4">Filters</h3>
                                        <BidsFilters
                                            auctionFilter={auctionFilter}
                                            statusFilter={statusFilter}
                                            groupByAuction={groupByAuction}
                                            hideClosedLots={hideClosedLots}
                                            pastBidsFilter={pastBidsFilter}
                                            onAuctionFilterChange={setAuctionFilter}
                                            onStatusFilterChange={setStatusFilter}
                                            onGroupByAuctionChange={setGroupByAuction}
                                            onHideClosedLotsChange={setHideClosedLots}
                                            onPastBidsFilterChange={setPastBidsFilter}
                                        />
                                    </div>
                                </aside>

                                {/* Main Content */}
                                <div className="flex-1">
                                    {/* Sorting & View Controls */}
                                    <div className="flex items-center justify-between mb-4 md:mb-6 flex-wrap gap-3">
                                        <div className="flex items-center gap-2 sm:gap-3">
                                            <Select value={sortBy} onValueChange={setSortBy}>
                                                <SelectTrigger className="w-[140px] sm:w-[180px] text-xs sm:text-sm">
                                                    <SelectValue placeholder="Sort by" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="ending-soonest">Ending Soonest</SelectItem>
                                                    <SelectItem value="newest">Newest</SelectItem>
                                                    <SelectItem value="price-high">Price (Highest)</SelectItem>
                                                    <SelectItem value="price-low">Price (Lowest)</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                onClick={() => setSortDirection(sortDirection === "asc" ? "desc" : "asc")}
                                                className="shrink-0"
                                            >
                                                <ArrowUpDown className={`h-4 w-4 ${sortDirection === "desc" ? "rotate-180" : ""}`} />
                                            </Button>
                                        </div>

                                        <div className="flex items-center gap-2 sm:gap-3">
                                            <span className="text-xs sm:text-sm text-muted-foreground hidden sm:inline">{mappedAuctionGroups.flatMap(g => g.lots).length} lots</span>
                                            <div className="flex border border-border rounded-lg overflow-hidden">
                                                <Button
                                                    variant={viewMode === "grid" ? "secondary" : "ghost"}
                                                    size="icon"
                                                    onClick={() => setViewMode("grid")}
                                                    className="rounded-none h-8 w-8 sm:h-9 sm:w-9"
                                                >
                                                    <Grid3x3 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                                                </Button>
                                                <Button
                                                    variant={viewMode === "list" ? "secondary" : "ghost"}
                                                    size="icon"
                                                    onClick={() => setViewMode("list")}
                                                    className="rounded-none h-8 w-8 sm:h-9 sm:w-9"
                                                >
                                                    <List className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Lots Display */}
                                    {groupByAuction ? (
                                        <div className="space-y-6 md:space-y-8">
                                            {mappedAuctionGroups.map((group) => (
                                                <div key={group.id}>
                                                    <AuctionGroupHeader auction={group} />
                                                    <div className={viewMode === "grid"
                                                        ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6"
                                                        : "space-y-3 md:space-y-4"
                                                    }>
                                                        {group.lots.map((lot) => (
                                                            <LotCard
                                                                key={lot.id}
                                                                lot={lot}
                                                                viewMode={viewMode}
                                                                isRegistered={true}
                                                                auctionId={lot.auctionId}
                                                                buyerPremiumPercentage={null}
                                                            />
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className={viewMode === "grid"
                                            ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6"
                                            : "space-y-3 md:space-y-4"
                                        }>
                                            {mappedAuctionGroups.flatMap(g => g.lots).map((lot) => (
                                                <LotCard
                                                    key={lot.id}
                                                    lot={lot}
                                                    viewMode={viewMode}
                                                    isRegistered={true}
                                                    auctionId={lot.auctionId}
                                                    buyerPremiumPercentage={null}
                                                />
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </>
                    )}
                </TabsContent>
                <TabsContent value="top-picks">
                    {bidsTopPicksQuery.isLoading && <BidsListSkeleton viewMode={viewMode} />}
                    {bidsTopPicksQuery.isError && (
                        <ErrorState
                            title="Failed to Load Top Picks"
                            message="We couldn't load recommended lots for you. Please check your connection and try again."
                            onRetry={() => bidsTopPicksQuery.refetch()}
                        />
                    )}
                    {bidsTopPicksQuery.isSuccess && mappedTopPicks.length === 0 && (
                        <EmptyState
                            title="No Recommendations Available"
                            message="We don't have any personalized recommendations for you right now. Check back later or browse auctions directly."
                            actionLabel="Browse Auctions"
                            actionHref="/auctions"
                        />
                    )}
                    {bidsTopPicksQuery.isSuccess && mappedTopPicks.length > 0 && (
                        <>
                            <div className="flex items-center justify-between mb-4 md:mb-6 flex-wrap gap-3">
                                <span className="text-sm text-muted-foreground">{mappedTopPicks.length} recommended lots</span>
                                <div className="flex border border-border rounded-lg overflow-hidden">
                                    <Button
                                        variant={viewMode === "grid" ? "secondary" : "ghost"}
                                        size="icon"
                                        onClick={() => setViewMode("grid")}
                                        className="rounded-none h-8 w-8 sm:h-9 sm:w-9"
                                    >
                                        <Grid3x3 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                                    </Button>
                                    <Button
                                        variant={viewMode === "list" ? "secondary" : "ghost"}
                                        size="icon"
                                        onClick={() => setViewMode("list")}
                                        className="rounded-none h-8 w-8 sm:h-9 sm:w-9"
                                    >
                                        <List className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                                    </Button>
                                </div>
                            </div>

                            <div className={viewMode === "grid"
                                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6"
                                : "space-y-3 md:space-y-4"
                            }>
                                {mappedTopPicks.map((lot) => (
                                    <LotCard
                                        key={lot.id}
                                        lot={lot}
                                        viewMode={viewMode}
                                        isRegistered={lot.isRegistered}
                                        auctionId={lot.auctionId}
                                        buyerPremiumPercentage={null}
                                    />
                                ))}
                            </div>
                        </>
                    )}
                </TabsContent>

                {/* MY AUCTIONS TAB */}
                <TabsContent value="my-auctions">
                    {isMyAuctionsLoading && <MyAuctionsTabSkeleton viewMode={auctionViewMode} />}
                    {isMyAuctionsError && (
                        <ErrorState
                            title="Failed to Load My Auctions"
                            message="We couldn't load your registered auctions. Please check your connection and try again."
                            onRetry={() => bidsRegisteredAuctionsQuery.refetch()}
                        />
                    )}
                    {!isMyAuctionsLoading && !isMyAuctionsError && mappedRegisteredAuctions.length === 0 && (
                        <EmptyState
                            title="No Registered Auctions Yet"
                            message="You are not registered for any auctions yet. Register for an auction to track it here."
                            actionLabel="Browse Auctions"
                            actionHref="/auctions"
                        />
                    )}
                    {!isMyAuctionsLoading && !isMyAuctionsError && mappedRegisteredAuctions.length > 0 && (
                        <>
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between mb-4 md:mb-6 gap-3">
                        <span className="text-sm text-muted-foreground">{filteredAuctions.length} auctions</span>

                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1">
                            <div className="relative flex-1 sm:max-w-md">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search auctions..."
                                    value={auctionSearch}
                                    onChange={(e) => setAuctionSearch(e.target.value)}
                                    className="pl-10 text-sm md:text-base"
                                />
                            </div>
                            <Select value={auctioneerFilter} onValueChange={setAuctioneerFilter}>
                                <SelectTrigger className="w-full sm:w-[200px]">
                                    <SelectValue placeholder="Filter by auctioneer" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Auctioneers</SelectItem>
                                    {uniqueAuctioneers.map((name) => (
                                        <SelectItem key={name} value={name}>{name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* View Toggle */}
                        <div className="hidden md:flex items-center justify-end gap-2">
                            <span className="text-sm text-muted-foreground">View:</span>
                            <Button
                                variant={auctionViewMode === "grid" ? "default" : "outline"}
                                size="icon"
                                onClick={() => setAuctionViewMode("grid")}
                                className="h-8 w-8 sm:h-9 sm:w-9"
                            >
                                <Grid3X3 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                            </Button>
                            <Button
                                variant={auctionViewMode === "list" ? "default" : "outline"}
                                size="icon"
                                onClick={() => setAuctionViewMode("list")}
                                className="h-8 w-8 sm:h-9 sm:w-9"
                            >
                                <List className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                            </Button>
                        </div>
                    </div>

                    {filteredAuctions.length === 0 ? (
                        <EmptyState
                            title="No Auctions Match Your Filters"
                            message="Try adjusting your search term or auctioneer filter."
                        />
                    ) : (
                        <div className={
                            auctionViewMode === "grid"
                                ? "grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6"
                                : "space-y-4 md:space-y-6"
                        }>
                            {filteredAuctions.map((auction) => (
                                <AuctionCard key={auction.id} auction={auction} isRegistered={true} viewMode={auctionViewMode} />
                            ))}
                        </div>
                    )}
                        </>
                    )}
                </TabsContent>
            </Tabs>
        </main>
    );
};

export default Bids;