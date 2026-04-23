import Link from "next/link";
import LegalPageShell from "./LegalPageShell";

const effectiveDate = "April 23, 2026";

const rules = [
  "You must provide accurate registration and account information and keep it up to date.",
  "You are responsible for activity that occurs under your account, including activity completed through email/password, Google sign-in, or Facebook Login.",
  "You must keep your login credentials and connected provider access secure and notify Bidooze if you believe your account has been compromised.",
  "You may not use the platform for fraud, bid manipulation, scraping, abuse, unlawful conduct, or interference with auctions, users, or platform operations.",
];

const auctionTerms = [
  "Listings, lot descriptions, images, schedules, reserves, buyer premiums, shipping terms, taxes, and other auction details may be provided by auctioneers or sellers and may change.",
  "Auction-specific terms, registration requirements, deposits, payment deadlines, pickup windows, and bidder eligibility rules may apply in addition to these platform terms.",
  "If an auction has its own terms and conditions, you must review and accept them before bidding or registering where required.",
];

const limitations = [
  "Bidooze provides the platform on an as-is and as-available basis to the extent permitted by applicable law.",
  "We do not guarantee uninterrupted availability, error-free operation, or that any listing, bidder, seller, or auctioneer information is complete, current, or accurate.",
  "To the extent permitted by law, Bidooze is not liable for indirect, incidental, special, consequential, or punitive damages arising from use of the platform.",
];

export default function TermsConditions() {
  return (
    <LegalPageShell
      title="Terms & Conditions"
      summary="These terms govern use of the Bidooze platform, including browsing, account creation, email/password login, Google sign-in, Facebook Login, auction registration, bidding, payment-related features, and support interactions."
      effectiveDate={effectiveDate}
      facts={[
        {
          label: "Applies To",
          value:
            "All visitors, registered users, bidders, buyers, auctioneers, and anyone accessing Bidooze services or public pages.",
        },
        {
          label: "Related Pages",
          value: (
            <>
              <Link href="/privacy-policy" className="font-medium text-primary hover:underline">
                Privacy Policy
              </Link>
              {" | "}
              <Link href="/data-deletion" className="font-medium text-primary hover:underline">
                Data Deletion Instructions
              </Link>
            </>
          ),
        },
        {
          label: "Important Note",
          value:
            "Auction-specific rules from an auctioneer or seller may apply in addition to these platform terms.",
        },
      ]}
    >
      <section className="space-y-3">
        <h2 className="text-2xl font-semibold text-foreground">1. Acceptance of terms</h2>
        <p className="leading-7 text-muted-foreground">
          By accessing or using Bidooze, you agree to these Terms &amp; Conditions. If you do not
          agree, do not use the platform.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-semibold text-foreground">2. Eligibility and accounts</h2>
        <p className="leading-7 text-muted-foreground">
          You may need to create an account to access certain features such as bidding,
          registrations, watchlists, account settings, saved payment methods, or buyer profile
          management. You agree to use accurate information and to keep your account secure.
        </p>
        <ul className="space-y-3 text-muted-foreground">
          {rules.map((item) => (
            <li key={item} className="rounded-2xl bg-muted/50 px-4 py-3 leading-7">
              {item}
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-semibold text-foreground">3. Social and standard authentication</h2>
        <p className="leading-7 text-muted-foreground">
          Bidooze may allow sign-in through standard email/password authentication as well as
          Google and Facebook Login. Social login is offered for convenience and remains subject to
          these terms and to the policies of the relevant provider. You are responsible for keeping
          any connected provider account under your control.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-semibold text-foreground">4. Auctions, lots, and bidding</h2>
        <p className="leading-7 text-muted-foreground">
          Bidooze operates as a platform for discovering auctions and participating in bidding.
          Auction outcomes may depend on reserve prices, auctioneer approval, payment completion,
          pickup requirements, fraud checks, and other auction-specific conditions.
        </p>
        <ul className="space-y-3 text-muted-foreground">
          {auctionTerms.map((item) => (
            <li key={item} className="rounded-2xl bg-muted/50 px-4 py-3 leading-7">
              {item}
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-semibold text-foreground">5. Payments, fees, and billing data</h2>
        <p className="leading-7 text-muted-foreground">
          If you use payment-related features, you agree that saved payment methods, billing
          addresses, deposits, buyer premiums, taxes, shipping charges, and other transaction costs
          may apply depending on the auction and applicable law. You authorize Bidooze and its
          service providers to process payment-related instructions needed to operate the platform.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-semibold text-foreground">6. Prohibited conduct</h2>
        <p className="leading-7 text-muted-foreground">
          You may not misuse the platform. This includes fraudulent bidding, creating false
          accounts, attempting to bypass security, interfering with platform availability, copying
          or scraping content at scale without authorization, or using Bidooze in violation of law.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-semibold text-foreground">7. Content and intellectual property</h2>
        <p className="leading-7 text-muted-foreground">
          Bidooze and its licensors retain rights in the platform, site design, software, branding,
          and other protected materials, except for content owned by auctioneers, sellers, or other
          third parties. You may use the platform only for its intended lawful purposes and may not
          reproduce or exploit protected content except as allowed by law or written permission.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-semibold text-foreground">8. Suspension and termination</h2>
        <p className="leading-7 text-muted-foreground">
          Bidooze may suspend, restrict, or terminate access to the platform if we reasonably
          believe you violated these terms, created risk for the platform or other users, failed to
          meet auction requirements, or engaged in fraud or abuse. You may stop using the platform
          at any time, and account deletion requests can be submitted through the{" "}
          <Link href="/data-deletion" className="font-medium text-primary hover:underline">
            data deletion instructions
          </Link>
          .
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-semibold text-foreground">9. Disclaimers and limitation of liability</h2>
        <ul className="space-y-3 text-muted-foreground">
          {limitations.map((item) => (
            <li key={item} className="rounded-2xl bg-muted/50 px-4 py-3 leading-7">
              {item}
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-semibold text-foreground">10. Changes to these terms</h2>
        <p className="leading-7 text-muted-foreground">
          We may revise these Terms &amp; Conditions from time to time. Updated versions will be
          posted on this page with a revised effective date. Continued use of Bidooze after an
          update means you accept the revised terms to the extent permitted by law.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-semibold text-foreground">11. Contact</h2>
        <p className="leading-7 text-muted-foreground">
          For questions about these Terms &amp; Conditions, use the public{" "}
          <Link href="/contact" className="font-medium text-primary hover:underline">
            Contact Us
          </Link>{" "}
          page.
        </p>
      </section>
    </LegalPageShell>
  );
}
