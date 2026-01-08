import Link from "next/link";
import { Facebook, Twitter, Instagram, Linkedin, Youtube } from "lucide-react";
import Image from "next/image";

const Footer = () => {
  return (
    <footer className="bg-primary/20 border-t border-primary/30 mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-8">
          {/* Logo and Social */}
          <div className="lg:col-span-1">
            <Image
              src={"/logo/Bidooze.svg"}
              alt="Bidooze Logo"
              width={500}
              height={500}
              className="h-10 w-auto mb-6"
            />
            <div className="flex items-center gap-4">
              <Link
                href="#"
                className="p-2 rounded-full bg-background hover:bg-primary hover:text-primary-foreground transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-4 w-4" />
              </Link>
              <Link
                href="#"
                className="p-2 rounded-full bg-background hover:bg-primary hover:text-primary-foreground transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-4 w-4" />
              </Link>
              <Link
                href="#"
                className="p-2 rounded-full bg-background hover:bg-primary hover:text-primary-foreground transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-4 w-4" />
              </Link>
              <Link
                href="#"
                className="p-2 rounded-full bg-background hover:bg-primary hover:text-primary-foreground transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-4 w-4" />
              </Link>
              <Link
                href="#"
                className="p-2 rounded-full bg-background hover:bg-primary hover:text-primary-foreground transition-colors"
                aria-label="YouTube"
              >
                <Youtube className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* About Bidooze */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">
              About Bidooze
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link
                  href="/about"
                  className="hover:text-foreground transition-colors"
                >
                  About Bidooze
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-foreground transition-colors"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="hover:text-foreground transition-colors"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:text-foreground transition-colors"
                >
                  Sell on Bidooze
                </Link>
              </li>
            </ul>
          </div>

          {/* Auctions */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Auctions</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link
                  href="/auctions"
                  className="hover:text-foreground transition-colors"
                >
                  All Auctions
                </Link>
              </li>
              <li>
                <Link
                  href="/auctions?status=closing-soon"
                  className="hover:text-foreground transition-colors"
                >
                  Closing Soon
                </Link>
              </li>
              <li>
                <Link
                  href="/auctions?status=featured"
                  className="hover:text-foreground transition-colors"
                >
                  Featured Auctions
                </Link>
              </li>
              <li>
                <Link
                  href="/auctions?status=hot"
                  className="hover:text-foreground transition-colors"
                >
                  Hot Auctions
                </Link>
              </li>
              <li>
                <Link
                  href="/lots"
                  className="hover:text-foreground transition-colors"
                >
                  Hot Lots
                </Link>
              </li>
            </ul>
          </div>

          {/* Bidding Type */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Bidding Type</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link
                  href="/lots?lotType=biddable"
                  className="hover:text-foreground transition-colors"
                >
                  Biddable
                </Link>
              </li>
              <li>
                <Link
                  href="/lots?lotType=webcast"
                  className="hover:text-foreground transition-colors"
                >
                  Webcast
                </Link>
              </li>
              <li>
                <Link
                  href="/lots?lotType=online-only"
                  className="hover:text-foreground transition-colors"
                >
                  Online Only
                </Link>
              </li>
              <li>
                <Link
                  href="/lots?lotType=absentee"
                  className="hover:text-foreground transition-colors"
                >
                  Absentee
                </Link>
              </li>
              <li>
                <Link
                  href="/lots?lotType=listing-only"
                  className="hover:text-foreground transition-colors"
                >
                  Listing Only
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Resources</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link
                  href="#"
                  className="hover:text-foreground transition-colors"
                >
                  Using Bidooze
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:text-foreground transition-colors"
                >
                  Auction Terms
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:text-foreground transition-colors"
                >
                  How an Auction Works
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:text-foreground transition-colors"
                >
                  Sitemaps
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:text-foreground transition-colors"
                >
                  Help & FAQs
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:text-foreground transition-colors"
                >
                  Buying Guides
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 border-t border-primary/30 text-center text-sm text-muted-foreground">
          <p>
            ©copyright Bidooze —{" "}
            <Link href="#" className="hover:text-foreground transition-colors">
              Privacy Policy & Cookies
            </Link>
            {" · "}
            <Link href="#" className="hover:text-foreground transition-colors">
              Terms & Conditions
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
