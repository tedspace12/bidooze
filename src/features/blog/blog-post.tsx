'use client';

import { JSX } from "react";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, Clock, AlertCircle, FileX } from "lucide-react";
import { format } from "date-fns";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import ShareButtons from "./components/ShareButtons";
import ArticleNavigation from "./components/ArticleNavigation";
import RelatedPosts from "./components/RelatedPosts";
import { useBlog } from "./hooks/useBlog";

const BlogPostSkeleton = () => (
    <main className="container mx-auto px-4 py-8">
        {/* Breadcrumb skeleton */}
        <div className="flex items-center gap-2 mb-6">
            <div className="h-4 w-10 bg-muted animate-pulse rounded" />
            <div className="h-4 w-2 bg-muted animate-pulse rounded" />
            <div className="h-4 w-10 bg-muted animate-pulse rounded" />
            <div className="h-4 w-2 bg-muted animate-pulse rounded" />
            <div className="h-4 w-36 bg-muted animate-pulse rounded" />
        </div>
        <div className="max-w-4xl mx-auto">
            {/* Hero image */}
            <div className="aspect-6/3 sm:aspect-21/9 w-full rounded-xl bg-muted animate-pulse mb-6 sm:mb-8" />
            {/* Badge */}
            <div className="h-6 w-20 bg-muted animate-pulse rounded-full mb-4" />
            {/* Title */}
            <div className="h-9 w-3/4 bg-muted animate-pulse rounded mb-3" />
            <div className="h-9 w-1/2 bg-muted animate-pulse rounded mb-6" />
            {/* Author + meta row */}
            <div className="flex items-center justify-between pb-6 border-b border-border mb-8">
                <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-muted animate-pulse" />
                    <div className="space-y-1.5">
                        <div className="h-4 w-28 bg-muted animate-pulse rounded" />
                        <div className="h-3 w-36 bg-muted animate-pulse rounded" />
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="h-4 w-28 bg-muted animate-pulse rounded" />
                    <div className="h-4 w-20 bg-muted animate-pulse rounded" />
                </div>
            </div>
            {/* Content lines */}
            <div className="space-y-3">
                {Array.from({ length: 10 }).map((_, i) => (
                    <div
                        key={i}
                        className={`h-4 bg-muted animate-pulse rounded ${i % 5 === 4 ? "w-2/3" : "w-full"}`}
                    />
                ))}
            </div>
        </div>
    </main>
);

const BlogPost = () => {
    const { slug } = useParams<{ slug: string }>();

    const { useBlogDetail, useRelatedBlogs } = useBlog(slug);
    const { data: postData, isLoading, isError, refetch } = useBlogDetail();
    const post = postData?.data;

    const { data: relatedPosts } = useRelatedBlogs(post?.category);

    if (isLoading) {
        return <BlogPostSkeleton />;
    }

    if (isError) {
        return (
            <main className="container mx-auto px-4 py-8">
                <div className="flex flex-col items-center justify-center py-32 gap-4 text-center">
                    <div className="h-16 w-16 rounded-full bg-destructive/10 flex items-center justify-center">
                        <AlertCircle className="h-8 w-8 text-destructive" />
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold text-foreground mb-1">Failed to load article</h2>
                        <p className="text-sm text-muted-foreground max-w-sm">
                            Something went wrong while fetching this article. Please check your connection and try again.
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button onClick={() => refetch()} variant="outline">
                            Try again
                        </Button>
                        <Button asChild variant="ghost">
                            <Link href="/blog">Back to Blog</Link>
                        </Button>
                    </div>
                </div>
            </main>
        );
    }

    if (!post) {
        return (
            <main className="container mx-auto px-4 py-8">
                <div className="flex flex-col items-center justify-center py-32 gap-4 text-center">
                    <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
                        <FileX className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold text-foreground mb-1">Article not found</h2>
                        <p className="text-sm text-muted-foreground max-w-sm">
                            The article you&apos;re looking for doesn&apos;t exist or may have been removed.
                        </p>
                    </div>
                    <Button asChild variant="outline">
                        <Link href="/blog">Back to Blog</Link>
                    </Button>
                </div>
            </main>
        );
    }

    // Simple markdown-like content rendering
    const renderContent = (content: string) => {
        const lines = content.trim().split("\n");
        const elements: JSX.Element[] = [];
        let listItems: string[] = [];
        let inList = false;
        let listType: "ul" | "ol" = "ul";
        let key = 0;

        const flushList = () => {
            if (listItems.length > 0) {
                const ListTag = listType;
                elements.push(
                    <ListTag key={key++} className={`${listType === "ol" ? "list-decimal" : "list-disc"} list-inside space-y-2 my-4 text-muted-foreground`}>
                        {listItems.map((item, i) => (
                            <li key={i}>{item}</li>
                        ))}
                    </ListTag>
                );
                listItems = [];
                inList = false;
            }
        };

        lines.forEach((line) => {
            const trimmedLine = line.trim();

            if (trimmedLine.startsWith("## ")) {
                flushList();
                elements.push(
                    <h2 key={key++} className="text-2xl font-bold text-foreground mt-5 sm:mt-8 mb-4">
                        {trimmedLine.replace("## ", "")}
                    </h2>
                );
            } else if (trimmedLine.startsWith("### ")) {
                flushList();
                elements.push(
                    <h3 key={key++} className="text-xl font-semibold text-foreground mt-6 mb-3">
                        {trimmedLine.replace("### ", "")}
                    </h3>
                );
            } else if (trimmedLine.startsWith("> ")) {
                flushList();
                elements.push(
                    <blockquote key={key++} className="border-l-4 border-primary pl-4 py-2 my-6 italic text-muted-foreground bg-muted/30 rounded-r-lg">
                        {trimmedLine.replace("> ", "").replace(/"/g, "")}
                    </blockquote>
                );
            } else if (trimmedLine.startsWith("- ")) {
                if (!inList || listType !== "ul") {
                    flushList();
                    inList = true;
                    listType = "ul";
                }
                listItems.push(trimmedLine.replace("- ", "").replace(/\*\*/g, ""));
            } else if (/^\d+\.\s/.test(trimmedLine)) {
                if (!inList || listType !== "ol") {
                    flushList();
                    inList = true;
                    listType = "ol";
                }
                listItems.push(trimmedLine.replace(/^\d+\.\s/, "").replace(/\*\*/g, ""));
            } else if (trimmedLine.startsWith("**") && trimmedLine.endsWith("**")) {
                flushList();
                elements.push(
                    <p key={key++} className="font-semibold text-foreground my-4">
                        {trimmedLine.replace(/\*\*/g, "")}
                    </p>
                );
            } else if (trimmedLine.length > 0 && !trimmedLine.startsWith("|")) {
                flushList();
                elements.push(
                    <p key={key++} className="text-muted-foreground leading-relaxed my-4">
                        {trimmedLine.replace(/\*\*/g, "")}
                    </p>
                );
            }
        });

        flushList();
        return elements;
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
                        <BreadcrumbLink asChild>
                            <Link href="/blog">Blog</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage className="max-w-50 truncate">
                            {post.title}
                        </BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <article className="max-w-4xl mx-auto">
                {/* Hero Image */}
                <div className="relative aspect-6/3 sm:aspect-21/9 rounded-xl overflow-hidden mb-6 sm:mb-8">
                    <Image
                        src={post.featured_image}
                        alt={post.title}
                        fill
                        className="object-cover"
                    />
                </div>

                {/* Article Header */}
                <header className="mb-8">
                    <Badge variant="secondary" className="mb-4">
                        {post.category}
                    </Badge>
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-5 sm:mb-6">
                        {post.title}
                    </h1>

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-5 sm:pb-6 border-b border-border">
                        <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10 sm:h-12 sm:w-12">
                                <AvatarImage src={post.author.avatar} alt={post.author.name} />
                                <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="text-sm sm:text-base font-medium text-foreground">{post.author.name}</p>
                                <p className="text-xs sm:text-sm text-muted-foreground">{post.author.role}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 text-xs sm:text-sm text-muted-foreground">
                            <span className="flex items-center gap-1.5">
                                <Calendar className="h-4 w-4" />
                                {format(new Date(post.publish_date), "MMMM d, yyyy")}
                            </span>
                            <span className="flex items-center gap-1.5">
                                <Clock className="h-4 w-4" />
                                {post.read_time}
                            </span>
                        </div>
                    </div>
                </header>

                {/* Article Content */}
                <div className="prose prose-lg max-w-none">
                    {renderContent(post.content)}
                </div>

                {/* Tags */}
                {post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-8 pt-6 border-t border-border">
                        {post.tags.map((tag) => (
                            <Badge key={tag} variant="outline">
                                {tag}
                            </Badge>
                        ))}
                    </div>
                )}

                {/* Share Buttons */}
                <div className="mt-8 pt-6 border-t border-border">
                    <ShareButtons title={post.title} />
                </div>

                {/* Article Navigation */}
                <ArticleNavigation prevPost={null} nextPost={null} />

                {/* Related Posts */}
                <RelatedPosts posts={relatedPosts ?? []} />
            </article>
        </main>
    );
};

export default BlogPost;
