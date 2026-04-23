import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { BlogListItem } from "../types";
import Link from "next/link";
import Image from "next/image";

interface RelatedPostsProps {
    posts: BlogListItem[];
}

const RelatedPosts = ({ posts }: RelatedPostsProps) => {
    if (posts.length === 0) return null;

    return (
        <section className="mt-10 sm:mt-16 pt-6 sm:pt-12 border-t border-border">
            <h2 className="text-2xl font-bold text-foreground mb-8">
                Recommended Articles
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {posts.map((post) => (
                    <Card key={post.slug} className="overflow-hidden group hover:shadow-md transition-shadow">
                        <Link href={`/blog/${post.slug}`}>
                            <div className="relative aspect-16/10 overflow-hidden">
                                <Image
                                    src={post.featured_image}
                                    alt={post.title}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                            </div>
                        </Link>
                        <CardContent className="p-4">
                            <Badge variant="secondary" className="mb-2 text-xs">
                                {post.category}
                            </Badge>
                            <Link href={`/blog/${post.slug}`}>
                                <h3 className="font-medium text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                                    {post.title}
                                </h3>
                            </Link>
                            <p className="text-xs text-muted-foreground mt-2">
                                {format(new Date(post.publish_date), "MMM d, yyyy")}
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </section>
    );
};

export default RelatedPosts;
