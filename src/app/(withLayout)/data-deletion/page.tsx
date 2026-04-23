import type { Metadata } from "next";
import DataDeletionInstructions from "@/features/legal/DataDeletionInstructions";

export const metadata: Metadata = {
  title: "User Data Deletion Instructions | Bidooze",
  description:
    "Public instructions for requesting deletion of Bidooze user data for standard, Google, and Facebook-authenticated accounts.",
};

export default function Page() {
  return <DataDeletionInstructions />;
}
