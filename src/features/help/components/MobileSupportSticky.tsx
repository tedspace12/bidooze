import Link from "next/link";
import { MessageCircle } from "lucide-react";

export default function MobileSupportSticky() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 p-3 backdrop-blur md:hidden">
      <Link
        href="/contact"
        className="flex h-11 w-full items-center justify-center gap-2 rounded-md bg-primary text-sm font-medium text-primary-foreground"
      >
        <MessageCircle className="h-4 w-4" />
        Contact support
      </Link>
    </div>
  );
}
