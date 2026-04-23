'use client';

import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { useMemo, useState, useEffect } from "react";
import { normalizeBuyerAuctionStatus } from "@/lib/auctionLifecycle";
import AuctionFilters from "../auctions/components/AuctionFilters";
import type { Filters } from "../auctions/components/AuctionFilters";
import {
  buildLotsListQueryParams,
  countActiveListingFilters,
  createListingFiltersFromSearchParams,
  getDefaultListingFilters,
} from "@/lib/listingQueryParams";
import { useSearchParams } from "next/navigation";
import LotCard from "../auction/components/LotCard";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import { Grid3X3, List } from "lucide-react";
import Link from "next/link";
import FilterDrawer from "@/components/shared/FilterDrawer";
import { useLots } from "./hooks/useLot";
import { resolveListingImageSrc } from "@/lib/listingImageFallbacks";

const Lots = () => {
    const searchParams = useSearchParams();
    const searchParamsKey = searchParams.toString();
    const initialFilters = useMemo(
        () => createListingFiltersFromSearchParams(new URLSearchParams(searchParamsKey)),
        [searchParamsKey]
    );

    const [filters, setFilters] = useState<Filters>(initialFilters);
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 20;

    useEffect(() => {
        setFilters(initialFilters);
        setCurrentPage(1);
    }, [initialFilters]);

    const handleFiltersChange = (next: Filters) => {
        setFilters(next);
        setCurrentPage(1);
    };

    const clearFilters = () => {
        setFilters(getDefaultListingFilters());
        setCurrentPage(1);
    };

    const listingParams = useMemo(
        () => ({
            page: currentPage,
            per_page: itemsPerPage,
            ...buildLotsListQueryParams(filters),
        }),
        [currentPage, filters]
    );

    const { data: lotsResponse } = useLots(listingParams);

    const mappedLots = useMemo(() => {
        if (!lotsResponse?.data) return [];
        return lotsResponse.data.map(lot => ({
            id: lot.id.toString(),
            lotNumber: parseInt(lot.lot_number, 10) || 0,
            title: lot.title,
            image: resolveListingImageSrc(lot.image_url, "lot"),
            currentBid: lot.current_bid !== null ? lot.current_bid : lot.starting_bid,
            startBid: lot.starting_bid,
            bidIncrement: lot.bid_increment,
            hasBids: lot.current_bid !== null,
            isInWatchlist: lot.is_in_watchlist,
            estimateLow: parseFloat(lot.estimate_low) || 0,
            estimateHigh: parseFloat(lot.estimate_high) || 0,
            bids: lot.bid_count,
            status: (lot.status === 'closed' ? 'closed' : 'open') as "open" | "closed",
            timeRemaining: lot.ends_at ? new Date(lot.ends_at).toLocaleString() : undefined,
            shippingAvailable: lot.auction?.shipping_availability === 'available',
            auctionStatus: normalizeBuyerAuctionStatus(lot.auction?.status ?? "live"),
            auctionName: lot.auction?.name,
            isRegistered: !!lot.auction?.registration_status,
            maxBid: undefined,
            realizedPrice: undefined,
            auctionId: lot.auction?.id?.toString()
        }));
    }, [lotsResponse]);

    const activeFiltersCount = useMemo(
        () => countActiveListingFilters(filters),
        [filters]
    );

    const totalPages = lotsResponse?.pagination?.last_page || 1;
    const totalLotsCount = lotsResponse?.pagination?.total ?? mappedLots.length;

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (
                e.target instanceof HTMLInputElement ||
                e.target instanceof HTMLTextAreaElement ||
                (e.target as HTMLElement).isContentEditable
            ) {
                return;
            }

            if (e.key === "ArrowRight") {
                setCurrentPage(prev => Math.min(totalPages, prev + 1));
            } else if (e.key === "ArrowLeft") {
                setCurrentPage(prev => Math.max(1, prev - 1));
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [totalPages]);

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
                        {totalLotsCount} lot{totalLotsCount !== 1 ? "s" : ""} found
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
                    onClear={clearFilters}
                >
                    <AuctionFilters filters={filters} onFiltersChange={handleFiltersChange} type="lot" />
                </FilterDrawer>
            </div>

            <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
                {/* Filters Sidebar */}
                <aside className="hidden lg:block lg:w-70 2xl:w-80 shrink-0">
                    <AuctionFilters filters={filters} onFiltersChange={handleFiltersChange} type="lot" />
                </aside>

                {/* Auction Grid */}
                <div className="flex-1">
                    <div className={
                        viewMode === "grid"
                            ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6 md:mb-8"
                            : "flex flex-col gap-4 mb-6 md:mb-8"
                    }>
                        {mappedLots.map((lot) => (
                            <LotCard
                                key={lot.id}
                                lot={lot}
                                viewMode={viewMode}
                                isRegistered={lot.isRegistered}
                                buyerPremiumPercentage={null}
                            />
                        ))}
                    </div>

                    {mappedLots.length === 0 && (
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
