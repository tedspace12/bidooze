'use client';

import { useState, useMemo, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, Star, MapPin, ChevronLeft, ChevronRight, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useAuctioneer } from "./hooks/useAuctioneer";
import { toast } from "sonner";

const ITEMS_PER_PAGE = 8;

const AuctioneerCardSkeleton = () => (
  <Card className="p-6">
    <div className="flex items-start justify-between mb-4">
      <div className="h-16 w-16 rounded-full bg-muted animate-pulse" />
      <div className="h-9 w-9 rounded-full bg-muted animate-pulse" />
    </div>
    <div className="h-4 w-3/4 bg-muted animate-pulse rounded mb-3" />
    <div className="h-3 w-1/2 bg-muted animate-pulse rounded" />
  </Card>
);

interface Filters {
  search: string;
  location: string;
  favourites: boolean;
  page: number;
}

const AuctioneersSearch = () => {
  const { useAuctioneers } = useAuctioneer();

  const [searchInput, setSearchInput] = useState("");
  const [filters, setFilters] = useState<Filters>({
    search: "",
    location: "all locations",
    favourites: false,
    page: 1,
  });
  const [favorites, setFavorites] = useState<number[]>([]);

  const params = useMemo(() => {
    const [state, country] =
      filters.location !== "all locations"
        ? filters.location.split(" ")
        : [undefined, undefined];

    return {
      ...(filters.search ? { name: filters.search } : {}),
      ...(state ? { state } : {}),
      ...(country ? { country } : {}),
      ...(filters.favourites ? { favourites: true } : {}),
      per_page: ITEMS_PER_PAGE,
      page: filters.page,
    };
  }, [filters]);

  const { data, isLoading, isError, error } = useAuctioneers(params);

  const isAuthError = (error as any)?.message === "Authentication required to filter favourites.";

  useEffect(() => {
    if (isAuthError) {
      setFilters((prev) => ({ ...prev, favourites: false, page: 1 }));
      toast.error("Please log in to view your favourites."); // shadcn sonner or your toast lib
    }
  }, [isAuthError]);

  const auctioneers = data?.data ?? [];
  const pagination = data?.pagination;
  const totalPages = pagination?.last_page ?? 1;

  const locations = [
    "all locations",
    ...Array.from(
      new Set(
        auctioneers
          .map((a) =>
            `${a.location.state ?? ""}${a.location.state && a.location.country ? " " : ""}${a.location.country ?? ""}`.trim().toLowerCase()
          )
          .filter(Boolean)
      )
    ),
  ];

  const commitSearch = () => {
    setFilters((prev) => ({ ...prev, search: searchInput, page: 1 }));
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") commitSearch();
  };

  const handleLocationChange = (value: string) => {
    setFilters((prev) => ({ ...prev, location: value, page: 1 }));
  };

  const handleFavouritesToggle = (value: boolean) => {
    setFilters((prev) => ({ ...prev, favourites: value, page: 1 }));
  };

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  const toggleFavorite = (id: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  };

  if (isError && !isAuthError) {
    return (
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
          <div className="h-16 w-16 rounded-full bg-destructive/10 flex items-center justify-center">
            <AlertCircle className="h-8 w-8 text-destructive" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground mb-1">Failed to load auctioneers</h2>
            <p className="text-sm text-muted-foreground max-w-sm">
              Something went wrong while fetching auctioneers. Please check your connection and try again.
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
    <main className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">Find Auctioneers</h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          {isLoading
            ? "Loading auctioneers..."
            : `${pagination?.total ?? 0} auctioneer${pagination?.total !== 1 ? "s" : ""} found`}
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-8">
        <div className="relative flex-1 min-w-50 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by auctioneer name..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={handleSearchKeyDown}
            className="pl-9 pr-20 text-sm md:text-base"
            disabled={isLoading}
          />
          <Button
            size="sm"
            className="absolute right-1.5 top-1/2 -translate-y-1/2 h-7"
            onClick={commitSearch}
            disabled={isLoading}
          >
            Search
          </Button>
        </div>
        <Select
          value={filters.location}
          onValueChange={handleLocationChange}
          disabled={isLoading}
        >
          <SelectTrigger className="w-full sm:w-50">
            <SelectValue placeholder="Filter by location" />
          </SelectTrigger>
          <SelectContent>
            {locations.map((loc) => (
              <SelectItem key={loc} value={loc} className="capitalize">
                {loc}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="flex gap-2">
          <Button
            variant={!filters.favourites ? "default" : "outline"}
            onClick={() => handleFavouritesToggle(false)}
            disabled={isLoading}
          >
            All Auctioneers
          </Button>
          <Button
            variant={filters.favourites ? "default" : "outline"}
            onClick={() => handleFavouritesToggle(true)}
            disabled={isLoading}
          >
            <Star className="h-4 w-4 mr-2" />
            Favorites
          </Button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {isLoading
          ? Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
            <AuctioneerCardSkeleton key={i} />
          ))
          : auctioneers.map((auctioneer) => (
            <Link key={auctioneer.id} href={`/auctioneer/${auctioneer.id}`}>
              <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer group">
                <div className="flex items-start justify-between mb-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={auctioneer.avatar_url ?? undefined} />
                    <AvatarFallback className="text-lg">
                      {auctioneer.company_name[0]}
                    </AvatarFallback>
                  </Avatar>
                  <button
                    onClick={(e) => toggleFavorite(auctioneer.id, e)}
                    className="p-2 rounded-full hover:bg-muted transition-colors"
                  >
                    <Star
                      className={`h-5 w-5 ${favorites.includes(auctioneer.id)
                          ? "fill-primary text-primary"
                          : "text-muted-foreground"
                        }`}
                    />
                  </button>
                </div>
                <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors mb-2 line-clamp-1">
                  {auctioneer.company_name}
                </h3>
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5 shrink-0" />
                  {auctioneer.location.state || auctioneer.location.country
                    ? `${auctioneer.location.state ?? ""}${auctioneer.location.state && auctioneer.location.country ? ", " : ""}${auctioneer.location.country ?? ""}`
                    : "Unknown location"}
                </div>
              </Card>
            </Link>
          ))}
      </div>

      {/* Empty State */}
      {!isLoading && auctioneers.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
          <div className="h-14 w-14 rounded-full bg-muted flex items-center justify-center">
            <Search className="h-6 w-6 text-muted-foreground" />
          </div>
          <div>
            <p className="font-medium text-foreground mb-1">No auctioneers found</p>
            <p className="text-sm text-muted-foreground">
              Try adjusting your search or filter criteria.
            </p>
          </div>
        </div>
      )}

      {/* Pagination */}
      {!isLoading && totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => handlePageChange(Math.max(1, filters.page - 1))}
            disabled={filters.page === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="flex gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={filters.page === page ? "default" : "outline"}
                size="icon"
                onClick={() => handlePageChange(page)}
              >
                {page}
              </Button>
            ))}
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={() => handlePageChange(Math.min(totalPages, filters.page + 1))}
            disabled={filters.page === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </main>
  );
};

export default AuctioneersSearch;