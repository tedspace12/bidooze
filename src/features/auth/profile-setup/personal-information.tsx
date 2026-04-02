'use client';

import Image from "next/image";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import AuthLayout from "@/components/layout/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import 'react-phone-number-input/style.css';
import { Country, isValidPhoneNumber, parsePhoneNumber } from 'react-phone-number-input';
import { PhoneInput } from "./components/PhoneInput";
import { useAuth } from "../hooks/useAuth";
import { toast } from "sonner";

const personalSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  phone: z
    .string()
    .refine(isValidPhoneNumber, { message: "Invalid phone number" }),
});

type PersonalForm = z.infer<typeof personalSchema>;

const PersonalInformation = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") ?? "";
  const [selectedCountry, setSelectedCountry] = useState<Country>("NG");

  const form = useForm<PersonalForm>({
    resolver: zodResolver(personalSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      phone: "",
    },
    mode: 'onChange',
  });

  const { setPersonalInfo } = useAuth();

  const onSubmit = async (data: PersonalForm) => {
    try {
      const phone = parsePhoneNumber(data.phone);
      const countryCode = phone?.country || selectedCountry || "";

      await setPersonalInfo.mutateAsync({
        email: email,
        first_name: data.firstName,
        last_name: data.lastName,
        phone_number: data.phone,
        country_code: countryCode,
      })
      router.push(`/auth/profile-setup?email=${encodeURIComponent(email)}`);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error?.response?.data?.message || error?.message);
    }
  };

  return (
    <AuthLayout maxWidth="md">
      <div className="text-center space-y-4">
        <Image
          src="/logo/Bidooze.svg"
          alt="Bidooze Logo"
          width={500}
          height={500}
          className="h-10 w-auto mx-auto"
        />
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
          Create Your Personal Information
        </h1>
        <p className="text-sm text-muted-foreground">
          Be ready to bid! Auctioneers use this info to approve bidders. Get set up now so you&apos;re ready to bid immediately.
        </p>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="mt-6 space-y-4">
        <FieldGroup className="gap-5">
          {/* First Name */}
          <Controller
            name="firstName"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className="gap-1">
                <FieldLabel htmlFor="firstName" className="text-base font-medium gap-0">First Name<span className="text-red-400">*</span></FieldLabel>
                <Input {...field} id="firstName" placeholder="John" className="h-11 md:text-base" />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          {/* Last Name */}
          <Controller
            name="lastName"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className="gap-1">
                <FieldLabel htmlFor="lastName" className="text-base font-medium gap-0">Last Name<span className="text-red-400">*</span></FieldLabel>
                <Input
                  {...field}
                  id="lastName"
                  placeholder="Doe"
                  className="h-11 md:text-base"
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          {/* Phone Number */}
          <Controller
            name="phone"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className="gap-1">
                <FieldLabel htmlFor="signup-tel" className="text-base font-medium gap-0">
                  Phone number<span className="text-red-400">*</span>
                </FieldLabel>
                <PhoneInput
                  value={field.value}
                  onChange={field.onChange}
                  onCountryChange={(country) => {
                    if (country) setSelectedCountry(country);
                  }}
                  country={selectedCountry}
                  defaultCountry="NG"
                  international={true}
                  placeholder="2348161634036"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          {/* <div className="flex items-center gap-4">
            <Controller
              name="countryCode"
              control={form.control}
              render={({ field }) => (
                <Select {...field}>
                  <SelectTrigger className="w-fit text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="+1">+1</SelectItem>
                    <SelectItem value="+44">+44</SelectItem>
                    <SelectItem value="+61">+61</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />

            <Controller
              name="phone"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="phone">Phone Number</FieldLabel>
                  <Input {...field} id="phone" placeholder="(555) 123-4567" />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </div> */}

          <Field>
            <Button type="submit" disabled={setPersonalInfo.isPending} className="w-full" size="lg">
              {setPersonalInfo.isPending ? 'Saving..' : 'Save'}
            </Button>
          </Field>
        </FieldGroup>
      </form>
    </AuthLayout>
  );
};

export default PersonalInformation;