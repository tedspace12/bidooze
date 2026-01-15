import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { TrendingUp, Share2, MapPin, Clock, Layers } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import SectionHeader from "@/components/shared/SectionHeader";

const hotAuctions = [
    {
        id: "1",
        title: "Classic Car Collection Sale",
        coverImage: "https://images.unsplash.com/photo-1489824904134-891ab64532f1?w=800&h=600&fit=crop",
        auctioneer: { name: "Barrett-Jackson", avatar: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=100&h=100&fit=crop" },
        totalLots: 150,
        startDate: "Dec 15, 2024",
        endDate: "Dec 20, 2024",
        description: "Featuring rare vintage muscle cars and classic automobiles from prestigious collections.",
        location: "Scottsdale, AZ",
        status: "live",
    },
    {
        id: "2",
        title: "Modern & Contemporary Art",
        coverImage: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800&h=600&fit=crop",
        auctioneer: { name: "Christie's", avatar: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=100&h=100&fit=crop" },
        totalLots: 85,
        startDate: "Dec 18, 2024",
        endDate: "Dec 22, 2024",
        description: "Masterworks by leading contemporary artists including Basquiat, Warhol, and Hockney.",
        location: "New York, NY",
        status: "closing-soon",
    },
    {
        id: "3",
        title: "Fine Jewelry & Watches",
        coverImage: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&h=600&fit=crop",
        auctioneer: { name: "Sotheby's", avatar: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=100&h=100&fit=crop" },
        totalLots: 200,
        startDate: "Dec 20, 2024",
        endDate: "Dec 25, 2024",
        description: "Exceptional diamonds, colored gemstones, and luxury timepieces from renowned houses.",
        location: "Geneva, Switzerland",
        status: "live",
    },
];

export const statusConfig: Record<string, { label: string; className: string }> = {
    live: { label: "Bidding Open", className: "bg-emerald-500 text-white" },
    "closing-soon": { label: "Closing Soon", className: "bg-amber-500 text-white" },
};

const HotAuctions = () => {
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
                {hotAuctions.map((auction) => (
                    <Link key={auction.id} href={`/auction/${auction.id}`}>
                        <div className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-xl transition-all group">
                            {/* Cover Image */}
                            <div className="relative h-48 overflow-hidden">
                                <Image
                                    src={auction.coverImage}
                                    alt={auction.title}
                                    width={500}
                                    height={500}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                                <Badge className={`absolute top-3 left-3 ${statusConfig[auction.status].className} text-[10px] md:text-xs py-px md:py-0.5`}>
                                    <TrendingUp className="h-3 w-3 mr-1" />
                                    {statusConfig[auction.status].label}
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
                                            navigator.share?.({ title: auction.title, url: `/auction/${auction.id}` });
                                        }}
                                        className="p-1.5 rounded-full hover:bg-muted transition-colors shrink-0"
                                    >
                                        <Share2 className="h-4 w-4 text-muted-foreground" />
                                    </button>
                                </div>

                                <div className="flex items-center gap-2 mb-3">
                                    <Avatar className="h-5 w-5">
                                        <AvatarImage src={auction.auctioneer.avatar} />
                                        <AvatarFallback>{auction.auctioneer.name[0]}</AvatarFallback>
                                    </Avatar>
                                    <span className="text-sm text-muted-foreground">{auction.auctioneer.name}</span>
                                </div>

                                <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{auction.description}</p>

                                <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-3">
                                    <Clock className="h-3.5 w-3.5" />
                                    {auction.startDate} - {auction.endDate}
                                </div>

                                <div className="flex flex-wrap gap-3 text-sm text-muted-foreground mb-4">
                                    <div className="flex items-center gap-1.5">
                                        <Layers className="h-3.5 w-3.5" />
                                        {auction.totalLots} Lots
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <MapPin className="h-3.5 w-3.5" />
                                        {auction.location}
                                    </div>
                                </div>

                                <div className="flex gap-3 pt-4 border-t border-border">
                                    <Button variant="outline" className="flex-1" size="sm">
                                        View Catalog
                                    </Button>
                                    <Button className="flex-1" size="sm">
                                        Register to Bid
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default HotAuctions;
