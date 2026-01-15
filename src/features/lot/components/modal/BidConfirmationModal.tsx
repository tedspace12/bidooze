import { useState } from "react";
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
import { Info, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";

interface LotData {
    id: string;
    lotId: string;
    title: string;
    images: string[];
    currentBid: number;
    minBidIncrement: number;
    buyersPremium: string;
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

const BidConfirmationModal = ({ open, onOpenChange, lot }: BidConfirmationModalProps) => {
    const [selectedImage, setSelectedImage] = useState(0);
    const minBid = lot.currentBid + lot.minBidIncrement;
    const [bidAmount, setBidAmount] = useState(minBid.toString());
    const [agreeToTerms, setAgreeToTerms] = useState(false);

    const handleBidChange = (value: string) => {
        // Allow only numeric input
        const numericValue = value.replace(/[^0-9]/g, "");
        setBidAmount(numericValue);
    };

    const parsedBidAmount = parseInt(bidAmount) || 0;
    const isValidBid = parsedBidAmount >= minBid;

    const handleConfirmBid = () => {
        if (!isValidBid || !agreeToTerms) return;

        toast("Bid Placed Successfully!", {
            description: `Your maximum bid of ${formatPrice(parsedBidAmount)} has been submitted.`,
        });
        onOpenChange(false);
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
                            <Image
                                src={lot.images[selectedImage]}
                                alt={lot.title}
                                width={500}
                                height={500}
                                className="w-full aspect-6/3 object-cover rounded-lg"
                            />
                            {lot.images.length > 1 && (
                                <div className="flex gap-2 mt-2">
                                    {lot.images.map((img, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setSelectedImage(idx)}
                                            className={`w-14 h-10 rounded-md overflow-hidden border-2 transition-colors ${selectedImage === idx
                                                ? "border-primary"
                                                : "border-transparent"
                                                }`}
                                        >
                                            <Image
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
                                Your Maximum Bid
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
                        </div>

                        {/* Notices */}
                        <div className="space-y-3 mb-6">
                            <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-3 flex gap-3">
                                <Info className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
                                <p className="text-sm text-blue-800 dark:text-blue-200">
                                    Your bid is the maximum amount you are willing to pay for this item. The auction software will bid on your behalf up to this amount.
                                </p>
                            </div>

                            <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg p-3 flex gap-3">
                                <AlertCircle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                                <div className="text-sm text-amber-800 dark:text-amber-200">
                                    <p className="font-medium mb-1">Buyer&apos;s Premium</p>
                                    <p>A {lot.buyersPremium} buyer&apos;s premium will be added to the final winning bid.</p>
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
                            disabled={!isValidBid || !agreeToTerms}
                            onClick={handleConfirmBid}
                        >
                            Confirm Bid {isValidBid && formatPrice(parsedBidAmount)}
                        </Button>
                    </div>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
};

export default BidConfirmationModal;
