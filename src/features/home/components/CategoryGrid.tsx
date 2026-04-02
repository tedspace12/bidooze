import { Card } from "@/components/ui/card";
import Image from "next/image";
import { useRouter } from "next/navigation";
import SectionHeader from "@/components/shared/SectionHeader";
import { Button } from "@/components/ui/button";
import { useHome } from "../hooks/useHome";
import {
    buildAuctionCategoryHref,
    fallbackAuctionCategories,
} from "@/lib/publicAuctionCategories";

const CategoryGrid = () => {
    const router = useRouter();
    const { useCategories } = useHome();
    const catQuery = useCategories();
    const categories = catQuery.data?.data ?? [];
    const displayCategories = categories.length > 0 ? categories : fallbackAuctionCategories;

    return (
        <div className="container mx-auto px-4 py-8 md:py-12 bg-secondary/20">
            <SectionHeader
                title="Find Auctions by Category"
                description="Browse thousands of items across popular categories"
                actionLabel="View All Categories"
                onAction={() => router.push('/auctions')}
            />
            {catQuery.isLoading ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {Array.from({ length: 6 }).map((_, idx) => (
                        <div key={idx} className="aspect-square rounded-xl bg-muted animate-pulse" />
                    ))}
                </div>
            ) : catQuery.isError ? (
                <div className="rounded-xl border border-border p-6 flex items-center justify-between gap-4">
                    <p className="text-sm text-muted-foreground">Couldn’t load categories.</p>
                    <Button variant="outline" onClick={() => catQuery.refetch()}>
                        Retry
                    </Button>
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {displayCategories.map((category) => (
                        <Card
                            key={category.id}
                            className="overflow-hidden group cursor-pointer hover:shadow-lg transition-all"
                        >
                            <div
                                onClick={() =>
                                    router.push(buildAuctionCategoryHref(category.slug))
                                }
                                className="relative aspect-square overflow-hidden"
                            >
                                <Image
                                    src={category.image_url}
                                    alt={category.name}
                                    width={500}
                                    height={500}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-linear-to-t from-background/90 via-background/10 to-transparent" />
                                <div className="absolute bottom-0 left-0 right-0 p-4">
                                    <h3 className="font-semibold text-sm text-foreground mb-1">
                                        {category.name}
                                    </h3>
                                    <p className="text-xs text-foreground">
                                        {category.published_auctions_count} auctions
                                    </p>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CategoryGrid;
