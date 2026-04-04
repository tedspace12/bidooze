'use client';

import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { normalizeBuyerAuctionStatus } from "@/lib/auctionLifecycle";
import {
  buildAuctionListQueryParams,
  countActiveListingFilters,
  createListingFiltersFromSearchParams,
  getDefaultListingFilters,
} from "@/lib/listingQueryParams";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import AuctionFilters from "./components/AuctionFilters";
import AuctionCard from "./components/AuctionCard";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Grid3X3, List, RotateCw } from "lucide-react";
import FilterDrawer from "@/components/shared/FilterDrawer";
import { useAuctions } from "./hooks";
import type { Filters } from "./components/AuctionFilters";
import {
  ensureListingImageSources,
  resolveListingImageSrc,
} from "@/lib/listingImageFallbacks";

const Auctions = () => {
  const searchParams = useSearchParams();
  const searchParamsKey = searchParams.toString();
  const initialFilters = useMemo(
    () => createListingFiltersFromSearchParams(new URLSearchParams(searchParamsKey)),
    [searchParamsKey]
  );
  const [filters, setFilters] = useState<Filters>(initialFilters);
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [currentPage, setCurrentPage] = useState(1);

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
      per_page: 15,
      ...buildAuctionListQueryParams(filters),
    }),
    [currentPage, filters]
  );

  const { useAllAuctions } = useAuctions();
  const { data, isLoading, isError, refetch } = useAllAuctions(listingParams);

  const allAuctions = data?.data;
  const refactoredAuctions = useMemo(() => {
    if (!allAuctions) return undefined;
    return allAuctions.map((auction) => {
      const status = normalizeBuyerAuctionStatus(auction.status);
      return {
        id: auction.id.toString(),
        title: auction.name,
        coverImage: resolveListingImageSrc(
          auction.image_url ?? auction.feature_image_url,
          "auction"
        ),
        auctioneer: {
          name: auction.auctioneer.company_name,
          avatar: auction.auctioneer.avatar ?? null,
        },
        totalLots: auction.lots.length,
        startDate: auction.auction_start_at,
        endDate: auction.auction_end_at,
        description: auction.description,
        lotImages: ensureListingImageSources(
          auction.lots.map((lot) => lot.primary_image_url),
          "lot"
        ).slice(0, 3),
        status,
        shippingAvailable: auction.shipping_availability === "available" ? true : false,
        location: `${auction.city}, ${auction.state}`,
        notices: auction.bidding_notice,
        isRegistered: !!auction.registration_status,
      };
    });
  }, [allAuctions]);

  const totalCount = data?.pagination?.total || 0;
  const lastPage = data?.pagination?.last_page ?? 1;
  const totalPages = lastPage > 0 ? lastPage : 1;

  const activeFiltersCount = useMemo(
    () => countActiveListingFilters(filters),
    [filters]
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
            <BreadcrumbPage>Auctions</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex flex-col sm:flex-row sm:justify-between gap-4 mb-6 md:mb-8">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-1 md:mb-2">Auctions</h1>
          <p className="text-sm md:text-base text-muted-foreground">
            {totalCount} auction{totalCount !== 1 ? "s" : ""} found
          </p>

          <div className="mt-4 flex items-center gap-6 border-b border-border mb-2">
            <button className="pb-3 text-sm font-medium border-b-2 border-primary text-foreground">
              Auctions
            </button>

            <Link
              href="/lots"
              className="pb-3 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Lots
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
          <Button
            variant="outline"
            size="icon"
            onClick={() => refetch()}
            disabled={isLoading}
            className="h-9 w-9 ml-2"
            title="Refresh auctions"
          >
            <RotateCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
        </div>

        {/* Mobile Filter Button */}
        <FilterDrawer
          activeFiltersCount={activeFiltersCount}
          onClear={clearFilters}
        >
          <AuctionFilters filters={filters} onFiltersChange={handleFiltersChange} type="auction" />
        </FilterDrawer>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
        {/* Desktop Filters Sidebar */}
        <aside className="hidden lg:block lg:w-80 shrink-0">
          <AuctionFilters filters={filters} onFiltersChange={handleFiltersChange} type="auction" />
        </aside>

        {/* Auction Grid */}
        <div className="flex-1">
          {isLoading ? (
            <div className="space-y-4 md:space-y-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="h-48 bg-muted rounded-lg animate-pulse"
                />
              ))}
            </div>
          ) : isError ? (
            <div className="text-center py-12 md:py-16 bg-card border border-border rounded-xl">
              <p className="text-red-500 font-medium text-base md:text-lg">Error loading auctions</p>
              <p className="text-sm text-muted-foreground mt-2">Failed to fetch auctions. Please try again later.</p>
            </div>
          ) : (
            <>
              <div className={
                viewMode === "grid"
                  ? "grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6"
                  : "space-y-4 md:space-y-6"
              }>
                {refactoredAuctions?.map((auction) => (
                  <AuctionCard key={auction.id} auction={auction} isRegistered={auction.isRegistered} viewMode={viewMode} page="auctions" />
                ))}
              </div>

              {(refactoredAuctions?.length ?? 0) === 0 && (
                <div className="text-center py-12 md:py-16 bg-card border border-border rounded-xl">
                  <p className="text-muted-foreground text-base md:text-lg">No auctions match your filters.</p>
                  <p className="text-sm text-muted-foreground mt-2">Try adjusting your search criteria.</p>
                </div>
              )}

              {/* Pagination — driven by API (last_page), not mock data */}
              {totalPages > 1 && (
                <Pagination className="mt-6 md:mt-8">
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          setCurrentPage((p) => Math.max(1, p - 1));
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
                          setCurrentPage((p) => Math.min(totalPages, p + 1));
                        }}
                        className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              )}
            </>
          )}
        </div>
      </div>
    </main>
  );
};

export default Auctions;
