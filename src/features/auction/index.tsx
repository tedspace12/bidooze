'use client';

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useParams } from "next/navigation";
import AuctionHeader from "./components/AuctionHeader";
import FeaturedLotsSlider from "./components/FeaturedLotsSlider";
import LotsGrid from "./components/LotsGrid";
import AuctionInfo from "./components/AuctionInfo";
import { useAuction } from "./hooks/useAuction";
import type { AuctionDetailsResponse, AuctionLotsResponse } from "./types";
import { normalizeBuyerAuctionStatus } from "@/lib/auctionLifecycle";
import { resolveListingImageSrc } from "@/lib/listingImageFallbacks";

const toHeaderAuction = (details: AuctionDetailsResponse) => {
  const location = details.auctioneer.location;
  const address = [
    location?.address_line_1,
    location?.city,
    location?.state,
    location?.country,
  ]
    .filter(Boolean)
    .join(", ");

  const socialLinks: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
  } = {};
  (details.auctioneer.socials ?? []).forEach((social) => {
    if (!social.platform || !social.url) return;
    if (social.platform === "facebook") socialLinks.facebook = social.url;
    if (social.platform === "twitter") socialLinks.twitter = social.url;
    if (social.platform === "instagram") socialLinks.instagram = social.url;
  });

  return {
    id: String(details.id),
    title: details.name,
    status: normalizeBuyerAuctionStatus(details.status),
    auctioneer: {
      name: details.auctioneer.company_name,
      avatar: details.auctioneer.avatar ?? "",
      address: address || "—",
      phone: details.auctioneer.number || "—",
      email: details.auctioneer.email || "—",
      socialLinks,
    },
    startDate: details.start_date,
    endDate: details.end_date,
    description: details.description || "",
    fullDescription: details.description || "",
    buyersPremium: [],
    bidIncrements: (details.bid_increments ?? []).map((item) => ({
      startRange: item.minimum ?? 0,
      endRange: item.maximum ?? null,
      increment: item.increment ?? 0,
    })),
    shippingInfo: details.shipping_info || "No shipping information available.",
    termsAndConditions:
      details.terms_and_condition || "No terms and conditions available.",
  };
};

const toLots = (
  lotsResponse: AuctionLotsResponse | undefined,
  details: AuctionDetailsResponse | undefined
) => {
  const normalizedAuctionStatus = normalizeBuyerAuctionStatus(
    lotsResponse?.meta?.auction_status ?? details?.status ?? ""
  );
  return (lotsResponse?.data ?? []).map((lot) => {
    const isClosed =
      lot.status === "closed" ||
      lot.status === "sold" ||
      normalizedAuctionStatus === "closed";

    const estimateLow = Number(lot.estimate_low ?? 0);
    const estimateHigh = Number(lot.estimate_high ?? 0);

    return {
      id: String(lot.id),
      lotNumber: Number(lot.lot_number) || lot.id,
      title: lot.title,
      image: resolveListingImageSrc(lot.image_url, "lot"),
      currentBid: Number(lot.current_bid ?? 0),
      estimateLow,
      estimateHigh,
      bids: lot.total_bids_count ?? 0,
      status: (isClosed ? "closed" : "open") as "open" | "closed",
      realizedPrice: lot.final_price ?? undefined,
      featured: false,
      shippingAvailable: lot.shipping_availability === "available",
    };
  });
};

const AuctionDetails = () => {
  const params = useParams<{ id: string }>();
  const identifier = params?.id;
  const [activeTab, setActiveTab] = useState("catalog");
  const { useAuctionDetails, useAuctionLots } = useAuction(identifier);
  const detailsQuery = useAuctionDetails();
  const lotsQuery = useAuctionLots();

  const mappedAuction = detailsQuery.data ? toHeaderAuction(detailsQuery.data) : null;
  const mappedLots = toLots(lotsQuery.data, detailsQuery.data);
  const fallbackFeaturedLots = mappedLots.filter((lot) => lot.status === "open").slice(0, 4);
  const featuredLots =
    (detailsQuery.data?.featured_lots ?? []).map((lot) => ({
      id: String(lot.id),
      lotNumber: Number(lot.lot_number) || lot.id,
      title: lot.title,
      image: resolveListingImageSrc(lot.image_url, "lot"),
      currentBid: Number(lot.current_bid ?? 0),
      estimateLow: 0,
      estimateHigh: 0,
      status: "open" as const,
      realizedPrice: undefined,
    }));
  const featuredLotsForUi = featuredLots.length > 0 ? featuredLots : fallbackFeaturedLots;

  const isRegistered =
    detailsQuery.data?.registration_status != null ||
    lotsQuery.data?.meta?.registration_status != null;

  const isLoading = detailsQuery.isLoading || lotsQuery.isLoading;
  const isError = detailsQuery.isError || lotsQuery.isError;

  return (
    <main>
      <div className="container mx-auto px-4 py-4 md:py-6">
        {!identifier ? (
          <div className="text-center py-12 md:py-16 bg-card border border-border rounded-xl">
            <p className="text-base md:text-lg text-muted-foreground">
              Missing auction identifier.
            </p>
          </div>
        ) : isLoading ? (
          <div className="space-y-4 md:space-y-6">
            <div className="h-24 bg-muted rounded-lg animate-pulse" />
            <div className="h-64 bg-muted rounded-lg animate-pulse" />
          </div>
        ) : isError || !mappedAuction ? (
          <div className="text-center py-12 md:py-16 bg-card border border-border rounded-xl">
            <p className="text-red-500 font-medium text-base md:text-lg">
              Error loading auction
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Failed to fetch auction details. Please try again.
            </p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => {
                detailsQuery.refetch();
                lotsQuery.refetch();
              }}
            >
              Retry
            </Button>
          </div>
        ) : (
          <>
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
              <BreadcrumbPage>{mappedAuction.title}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Auction Header */}
        <AuctionHeader auction={mappedAuction} isRegistered={isRegistered} />

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
            <FeaturedLotsSlider lots={featuredLotsForUi} auctionId={mappedAuction.id} />

            {/* Lots Grid */}
            <LotsGrid lots={mappedLots} isRegistered={isRegistered} />
          </TabsContent>

          <TabsContent value="info" className="mt-6">
            <AuctionInfo auction={mappedAuction} />
          </TabsContent>
        </Tabs>
          </>
        )}
      </div>
    </main>
  );
};

export default AuctionDetails;
