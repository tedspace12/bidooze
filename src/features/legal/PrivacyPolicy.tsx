import Link from "next/link";
import LegalPageShell from "./LegalPageShell";

const effectiveDate = "April 23, 2026";

const collectionItems = [
  "Account and identity details such as your name, email address, phone number, country, timezone, profile image, and the sign-in method you use.",
  "Profile, preference, and account information you choose to add, including company details, bio, saved preferences, watchlists, and notification settings.",
  "Auction activity such as registrations, bids, favorites, purchases, transaction history, and communications related to auctions or lots.",
  "Billing and payment information you provide to save payment methods, manage billing addresses, verify payment methods, or complete related transactions.",
  "Technical data such as browser details, device information, IP address, cookies, and session identifiers used to keep the platform secure and functioning.",
  "Support and contact records when you message us through the public contact page or other support channels.",
];

const useItems = [
  "Create, authenticate, and manage your Bidooze account.",
  "Support email/password sign-in as well as Google and Facebook login flows.",
  "Operate auctions, bidding, watchlists, registrations, payments, and account settings.",
  "Protect the platform, prevent fraud, investigate abuse, and enforce our policies.",
  "Respond to support requests, send service messages, and provide security or policy updates.",
  "Improve site performance, fix bugs, understand usage trends, and comply with legal obligations.",
];

const sharingItems = [
  "Service providers that support hosting, authentication, communications, payments, and customer support for the platform.",
  "Auctioneers or transaction counterparties when that is necessary to process registrations, bids, purchases, shipping, disputes, or other platform activity.",
  "Regulators, law enforcement, courts, or other parties when required to comply with law, protect rights, or prevent fraud and abuse.",
  "A successor entity if Bidooze is involved in a merger, acquisition, financing, or sale of assets.",
];

const rightsItems = [
  "Review and update much of your profile information from your Bidooze account.",
  "Manage marketing and notification preferences from your settings where available.",
  "Request account or personal data deletion by following the steps on the data deletion page.",
  "Revoke Google or Facebook access from your provider account settings if you no longer want to use social login with Bidooze.",
];

export default function PrivacyPolicy() {
  return (
    <LegalPageShell
      title="Privacy Policy"
      summary="This policy applies to the full Bidooze platform, including standard email/password accounts, Google sign-in, Facebook Login, auction browsing, bidding activity, account management, billing features, and support requests."
      effectiveDate={effectiveDate}
      facts={[
        {
          label: "Applies To",
          value:
            "Bidooze users who browse, register, bid, save preferences, pay, or sign in with email/password, Google, or Facebook.",
        },
        {
          label: "Contact",
          value: (
            <>
              Use the public{" "}
              <Link href="/contact" className="font-medium text-primary hover:underline">
                Contact Us
              </Link>{" "}
              page for privacy questions or account support.
            </>
          ),
        },
        {
          label: "Related Page",
          value: (
            <>
              Deletion instructions are available at{" "}
              <Link href="/data-deletion" className="font-medium text-primary hover:underline">
                Data Deletion
              </Link>
              .
            </>
          ),
        },
      ]}
    >
      <section className="space-y-3">
        <h2 className="text-2xl font-semibold text-foreground">1. Scope of this policy</h2>
        <p className="leading-7 text-muted-foreground">
          This Privacy Policy explains how Bidooze collects, uses, stores, and shares personal
          information when you use our website, create an account, sign in through Google or
          Facebook, participate in auctions, place bids, manage payment details, or contact us for
          support.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-semibold text-foreground">2. Information we collect</h2>
        <ul className="space-y-3 text-muted-foreground">
          {collectionItems.map((item) => (
            <li key={item} className="rounded-2xl bg-muted/50 px-4 py-3 leading-7">
              {item}
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-semibold text-foreground">3. How we use information</h2>
        <ul className="space-y-3 text-muted-foreground">
          {useItems.map((item) => (
            <li key={item} className="rounded-2xl bg-muted/50 px-4 py-3 leading-7">
              {item}
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-semibold text-foreground">4. Social login data</h2>
        <p className="leading-7 text-muted-foreground">
          If you choose to sign in with Google or Facebook, Bidooze may receive the basic profile
          information and authentication data that you authorize those providers to share, such as
          your name, email address, profile image, and login tokens needed to complete the sign-in
          flow. We do not receive your Google or Facebook password through these login methods.
        </p>
        <p className="leading-7 text-muted-foreground">
          Social login is optional. You may instead use the standard Bidooze account flow with
          email, verification steps, and password creation.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-semibold text-foreground">5. When we share information</h2>
        <p className="leading-7 text-muted-foreground">
          We do not sell your personal data. We share information only as needed to operate the
          platform and meet legal or security obligations.
        </p>
        <ul className="space-y-3 text-muted-foreground">
          {sharingItems.map((item) => (
            <li key={item} className="rounded-2xl bg-muted/50 px-4 py-3 leading-7">
              {item}
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-semibold text-foreground">6. Cookies, sessions, and security</h2>
        <p className="leading-7 text-muted-foreground">
          Bidooze uses cookies and similar technologies to keep you signed in, remember preferences,
          secure your session, and support essential platform features. We use reasonable technical
          and organizational safeguards to protect personal data, but no system can be guaranteed
          completely secure.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-semibold text-foreground">7. Retention</h2>
        <p className="leading-7 text-muted-foreground">
          We retain personal information for as long as reasonably necessary to provide the
          platform, maintain account records, support bidding and transaction history, resolve
          disputes, prevent fraud, comply with legal obligations, and enforce our terms. Retention
          periods may differ depending on the type of record.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-semibold text-foreground">8. Your choices and rights</h2>
        <ul className="space-y-3 text-muted-foreground">
          {rightsItems.map((item) => (
            <li key={item} className="rounded-2xl bg-muted/50 px-4 py-3 leading-7">
              {item}
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-semibold text-foreground">9. Changes to this policy</h2>
        <p className="leading-7 text-muted-foreground">
          We may update this Privacy Policy from time to time to reflect product, legal, or
          operational changes. Updated versions will be posted on this page with a revised
          effective date.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-semibold text-foreground">10. Contact Bidooze</h2>
        <p className="leading-7 text-muted-foreground">
          For privacy questions, account support, or requests related to your personal data, use
          the public{" "}
          <Link href="/contact" className="font-medium text-primary hover:underline">
            Contact Us
          </Link>{" "}
          page. If your request is specifically about deleting your account or data, follow the
          steps on{" "}
          <Link href="/data-deletion" className="font-medium text-primary hover:underline">
            User Data Deletion Instructions
          </Link>
          .
        </p>
      </section>
    </LegalPageShell>
  );
}
