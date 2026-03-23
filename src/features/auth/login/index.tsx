'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Mail, Chrome, Apple, Facebook, EyeOff, Eye } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import AuthLayout from "@/components/layout/AuthLayout";
import Link from "next/link";

import { z } from 'zod';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from "sonner";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { AppleIcon, ColoredGoogleIcon, FacebookIcon, MailIcon } from "@/components/shared/icons";
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "@/components/ui/input-group";

const loginSchema = z.object({
    email: z
        .email("Enter a valid email"),
    password: z.string('Enter your password')
});

type LoginSchema = z.infer<typeof loginSchema>;

const Login = () => {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);

    const form = useForm<LoginSchema>({
        resolver: zodResolver(loginSchema),
        defaultValues: { email: "", password: "" },
        mode: 'onChange',
    });

    const handleEmailContinue = () => {
        if (email && !showPassword) {
            setShowPassword(true);
        } else if (email && password) {
            router.push("/");
        }
    };

    async function onSubmit(data) {

    }

    const handleSocialLogin = (provider: string) => {
        console.log(`Login with ${provider}`);
        router.push("/");
    };

    return (
        <AuthLayout>
            <div className="text-center space-y-3 sm:space-y-4">
                <Image src={'/logo/Bidooze.svg'} alt="Bidooze Logo" width={500} height={500} className="h-9 sm:h-10 w-auto block mx-auto" />
                <div>
                    <h1 className="text-[25px] sm:text-3xl font-bold text-foreground">Welcome back</h1>
                    <p className="mt-2 text-muted-foreground text-sm md:text-base">Log in to continue bidding</p>
                </div>
            </div>

            <form className="space-y-3 sm:space-y-4">
                <FieldGroup>
                    {/* Email */}
                    <Controller
                        name="email"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor="login-email">
                                    Email address
                                </FieldLabel>
                                <Input
                                    {...field}
                                    id="login-email"
                                    aria-invalid={fieldState.invalid}
                                    placeholder="you@example.com"
                                    className="w-full h-11 text-sm md:text-base"
                                />
                                {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                )}
                            </Field>
                        )}
                    />

                    {/* Password */}
                    <Controller
                        name="password"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor="login-password">Password</FieldLabel>
                                <InputGroup>
                                    <InputGroupInput
                                        {...field}
                                        id="login-password"
                                        type={showPassword ? "text" : "password"}
                                        aria-invalid={fieldState.invalid}
                                        placeholder="Enter your password"
                                    />
                                    <InputGroupAddon align="inline-end">
                                        <InputGroupButton
                                            aria-label={showPassword ? "Hide password" : "Show password"}
                                            type="button"
                                            title={showPassword ? "Hide password" : "Show password"}
                                            size="icon-xs"
                                            onClick={() => setShowPassword((prev) => !prev)}
                                        >
                                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </InputGroupButton>
                                    </InputGroupAddon>
                                </InputGroup>
                                {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                )}
                            </Field>
                        )}
                    />
                </FieldGroup>
            </form>

            <div className="space-y-3 sm:not-[]:space-y-4">

                {showPassword && (
                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <Label htmlFor="password">Password</Label>
                            <Link
                                href="/auth/reset-password"
                                className="text-xs sm:text-sm text-primary hover:underline"
                            >
                                Forgot password?
                            </Link>
                        </div>
                        <Input
                            id="password"
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full text-sm sm:text-base"
                        />
                    </div>
                )}

                <Button onClick={handleEmailContinue} className="w-full" size="lg">
                    <Mail className="mr-2 h-4 w-4" />
                    {showPassword ? "Log In" : "Continue with Email"}
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
                Don&apos;t have an account?{" "}
                <Link href="/auth/signup" className="text-primary hover:underline font-medium">
                    Sign up
                </Link>
            </p>
        </AuthLayout>
    );
};

export default Login;
