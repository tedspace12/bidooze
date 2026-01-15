'use client';

import { useState } from "react";
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
import { Search, Star, MapPin, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

const mockAuctioneers = [
  { id: "1", name: "Christie's Auction House", location: "New York, NY", avatar: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=100&h=100&fit=crop", isFavorite: true },
  { id: "2", name: "Sotheby's International", location: "London, UK", avatar: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=100&h=100&fit=crop", isFavorite: false },
  { id: "3", name: "Heritage Auctions", location: "Dallas, TX", avatar: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=100&h=100&fit=crop", isFavorite: true },
  { id: "4", name: "Bonhams Fine Art", location: "Los Angeles, CA", avatar: "https://images.unsplash.com/photo-1554469384-e58fac16e23a?w=100&h=100&fit=crop", isFavorite: false },
  { id: "5", name: "Phillips Auctioneers", location: "Hong Kong", avatar: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=100&h=100&fit=crop", isFavorite: false },
  { id: "6", name: "Doyle New York", location: "New York, NY", avatar: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=100&h=100&fit=crop", isFavorite: true },
  { id: "7", name: "Skinner Auctioneers", location: "Boston, MA", avatar: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=100&h=100&fit=crop", isFavorite: false },
  { id: "8", name: "Hindman Auctions", location: "Chicago, IL", avatar: "https://images.unsplash.com/photo-1554469384-e58fac16e23a?w=100&h=100&fit=crop", isFavorite: false },
  { id: "9", name: "Freeman's Auction", location: "Philadelphia, PA", avatar: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=100&h=100&fit=crop", isFavorite: true },
  { id: "10", name: "Wright Auction House", location: "Chicago, IL", avatar: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=100&h=100&fit=crop", isFavorite: false },
  { id: "11", name: "Rago Arts and Auction", location: "Lambertville, NJ", avatar: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=100&h=100&fit=crop", isFavorite: false },
  { id: "12", name: "Leslie Hindman", location: "Milwaukee, WI", avatar: "https://images.unsplash.com/photo-1554469384-e58fac16e23a?w=100&h=100&fit=crop", isFavorite: false },
];

const locations = [
  "All Locations",
  "New York, NY",
  "London, UK",
  "Dallas, TX",
  "Los Angeles, CA",
  "Hong Kong",
  "Boston, MA",
  "Chicago, IL",
  "Philadelphia, PA",
];

const AuctioneersSearch = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [locationFilter, setLocationFilter] = useState("All Locations");
  const [showFavorites, setShowFavorites] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [favorites, setFavorites] = useState<string[]>(
    mockAuctioneers.filter(a => a.isFavorite).map(a => a.id)
  );
  const itemsPerPage = 8;

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setFavorites(prev =>
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );
  };

  const filteredAuctioneers = mockAuctioneers.filter(auctioneer => {
    const matchesSearch = auctioneer.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLocation = locationFilter === "All Locations" || auctioneer.location === locationFilter;
    const matchesFavorites = !showFavorites || favorites.includes(auctioneer.id);
    return matchesSearch && matchesLocation && matchesFavorites;
  });

  const totalPages = Math.ceil(filteredAuctioneers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedAuctioneers = filteredAuctioneers.slice(startIndex, startIndex + itemsPerPage);

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">Find Auctioneers</h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          {filteredAuctioneers.length} auctioneer{filteredAuctioneers.length !== 1 ? "s" : ""} found
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-8">
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by auctioneer name..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="pl-9 text-sm md:text-base"
          />
        </div>
        <Select
          value={locationFilter}
          onValueChange={(value) => {
            setLocationFilter(value);
            setCurrentPage(1);
          }}
        >
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Filter by location" />
          </SelectTrigger>
          <SelectContent>
            {locations.map(loc => (
              <SelectItem key={loc} value={loc}>{loc}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="flex gap-2">
          <Button
            variant={!showFavorites ? "default" : "outline"}
            onClick={() => {
              setShowFavorites(false);
              setCurrentPage(1);
            }}
          >
            All Auctioneers
          </Button>
          <Button
            variant={showFavorites ? "default" : "outline"}
            onClick={() => {
              setShowFavorites(true);
              setCurrentPage(1);
            }}
          >
            <Star className="h-4 w-4 mr-2" />
            Favorites
          </Button>
        </div>
      </div>

      {/* Auctioneers Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {paginatedAuctioneers.map(auctioneer => (
          <Link key={auctioneer.id} href={`/auctioneer/${auctioneer.id}`}>
            <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer group">
              <div className="flex items-start justify-between mb-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={auctioneer.avatar} />
                  <AvatarFallback className="text-lg">{auctioneer.name[0]}</AvatarFallback>
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
                {auctioneer.name}
              </h3>
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <MapPin className="h-3.5 w-3.5" />
                {auctioneer.location}
              </div>
            </Card>
          </Link>
        ))}
      </div>

      {/* Empty State */}
      {paginatedAuctioneers.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No auctioneers found matching your criteria.</p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="flex gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
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
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </main>
  );
};

export default AuctioneersSearch;
