import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import { usePlacesWidget } from "react-google-autocomplete";
import { z } from "zod";
import {
  Field,
  FieldLabel,
  FieldContent,
  FieldError,
  FieldGroup,
} from "@/components/ui/field";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { useAuth } from "../../hooks/useAuth";
import { toast } from "sonner";

const cardSchema = z.object({
  address: z.string().min(5, "Address is required"),

  cardHolder: z
    .string()
    .min(2, "Card holder name is required")
    .regex(/^[a-zA-Z\s]+$/, "Only letters allowed"),

  cardNumber: z
    .string()
    .min(16, "Card number must be 16 digits")
    .max(19)
    .regex(/^\d{4}\s?\d{4}\s?\d{4}\s?\d{4}$/, "Invalid card number"),

  expiration: z
    .string()
    .regex(/^(0[1-9]|1[0-2])\/\d{2}$/, "Invalid format (MM/YY)"),

  cvv: z
    .string()
    .regex(/^\d{3,4}$/, "CVV must be 3 or 4 digits"),
});

type CardFormValues = z.infer<typeof cardSchema>;

const PersonalDetails = ({ step, setStep, email }: { step: number; setStep: React.Dispatch<React.SetStateAction<number>>, email: string }) => {
  const [openSections, setOpenSections] = useState({
    personal: false,
    address: true,
    card: false,
  });

  const form = useForm<CardFormValues>({
    resolver: zodResolver(cardSchema),
    defaultValues: {
      address: "",
      cardHolder: "",
      cardNumber: "",
      expiration: "",
      cvv: "",
    },
    mode: 'onChange'
  });

  const { completeProfile } = useAuth();

  const onSubmit = async (data: CardFormValues) => {
    try {
      await completeProfile.mutateAsync({
        email,
        full_address: data.address,
        card_holder_name: data.cardHolder,
        card_number: data.cardNumber,
        cvv: data.cvv,
        expiry_date: data.expiration,
        shopping_preference: [],
      });
      setStep(step + 1);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error?.response?.data?.message || error?.message);
    }
  };

  // const { ref } = usePlacesWidget({
  //   apiKey: '',
  //   onPlaceSelected: (place) => console.log(place)
  // });

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h2 className="text-lg sm:text-xl font-semibold text-foreground">Be ready to bid. Let&apos;s get started.</h2>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
          Auctioneers use this info to approve bidders. Get set up now so you&apos;re ready to bid the moment it counts.
        </p>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

        {/* ADDRESS GROUP */}
        <fieldset className="space-y-3">
          <legend className="sr-only">Address</legend>

          <Collapsible
            open={openSections.address}
            onOpenChange={() => toggleSection("address")}
          >
            <CollapsibleTrigger className="flex items-center justify-between w-full p-3 sm:p-4 bg-secondary rounded-lg hover:bg-muted transition-colors">
              <span className="text-sm sm:text-base font-medium">Address</span>
              <ChevronDown
                className={`h-4 w-4 sm:h-5 sm:w-5 transition-transform ${openSections.address ? "rotate-180" : ""
                  }`}
              />
            </CollapsibleTrigger>

            <CollapsibleContent className="pt-3 sm:pt-4 space-y-3 sm:space-y-4 px-1">
              <Field>
                <FieldLabel htmlFor="addressSearch">Search Address</FieldLabel>
                <FieldContent>
                  <Input
                    id="addressSearch"
                    placeholder="Start typing your address..."
                    className="text-sm h-11 md:text-base"
                    {...form.register("address")}
                  />
                </FieldContent>
                <FieldError>{form.formState.errors.address?.message}</FieldError>
              </Field>

              <button
                type="button"
                className="text-xs sm:text-sm text-primary hover:underline"
              >
                + Add manually
              </button>
            </CollapsibleContent>
          </Collapsible>
        </fieldset>

        {/* CARD GROUP */}
        <fieldset className="space-y-3">
          <legend className="sr-only">Card Details</legend>

          <Collapsible
            open={openSections.card}
            onOpenChange={() => toggleSection("card")}
          >
            <CollapsibleTrigger className="flex items-center justify-between w-full p-3 sm:p-4 bg-secondary rounded-lg hover:bg-muted transition-colors">
              <span className="text-sm sm:text-base font-medium">
                Card Details
              </span>
              <ChevronDown
                className={`h-4 w-4 sm:h-5 sm:w-5 transition-transform ${openSections.card ? "rotate-180" : ""
                  }`}
              />
            </CollapsibleTrigger>

            <CollapsibleContent className="pt-3 sm:pt-4 space-y-3 sm:space-y-4 px-1">
              <FieldGroup>
                {/* Card Holder Name */}
                <Field>
                  <FieldLabel>Card Holder Name</FieldLabel>
                  <FieldContent>
                    <Input
                      placeholder="John Doe"
                      className="text-sm h-11 md:text-base"
                      {...form.register("cardHolder")}
                    />
                  </FieldContent>
                  <FieldError>{form.formState.errors.cardHolder?.message}</FieldError>
                </Field>

                {/* Card Number */}
                <Field>
                  <FieldLabel>Card Number</FieldLabel>
                  <FieldContent>
                    <Input
                      placeholder="1234 5678 9012 3456"
                      inputMode="numeric"
                      className="text-sm h-11 md:text-base"
                      {...form.register("cardNumber")}
                    />
                  </FieldContent>
                  <FieldError>{form.formState.errors.cardNumber?.message}</FieldError>
                </Field>

                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  {/* Expiration */}
                  <Field>
                    <FieldLabel>Expiration</FieldLabel>
                    <FieldContent>
                      <Input
                        placeholder="MM/YY"
                        className="text-sm h-11 md:text-base"
                        {...form.register("expiration")}
                      />
                    </FieldContent>
                    <FieldError>{form.formState.errors.expiration?.message}</FieldError>
                  </Field>

                  {/* CVV */}
                  <Field>
                    <FieldLabel>CVV</FieldLabel>
                    <FieldContent>
                      <Input
                        placeholder="123"
                        inputMode="numeric"
                        className="text-sm h-11 md:text-base"
                      />
                    </FieldContent>
                    <FieldError>{form.formState.errors.cvv?.message}</FieldError>
                  </Field>
                </div>
              </FieldGroup>
            </CollapsibleContent>
          </Collapsible>
        </fieldset>

        <Field>
          <div className="flex justify-between pt-4 sm:pt-6 gap-3">
            <Button type="button" variant="outline" onClick={() => setStep(step + 1)} className="flex-1 sm:flex-none">
              Skip
            </Button>
            <Button type="submit" className="flex-1 sm:flex-none">
              {completeProfile.isPending ? 'Saving..' : 'Next'}
            </Button>
          </div>
        </Field>
      </form>
    </div>
  );
};

export default PersonalDetails;
