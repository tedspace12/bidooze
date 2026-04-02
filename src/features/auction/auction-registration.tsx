'use client';

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
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
    Loader2,
    Check,
    ShieldCheck,
} from "lucide-react";
import { format } from "date-fns";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { useAuth } from "@/features/auth/hooks/useAuth";
import Link from "next/link";
import { useAuction } from "./hooks/useAuction";
import HowToBidModal from "./components/registration/modal/HowToBidModal";
import { Input } from "@/components/ui/input";


interface PaymentMethod {
    id: number;
    card_holder_name: string;
    card_last_four: string;
    expiration_date: string;
    card_brand: string;
    provider: string;
    ref: string | null;
    is_verified: boolean;
    is_default: boolean;
    created_at: string;
    updated_at: string;
}

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

const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(price);
};

const AuctionRegistration = () => {
    const {
        getPaymentMethods,
        addPaymentMethod,
        verifyPaymentMethod,
    } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();

    const source = searchParams.get("source") || "auction";
    const sourceId = searchParams.get("id") || "1";

    const { useAuctionDetails, useRegisterForAuction } = useAuction(sourceId);

    const { data: auctionData, isLoading, isError } = useAuctionDetails();

    const { mutate, isPending } = useRegisterForAuction();

    const [paymentOpen, setPaymentOpen] = useState(true);
    const [termsOpen, setTermsOpen] = useState(false);

    const [phone, setPhone] = useState("");
    const [selectedCard, setSelectedCard] = useState<string | null>(null);
    const [agreeToTerms, setAgreeToTerms] = useState(false);
    const [sellerNote, setSellerNote] = useState("");
    const [howToBidOpen, setHowToBidOpen] = useState(false);
    const [selectedLotImage, setSelectedLotImage] = useState(0);

    const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
    const [isLoadingPayments, setIsLoadingPayments] = useState(true);
    const [showAddCard, setShowAddCard] = useState(false);
    const [newCard, setNewCard] = useState({
        provider: "",
        card_holder_name: "",
        card_number: "",
        expiration_date: "",
        cvv: "",
        is_default: false,
    });

    const isFormComplete =
        selectedCard &&
        agreeToTerms &&
        phone.trim().length > 0 &&
        paymentMethods.find((m) => String(m.id) === selectedCard)?.is_verified;


    useEffect(() => {
        loadPaymentMethods();
    }, []);

    const loadPaymentMethods = async () => {
        try {
            const response = await getPaymentMethods.mutateAsync();
            setPaymentMethods(response.payment_methods || []);
        } catch (error: any) {
            toast.error("Failed to load payment methods");
        } finally {
            setIsLoadingPayments(false);
        }
    };

    const handleAddCard = async () => {
        if (!newCard.card_holder_name || !newCard.card_number || !newCard.expiration_date || !newCard.cvv) {
            toast.error("Please fill in all card details");
            return;
        }

        if (!newCard.provider) {
            toast.error("Please select a verification method");
            return;
        }

        try {
            await addPaymentMethod.mutateAsync(newCard);
            toast.success("Payment method added successfully");
            setNewCard({
                provider: "",
                card_holder_name: "",
                card_number: "",
                expiration_date: "",
                cvv: "",
                is_default: false,
            });
            setShowAddCard(false);
            loadPaymentMethods();
        } catch (error: any) {
            toast.error(getErrorMessage(error));
        }
    };

    const handleVerifyCard = async (paymentMethodId: number) => {
        try {
            await verifyPaymentMethod.mutateAsync({
                paymentMethodId
            });
            toast.success("Payment method verified successfully");
            loadPaymentMethods();
        }
        catch (error: any) {
            toast.error(getErrorMessage(error));
        };
    }

    const getErrorMessage = (error: any): string => {
        // Check if there are specific validation errors
        if (error?.errors && typeof error.errors === 'object') {
            const errorMessages = Object.values(error.errors) as string[][];
            if (errorMessages.length > 0 && errorMessages[0].length > 0) {
                return errorMessages[0][0]; // First error message from first field
            }
        }
        // Fallback to generic message
        return error?.message || "An error occurred";
    };


    const handleRegister = () => {
        if (!selectedCard) {
            toast.error("Please select a payment method");
            return;
        }

        if (!phone.trim()) {
            toast.error("Please enter your phone number");
            return;
        }

        if (!agreeToTerms) {
            toast.error("You must agree to the terms");
            return;
        }

        const selectedPayment = paymentMethods.find(
            (m) => String(m.id) === selectedCard
        );

        if (!selectedPayment) {
            toast.error("Invalid payment method");
            return;
        }

        if (!selectedPayment.is_verified) {
            toast.error("Please verify your card first");
            return;
        }

        if (!selectedPayment.ref) {
            toast.error("Payment method is not properly linked");
            return;
        }

        const payload = {
            accepted_terms: true,
            terms_version: "v1",
            phone: phone.trim(),
            provider: selectedPayment.provider,
            payment_method_provider: selectedPayment.provider,
            payment_method_ref: selectedPayment.ref,
            return_url: window.location.origin + "/payments/return",
        };

        mutate(payload, {
            onSuccess: (res) => {
                toast.success(res.message || "Registration successful");

                if (res.approval_option === "deposit" && res.deposit) {
                    const instructions = res.deposit.provider_instructions;
                    const provider = instructions.provider;

                    if (provider === "stripe" && instructions.client_secret && instructions.publishable_key) {
                        sessionStorage.setItem("stripe_client_secret", instructions.client_secret);
                        sessionStorage.setItem("stripe_publishable_key", instructions.publishable_key ?? "");
                        sessionStorage.setItem("deposit_provider", "stripe");
                        sessionStorage.setItem("deposit_return_source", source);
                        sessionStorage.setItem("deposit_return_id", sourceId);

                        router.push("/payments/stripe-confirm");
                        return;
                    }

                    const redirectUrl =
                        instructions?.redirect_url ||
                        instructions?.authorization_url;

                    if (redirectUrl) {
                        sessionStorage.setItem("deposit_provider", "paystack");
                        sessionStorage.setItem("deposit_return_source", source);
                        sessionStorage.setItem("deposit_return_id", sourceId);
                        window.location.href = redirectUrl;
                        return;
                    }
                }

                if (res.registration?.status === "pending_deposit" && !res.deposit) {
                    toast.warning("Registration pending — complete your deposit to bid.");
                }

                router.push(source === "lot" ? `/lot/${sourceId}` : `/auction/${sourceId}`);
            },
            onError: (error: any) => {
                toast.error(getErrorMessage(error));
            },
        });
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

            <main className="container mx-auto px-4 pb-10 md:pb-12">
                {/* Page Header */}
                <div className="mb-6 md:mb-8">
                    <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                        Register for the Auction
                    </h1>
                    <p className="text-sm md:text-base text-muted-foreground max-w-2xl">
                        Auctioneers use registrations to approve you to bid, confirm delivery, and record your agreement to their terms.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
                    {/* Left Column - Context Info */}
                    <div className="lg:col-span-1">
                        <Card className="p-4 md:p-6 lg:sticky lg:top-4">
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
                                        <div className="flex gap-2 mt-2 overflow-x-auto pb-1">
                                            {mockLotData.images.map((img, idx) => (
                                                <button
                                                    key={idx}
                                                    onClick={() => setSelectedLotImage(idx)}
                                                    className={`w-14 h-10 sm:w-16 sm:h-12 rounded-md overflow-hidden border-2 transition-colors shrink-0 ${selectedLotImage === idx
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

                                    <h3 className="font-semibold text-foreground mb-2 text-sm sm:text-base">
                                        {mockLotData.title}
                                    </h3>
                                    <p className="text-xs sm:text-sm text-muted-foreground mb-4">
                                        Lot ID: {mockLotData.lotId}
                                    </p>

                                    <div className="space-y-2 sm:space-y-3">
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs sm:text-sm text-muted-foreground">Current Bid</span>
                                            <span className="font-semibold text-foreground text-sm sm:text-base">
                                                {formatPrice(mockLotData.currentBid)}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs sm:text-sm text-muted-foreground">Total Bids</span>
                                            <span className="text-sm sm:text-base text-foreground">{mockLotData.totalBids}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs sm:text-sm text-muted-foreground">Time Remaining</span>
                                            <span className="text-foreground flex items-center gap-1 text-sm">
                                                <Clock className="h-3.5 w-3.5" />
                                                {mockLotData.timeRemaining}
                                            </span>
                                        </div>
                                    </div>

                                    <Button
                                        variant="link"
                                        className="mt-4 px-0 py-0 h-auto text-primary"
                                        onClick={() => setHowToBidOpen(true)}
                                    >
                                        <HelpCircle className="h-4 w-4 mr-1" />
                                        How to Bid
                                    </Button>
                                </div>
                            ) : (
                                // Auction Context
                                isLoading ? (
                                    <div className="space-y-4 md:space-y-6">
                                        <div className="h-24 bg-muted rounded-lg animate-pulse" />
                                        <div className="h-64 bg-muted rounded-lg animate-pulse" />
                                    </div>

                                ) : isError || !auctionData ? (
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
                                                // detailsQuery.refetch();
                                                // lotsQuery.refetch();
                                            }}
                                        >
                                            Retry
                                        </Button>
                                    </div>
                                ) : (
                                    <div>
                                        <Image
                                            src={auctionData.image_url || "/placeholder-auction.jpg"}
                                            alt={auctionData.name}
                                            width={500}
                                            height={500}
                                            className="w-full aspect-video object-cover rounded-lg mb-4"
                                        />

                                        <h3 className="font-semibold text-foreground mb-2 text-sm sm:text-base">
                                            {auctionData.name}
                                        </h3>
                                        <p className="text-xs sm:text-sm text-muted-foreground mb-4">
                                            by {auctionData.auctioneer.company_name}
                                        </p>

                                        <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
                                            <div className="flex items-start gap-2">
                                                <MapPin className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground mt-0.5 shrink-0" />
                                                <span className="text-muted-foreground">
                                                    {[auctionData?.location?.city,
                                                    auctionData?.location?.state,
                                                    auctionData?.location?.country]
                                                        .filter(Boolean)
                                                        .join(", ") || "Location not available"}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground" />
                                                <span className="text-muted-foreground">
                                                    {auctionData.start_date && auctionData.end_date && (
                                                        <>
                                                            {format(new Date(auctionData.start_date), "MMM d")} -{" "}
                                                            {format(new Date(auctionData.end_date), "MMM d, yyyy")}
                                                        </>
                                                    )}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Gavel className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground" />
                                                <span className="text-muted-foreground">{auctionData.type}</span>
                                            </div>
                                            <Badge
                                                className={`${auctionData.bidding_status?.toLowerCase() === "open"
                                                    ? "bg-emerald-500"
                                                    : "bg-red-500"
                                                    } text-white text-xs`}
                                            >
                                                {auctionData.bidding_status}
                                            </Badge>
                                        </div>

                                        <Button
                                            variant="link"
                                            className="mt-3 sm:mt-4 px-0 py-0 h-auto text-primary"
                                            onClick={() => setHowToBidOpen(true)}
                                        >
                                            <HelpCircle className="h-4 w-4 mr-1" />
                                            How to Bid
                                        </Button>
                                    </div>
                                )
                            )}
                        </Card>
                    </div>

                    {/* Right Column - Registration Form */}
                    <div className="lg:col-span-2 space-y-4">
                        {/* Payment Verification */}
                        <Collapsible open={paymentOpen} onOpenChange={setPaymentOpen}>
                            <Card>
                                <CollapsibleTrigger className="w-full p-4 sm:p-6 flex items-center justify-between gap-3">
                                    <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                                        <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center ${selectedCard ? "bg-emerald-500/10 text-emerald-500" : "bg-muted text-muted-foreground"
                                            }`}>
                                            {selectedCard ? <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5" /> : <CreditCard className="h-4 w-4 sm:h-5 sm:w-5" />}
                                        </div>
                                        <div className="text-left min-w-0">
                                            <h3 className="font-semibold text-foreground text-sm sm:text-base truncate">Payment Verification</h3>
                                            <p className="text-xs sm:text-sm text-muted-foreground">Required</p>
                                        </div>
                                    </div>
                                    <ChevronDown className={`h-5 w-5 text-muted-foreground transition-transform shrink-0 ${paymentOpen ? "rotate-180" : ""}`} />
                                </CollapsibleTrigger>
                                <CollapsibleContent className="px-4 sm:px-6 pb-4 sm:pb-6">
                                    <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg p-3 sm:p-4 mb-4">
                                        <p className="text-xs sm:text-sm text-amber-800 dark:text-amber-200">
                                            You will not be charged until you win. To verify your card, we&apos;ll place a $1 temporary hold. This is not a charge and will be released within 5–7 business days.
                                        </p>
                                    </div>

                                    {isLoadingPayments ? (
                                        <div className="flex items-center justify-center py-8">
                                            <Loader2 className="h-6 w-6 animate-spin" />
                                            <span className="ml-2">Loading payment methods...</span>
                                        </div>
                                    ) : (
                                        <>
                                            {/* Existing Cards */}
                                            <div className="space-y-3">
                                                {paymentMethods.length === 0 ? (
                                                    <div className="text-center py-8 text-muted-foreground">
                                                        No payment methods added yet
                                                    </div>
                                                ) : (
                                                    <RadioGroup value={selectedCard} onValueChange={setSelectedCard}>
                                                        {paymentMethods.map((method) => {
                                                            const id = String(method.id);

                                                            return (
                                                                <div key={method.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 border border-border rounded-lg gap-3 sm:gap-0">
                                                                    <div className="flex items-center gap-2 sm:gap-3">
                                                                        <RadioGroupItem value={id} id={id} />
                                                                        <Label htmlFor={id} className="flex flex-wrap items-center gap-2 sm:gap-3 cursor-pointer">
                                                                            <CreditCard className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                                                                            <span className="text-foreground text-sm sm:text-base">
                                                                                {method.card_brand} •••• {method.card_last_four}
                                                                            </span>
                                                                            <span className="text-xs sm:text-sm text-muted-foreground">
                                                                                Expires {method.expiration_date}
                                                                            </span>
                                                                            {!method.is_verified && (
                                                                                <Badge variant="destructive" className="text-xs">
                                                                                    Unverified
                                                                                </Badge>
                                                                            )}
                                                                            {method.is_default && (
                                                                                <Badge variant="secondary" className="text-xs">
                                                                                    Default
                                                                                </Badge>
                                                                            )}
                                                                        </Label>
                                                                    </div>
                                                                    {!method.is_verified && (
                                                                        <Button variant="outline" size="sm" className="self-end sm:self-auto"
                                                                            onClick={() => handleVerifyCard(method.id)}
                                                                        >
                                                                            Verify
                                                                        </Button>
                                                                    )}
                                                                </div>
                                                            )
                                                        }
                                                        )}
                                                    </RadioGroup>
                                                )}

                                                <Button variant="outline" className="mt-4 gap-2 w-full sm:w-auto"
                                                    onClick={() => setShowAddCard(true)}
                                                >
                                                    <Plus className="h-4 w-4" />
                                                    Add New Card
                                                </Button>
                                            </div>

                                            {/* Add Card Form - shown when "Add New Card" is clicked */}
                                            {showAddCard && (
                                                <div className="mt-6 p-4 border border-border rounded-lg">
                                                    <h4 className="font-semibold text-foreground mb-4">Add Payment Method</h4>
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                        <div className="col-span-1">
                                                            <Label className="text-xs sm:text-sm text-muted-foreground mb-1">Cardholder Name</Label>
                                                            <Input
                                                                placeholder="John Doe"
                                                                value={newCard.card_holder_name}
                                                                onChange={(e) => setNewCard({ ...newCard, card_holder_name: e.target.value })}
                                                            />
                                                        </div>
                                                        <div className="col-span-1">
                                                            <Label className="text-xs sm:text-sm text-muted-foreground mb-1">Card Number</Label>
                                                            <Input
                                                                placeholder="1234 5678 9012 3456"
                                                                value={newCard.card_number}
                                                                onChange={(e) => setNewCard({ ...newCard, card_number: e.target.value })}
                                                            />
                                                        </div>
                                                        <div className="col-span-1">
                                                            <Label className="text-xs sm:text-sm text-muted-foreground mb-1">Expiration Date</Label>
                                                            <Input
                                                                placeholder="MM/YY"
                                                                value={newCard.expiration_date}
                                                                onChange={(e) => setNewCard({ ...newCard, expiration_date: e.target.value })}
                                                            />
                                                        </div>
                                                        <div className="col-span-1">
                                                            <Label className="text-xs sm:text-sm text-muted-foreground mb-1">CVV</Label>
                                                            <Input
                                                                placeholder="123"
                                                                value={newCard.cvv}
                                                                onChange={(e) => setNewCard({ ...newCard, cvv: e.target.value })}
                                                            />
                                                        </div>
                                                        <div className="border-t border-border pt-4 -mx-4 px-4 col-span-2">
                                                            <div className="bg-muted/40 rounded-lg p-3 space-y-3">
                                                                <div>
                                                                    <p className="text-sm font-medium">Verification method</p>
                                                                    <p className="text-xs text-muted-foreground mt-0.5">
                                                                        Choose how your card is securely verified
                                                                    </p>
                                                                </div>
                                                                <div className="grid grid-cols-2 gap-3">
                                                                    {(['paystack', 'stripe'] as const).map((p) => {
                                                                        const isSelected = newCard.provider === p;
                                                                        return (
                                                                            <button
                                                                                key={p}
                                                                                type="button"
                                                                                onClick={() => setNewCard({ ...newCard, provider: p })}
                                                                                className={cn(
                                                                                    "rounded-lg border p-3 text-left transition-all duration-150 relative bg-background",
                                                                                    isSelected
                                                                                        ? "border-[#748943] ring-1 ring-[#748943]"
                                                                                        : "border-border hover:border-[#748943]/40"
                                                                                )}
                                                                            >
                                                                                {isSelected && (
                                                                                    <span className="absolute top-2 right-2 w-4 h-4 rounded-full bg-[#748943] flex items-center justify-center">
                                                                                        <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />
                                                                                    </span>
                                                                                )}
                                                                                <p className="text-sm font-medium capitalize pr-5">{p}</p>
                                                                                <p className="text-xs text-muted-foreground mt-0.5">
                                                                                    {p === 'paystack' ? 'African cards' : 'Global support'}
                                                                                </p>
                                                                                <span className="inline-flex items-center gap-1 mt-2 text-[11px] text-muted-foreground border border-border rounded-full px-2 py-0.5">
                                                                                    <ShieldCheck className="w-3 h-3" />
                                                                                    3D Secure
                                                                                </span>
                                                                            </button>
                                                                        );
                                                                    })}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-span-1 flex items-center gap-2">
                                                            <Checkbox
                                                                id="set-default"
                                                                checked={newCard.is_default}
                                                                onCheckedChange={(checked) => setNewCard({ ...newCard, is_default: checked === true })}
                                                            />
                                                            <Label htmlFor="set-default" className="text-xs sm:text-sm text-muted-foreground">
                                                                Set as default payment method
                                                            </Label>
                                                        </div>
                                                    </div>
                                                    <Button className="mt-4" onClick={handleAddCard}>
                                                        Add Card
                                                    </Button>
                                                    <Button variant="ghost" onClick={() => setShowAddCard(false)}>
                                                        Cancel
                                                    </Button>
                                                </div>
                                            )}
                                        </>
                                    )}
                                </CollapsibleContent>
                            </Card>
                        </Collapsible>

                        {/* Preferred Delivery Method */}
                        {/* <Collapsible open={deliveryOpen} onOpenChange={setDeliveryOpen}>
                            <Card>
                                <CollapsibleTrigger className="w-full p-4 sm:p-6 flex items-center justify-between gap-3">
                                    <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                                        <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center shrink-0 ${deliveryMethod ? "bg-emerald-500/10 text-emerald-500" : "bg-muted text-muted-foreground"
                                            }`}>
                                            {deliveryMethod ? <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5" /> : <Truck className="h-4 w-4 sm:h-5 sm:w-5" />}
                                        </div>
                                        <div className="text-left min-w-0">
                                            <h3 className="font-semibold text-foreground text-sm sm:text-base truncate">Preferred Delivery Method</h3>
                                            <p className="text-xs sm:text-sm text-muted-foreground">Required</p>
                                        </div>
                                    </div>
                                    <ChevronDown className={`h-5 w-5 text-muted-foreground transition-transform shrink-0 ${deliveryOpen ? "rotate-180" : ""}`} />
                                </CollapsibleTrigger>
                                <CollapsibleContent className="px-4 sm:px-6 pb-4 sm:pb-6">
                                    <RadioGroup value={deliveryMethod} onValueChange={(value) => setDeliveryMethod(value as "pickup" | "ship")}>
                                        <div className="space-y-3">
                                            <div className={`p-3 sm:p-4 border rounded-lg transition-colors ${deliveryMethod === "pickup" ? "border-primary bg-primary/5" : "border-border"
                                                }`}>
                                                <div className="flex items-start gap-2 sm:gap-3">
                                                    <RadioGroupItem value="pickup" id="pickup" className="mt-1" />
                                                    <Label htmlFor="pickup" className="flex-1 flex flex-col items-start cursor-pointer">
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <MapPin className="h-4 w-4" />
                                                            <span className="font-medium text-foreground text-sm sm:text-base">Pickup</span>
                                                        </div>
                                                        {deliveryMethod === "pickup" && (
                                                            <div className="w-full flex flex-col sm:flex-row gap-3 sm:gap-4 sm:justify-between mt-3">
                                                                <div className="flex-1">
                                                                    <p className="text-xs sm:text-sm text-muted-foreground">
                                                                        {mockAuctionData.pickupAddress}
                                                                    </p>
                                                                </div>
                                                                <div className="w-full sm:w-32 h-32 sm:h-20 bg-muted rounded-lg overflow-hidden shrink-0">
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

                                            <div className={`p-3 sm:p-4 border rounded-lg transition-colors ${deliveryMethod === "ship" ? "border-primary bg-primary/5" : "border-border"
                                                } ${!mockAuctionData.shippingAvailable ? "opacity-50" : ""}`}>
                                                <div className="flex items-start gap-2 sm:gap-3">
                                                    <RadioGroupItem
                                                        value="ship"
                                                        id="ship"
                                                        className="mt-1"
                                                        disabled={!mockAuctionData.shippingAvailable}
                                                    />
                                                    <Label htmlFor="ship" className="flex-1 cursor-pointer">
                                                        <div className="flex items-center gap-2">
                                                            <Truck className="h-4 w-4" />
                                                            <span className="font-medium text-foreground text-sm sm:text-base">Ship to Address</span>
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
                        </Collapsible> */}

                        {/* Terms & Conditions */}
                        <Collapsible open={termsOpen} onOpenChange={setTermsOpen}>
                            <Card>
                                <CollapsibleTrigger className="w-full p-4 sm:p-6 flex items-center justify-between gap-3">
                                    <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                                        <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center shrink-0 ${agreeToTerms ? "bg-emerald-500/10 text-emerald-500" : "bg-muted text-muted-foreground"
                                            }`}>
                                            {agreeToTerms ? <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5" /> : <FileText className="h-4 w-4 sm:h-5 sm:w-5" />}
                                        </div>
                                        <div className="text-left min-w-0">
                                            <h3 className="font-semibold text-foreground text-sm sm:text-base truncate">Auction Terms & Conditions</h3>
                                            <p className="text-xs sm:text-sm text-muted-foreground">Required</p>
                                        </div>
                                    </div>
                                    <ChevronDown className={`h-5 w-5 text-muted-foreground transition-transform shrink-0 ${termsOpen ? "rotate-180" : ""}`} />
                                </CollapsibleTrigger>
                                <CollapsibleContent className="px-4 sm:px-6 pb-4 sm:pb-6">
                                    <div className="bg-muted/50 rounded-lg p-3 sm:p-4 max-h-40 sm:max-h-48 overflow-y-auto mb-4">
                                        <pre className="text-xs sm:text-sm text-muted-foreground whitespace-pre-wrap font-sans">
                                            {auctionData?.terms_and_condition || "No terms and conditions provided for this auction."}
                                        </pre>
                                    </div>

                                    <div className="mb-4">
                                        <Label htmlFor="phone" className="text-xs sm:text-sm text-muted-foreground mb-2 block">
                                            Phone Number <span className="text-destructive">*</span>
                                        </Label>
                                        <Input
                                            id="phone"
                                            type="tel"
                                            placeholder="+234 800 000 0000"
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            className="text-sm"
                                        />
                                        <p className="text-xs text-muted-foreground mt-1">
                                            Used by the auctioneer to contact you if you win.
                                        </p>
                                    </div>

                                    {/* <div className="mb-4">
                                        <Label htmlFor="seller-note" className="text-xs sm:text-sm text-muted-foreground mb-2 block">
                                            Note to Seller (Optional)
                                        </Label>
                                        <Textarea
                                            id="seller-note"
                                            placeholder="Add a message for the seller..."
                                            value={sellerNote}
                                            onChange={(e) => setSellerNote(e.target.value)}
                                            className="resize-none text-sm"
                                            rows={3}
                                        />
                                    </div> */}

                                    <div className="flex items-start gap-2 sm:gap-3">
                                        <Checkbox
                                            id="terms"
                                            checked={agreeToTerms}
                                            onCheckedChange={(checked) => setAgreeToTerms(checked === true)}
                                        />
                                        <Label htmlFor="terms" className="text-xs sm:text-sm text-foreground cursor-pointer">
                                            I agree to the auction&apos;s terms and conditions
                                        </Label>
                                    </div>
                                </CollapsibleContent>
                            </Card>
                        </Collapsible>

                        {/* Submit Button */}
                        <Button
                            className="w-full h-11 sm:h-12 text-base sm:text-lg"
                            disabled={!isFormComplete || isPending}
                            onClick={handleRegister}
                        >
                            {isPending ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                    Processing...
                                </>
                            ) : (
                                "Complete Registration"
                            )}
                        </Button>
                    </div>
                </div>
            </main>

            <HowToBidModal open={howToBidOpen} onOpenChange={setHowToBidOpen} />
        </div>
    );
};

export default AuctionRegistration;
