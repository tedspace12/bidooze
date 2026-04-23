import type { Metadata } from "next";
import TermsConditions from "@/features/legal/TermsConditions";

export const metadata: Metadata = {
  title: "Terms & Conditions | Bidooze",
  description:
    "Platform-wide terms and conditions for Bidooze covering accounts, social login, auctions, bidding, payments, and platform use.",
};

export default function Page() {
  return <TermsConditions />;
}
