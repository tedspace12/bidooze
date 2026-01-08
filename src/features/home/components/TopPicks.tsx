import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

const topPicks = [
    {
        id: 1,
        image: '/images/category-antiques.jpg',
        title: "Vintage Pocket Watch Collection",
        price: "$850",
        endTime: "3h 20m",
        bids: 3,
    },
    {
        id: 2,
        image: '/images/category-art.jpg',
        title: "Modern Canvas Art Set",
        price: "$1,200",
        endTime: "6h 45m",
        bids: 25,
    },
    {
        id: 3,
        image: '/images/category-cars.jpg',
        title: "2020 Porsche 911 Carrera",
        price: "$95,000",
        endTime: "2d 4h",
        bids: 10,
    },
    {
        id: 4,
        image: '/images/category-jewelry.jpg',
        title: "Diamond Tennis Bracelet",
        price: "$3,400",
        endTime: "1d 12h",
        bids: 8,
    },
    {
        id: 5,
        image: '/images/category-realestate.jpg',
        title: "Luxury Beach House",
        price: "$2,450,000",
        endTime: "5d 8h",
        bids: 100,
    },
    {
        id: 6,
        image: '/images/category-fashion.jpg',
        title: "Designer Handbag Collection",
        price: "$4,200",
        endTime: "4h 30m",
        bids: 9,
    },
    {
        id: 7,
        image: '/images/category-antiques.jpg',
        title: "Vintage Rolex Submariner",
        price: "$18,500",
        endTime: "2d 6h",
        bids: 200,
    },
    {
        id: 8,
        image: '/images/category-art.jpg',
        title: "Limited Edition Print Set",
        price: "$950",
        endTime: "7h 20m",
        bids: 2,
    },
];

const TopPicks = () => {
    const router = useRouter();

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-3xl font-bold text-foreground">Top Picks for You</h2>
                    <p className="text-muted-foreground mt-2">Personalized recommendations based on your interests</p>
                </div>
                <Button onClick={() => router.push('/bids?tab=top-picks')} variant="outline">View All</Button>
            </div>
            <Carousel className="w-full" opts={{ align: "start", loop: false }}>
                <CarouselContent className="-ml-4">
                    {topPicks.map((item) => (
                        <CarouselItem key={item.id} className="pl-4 md:basis-1/2 lg:basis-1/4">
                            <Link href={`/lot/${item.id}`}>
                                <Card className="overflow-hidden group cursor-pointer hover:shadow-lg transition-all">
                                    <div className="relative h-48 overflow-hidden">
                                        <Image
                                            src={item.image}
                                            alt={item.title}
                                            width={500}
                                            height={500}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                        />
                                        <button className="absolute top-3 right-3 p-2 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background transition-colors">
                                            <Eye className="h-3.5 w-3.5" />
                                        </button>
                                    </div>
                                    <div className="p-4 space-y-2">
                                        <h3 className="font-semibold text-sm line-clamp-1">{item.title}</h3>
                                        <p className="text-xs font-medium text-amber-600">{item.bids} Bids</p>
                                        <div className="flex items-center justify-between">
                                            <p className="text-lg font-bold text-primary">{item.price}</p>
                                            <Badge variant="secondary" className="text-xs">
                                                {item.endTime}
                                            </Badge>
                                        </div>
                                        {/* <Button size="sm" className="w-full">
                                            Quick Bid
                                        </Button> */}
                                    </div>
                                </Card>
                            </Link>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious className="left-0" />
                <CarouselNext className="right-0" />
            </Carousel>
        </div>
    );
};

export default TopPicks;
