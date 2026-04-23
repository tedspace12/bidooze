'use client';

import { useRouter } from "next/navigation";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import SectionHeader from "@/components/shared/SectionHeader";
import {
  Gavel,
  Store,
  Globe,
  ShieldCheck,
  Sparkles,
  Users,
  ArrowRight,
  Megaphone,
  BarChart3,
  Clock3,
  CheckCircle2,
  Banknote,
} from "lucide-react";

const sellerPanelUrl = process.env.NEXT_PUBLIC_SELLER_PANEL_URL?.trim() || "";

const sellerBenefits = [
  {
    title: "Reach high-intent bidders",
    description: "Publish auctions where serious buyers are already active, engaged, and ready to bid.",
    icon: Globe,
  },
  {
    title: "Run your sale your way",
    description: "Use timed, live, or hybrid formats with configurable start/end windows and lot-level control.",
    icon: Clock3,
  },
  {
    title: "Track performance in real time",
    description: "Monitor registrations, bid activity, lot performance, and outcomes from one dashboard.",
    icon: BarChart3,
  },
  {
    title: "Get paid with confidence",
    description: "Rely on trusted payment workflows, settlement visibility, and transparent records.",
    icon: Banknote,
  },
];

const featureHighlights = [
  "Auction setup and publishing tools",
  "Lot management with images and metadata",
  "Bidder registration and approval workflows",
  "Integrated communication and notices",
  "Sales reporting and operational visibility",
  "Seller/auctioneer focused support",
];

const sellSteps = [
  {
    title: "Create your auctioneer account",
    description: "Sign up on the auctioneer panel and complete your business profile.",
    step: "1",
  },
  {
    title: "Build your first auction",
    description: "Add auction details, upload lots, and configure schedule, terms, and bidder flow.",
    step: "2",
  },
  {
    title: "Launch and scale",
    description: "Go live to Bidooze bidders, optimize from analytics, and grow repeat participation.",
    step: "3",
  },
];

const Sell = () => {
  const router = useRouter();
  const hasSellerPanelLink = sellerPanelUrl.length > 0;
  const isValidUrl = sellerPanelUrl.startsWith("http://") || sellerPanelUrl.startsWith("https://");

    const launchSellerPanel = () => {
        if (!hasSellerPanelLink || !isValidUrl) {
            console.error("Invalid seller panel URL:", sellerPanelUrl);
            router.push("/contact");
            return;
        }

        window.open(sellerPanelUrl, "_blank", "noopener,noreferrer");
    };

  return (
    <main className="container mx-auto px-4 py-8">
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Sell</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="grid gap-8 lg:grid-cols-[1.5fr_1fr] items-start mb-12">
        <div className="space-y-6">
          <div className="space-y-4">
            <p className="text-sm font-medium uppercase tracking-[0.24em] text-primary">Auctioneer program</p>
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground max-w-3xl">
              Ready to sell like a pro on Bidooze?
            </h1>
            <p className="text-muted-foreground max-w-2xl text-base sm:text-lg">
              This bidder-side portal is where buyers discover and bid. To host your own auctions, you will use our dedicated auctioneer panel on a separate domain built for sellers and auction teams.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start gap-3">
            <Button onClick={launchSellerPanel} className="min-w-45 inline-flex items-center gap-2">
              Become an Auctioneer
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button variant="outline" onClick={() => router.push("/contact")} className="min-w-45">
              Talk to our team
            </Button>
          </div>
          {!hasSellerPanelLink && (
            <p className="text-xs text-muted-foreground">
              Seller panel URL is not configured yet. Contact support to enable auctioneer onboarding.
            </p>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            {sellerBenefits.map((benefit) => {
              const Icon = benefit.icon;
              return (
                <Card key={benefit.title} className="border border-border bg-card p-5">
                  <div className="flex items-center justify-between gap-4 mb-4">
                    <div>
                      <p className="text-sm font-semibold text-foreground">{benefit.title}</p>
                    </div>
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                      <Icon className="h-5 w-5" />
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">{benefit.description}</p>
                </Card>
              );
            })}
          </div>
        </div>

        <Card className="border border-border bg-card p-6">
          <CardContent className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-accent/20 text-accent">
                <Store className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">Why auctioneers choose Bidooze</p>
                <p className="text-sm text-muted-foreground">Built to help you run reliable, high-conversion auctions.</p>
              </div>
            </div>
            <Separator />
            <div className="space-y-4">
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-muted-foreground">Power features</p>
                <h2 className="mt-2 text-xl font-semibold text-foreground">Everything needed to run modern auctions.</h2>
              </div>
              <div className="space-y-3">
                {featureHighlights.map((item) => (
                  <div key={item} className="flex items-start gap-2 text-sm text-foreground">
                    <CheckCircle2 className="h-4 w-4 mt-0.5 text-primary shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <SectionHeader
        title="How it works"
        description="A simple process to launch your auction, add lots, and connect with buyers."
      />

      <div className="grid gap-4 md:grid-cols-3">
        {sellSteps.map((step) => (
          <Card key={step.title} className="border border-border bg-card p-6">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary font-semibold">
              {step.step}
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">{step.title}</h3>
            <p className="text-sm text-muted-foreground">{step.description}</p>
          </Card>
        ))}
      </div>

      <div className="mt-12 rounded-3xl border border-primary/20 bg-primary/5 p-8 sm:p-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="space-y-3">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">Start today</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground">Create your auctioneer account and launch with confidence.</h2>
            <p className="text-sm text-muted-foreground max-w-xl">
              You are one step away from running professional online auctions with the tools, audience, and support to grow.
            </p>
          </div>
          <Button onClick={launchSellerPanel} className="inline-flex items-center gap-2">
            Go to Auctioneer Panel
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </main>
  );
};

export default Sell;
