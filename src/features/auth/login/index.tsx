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
import Cookies from 'js-cookie';
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useUser } from "@/features/auth/context/UserContext";

const loginSchema = z.object({
    email: z
        .email("Enter a valid email"),
    password: z.string('Enter your password')
});

type LoginSchema = z.infer<typeof loginSchema>;

const Login = () => {
    const router = useRouter();
    const [showPasswordField, setShowPasswordField] = useState(false);
    const [showPasswordText, setShowPasswordText] = useState(false);

    const { login } = useAuth();
    const { setUser } = useUser();
    const isLoading = login.status === 'pending';

    const form = useForm<LoginSchema>({
        resolver: zodResolver(loginSchema),
        defaultValues: { email: "", password: "" },
        mode: 'onChange',
    });

    const email = form.watch('email');
    const password = form.watch('password');

    const handleEmailContinue = () => {
        if (email && !showPasswordField) {
            setShowPasswordField(true);
        } else if (email && password) {
            onSubmit(form.getValues());
        } else {
            toast.error("Please enter your email and password.");
        }
    };


    const onSubmit = async (data: LoginSchema) => {
        if (!data.email || !data.password) {
            toast.error("Please enter your email and password.");
            return;
        }

        try {
            const response = await login.mutateAsync({
                email: data.email,
                password: data.password,
            });

            if (response?.token && response?.user) {
                Cookies.set("bidooze_token", response.token, { expires: 7 });
                setUser(response.user);
                toast.success("Logged in successfully");
                router.push("/");
            } else {
                toast.error("Login failed: Invalid response from server");
            }
        } catch (error: any) {
            const errorMessage = error?.message || "Login failed. Please try again.";
            toast.error(errorMessage);
        }
    };

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

            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3 sm:space-y-4">
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

                    {showPasswordField && (
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
                                            type={showPasswordText ? "text" : "password"}
                                            aria-invalid={fieldState.invalid}
                                            placeholder="Enter your password"
                                        />
                                        <InputGroupAddon align="inline-end">
                                            <InputGroupButton
                                                aria-label={showPasswordText ? "Hide password" : "Show password"}
                                                type="button"
                                                title={showPasswordText ? "Hide password" : "Show password"}
                                                size="icon-xs"
                                                onClick={() => setShowPasswordText((prev: boolean) => !prev)}
                                            >
                                                {showPasswordText ? <EyeOff size={18} /> : <Eye size={18} />}
                                            </InputGroupButton>
                                        </InputGroupAddon>
                                    </InputGroup>
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />
                    )}
                </FieldGroup>
            </form>

            <div className="space-y-3 sm:not-[]:space-y-4">
                <Button 
                    onClick={handleEmailContinue} 
                    className="w-full" 
                    size="lg" 
                    type="button"
                    disabled={isLoading}
                >
                    <Mail className="mr-2 h-4 w-4" />
                    {isLoading ? "Logging in..." : (showPasswordField ? "Log In" : "Continue with Email")}
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
