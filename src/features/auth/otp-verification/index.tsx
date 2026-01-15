'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { useRouter } from "next/navigation";
import Image from "next/image";
import AuthLayout from "@/components/layout/AuthLayout";

const OTPVerification = () => {
    const router = useRouter();
    const email = "ogunolaololade@gmail.com";
    const [otp, setOtp] = useState("");

    const handleVerify = () => {
        if (otp.length === 6) {
            router.push("/auth/create-password");
        }
    };

    const handleResend = () => {
        console.log("Resending OTP...");
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

            <div className="space-y-6">
                <div className="flex justify-center">
                    <InputOTP maxLength={6} value={otp} onChange={setOtp}>
                        <InputOTPGroup>
                            <InputOTPSlot index={0} className="w-10 h-10" />
                            <InputOTPSlot index={1} className="w-10 h-10" />
                            <InputOTPSlot index={2} className="w-10 h-10" />
                            <InputOTPSlot index={3} className="w-10 h-10" />
                            <InputOTPSlot index={4} className="w-10 h-10" />
                            <InputOTPSlot index={5} className="w-10 h-10" />
                        </InputOTPGroup>
                    </InputOTP>
                </div>

                <Button onClick={handleVerify} className="w-full" size="lg" disabled={otp.length !== 6}>
                    Verify Code
                </Button>

                <div className="text-center">
                    <button
                        onClick={handleResend}
                        className="text-sm text-primary hover:underline font-medium"
                    >
                        Didn&apos;t receive a code? Resend
                    </button>
                </div>
            </div>
        </AuthLayout>
    );
};

export default OTPVerification;
