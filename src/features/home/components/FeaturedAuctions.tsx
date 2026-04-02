import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Eye } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import SectionHeader from "@/components/shared/SectionHeader";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useHome } from "../hooks/useHome";

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

const FeaturedAuctions = () => {
    const router = useRouter();
    const { useFeaturedAuctions } = useHome();
    const featuredQuery = useFeaturedAuctions();
    const slots = featuredQuery.data?.data ?? [];

    return (
        <div className="container mx-auto px-4 py-8 sm:py-12">
            <SectionHeader
                title="Featured Auctions"
                description="Featured auctions to explore right now"
                actionLabel="View All"
                onAction={() => router.push('/auctions')}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredQuery.isLoading ? (
                    Array.from({ length: 6 }).map((_, idx) => (
                        <div key={idx} className="h-[320px] rounded-xl bg-muted animate-pulse" />
                    ))
                ) : featuredQuery.isError ? (
                    <div className="col-span-full rounded-xl border border-border p-6 flex items-center justify-between gap-4">
                        <p className="text-sm text-muted-foreground">Couldn’t load featured auctions.</p>
                        <Button variant="outline" onClick={() => featuredQuery.refetch()}>
                            Retry
                        </Button>
                    </div>
                ) : slots.length === 0 ? (
                    <div className="col-span-full rounded-xl border border-border p-6">
                        <p className="text-sm text-muted-foreground">No featured auctions available.</p>
                    </div>
                ) : (
                    slots.map((slot) => {
                        const auction = slot.auction;
                        const bidCount = auction.stats?.bid_count ?? 0;
                        const currentBid = auction.stats?.current_bid;
                        return (
                            <Link key={slot.slot_id} href={`/auction/${auction.auction_id}`}>
                                <Card className="overflow-hidden group cursor-pointer hover:shadow-xl transition-all">
                                    <div className="relative h-52 md:h-64 overflow-hidden">
                                        <Image
                                            src={auction.image_url}
                                            alt={auction.title}
                                            width={500}
                                            height={500}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                        />
                                        <button
                                            onClick={(e) => {
                                                e.preventDefault();
                                                router.push(`/auction/${auction.auction_id}`);
                                            }}
                                            className="absolute top-4 right-4 p-2 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background transition-colors"
                                        >
                                            <Eye className="h-3.5 w-3.5 md:h-4 md:w-4" />
                                        </button>
                                    </div>
                                    <div className="p-3 md:p-5 space-y-2 md:space-y-3">
                                        <h3 className="font-semibold text-base md:text-lg line-clamp-1">
                                            {auction.title}
                                        </h3>
                                        <div className="flex items-center justify-between gap-3">
                                            <div>
                                                <p className="text-xs md:text-sm text-muted-foreground">Current Bid</p>
                                                <p className="text-lg md:text-xl font-bold text-primary">
                                                    {currentBid == null ? "—" : `${auction.currency} ${currentBid}`}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <div className="flex items-center justify-end gap-1 text-xs md:text-sm text-muted-foreground">
                                                    <Clock className="h-3.5 w-3.5" />
                                                    {formatTimeLeft(auction.end_datetime)}
                                                </div>
                                                <Badge variant="secondary" className="mt-1">
                                                    {bidCount} bids
                                                </Badge>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            </Link>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default FeaturedAuctions;
