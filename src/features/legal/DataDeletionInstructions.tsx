import Link from "next/link";
import LegalPageShell from "./LegalPageShell";

const effectiveDate = "April 23, 2026";

const deletionScope = [
  "Your Bidooze account profile and personal details stored for platform use.",
  "Saved preferences, watchlists, communication preferences, and related profile metadata.",
  "Billing addresses and saved payment method records that can be removed from the platform.",
  "Support records and social-login linkage data where deletion is legally and operationally permitted.",
];

const requestSteps = [
  "If you can sign in, review your account settings and remove any payment methods or billing addresses you no longer want stored before sending a deletion request.",
  "Go to the public Contact Us page at /contact and submit a message using the email address registered on your Bidooze account.",
  'Select "Account help" as the reason for contact and clearly state that you want your Bidooze account and personal data deleted.',
  "Include enough information for verification, such as your full name, registered email address, and the sign-in method used on the account: email/password, Google, or Facebook.",
  "If you used Google or Facebook Login, you may also revoke Bidooze access from that provider inside your Google or Facebook account settings to stop future social sign-ins.",
];

const retainedItems = [
  "Transaction, bidding, payment, fraud-prevention, dispute, tax, accounting, or legal-compliance records that we must keep for legitimate business or legal reasons.",
  "Security logs, audit records, and backup copies that may remain for a limited period before secure deletion or overwrite.",
  "Data that has been anonymized or de-identified so that it no longer identifies you personally.",
];

export default function DataDeletionInstructions() {
  return (
    <LegalPageShell
      title="User Data Deletion Instructions"
      summary="These instructions apply to the full Bidooze platform, including accounts created with email/password and accounts accessed with Google or Facebook Login."
      effectiveDate={effectiveDate}
      facts={[
        {
          label: "Request Method",
          value: (
            <>
              Submit a verified request through{" "}
              <Link href="/contact" className="font-medium text-primary hover:underline">
                /contact
              </Link>
              .
            </>
          ),
        },
        {
          label: "Who It Covers",
          value:
            "Standard Bidooze accounts, Google sign-in, Facebook Login, profile data, preferences, and stored platform records that are eligible for deletion.",
        },
        {
          label: "Related Page",
          value: (
            <>
              Read the full platform policy at{" "}
              <Link href="/privacy-policy" className="font-medium text-primary hover:underline">
                /privacy-policy
              </Link>
              .
            </>
          ),
        },
      ]}
    >
      <section className="space-y-3">
        <h2 className="text-2xl font-semibold text-foreground">1. What this page covers</h2>
        <p className="leading-7 text-muted-foreground">
          This page explains how a user can request deletion of personal data handled by Bidooze.
          It is not limited to Facebook Login. It also covers Google sign-in, standard
          email/password accounts, and other personal data submitted while using the platform.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-semibold text-foreground">2. Data you may ask us to delete</h2>
        <ul className="space-y-3 text-muted-foreground">
          {deletionScope.map((item) => (
            <li key={item} className="rounded-2xl bg-muted/50 px-4 py-3 leading-7">
              {item}
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-semibold text-foreground">3. How to request deletion</h2>
        <ul className="space-y-3 text-muted-foreground">
          {requestSteps.map((item) => (
            <li key={item} className="rounded-2xl bg-muted/50 px-4 py-3 leading-7">
              {item}
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-semibold text-foreground">4. Verification and processing</h2>
        <p className="leading-7 text-muted-foreground">
          To protect users from unauthorized deletion, we may request additional information to
          verify ownership of the account before acting on a deletion request. After verification,
          we aim to review requests promptly and process eligible deletions in line with applicable
          law, security needs, and operational requirements.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-semibold text-foreground">5. Data that may be retained</h2>
        <p className="leading-7 text-muted-foreground">
          Some information may need to be retained even after a deletion request is completed.
        </p>
        <ul className="space-y-3 text-muted-foreground">
          {retainedItems.map((item) => (
            <li key={item} className="rounded-2xl bg-muted/50 px-4 py-3 leading-7">
              {item}
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-semibold text-foreground">6. Google and Facebook account access</h2>
        <p className="leading-7 text-muted-foreground">
          If you signed in with Google or Facebook, deleting your Bidooze account removes or
          anonymizes the eligible data that Bidooze controls. You can separately revoke Bidooze
          access from your Google or Facebook account permissions to prevent future social-login
          use.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-semibold text-foreground">7. Questions</h2>
        <p className="leading-7 text-muted-foreground">
          If you need help with a deletion request, use the public{" "}
          <Link href="/contact" className="font-medium text-primary hover:underline">
            Contact Us
          </Link>{" "}
          page. For more detail on how Bidooze handles data before and after a request, review the{" "}
          <Link href="/privacy-policy" className="font-medium text-primary hover:underline">
            Privacy Policy
          </Link>
          .
        </p>
      </section>
    </LegalPageShell>
  );
}
