'use client';

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type ReturnStatus = "verifying" | "success" | "failed" | "unknown";

export default function PaymentsReturnPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [status, setStatus] = useState<ReturnStatus>("verifying");
    const [message, setMessage] = useState("Verifying your payment...");

    useEffect(() => {
        const verify = async () => {
            const provider = sessionStorage.getItem("deposit_provider");
            const returnSource = sessionStorage.getItem("deposit_return_source") || "auction";
            const returnId = sessionStorage.getItem("deposit_return_id") || "";

            const destination =
                returnSource === "lot"
                    ? `/lot/${returnId}`
                    : `/auction/${returnId}`;

            if (provider === "stripe") {
                const redirectStatus = searchParams.get("redirect_status");
                const paymentIntent = searchParams.get("payment_intent");

                if (redirectStatus === "succeeded") {
                    setStatus("success");
                    setMessage("Payment confirmed! Your registration is active.");
                    clearSession();
                    setTimeout(() => router.push(destination), 2500);
                    return;
                }

                if (redirectStatus === "requires_action") {
                    setStatus("failed");
                    setMessage("Additional authentication required. Please try again.");
                    return;
                }

                if (redirectStatus === "processing") {
                    setStatus("success"); // treat as ok, backend will confirm
                    setMessage("Payment is processing. Your registration is pending.");
                    clearSession();
                    setTimeout(() => router.push(destination), 2500);
                    return;
                }

                setStatus("failed");
                setMessage("Payment was not completed. Please try again.");
                return;
            }

            if (provider === "paystack") {
                const reference =
                    searchParams.get("reference") ||
                    searchParams.get("trxref");

                if (reference) {
                    // You can call your own backend here to verify:
                    // await verifyPaystackDeposit(reference);
                    // For now treat presence of reference as success
                    setStatus("success");
                    setMessage("Payment confirmed! Your registration is active.");
                    clearSession();
                    setTimeout(() => router.push(destination), 2500);
                    return;
                }

                setStatus("failed");
                setMessage("Payment reference missing. Please contact support.");
                return;
            }

            setStatus("unknown");
            setMessage("We couldn't determine your payment status.");
        };

        verify();
    }, []);

    const clearSession = () => {
        sessionStorage.removeItem("deposit_provider");
        sessionStorage.removeItem("deposit_return_source");
        sessionStorage.removeItem("deposit_return_id");
        sessionStorage.removeItem("stripe_client_secret");
        sessionStorage.removeItem("stripe_publishable_key");
    };

    const returnSource = sessionStorage.getItem("deposit_return_source") || "auction";
    const returnId = sessionStorage.getItem("deposit_return_id") || "";
    const destination =
        returnSource === "lot" ? `/lot/${returnId}` : `/auction/${returnId}`;

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="max-w-md w-full text-center space-y-5">
                {status === "verifying" && (
                    <>
                        <Loader2 className="h-10 w-10 animate-spin mx-auto text-primary" />
                        <p className="text-sm text-muted-foreground">{message}</p>
                    </>
                )}

                {status === "success" && (
                    <>
                        <div className="w-14 h-14 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto">
                            <CheckCircle2 className="h-7 w-7 text-emerald-500" />
                        </div>
                        <h2 className="text-xl font-semibold">You're registered!</h2>
                        <p className="text-sm text-muted-foreground">{message}</p>
                        <p className="text-xs text-muted-foreground">Redirecting you now...</p>
                    </>
                )}

                {(status === "failed" || status === "unknown") && (
                    <>
                        <div className="w-14 h-14 rounded-full bg-destructive/10 flex items-center justify-center mx-auto">
                            <XCircle className="h-7 w-7 text-destructive" />
                        </div>
                        <h2 className="text-xl font-semibold">Payment Incomplete</h2>
                        <p className="text-sm text-muted-foreground">{message}</p>
                        <div className="flex gap-3 justify-center pt-2">
                            <Button variant="outline" onClick={() => router.back()}>
                                Try Again
                            </Button>
                            <Button onClick={() => router.push(destination)}>
                                Go to Auction
                            </Button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}