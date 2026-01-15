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

// Mock data
const mockBidStats = {
    winningHighBid: 3,
    winningMaxBid: 5,
    winning: 8,
    sealedPending: 2,
    losingDeclined: 4,
    watched: 12,
};

const mockLots = [
    {
        id: "1",
        lotNumber: 101,
        title: "Vintage Rolex Submariner Watch 1960s",
        image: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=400",
        currentBid: 15000,
        estimateLow: 12000,
        estimateHigh: 18000,
        bids: 24,
        status: "open" as const,
        timeRemaining: "2h 45m",
        maxBid: 17000,
        shippingAvailable: true,
        auctionId: "1",
        auctionName: "Fine Watches & Jewelry Auction",
    },
    {
        id: "2",
        lotNumber: 102,
        title: "18K Gold Diamond Necklace",
        image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400",
        currentBid: 8500,
        estimateLow: 7000,
        estimateHigh: 10000,
        bids: 18,
        status: "open" as const,
        timeRemaining: "1h 30m",
        maxBid: 9500,
        shippingAvailable: true,
        auctionId: "1",
        auctionName: "Fine Watches & Jewelry Auction",
    },
    {
        id: "3",
        lotNumber: 201,
        title: "Original Picasso Lithograph 'Le Repos'",
        image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400",
        currentBid: 25000,
        estimateLow: 20000,
        estimateHigh: 30000,
        bids: 31,
        status: "open" as const,
        timeRemaining: "4h 15m",
        maxBid: 28000,
        shippingAvailable: false,
        auctionId: "2",
        auctionName: "Modern & Contemporary Art",
    },
    {
        id: "4",
        lotNumber: 202,
        title: "Andy Warhol Campbell's Soup Print",
        image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=400",
        currentBid: 45000,
        estimateLow: 40000,
        estimateHigh: 55000,
        bids: 42,
        status: "open" as const,
        timeRemaining: "3h 00m",
        maxBid: 28000,
        shippingAvailable: true,
        auctionId: "2",
        auctionName: "Modern & Contemporary Art",
    },
];

const mockAuctions = [
    {
        id: "1",
        title: "Fine Watches & Jewelry Auction",
        coverImage: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=800",
        auctioneer: { name: "Christie's", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100" },
        totalLots: 156,
        startDate: "2024-01-15",
        endDate: "2024-01-20",
        description: "An exceptional collection of fine timepieces and luxury jewelry",
        lotImages: [
            "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=100",
            "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=100",
        ],
        status: "live" as const,
        shippingAvailable: true,
        location: "New York, NY",
    },
    {
        id: "2",
        title: "Modern & Contemporary Art",
        coverImage: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800",
        auctioneer: { name: "Sotheby's", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100" },
        totalLots: 89,
        startDate: "2024-01-18",
        endDate: "2024-01-25",
        description: "Featuring works from renowned modern and contemporary artists",
        lotImages: [
            "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=100",
            "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=100",
        ],
        status: "closing-soon" as const,
        shippingAvailable: true,
        location: "London, UK",
    },
];

const mockAuctionGroups = [
    {
        id: "1",
        title: "Fine Watches & Jewelry Auction",
        auctioneer: { name: "Christie's", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100" },
        date: "2024-01-20",
        lots: mockLots.filter(l => l.auctionId === "1"),
    },
    {
        id: "2",
        title: "Modern & Contemporary Art",
        auctioneer: { name: "Sotheby's", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100" },
        date: "2024-01-25",
        lots: mockLots.filter(l => l.auctionId === "2"),
    },
];

const Bids = () => {
    const router = useRouter();
    const searchParams = useSearchParams();

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

    useEffect(() => {
        router.push(`/bids?tab=${activeTab}`);
    }, [activeTab, router]);

    const handleRefresh = () => {
        // Mock refresh
        console.log("Refreshing bid data...");
    };

    const filteredAuctions = mockAuctions.filter(auction => {
        if (auctionSearch && !auction.title.toLowerCase().includes(auctionSearch.toLowerCase())) {
            return false;
        }
        if (auctioneerFilter !== "all" && auction.auctioneer.name !== auctioneerFilter) {
            return false;
        }
        return true;
    });

    const uniqueAuctioneers = [...new Set(mockAuctions.map(a => a.auctioneer.name))];

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
                    <BidsSummary stats={mockBidStats} onRefresh={handleRefresh} />

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
                                    <span className="text-xs sm:text-sm text-muted-foreground hidden sm:inline">{mockLots.length} lots</span>
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
                                    {mockAuctionGroups.map((group) => (
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
                                                        showMaxBid={true}
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
                                    {mockLots.map((lot) => (
                                        <LotCard
                                            key={lot.id}
                                            lot={lot}
                                            viewMode={viewMode}
                                            isRegistered={true}
                                            auctionId={lot.auctionId}
                                            showAuctionName={true}
                                            showMaxBid={true}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </TabsContent>

                {/* TOP PICKS TAB */}
                <TabsContent value="top-picks">
                    <div className="flex items-center justify-between mb-4 md:mb-6 flex-wrap gap-3">
                        <span className="text-sm text-muted-foreground">{mockLots.length} recommended lots</span>
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
                        {mockLots.map((lot) => (
                            <LotCard
                                key={lot.id}
                                lot={lot}
                                viewMode={viewMode}
                                isRegistered={true}
                                auctionId={lot.auctionId}
                            />
                        ))}
                    </div>
                </TabsContent>

                {/* MY AUCTIONS TAB */}
                <TabsContent value="my-auctions">
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

                    <div className={
                        auctionViewMode === "grid"
                            ? "grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6"
                            : "space-y-4 md:space-y-6"
                    }>
                        {filteredAuctions.map((auction) => (
                            <AuctionCard key={auction.id} auction={auction} isRegistered={true} viewMode={auctionViewMode} />
                        ))}
                    </div>
                </TabsContent>
            </Tabs>
        </main>
    );
};

export default Bids;