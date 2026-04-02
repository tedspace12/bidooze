'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { loadStripe } from "@stripe/stripe-js";
import { Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function StripeConfirmPage() {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);
    const [status, setStatus] = useState<"loading" | "error">("loading");

    useEffect(() => {
        const confirm = async () => {
            const clientSecret = sessionStorage.getItem("stripe_client_secret");
            const publishableKey = sessionStorage.getItem("stripe_publishable_key");
            const returnSource = sessionStorage.getItem("deposit_return_source");
            const returnId = sessionStorage.getItem("deposit_return_id");

            if (!clientSecret || !publishableKey) {
                setError("Missing payment details. Please try registering again.");
                setStatus("error");
                return;
            }

            const stripe = await loadStripe(publishableKey);
            if (!stripe) {
                setError("Failed to load Stripe. Please try again.");
                setStatus("error");
                return;
            }

            const returnUrl =
                `${window.location.origin}/payments/return` +
                `?source=${returnSource}&id=${returnId}`;

            const { error: stripeError } = await stripe.confirmPayment({
                clientSecret,
                confirmParams: {
                    return_url: returnUrl,
                },
            });

            // If we get here, confirmation failed (success auto-redirects)
            if (stripeError) {
                setError(stripeError.message ?? "Payment confirmation failed.");
                setStatus("error");
            }
        };

        confirm();
    }, []);

    if (status === "error") {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <div className="max-w-md w-full text-center space-y-4">
                    <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center mx-auto">
                        <AlertCircle className="h-6 w-6 text-destructive" />
                    </div>
                    <h2 className="text-xl font-semibold">Payment Failed</h2>
                    <p className="text-sm text-muted-foreground">{error}</p>
                    <Button variant="outline" onClick={() => router.back()}>
                        Go Back
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="text-center space-y-4">
                <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
                <p className="text-sm text-muted-foreground">
                    Confirming your payment with Stripe...
                </p>
            </div>
        </div>
    );
}