// =========================
// components/help/ArticleList.tsx
// =========================
import Link from "next/link";
import { Article } from "@/features/help/data/help-data";

interface ArticleListProps {
  articles: Article[];
  showCategory?: boolean;
  compact?: boolean;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function ArticleList({
  articles,
  showCategory = false,
  compact = false,
}: ArticleListProps) {
  if (articles.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-muted">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            strokeWidth="1.5" className="text-muted-foreground" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="7" />
            <line x1="16.9" y1="16.9" x2="22" y2="22" />
          </svg>
        </div>
        <p className="text-[15px] text-foreground">
          No articles found
        </p>
        <p className="mt-1 text-[13px] text-muted-foreground">
          Try a different search term or browse by category
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {articles.map((article) => (
        <Link
          key={article.id}
          href={`/help/article/${article.slug}`}
          className="group flex items-start gap-4 rounded-xl border border-border bg-card px-5 py-4 transition-all duration-150 hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {/* Document icon */}
          <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors duration-150 group-hover:bg-primary/15">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"
              className="transition-colors"
            >
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="8" y1="13" x2="16" y2="13" />
              <line x1="8" y1="17" x2="12" y2="17" />
            </svg>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h4 className="truncate text-[14px] font-semibold leading-snug text-foreground transition-colors group-hover:text-primary">
                  {article.title}
                </h4>

                {!compact && (
                  <p className="mt-0.5 line-clamp-1 text-[12px] leading-relaxed text-muted-foreground">
                    {article.excerpt}
                  </p>
                )}
              </div>

              {/* Arrow */}
              <svg
                className="mt-0.5 shrink-0 text-muted-foreground/50 transition-all duration-150 group-hover:translate-x-0.5 group-hover:text-primary"
                width="14" height="14" viewBox="0 0 16 16" fill="none"
              >
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5"
                  strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>

            {/* Metadata row */}
            {!compact && (
              <div className="flex items-center gap-3 mt-2">
                {article.popular && (
                  <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium tracking-wide text-primary">
                    Popular
                  </span>
                )}
                {showCategory && (
                  <span className="text-[11px] capitalize text-muted-foreground">
                    {article.category.replace(/-/g, " ")}
                  </span>
                )}
                <span className="text-[11px] text-muted-foreground">
                  {article.readTime} min read
                </span>
                <span className="text-[11px] text-muted-foreground">
                  Updated {formatDate(article.updatedAt)}
                </span>
              </div>
            )}
          </div>
        </Link>
      ))}
    </div>
  );
}