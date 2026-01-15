'use client';

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import AuctionHeader from "./components/AuctionHeader";
import FeaturedLotsSlider from "./components/FeaturedLotsSlider";
import LotsGrid from "./components/LotsGrid";
import AuctionInfo from "./components/AuctionInfo";

// Mock auction data
const mockAuction = {
  id: "1",
  title: "Classic & Vintage Automobiles Auction",
  status: "live" as const,
  auctioneer: {
    name: "Heritage Auctions",
    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop",
    address: "2801 W Airport Freeway, Dallas, TX 75261",
    phone: "+1 (214) 528-3500",
    email: "info@heritageauctions.com",
    socialLinks: {
      facebook: "https://facebook.com/heritageauctions",
      twitter: "https://twitter.com/heritageauction",
      instagram: "https://instagram.com/heritageauctions",
    },
  },
  startDate: "2024-12-25",
  endDate: "2025-01-02",
  description: "Discover a curated collection of classic and vintage automobiles from prestigious collections worldwide. This auction features rare finds from the golden age of motoring.",
  fullDescription: `Welcome to our premier Classic & Vintage Automobiles Auction, featuring an exceptional selection of rare and collectible vehicles from around the world.

This auction showcases over 150 lots of classic cars, vintage motorcycles, and automotive memorabilia. From pre-war classics to muscle cars of the 1960s and 70s, there's something for every collector.

Highlights include a 1967 Ferrari 275 GTB/4, a 1955 Mercedes-Benz 300SL Gullwing, and a matching-numbers 1970 Plymouth Hemi 'Cuda. Each vehicle has been carefully vetted by our team of experts.

All vehicles come with detailed condition reports and provenance documentation where available.`,
  buyersPremium: [
    { startRange: 0, endRange: 100000, percentage: 25 },
    { startRange: 100001, endRange: 1000000, percentage: 20 },
    { startRange: 1000001, endRange: null, percentage: 12 },
  ],
  bidIncrements: [
    { startRange: 0, endRange: 99, increment: 5 },
    { startRange: 100, endRange: 499, increment: 10 },
    { startRange: 500, endRange: 999, increment: 25 },
    { startRange: 1000, endRange: 4999, increment: 50 },
    { startRange: 5000, endRange: 24999, increment: 100 },
    { startRange: 25000, endRange: 99999, increment: 500 },
    { startRange: 100000, endRange: null, increment: 1000 },
  ],
  shippingInfo: "Shipping available for all vehicles. Buyer is responsible for arranging and paying for shipping. We can recommend trusted automotive transport companies.",
  termsAndConditions: `1. All sales are final. No returns or refunds.
2. Buyer's premium applies to all purchases.
3. Payment must be made within 7 days of auction close.
4. Vehicles must be picked up or shipped within 14 days.
5. All vehicles sold as-is, where-is.
6. Title transfer is the responsibility of the buyer.
7. We reserve the right to cancel any bid or sale.`,
};

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
  },
];

const AuctionDetails = () => {
  //   const { id } = useParams();
  const [activeTab, setActiveTab] = useState("catalog");

  const featuredLots = mockLots.filter((lot) => lot.featured);

  return (
    <main>
      <div className="container mx-auto px-4 py-4 md:py-6">
        {/* Breadcrumb */}
        <Breadcrumb className="mb-4 md:mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/auctions">Auctions</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{mockAuction.title}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Auction Header */}
        <AuctionHeader auction={mockAuction} isRegistered />

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-8">
          <TabsList className="w-full justify-start border-b border-border rounded-none h-auto p-0 bg-transparent">
            <TabsTrigger
              value="catalog"
              className="rounded-none border-b-2 data-[state=active]:border-b-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-6 py-3"
            >
              Catalog
            </TabsTrigger>
            <TabsTrigger
              value="info"
              className="rounded-none border-b-2 data-[state=active]:border-b-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-6 py-3"
            >
              Auction Information
            </TabsTrigger>
          </TabsList>

          <TabsContent value="catalog" className="mt-6">
            {/* Featured Lots */}
            <FeaturedLotsSlider lots={featuredLots} />

            {/* Lots Grid */}
            <LotsGrid lots={mockLots} isRegistered />
          </TabsContent>

          <TabsContent value="info" className="mt-6">
            <AuctionInfo auction={mockAuction} />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
};

export default AuctionDetails;