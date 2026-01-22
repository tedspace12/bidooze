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
import Link from "next/link";
import BlogCard from "./components/BlogCard";
import BlogPagination from "./components/BlogPagination";
import { blogPosts } from "./data/blogPosts";

const POSTS_PER_PAGE = 6;

const Blog = () => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(blogPosts.length / POSTS_PER_PAGE);
  const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
  const paginatedPosts = blogPosts.slice(startIndex, startIndex + POSTS_PER_PAGE);

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

        {/* Blog Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedPosts.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>

        {/* Pagination */}
        <BlogPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </main>
  );
};

export default Blog;
