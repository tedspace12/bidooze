import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { articles, categories } from "@/features/help/data/help-data";
import ArticleList from "@/features/help/components/ArticleList";
import ContactStrip from "@/features/help/components/ContactStrip";
import MobileSupportSticky from "@/features/help/components/MobileSupportSticky";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface CategoryPageProps {
  slug: string;
}

export function generateStaticParams() {
  return categories.map((c) => ({ slug: c.slug }));
}

export default function CategoryPage({ slug }: CategoryPageProps) {
  const category = categories.find((c) => c.slug === slug);
  if (!category) notFound();

  const categoryArticles = articles.filter((a) => a.category === slug);
  const otherCategories = categories.filter((c) => c.slug !== slug).slice(0, 4);

  return (
    <main className="container mx-auto px-4 py-8">
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/help">Help Center</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{category.title}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <section className="mb-8 rounded-2xl border border-border bg-card p-6 md:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-3">
            <Badge variant="secondary" className="w-fit">
              {categoryArticles.length} article{categoryArticles.length !== 1 ? "s" : ""}
            </Badge>
            <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
              {category.title}
            </h1>
            <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">
              {category.description}
            </p>
          </div>

          <Link
            href="/help"
            className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-2 text-xs font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to help
          </Link>
        </div>
      </section>

      <div className="space-y-8 pb-24 md:pb-8">
        <section>
          <h2 className="mb-3 text-base font-semibold text-foreground">Articles</h2>
          <ArticleList articles={categoryArticles} />
        </section>

        {otherCategories.length > 0 && (
          <section>
            <h2 className="mb-3 text-sm font-semibold text-foreground">
              Other categories
            </h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {otherCategories.map((cat) => (
                <Card key={cat.slug} className="border-border shadow-none">
                  <CardContent className="p-0">
                    <Link
                      href={`/help/category/${cat.slug}`}
                      className="group flex items-center justify-between rounded-xl px-4 py-3 transition-colors hover:bg-secondary"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-foreground transition-colors group-hover:text-primary">
                          {cat.title}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {cat.articleCount} articles
                        </p>
                      </div>
                      <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}
      </div>
      <MobileSupportSticky />
    </main>
  );
}