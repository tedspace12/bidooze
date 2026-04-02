import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    Share2,
    MapPin,
    Truck,
    Package,
    Clock,
    Layers,
    AlertCircle,
    CheckCircle,
    Building2
} from "lucide-react";
import { useState, useEffect } from "react";
import { format } from "date-fns";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AuctionCardStatus } from "../types";
import { cn } from "@/lib/utils";
import { isClosingSoon } from "@/lib/auctionLifecycle";

const formatDateWithOrdinal = (date: Date) => {
    const day = date.getDate();
    const suffix = ["th", "st", "nd", "rd"][day % 10 > 3 ? 0 : (day % 100 - day % 10 !== 10 ? day % 10 : 0)];
    return `${day}${suffix} ${format(date, "MMMM yyyy")}`;
};

interface Auction {
    id: string;
    title: string;
    coverImage: string;
    auctioneer: { name: string; avatar?: string | null };
    totalLots: number;
    startDate: string;
    endDate: string;
    description: string;
    lotImages: string[];
    status: AuctionCardStatus;
    shippingAvailable: boolean;
    location: string;
    notices?: string;
}

interface AuctionCardProps {
    auction: Auction;
    isRegistered?: boolean;
    viewMode?: 'list' | 'grid';
    page?: 'auctions' | 'regular';
}

const statusConfig: Record<
    AuctionCardStatus,
    { label: string; className: string }
> = {
    scheduled: { label: "Upcoming", className: "bg-blue-500 text-white" },
    live: { label: "Bidding Open", className: "bg-emerald-500 text-white" },
    paused: { label: "Paused", className: "bg-amber-500 text-white" },
    closed: { label: "Closed", className: "bg-muted text-muted-foreground" },
};

const AuctionCard = ({ auction, isRegistered = false, viewMode = 'list', page = 'regular' }: AuctionCardProps) => {
    const [countdown, setCountdown] = useState("");
    const router = useRouter();
    const showClosingSoon = isClosingSoon(auction.status, auction.endDate);

    useEffect(() => {
        if (!showClosingSoon) return;

        const updateCountdown = () => {
            const endTime = new Date(auction.endDate).getTime();
            const now = Date.now();
            const diff = endTime - now;

            if (diff <= 0) {
                setCountdown("Ended");
                return;
            }

            const hours = Math.floor(diff / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);
            setCountdown(`${hours}h ${minutes}m ${seconds}s`);
        };

        updateCountdown();
        const interval = setInterval(updateCountdown, 1000);
        return () => clearInterval(interval);
    }, [showClosingSoon, auction.endDate]);

    const handleShare = () => {
        navigator.share?.({
            title: auction.title,
            url: `/auction/${auction.id}`,
        });
    };

    const handleRegisterClick = (e: React.MouseEvent) => {
        e.preventDefault();
        if (!isRegistered) {
            router.push(`/auction/register?source=auction&id=${auction.id}`);
        }
    };

    return (
        <div className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg transition-shadow">
            <div className={cn("flex flex-col xl:flex-row",
                // viewMode === 'grid' && 'md:flex-col',
                viewMode === 'list' && 'md:flex-row',
                page === 'auctions' && viewMode === 'grid' && 'xl:flex-col'
            )}>
                {/* Cover Image */}
                <div className={cn(
                    "relative xl:w-80 shrink-0",
                    viewMode === "list" && "md:w-72 lg:w-80",
                    page === 'auctions' && viewMode === 'grid' && "xl:w-full",
                    // viewMode === "list"
                    //     ? "md:w-72 lg:w-80"
                    //     : "w-full"
                )}>
                    <div className={cn(
                        "overflow-hidden aspect-6/3 md:aspect-4/3 lg:aspect-6/3 xl:aspect-auto lg:h-full",
                        viewMode === "list" && "md:aspect-auto lg:aspect-auto md:h-full",
                        page === 'auctions' && viewMode === 'grid' && "xl:aspect-6/3 xl:h-auto"
                        // viewMode === "list"
                        //     ? "aspect-6/3 md:aspect-auto md:h-full"
                        //     : "aspect-6/3"
                    )}>
                        <Image
                            src={auction.coverImage}
                            alt={auction.title}
                            width={500}
                            height={500}
                            className="w-full h-full object-cover"
                        />
                        {(() => {
                            const statusInfo = statusConfig[auction.status];
                            return (
                                <Badge className={`absolute top-3 left-3 ${statusInfo.className} text-[10px] md:text-xs py-px md:py-0.5`}>
                                    {statusInfo.label}
                                </Badge>
                            );
                        })()}
                        {showClosingSoon && countdown && (
                            <div className="absolute bottom-3 left-3 bg-background/90 backdrop-blur-sm px-3 py-1.5 rounded-lg">
                                <div className="flex items-center gap-1.5 text-xs md:text-sm font-medium text-foreground">
                                    <Clock className="h-3.5 w-3.5 text-amber-500" />
                                    {countdown}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 p-3 md:p-5 flex flex-col">
                    <div className="flex items-start justify-between gap-4 mb-3">
                        <div className="flex-1">
                            <h3 className="text-base md:text-lg font-semibold text-foreground mb-1 line-clamp-1">
                                {auction.title}
                            </h3>
                            <div className="flex items-center gap-2">
                                <Avatar className="h-5 w-5">
                                    {auction.auctioneer.avatar ? (
                                        <AvatarImage src={auction.auctioneer.avatar} />
                                    ) : null}
                                    <AvatarFallback>
                                        <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
                                    </AvatarFallback>
                                </Avatar>
                                <span className="text-xs md:text-sm text-muted-foreground">{auction.auctioneer.name}</span>
                            </div>
                        </div>
                        <Button variant="ghost" size="icon" onClick={handleShare} className="shrink-0">
                            <Share2 className="h-4 w-4" />
                        </Button>
                    </div>

                    <p className="text-xs md:text-sm text-muted-foreground line-clamp-2 mb-4">{auction.description}</p>

                    {/* Date Range */}
                    <div className="text-xs md:text-sm text-muted-foreground mb-3">
                        {formatDateWithOrdinal(new Date(auction.startDate))} - {formatDateWithOrdinal(new Date(auction.endDate))}
                    </div>

                    {/* Meta Info */}
                    <div className="flex flex-wrap gap-4 mb-4 text-xs md:text-sm">
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                            <Layers className="h-3.5 w-3.5" />
                            <span>{auction.totalLots} Lots</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                            <MapPin className="h-3.5 w-3.5" />
                            <span className="truncate">{auction.location}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                            {auction.shippingAvailable ? (
                                <>
                                    <Truck className="h-3.5 w-3.5" />
                                    <span>Shipping</span>
                                </>
                            ) : (
                                <>
                                    <Package className="h-3.5 w-3.5" />
                                    <span>Pickup Only</span>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Lot Preview */}
                    <div className="flex items-center gap-2 mb-4">
                        <span className="text-xs text-muted-foreground">Featured lots:</span>
                        <div className="flex -space-x-2">
                            {auction.lotImages.map((img, idx) => (
                                <Image
                                    key={idx}
                                    src={img}
                                    alt={`Lot preview ${idx + 1}`}
                                    width={500}
                                    height={500}
                                    className="h-10 w-10 rounded-lg object-cover border-2 border-background"
                                />
                            ))}
                        </div>
                    </div>

                    {/* Notices */}
                    {auction.notices && (
                        <div className="flex items-start gap-2 p-3 bg-muted/50 rounded-lg mb-4">
                            <AlertCircle className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                            <p className="text-xs text-muted-foreground">{auction.notices}</p>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center gap-3 mt-auto pt-4 border-t border-border">
                        <Link href={`/auction/${auction.id}`} className={cn("flex-1")}>
                            <Button
                                variant="outline"
                                className="w-full text-xs md:text-sm"
                            >
                                View Catalog
                            </Button>
                        </Link>
                        {auction.status !== "closed" && (
                            isRegistered ? (
                                <Button
                                    className="flex-1 gap-2 text-xs md:text-sm"
                                    variant="outline"
                                    disabled
                                >
                                    <CheckCircle className="h-4 w-4 text-emerald-500" />
                                    Registered
                                </Button>
                            ) : (
                                <Button
                                    className="flex-1 bg-primary hover:bg-primary/90 text-xs md:text-sm"
                                    onClick={handleRegisterClick}
                                >
                                    Register to Bid
                                </Button>
                            )
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuctionCard;
