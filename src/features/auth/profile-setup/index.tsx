'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useRouter, useSearchParams } from "next/navigation";
import AuthLayout from "@/components/layout/AuthLayout";
import CategorySelection from "./components/CategorySelection";
import PersonalDetails from "./components/PersonalDetails";
import Image from "next/image";

const ProfileSetup = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const email = searchParams.get("email") ?? "";

    const [step, setStep] = useState(1);
    const totalSteps = 2;
    const progress = (step / totalSteps) * 100;

    return (
        <AuthLayout maxWidth="xl">

            <div className="flex justify-center mb-3 sm:mb-4">
                <Image src={'/logo/Bidooze.svg'} alt="Bidooze Logo" width={500} height={500} className="h-9 sm:h-10 w-auto block mx-auto" />
            </div>

            <div className="space-y-3 sm:space-y-4">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-0">
                    <h1 className="text-xl sm:text-2xl font-bold text-foreground">Complete Your Profile</h1>
                    <span className="text-xs sm:text-sm text-muted-foreground">
                        Step {step} of {totalSteps}
                    </span>
                </div>
                <Progress value={progress} className="h-2" />
            </div>

            {step === 1 && <PersonalDetails step={step} setStep={setStep} email={email} />}
            {step === 2 && <CategorySelection />}
        </AuthLayout>
    );
};

export default ProfileSetup;
