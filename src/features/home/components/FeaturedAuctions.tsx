import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Eye } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const featuredAuctions = [
    {
        id: 1,
        image: '/images/hero-auction-1.jpg',
        title: "Victorian Era Writing Desk",
        currentBid: "$2,450",
        endTime: "2h 15m",
        bids: 23,
    },
    {
        id: 2,
        image: '/images/hero-auction-2.jpg',
        title: "1965 Ferrari 275 GTB",
        currentBid: "$1,850,000",
        endTime: "1d 8h",
        bids: 47,
    },
    {
        id: 3,
        image: '/images/hero-auction-3.jpg',
        title: "Abstract Expressionist Oil Painting",
        currentBid: "$18,500",
        endTime: "5h 42m",
        bids: 31,
    },
    {
        id: 4,
        image: '/images/hero-auction-1.jpg',
        title: "Antique Crystal Chandelier",
        currentBid: "$5,200",
        endTime: "4h 30m",
        bids: 18,
    },
    {
        id: 5,
        image: '/images/hero-auction-2.jpg',
        title: "1970 Chevrolet Chevelle SS",
        currentBid: "$68,000",
        endTime: "3d 2h",
        bids: 52,
    },
    {
        id: 6,
        image: '/images/hero-auction-3.jpg',
        title: "Contemporary Sculpture Collection",
        currentBid: "$12,800",
        endTime: "6h 15m",
        bids: 29,
    },
];

const FeaturedAuctions = () => {
    return (
        <div className="container mx-auto px-4 py-12">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-3xl font-bold text-foreground">Featured Auctions Items</h2>
                    <p className="text-muted-foreground mt-2">Handpicked premium auctions ending soon</p>
                </div>
                {/* <Button variant="outline">View All</Button> */}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredAuctions.map((auction) => (
                    <Link key={auction.id} href={`/lot/${auction.id}`}>
                        <Card key={auction.id} className="overflow-hidden group cursor-pointer hover:shadow-xl transition-all">
                            <div className="relative h-64 overflow-hidden">
                                <Image
                                    src={auction.image}
                                    alt={auction.title}
                                    width={500}
                                    height={500}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                                <button className="absolute top-4 right-4 p-2 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background transition-colors">
                                    <Eye className="h-4 w-4" />
                                </button>
                            </div>
                            <div className="p-5 space-y-3">
                                <h3 className="font-semibold text-lg line-clamp-1">{auction.title}</h3>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-muted-foreground">Current Bid</p>
                                        <p className="text-xl font-bold text-primary">{auction.currentBid}</p>
                                    </div>
                                    <div className="text-right">
                                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                            <Clock className="h-3.5 w-3.5" />
                                            {auction.endTime}
                                        </div>
                                        <Badge variant="secondary" className="mt-1">
                                            {auction.bids} bids
                                        </Badge>
                                    </div>
                                </div>
                                {/* <Button className="w-full">Place Bid</Button> */}
                            </div>
                        </Card>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default FeaturedAuctions;
