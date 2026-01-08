'use client';

import { ChevronRight } from "lucide-react";
import Link from "next/link";
import LotHeader from "./components/LotHeader";
import ImageGallery from "./components/ImageGallery";
import AuctionDetails from "./components/AuctionDetails";
import BidSummary from "./components/BidSummary";
import BiddingActions from "./components/BiddingActions";
import AuctioneerInfo from "./components/AuctioneerInfo";
import ShippingInfo from "./components/ShippingInfo";
import BiddingNotice from "./components/BiddingNotice";
import RelatedLots from "./components/RelatedLots";

// Mock data for the lot
const lotData = {
    id: "LOT-2024-8847",
    title: "Rare 1967 Shelby GT500 Eleanor Recreation - Fully Restored",
    images: [
        "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800",
        "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800",
        "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800",
        "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800",
        "https://images.unsplash.com/photo-1525609004556-c46c7d6cf023?w=800",
    ],
    currentBid: 125000,
    startingBid: 75000,
    bidsCount: 47,
    endTime: "2024-12-15T18:00:00",
    startTime: "2024-12-01T09:00:00",
    closeType: "Soft Close",
    shippingAvailable: true,
    description: `This stunning 1967 Shelby GT500 Eleanor recreation represents the pinnacle of American muscle car excellence. Meticulously restored over a 3-year period by master craftsmen, this vehicle features a numbers-matching 428 Police Interceptor V8 engine producing 355 horsepower.

The exterior showcases the iconic Pepper Gray Metallic paint with Wimbledon White Le Mans stripes, perfectly complemented by period-correct chrome accents and the distinctive Eleanor body kit. The interior has been fully reupholstered in premium black leather with white stitching.

Notable features include:
• Original 428 PI engine, fully rebuilt
• C6 automatic transmission
• Power steering and brakes
• Vintage Air conditioning
• Custom exhaust system
• Shelby 10-spoke wheels with Goodyear tires
• Complete documentation and build records`,
    auction: {
        name: "Premier Classic Car Auction - December 2024",
        type: "Online Only",
        date: "December 15, 2024",
        time: "6:00 PM EST",
        location: "Scottsdale, Arizona",
        buyerPremium: "15%",
    },
    auctioneer: {
        name: "Heritage Auctions",
        logo: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=100",
        rating: 4.9,
        totalAuctions: 1250,
    },
    bidIncrements: [
        { range: "$0 - $999", increment: "$25" },
        { range: "$1,000 - $4,999", increment: "$100" },
        { range: "$5,000 - $24,999", increment: "$250" },
        { range: "$25,000 - $99,999", increment: "$500" },
        { range: "$100,000+", increment: "$2,500" },
    ],
};

const LotDetail = () => {

    return (
        <>
            {/* Breadcrumb */}
            <div className="container mx-auto px-4 py-4">
                <nav className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Link href="/" className="hover:text-primary transition-colors">Home</Link>
                    <ChevronRight className="h-4 w-4" />
                    <Link href="/auctions" className="hover:text-primary transition-colors">Auctions</Link>
                    <ChevronRight className="h-4 w-4" />
                    <Link href="/auction/1" className="hover:text-primary transition-colors">Classic Cars</Link>
                    <ChevronRight className="h-4 w-4" />
                    <span className="text-foreground font-medium truncate max-w-[200px]">{lotData.title}</span>
                </nav>
            </div>

            {/* Main Content */}
            <main className="container mx-auto px-4 pb-12">
                <LotHeader
                    title={lotData.title}
                    lotId={lotData.id}
                />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-6">
                    {/* Left Column - Images & Details */}
                    <div className="lg:col-span-2 space-y-8">
                        <ImageGallery images={lotData.images} title={lotData.title} />

                        <div className="prose prose-lg max-w-none">
                            <h3 className="text-xl font-semibold text-foreground mb-4">Lot Description</h3>
                            <p className="text-muted-foreground whitespace-pre-line leading-relaxed">
                                {lotData.description}
                            </p>
                        </div>

                        <AuctionDetails auction={lotData.auction} />
                    </div>

                    {/* Right Column - Bidding */}
                    <div className="space-y-6">
                        <BidSummary
                            currentBid={lotData.currentBid}
                            bidsCount={lotData.bidsCount}
                            endTime={lotData.endTime}
                            closeType={lotData.closeType}
                            shippingAvailable={lotData.shippingAvailable}
                        />

                        <BiddingActions
                            currentBid={lotData.currentBid}
                            bidIncrements={lotData.bidIncrements}
                            startTime={lotData.startTime}
                            endTime={lotData.endTime}
                            id={lotData.id}
                            title={lotData.title}
                            images={lotData.images}
                        />

                        <AuctioneerInfo auctioneer={lotData.auctioneer} />

                        <ShippingInfo shippingAvailable={lotData.shippingAvailable} />

                        <BiddingNotice />
                    </div>
                </div>

                <RelatedLots />
            </main>
        </>
    );
};

export default LotDetail;
