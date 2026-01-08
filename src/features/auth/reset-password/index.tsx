'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import Link from "next/link";
import Image from "next/image";
import AuthLayout from "@/components/layout/AuthLayout";

const ResetPassword = () => {
    const [email, setEmail] = useState("");
    const [showSuccessDialog, setShowSuccessDialog] = useState(false);

    const handleSubmit = () => {
        if (email) {
            setShowSuccessDialog(true);
        }
    };

    return (
        <AuthLayout>
            <div className="text-center space-y-4">
                <Image src={'/logo/Bidooze.svg'} alt="Bidooze Logo" width={500} height={500} className="h-10 w-auto block mx-auto" />
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Reset password</h1>
                    <p className="mt-2 text-muted-foreground">
                        Enter your email and we&apos;ll send you a reset link
                    </p>
                </div>
            </div>

            <div className="space-y-6">
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

                <Button onClick={handleSubmit} className="w-full" size="lg">
                    Send Reset Link
                </Button>

                <p className="text-center text-sm text-muted-foreground">
                    Remember your password?{" "}
                    <Link href="/auth/login" className="text-primary hover:underline font-medium">
                        Log in
                    </Link>
                </p>
            </div>

            <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Check your email</DialogTitle>
                        <DialogDescription>
                            A link has been sent to the email associated with your account.
                        </DialogDescription>
                    </DialogHeader>
                    <Button onClick={() => setShowSuccessDialog(false)}>OK</Button>
                </DialogContent>
            </Dialog>
        </AuthLayout>
    );
};

export default ResetPassword;
