import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Package } from "lucide-react";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useHome } from "../hooks/useHome";

const formatHeroEndDate = (iso: string) => {
    const dt = new Date(iso);
    if (Number.isNaN(dt.getTime())) return "—";
    return dt.toLocaleString(undefined, {
        year: "numeric",
        month: "short",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
    });
};

const HeroCarousel = () => {
    const router = useRouter();
    const { useFeaturedHero } = useHome();
    const heroQuery = useFeaturedHero();

    const items = heroQuery.data?.data ?? [];

    return (
        <div className="container mx-auto px-4 py-8">
            {heroQuery.isLoading ? (
                <div className="h-[450px] sm:h-[500px] rounded-xl bg-muted animate-pulse" />
            ) : heroQuery.isError ? (
                <div className="h-[450px] sm:h-[500px] rounded-xl border border-border flex items-center justify-center">
                    <div className="text-center space-y-3 px-6">
                        <p className="text-sm text-muted-foreground">Couldn’t load featured auctions.</p>
                        <Button variant="outline" onClick={() => heroQuery.refetch()}>
                            Retry
                        </Button>
                    </div>
                </div>
            ) : items.length === 0 ? (
                <div className="h-[450px] sm:h-[500px] rounded-xl border border-border flex items-center justify-center">
                    <p className="text-sm text-muted-foreground">No live hero auctions right now.</p>
                </div>
            ) : (
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
                    {items.map((auction) => (
                        <CarouselItem key={auction.auction_id}>
                            <Card className="border-0 overflow-hidden shadow-xl">
                                <div
                                    onClick={() => router.push(`/auction/${auction.auction_id}`)}
                                    className="relative h-[450px] sm:h-[500px] group cursor-pointer"
                                >
                                    <Image
                                        src={auction.image_url}
                                        alt={auction.title}
                                        width={500}
                                        height={500}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-linear-to-t from-black/35 via-black/40 to-transparent" />
                                    <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-8 space-y-3 sm:space-y-4">
                                        <Badge className="bg-primary text-white">
                                            Live Auction
                                        </Badge>
                                        <h2 className="text-2xl sm:text-4xl font-bold text-white">
                                            {auction.title}
                                        </h2>
                                        <p className="text-base sm:text-lg text-white/80">
                                            {auction.auctioneer_company_name}
                                        </p>
                                        <div className="flex items-center gap-6 text-sm text-white/80">
                                            <div className="flex items-center gap-2">
                                                <Calendar className="h-4 w-4" />
                                                Ends {formatHeroEndDate(auction.end_datetime)}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Package className="h-4 w-4" />
                                                {auction.lot_count} Lots
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious className="left-2 sm:left-4" />
                <CarouselNext className="right-2 sm:right-4" />
            </Carousel>
            )}
        </div>
    );
};

export default HeroCarousel;
