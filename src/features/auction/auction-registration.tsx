'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
    ChevronRight,
    ChevronDown,
    CreditCard,
    Truck,
    MapPin,
    FileText,
    Calendar,
    Clock,
    Gavel,
    CheckCircle2,
    Plus,
    Pencil,
    HelpCircle,
} from "lucide-react";
import { format } from "date-fns";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";
import HowToBidModal from "./components/registration/modal/HowToBidModal";

// Mock auction data
const mockAuctionData = {
    id: "auction-1",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400",
    title: "Premier Classic Car Auction - December 2024",
    auctioneerName: "Heritage Auctions",
    address: "2801 W Airport Freeway, Dallas, TX 75261",
    startDate: "2024-12-15T09:00:00",
    endDate: "2024-12-20T18:00:00",
    type: "Timed Online",
    biddingStatus: "Bidding Open",
    terms: `1. All items are sold "AS IS, WHERE IS" with no warranties or guarantees.
2. The auctioneer reserves the right to reject any bid.
3. Payment is due within 3 business days of the auction closing.
4. Buyer's premium of 15% will be added to the final bid price.
5. Shipping arrangements are the responsibility of the buyer.
6. All sales are final. No returns or refunds.
7. The auctioneer is not responsible for any errors in the catalog.
8. By placing a bid, you agree to these terms and conditions.`,
    pickupAddress: "Heritage Auctions Warehouse, 2801 W Airport Freeway, Dallas, TX 75261",
    shippingAvailable: true,
};

// Mock lot data
const mockLotData = {
    id: "lot-1",
    lotId: "LOT-2024-8847",
    title: "Rare 1967 Shelby GT500 Eleanor Recreation",
    images: [
        "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=400",
        "https://images.unsplash.com/photo-1672717901493-302388cccc48?w=400",
        "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400",
    ],
    currentBid: 125000,
    totalBids: 47,
    timeRemaining: "2d 14h 32m",
};

// Mock saved card
const mockSavedCard = {
    id: "card-1",
    last4: "4242",
    brand: "Visa",
    expiry: "12/26",
};

const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(price);
};

const AuctionRegistration = () => {
    const router = useRouter();
    const searchParams = useSearchParams();

    const source = searchParams.get("source") || "auction";
    const sourceId = searchParams.get("id") || "1";

    const [paymentOpen, setPaymentOpen] = useState(true);
    const [deliveryOpen, setDeliveryOpen] = useState(false);
    const [termsOpen, setTermsOpen] = useState(false);

    const [selectedCard, setSelectedCard] = useState(mockSavedCard.id);
    const [deliveryMethod, setDeliveryMethod] = useState<"pickup" | "ship">("pickup");
    const [agreeToTerms, setAgreeToTerms] = useState(false);
    const [sellerNote, setSellerNote] = useState("");
    const [howToBidOpen, setHowToBidOpen] = useState(false);
    const [selectedLotImage, setSelectedLotImage] = useState(0);

    const isFormComplete = selectedCard && deliveryMethod && agreeToTerms;

    const handleRegister = () => {
        toast("Registration Successful!", {
            description: "You are now registered to bid on this auction.",
        });

        if (source === "lot") {
            router.push(`/lot/${sourceId}`);
        } else {
            router.push(`/auction/${sourceId}`);
        }
    };

    return (
        <div>
            {/* Breadcrumb */}
            <div className="container mx-auto px-4 py-4">
                <nav className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Link href="/" className="hover:text-primary transition-colors">Home</Link>
                    <ChevronRight className="h-4 w-4" />
                    <Link href="/auctions" className="hover:text-primary transition-colors">Auctions</Link>
                    <ChevronRight className="h-4 w-4" />
                    <span className="text-foreground font-medium">Register to Bid</span>
                </nav>
            </div>

            <main className="container mx-auto px-4 pb-12">
                {/* Page Header */}
                <div className="mb-8">
                    <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                        Register for the Auction
                    </h1>
                    <p className="text-muted-foreground max-w-2xl">
                        Auctioneers use registrations to approve you to bid, confirm delivery, and record your agreement to their terms.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Context Info */}
                    <div className="lg:col-span-1">
                        <Card className="p-6 sticky top-4">
                            {source === "lot" ? (
                                // Lot Context
                                <div>
                                    <div className="mb-4">
                                        <Image
                                            src={mockLotData.images[selectedLotImage]}
                                            alt={mockLotData.title}
                                            width={500}
                                            height={500}
                                            className="w-full aspect-4/3 object-cover rounded-lg"
                                        />
                                        <div className="flex gap-2 mt-2">
                                            {mockLotData.images.map((img, idx) => (
                                                <button
                                                    key={idx}
                                                    onClick={() => setSelectedLotImage(idx)}
                                                    className={`w-16 h-12 rounded-md overflow-hidden border-2 transition-colors ${selectedLotImage === idx
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
                                    </div>

                                    <h3 className="font-semibold text-foreground mb-2">
                                        {mockLotData.title}
                                    </h3>
                                    <p className="text-sm text-muted-foreground mb-4">
                                        Lot ID: {mockLotData.lotId}
                                    </p>

                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-muted-foreground">Current Bid</span>
                                            <span className="font-semibold text-foreground">
                                                {formatPrice(mockLotData.currentBid)}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-muted-foreground">Total Bids</span>
                                            <span className="text-foreground">{mockLotData.totalBids}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-muted-foreground">Time Remaining</span>
                                            <span className="text-foreground flex items-center gap-1">
                                                <Clock className="h-3.5 w-3.5" />
                                                {mockLotData.timeRemaining}
                                            </span>
                                        </div>
                                    </div>

                                    <Button
                                        variant="link"
                                        className="mt-4 p-0 h-auto text-primary"
                                        onClick={() => setHowToBidOpen(true)}
                                    >
                                        <HelpCircle className="h-4 w-4 mr-1" />
                                        How to Bid
                                    </Button>
                                </div>
                            ) : (
                                // Auction Context
                                <div>
                                    <Image
                                        src={mockAuctionData.image}
                                        alt={mockAuctionData.title}
                                        width={500}
                                        height={500}
                                        className="w-full aspect-video object-cover rounded-lg mb-4"
                                    />

                                    <h3 className="font-semibold text-foreground mb-2">
                                        {mockAuctionData.title}
                                    </h3>
                                    <p className="text-sm text-muted-foreground mb-4">
                                        by {mockAuctionData.auctioneerName}
                                    </p>

                                    <div className="space-y-3 text-sm">
                                        <div className="flex items-start gap-2">
                                            <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                                            <span className="text-muted-foreground">{mockAuctionData.address}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Calendar className="h-4 w-4 text-muted-foreground" />
                                            <span className="text-muted-foreground">
                                                {format(new Date(mockAuctionData.startDate), "MMM d")} -{" "}
                                                {format(new Date(mockAuctionData.endDate), "MMM d, yyyy")}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Gavel className="h-4 w-4 text-muted-foreground" />
                                            <span className="text-muted-foreground">{mockAuctionData.type}</span>
                                        </div>
                                        <Badge className="bg-emerald-500 text-white">
                                            {mockAuctionData.biddingStatus}
                                        </Badge>
                                    </div>

                                    <Button
                                        variant="link"
                                        className="mt-4 p-0 h-auto text-primary"
                                        onClick={() => setHowToBidOpen(true)}
                                    >
                                        <HelpCircle className="h-4 w-4 mr-1" />
                                        How to Bid
                                    </Button>
                                </div>
                            )}
                        </Card>
                    </div>

                    {/* Right Column - Registration Form */}
                    <div className="lg:col-span-2 space-y-4">
                        {/* Payment Verification */}
                        <Collapsible open={paymentOpen} onOpenChange={setPaymentOpen}>
                            <Card>
                                <CollapsibleTrigger className="w-full p-6 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${selectedCard ? "bg-emerald-500/10 text-emerald-500" : "bg-muted text-muted-foreground"
                                            }`}>
                                            {selectedCard ? <CheckCircle2 className="h-5 w-5" /> : <CreditCard className="h-5 w-5" />}
                                        </div>
                                        <div className="text-left">
                                            <h3 className="font-semibold text-foreground">Payment Verification</h3>
                                            <p className="text-sm text-muted-foreground">Required</p>
                                        </div>
                                    </div>
                                    <ChevronDown className={`h-5 w-5 text-muted-foreground transition-transform ${paymentOpen ? "rotate-180" : ""}`} />
                                </CollapsibleTrigger>
                                <CollapsibleContent className="px-6 pb-6">
                                    <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg p-4 mb-4">
                                        <p className="text-sm text-amber-800 dark:text-amber-200">
                                            You will not be charged until you win. To verify your card, we&apos;ll place a $1 temporary hold. This is not a charge and will be released within 5–7 business days.
                                        </p>
                                    </div>

                                    <RadioGroup value={selectedCard} onValueChange={setSelectedCard}>
                                        <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                                            <div className="flex items-center gap-3">
                                                <RadioGroupItem value={mockSavedCard.id} id={mockSavedCard.id} />
                                                <Label htmlFor={mockSavedCard.id} className="flex items-center gap-3 cursor-pointer">
                                                    <CreditCard className="h-5 w-5 text-muted-foreground" />
                                                    <span className="text-foreground">{mockSavedCard.brand} •••• {mockSavedCard.last4}</span>
                                                    <span className="text-sm text-muted-foreground">Expires {mockSavedCard.expiry}</span>
                                                </Label>
                                            </div>
                                            <Button variant="ghost" size="sm">
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </RadioGroup>

                                    <Button variant="outline" className="mt-4 gap-2">
                                        <Plus className="h-4 w-4" />
                                        Add New Card
                                    </Button>
                                </CollapsibleContent>
                            </Card>
                        </Collapsible>

                        {/* Preferred Delivery Method */}
                        <Collapsible open={deliveryOpen} onOpenChange={setDeliveryOpen}>
                            <Card>
                                <CollapsibleTrigger className="w-full p-6 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${deliveryMethod ? "bg-emerald-500/10 text-emerald-500" : "bg-muted text-muted-foreground"
                                            }`}>
                                            {deliveryMethod ? <CheckCircle2 className="h-5 w-5" /> : <Truck className="h-5 w-5" />}
                                        </div>
                                        <div className="text-left">
                                            <h3 className="font-semibold text-foreground">Preferred Delivery Method</h3>
                                            <p className="text-sm text-muted-foreground">Required</p>
                                        </div>
                                    </div>
                                    <ChevronDown className={`h-5 w-5 text-muted-foreground transition-transform ${deliveryOpen ? "rotate-180" : ""}`} />
                                </CollapsibleTrigger>
                                <CollapsibleContent className="px-6 pb-6">
                                    <RadioGroup value={deliveryMethod} onValueChange={(value) => setDeliveryMethod(value as "pickup" | "ship")}>
                                        <div className="space-y-3">
                                            <div className={`p-4 border rounded-lg transition-colors ${deliveryMethod === "pickup" ? "border-primary bg-primary/5" : "border-border"
                                                }`}>
                                                <div className="flex items-start gap-3">
                                                    <RadioGroupItem value="pickup" id="pickup" className="mt-1" />
                                                    <Label htmlFor="pickup" className="flex-1 cursor-pointer">
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <MapPin className="h-4 w-4" />
                                                            <span className="font-medium text-foreground">Pickup</span>
                                                        </div>
                                                        {deliveryMethod === "pickup" && (
                                                            <div className="flex gap-4 mt-3">
                                                                <div className="flex-1">
                                                                    <p className="text-sm text-muted-foreground">
                                                                        {mockAuctionData.pickupAddress}
                                                                    </p>
                                                                </div>
                                                                <div className="w-32 h-20 bg-muted rounded-lg overflow-hidden">
                                                                    <Image
                                                                        src="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=200"
                                                                        alt="Map preview"
                                                                        width={500}
                                                                        height={500}
                                                                        className="w-full h-full object-cover"
                                                                    />
                                                                </div>
                                                            </div>
                                                        )}
                                                    </Label>
                                                </div>
                                            </div>

                                            <div className={`p-4 border rounded-lg transition-colors ${deliveryMethod === "ship" ? "border-primary bg-primary/5" : "border-border"
                                                } ${!mockAuctionData.shippingAvailable ? "opacity-50" : ""}`}>
                                                <div className="flex items-start gap-3">
                                                    <RadioGroupItem
                                                        value="ship"
                                                        id="ship"
                                                        className="mt-1"
                                                        disabled={!mockAuctionData.shippingAvailable}
                                                    />
                                                    <Label htmlFor="ship" className="flex-1 cursor-pointer">
                                                        <div className="flex items-center gap-2">
                                                            <Truck className="h-4 w-4" />
                                                            <span className="font-medium text-foreground">Ship to Address</span>
                                                            {!mockAuctionData.shippingAvailable && (
                                                                <Badge variant="secondary" className="text-xs">
                                                                    Not Available
                                                                </Badge>
                                                            )}
                                                        </div>
                                                    </Label>
                                                </div>
                                            </div>
                                        </div>
                                    </RadioGroup>
                                </CollapsibleContent>
                            </Card>
                        </Collapsible>

                        {/* Terms & Conditions */}
                        <Collapsible open={termsOpen} onOpenChange={setTermsOpen}>
                            <Card>
                                <CollapsibleTrigger className="w-full p-6 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${agreeToTerms ? "bg-emerald-500/10 text-emerald-500" : "bg-muted text-muted-foreground"
                                            }`}>
                                            {agreeToTerms ? <CheckCircle2 className="h-5 w-5" /> : <FileText className="h-5 w-5" />}
                                        </div>
                                        <div className="text-left">
                                            <h3 className="font-semibold text-foreground">Auction Terms & Conditions</h3>
                                            <p className="text-sm text-muted-foreground">Required</p>
                                        </div>
                                    </div>
                                    <ChevronDown className={`h-5 w-5 text-muted-foreground transition-transform ${termsOpen ? "rotate-180" : ""}`} />
                                </CollapsibleTrigger>
                                <CollapsibleContent className="px-6 pb-6">
                                    <div className="bg-muted/50 rounded-lg p-4 max-h-48 overflow-y-auto mb-4">
                                        <pre className="text-sm text-muted-foreground whitespace-pre-wrap font-sans">
                                            {mockAuctionData.terms}
                                        </pre>
                                    </div>

                                    <div className="mb-4">
                                        <Label htmlFor="seller-note" className="text-sm text-muted-foreground mb-2 block">
                                            Note to Seller (Optional)
                                        </Label>
                                        <Textarea
                                            id="seller-note"
                                            placeholder="Add a message for the seller..."
                                            value={sellerNote}
                                            onChange={(e) => setSellerNote(e.target.value)}
                                            className="resize-none"
                                            rows={3}
                                        />
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <Checkbox
                                            id="terms"
                                            checked={agreeToTerms}
                                            onCheckedChange={(checked) => setAgreeToTerms(checked === true)}
                                        />
                                        <Label htmlFor="terms" className="text-sm text-foreground cursor-pointer">
                                            I agree to the auction&apos;s terms and conditions
                                        </Label>
                                    </div>
                                </CollapsibleContent>
                            </Card>
                        </Collapsible>

                        {/* Submit Button */}
                        <Button
                            className="w-full h-12 text-lg"
                            disabled={!isFormComplete}
                            onClick={handleRegister}
                        >
                            Complete Registration
                        </Button>
                    </div>
                </div>
            </main>

            <HowToBidModal open={howToBidOpen} onOpenChange={setHowToBidOpen} />
        </div>
    );
};

export default AuctionRegistration;
