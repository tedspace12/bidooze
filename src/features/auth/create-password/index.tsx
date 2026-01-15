'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Check, X } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import AuthLayout from "@/components/layout/AuthLayout";


const RequirementItem = ({ met, text }: { met: boolean; text: string }) => (
    <div className="flex items-center gap-2">
        {met ? (
            <Check className="h-4 w-4 text-primary" />
        ) : (
            <X className="h-4 w-4 text-muted-foreground" />
        )}
        <span className={met ? "text-foreground" : "text-muted-foreground"}>{text}</span>
    </div>
);

const CreatePassword = () => {
    const router = useRouter();
    // const email = "ogunolaololade@gmail.com";
    const [password, setPassword] = useState("");
    const [agreedToTerms, setAgreedToTerms] = useState(false);

    const hasMinLength = password.length >= 8;
    const hasNumberOrSymbol = /[0-9!@#$%^&*(),.?":{}|<>]/.test(password);
    const hasLetter = /[a-zA-Z]/.test(password);

    const allRequirementsMet = hasMinLength && hasNumberOrSymbol && hasLetter;

    const handleContinue = () => {
        if (allRequirementsMet && agreedToTerms) {
            router.push("/auth/profile-setup");
        }
    };

    return (
        <AuthLayout>
            <div className="text-center space-y-3 sm:space-y-4">
                <Image src={'/logo/Bidooze.svg'} alt="Bidooze Logo" width={500} height={500} className="h-9 sm:h-10 w-auto block mx-auto" />
                <div>
                    <h1 className="text-[25px] sm:text-3xl font-bold text-foreground">Create a password</h1>
                    <p className="mt-1 sm:mt-2 text-muted-foreground text-sm md:text-base">Make sure it&apos;s secure</p>
                </div>
            </div>

            <div className="space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                        id="password"
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full text-sm md:text-base"
                    />
                </div>

                <div className="space-y-2 text-sm">
                    <p className="font-medium">Password must contain:</p>
                    <RequirementItem met={hasMinLength} text="At least 8 characters" />
                    <RequirementItem met={hasNumberOrSymbol} text="At least 1 number or symbol" />
                    <RequirementItem met={hasLetter} text="At least 1 letter" />
                </div>

                <div className="flex items-start space-x-3">
                    <Checkbox
                        id="terms"
                        checked={agreedToTerms}
                        onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
                    />
                    <label htmlFor="terms" className="text-sm text-muted-foreground leading-relaxed">
                        I agree to the{" "}
                        <a href="#" className="text-primary hover:underline">
                            Terms
                        </a>
                        ,{" "}
                        <a href="#" className="text-primary hover:underline">
                            Privacy Policy
                        </a>
                        , and{" "}
                        <a href="#" className="text-primary hover:underline">
                            Cookie Policy
                        </a>
                    </label>
                </div>

                <Button
                    onClick={handleContinue}
                    className="w-full"
                    size="lg"
                    disabled={!allRequirementsMet || !agreedToTerms}
                >
                    Continue
                </Button>
            </div>
        </AuthLayout>
    );
};

export default CreatePassword;
