import type { Metadata } from "next";
import PrivacyPolicy from "@/features/legal/PrivacyPolicy";

export const metadata: Metadata = {
  title: "Privacy Policy | Bidooze",
  description:
    "Platform-wide privacy policy for Bidooze covering email/password accounts, Google sign-in, Facebook Login, bidding, payments, and support.",
};

export default function Page() {
  return <PrivacyPolicy />;
}
