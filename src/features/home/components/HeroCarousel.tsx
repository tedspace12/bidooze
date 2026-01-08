import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Package } from "lucide-react";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";
import { useRouter } from "next/navigation";

const liveAuctions = [
    {
        id: 1,
        image: '/images/hero-auction-1.jpg',
        title: "Luxury Antique Furniture Collection",
        auctioneer: "Heritage Auctions",
        endDate: "Dec 28, 2025 - 3:00 PM",
        lotCount: 124,
    },
    {
        id: 2,
        image: '/images/hero-auction-2.jpg',
        title: "Classic & Vintage Automobiles",
        auctioneer: "Barrett-Jackson",
        endDate: "Dec 30, 2025 - 5:00 PM",
        lotCount: 87,
    },
    {
        id: 3,
        image: '/images/hero-auction-3.jpg',
        title: "Contemporary Art Masterpieces",
        auctioneer: "Sotheby's",
        endDate: "Jan 2, 2026 - 2:00 PM",
        lotCount: 56,
    },
];

const HeroCarousel = () => {
    const router = useRouter();

    return (
        <div className="container mx-auto px-4 py-8">
            <Carousel
                className="w-full"
                opts={{ loop: true }}
                plugins={[
                    Autoplay({
                        delay: 5000,
                    }),
                ]}
            >
                <CarouselContent>
                    {liveAuctions.map((auction) => (
                        <CarouselItem key={auction.id}>
                            <Card className="border-0 overflow-hidden shadow-xl">
                                <div onClick={() => router.push('/auction/id')} className="relative h-[500px] group cursor-pointer">
                                    <Image
                                        src={auction.image}
                                        alt={auction.title}
                                        width={500}
                                        height={500}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-linear-to-t from-black/35 via-black/40 to-transparent" />
                                    <div className="absolute bottom-0 left-0 right-0 p-8 space-y-4">
                                        <Badge className="bg-primary text-white">
                                            Live Auction
                                        </Badge>
                                        <h2 className="text-4xl font-bold text-white">
                                            {auction.title}
                                        </h2>
                                        <p className="text-lg text-white/80">
                                            {auction.auctioneer}
                                        </p>
                                        <div className="flex items-center gap-6 text-sm text-white/80">
                                            <div className="flex items-center gap-2">
                                                <Calendar className="h-4 w-4" />
                                                {auction.endDate}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Package className="h-4 w-4" />
                                                {auction.lotCount} Lots
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious className="left-4" />
                <CarouselNext className="right-4" />
            </Carousel>
        </div>
    );
};

export default HeroCarousel;
