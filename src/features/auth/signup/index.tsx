'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Mail, Chrome, Apple, Facebook } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import AuthLayout from "@/components/layout/AuthLayout";

const SignupEmail = () => {
    const router = useRouter();
    const [email, setEmail] = useState("");

    const handleEmailContinue = () => {
        if (email) {
            router.push("/auth/verify-otp");
        }
    };

    const handleSocialLogin = (provider: string) => {
        console.log(`Sign up with ${provider}`);
    };

    return (
        <AuthLayout>
            <div className="text-center space-y-4">
                <Image src={'/logo/Bidooze.svg'} alt="Bidooze Logo" width={500} height={500} className="h-10 w-auto block mx-auto" />
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Join Bidooze</h1>
                    <p className="mt-2 text-muted-foreground">Start bidding on amazing items</p>
                </div>
            </div>

            <div className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="email">Email address</Label>
                    <Input
                        id="email"
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full"
                    />
                </div>

                <Button onClick={handleEmailContinue} className="w-full" size="lg">
                    <Mail className="mr-2 h-4 w-4" />
                    Continue with Email
                </Button>

                <div className="relative">
                    <Separator className="my-6" />
                    <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-2 text-sm text-muted-foreground">
                        or
                    </span>
                </div>

                <div className="space-y-3">
                    <Button
                        variant="outline"
                        onClick={() => handleSocialLogin("google")}
                        className="w-full"
                        size="lg"
                    >
                        <Chrome className="mr-2 h-4 w-4" />
                        Continue with Google
                    </Button>

                    <Button
                        variant="outline"
                        onClick={() => handleSocialLogin("apple")}
                        className="w-full"
                        size="lg"
                    >
                        <Apple className="mr-2 h-4 w-4" />
                        Continue with Apple
                    </Button>

                    <Button
                        variant="outline"
                        onClick={() => handleSocialLogin("facebook")}
                        className="w-full"
                        size="lg"
                    >
                        <Facebook className="mr-2 h-4 w-4" />
                        Continue with Facebook
                    </Button>
                </div>
            </div>

            <p className="text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <a href="/auth/login" className="text-primary hover:underline font-medium">
                    Log in
                </a>
            </p>
        </AuthLayout>
    );
};

export default SignupEmail;
