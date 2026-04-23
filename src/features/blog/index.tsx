'use client';

import { useState } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { AlertCircle, Newspaper } from "lucide-react";
import Link from "next/link";
import BlogCard from "./components/BlogCard";
import BlogPagination from "./components/BlogPagination";
import { useBlog } from "./hooks/useBlog";

const BlogCardSkeleton = () => (
  <div className="rounded-xl border border-border overflow-hidden">
    <div className="aspect-16/10 bg-muted animate-pulse" />
    <div className="p-3 md:p-5 space-y-3">
      <div className="h-5 w-20 bg-muted animate-pulse rounded-full" />
      <div className="h-5 w-full bg-muted animate-pulse rounded" />
      <div className="h-5 w-4/5 bg-muted animate-pulse rounded" />
      <div className="h-4 w-full bg-muted animate-pulse rounded" />
      <div className="h-4 w-3/4 bg-muted animate-pulse rounded" />
      <div className="flex items-center gap-3 pt-1">
        <div className="h-8 w-8 rounded-full bg-muted animate-pulse shrink-0" />
        <div className="flex-1 space-y-1.5">
          <div className="h-3 w-24 bg-muted animate-pulse rounded" />
          <div className="h-3 w-32 bg-muted animate-pulse rounded" />
        </div>
      </div>
      <div className="flex items-center justify-between pt-3 border-t border-border">
        <div className="h-3 w-28 bg-muted animate-pulse rounded" />
        <div className="h-3 w-16 bg-muted animate-pulse rounded" />
      </div>
    </div>
  </div>
);

const Blog = () => {
  const [currentPage, setCurrentPage] = useState(1);

  const { useBlogs } = useBlog();
  const { data, isLoading, isError, refetch } = useBlogs({ page: currentPage, per_page: 12 });

  const posts = data?.data ?? [];
  const totalPages = data?.meta.last_page ?? 1;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <main className="container mx-auto px-4 py-8">
      {/* Breadcrumbs */}
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/">Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Blog</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Page Header */}
      <header className="mb-12 text-center max-w-3xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
          Auction Articles & News
        </h1>
        <p className="text-base sm:text-lg text-muted-foreground">
          Stay informed with the latest auction news, expert guides, market trends,
          and collecting tips from Bidooze&apos;s team of specialists.
        </p>
      </header>

      {/* Error State */}
      {isError && (
        <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
          <div className="h-16 w-16 rounded-full bg-destructive/10 flex items-center justify-center">
            <AlertCircle className="h-8 w-8 text-destructive" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground mb-1">Failed to load articles</h2>
            <p className="text-sm text-muted-foreground max-w-sm">
              Something went wrong while fetching blog posts. Please check your connection and try again.
            </p>
          </div>
          <Button onClick={() => refetch()} variant="outline">
            Try again
          </Button>
        </div>
      )}

      {/* Loading Skeletons */}
      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <BlogCardSkeleton key={i} />
          ))}
        </div>
      )}

      {/* Blog Grid */}
      {!isLoading && !isError && (
        <>
          {posts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
              <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
                <Newspaper className="h-8 w-8 text-muted-foreground" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-foreground mb-1">No articles yet</h2>
                <p className="text-sm text-muted-foreground max-w-sm">
                  Check back soon — new articles are published regularly.
                </p>
              </div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts.map((post) => (
                  <BlogCard key={post.slug} post={post} />
                ))}
              </div>
              <BlogPagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </>
          )}
        </>
      )}
    </main>
  );
};

export default Blog;
