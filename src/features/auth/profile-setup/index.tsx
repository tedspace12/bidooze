'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useRouter } from "next/navigation";
import AuthLayout from "@/components/layout/AuthLayout";
import CategorySelection from "./components/CategorySelection";
import PersonalDetails from "./components/PersonalDetails";
import Image from "next/image";

const ProfileSetup = () => {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const totalSteps = 2;
    const progress = (step / totalSteps) * 100;

    const handleNext = () => {
        if (step < totalSteps) {
            setStep(step + 1);
        } else {
            router.push("/");
        }
    };

    const handleSkip = () => {
        if (step < totalSteps) {
            setStep(step + 1);
        } else {
            router.push("/");
        }
    };

    return (
        <AuthLayout maxWidth="xl">

            <div className="flex justify-center mb-4">
                <Image src={'/logo/Bidooze.svg'} alt="Bidooze Logo" width={500} height={500} className="h-10 w-auto block mx-auto" />
            </div>

            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-foreground">Complete Your Profile</h1>
                    <span className="text-sm text-muted-foreground">
                        Step {step} of {totalSteps}
                    </span>
                </div>
                <Progress value={progress} className="h-2" />
            </div>

            {step === 1 && <CategorySelection />}
            {step === 2 && <PersonalDetails />}

            <div className="flex justify-between pt-6">
                <Button variant="outline" onClick={handleSkip}>
                    Skip
                </Button>
                <Button onClick={handleNext}>
                    {step < totalSteps ? "Next" : "Finish"}
                </Button>
            </div>
        </AuthLayout>
    );
};

export default ProfileSetup;
