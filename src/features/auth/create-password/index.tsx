'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Check, Eye, EyeOff, X } from "lucide-react";
import { useRouter } from "@bprogress/next/app";
import Image from "next/image";
import AuthLayout from "@/components/layout/AuthLayout";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";

import { useForm, Controller, useWatch } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "../hooks/useAuth";
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "@/components/ui/input-group";
import { toast } from "sonner";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

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

const passwordSchema = z.object({
    password: z
        .string()
        .min(8, "Password must be at least 8 characters")
        .regex(/[a-zA-Z]/, "Must contain a letter")
        .regex(/[0-9!@#$%^&*(),.?\":{}|<>]/, "Must contain a number or symbol"),
    agreedToTerms: z
        .boolean()
        .refine((val) => val === true, {
            message: "You must agree to the terms"
        }),
});

type PasswordForm = z.infer<typeof passwordSchema>;

const CreatePassword = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const email = searchParams.get("email") ?? "";

    const [showPassword, setShowPassword] = useState(false);

    const form = useForm<PasswordForm>({
        resolver: zodResolver(passwordSchema),
        defaultValues: { password: "", agreedToTerms: false },
    });

    const { createPassword } = useAuth();

    const password = useWatch({ control: form.control, name: "password" });

    const hasMinLength = password?.length >= 8;
    const hasNumberOrSymbol = /[0-9!@#$%^&*(),.?":{}|<>]/.test(password || "");
    const hasLetter = /[a-zA-Z]/.test(password || "");

    const onSubmit = async (data: PasswordForm) => {
        try {
            await createPassword.mutateAsync({
                password: data.password,
                email,
            })
            router.push(`/auth/personal-information?email=${encodeURIComponent(email)}`);
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
                    <h1 className="text-[25px] sm:text-3xl font-bold text-foreground">Create a password</h1>
                    <p className="mt-1 sm:mt-2 text-muted-foreground text-sm md:text-base">Make sure it&apos;s secure</p>
                </div>
            </div>

            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FieldGroup>
                    {/* Password */}
                    <Controller
                        name="password"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor="create-password">Password</FieldLabel>
                                <InputGroup>
                                    <InputGroupInput
                                        {...field}
                                        id="create-password"
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

                    {/* Requirements */}
                    <div className="space-y-2 pt-1">
                        <p className="text-sm font-medium">Password must contain:</p>
                        <RequirementItem met={hasMinLength} text="At least 8 characters" />
                        <RequirementItem met={hasNumberOrSymbol} text="At least 1 number or symbol" />
                        <RequirementItem met={hasLetter} text="At least 1 letter" />
                    </div>

                    {/* Terms */}
                    <Controller
                        name="agreedToTerms"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <div className="flex items-start gap-3">
                                    <Checkbox
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                        id="terms"
                                    />
                                    <label
                                        htmlFor="terms"
                                        className="text-sm text-muted-foreground leading-relaxed"
                                    >
                                        I agree to the{" "}
                                        <Link href="#" className="text-primary hover:underline">
                                            Terms
                                        </Link>
                                        ,{" "}
                                        <Link href="#" className="text-primary hover:underline">
                                            Privacy Policy
                                        </Link>
                                        , and{" "}
                                        <Link href="#" className="text-primary hover:underline">
                                            Cookie Policy
                                        </Link>
                                    </label>
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
                            disabled={createPassword.isPending}
                        >
                            {createPassword.isPending ? "Creating account..." : "Create Account"}
                        </Button>
                    </Field>
                </FieldGroup>
            </form>
        </AuthLayout>
    );
};

export default CreatePassword;
