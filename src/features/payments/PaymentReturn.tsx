'use client';

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle2, XCircle, Loader2, Clock, Ban } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

type Status = "verifying" | "success" | "processing" | "failed" | "cancelled";

interface Context {
    provider: string;
    destination: string;
}

const REDIRECT_DELAY = 5; // seconds before auto-redirect on success/processing

const readContext = (): Context => {
    const provider = sessionStorage.getItem("deposit_provider") ?? "";
    const source = sessionStorage.getItem("deposit_return_source") ?? "auction";
    const id = sessionStorage.getItem("deposit_return_id") ?? "";
    const destination = source === "lot" ? `/lot/${id}` : `/auction/${id}`;
    return { provider, destination };
};

const clearSession = () => {
    [
        "deposit_provider",
        "deposit_return_source",
        "deposit_return_id",
        "stripe_client_secret",
        "stripe_publishable_key",
    ].forEach((k) => sessionStorage.removeItem(k));
};

const resolveStatus = (provider: string, params: URLSearchParams): Status => {
    if (provider === "stripe") {
        const s = params.get("redirect_status");
        if (s === "succeeded") return "success";
        if (s === "processing") return "processing";
        return "failed";
    }

    if (provider === "paystack") {
        const ref = params.get("reference") || params.get("trxref");
        return ref ? "success" : "failed";
    }

    if (provider === "flutterwave") {
        const s = params.get("status");
        if (s === "successful") return "success";
        if (s === "cancelled") return "cancelled";
        return "failed";
    }

    // Unknown provider — check for any common success signal
    if (params.get("reference") || params.get("transaction_id") || params.get("redirect_status") === "succeeded") {
        return "success";
    }
    return "failed";
};

const STATUS_COPY: Record<Status, { heading: string; body: string }> = {
    verifying: {
        heading: "Verifying payment…",
        body: "Please wait while we confirm your transaction.",
    },
    success: {
        heading: "You're registered!",
        body: "Your deposit has been received. You can now bid on this auction.",
    },
    processing: {
        heading: "Payment processing",
        body: "Your payment is being processed. Your registration will activate automatically once confirmed.",
    },
    cancelled: {
        heading: "Payment cancelled",
        body: "The payment was cancelled. Your registration has not been completed.",
    },
    failed: {
        heading: "Payment incomplete",
        body: "We couldn't confirm your payment. Please try again or contact support.",
    },
};

const PaymentReturn = () => {
    const router = useRouter();
    const params = useSearchParams();
    const [status, setStatus] = useState<Status>("verifying");
    const [countdown, setCountdown] = useState(REDIRECT_DELAY);
    const destinationRef = useRef("/auctions");

    useEffect(() => {
        const { provider, destination } = readContext();
        destinationRef.current = destination;

        const resolved = resolveStatus(provider, params);
        setStatus(resolved);

        if (resolved === "success" || resolved === "processing") {
            clearSession();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Auto-redirect countdown on success / processing
    useEffect(() => {
        if (status !== "success" && status !== "processing") return;

        const interval = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(interval);
                    router.push(destinationRef.current);
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [status, router]);

    const copy = STATUS_COPY[status];

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-background">
            <div className="max-w-md w-full">
                <div className="rounded-2xl border border-border bg-card p-8 text-center space-y-5 shadow-sm">
                    {/* Icon */}
                    <div className="flex justify-center">
                        {status === "verifying" && (
                            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                            </div>
                        )}
                        {(status === "success" || status === "processing") && (
                            <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center">
                                {status === "success"
                                    ? <CheckCircle2 className="h-8 w-8 text-emerald-500" />
                                    : <Clock className="h-8 w-8 text-emerald-500" />}
                            </div>
                        )}
                        {status === "cancelled" && (
                            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                                <Ban className="h-8 w-8 text-muted-foreground" />
                            </div>
                        )}
                        {status === "failed" && (
                            <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
                                <XCircle className="h-8 w-8 text-destructive" />
                            </div>
                        )}
                    </div>

                    {/* Copy */}
                    <div className="space-y-2">
                        <h2 className="text-xl font-semibold text-foreground">{copy.heading}</h2>
                        <p className="text-sm text-muted-foreground">{copy.body}</p>
                    </div>

                    {/* Countdown */}
                    {(status === "success" || status === "processing") && (
                        <p className="text-xs text-muted-foreground">
                            Redirecting in {countdown}s…
                        </p>
                    )}

                    {/* Actions */}
                    {status === "verifying" && null}

                    {(status === "success" || status === "processing") && (
                        <Button asChild className="w-full">
                            <Link href={destinationRef.current}>Go to Auction now</Link>
                        </Button>
                    )}

                    {(status === "failed" || status === "cancelled") && (
                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                            <Button variant="outline" className="flex-1" onClick={() => router.back()}>
                                Try again
                            </Button>
                            <Button asChild className="flex-1">
                                <Link href={destinationRef.current}>Go to Auction</Link>
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PaymentReturn;
