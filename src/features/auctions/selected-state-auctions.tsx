'use client';

import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import CategoryGrid from "../home/components/CategoryGrid";
import TopPicks from "../home/components/TopPicks";
import HotAuctions, { statusConfig } from "../home/components/HotAuctions";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import Link from "next/link";
import Image from "next/image";
import { Clock, Layers, MapPin, Share2, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useParams } from "next/navigation";

const liveAuctions = [
    {
        id: 1,
        title: "Classic Car Collection Sale",
        coverImage: "https://images.unsplash.com/photo-1489824904134-891ab64532f1?w=800&h=600&fit=crop",
        auctioneer: { name: "Barrett-Jackson", avatar: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=100&h=100&fit=crop" },
        totalLots: 150,
        startDate: "Dec 15, 2024",
        endDate: "Dec 20, 2024",
        location: "Scottsdale, AZ",
        status: "live",
    },
    {
        id: 2,
        title: "Modern & Contemporary Art",
        coverImage: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800&h=600&fit=crop",
        auctioneer: { name: "Christie's", avatar: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=100&h=100&fit=crop" },
        totalLots: 85,
        startDate: "Dec 18, 2024",
        endDate: "Dec 22, 2024",
        location: "New York, NY",
        status: "closing-soon",
    },
    {
        id: 3,
        title: "Fine Jewelry & Watches",
        coverImage: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&h=600&fit=crop",
        auctioneer: { name: "Sotheby's", avatar: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=100&h=100&fit=crop" },
        totalLots: 200,
        startDate: "Dec 20, 2024",
        endDate: "Dec 25, 2024",
        location: "Geneva, Switzerland",
        status: "live",
    },
    {
        id: 4,
        title: "Classic Car Collection Sale",
        coverImage: "https://images.unsplash.com/photo-1489824904134-891ab64532f1?w=800&h=600&fit=crop",
        auctioneer: { name: "Barrett-Jackson", avatar: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=100&h=100&fit=crop" },
        totalLots: 150,
        startDate: "Dec 15, 2024",
        endDate: "Dec 20, 2024",
        location: "Scottsdale, AZ",
        status: "live",
    },
    {
        id: 5,
        title: "Modern & Contemporary Art",
        coverImage: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800&h=600&fit=crop",
        auctioneer: { name: "Christie's", avatar: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=100&h=100&fit=crop" },
        totalLots: 85,
        startDate: "Dec 18, 2024",
        endDate: "Dec 22, 2024",
        location: "New York, NY",
        status: "closing-soon",
    },
    {
        id: 6,
        title: "Fine Jewelry & Watches",
        coverImage: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&h=600&fit=crop",
        auctioneer: { name: "Sotheby's", avatar: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=100&h=100&fit=crop" },
        totalLots: 200,
        startDate: "Dec 20, 2024",
        endDate: "Dec 25, 2024",
        location: "Geneva, Switzerland",
        status: "live",
    },
    {
        id: 7,
        title: "Classic Car Collection Sale",
        coverImage: "https://images.unsplash.com/photo-1489824904134-891ab64532f1?w=800&h=600&fit=crop",
        auctioneer: { name: "Barrett-Jackson", avatar: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=100&h=100&fit=crop" },
        totalLots: 150,
        startDate: "Dec 15, 2024",
        endDate: "Dec 20, 2024",
        location: "Scottsdale, AZ",
        status: "live",
    },
    {
        id: 8,
        title: "Modern & Contemporary Art",
        coverImage: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800&h=600&fit=crop",
        auctioneer: { name: "Christie's", avatar: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=100&h=100&fit=crop" },
        totalLots: 85,
        startDate: "Dec 18, 2024",
        endDate: "Dec 22, 2024",
        location: "New York, NY",
        status: "closing-soon",
    },
    {
        id: 9,
        title: "Fine Jewelry & Watches",
        coverImage: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&h=600&fit=crop",
        auctioneer: { name: "Sotheby's", avatar: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=100&h=100&fit=crop" },
        totalLots: 200,
        startDate: "Dec 20, 2024",
        endDate: "Dec 25, 2024",
        location: "Geneva, Switzerland",
        status: "live",
    },
];

const SelectedStateAuctions = () => {
    const params = useParams();
    const { state } = params;

    return (
        <main className="container mx-auto py-8">
            {/* Breadcrumb */}
            <Breadcrumb className="mb-6 px-4">
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/">Home</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/auctions/state">Auctions by State</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>{state || 'State'}</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2 px-4">Live & Online Auctions in {state || 'State'}</h1>
            <div className="px-4 mt-10">
                <Carousel className="w-full" opts={{ align: "start", loop: false }}>
                    <CarouselContent className="-ml-4">
                        {liveAuctions.map((auction) => (
                            <CarouselItem key={auction.id} className="pl-4 md:basis-1/2 lg:basis-1/4">
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
                                            <Badge className={`absolute top-3 left-3 ${statusConfig[auction.status].className}`}>
                                                <TrendingUp className="h-3 w-3 mr-1" />
                                                {statusConfig[auction.status].label}
                                            </Badge>
                                        </div>

                                        {/* Content */}
                                        <div className="p-5">
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

                                            <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-3">
                                                <Clock className="h-3.5 w-3.5" />
                                                {auction.startDate} - {auction.endDate}
                                            </div>

                                            <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                                                <div className="flex items-center gap-1.5">
                                                    <Layers className="h-3.5 w-3.5" />
                                                    {auction.totalLots} Lots
                                                </div>
                                                <div className="flex items-center gap-1.5">
                                                    <MapPin className="h-3.5 w-3.5" />
                                                    {auction.location}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselPrevious className="left-0" />
                    <CarouselNext className="right-0" />
                </Carousel>
            </div>
            <CategoryGrid />
            <TopPicks />
            <HotAuctions />
        </main>
    )
}

export default SelectedStateAuctions;