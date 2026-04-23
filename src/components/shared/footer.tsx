import Link from "next/link";
import { Facebook, Instagram, Linkedin, Twitter, Youtube } from "lucide-react";
import Image from "next/image";

const Footer = () => {
  return (
    <footer className="mt-12 border-t border-primary/30 bg-primary/20 md:mt-16">
      <div className="container mx-auto px-4 py-10 md:py-12">
        <div className="mb-8 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-1">
            <Image
              src="/logo/Bidooze.svg"
              alt="Bidooze Logo"
              width={500}
              height={500}
              className="mb-6 h-8 w-auto sm:h-10"
            />
            <div className="flex items-center gap-4">
              <Link
                href="#"
                className="rounded-full bg-background p-2 transition-colors hover:bg-primary hover:text-primary-foreground"
                aria-label="Facebook"
              >
                <Facebook className="h-4 w-4" />
              </Link>
              <Link
                href="#"
                className="rounded-full bg-background p-2 transition-colors hover:bg-primary hover:text-primary-foreground"
                aria-label="Twitter"
              >
                <Twitter className="h-4 w-4" />
              </Link>
              <Link
                href="#"
                className="rounded-full bg-background p-2 transition-colors hover:bg-primary hover:text-primary-foreground"
                aria-label="Instagram"
              >
                <Instagram className="h-4 w-4" />
              </Link>
              <Link
                href="#"
                className="rounded-full bg-background p-2 transition-colors hover:bg-primary hover:text-primary-foreground"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-4 w-4" />
              </Link>
              <Link
                href="#"
                className="rounded-full bg-background p-2 transition-colors hover:bg-primary hover:text-primary-foreground"
                aria-label="YouTube"
              >
                <Youtube className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <div>
            <h3 className="mb-4 font-semibold text-foreground">About Bidooze</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/about" className="transition-colors hover:text-foreground">
                  About Bidooze
                </Link>
              </li>
              <li>
                <Link href="/contact" className="transition-colors hover:text-foreground">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/blog" className="transition-colors hover:text-foreground">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="#" className="transition-colors hover:text-foreground">
                  Sell on Bidooze
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-semibold text-foreground">Auctions</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/auctions" className="transition-colors hover:text-foreground">
                  All Auctions
                </Link>
              </li>
              <li>
                <Link
                  href="/auctions?auction_status=live"
                  className="transition-colors hover:text-foreground"
                >
                  Live auctions
                </Link>
              </li>
              <li>
                <Link
                  href="/auctions?auction_status=featured"
                  className="transition-colors hover:text-foreground"
                >
                  Featured Auctions
                </Link>
              </li>
              <li>
                <Link
                  href="/auctions?auction_status=hot"
                  className="transition-colors hover:text-foreground"
                >
                  Hot Auctions
                </Link>
              </li>
              <li>
                <Link href="/lots" className="transition-colors hover:text-foreground">
                  Hot Lots
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-semibold text-foreground">Bidding Type</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link
                  href="/lots?lot_type=biddable_lots"
                  className="transition-colors hover:text-foreground"
                >
                  Biddable
                </Link>
              </li>
              <li>
                <Link
                  href="/lots?lot_type=live_webcast_lots"
                  className="transition-colors hover:text-foreground"
                >
                  Webcast
                </Link>
              </li>
              <li>
                <Link
                  href="/lots?lot_type=online_only_lots"
                  className="transition-colors hover:text-foreground"
                >
                  Online Only
                </Link>
              </li>
              <li>
                <Link
                  href="/lots?lot_type=absentee_lots"
                  className="transition-colors hover:text-foreground"
                >
                  Absentee
                </Link>
              </li>
              <li>
                <Link
                  href="/lots?lot_type=listing_only_lots"
                  className="transition-colors hover:text-foreground"
                >
                  Listing Only
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-semibold text-foreground">Resources</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link
                  href="/terms-and-conditions"
                  className="transition-colors hover:text-foreground"
                >
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="transition-colors hover:text-foreground">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/data-deletion" className="transition-colors hover:text-foreground">
                  Data Deletion Instructions
                </Link>
              </li>
              <li>
                <Link href="#" className="transition-colors hover:text-foreground">
                  How an Auction Works
                </Link>
              </li>
              <li>
                <Link href="#" className="transition-colors hover:text-foreground">
                  Sitemaps
                </Link>
              </li>
              <li>
                <Link href="#" className="transition-colors hover:text-foreground">
                  Help & FAQs
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary/30 pt-8 text-center text-sm text-muted-foreground">
          <p>
            &copy; Bidooze{" "}
            <Link
              href="/terms-and-conditions"
              className="transition-colors hover:text-foreground"
            >
              Terms & Conditions
            </Link>
            {" | "}
            <Link
              href="/privacy-policy"
              className="transition-colors hover:text-foreground"
            >
              Privacy Policy
            </Link>
            {" | "}
            <Link
              href="/data-deletion"
              className="transition-colors hover:text-foreground"
            >
              Data Deletion Instructions
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
