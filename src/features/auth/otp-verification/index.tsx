'use client';

import Image from "next/image";
import { useRouter } from "@bprogress/next/app";
import { useSearchParams } from "next/navigation";
import AuthLayout from "@/components/layout/AuthLayout";

import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Field, FieldError, FieldGroup } from "@/components/ui/field";

import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useAuth } from "../hooks/useAuth";
import { useEffect, useState } from "react";

const otpSchema = z.object({
    otp: z
        .string()
        .min(6, "Enter the 6-digit code")
        .max(6, "Code must be 6 digits"),
});

type OTPForm = z.infer<typeof otpSchema>;

const OTPVerification = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const email = searchParams.get("email") ?? "";

    const [secondsLeft, setSecondsLeft] = useState(30);

    const form = useForm<OTPForm>({
        resolver: zodResolver(otpSchema),
        defaultValues: { otp: "" },
    });

    useEffect(() => {
        if (secondsLeft <= 0) return;

        const timer = setInterval(() => {
            setSecondsLeft((s) => s - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [secondsLeft]);

    const { verifyOTP, resendOTP } = useAuth();

    const onSubmit = async (data: OTPForm) => {
        try {
            router.push(`/auth/create-password?email=${encodeURIComponent(email)}`)
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            toast.error(error?.response?.data?.message || error?.message);
        }
    };

    const handleResend = async () => {
        try {
            await resendOTP.mutateAsync({
                email
            });
            setSecondsLeft(30);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            toast.error(error?.response?.data?.message || error?.message);
        }
    };

    return (
        <AuthLayout>
            <div className="text-center space-y-3 sm:space-y-4">
                <Image src={'/logo/Bidooze.svg'} alt="Bidooze Logo" width={500} height={500} className="h-9 sm:h-10 w-auto block mx-auto" />
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Verify your email</h1>
                    <p className="mt-2 text-muted-foreground text-sm md:text-base">
                        We sent a code to <span className="font-medium">{email}</span>
                    </p>
                </div>
            </div>

            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FieldGroup>
                    <Controller
                        name="otp"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                {/* <FieldLabel className="text-center">Verification code</FieldLabel> */}

                                <div className="flex justify-center pt-2">
                                    <InputOTP
                                        maxLength={6}
                                        value={field.value}
                                        onChange={field.onChange}
                                    >
                                        <InputOTPGroup>
                                            {Array.from({ length: 6 }).map((_, i) => (
                                                <InputOTPSlot key={i} index={i} className="w-10 h-11" />
                                            ))}
                                        </InputOTPGroup>
                                    </InputOTP>
                                </div>

                                {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                )}
                            </Field>
                        )}
                    />

                    <Field>
                        <Button
                            type="submit"
                            className="w-full"
                            size="lg"
                            disabled={verifyOTP.isPending || resendOTP.isPending}
                        >
                            {verifyOTP.isPending ? "Verifying..." : "Verify Code"}
                        </Button>
                    </Field>
                </FieldGroup>

                {/* Resend */}
                <div className="text-center">
                    {secondsLeft > 0 ? (
                        <p className="text-sm text-muted-foreground">
                            Resend code in <span className="font-medium">{secondsLeft}s</span>
                        </p>
                    ) : (
                        <button
                            type="button"
                            onClick={handleResend}
                            disabled={resendOTP.isPending}
                            className="text-sm text-primary hover:underline font-medium"
                        >
                            {resendOTP.isPending ? 'Resending..' : 'Didn&apos;t receive a code? Resend'}
                        </button>
                    )}
                </div>
            </form>
        </AuthLayout>
    );
};

export default OTPVerification;
