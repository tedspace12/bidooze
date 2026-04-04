'use client';

import { useState } from "react";
import {
    Breadcrumb, BreadcrumbItem, BreadcrumbLink,
    BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
import CategoryGrid from "../home/components/CategoryGrid";
import TopPicks from "../home/components/TopPicks";
import HotAuctions from "../home/components/HotAuctions";
import StateFeaturedAuctions from "./components/StateFeaturedAuctions";
import { badgeForAuctionLifecycle, normalizeBuyerAuctionStatus } from "@/lib/auctionLifecycle";
import Link from "next/link";
import {
    AlertCircle, Clock, Layers, MapPin, Share2,
    Compass, Sparkles, ChevronLeft, ChevronRight
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useParams } from "next/navigation";
import { useAuctionsByLocation, useStateFeatured } from "./hooks/useAuctionsByLocation";
import { unitedStatesMap, canadaMap } from "./constants/data";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import ListingImage from "@/components/shared/listing-image";

const ITEMS_PER_PAGE = 12;

function getStateCode(stateName: string): string | null {
    const allStates = [...unitedStatesMap, ...canadaMap];
    return allStates.find((s) => s.name.toLowerCase() === stateName.toLowerCase())?.id ?? null;
}

function formatDate(iso: string): string {
    return new Date(iso).toLocaleDateString("en-US", {
        month: "short", day: "numeric", year: "numeric",
    });
}

const AuctionCardSkeleton = () => (
    <Card className="overflow-hidden">
        <div className="h-44 bg-muted animate-pulse" />
        <div className="p-4 space-y-3">
            <div className="h-5 w-3/4 bg-muted animate-pulse rounded" />
            <div className="h-4 w-1/2 bg-muted animate-pulse rounded" />
            <div className="h-4 w-2/3 bg-muted animate-pulse rounded" />
        </div>
    </Card>
);


function getPaginationRange(current: number, total: number) {
    const delta = 2; // pages around current
    const range = [];

    const start = Math.max(1, current - delta);
    const end = Math.min(total, current + delta);

    if (start > 1) {
        range.push(1);
        if (start > 2) range.push("...");
    }

    for (let i = start; i <= end; i++) {
        range.push(i);
    }

    if (end < total) {
        if (end < total - 1) range.push("...");
        range.push(total);
    }

    return range;
}

const SelectedStateAuctions = () => {
    const params = useParams();
    const stateName = decodeURIComponent(String(params.state ?? ""));
    const stateCode = getStateCode(stateName);

    const [currentPage, setCurrentPage] = useState(1);

    const { data: featuredData, isLoading: featuredLoading } = useStateFeatured(stateCode);
    const featuredSlots = featuredData?.data ?? [];

    const { data, isLoading, isError } = useAuctionsByLocation({
        state: stateCode ?? undefined,
        per_page: ITEMS_PER_PAGE,
        page: currentPage,
    });

    const auctions = data?.data ?? [];
    const pagination = data?.pagination;
    const totalPages = pagination?.last_page ?? 1;

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <main className="container mx-auto py-6 md:py-8">
            {/* Breadcrumb */}
            <Breadcrumb className="mb-6 px-4">
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/">Home</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/auctions/state">Auctions by State</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>{stateName}</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-2 px-4">
                Live & Online Auctions in {stateName}
            </h1>
            <p className="text-sm text-muted-foreground px-4 mb-8">
                {pagination
                    ? `${pagination.total} auction${pagination.total !== 1 ? "s" : ""} found`
                    : "Browsing auctions in this area"}
            </p>

            {/* ── 1. Featured slots (always first) ─────────────────────────────── */}
            <StateFeaturedAuctions
                stateCode={stateCode}
                stateName={stateName}
                isLoading={featuredLoading}
                slots={featuredSlots}
            />

            {/* ── 2. All auctions paginated grid ───────────────────────────────── */}
            <section className="px-4 mt-10">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h2 className="text-lg md:text-xl font-semibold text-foreground">All Auctions</h2>
                        {!isLoading && pagination && (
                            <p className="text-sm text-muted-foreground">
                                Page {currentPage} of {totalPages}
                            </p>
                        )}
                    </div>
                </div>

                {/* Error */}
                {isError && (
                    <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
                        <div className="h-14 w-14 rounded-full bg-destructive/10 flex items-center justify-center">
                            <AlertCircle className="h-7 w-7 text-destructive" />
                        </div>
                        <div>
                            <p className="font-medium text-foreground mb-1">Failed to load auctions</p>
                            <p className="text-sm text-muted-foreground">Something went wrong. Please try again.</p>
                        </div>
                        <Button variant="outline" onClick={() => window.location.reload()}>Try again</Button>
                    </div>
                )}

                {/* Loading skeleton */}
                {isLoading && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
                            <AuctionCardSkeleton key={i} />
                        ))}
                    </div>
                )}

                {/* Empty state */}
                {!isLoading && !isError && auctions.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-20 text-center relative">
                        <div className="absolute inset-0 flex justify-center pointer-events-none">
                            <div className="w-72 h-72 bg-primary/10 blur-3xl rounded-full opacity-40" />
                        </div>
                        <div className="relative h-20 w-20 rounded-2xl bg-linear-to-br from-primary/20 to-primary/5 flex items-center justify-center mb-6 shadow-sm">
                            <MapPin className="h-10 w-10 text-primary" />
                        </div>
                        <h2 className="text-xl md:text-2xl font-semibold text-foreground mb-2">
                            No auctions in {stateName} yet
                        </h2>
                        <p className="text-muted-foreground max-w-md mb-6">
                            We couldn't find any live or upcoming auctions in this area right now.
                            Try exploring other locations or discover trending auctions instead.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3">
                            <Link href="/auctions/state">
                                <Button className="flex items-center gap-2">
                                    <Compass className="h-4 w-4" />
                                    Browse other states
                                </Button>
                            </Link>
                            <Link href="/auctions">
                                <Button variant="secondary" className="flex items-center gap-2">
                                    <Sparkles className="h-4 w-4" />
                                    View all auctions
                                </Button>
                            </Link>
                        </div>
                    </div>
                )}

                {/* Auction grid */}
                {!isLoading && !isError && auctions.length > 0 && (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
                            {auctions.map((auction) => {
                                const statusBadge = badgeForAuctionLifecycle(
                                    normalizeBuyerAuctionStatus(auction.status)
                                );
                                return (
                                    <Link key={auction.id} href={`/auction/${auction.id}`}>
                                        <Card className="overflow-hidden hover:shadow-lg transition-shadow group cursor-pointer h-full">
                                            <div className="relative h-44 overflow-hidden">
                                                <ListingImage
                                                    kind="auction"
                                                    src={auction.image_url}
                                                    alt={auction.name}
                                                    width={500}
                                                    height={400}
                                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                />
                                                <Badge className={`absolute top-3 left-3 ${statusBadge.className} text-[10px] md:text-xs`}>
                                                    {statusBadge.label}
                                                </Badge>
                                            </div>
                                            <div className="p-4">
                                                <div className="flex items-start justify-between gap-2 mb-2">
                                                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1 text-sm md:text-base">
                                                        {auction.name}
                                                    </h3>
                                                    <button
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            navigator.share?.({ title: auction.name, url: `/auction/${auction.id}` });
                                                        }}
                                                        className="p-1.5 rounded-full hover:bg-muted transition-colors shrink-0"
                                                    >
                                                        <Share2 className="h-3.5 w-3.5 text-muted-foreground" />
                                                    </button>
                                                </div>
                                                <div className="flex items-center gap-2 mb-2">
                                                    <Avatar className="h-5 w-5">
                                                        <AvatarFallback className="text-[10px]">
                                                            {auction.auctioneer.company_name[0]}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <span className="text-xs text-muted-foreground line-clamp-1">
                                                        {auction.auctioneer.company_name}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-2">
                                                    <Clock className="h-3 w-3 shrink-0" />
                                                    {formatDate(auction.auction_start_at)} – {formatDate(auction.auction_end_at)}
                                                </div>
                                                <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                                                    <div className="flex items-center gap-1">
                                                        <Layers className="h-3 w-3" />
                                                        {auction.lot_count} Lots
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <MapPin className="h-3 w-3" />
                                                        {auction.city}, {auction.state}
                                                    </div>
                                                </div>
                                            </div>
                                        </Card>
                                    </Link>
                                );
                            })}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex items-center justify-center gap-2 mt-6">

                                {/* Prev */}
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                </Button>

                                {/* Page numbers */}
                                <div className="flex items-center gap-1">
                                    {getPaginationRange(currentPage, totalPages).map((page, idx) =>
                                        page === "..." ? (
                                            <span key={idx} className="px-2 text-muted-foreground">
                                                ...
                                            </span>
                                        ) : (
                                            <Button
                                                key={page}
                                                variant={currentPage === page ? "default" : "outline"}
                                                size="icon"
                                                onClick={() => handlePageChange(Number(page))}
                                            >
                                                {page}
                                            </Button>
                                        )
                                    )}
                                </div>

                                {/* Next */}
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                >
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                            </div>
                        )}
                    </>
                )}
            </section>

            <div className="mt-16">
                <CategoryGrid />
                <TopPicks />
                <HotAuctions />
            </div>
        </main>
    );
};

export default SelectedStateAuctions;
