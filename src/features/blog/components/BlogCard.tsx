import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, Clock } from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";
import Image from "next/image";
import { BlogPost } from "../data/blogPosts";

interface BlogCardProps {
    post: BlogPost;
}

const BlogCard = ({ post }: BlogCardProps) => {
    return (
        <Card className="overflow-hidden group hover:shadow-lg transition-shadow duration-300">
            <Link href={`/blog/${post.slug}`}>
                <div className="relative aspect-16/10 overflow-hidden">
                    <Image
                        src={post.featuredImage}
                        alt={post.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                </div>
            </Link>
            <CardContent className="p-5">
                <Badge variant="secondary" className="mb-3">
                    {post.category}
                </Badge>
                <Link href={`/blog/${post.slug}`}>
                    <h3 className="font-semibold text-lg text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                        {post.title}
                    </h3>
                </Link>
                <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                    {post.excerpt}
                </p>

                <div className="flex items-center gap-3 mb-4">
                    <Avatar className="h-8 w-8">
                        <AvatarImage src={post.author.avatar} alt={post.author.name} />
                        <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">
                            {post.author.name}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                            {post.author.role}
                        </p>
                    </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-border">
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                            <Calendar className="h-3.5 w-3.5" />
                            {format(new Date(post.publishDate), "MMM d, yyyy")}
                        </span>
                        <span className="flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5" />
                            {post.readTime}
                        </span>
                    </div>
                    <Button variant="link" size="sm" asChild className="p-0 h-auto">
                        <Link href={`/blog/${post.slug}`}>Read more</Link>
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};

export default BlogCard;
