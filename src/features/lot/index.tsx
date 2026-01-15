'use client';

import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { useMemo, useState } from "react";
import { AuctionStatus } from "../auctions/types";
import AuctionFilters from "../auctions/components/AuctionFilters";
import { useSearchParams } from "next/navigation";
import LotCard from "../auction/components/LotCard";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import { Grid3X3, List } from "lucide-react";
import Link from "next/link";
import FilterDrawer from "@/components/shared/FilterDrawer";

const mockLots = [
    {
        id: "1",
        lotNumber: 1,
        title: "1967 Ferrari 275 GTB/4",
        image: "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=600&h=400&fit=crop",
        currentBid: 2850000,
        estimateLow: 2500000,
        estimateHigh: 3500000,
        bids: 24,
        status: "open" as const,
        featured: true,
        isRegistered: false,
        timeRemaining: "2h 45m",
        shippingAvailable: true,
        auctionStatus: "live" as const
    },
    {
        id: "2",
        lotNumber: 2,
        title: "1955 Mercedes-Benz 300SL Gullwing",
        image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&h=400&fit=crop",
        currentBid: 1450000,
        estimateLow: 1200000,
        estimateHigh: 1800000,
        bids: 18,
        status: "open" as const,
        featured: true,
        isRegistered: false,
        timeRemaining: "1h 45m",
        shippingAvailable: false,
        auctionStatus: "live" as const
    },
    {
        id: "3",
        lotNumber: 3,
        title: "1970 Plymouth Hemi 'Cuda",
        image: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=600&h=400&fit=crop",
        currentBid: 425000,
        estimateLow: 350000,
        estimateHigh: 500000,
        bids: 31,
        status: "open" as const,
        featured: true,
        isRegistered: false,
        timeRemaining: "4h 25m",
        shippingAvailable: true,
        auctionStatus: "upcoming" as const
    },
    {
        id: "4",
        lotNumber: 4,
        title: "1963 Chevrolet Corvette Stingray",
        image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop",
        currentBid: 185000,
        estimateLow: 150000,
        estimateHigh: 220000,
        bids: 12,
        status: "open" as const,
        featured: false,
        isRegistered: true,
        timeRemaining: "1d 45m",
        shippingAvailable: true,
        auctionStatus: "closing-soon" as const
    },
    {
        id: "5",
        lotNumber: 5,
        title: "1969 Ford Mustang Boss 429",
        image: "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=600&h=400&fit=crop",
        currentBid: 0,
        realizedPrice: 320000,
        estimateLow: 280000,
        estimateHigh: 380000,
        bids: 22,
        status: "closed" as const,
        featured: false,
        isRegistered: false,
        timeRemaining: "2h 45m",
        shippingAvailable: false,
        auctionStatus: "top-picks" as const
    },
    {
        id: "6",
        lotNumber: 6,
        title: "1957 Porsche 356A Speedster",
        image: "https://images.unsplash.com/photo-1580274455191-1c62238fa333?w=600&h=400&fit=crop",
        currentBid: 485000,
        estimateLow: 400000,
        estimateHigh: 550000,
        bids: 15,
        status: "open" as const,
        featured: true,
        isRegistered: true,
        timeRemaining: "2h 45m",
        shippingAvailable: true,
        auctionStatus: "live" as const
    },
    {
        id: "7",
        lotNumber: 7,
        title: "1971 Lamborghini Miura SV",
        image: "https://images.unsplash.com/photo-1525609004556-c46c7d6cf023?w=600&h=400&fit=crop",
        currentBid: 1875000,
        estimateLow: 1600000,
        estimateHigh: 2200000,
        bids: 9,
        status: "open" as const,
        featured: false,
        isRegistered: false,
        timeRemaining: "2h 45m",
        shippingAvailable: true,
        auctionStatus: "live" as const
    },
    {
        id: "8",
        lotNumber: 8,
        title: "1965 Aston Martin DB5",
        image: "https://images.unsplash.com/photo-1618486613525-c694bf152b2c?w=600&h=400&fit=crop",
        currentBid: 0,
        realizedPrice: 875000,
        estimateLow: 750000,
        estimateHigh: 950000,
        bids: 28,
        status: "closed" as const,
        featured: false,
        isRegistered: false,
        timeRemaining: "2h 45m",
        shippingAvailable: true,
        auctionStatus: "live" as const
    },
];

const Lots = () => {
    const searchParams = useSearchParams();
    const initialStatus = (searchParams.get("status") as AuctionStatus) || "live";
    const initialCategory = (searchParams.get("category") as string) || ''

    const [filters, setFilters] = useState({
        search: "",
        zipCode: "",
        distance: "50",
        status: [initialStatus] as AuctionStatus[],
        shipping: [] as string[],
        dateRange: null as { from: Date; to: Date } | null,
        categories: [initialCategory] as string[],
        lotType: [] as string[],
        state: "all",
    });
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

    const filteredLots = useMemo(() => {
        return mockLots.filter((lot) => {
            // Search filter
            if (filters.search && !lot.title.toLowerCase().includes(filters.search.toLowerCase())) {
                return false;
            }

            // Status filter
            if (filters.status.length > 0 && !filters.status.includes("all")) {
                if (!filters.status.includes(lot.auctionStatus)) {
                    return false;
                }
            }

            // Shipping filter
            if (filters.shipping.length > 0) {
                if (filters.shipping.includes("shipping") && !lot.shippingAvailable) return false;
                if (filters.shipping.includes("pickup") && lot.shippingAvailable) return false;
            }

            return true;
        });
    }, [filters]);

    const activeFiltersCount = useMemo(() => {
        let count = 0;
        if (filters.search) count++;
        if (filters.zipCode) count++;
        if (filters.distance !== "50") count++;
        if (filters.status.length > 0 && !filters.status.includes("live")) count++;
        if (filters.shipping.length > 0) count++;
        if (filters.dateRange) count++;
        if (filters.categories.length > 0) count += filters.categories.length;
        if (filters.lotType.length > 0) count++;
        return count;
    }, [filters]);

    const totalPages = Math.ceil(filteredLots.length / itemsPerPage);
    const paginatedLots = filteredLots.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <main className="container mx-auto px-4 py-6 md:py-8">
            {/* Breadcrumb */}
            <Breadcrumb className="mb-4 md:mb-6">
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/">Home</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>Lots</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <div className="flex flex-col sm:flex-row sm:justify-between gap-4 mb-6 md:mb-8">
                {/* Page Header */}
                <div>
                    <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-1 md:mb-2">Lots</h1>
                    <p className="text-sm md:text-base text-muted-foreground">
                        {filteredLots.length} lot{filteredLots.length !== 1 ? "s" : ""} found
                    </p>

                    <div className="mt-4 flex items-center gap-6 border-b border-border mb-2">
                        <button className="pb-3 text-sm font-medium border-b-2 border-primary text-foreground">
                            Lots
                        </button>

                        <Link
                            href="/auctions"
                            className="pb-3 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                        >
                            Auctions
                        </Link>
                    </div>

                </div>


                {/* View Toggle - only visible on medium screens */}
                <div className="hidden md:flex items-center justify-end gap-2 mb-4">
                    <span className="text-sm text-muted-foreground">View:</span>
                    <Button
                        variant={viewMode === "grid" ? "default" : "outline"}
                        size="icon"
                        onClick={() => setViewMode("grid")}
                        className="h-9 w-9"
                    >
                        <Grid3X3 className="h-4 w-4" />
                    </Button>
                    <Button
                        variant={viewMode === "list" ? "default" : "outline"}
                        size="icon"
                        onClick={() => setViewMode("list")}
                        className="h-9 w-9"
                    >
                        <List className="h-4 w-4" />
                    </Button>
                </div>

                {/* Mobile Filter Button */}
                <FilterDrawer
                    activeFiltersCount={activeFiltersCount}
                // onClear={clearFilters}
                >
                    <AuctionFilters filters={filters} onFiltersChange={setFilters} type="lot" />
                </FilterDrawer>
            </div>

            <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
                {/* Filters Sidebar */}
                <aside className="hidden lg:block lg:w-70 2xl:w-80 shrink-0">
                    <AuctionFilters filters={filters} onFiltersChange={setFilters} type="lot" />
                </aside>

                {/* Auction Grid */}
                <div className="flex-1">
                    <div className={
                        viewMode === "grid"
                            ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6 md:mb-8"
                            : "flex flex-col gap-4 mb-6 md:mb-8"
                    }>
                        {paginatedLots.map((lot) => (
                            <LotCard key={lot.id} lot={lot} viewMode={viewMode} isRegistered />
                        ))}
                    </div>

                    {paginatedLots.length === 0 && (
                        <div className="text-center py-12 md:py-16 bg-card border border-border rounded-xl">
                            <p className="text-muted-foreground text-base md:text-lg">No lots match your filters.</p>
                            <p className="text-sm text-muted-foreground mt-2">Try adjusting your search criteria.</p>
                        </div>
                    )}

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <Pagination className="mt-6 md:mt-8">
                            <PaginationContent>
                                <PaginationItem>
                                    <PaginationPrevious
                                        href="#"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setCurrentPage(Math.max(1, currentPage - 1));
                                        }}
                                        className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                                    />
                                </PaginationItem>

                                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                    <PaginationItem key={page}>
                                        <PaginationLink
                                            href="#"
                                            isActive={page === currentPage}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                setCurrentPage(page);
                                            }}
                                        >
                                            {page}
                                        </PaginationLink>
                                    </PaginationItem>
                                ))}

                                <PaginationItem>
                                    <PaginationNext
                                        href="#"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setCurrentPage(Math.min(totalPages, currentPage + 1));
                                        }}
                                        className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                                    />
                                </PaginationItem>
                            </PaginationContent>
                        </Pagination>
                    )}
                </div>
            </div>
        </main>
    )
}

export default Lots;