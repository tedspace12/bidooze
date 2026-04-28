'use client';

import { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
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
    MapPin,
    FileText,
    Calendar,
    Clock,
    Gavel,
    CheckCircle2,
    Plus,
    HelpCircle,
    Loader2,
    Check,
    ShieldCheck,
    Info,
    AlertCircle,
} from "lucide-react";
import { format } from "date-fns";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { useAuth } from "@/features/auth/hooks/useAuth";
import Link from "next/link";
import { useAuction } from "./hooks/useAuction";
import HowToBidModal from "./components/registration/modal/HowToBidModal";
import { Input } from "@/components/ui/input";
import ListingImage from "@/components/shared/listing-image";
import { RegistrationRequirements } from "./types";

interface PaymentMethod {
    id: number;
    provider: string;
    label: string;
    card_holder_name: string;
    card_type: string;
    last4: string;
    expiry_month: number;
    expiry_year: number;
    bank: string;
    country_code: string;
    ref: string | null;
    is_verified: boolean;
    is_default: boolean;
    created_at: string;
}

const formatPrice = (price: number, currency = "USD") =>
    new Intl.NumberFormat("en-US", {
        style: "currency",
        currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    }).format(price);

const calcDeposit = (
    maxBid: number,
    deposit: NonNullable<RegistrationRequirements["deposit"]>
): number => {
    if (deposit.type === "fixed") return deposit.fixed_amount ?? 0;
    const raw = (maxBid * deposit.value) / 100;
    return deposit.cap ? Math.min(raw, deposit.cap) : raw;
};

const formatExpiryDateInput = (raw: string): string => {
    const digits = raw.replace(/\D/g, "").slice(0, 4);
    if (digits.length <= 2) return digits;
    return `${digits.slice(0, 2)}/${digits.slice(2)}`;
};

const getErrorMessage = (error: any): string => {
    if (error?.errors && typeof error.errors === "object") {
        const first = Object.values(error.errors) as string[][];
        if (first.length > 0 && first[0].length > 0) return first[0][0];
    }
    return error?.message || "An error occurred";
};

const AuctionRegistration = () => {
    const { getPaymentMethods, addPaymentMethod, verifyPaymentMethod } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();

    const source = searchParams.get("source") || "auction";
    const sourceId = searchParams.get("id") || "1";

    const { useAuctionDetails, useRegisterForAuction } = useAuction(sourceId);
    const { data: auctionData, isLoading, isError } = useAuctionDetails();
    const { mutate, isPending } = useRegisterForAuction();

    const requirements = auctionData?.registration_requirements;

    // ── UI state ────────────────────────────────────────────────
    const [paymentOpen, setPaymentOpen] = useState(true);
    const [depositOpen, setDepositOpen] = useState(true);
    const [termsOpen, setTermsOpen] = useState(false);
    const [howToBidOpen, setHowToBidOpen] = useState(false);

    // ── Form state ───────────────────────────────────────────────
    const [phone, setPhone] = useState("");
    const [agreeToTerms, setAgreeToTerms] = useState(false);
    const [maxBidLimit, setMaxBidLimit] = useState("");
    const [selectedCard, setSelectedCard] = useState<string | null>(null);

    // ── Payment methods ──────────────────────────────────────────
    const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
    const [isLoadingPayments, setIsLoadingPayments] = useState(false);
    const [showAddCard, setShowAddCard] = useState(false);
    const [newCard, setNewCard] = useState({
        provider: "",
        card_holder_name: "",
        card_number: "",
        expiration_date: "",
        cvv: "",
        is_default: false,
    });

    // Auto-open terms when there's nothing else to action first
    useEffect(() => {
        if (!requirements) return;
        if (!requirements.requires_card && !requirements.requires_deposit) {
            setTermsOpen(true);
        }
    }, [requirements]);

    // Load payment methods when this auction requires a card or a deposit payment
    useEffect(() => {
        if (!requirements) return;
        if (requirements.requires_card || requirements.requires_deposit) {
            loadPaymentMethods();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [requirements?.requires_card, requirements?.requires_deposit]);

    const loadPaymentMethods = async () => {
        setIsLoadingPayments(true);
        try {
            const response = await getPaymentMethods.mutateAsync();
            setPaymentMethods(response.payment_methods || []);
        } catch {
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
            setNewCard({ provider: "", card_holder_name: "", card_number: "", expiration_date: "", cvv: "", is_default: false });
            setShowAddCard(false);
            loadPaymentMethods();
        } catch (error: any) {
            toast.error(getErrorMessage(error));
        }
    };

    const handleVerifyCard = async (paymentMethodId: number) => {
        try {
            await verifyPaymentMethod.mutateAsync({ paymentMethodId });
            toast.success("Payment method verified successfully");
            loadPaymentMethods();
        } catch (error: any) {
            toast.error(getErrorMessage(error));
        }
    };

    // ── Deposit preview ──────────────────────────────────────────
    const depositPreview = useMemo(() => {
        if (!requirements?.requires_deposit || !requirements.deposit) return null;
        const dep = requirements.deposit;
        if (dep.type === "fixed" && dep.fixed_amount !== null) {
            return formatPrice(dep.fixed_amount, dep.currency);
        }
        const raw = parseFloat(maxBidLimit.replace(/,/g, ""));
        if (!isNaN(raw) && raw > 0) {
            return formatPrice(calcDeposit(raw, dep), dep.currency);
        }
        return null;
    }, [requirements, maxBidLimit]);

    // ── Form completeness ────────────────────────────────────────
    const needsCardSelection = !!(requirements?.requires_card || requirements?.requires_deposit);

    const isFormComplete = useMemo(() => {
        if (!agreeToTerms || !phone.trim()) return false;
        if (needsCardSelection) {
            if (!selectedCard) return false;
            const method = paymentMethods.find((m) => String(m.id) === selectedCard);
            if (!method?.is_verified || !method?.ref) return false;
        }
        if (requirements?.deposit?.requires_max_bid_limit) {
            const v = parseFloat(maxBidLimit.replace(/,/g, ""));
            if (!v || v <= 0) return false;
        }
        return true;
    }, [agreeToTerms, phone, needsCardSelection, requirements, selectedCard, paymentMethods, maxBidLimit]);

    // ── Submit ───────────────────────────────────────────────────
    const handleRegister = () => {
        if (!agreeToTerms) { toast.error("You must agree to the terms"); return; }
        if (!phone.trim()) { toast.error("Please enter your phone number"); return; }

        const selectedPayment = needsCardSelection
            ? paymentMethods.find((m) => String(m.id) === selectedCard)
            : undefined;

        if (needsCardSelection) {
            if (!selectedPayment) { toast.error("Please select a payment method"); return; }
            if (!selectedPayment.is_verified) { toast.error("Please verify your card first"); return; }
            if (!selectedPayment.ref) { toast.error("Payment method is not properly linked"); return; }
        }

        const maxBid = parseFloat(maxBidLimit.replace(/,/g, ""));
        if (requirements?.deposit?.requires_max_bid_limit && (!maxBid || maxBid <= 0)) {
            toast.error("Please enter your maximum bid limit");
            return;
        }

        const payload: Record<string, unknown> = {
            accepted_terms: true,
            terms_version: "v1",
            phone: phone.trim(),
        };

        if (selectedPayment) {
            // Card used for deposit payment gateway
            payload.provider = selectedPayment.provider;
            // Card token for direct charge or credit card verification
            payload.payment_method_provider = selectedPayment.provider;
            payload.payment_method_ref = selectedPayment.ref;
        }

        if (requirements?.requires_deposit) {
            payload.return_url = `${window.location.origin}/payments/return`;
            if (requirements.deposit?.requires_max_bid_limit && maxBid) {
                payload.max_bid_limit = maxBid;
            }
        }

        mutate(payload as any, {
            onSuccess: (res) => {
                toast.success(res.message || "Registration successful");

                if (res.approval_option === "deposit" && res.deposit) {
                    const instructions = res.deposit.provider_instructions;

                    if (instructions.provider === "stripe" && instructions.client_secret) {
                        sessionStorage.setItem("stripe_client_secret", instructions.client_secret);
                        sessionStorage.setItem("stripe_publishable_key", instructions.publishable_key ?? "");
                        sessionStorage.setItem("deposit_provider", "stripe");
                        sessionStorage.setItem("deposit_return_source", source);
                        sessionStorage.setItem("deposit_return_id", sourceId);
                        router.push("/payments/stripe-confirm");
                        return;
                    }

                    const redirectUrl = instructions.redirect_url || instructions.authorization_url;
                    if (redirectUrl) {
                        sessionStorage.setItem("deposit_provider", instructions.provider);
                        sessionStorage.setItem("deposit_return_source", source);
                        sessionStorage.setItem("deposit_return_id", sourceId);
                        window.location.href = redirectUrl;
                        return;
                    }
                }

                router.push(source === "lot" ? `/lot/${sourceId}` : `/auction/${sourceId}`);
            },
            onError: (error: any) => {
                toast.error(getErrorMessage(error));
            },
        });
    };

    // ── Render ───────────────────────────────────────────────────
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
                <div className="mb-6 md:mb-8">
                    <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">Register for the Auction</h1>
                    <p className="text-sm md:text-base text-muted-foreground max-w-2xl">
                        Auctioneers use registrations to approve you to bid, confirm delivery, and record your agreement to their terms.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
                    {/* ── Left: Auction context ── */}
                    <div className="lg:col-span-1">
                        <Card className="p-4 md:p-6 lg:sticky lg:top-4">
                            {isLoading ? (
                                <div className="space-y-4">
                                    <div className="h-40 bg-muted rounded-lg animate-pulse" />
                                    <div className="h-5 w-3/4 bg-muted animate-pulse rounded" />
                                    <div className="h-4 w-1/2 bg-muted animate-pulse rounded" />
                                    <div className="space-y-2 mt-4">
                                        {[1, 2, 3].map((i) => <div key={i} className="h-4 bg-muted animate-pulse rounded" />)}
                                    </div>
                                </div>
                            ) : isError || !auctionData ? (
                                <div className="text-center py-12">
                                    <p className="text-destructive font-medium">Error loading auction</p>
                                    <p className="text-sm text-muted-foreground mt-1">Failed to fetch auction details.</p>
                                </div>
                            ) : (
                                <div>
                                    <ListingImage
                                        kind="auction"
                                        src={auctionData.image_url}
                                        alt={auctionData.name}
                                        width={500}
                                        height={500}
                                        className="w-full aspect-video object-cover rounded-lg mb-4"
                                    />
                                    <h3 className="font-semibold text-foreground mb-1 text-sm sm:text-base">{auctionData.name}</h3>
                                    <p className="text-xs sm:text-sm text-muted-foreground mb-4">by {auctionData.auctioneer.company_name}</p>

                                    <div className="space-y-2 text-xs sm:text-sm">
                                        <div className="flex items-start gap-2">
                                            <MapPin className="h-3.5 w-3.5 text-muted-foreground mt-0.5 shrink-0" />
                                            <span className="text-muted-foreground">
                                                {[auctionData.location?.city, auctionData.location?.state, auctionData.location?.country].filter(Boolean).join(", ") || "Location not available"}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                                            <span className="text-muted-foreground">
                                                {auctionData.start_date && auctionData.end_date && (
                                                    <>{format(new Date(auctionData.start_date), "MMM d")} – {format(new Date(auctionData.end_date), "MMM d, yyyy")}</>
                                                )}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Gavel className="h-3.5 w-3.5 text-muted-foreground" />
                                            <span className="text-muted-foreground">{auctionData.type}</span>
                                        </div>
                                        <Badge className={`${auctionData.bidding_status?.toLowerCase() === "open" ? "bg-emerald-500" : "bg-red-500"} text-white text-xs`}>
                                            {auctionData.bidding_status}
                                        </Badge>
                                    </div>

                                    <Button variant="link" className="mt-3 px-0 py-0 h-auto text-primary" onClick={() => setHowToBidOpen(true)}>
                                        <HelpCircle className="h-4 w-4 mr-1" />
                                        How to Bid
                                    </Button>
                                </div>
                            )}
                        </Card>
                    </div>

                    {/* ── Right: Registration form ── */}
                    <div className="lg:col-span-2 space-y-4">
                        {isLoading ? (
                            /* Right column skeleton while we wait for requirements */
                            <div className="space-y-4">
                                {[1, 2, 3].map((i) => (
                                    <Card key={i} className="p-6">
                                        <div className="h-5 w-1/3 bg-muted animate-pulse rounded mb-3" />
                                        <div className="h-16 bg-muted animate-pulse rounded" />
                                    </Card>
                                ))}
                            </div>
                        ) : (
                            <>
                                {/* ── Approval mode notice ── */}
                                {requirements?.approval_mode === "approval" && (
                                    <div className="flex items-start gap-3 p-4 rounded-lg border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/30">
                                        <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
                                        <p className="text-sm text-amber-800 dark:text-amber-200">
                                            Your registration is subject to <strong>auctioneer approval</strong>. You will be notified once reviewed before you can place bids.
                                        </p>
                                    </div>
                                )}

                                {/* ── Deposit section ── */}
                                {requirements?.requires_deposit && requirements.deposit && (
                                    <Collapsible open={depositOpen} onOpenChange={setDepositOpen}>
                                        <Card>
                                            <CollapsibleTrigger className="w-full p-4 sm:p-6 flex items-center justify-between gap-3">
                                                <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                                                    <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center shrink-0 ${
                                                        requirements.deposit.type === "fixed" || (requirements.deposit.requires_max_bid_limit && parseFloat(maxBidLimit) > 0)
                                                            ? "bg-emerald-500/10 text-emerald-500"
                                                            : "bg-muted text-muted-foreground"
                                                    }`}>
                                                        {(requirements.deposit.type === "fixed" || (requirements.deposit.requires_max_bid_limit && parseFloat(maxBidLimit) > 0))
                                                            ? <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5" />
                                                            : <Info className="h-4 w-4 sm:h-5 sm:w-5" />}
                                                    </div>
                                                    <div className="text-left min-w-0">
                                                        <h3 className="font-semibold text-foreground text-sm sm:text-base">Refundable Deposit</h3>
                                                        <p className="text-xs sm:text-sm text-muted-foreground">
                                                            {depositPreview ? `${depositPreview} required` : "Required to register"}
                                                        </p>
                                                    </div>
                                                </div>
                                                <ChevronDown className={`h-5 w-5 text-muted-foreground transition-transform shrink-0 ${depositOpen ? "rotate-180" : ""}`} />
                                            </CollapsibleTrigger>

                                            <CollapsibleContent className="px-4 sm:px-6 pb-4 sm:pb-6">
                                                <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-3 sm:p-4 mb-4">
                                                    <p className="text-xs sm:text-sm text-blue-800 dark:text-blue-200">
                                                        This deposit is fully refundable if you don&apos;t win. It will be applied toward your purchase if you do win.
                                                    </p>
                                                </div>

                                                {requirements.deposit.type === "fixed" ? (
                                                    <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                                                        <span className="text-sm text-muted-foreground">Deposit amount</span>
                                                        <span className="font-semibold text-foreground text-lg">
                                                            {formatPrice(requirements.deposit.fixed_amount!, requirements.deposit.currency)}
                                                        </span>
                                                    </div>
                                                ) : (
                                                    <div className="space-y-4">
                                                        <div>
                                                            <Label htmlFor="maxBidLimit" className="text-sm font-medium mb-1.5 block">
                                                                Maximum Bid Limit <span className="text-destructive">*</span>
                                                            </Label>
                                                            <p className="text-xs text-muted-foreground mb-2">
                                                                Your intended spending ceiling. The deposit is calculated as {requirements.deposit.value}% of this amount
                                                                {requirements.deposit.cap ? `, capped at ${formatPrice(requirements.deposit.cap, requirements.deposit.currency)}` : ""}.
                                                            </p>
                                                            <div className="relative">
                                                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">$</span>
                                                                <Input
                                                                    id="maxBidLimit"
                                                                    inputMode="numeric"
                                                                    placeholder="10,000"
                                                                    value={maxBidLimit}
                                                                    onChange={(e) => setMaxBidLimit(e.target.value.replace(/[^0-9.,]/g, ""))}
                                                                    className="pl-7 text-sm h-11"
                                                                />
                                                            </div>
                                                        </div>

                                                        {depositPreview && (
                                                            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg border border-border">
                                                                <span className="text-sm text-muted-foreground">Your deposit</span>
                                                                <span className="font-semibold text-foreground text-lg">{depositPreview}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </CollapsibleContent>
                                        </Card>
                                    </Collapsible>
                                )}

                                {/* ── Payment card section (card verification OR deposit payment) ── */}
                                {needsCardSelection && (
                                    <Collapsible open={paymentOpen} onOpenChange={setPaymentOpen}>
                                        <Card>
                                            <CollapsibleTrigger className="w-full p-4 sm:p-6 flex items-center justify-between gap-3">
                                                <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                                                    <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center ${selectedCard && paymentMethods.find((m) => String(m.id) === selectedCard)?.is_verified ? "bg-emerald-500/10 text-emerald-500" : "bg-muted text-muted-foreground"}`}>
                                                        {selectedCard && paymentMethods.find((m) => String(m.id) === selectedCard)?.is_verified
                                                            ? <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5" />
                                                            : <CreditCard className="h-4 w-4 sm:h-5 sm:w-5" />}
                                                    </div>
                                                    <div className="text-left min-w-0">
                                                        <h3 className="font-semibold text-foreground text-sm sm:text-base truncate">
                                                            {requirements?.requires_card ? "Payment Verification" : "Select Payment Card"}
                                                        </h3>
                                                        <p className="text-xs sm:text-sm text-muted-foreground">
                                                            {requirements?.requires_card ? "Required by this auction" : "Card to charge for deposit"}
                                                        </p>
                                                    </div>
                                                </div>
                                                <ChevronDown className={`h-5 w-5 text-muted-foreground transition-transform shrink-0 ${paymentOpen ? "rotate-180" : ""}`} />
                                            </CollapsibleTrigger>

                                            <CollapsibleContent className="px-4 sm:px-6 pb-4 sm:pb-6">
                                                <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg p-3 sm:p-4 mb-4">
                                                    <p className="text-xs sm:text-sm text-amber-800 dark:text-amber-200">
                                                        {requirements?.requires_card
                                                            ? "You will not be charged until you win. To verify your card, we'll place a $1 temporary hold that will be released within 5–7 business days."
                                                            : "Select the card you want to use to pay the deposit. The deposit is fully refundable if you don't win."}
                                                    </p>
                                                </div>

                                                {isLoadingPayments ? (
                                                    <div className="flex items-center justify-center py-8">
                                                        <Loader2 className="h-5 w-5 animate-spin mr-2" />
                                                        <span className="text-sm text-muted-foreground">Loading payment methods...</span>
                                                    </div>
                                                ) : (
                                                    <>
                                                        <div className="space-y-3">
                                                            {paymentMethods.length === 0 ? (
                                                                <div className="text-center py-8 text-muted-foreground text-sm">
                                                                    No payment methods added yet
                                                                </div>
                                                            ) : (
                                                                <RadioGroup value={selectedCard ?? ""} onValueChange={setSelectedCard}>
                                                                    {paymentMethods.map((method) => {
                                                                        const id = String(method.id);
                                                                        return (
                                                                            <div key={method.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 border border-border rounded-lg gap-3 sm:gap-0">
                                                                                <div className="flex items-center gap-2 sm:gap-3">
                                                                                    <RadioGroupItem value={id} id={id} />
                                                                                    <Label htmlFor={id} className="flex flex-wrap items-center gap-2 sm:gap-3 cursor-pointer">
                                                                                        <CreditCard className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                                                                                        <span className="text-foreground text-sm sm:text-base capitalize">
                                                                                            {method.card_type} •••• {method.last4}
                                                                                        </span>
                                                                                        <span className="text-xs sm:text-sm text-muted-foreground">
                                                                                            Expires {String(method.expiry_month).padStart(2, "0")}/{String(method.expiry_year).slice(-2)}
                                                                                        </span>
                                                                                        {!method.is_verified && <Badge variant="destructive" className="text-xs">Unverified</Badge>}
                                                                                        {method.is_default && <Badge variant="secondary" className="text-xs">Default</Badge>}
                                                                                    </Label>
                                                                                </div>
                                                                                {!method.is_verified && (
                                                                                    <Button variant="outline" size="sm" className="self-end sm:self-auto" onClick={() => handleVerifyCard(method.id)}>
                                                                                        Verify
                                                                                    </Button>
                                                                                )}
                                                                            </div>
                                                                        );
                                                                    })}
                                                                </RadioGroup>
                                                            )}

                                                            <Button variant="outline" className="mt-4 gap-2 w-full sm:w-auto" onClick={() => setShowAddCard(true)}>
                                                                <Plus className="h-4 w-4" />
                                                                Add New Card
                                                            </Button>
                                                        </div>

                                                        {showAddCard && (
                                                            <div className="mt-6 p-3 sm:p-4 border border-border rounded-lg">
                                                                <h4 className="font-semibold text-foreground mb-4">Add Payment Method</h4>
                                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                                    <div className="col-span-1">
                                                                        <Label className="text-xs sm:text-sm text-muted-foreground mb-1">Cardholder Name</Label>
                                                                        <Input placeholder="John Doe" value={newCard.card_holder_name} onChange={(e) => setNewCard({ ...newCard, card_holder_name: e.target.value })} />
                                                                    </div>
                                                                    <div className="col-span-1">
                                                                        <Label className="text-xs sm:text-sm text-muted-foreground mb-1">Card Number</Label>
                                                                        <Input placeholder="1234 5678 9012 3456" value={newCard.card_number} onChange={(e) => setNewCard({ ...newCard, card_number: e.target.value })} />
                                                                    </div>
                                                                    <div className="col-span-1 sm:col-span-2 grid grid-cols-2 gap-3 sm:gap-4">
                                                                        <div>
                                                                            <Label className="text-xs sm:text-sm text-muted-foreground mb-1">Expiration Date</Label>
                                                                            <Input
                                                                                placeholder="MM/YY"
                                                                                inputMode="numeric"
                                                                                maxLength={5}
                                                                                value={newCard.expiration_date}
                                                                                onChange={(e) => setNewCard({ ...newCard, expiration_date: formatExpiryDateInput(e.target.value) })}
                                                                            />
                                                                        </div>
                                                                        <div>
                                                                            <Label className="text-xs sm:text-sm text-muted-foreground mb-1">CVV</Label>
                                                                            <Input
                                                                                placeholder="123"
                                                                                inputMode="numeric"
                                                                                maxLength={4}
                                                                                value={newCard.cvv}
                                                                                onChange={(e) => setNewCard({ ...newCard, cvv: e.target.value.replace(/\D/g, "").slice(0, 4) })}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                    <div className="border-t border-border pt-4 -mx-3 sm:-mx-4 px-3 sm:px-4 col-span-1 sm:col-span-2">
                                                                        <div className="bg-muted/40 rounded-lg p-3 space-y-3">
                                                                            <div>
                                                                                <p className="text-sm font-medium">Verification method</p>
                                                                                <p className="text-xs text-muted-foreground mt-0.5">Choose how your card is securely verified</p>
                                                                            </div>
                                                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                                                {(["paystack", "stripe"] as const).map((p) => {
                                                                                    const isSelected = newCard.provider === p;
                                                                                    return (
                                                                                        <button
                                                                                            key={p}
                                                                                            type="button"
                                                                                            onClick={() => setNewCard({ ...newCard, provider: p })}
                                                                                            className={cn(
                                                                                                "rounded-lg border p-3 text-left transition-all duration-150 relative bg-background",
                                                                                                isSelected ? "border-primary ring-1 ring-primary" : "border-border hover:border-primary/40"
                                                                                            )}
                                                                                        >
                                                                                            {isSelected && (
                                                                                                <span className="absolute top-2 right-2 w-4 h-4 rounded-full bg-primary flex items-center justify-center">
                                                                                                    <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />
                                                                                                </span>
                                                                                            )}
                                                                                            <p className="text-sm font-medium capitalize pr-5">{p}</p>
                                                                                            <p className="text-xs text-muted-foreground mt-0.5">{p === "paystack" ? "African cards" : "Global support"}</p>
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
                                                                    <div className="col-span-1 sm:col-span-2 flex items-center gap-2">
                                                                        <Checkbox id="set-default" checked={newCard.is_default} onCheckedChange={(c) => setNewCard({ ...newCard, is_default: c === true })} />
                                                                        <Label htmlFor="set-default" className="text-xs sm:text-sm text-muted-foreground">Set as default payment method</Label>
                                                                    </div>
                                                                </div>
                                                                <div className="mt-4 flex flex-col-reverse sm:flex-row sm:justify-end gap-2">
                                                                    <Button variant="ghost" className="w-full sm:w-auto" onClick={() => setShowAddCard(false)}>Cancel</Button>
                                                                    <Button className="w-full sm:w-auto" onClick={handleAddCard} disabled={addPaymentMethod.isPending}>
                                                                        {addPaymentMethod.isPending ? <><Loader2 className="h-4 w-4 animate-spin mr-2" />Adding...</> : "Add Card"}
                                                                    </Button>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </>
                                                )}
                                            </CollapsibleContent>
                                        </Card>
                                    </Collapsible>
                                )}

                                {/* ── Terms & Conditions ── */}
                                <Collapsible open={termsOpen} onOpenChange={setTermsOpen}>
                                    <Card>
                                        <CollapsibleTrigger className="w-full p-4 sm:p-6 flex items-center justify-between gap-3">
                                            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                                                <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center shrink-0 ${agreeToTerms ? "bg-emerald-500/10 text-emerald-500" : "bg-muted text-muted-foreground"}`}>
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
                                                <p className="text-xs text-muted-foreground mt-1">Used by the auctioneer to contact you if you win.</p>
                                            </div>

                                            <div className="flex items-start gap-2 sm:gap-3">
                                                <Checkbox id="terms" checked={agreeToTerms} onCheckedChange={(c) => setAgreeToTerms(c === true)} />
                                                <Label htmlFor="terms" className="text-xs sm:text-sm text-foreground cursor-pointer">
                                                    I agree to the auction&apos;s terms and conditions
                                                </Label>
                                            </div>
                                        </CollapsibleContent>
                                    </Card>
                                </Collapsible>

                                {/* ── Submit ── */}
                                <Button
                                    className="w-full h-11 sm:h-12 text-base sm:text-lg"
                                    disabled={!isFormComplete || isPending || isLoading}
                                    onClick={handleRegister}
                                >
                                    {isPending ? (
                                        <><Loader2 className="h-4 w-4 animate-spin mr-2" />Processing...</>
                                    ) : (
                                        "Complete Registration"
                                    )}
                                </Button>
                            </>
                        )}
                    </div>
                </div>
            </main>

            <HowToBidModal open={howToBidOpen} onOpenChange={setHowToBidOpen} />
        </div>
    );
};

export default AuctionRegistration;
