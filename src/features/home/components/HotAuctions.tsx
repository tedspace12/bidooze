import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { TrendingUp, Share2, MapPin, Clock, Layers } from "lucide-react";
import Link from "next/link";
import SectionHeader from "@/components/shared/SectionHeader";
import { useRouter } from "next/navigation";
import { useHome } from "../hooks/useHome";
import {
  normalizeBuyerAuctionStatus,
  BUYER_AUCTION_LIFECYCLE_BADGES,
} from "@/lib/auctionLifecycle";
import ListingImage from "@/components/shared/listing-image";

/** Re-export for legacy demo sections that import `statusConfig` from this file. */
export { BUYER_AUCTION_LIFECYCLE_BADGES as statusConfig };

const formatDateRange = (startIso: string, endIso: string) => {
    const start = new Date(startIso);
    const end = new Date(endIso);
    const startOk = !Number.isNaN(start.getTime());
    const endOk = !Number.isNaN(end.getTime());
    const opts: Intl.DateTimeFormatOptions = { month: "short", day: "2-digit", year: "numeric" };
    if (!startOk && !endOk) return "—";
    if (!startOk) return `— - ${end.toLocaleDateString(undefined, opts)}`;
    if (!endOk) return `${start.toLocaleDateString(undefined, opts)} - —`;
    return `${start.toLocaleDateString(undefined, opts)} - ${end.toLocaleDateString(undefined, opts)}`;
};

const HotAuctions = () => {
    const router = useRouter();
    const { useHotAuctions } = useHome();
    const hotQuery = useHotAuctions();
    const items = hotQuery.data?.data ?? [];

    return (
        <div className="container mx-auto px-4 py-8 md:py-12 bg-secondary/20">
            <SectionHeader
                title={
                    <div className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                        <h2 className="text-2xl sm:text-3xl font-bold text-foreground">Hot Auctions</h2>
                    </div>
                }
                description="Trending auctions with the most competitive bidding"
                actionElement={
                    <Link href="/auctions">
                        <Button variant="outline">View All</Button>
                    </Link>
                }
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {hotQuery.isLoading ? (
                    Array.from({ length: 3 }).map((_, idx) => (
                        <div key={idx} className="h-[420px] rounded-xl bg-muted animate-pulse" />
                    ))
                ) : hotQuery.isError ? (
                    <div className="col-span-full rounded-xl border border-border p-6 flex items-center justify-between gap-4">
                        <p className="text-sm text-muted-foreground">Couldn’t load hot auctions.</p>
                        <Button variant="outline" onClick={() => hotQuery.refetch()}>
                            Retry
                        </Button>
                    </div>
                ) : items.length === 0 ? (
                    <div className="col-span-full rounded-xl border border-border p-6">
                        <p className="text-sm text-muted-foreground">No hot auctions right now.</p>
                    </div>
                ) : (
                    items.map((row) => {
                        const auction = row.auction;
                        const isRegistered = !!auction.registration_status;
                        const lifecycle = normalizeBuyerAuctionStatus(auction.status);
                        const statusInfo = BUYER_AUCTION_LIFECYCLE_BADGES[lifecycle];
                        return (
                            <Link key={auction.auction_id} href={`/auction/${auction.auction_id}`}>
                                <div className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-xl transition-all group">
                                    {/* Cover Image */}
                                    <div className="relative h-48 overflow-hidden">
                                        <ListingImage
                                            kind="auction"
                                            src={auction.image_url}
                                            alt={auction.title}
                                            width={500}
                                            height={500}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                        />
                                        <Badge className={`absolute top-3 left-3 ${statusInfo.className} text-[10px] md:text-xs py-px md:py-0.5`}>
                                            <TrendingUp className="h-3 w-3 mr-1" />
                                            {statusInfo.label}
                                        </Badge>
                                    </div>

                                    {/* Content */}
                                    <div className="p-3 md:p-5">
                                        <div className="flex items-start justify-between gap-3 mb-3">
                                            <h3 className="font-semibold text-lg text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                                                {auction.title}
                                            </h3>
                                            <button
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    navigator.share?.({
                                                        title: auction.title,
                                                        url: `/auction/${auction.auction_id}`,
                                                    });
                                                }}
                                                className="p-1.5 rounded-full hover:bg-muted transition-colors shrink-0"
                                            >
                                                <Share2 className="h-4 w-4 text-muted-foreground" />
                                            </button>
                                        </div>

                                        <div className="flex items-center gap-2 mb-3">
                                            <Avatar className="h-5 w-5">
                                                <AvatarImage src="" />
                                                <AvatarFallback>{auction.auctioneer_company_name?.[0] ?? "A"}</AvatarFallback>
                                            </Avatar>
                                            <span className="text-sm text-muted-foreground">{auction.auctioneer_company_name}</span>
                                        </div>

                                        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{auction.description}</p>

                                        <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-3">
                                            <Clock className="h-3.5 w-3.5" />
                                            {formatDateRange(auction.start_datetime, auction.end_datetime)}
                                        </div>

                                        <div className="flex flex-wrap gap-3 text-sm text-muted-foreground mb-4">
                                            <div className="flex items-center gap-1.5">
                                                <Layers className="h-3.5 w-3.5" />
                                                {auction.lot_count} Lots
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <MapPin className="h-3.5 w-3.5" />
                                                {auction.location}
                                            </div>
                                        </div>

                                        <div className="flex gap-3 pt-4 border-t border-border">
                                            <Button
                                                variant="outline"
                                                className="flex-1"
                                                size="sm"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    router.push(`/auction/${auction.auction_id}`);
                                                }}
                                            >
                                                View Catalog
                                            </Button>
                                            {lifecycle !== "closed" && (
                                            <Button
                                                className="flex-1"
                                                size="sm"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    if (isRegistered) {
                                                        router.push(`/auction/${auction.auction_id}`);
                                                        return;
                                                    }
                                                    router.push(`/auction/register?source=home-hot&id=${auction.auction_id}`);
                                                }}
                                            >
                                                Register to Bid
                                            </Button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default HotAuctions;
