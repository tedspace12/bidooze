'use client';

import { useParams, useSearchParams } from "next/navigation";
import LotHeader from "./components/LotHeader";
import ImageGallery from "./components/ImageGallery";
import AuctionDetails from "./components/AuctionDetails";
import BidSummary from "./components/BidSummary";
import BiddingActions from "./components/BiddingActions";
import AuctioneerInfo from "./components/AuctioneerInfo";
import ShippingInfo from "./components/ShippingInfo";
import BiddingNotice from "./components/BiddingNotice";
import RelatedLots from "./components/RelatedLots";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { useLot } from "./hooks/useLot";

const LotDetail = () => {
    const params = useParams<{ id: string }>();
    const searchParams = useSearchParams();
    const lotId = params?.id;
    const auctionId = searchParams.get("auctionId") ?? undefined;

    const { useLotDetails } = useLot(auctionId, lotId);
    const lotQuery = useLotDetails();

    if (!lotId) return null;

    const isLoading = lotQuery.isLoading;
    const isError = lotQuery.isError;
    const lot = lotQuery.data?.data;
    const lotMeta = lotQuery.data?.meta;

    if (!auctionId) {
        return (
            <>
                <div className="container mx-auto px-4 py-4">
                    <Breadcrumb>
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
                                <BreadcrumbPage className="truncate max-w-[200px]">Lot</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>
                <main className="container mx-auto px-4 pb-10 md:pb-12">
                    <div className="text-center py-12 md:py-16 bg-card border border-border rounded-xl">
                        <p className="text-muted-foreground">Missing auction id for this lot.</p>
                    </div>
                </main>
            </>
        );
    }

    if (isLoading) {
        return (
            <>
                <div className="container mx-auto px-4 py-4">
                    <div className="h-6 w-2/3 bg-muted rounded animate-pulse" />
                </div>
                <main className="container mx-auto px-4 pb-10 md:pb-12">
                    <div className="h-10 w-3/4 bg-muted rounded animate-pulse" />
                    <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 h-80 bg-muted rounded-xl animate-pulse" />
                        <div className="h-80 bg-muted rounded-xl animate-pulse" />
                    </div>
                </main>
            </>
        );
    }

    if (isError || !lot) {
        return (
            <>
                <div className="container mx-auto px-4 py-4">
                    <Breadcrumb>
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
                                <BreadcrumbPage className="truncate max-w-[200px]">Lot</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>
                <main className="container mx-auto px-4 pb-10 md:pb-12">
                    <div className="text-center py-12 md:py-16 bg-card border border-border rounded-xl">
                        <p className="text-red-500 font-medium">Error loading lot</p>
                        <p className="text-sm text-muted-foreground mt-2">Failed to fetch lot details. Please try again.</p>
                        <Button variant="outline" className="mt-4" onClick={() => lotQuery.refetch()}>
                            Retry
                        </Button>
                    </div>
                </main>
            </>
        );
    }

    const images = (lot.images ?? [])
        .slice()
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
        .map((img) => img.image_url)
        .filter(Boolean);
    if (images.length === 0 && lot.primary_image_url) images.push(lot.primary_image_url);

    const auctionLocation = [lot.auction.location.city, lot.auction.location.state, lot.auction.location.country]
        .filter(Boolean)
        .join(", ");

    const currency = lotMeta?.currency ?? "USD";
    const formatMoney = (amount: number) =>
        new Intl.NumberFormat(undefined, {
            style: "currency",
            currency,
            minimumFractionDigits: 0,
            maximumFractionDigits: 2,
        }).format(amount);

        const hasCurrentBid = lot.current_bid != null;

        const baseBid = hasCurrentBid
            ? Number(lot.current_bid)
            : Number(lot.starting_bid ?? 0);
        
        const increment = lot.bid_increment;
        
        const minBid =
            hasCurrentBid && increment != null && Number.isFinite(Number(increment))
                ? baseBid + Number(increment)
                : baseBid;

    const bidIncrementsRows =
        increment != null
            ? [
                  {
                      range: "Current price tier",
                      increment: formatMoney(Number(increment)),
                  },
              ]
            : [{ range: "Bid increment", increment: "—" }];

    const startTime =
        lot.bidding_starts_at ?? lot.auction.dates.effective_open_bidding_at;
    const endTime =
        lot.bidding_ends_at ?? lot.auction.dates.effective_close_bidding_at;

    const shippingCostDisplay =
        lot.shipping_cost != null
            ? formatMoney(Number(lot.shipping_cost))
            : "—";
    const pickupDisplay = lot.pickup_location?.trim() || "—";

    const lotData = {
        id: `LOT-${lot.lot_number}`,
        title: lot.title,
        images,
        currentBid: lot.current_bid != null ? Number(lot.current_bid) : null,
        startingBid: Number(lot.starting_bid ?? 0),
        bidsCount: lot.total_bids_count ?? 0,
        endTime,
        startTime,
        closeType: lot.soft_close_seconds ? "Soft Close" : "Hard Close",
        shippingAvailable: lot.shipping_availability === "available",
        description: lot.description,
        auction: {
            name: lot.auction.name,
            type: lot.auction.type,
            date: new Date(lot.auction.dates.auction_end_at).toLocaleDateString(),
            time: new Date(lot.auction.dates.auction_end_at).toLocaleTimeString(),
            location: auctionLocation || "—",
            buyerPremium: lot.auction.buyer_premium_percentage != null ? `${lot.auction.buyer_premium_percentage}%` : "—",
        },
        auctioneer: {
            name: lot.auctioneer.company_name,
            logo: lot.auctioneer.avatar_url ?? "",
            rating: 4.9,
            totalAuctions: lot.auctioneer.total_auctions ?? 0,
        },
        bidIncrements: bidIncrementsRows,
        minBid,
        buyersPremiumLabel:
            lot.auction.buyer_premium_percentage != null
                ? `${lot.auction.buyer_premium_percentage}%`
                : "—",
    };

    return (
        <>
            {/* Breadcrumb */}
            <div className="container mx-auto px-4 py-4">
                <Breadcrumb>
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
                            <BreadcrumbLink href={`/auction/${auctionId}`}>{lot.auction.name}</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage className="truncate max-w-[200px]">{lotData.title}</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            </div>

            {/* Main Content */}
            <main className="container mx-auto px-4 pb-10 md:pb-12">
                <LotHeader
                    title={lotData.title}
                    lotId={lotData.id}
                />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-4 sm:mt-6">
                    {/* Left Column - Images & Details */}
                    <div className="lg:col-span-2 space-y-8">
                        <ImageGallery images={lotData.images} title={lotData.title} />

                        <div className="prose prose-lg max-w-none">
                            <h3 className="text-lg md:text-xl font-semibold text-foreground mb-4">Lot Description</h3>
                            <p className="text-sm md:text-base text-muted-foreground whitespace-pre-line leading-relaxed">
                                {lotData.description}
                            </p>
                        </div>

                        <AuctionDetails auction={lotData.auction} />
                    </div>

                    {/* Right Column - Bidding */}
                    <div className="space-y-4 md:space-y-6">
                        <BidSummary
                            currentBid={lotData.currentBid}
                            bidsCount={lotData.bidsCount}
                            endTime={lotData.endTime}
                            closeType={lotData.closeType}
                            shippingAvailable={lotData.shippingAvailable}
                        />

                        <BiddingActions
                            currentBid={lotData.currentBid}
                            minBid={lotData.minBid}
                            bidIncrements={lotData.bidIncrements}
                            startTime={lotData.startTime}
                            endTime={lotData.endTime}
                            id={lotData.id}
                            title={lotData.title}
                            images={lotData.images}
                            buyersPremiumLabel={lotData.buyersPremiumLabel}
                            currency={currency}
                        />

                        <AuctioneerInfo auctioneer={lotData.auctioneer} />

                        <ShippingInfo
                            shippingAvailable={lotData.shippingAvailable}
                            shippingCost={shippingCostDisplay}
                            pickupLocation={pickupDisplay}
                            shippingNotes=""
                        />

                        <BiddingNotice notice={lot.bidding_notice} />
                    </div>
                </div>

                <RelatedLots
                    auctionId={String(lot.auction.id)}
                    currentLotId={lot.id}
                />
            </main>
        </>
    );
};

export default LotDetail;
