import { useEffect, useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Info, AlertCircle, ChevronDown, ChevronUp } from "lucide-react";
import { toast } from "sonner";
import ListingImage from "@/components/shared/listing-image";
import { ensureListingImageSources } from "@/lib/listingImageFallbacks";
import { auctionService } from "@/features/auction/services/auctionService";

interface LotData {
    id: string;
    lotId: string;
    title: string;
    images: string[];
    currentBid: number;
    minBidIncrement: number;
    nextBid?: number;
    maxBid?: number;
    auctionId?: string;
    buyersPremium: string;
    auction?: {
        buyer_premium_percentage: number | null;
    };
    bidding?: {
      mode: string;
      allow_proxy: boolean;
      require_proxy: boolean;
      default_amount_type: string;
    };
}

interface BidConfirmationModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    lot: LotData;
}

const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(price);
};

const resolveApiErrorMessage = (error: any): string => {
    if (!error) return "Failed to place bid. Please try again.";
    if (typeof error === "string") return error;
    if (error.message && typeof error.message === "string") {
        if (error.errors) {
            const nestedErrors = Object.values(error.errors)
                .flatMap((val) => (Array.isArray(val) ? val : [val]))
                .filter((val): val is string => typeof val === "string");
            if (nestedErrors.length) return nestedErrors.join(" ");
        }
        return error.message;
    }
    if (error.errors) {
        const nestedErrors = Object.values(error.errors)
            .flatMap((val) => (Array.isArray(val) ? val : [val]))
            .filter((val): val is string => typeof val === "string");
        if (nestedErrors.length) return nestedErrors.join(" ");
    }
    if (error.error && typeof error.error === "string") return error.error;
    return "Failed to place bid. Please try again.";
};

const BidConfirmationModal = ({ open, onOpenChange, lot }: BidConfirmationModalProps) => {
    const resolvedImages = ensureListingImageSources(lot.images, "lot");
    const [selectedImage, setSelectedImage] = useState(0);
    const minBid = lot.nextBid ?? (lot.currentBid + lot.minBidIncrement);
    const [bidAmount, setBidAmount] = useState(minBid.toString());
    const [agreeToTerms, setAgreeToTerms] = useState(false);
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [maxBidAmount, setMaxBidAmount] = useState("");
    const [enableProxy, setEnableProxy] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleBidChange = (value: string) => {
        // Allow only numeric input
        const numericValue = value.replace(/[^0-9]/g, "");
        setBidAmount(numericValue);
    };

    const parsedBidAmount = parseInt(bidAmount) || 0;
    const parsedMaxBidAmount = parseInt(maxBidAmount) || 0;
    const isValidBid = parsedBidAmount >= minBid;
    const isValidMaxBid = !enableProxy || (parsedMaxBidAmount >= parsedBidAmount && parsedMaxBidAmount > 0);
    const canSubmit = isValidBid && isValidMaxBid && agreeToTerms;

    useEffect(() => {
        setSelectedImage((prev) => Math.min(prev, resolvedImages.length - 1));
    }, [resolvedImages.length]);

    useEffect(() => {
        setBidAmount(minBid.toString());
        setAgreeToTerms(false);
        setShowAdvanced(false);
        setMaxBidAmount("");
        setEnableProxy(false);
    }, [minBid]);

    const handleConfirmBid = async () => {
        if (!canSubmit || isSubmitting) return;

        setIsSubmitting(true);

        try {
            const bidData = {
                amount: parsedBidAmount,
                bid_amount_type: (enableProxy ? "maximum_up_to" : "fixed_flat") as "fixed_flat" | "maximum_up_to",
                ...(enableProxy && parsedMaxBidAmount > 0 && { max_amount: parsedMaxBidAmount }),
            };

            const response = await auctionService.placeBid(lot.auctionId || "1", lot.id, bidData);

            // Handle different bid statuses
            switch (response.bid.status) {
                case "accepted":
                    toast("Bid Placed Successfully!", {
                        description: enableProxy
                            ? `Your maximum bid of ${formatPrice(parsedMaxBidAmount)} has been set.`
                            : `Your bid of ${formatPrice(parsedBidAmount)} has been placed.`,
                    });
                    break;
                case "pending_approval":
                    toast("Bid Pending Approval", {
                        description: "Your bid is pending approval and will be processed shortly.",
                    });
                    break;
                case "proxy_active":
                    toast("Proxy Bid Active", {
                        description: "Your maximum bid is set. We'll automatically bid for you.",
                    });
                    break;
                default:
                    toast("Bid Submitted", {
                        description: response.message || "Your bid has been submitted.",
                    });
            }

            onOpenChange(false);
        } catch (error: any) {
            const errorMessage = resolveApiErrorMessage(error);
            toast.error("Bid Failed", {
                description: errorMessage,
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-2xl max-h-[90vh] p-0 overflow-hidden">
                <ScrollArea className="max-h-[90vh]">
                    <div className="p-6">
                        <DialogHeader className="mb-4">
                            <DialogTitle>Confirm Your Bid</DialogTitle>
                        </DialogHeader>

                        {/* Lot Image Gallery */}
                        <div className="mb-4">
                            <ListingImage
                                kind="lot"
                                src={resolvedImages[selectedImage]}
                                alt={lot.title}
                                width={500}
                                height={500}
                                className="w-full aspect-6/3 object-cover rounded-lg"
                            />
                            {resolvedImages.length > 1 && (
                                <div className="flex gap-2 mt-2">
                                    {resolvedImages.map((img, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setSelectedImage(idx)}
                                            className={`w-14 h-10 rounded-md overflow-hidden border-2 transition-colors ${selectedImage === idx
                                                ? "border-primary"
                                                : "border-transparent"
                                                }`}
                                        >
                                            <ListingImage
                                                kind="lot"
                                                src={img}
                                                alt={`Thumbnail ${idx + 1}`}
                                                width={500}
                                                height={500}
                                                className="w-full h-full object-cover"
                                            />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Lot Info */}
                        <div className="mb-6">
                            <h3 className="font-semibold text-foreground mb-1">{lot.title}</h3>
                            <p className="text-sm text-muted-foreground">Lot ID: {lot.lotId}</p>
                            <div className="mt-3 flex items-center gap-4">
                                <div>
                                    <p className="text-xs text-muted-foreground">Current High Bid</p>
                                    <p className="text-lg font-semibold text-foreground">
                                        {formatPrice(lot.currentBid)}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Bid Input */}
                        <div className="mb-6">
                            <Label htmlFor="bid-amount" className="text-sm font-medium text-foreground mb-2 block">
                                {enableProxy ? "Starting Bid" : "Your Bid"}
                            </Label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                                <Input
                                    id="bid-amount"
                                    type="text"
                                    value={bidAmount}
                                    onChange={(e) => handleBidChange(e.target.value)}
                                    className="pl-8 text-base md:text-lg font-medium"
                                    placeholder={minBid.toString()}
                                />
                            </div>
                            <p className="text-sm text-muted-foreground mt-2">
                                Minimum bid: {formatPrice(minBid)}
                            </p>
                            {parsedBidAmount > 0 && !isValidBid && (
                                <p className="text-sm text-destructive mt-1">
                                    Your bid must be at least {formatPrice(minBid)}
                                </p>
                            )}

                            {/* Advanced Options */}
                            {lot.bidding?.allow_proxy && (
                                <div className="mt-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowAdvanced(!showAdvanced)}
                                        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        {showAdvanced ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                                        Advanced options
                                    </button>

                                    {showAdvanced && (
                                        <div className="mt-3 p-3 bg-muted/50 rounded-lg space-y-3">
                                            <div className="flex items-center space-x-2">
                                                <Checkbox
                                                    id="enable-proxy"
                                                    checked={enableProxy}
                                                    onCheckedChange={(checked) => setEnableProxy(checked as boolean)}
                                                />
                                                <Label htmlFor="enable-proxy" className="text-sm">
                                                    Enable automatic bidding
                                                </Label>
                                            </div>

                                            {enableProxy && (
                                                <div>
                                                    <Label htmlFor="max-bid-amount" className="text-sm font-medium text-foreground mb-2 block">
                                                        Maximum Bid
                                                    </Label>
                                                    <div className="relative">
                                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                                                        <Input
                                                            id="max-bid-amount"
                                                            type="text"
                                                            value={maxBidAmount}
                                                            onChange={(e) => setMaxBidAmount(e.target.value.replace(/[^0-9]/g, ""))}
                                                            className="pl-8 text-base md:text-lg font-medium"
                                                            placeholder="Enter maximum amount"
                                                        />
                                                    </div>
                                                    <p className="text-xs text-muted-foreground mt-1">
                                                        We'll automatically increase your bid up to this amount
                                                    </p>
                                                    {parsedMaxBidAmount > 0 && !isValidMaxBid && (
                                                        <p className="text-sm text-destructive mt-1">
                                                            Maximum bid must be greater than or equal to your bid
                                                        </p>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Notices */}
                        <div className="space-y-3 mb-6">
                            {enableProxy && (
                                <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-3 flex gap-3">
                                    <Info className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
                                    <p className="text-sm text-blue-800 dark:text-blue-200">
                                        Your bid is the maximum amount you are willing to pay for this item. The auction software will bid on your behalf up to this amount.
                                    </p>
                                </div>
                            )}

                            <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg p-3 flex gap-3">
                                <AlertCircle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                                <div className="text-sm text-amber-800 dark:text-amber-200">
                                    <p className="font-medium mb-1">Buyer&apos;s Premium</p>
                                    <p>A {lot.auction?.buyer_premium_percentage ?? 0}% buyer&apos;s premium will be added to the final winning bid.</p>
                                </div>
                            </div>
                        </div>

                        {/* Agreement Checkbox */}
                        <div className="flex items-start gap-3 mb-6">
                            <Checkbox
                                id="bid-terms"
                                checked={agreeToTerms}
                                onCheckedChange={(checked) => setAgreeToTerms(checked === true)}
                            />
                            <Label htmlFor="bid-terms" className="text-sm text-muted-foreground cursor-pointer leading-relaxed">
                                By submitting my bid, I agree to abide by the terms and conditions
                            </Label>
                        </div>

                        {/* Confirm Button */}
                        <Button
                            className="w-full h-12 text-sm md:text-lg"
                            disabled={!canSubmit || isSubmitting}
                            onClick={handleConfirmBid}
                        >
                            {isSubmitting ? "Placing Bid..." : `Place Bid ${canSubmit ? formatPrice(enableProxy ? parsedMaxBidAmount : parsedBidAmount) : ""}`}
                        </Button>
                    </div>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
};

export default BidConfirmationModal;
