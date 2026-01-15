import { Card } from "@/components/ui/card";
import Image from "next/image";
import { useRouter } from "next/navigation";
import SectionHeader from "@/components/shared/SectionHeader";

const categories = [
    { id: 1, name: "Antiques & Collectibles", image: '/images/category-antiques.jpg', count: 1240 },
    { id: 2, name: "Art", image: '/images/category-art.jpg', count: 856 },
    { id: 3, name: "Cars & Vehicles", image: '/images/category-cars.jpg', count: 423 },
    { id: 4, name: "Jewelry & Watches", image: '/images/category-jewelry.jpg', count: 1567 },
    { id: 5, name: "Real Estate", image: '/images/category-realestate.jpg', count: 234 },
    { id: 6, name: "Fashion", image: '/images/category-fashion.jpg', count: 789 },
];

const CategoryGrid = () => {
    const router = useRouter();

    return (
        <div className="container mx-auto px-4 py-8 md:py-12 bg-secondary/20">
            <SectionHeader
                title="Find Auctions by Category"
                description="Browse thousands of items across popular categories"
                actionLabel="View All Categories"
                onAction={() => router.push('/auctions')}
            />
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {categories.map((category) => (
                    <Card
                        key={category.id}
                        className="overflow-hidden group cursor-pointer hover:shadow-lg transition-all"
                    >
                        <div onClick={() => router.push('/auctions' + `?category=${encodeURIComponent(category.name)}`)} className="relative aspect-square overflow-hidden">
                            <Image
                                src={category.image}
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
                                <p className="text-xs text-foreground">{category.count} auctions</p>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default CategoryGrid;
