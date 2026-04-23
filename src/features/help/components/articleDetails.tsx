import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  BookOpen,
  CalendarDays,
  ChevronRight,
  Clock3,
  MessageCircle,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { articles, categories } from "@/features/help/data/help-data";
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
import { Button } from "@/components/ui/button";

interface ArticlePageProps {
  slug: string;
}

export function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default function ArticlePage({ slug }: ArticlePageProps) {
  const article = articles.find((a) => a.slug === slug);
  if (!article) notFound();

  const category = categories.find((c) => c.slug === article.category);
  const related = articles
    .filter((a) => a.category === article.category && a.id !== article.id)
    .slice(0, 4);

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/help">Help Center</BreadcrumbLink>
            </BreadcrumbItem>
            {category && (
              <>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink href={`/help/category/${category.slug}`}>
                    {category.title}
                  </BreadcrumbLink>
                </BreadcrumbItem>
              </>
            )}
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="max-w-[220px] truncate sm:max-w-none">
                {article.title}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {category && (
          <Link
            href={`/help/category/${category.slug}`}
            className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-2 text-xs font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to {category.title}
          </Link>
        )}
      </div>

      <div className="grid gap-6 pb-24 lg:grid-cols-[minmax(0,1fr)_280px] lg:items-start lg:pb-8">
        <article className="space-y-5 rounded-2xl border border-border bg-card p-6 md:p-8">
          <div className="flex flex-wrap items-center gap-2">
            {article.popular && <Badge>Popular</Badge>}
            {category && (
              <Badge variant="secondary">{category.title}</Badge>
            )}
          </div>

          <div className="space-y-3">
            <h1 className="text-2xl font-bold leading-tight tracking-tight text-foreground md:text-3xl">
              {article.title}
            </h1>
            <p className="text-sm leading-relaxed text-muted-foreground md:text-base">
              {article.excerpt}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 border-y border-border py-3 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <Clock3 className="h-3.5 w-3.5" />
              {article.readTime} min read
            </span>
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays className="h-3.5 w-3.5" />
              Updated {formatDate(article.updatedAt)}
            </span>
          </div>

          <div className="
            prose prose-sm max-w-none
            text-foreground
            prose-headings:mt-7 prose-headings:mb-3 prose-headings:font-semibold prose-headings:text-foreground
            prose-h2:text-xl prose-h3:text-lg
            prose-p:leading-7 prose-p:text-foreground/90
            prose-li:leading-7 prose-li:text-foreground/90
            prose-strong:text-foreground
            prose-a:text-primary prose-a:no-underline hover:prose-a:underline
            prose-blockquote:border-l-primary/30 prose-blockquote:text-muted-foreground
            prose-code:rounded prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:text-[13px]
            prose-pre:bg-muted prose-pre:text-foreground
            prose-table:text-sm
            prose-th:text-foreground prose-td:text-foreground/90
          ">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {article.content.trim()}
            </ReactMarkdown>
          </div>

          <div className="flex flex-col gap-3 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted-foreground">Was this article helpful?</p>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                Yes, helpful
              </Button>
              <Button variant="outline" size="sm">
                Not really
              </Button>
            </div>
          </div>
        </article>

        <aside className="space-y-4">
          <Card className="border-border shadow-none">
            <CardContent className="p-4">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Related articles
              </p>
              {related.length > 0 ? (
                <div className="space-y-1.5">
                  {related.map((rel) => (
                    <Link
                      key={rel.id}
                      href={`/help/article/${rel.slug}`}
                      className="group flex items-start gap-2 rounded-md px-2 py-2 transition-colors hover:bg-secondary"
                    >
                      <BookOpen className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                      <div className="min-w-0 flex-1">
                        <p className="line-clamp-2 text-sm text-foreground transition-colors group-hover:text-primary">
                          {rel.title}
                        </p>
                        <p className="text-xs text-muted-foreground">{rel.readTime} min read</p>
                      </div>
                      <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-muted-foreground">No related articles yet.</p>
              )}
            </CardContent>
          </Card>

          <Card className="border-border shadow-none">
            <CardContent className="space-y-3 p-4">
              <p className="text-sm font-semibold text-foreground">Need more help?</p>
              <p className="text-xs leading-relaxed text-muted-foreground">
                Reach out to our support team for account, bidding, or payment questions.
              </p>
              <Button asChild size="sm" className="w-full">
                <Link href="/contact">
                  <MessageCircle className="mr-1.5 h-3.5 w-3.5" />
                  Contact support
                </Link>
              </Button>
            </CardContent>
          </Card>
        </aside>
      </div>
      <MobileSupportSticky />
    </main>
  );
}