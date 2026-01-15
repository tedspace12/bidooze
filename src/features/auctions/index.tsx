'use client';

import { useSearchParams } from "next/navigation";
import { useState, useMemo } from "react";
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
import { AuctionCardStatus, AuctionStatus } from "./types";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Grid3X3, List, RotateCw } from "lucide-react";
import FilterDrawer from "@/components/shared/FilterDrawer";
import { useAuctions } from "./hooks";

// Mock auction data
const mockAuctions = [
  {
    id: "1",
    title: "Fine Art & Antiques Estate Auction",
    coverImage: "https://images.unsplash.com/photo-1597011652644-586e42146e12?w=800&h=600&fit=crop",
    auctioneer: { name: "Heritage Auction House", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop" },
    totalLots: 245,
    startDate: "2025-12-15T10:00:00",
    endDate: "2025-12-18T18:00:00",
    description: "An exceptional collection of fine art, antiques, and decorative objects from distinguished estates.",
    lotImages: [
      "https://images.unsplash.com/photo-1579541814924-49fef17c5be5?w=200&h=200&fit=crop",
      "https://images.unsplash.com/photo-1544967082-d9d25d867d66?w=200&h=200&fit=crop",
      "https://images.unsplash.com/photo-1541753866388-0b3c701627d3?w=200&h=200&fit=crop",
    ],
    status: "live" as const,
    shippingAvailable: true,
    location: "New York, NY",
    notices: "15% Buyer's Premium",
    isRegistered: true,
  },
  {
    id: "2",
    title: "Luxury Watches & Jewelry Auction",
    coverImage: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=800&h=600&fit=crop",
    auctioneer: { name: "Sotheby's", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop" },
    totalLots: 128,
    startDate: "2025-12-20T14:00:00",
    endDate: "2025-12-20T20:00:00",
    description: "Featuring rare timepieces from Patek Philippe, Rolex, and Audemars Piguet alongside stunning jewelry pieces.",
    lotImages: [
      "https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?w=200&h=200&fit=crop",
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=200&h=200&fit=crop",
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=200&h=200&fit=crop",
    ],
    status: "upcoming" as const,
    shippingAvailable: true,
    location: "Beverly Hills, CA",
    notices: "20% Buyer's Premium • White Glove Service",
    isRegistered: false,
  },
  {
    id: "3",
    title: "Classic & Vintage Automobiles",
    coverImage: "https://images.unsplash.com/photo-1489824904134-891ab64532f1?w=800&h=600&fit=crop",
    auctioneer: { name: "Barrett-Jackson", avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop" },
    totalLots: 89,
    startDate: "2025-12-14T09:00:00",
    endDate: "2025-12-14T17:00:00",
    description: "Premier collection of classic American muscle cars, European sports cars, and rare vintage automobiles.",
    lotImages: [
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=200&h=200&fit=crop",
      "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=200&h=200&fit=crop",
      "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=200&h=200&fit=crop",
    ],
    status: "closing-soon" as const,
    shippingAvailable: false,
    location: "Scottsdale, AZ",
    notices: "10% Buyer's Premium • In-person bidding only",
    isRegistered: false,
  },
  {
    id: "4",
    title: "Contemporary Art Week",
    coverImage: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800&h=600&fit=crop",
    auctioneer: { name: "Christie's", avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop" },
    totalLots: 156,
    startDate: "2025-12-22T11:00:00",
    endDate: "2025-12-25T21:00:00",
    description: "Featuring works by Basquiat, Warhol, Hirst, and emerging contemporary artists.",
    lotImages: [
      "https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?w=200&h=200&fit=crop",
      "https://images.unsplash.com/photo-1578926375605-eaf7559b1458?w=200&h=200&fit=crop",
      "https://images.unsplash.com/photo-1515405295579-ba7b45403062?w=200&h=200&fit=crop",
    ],
    status: "upcoming" as const,
    shippingAvailable: true,
    location: "London, UK",
    notices: "25% Buyer's Premium",
    isRegistered: false,
  },
  {
    id: "5",
    title: "Estate Liquidation Sale",
    coverImage: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=600&fit=crop",
    auctioneer: { name: "Local Estate Auctions", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop" },
    totalLots: 312,
    startDate: "2025-12-13T08:00:00",
    endDate: "2025-12-13T16:00:00",
    description: "Complete estate including furniture, appliances, tools, and household items.",
    lotImages: [
      "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=200&h=200&fit=crop",
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=200&h=200&fit=crop",
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=200&h=200&fit=crop",
    ],
    status: "live" as const,
    shippingAvailable: false,
    location: "Chicago, IL",
    notices: "No Buyer's Premium • Cash or Card Only",
    isRegistered: false,
  },
  {
    id: "6",
    title: "Rare Coins & Currency Auction",
    coverImage: "https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=800&h=600&fit=crop",
    auctioneer: { name: "Stack's Bowers", avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&h=100&fit=crop" },
    totalLots: 478,
    startDate: "2026-01-05T10:00:00",
    endDate: "2026-01-08T18:00:00",
    description: "Featuring rare U.S. coins, world coins, and historic paper currency from renowned collections.",
    lotImages: [
      "https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?w=200&h=200&fit=crop",
      "https://images.unsplash.com/photo-1579621970795-87facc2f976d?w=200&h=200&fit=crop",
      "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=200&h=200&fit=crop",
    ],
    status: "upcoming" as const,
    shippingAvailable: true,
    location: "Philadelphia, PA",
    notices: "18% Buyer's Premium",
    isRegistered: false,
  },
];

const Auctions = () => {
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
    state: "all"
  });
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");

  // console.log(filters);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const { useAllAuctions } = useAuctions();
  const { data, isLoading, isError, refetch } = useAllAuctions({
    page: 1,
  });

  const allAuctions = data?.data;
  const refactoredAuctions = allAuctions?.map((auction) => {
    return {
      id: auction.id.toString(),
      title: auction.name,
      coverImage: auction.feature_image_url,
      auctioneer: {
        name: auction.auctioneer.company_name,
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop"
      },
      totalLots: auction.lots.length,
      startDate: auction.auction_start_at,
      endDate: auction.auction_end_at,
      description: auction.description,
      lotImages: [
        "https://images.unsplash.com/photo-1579541814924-49fef17c5be5?w=200&h=200&fit=crop",
        "https://images.unsplash.com/photo-1544967082-d9d25d867d66?w=200&h=200&fit=crop",
        "https://images.unsplash.com/photo-1541753866388-0b3c701627d3?w=200&h=200&fit=crop",
      ],
      status: auction.status as AuctionCardStatus,
      shippingAvailable: auction.shipping_availability === "available" ? true : false,
      location: `${auction.city}, ${auction.state}`,
      notices: auction.bidding_notice,
      isRegistered: false,
    }
  })
  const totalCount = data?.pagination?.total || 0;

  const filteredAuctions = useMemo(() => {
    return mockAuctions.filter((auction) => {
      // Search filter
      if (filters.search && !auction.title.toLowerCase().includes(filters.search.toLowerCase())) {
        return false;
      }

      // Status filter
      if (filters.status.length > 0 && !filters.status.includes("all")) {
        if (!filters.status.includes(auction.status)) {
          return false;
        }
      }

      // Shipping filter
      if (filters.shipping.length > 0) {
        if (filters.shipping.includes("shipping") && !auction.shippingAvailable) return false;
        if (filters.shipping.includes("pickup") && auction.shippingAvailable) return false;
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

  const totalPages = Math.ceil(filteredAuctions.length / itemsPerPage);
  const paginatedAuctions = filteredAuctions.slice(
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
        // onClear={clearFilters}
        >
          <AuctionFilters filters={filters} onFiltersChange={setFilters} type="auction" />
        </FilterDrawer>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
        {/* Desktop Filters Sidebar */}
        <aside className="hidden lg:block lg:w-80 shrink-0">
          <AuctionFilters filters={filters} onFiltersChange={setFilters} type="auction" />
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

              {paginatedAuctions.length === 0 && (
                <div className="text-center py-12 md:py-16 bg-card border border-border rounded-xl">
                  <p className="text-muted-foreground text-base md:text-lg">No auctions match your filters.</p>
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
            </>
          )}
        </div>
      </div>
    </main>
  );
};

export default Auctions;
