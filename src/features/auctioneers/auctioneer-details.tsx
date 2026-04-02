'use client';

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  MapPin,
  Phone,
  Mail,
  Star,
  Grid3X3,
  List,
  Facebook,
  Twitter,
  Instagram,
  Linkedin
} from "lucide-react";
import AuctionCard from "../auctions/components/AuctionCard";
import Link from "next/link";
import { useIsMobile } from "@/hooks/use-mobile";
import FilterDrawer from "@/components/shared/FilterDrawer";

const mockAuctioneer = {
  id: "1",
  name: "Christie's Auction House",
  logo: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=200&h=200&fit=crop",
  address: "20 Rockefeller Plaza, New York, NY 10020, United States",
  phone: "+1 (212) 636-2000",
  email: "info@christies.com",
  description: "Christie's is a leading global art and luxury business. Renowned for its expert auctions and private sales, Christie's offers a full portfolio of global services to its clients, including art appraisal, art financing, international real estate and education.",
  socialLinks: {
    facebook: "https://facebook.com/christies",
    twitter: "https://twitter.com/christies",
    instagram: "https://instagram.com/christies",
    linkedin: "https://linkedin.com/company/christies",
  },
};

const mockAuctions = [
  {
    id: "1",
    title: "Impressionist and Modern Art Evening Sale",
    coverImage: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800&h=600&fit=crop",
    auctioneer: { name: "Christie's Auction House", avatar: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=100&h=100&fit=crop" },
    totalLots: 85,
    startDate: "2025-01-15",
    endDate: "2025-01-20",
    description: "Featuring masterworks by Monet, Renoir, and other luminaries of Impressionism.",
    lotImages: [
      "https://images.unsplash.com/photo-1578321272176-b7bbc0679853?w=100&h=100&fit=crop",
      "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=100&h=100&fit=crop",
      "https://images.unsplash.com/photo-1577720643272-265f09367456?w=100&h=100&fit=crop",
    ],
    status: "live" as const,
    shippingAvailable: true,
    location: "New York, NY",
  },
  {
    id: "2",
    title: "Contemporary Art Day Sale",
    coverImage: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800&h=600&fit=crop",
    auctioneer: { name: "Christie's Auction House", avatar: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=100&h=100&fit=crop" },
    totalLots: 120,
    startDate: "2025-02-01",
    endDate: "2025-02-05",
    description: "A vibrant selection of contemporary artworks from emerging and established artists.",
    lotImages: [
      "https://images.unsplash.com/photo-1578926288207-a90a5366759d?w=100&h=100&fit=crop",
      "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=100&h=100&fit=crop",
      "https://images.unsplash.com/photo-1578926288207-a90a5366759d?w=100&h=100&fit=crop",
    ],
    status: "scheduled" as const,
    shippingAvailable: true,
    location: "London, UK",
  },
  {
    id: "3",
    title: "Fine Jewelry and Watches",
    coverImage: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&h=600&fit=crop",
    auctioneer: { name: "Christie's Auction House", avatar: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=100&h=100&fit=crop" },
    totalLots: 200,
    startDate: "2024-12-20",
    endDate: "2024-12-22",
    description: "Exceptional diamonds, colored gemstones, and luxury timepieces.",
    lotImages: [
      "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=100&h=100&fit=crop",
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=100&h=100&fit=crop",
      "https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?w=100&h=100&fit=crop",
    ],
    status: "paused" as const,
    shippingAvailable: true,
    location: "Geneva, Switzerland",
    notices: "Extended viewing available by appointment only.",
  },
  {
    id: "4",
    title: "Asian Art Week",
    coverImage: "https://images.unsplash.com/photo-1578321272176-b7bbc0679853?w=800&h=600&fit=crop",
    auctioneer: { name: "Christie's Auction House", avatar: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=100&h=100&fit=crop" },
    totalLots: 150,
    startDate: "2024-11-01",
    endDate: "2024-11-10",
    description: "Rare ceramics, bronzes, and paintings from China, Japan, and Southeast Asia.",
    lotImages: [
      "https://images.unsplash.com/photo-1578321272176-b7bbc0679853?w=100&h=100&fit=crop",
      "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=100&h=100&fit=crop",
      "https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=100&h=100&fit=crop",
    ],
    status: "closed" as const,
    shippingAvailable: false,
    location: "Hong Kong",
  },
];

const statusOptions = [
  { value: "all", label: "All Auctions" },
  { value: "scheduled", label: "Scheduled (upcoming)" },
  { value: "live", label: "Live" },
  { value: "paused", label: "Paused" },
  { value: "closed", label: "Closed" },
];

const AuctioneerDetails = () => {
  //   const { id } = useParams();
  const [isFavorite, setIsFavorite] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [statusFilter, setStatusFilter] = useState("all");
  const isMobile = useIsMobile();

  const filteredAuctions = mockAuctions.filter(auction =>
    statusFilter === "all" || auction.status === statusFilter
  );

  const activeFilterCount = statusFilter !== "all" ? 1 : 0;

  const FilterContent = (
    <div className="space-y-4">
      <h4 className="text-sm font-medium text-foreground mb-3">Auction Status</h4>
      <div className="flex flex-col gap-2">
        {statusOptions.map(option => (
          <Button key={option.value} variant={statusFilter === option.value ? "default" : "outline"} size="sm" onClick={() => setStatusFilter(option.value)} className="justify-start">
            {option.label}
          </Button>
        ))}
      </div>
    </div>
  );

  return (
    <main className="container mx-auto px-4 py-6 md:py-8">
      {/* Auctioneer Header */}
      <div className="bg-card border border-border rounded-xl p-4 sm:p-6 md:p-8 mb-6 md:mb-8">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
          <Avatar className="h-20 w-20 sm:h-24 sm:w-24 md:h-32 md:w-32 shrink-0">
            <AvatarImage src={mockAuctioneer.logo} />
            <AvatarFallback className="text-2xl md:text-4xl">{mockAuctioneer.name[0]}</AvatarFallback>
          </Avatar>

          <div className="flex-1 text-center sm:text-left">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground">{mockAuctioneer.name}</h1>
              <Button variant={isFavorite ? "default" : "outline"} onClick={() => setIsFavorite(!isFavorite)} size="sm" className="w-full sm:w-auto shrink-0">
                <Star className={`h-4 w-4 mr-2 ${isFavorite ? "fill-current" : ""}`} />
                {isFavorite ? "Favorited" : "Add to Favorites"}
              </Button>
            </div>

            <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6">{mockAuctioneer.description}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 mb-4 sm:mb-6">
              <div className="flex items-start gap-2 sm:gap-3 justify-center sm:justify-start">
                <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground shrink-0 mt-0.5" />
                <span className="text-foreground text-sm">{mockAuctioneer.address}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                <Link href={`tel:${mockAuctioneer.phone}`} className="text-foreground hover:text-primary text-sm">
                  {mockAuctioneer.phone}
                </Link>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                <Link href={`mailto:${mockAuctioneer.email}`} className="text-foreground hover:text-primary text-sm">
                  {mockAuctioneer.email}
                </Link>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex gap-2 sm:gap-3 justify-center sm:justify-start">
              <Link href={mockAuctioneer.socialLinks.facebook} target="_blank" rel="noopener noreferrer"
                className="p-2 rounded-full bg-muted hover:bg-muted/80 transition-colors">
                <Facebook className="h-4 w-4 sm:h-5 sm:not-first:w-5 text-foreground" />
              </Link>
              <Link href={mockAuctioneer.socialLinks.twitter} target="_blank" rel="noopener noreferrer"
                className="p-2 rounded-full bg-muted hover:bg-muted/80 transition-colors">
                <Twitter className="h-4 w-4 sm:h-5 sm:w-5 text-foreground" />
              </Link>
              <Link href={mockAuctioneer.socialLinks.instagram} target="_blank" rel="noopener noreferrer"
                className="p-2 rounded-full bg-muted hover:bg-muted/80 transition-colors">
                <Instagram className="h-4 w-4 sm:h-5 sm:w-5 text-foreground" />
              </Link>
              <Link href={mockAuctioneer.socialLinks.linkedin} target="_blank" rel="noopener noreferrer"
                className="p-2 rounded-full bg-muted hover:bg-muted/80 transition-colors">
                <Linkedin className="h-4 w-4 sm:h-5 sm:w-5 text-foreground" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Auctions Section */}
      <div>
        <div className="flex flex-col gap-4 mb-6">
          <h2 className="text-xl md:text-2xl font-bold text-foreground">
            Auctions by {mockAuctioneer.name}
          </h2>

          <div className="flex items-center justify-between gap-3">
            {/* Status Filter */}
            {isMobile ? (
              <FilterDrawer title="Filter Auctions" activeFiltersCount={activeFilterCount} onClear={() => setStatusFilter("all")}>
                {FilterContent}
              </FilterDrawer>
            ) : (
              <div className="flex gap-2 flex-wrap">
                {statusOptions.map(option => (
                  <Button key={option.value} variant={statusFilter === option.value ? "default" : "outline"} size="sm" onClick={() => setStatusFilter(option.value)}>
                    {option.label}
                  </Button>
                ))}
              </div>
            )}

            {/* View Toggle */}
            <div className="hidden md:flex border border-border rounded-lg overflow-hidden shrink-0">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 ${viewMode === "grid" ? "bg-primary text-primary-foreground" : "bg-background hover:bg-muted"}`}
              >
                <Grid3X3 className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 ${viewMode === "list" ? "bg-primary text-primary-foreground" : "bg-background hover:bg-muted"}`}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Auctions */}
        {filteredAuctions.length > 0 ? (
          <div className={
            viewMode === "grid"
              ? "grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6"
              : "space-y-4 md:space-y-6"
          }>
            {filteredAuctions.map(auction => (
              <AuctionCard key={auction.id} auction={auction}viewMode={viewMode} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-card border border-border rounded-xl">
            <p className="text-muted-foreground">No auctions found with the selected status.</p>
          </div>
        )}
      </div>
    </main>
  );
};

export default AuctioneerDetails;
