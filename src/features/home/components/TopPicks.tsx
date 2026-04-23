import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import SectionHeader from "@/components/shared/SectionHeader";
import { Button } from "@/components/ui/button";
import { useHome } from "../hooks/useHome";
import ListingImage from "@/components/shared/listing-image";

const formatTimeLeft = (iso: string) => {
    const end = new Date(iso).getTime();
    if (Number.isNaN(end)) return "—";
    const diff = end - Date.now();
    if (diff <= 0) return "Ended";
    const mins = Math.floor(diff / 60000);
    const days = Math.floor(mins / (60 * 24));
    const hours = Math.floor((mins % (60 * 24)) / 60);
    const minutes = mins % 60;
    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
};

const TopPicks = () => {
    const router = useRouter();
    const { useRecommendations } = useHome();
    const recQuery = useRecommendations();
    const items = recQuery.data?.data ?? [];

    return (
        <div className="container mx-auto px-4 py-12">
            <SectionHeader
                title="Top Picks for You"
                description="Personalized recommendations based on your interests"
                actionLabel="View All"
                onAction={() => router.push('/bids?tab=top-picks')}
            />

            {recQuery.isLoading ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {Array.from({ length: 8 }).map((_, idx) => (
                        <div key={idx} className="h-60 rounded-xl bg-muted animate-pulse" />
                    ))}
                </div>
            ) : recQuery.isError ? (
                <div className="rounded-xl border border-border p-6 flex items-center justify-between gap-4">
                    <p className="text-sm text-muted-foreground">Couldn’t load recommendations.</p>
                    <Button variant="outline" onClick={() => recQuery.refetch()}>
                        Retry
                    </Button>
                </div>
            ) : items.length === 0 ? (
                <div className="rounded-xl border border-border p-6">
                    <p className="text-sm text-muted-foreground">No recommendations available.</p>
                </div>
            ) : (
                <Carousel className="w-full" opts={{ align: "start", loop: false }}>
                    <CarouselContent className="-ml-4">
                        {items.map((item) => {
                            const lot = item.lot;
                            const bidCount = item.stats?.bid_count ?? 0;
                            const currentBid = item.stats?.highest_bid;
                            return (
                                <CarouselItem key={lot.lot_id} className="pl-4 sm:basis-1/2 lg:basis-1/4">
                                    <Link href={`/lot/${lot.lot_id}?auctionId=${lot.auction_id}`} passHref>
                                        <Card className="overflow-hidden group cursor-pointer hover:shadow-lg transition-all">
                                            <div className="relative h-48 overflow-hidden">
                                                <ListingImage
                                                    kind="lot"
                                                    src={lot.image_url}
                                                    alt={lot.title}
                                                    width={500}
                                                    height={500}
                                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                />
                                                <button className="absolute top-3 right-3 p-2 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background transition-colors">
                                                    <Eye className="h-3.5 w-3.5" />
                                                </button>
                                            </div>
                                            <div className="p-3 md:p-4 space-y-2">
                                                <h3 className="font-semibold text-sm line-clamp-1">{lot.title}</h3>
                                                <p className="text-xs font-medium text-amber-600">{bidCount} Bids</p>
                                                <div className="flex items-center justify-between gap-2">
                                                    <p className="text-lg font-bold text-primary">
                                                        {currentBid == null ? "—" : `${lot.currency} ${currentBid}`}
                                                    </p>
                                                    <Badge variant="secondary" className="text-xs">
                                                        {item.timing?.time_remaining ?? formatTimeLeft(item.timing?.ends_at ?? "")}
                                                    </Badge>
                                                </div>
                                            </div>
                                        </Card>
                                    </Link>
                                </CarouselItem>
                            );
                        })}
                    </CarouselContent>
                    <CarouselPrevious className="left-0" />
                    <CarouselNext className="right-0" />
                </Carousel>
            )}
        </div>
    );
};

export default TopPicks;
