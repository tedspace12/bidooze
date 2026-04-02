import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, ArrowRight, Eye } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import SectionHeader from "@/components/shared/SectionHeader";
import { useQuery } from "@tanstack/react-query";
import { auctionService } from "@/features/auction/services/auctionService";

interface RelatedLotsProps {
    auctionId: string;
    currentLotId: number;
}

const RelatedLots = ({ auctionId, currentLotId }: RelatedLotsProps) => {
    const router = useRouter();

    const { data, isLoading } = useQuery({
        queryKey: ["auction-lots-related", auctionId],
        queryFn: () => auctionService.getAuctionLots(auctionId),
        enabled: !!auctionId,
    });

    const lots =
        data?.data?.filter((l) => l.id !== currentLotId).slice(0, 8) ?? [];

    const currency = data?.meta?.currency ?? "USD";
    const formatMoney = (n: number) =>
        new Intl.NumberFormat(undefined, {
            style: "currency",
            currency,
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(n);

    return (
        <section className="mt-12">
            <SectionHeader
                title="Other Lots in This Auction"
                description="Explore more items from this collection"
                actionElement={
                    <Button
                        onClick={() => router.push(`/auction/${auctionId}`)}
                        variant="outline"
                        className="gap-2"
                    >
                        View Full Catalog
                        <ArrowRight className="h-4 w-4" />
                    </Button>
                }
            />

            {isLoading ? (
                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div
                            key={i}
                            className="h-64 rounded-xl bg-muted animate-pulse"
                        />
                    ))}
                </div>
            ) : lots.length === 0 ? (
                <p className="mt-6 text-sm text-muted-foreground">
                    No other lots in this auction.
                </p>
            ) : (
                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {lots.map((lot) => (
                        <Link
                            key={lot.id}
                            href={`/lot/${lot.id}?auctionId=${encodeURIComponent(auctionId)}`}
                        >
                            <Card className="group overflow-hidden border-border hover:border-primary/50 transition-all hover:shadow-lg">
                                <div className="relative aspect-6/3 md:aspect-4/3 overflow-hidden">
                                    <Image
                                        src={lot.image_url}
                                        alt={lot.title}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                    <Badge className="absolute top-3 left-3 bg-background/90 text-foreground text-[10px] md:text-xs py-px md:py-0.5">
                                        <Clock className="h-3 w-3 mr-1" />
                                        Lot {lot.lot_number}
                                    </Badge>
                                    <Button
                                        variant="secondary"
                                        size="icon"
                                        className="absolute top-3 right-3 h-6 w-6 md:h-8 md:w-8 opacity-0 group-hover:opacity-100 transition-opacity bg-background/90"
                                    >
                                        <Eye className="h-3 w-3 md:h-4 md:w-4" />
                                    </Button>
                                </div>
                                <CardContent className="p-3 md:p-4">
                                    <h3 className="text-sm md:text-base font-semibold text-foreground line-clamp-2 mb-2 group-hover:text-primary transition-colors">
                                        {lot.title}
                                    </h3>
                                    <p className="text-xs font-medium text-amber-600 mb-2">
                                        {lot.total_bids_count} bids
                                    </p>
                                    <p className="text-base md:text-lg font-bold text-primary">
                                        {lot.current_bid != null
                                            ? formatMoney(Number(lot.current_bid))
                                            : "—"}
                                    </p>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>
            )}
        </section>
    );
};

export default RelatedLots;
