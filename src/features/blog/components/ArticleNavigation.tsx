import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { BlogPost } from "../data/blogPosts";

interface ArticleNavigationProps {
  prevPost: BlogPost | null;
  nextPost: BlogPost | null;
}

const ArticleNavigation = ({ prevPost, nextPost }: ArticleNavigationProps) => {
  if (!prevPost && !nextPost) return null;

  return (
    <nav className="flex items-stretch gap-4 mt-12 pt-8 border-t border-border">
      {prevPost ? (
        <Link
          href={`/blog/${prevPost.slug}`}
          className="flex-1 group"
        >
          <div className="flex items-start gap-3 p-4 rounded-lg border border-border hover:border-primary/50 hover:bg-muted/50 transition-colors h-full">
            <ChevronLeft className="h-5 w-5 text-muted-foreground group-hover:text-primary mt-0.5 shrink-0" />
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground mb-1">Previous Article</p>
              <p className="font-medium text-foreground line-clamp-2 group-hover:text-primary transition-colors text-sm sm:text-base">
                {prevPost.title}
              </p>
            </div>
          </div>
        </Link>
      ) : (
        <div className="flex-1" />
      )}
      
      {nextPost ? (
        <Link
          href={`/blog/${nextPost.slug}`}
          className="flex-1 group"
        >
          <div className="flex items-start gap-3 p-4 rounded-lg border border-border hover:border-primary/50 hover:bg-muted/50 transition-colors text-right h-full justify-end">
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground mb-1">Next Article</p>
              <p className="font-medium text-foreground line-clamp-2 group-hover:text-primary transition-colors text-sm sm:text-base">
                {nextPost.title}
              </p>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary mt-0.5 shrink-0" />
          </div>
        </Link>
      ) : (
        <div className="flex-1" />
      )}
    </nav>
  );
};

export default ArticleNavigation;
