'use client';

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Rocket,
  Gavel,
  User,
  CreditCard,
  Package,
  Search,
  Store,
  Wrench,
  BookOpen,
  ArrowRight,
  ChevronRight,
  CircleHelp,
  LifeBuoy,
} from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  articles,
  categories,
  popularArticles,
  quickSearchTerms,
} from "@/features/help/data/help-data";
import MobileSupportSticky from "@/features/help/components/MobileSupportSticky";
import { trackHelpEvent } from "@/features/help/utils/helpAnalytics";
import { cn } from "@/lib/utils";

const sellerPanelUrl = process.env.NEXT_PUBLIC_SELLER_PANEL_URL?.trim() || "";

const categoryIconMap = {
  Rocket,
  Gavel,
  User,
  CreditCard,
  Package,
  Search,
  Store,
  Wrench,
};

function getCategoryTitle(slug: string) {
  return categories.find((category) => category.slug === slug)?.title ?? "General";
}

function updateTopSearches(term: string) {
  if (typeof window === "undefined") return;
  const trimmed = term.trim().toLowerCase();
  if (!trimmed) return;

  const storageKey = "help:top-searches";
  const existing = window.localStorage.getItem(storageKey);
  const counts = existing ? (JSON.parse(existing) as Record<string, number>) : {};
  counts[trimmed] = (counts[trimmed] ?? 0) + 1;
  window.localStorage.setItem(storageKey, JSON.stringify(counts));

  const topSearches = Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([query, count]) => ({ query, count }));

  window.dispatchEvent(
    new CustomEvent("help:top-searches:updated", {
      detail: { topSearches },
    })
  );
}

export default function Help() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const queryValue = query.trim().toLowerCase();
  const isSearching = queryValue.length > 0;

  const filteredArticles = useMemo(() => {
    if (!queryValue) return popularArticles;

    return articles.filter((article) => {
      const categoryTitle = getCategoryTitle(article.category).toLowerCase();
      return (
        article.title.toLowerCase().includes(queryValue) ||
        article.excerpt.toLowerCase().includes(queryValue) ||
        article.content.toLowerCase().includes(queryValue) ||
        categoryTitle.includes(queryValue)
      );
    });
  }, [queryValue]);

  const suggestedCategories = useMemo(() => {
    if (!queryValue) return categories;
    const matchedCategoryIds = new Set(filteredArticles.map((article) => article.category));
    return categories.filter((category) => matchedCategoryIds.has(category.slug));
  }, [queryValue, filteredArticles]);

  const featuredArticles = popularArticles.slice(0, 8);

  function handleSearchSubmit(searchTerm: string, trigger: "enter" | "chip" | "button") {
    const normalizedTerm = searchTerm.trim();
    if (!normalizedTerm) return;
    updateTopSearches(normalizedTerm);
    trackHelpEvent("help_search_submitted", {
      query: normalizedTerm,
      trigger,
      resultCount: filteredArticles.length,
    });
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Help Center</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <section className="relative mb-8 overflow-hidden rounded-2xl border border-border bg-card px-6 py-10 md:px-10 md:py-14">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 65% 55% at -5% -5%, hsl(82 31% 40% / 0.07), transparent 70%)",
          }}
        />
        <div
          className="pointer-events-none absolute -bottom-12 -right-12 h-52 w-52 rounded-full"
          style={{ background: "hsl(75 94% 73% / 0.07)" }}
        />

        <div className="relative max-w-3xl space-y-5">
          <Badge
            variant="outline"
            className="w-fit gap-1.5 border-primary/25 bg-primary/8 text-xs font-medium text-primary"
          >
            <BookOpen className="h-3 w-3" />
            Bidooze Help Center
          </Badge>

          <div>
            <h1 className="text-3xl font-bold leading-tight tracking-tight text-foreground md:text-4xl">
              Fast answers for every step of bidding
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">
              Search guides on account setup, registration, bidding, invoices, pickup and shipping,
              or browse by topic to get unstuck quickly.
            </p>
          </div>

          <div className="relative max-w-xl">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  handleSearchSubmit(query, "enter");
                }
              }}
              placeholder="Search help articles, terms, and categories..."
              className="h-11 bg-background pl-9 pr-9 text-sm shadow-none focus-visible:ring-primary/40"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="absolute right-3 top-1/2 flex h-5 w-5 -translate-y-1/2 items-center justify-center rounded-full bg-muted text-[10px] leading-none text-muted-foreground transition-colors hover:bg-border"
                aria-label="Clear search"
              >
                ✕
              </button>
            )}
          </div>

          <div className="flex flex-wrap gap-2 pt-0.5">
            <span className="self-center pr-1 text-[11px] font-medium uppercase tracking-wider text-muted-foreground/60">
              Popular:
            </span>
            {quickSearchTerms.map((term) => (
              <button
                key={term}
                onClick={() => {
                  setQuery(term);
                  updateTopSearches(term);
                  trackHelpEvent("help_quick_term_clicked", { term });
                  trackHelpEvent("help_search_submitted", {
                    query: term,
                    trigger: "chip",
                  });
                }}
                className={cn(
                  "rounded-full border px-3 py-1.5 text-xs transition-colors",
                  "border-border bg-secondary text-muted-foreground",
                  "hover:border-primary/30 hover:bg-primary/8 hover:text-primary"
                )}
              >
                {term}
              </button>
            ))}
          </div>
        </div>
      </section>

      {isSearching ? (
        <section className="mb-10 space-y-6">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground">{filteredArticles.length}</span>{" "}
              result{filteredArticles.length !== 1 ? "s" : ""} for{" "}
              <span className="font-medium text-foreground">&quot;{query}&quot;</span>
            </p>
            <button
              onClick={() => setQuery("")}
              className="text-xs text-primary hover:underline underline-offset-2"
            >
              Clear search
            </button>
          </div>

          <Card className="border border-border shadow-none">
            <CardContent className="p-2">
              {filteredArticles.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-2 py-12 text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                    <CircleHelp className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <p className="text-sm font-medium text-foreground">No articles found</p>
                  <p className="text-xs text-muted-foreground">
                    Try a different keyword or browse topics below.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2 h-8 text-xs"
                    onClick={() => setQuery("")}
                  >
                    Browse all topics
                  </Button>
                </div>
              ) : (
                filteredArticles.map((article, index) => (
                  <div key={article.id}>
                    <Link
                      href={`/help/article/${article.slug}`}
                      onClick={() => {
                        trackHelpEvent("help_article_opened", {
                          slug: article.slug,
                          title: article.title,
                          source: "search_results",
                        });
                      }}
                      className="group flex items-center gap-3 rounded-lg px-4 py-3 transition-colors hover:bg-secondary"
                    >
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary/8 text-primary/60 transition-colors group-hover:bg-primary/15 group-hover:text-primary">
                        <BookOpen className="h-3.5 w-3.5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-foreground transition-colors group-hover:text-primary">
                          {article.title}
                        </p>
                        <p className="mt-0.5 text-[11px] text-muted-foreground">
                          {getCategoryTitle(article.category)} · {article.readTime} min read
                        </p>
                      </div>
                      <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground/40 transition-all group-hover:translate-x-0.5 group-hover:text-primary" />
                    </Link>
                    {index < filteredArticles.length - 1 && <Separator className="mx-4" />}
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {suggestedCategories.length > 0 && (
            <div>
              <p className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Related categories
              </p>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {suggestedCategories.map((category) => {
                  const Icon = categoryIconMap[category.icon as keyof typeof categoryIconMap] ?? CircleHelp;
                  return (
                    <button
                      key={category.slug}
                      onClick={() => {
                        trackHelpEvent("help_category_opened", {
                          slug: category.slug,
                          title: category.title,
                          source: "search_related_categories",
                        });
                        router.push(`/help/category/${category.slug}`);
                      }}
                      className={cn(
                        "group flex items-center gap-3 rounded-lg border border-border bg-card px-4 py-3 text-left",
                        "transition-colors hover:border-primary/25 hover:bg-secondary",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      )}
                    >
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-foreground transition-colors group-hover:text-primary">
                          {category.title}
                        </p>
                        <p className="text-[11px] text-muted-foreground">{category.articleCount} articles</p>
                      </div>
                      <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </section>
      ) : (
        <>
          <section className="mb-10">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-base font-semibold text-foreground">Browse by topic</h2>
              <span className="text-xs text-muted-foreground">{categories.length} categories</span>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {categories.map((category) => {
                const Icon = categoryIconMap[category.icon as keyof typeof categoryIconMap] ?? CircleHelp;
                return (
                  <button
                    key={category.slug}
                    onClick={() => {
                      trackHelpEvent("help_category_opened", {
                        slug: category.slug,
                        title: category.title,
                        source: "browse_categories",
                      });
                      router.push(`/help/category/${category.slug}`);
                    }}
                    className={cn(
                      "group relative flex flex-col gap-3 rounded-xl border border-border bg-card p-5 text-left",
                      "transition-all duration-150 hover:border-primary/30 hover:bg-secondary/50",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <Icon className="h-4 w-4" />
                      </div>
                      <Badge variant="secondary" className="text-[10px] font-normal text-muted-foreground">
                        {category.articleCount} articles
                      </Badge>
                    </div>

                    <div>
                      <p className="text-sm font-semibold leading-snug text-foreground transition-colors group-hover:text-primary">
                        {category.title}
                      </p>
                      <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                        {category.description}
                      </p>
                    </div>

                    <div className="mt-auto flex items-center gap-1 pt-0.5 text-xs text-muted-foreground transition-colors group-hover:text-primary">
                      Browse
                      <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                    </div>
                  </button>
                );
              })}
            </div>
          </section>

          <section className="mb-10">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-base font-semibold text-foreground">Popular articles</h2>
            </div>

            <Card className="border border-border shadow-none">
              <CardContent className="p-2">
                {featuredArticles.map((article, index) => (
                  <div key={article.id}>
                    <Link
                      href={`/help/article/${article.slug}`}
                      onClick={() => {
                        trackHelpEvent("help_article_opened", {
                          slug: article.slug,
                          title: article.title,
                          source: "popular_articles",
                        });
                      }}
                      className="group flex items-center gap-3 rounded-lg px-4 py-3 transition-colors hover:bg-secondary"
                    >
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-primary/8 text-primary/50 transition-colors group-hover:bg-primary/15 group-hover:text-primary">
                        <BookOpen className="h-3.5 w-3.5" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm text-foreground transition-colors group-hover:text-primary">
                          {article.title}
                        </p>
                        <div className="mt-0.5 flex items-center gap-2">
                          {article.popular && (
                            <span className="rounded-full bg-primary/10 px-1.5 py-0.5 text-[10px] font-medium leading-none text-primary">
                              Popular
                            </span>
                          )}
                          <span className="text-[11px] text-muted-foreground">{getCategoryTitle(article.category)}</span>
                          <span className="text-[10px] text-muted-foreground/40">·</span>
                          <span className="text-[11px] text-muted-foreground">{article.readTime} min read</span>
                        </div>
                      </div>

                      <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground/30 transition-all group-hover:translate-x-0.5 group-hover:text-primary" />
                    </Link>
                    {index < featuredArticles.length - 1 && <Separator className="mx-4" />}
                  </div>
                ))}
              </CardContent>
            </Card>
          </section>

          <section className="grid gap-4 sm:grid-cols-2">
            <Card className="overflow-hidden border border-border shadow-none">
              <CardContent className="relative space-y-3 p-6">
                <div
                  className="pointer-events-none absolute inset-0"
                  style={{
                    background:
                      "radial-gradient(ellipse 90% 80% at 110% 110%, hsl(82 31% 40% / 0.06), transparent 60%)",
                  }}
                />
                <div className="relative space-y-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Store className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-foreground">
                      Interested in becoming an auctioneer?
                    </h3>
                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                      Launch your own auctions from our dedicated auctioneer panel and reach active
                      bidders on Bidooze.
                    </p>
                  </div>
                  <Button
                    size="sm"
                    className="h-9 gap-1.5 text-xs"
                    onClick={() => {
                      if (sellerPanelUrl) window.location.assign(sellerPanelUrl);
                    }}
                    disabled={!sellerPanelUrl}
                  >
                    Go to Auctioneer Panel
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-border shadow-none">
              <CardContent className="space-y-3 p-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <LifeBuoy className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-foreground">Need human support?</h3>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                    Our team can help with account, bidding, payment, or post-auction questions.
                  </p>
                </div>
                <Button asChild variant="outline" size="sm" className="h-9 w-fit text-xs">
                  <Link href="/contact">Contact support</Link>
                </Button>
              </CardContent>
            </Card>
          </section>
        </>
      )}
      <MobileSupportSticky />
    </main>
  );
}