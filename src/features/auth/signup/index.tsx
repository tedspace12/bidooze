'use client';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "@bprogress/next/app";
import Image from "next/image";
import AuthLayout from "@/components/layout/AuthLayout";

import { z } from 'zod';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from "sonner";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { AppleIcon, ColoredGoogleIcon, FacebookIcon, MailIcon } from "@/components/shared/icons";
import { useAuth } from "../hooks/useAuth";
import Link from "next/link";

const signupSchema = z.object({
    email: z
        .email("Enter a valid email"),
});

type SignupSchema = z.infer<typeof signupSchema>;

const SignupEmail = () => {
    const router = useRouter();

    const form = useForm<SignupSchema>({
        resolver: zodResolver(signupSchema),
        defaultValues: { email: "" },
        mode: 'onChange',
    });

    const { registerEmail } = useAuth();

    async function onSubmit(data: SignupSchema) {
        try {
            await registerEmail.mutateAsync({
                email: data.email
            });
            router.push(`/auth/verify-otp?email=${encodeURIComponent(data.email)}`)
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            toast.error(error?.response?.data?.message || error?.message);
        }
    }

    const handleSocialLogin = (provider: string) => {
        console.log(`Sign up with ${provider}`);
    };

    return (
        <AuthLayout>
            <div className="text-center space-y-3 sm:space-y-4">
                <Image src={'/logo/Bidooze.svg'} alt="Bidooze Logo" width={500} height={500} className="h-9 sm:h-10 w-auto block mx-auto" />
                <div>
                    <h1 className="text-[25px] sm:text-3xl font-bold text-foreground">Join Bidooze</h1>
                    <p className="mt-2 text-muted-foreground text-sm md:text-base">Start bidding on amazing items</p>
                </div>
            </div>

            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3 sm:space-y-4">
                <FieldGroup>
                    <Controller
                        name="email"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor="register-email">
                                    Email address
                                </FieldLabel>
                                <Input
                                    {...field}
                                    id="register-email"
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

                    <Field>
                        <Button type="submit" className="w-full" size="lg" disabled={registerEmail.isPending}>
                            <MailIcon className="mr-2 h-4 w-4" />
                            {registerEmail.isPending ? 'Registering..' : 'Continue with Email'}
                        </Button>

                    </Field>
                </FieldGroup>

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
                        className="w-full [&_svg:not([class*='size-'])]:size-4"
                        size="lg"
                    >
                        <ColoredGoogleIcon className="mr-2" />
                        Continue with Google
                    </Button>

                    <Button
                        variant="outline"
                        onClick={() => handleSocialLogin("apple")}
                        className="w-full [&_svg:not([class*='size-'])]:size-6"
                        size="lg"
                    >
                        <AppleIcon className="mr-2" />
                        Continue with Apple
                    </Button>

                    <Button
                        variant="outline"
                        onClick={() => handleSocialLogin("facebook")}
                        className="w-full [&_svg:not([class*='size-'])]:size-5"
                        size="lg"
                    >
                        <FacebookIcon className="mr-2 h-4 w-4" />
                        Continue with Facebook
                    </Button>
                </div>
            </form>

            <p className="text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link href="/auth/login" className="text-primary hover:underline font-medium">
                    Log in
                </Link>
            </p>
        </AuthLayout>
    );
};

export default SignupEmail;
