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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, Clock } from "lucide-react";
import { format } from "date-fns";
import { useParams } from "next/navigation";
import { getAdjacentPosts, getPostBySlug, getRelatedPosts } from "./data/blogPosts";
import Link from "next/link";
import Image from "next/image";
import ShareButtons from "./components/ShareButtons";
import ArticleNavigation from "./components/ArticleNavigation";
import RelatedPosts from "./components/RelatedPosts";

const BlogPost = () => {
    const { slug } = useParams<{ slug: string }>();

    const post = slug ? getPostBySlug(slug) : undefined;

    if (!post) {
        return;
    }

    const relatedPosts = getRelatedPosts(post.slug, 3);
    const { prev, next } = getAdjacentPosts(post.slug);

    // Simple markdown-like content rendering
    const renderContent = (content: string) => {
        const lines = content.trim().split("\n");
        const elements: JSX.Element[] = [];
        let listItems: string[] = [];
        let inList = false;
        let listType: "ul" | "ol" = "ul";

        const flushList = () => {
            if (listItems.length > 0) {
                const ListTag = listType;
                elements.push(
                    <ListTag key={elements.length} className={`${listType === "ol" ? "list-decimal" : "list-disc"} list-inside space-y-2 my-4 text-muted-foreground`}>
                        {listItems.map((item, i) => (
                            <li key={i}>{item}</li>
                        ))}
                    </ListTag>
                );
                listItems = [];
                inList = false;
            }
        };

        lines.forEach((line, index) => {
            const trimmedLine = line.trim();

            // Headers
            if (trimmedLine.startsWith("## ")) {
                flushList();
                elements.push(
                    <h2 key={index} className="text-2xl font-bold text-foreground mt-5 sm:mt-8 mb-4">
                        {trimmedLine.replace("## ", "")}
                    </h2>
                );
            } else if (trimmedLine.startsWith("### ")) {
                flushList();
                elements.push(
                    <h3 key={index} className="text-xl font-semibold text-foreground mt-6 mb-3">
                        {trimmedLine.replace("### ", "")}
                    </h3>
                );
            }
            // Blockquotes
            else if (trimmedLine.startsWith("> ")) {
                flushList();
                elements.push(
                    <blockquote key={index} className="border-l-4 border-primary pl-4 py-2 my-6 italic text-muted-foreground bg-muted/30 rounded-r-lg">
                        {trimmedLine.replace("> ", "").replace(/"/g, "")}
                    </blockquote>
                );
            }
            // Unordered lists
            else if (trimmedLine.startsWith("- ")) {
                if (!inList || listType !== "ul") {
                    flushList();
                    inList = true;
                    listType = "ul";
                }
                listItems.push(trimmedLine.replace("- ", "").replace(/\*\*/g, ""));
            }
            // Ordered lists
            else if (/^\d+\.\s/.test(trimmedLine)) {
                if (!inList || listType !== "ol") {
                    flushList();
                    inList = true;
                    listType = "ol";
                }
                listItems.push(trimmedLine.replace(/^\d+\.\s/, "").replace(/\*\*/g, ""));
            }
            // Bold text paragraphs
            else if (trimmedLine.startsWith("**") && trimmedLine.endsWith("**")) {
                flushList();
                elements.push(
                    <p key={index} className="font-semibold text-foreground my-4">
                        {trimmedLine.replace(/\*\*/g, "")}
                    </p>
                );
            }
            // Regular paragraphs
            else if (trimmedLine.length > 0 && !trimmedLine.startsWith("|")) {
                flushList();
                elements.push(
                    <p key={index} className="text-muted-foreground leading-relaxed my-4">
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
                        <BreadcrumbPage className="max-w-[200px] truncate">
                            {post.title}
                        </BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <article className="max-w-4xl mx-auto">
                {/* Hero Image */}
                <div className="relative aspect-6/3 sm:aspect-21/9 rounded-xl overflow-hidden mb-6 sm:mb-8">
                    <Image
                        src={post.featuredImage}
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
                                {format(new Date(post.publishDate), "MMMM d, yyyy")}
                            </span>
                            <span className="flex items-center gap-1.5">
                                <Clock className="h-4 w-4" />
                                {post.readTime}
                            </span>
                        </div>
                    </div>
                </header>

                {/* Article Content */}
                <div className="prose prose-lg max-w-none">
                    {renderContent(post.content)}
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mt-8 pt-6 border-t border-border">
                    {post.tags.map((tag) => (
                        <Badge key={tag} variant="outline">
                            {tag}
                        </Badge>
                    ))}
                </div>

                {/* Share Buttons */}
                <div className="mt-8 pt-6 border-t border-border">
                    <ShareButtons title={post.title} />
                </div>

                {/* Article Navigation */}
                <ArticleNavigation prevPost={prev} nextPost={next} />

                {/* Related Posts */}
                <RelatedPosts posts={relatedPosts} />
            </article>
        </main>
    );
};

export default BlogPost;
