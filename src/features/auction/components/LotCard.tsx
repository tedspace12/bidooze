import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Gavel, Eye, EyeOff, Truck, Package } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
// import Link from "next/link";
import { toast } from "sonner";
import BidConfirmationModal from "@/features/lot/components/modal/BidConfirmationModal";

interface LotCardProps {
    lot: {
        id: string;
        lotNumber: number;
        title: string;
        image: string;
        currentBid: number;
        estimateLow: number;
        estimateHigh: number;
        bids: number;
        status: "open" | "closed";
        realizedPrice?: number;
        timeRemaining?: string;
        maxBid?: number;
        shippingAvailable?: boolean;
        auctionName?: string;
    };
    viewMode?: "grid" | "list";
    isRegistered?: boolean;
    auctionId?: string;
    showAuctionName?: boolean;
    showMaxBid?: boolean;
}

const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(price);
};

const LotCard = ({
    lot,
    viewMode = "grid",
    isRegistered = false,
    auctionId = "1",
    showAuctionName = false,
    showMaxBid = false
}: LotCardProps) => {
    const [isWatchlisted, setIsWatchlisted] = useState(false);
    const [bidModalOpen, setBidModalOpen] = useState(false);
    const router = useRouter();

    // Calculate next bid (current + typical 10% increment or minimum increment)
    const bidIncrement = Math.max(Math.ceil(lot.currentBid * 0.1), 100);
    const nextBid = lot.status === "open"
        ? lot.currentBid + bidIncrement
        : 0;

    const handleWatchlist = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsWatchlisted(!isWatchlisted);
        toast(isWatchlisted ? "Removed from watchlist" : "Added to watchlist", {
            description: isWatchlisted
                ? "This lot has been removed from your watchlist."
                : "You'll be notified of updates on this lot.",
        });
    };

    const handlePlaceBid = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!isRegistered) {
            // Redirect to registration page with lot context
            router.push(`/auction/register?source=lot&id=${lot.id}&auctionId=${auctionId}`);
        } else {
            // Open bid confirmation modal
            setBidModalOpen(true);
        }
    };

    const lotDataForModal = {
        id: lot.id,
        lotId: `LOT-${lot.lotNumber}`,
        title: lot.title,
        images: [lot.image, lot.image, lot.image, lot.image],
        currentBid: lot.currentBid,
        minBidIncrement: bidIncrement,
        buyersPremium: "15%",
    };

    const shippingAvailable = lot.shippingAvailable ?? true;

    if (viewMode === "list") {
        return (
            <>
                <Card className="overflow-hidden hover:shadow-lg transition-shadow group flex flex-row">
                    {/* Image */}
                    <div className="relative w-40 md:w-52 shrink-0 aspect-square">
                        <Image
                            src={lot.image}
                            alt={lot.title}
                            fill
                            className="object-cover"
                        />
                        <Badge className="absolute top-2 left-2 bg-background/90 text-foreground backdrop-blur-sm text-xs">
                            Lot #{lot.lotNumber}
                        </Badge>
                        <button
                            onClick={handleWatchlist}
                            className="absolute top-2 right-2 p-1.5 rounded-full bg-background/90 backdrop-blur-sm hover:bg-background transition-colors"
                        >
                            {isWatchlisted ? (
                                <Eye className="h-3.5 w-3.5 text-primary" />
                            ) : (
                                <EyeOff className="h-3.5 w-3.5 text-foreground" />
                            )}
                        </button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="flex-1">
                            {showAuctionName && lot.auctionName && (
                                <p className="text-xs text-muted-foreground mb-1">{lot.auctionName}</p>
                            )}
                            <h3 className="font-medium text-foreground line-clamp-1 mb-1">
                                {lot.title}
                            </h3>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                                <span className="flex items-center gap-1">
                                    <Gavel className="h-3.5 w-3.5" />
                                    {lot.bids} bids
                                </span>
                                {lot.timeRemaining && lot.status === "open" && (
                                    <span className="text-red-800 animate-pulse">{lot.timeRemaining}</span>
                                )}
                                <span>
                                    Est: {formatPrice(lot.estimateLow)} - {formatPrice(lot.estimateHigh)}
                                </span>
                                <span className="flex items-center gap-1">
                                    {shippingAvailable ? (
                                        <>
                                            <Truck className="h-3.5 w-3.5 text-emerald-500" />
                                            <span className="text-emerald-600">Ships</span>
                                        </>
                                    ) : (
                                        <>
                                            <Package className="h-3.5 w-3.5" />
                                            <span>Pickup</span>
                                        </>
                                    )}
                                </span>
                            </div>
                            {lot.status === "closed" && (
                                <Badge variant="destructive" className="text-xs">
                                    Bidding Closed
                                </Badge>
                            )}
                        </div>

                        <div className="flex items-center gap-4">
                            {lot.status === "closed" ? (
                                <div className="text-right">
                                    <p className="text-xs text-muted-foreground">Realized</p>
                                    <p className="text-lg font-semibold text-foreground">
                                        {formatPrice(lot.realizedPrice || 0)}
                                    </p>
                                </div>
                            ) : (
                                <>
                                    <div className="text-right">
                                        <p className="text-xs text-muted-foreground">Current Bid</p>
                                        <p className="text-lg font-semibold text-foreground">
                                            {formatPrice(lot.currentBid)}
                                        </p>
                                        {showMaxBid && lot.maxBid && (
                                            <p className="text-xs text-muted-foreground">
                                                Your max: {formatPrice(lot.maxBid)}
                                            </p>
                                        )}
                                    </div>
                                    <Button className="gap-2 shrink-0" onClick={handlePlaceBid}>
                                        <Gavel className="h-4 w-4" />
                                        {isRegistered ? `Bid ${formatPrice(nextBid)}` : "Register to Bid"}
                                    </Button>
                                </>
                            )}
                        </div>
                    </div>
                </Card>
                {/* <Link href={`/lot/${lot.id}`}>
                </Link> */}
                <BidConfirmationModal
                    open={bidModalOpen}
                    onOpenChange={setBidModalOpen}
                    lot={lotDataForModal}
                />
            </>
        );
    }

    return (
        <>
            {/* <Link href={`/lot/${lot.id}`}>
            </Link> */}
            <Card className="overflow-hidden hover:shadow-lg transition-shadow group h-full flex flex-col">
                {/* Image */}
                <div className="relative aspect-4/3">
                    <Image
                        src={lot.image}
                        alt={lot.title}
                        fill
                        className="object-cover"
                    />

                    {/* Lot Number Badge */}
                    <Badge className="absolute top-3 left-3 bg-background/90 text-foreground backdrop-blur-sm">
                        Lot #{lot.lotNumber}
                    </Badge>

                    {/* Status Badge for Closed */}
                    {lot.status === "closed" && (
                        <Badge variant={"destructive"} className="absolute bottom-3 left-3">
                            Bidding Closed
                        </Badge>
                    )}

                    {/* Watchlist Button */}
                    <button
                        onClick={handleWatchlist}
                        className="absolute top-3 right-3 p-2 rounded-full bg-background/90 backdrop-blur-sm hover:bg-background transition-colors"
                    >
                        {isWatchlisted ? (
                            <Eye className="h-4 w-4 text-primary" />
                        ) : (
                            <EyeOff className="h-4 w-4 text-foreground" />
                        )}
                    </button>

                    {/* Shipping Indicator */}
                    <div className="absolute bottom-3 right-3 flex items-center gap-1 px-2 py-1 rounded-md bg-background/90 backdrop-blur-sm text-xs">
                        {shippingAvailable ? (
                            <>
                                <Truck className="h-3 w-3 text-emerald-500" />
                                <span className="text-emerald-600">Ships</span>
                            </>
                        ) : (
                            <>
                                <Package className="h-3 w-3" />
                                <span>Pickup</span>
                            </>
                        )}
                    </div>
                </div>

                {/* Content */}
                <div className="p-4 flex-1 flex flex-col">
                    {/* Auction Name */}
                    {showAuctionName && lot.auctionName && (
                        <p className="text-xs text-muted-foreground mb-1 truncate">{lot.auctionName}</p>
                    )}

                    {/* Title */}
                    <h3 className="font-medium text-foreground line-clamp-2 min-h-10 mb-1">
                        {lot.title}
                    </h3>

                    {/* Bids Count & Time */}
                    <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
                        <span className="flex items-center gap-1">
                            <Gavel className="h-3.5 w-3.5" />
                            {lot.bids} bids
                        </span>
                        {lot.timeRemaining && lot.status === "open" && (
                            <span className="text-red-800 text-base animate-pulse">{lot.timeRemaining}</span>
                        )}
                    </div>

                    {/* Estimate */}
                    <div className="mb-3">
                        <p className="text-xs text-muted-foreground">Estimate</p>
                        <p className="text-sm text-foreground">
                            {formatPrice(lot.estimateLow)} - {formatPrice(lot.estimateHigh)}
                        </p>
                    </div>

                    {/* Price & Action */}
                    <div className="mt-auto">
                        {lot.status === "closed" ? (
                            <div>
                                <p className="text-xs text-muted-foreground">Realized Price</p>
                                <p className="text-lg font-semibold text-foreground">
                                    {formatPrice(lot.realizedPrice || 0)}
                                </p>
                            </div>
                        ) : (
                            <>
                                <div className="mb-3">
                                    <p className="text-xs text-muted-foreground">Current Bid</p>
                                    <p className="text-lg font-semibold text-foreground">
                                        {formatPrice(lot.currentBid)}
                                    </p>
                                    {showMaxBid && lot.maxBid && (
                                        <p className="text-xs text-muted-foreground">
                                            Your max: {formatPrice(lot.maxBid)}
                                        </p>
                                    )}
                                </div>
                                <Button
                                    className="w-full gap-2"
                                    onClick={handlePlaceBid}
                                >
                                    <Gavel className="h-4 w-4" />
                                    {isRegistered ? `Bid ${formatPrice(nextBid)}` : "Register to Bid"}
                                </Button>
                            </>
                        )}
                    </div>
                </div>
            </Card>
            <BidConfirmationModal
                open={bidModalOpen}
                onOpenChange={setBidModalOpen}
                lot={lotDataForModal}
            />
        </>
    );
};

export default LotCard;