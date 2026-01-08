import { Card } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, Mail, Facebook, Twitter, Instagram } from "lucide-react";
import Image from "next/image";

interface BuyersPremium {
    startRange: number;
    endRange: number | null;
    percentage: number;
}

interface BidIncrement {
    startRange: number;
    endRange: number | null;
    increment: number;
}

interface AuctionInfoProps {
    auction: {
        title: string;
        fullDescription: string;
        auctioneer: {
            name: string;
            avatar: string;
            address: string;
            phone: string;
            email: string;
            socialLinks: {
                facebook?: string;
                twitter?: string;
                instagram?: string;
            };
        };
        buyersPremium: BuyersPremium[];
        bidIncrements: BidIncrement[];
        shippingInfo: string;
        termsAndConditions: string;
    };
}

const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(price);
};

const AuctionInfo = ({ auction }: AuctionInfoProps) => {
    return (
        <div className="space-y-8">
            {/* Auction Description */}
            <Card className="p-6">
                <h2 className="text-xl font-semibold text-foreground mb-4">About This Auction</h2>
                <div className="prose prose-sm max-w-none text-muted-foreground whitespace-pre-line">
                    {auction.fullDescription}
                </div>
            </Card>

            {/* Auctioneer Details */}
            <Card className="p-6">
                <h2 className="text-xl font-semibold text-foreground mb-4">Auctioneer</h2>
                <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex items-start gap-4">
                        <Image
                            src={auction.auctioneer.avatar}
                            alt={auction.auctioneer.name}
                            width={500}
                            height={500}
                            className="w-16 h-16 rounded-full object-cover"
                        />
                        <div>
                            <h3 className="font-semibold text-foreground text-lg">{auction.auctioneer.name}</h3>
                            <div className="space-y-2 mt-3 text-sm text-muted-foreground">
                                <div className="flex items-start gap-2">
                                    <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
                                    <span>{auction.auctioneer.address}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Phone className="h-4 w-4 shrink-0" />
                                    <a href={`tel:${auction.auctioneer.phone}`} className="hover:text-primary">
                                        {auction.auctioneer.phone}
                                    </a>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Mail className="h-4 w-4 shrink-0" />
                                    <a href={`mailto:${auction.auctioneer.email}`} className="hover:text-primary">
                                        {auction.auctioneer.email}
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Social Links */}
                    <div className="flex gap-2 md:ml-auto">
                        {auction.auctioneer.socialLinks.facebook && (
                            <Button variant="outline" size="icon" asChild>
                                <a href={auction.auctioneer.socialLinks.facebook} target="_blank" rel="noopener noreferrer">
                                    <Facebook className="h-4 w-4" />
                                </a>
                            </Button>
                        )}
                        {auction.auctioneer.socialLinks.twitter && (
                            <Button variant="outline" size="icon" asChild>
                                <a href={auction.auctioneer.socialLinks.twitter} target="_blank" rel="noopener noreferrer">
                                    <Twitter className="h-4 w-4" />
                                </a>
                            </Button>
                        )}
                        {auction.auctioneer.socialLinks.instagram && (
                            <Button variant="outline" size="icon" asChild>
                                <a href={auction.auctioneer.socialLinks.instagram} target="_blank" rel="noopener noreferrer">
                                    <Instagram className="h-4 w-4" />
                                </a>
                            </Button>
                        )}
                    </div>
                </div>
            </Card>

            {/* Buyer's Premium */}
            <Card className="p-6">
                <h2 className="text-xl font-semibold text-foreground mb-4">Buyer&apos;s Premium</h2>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Bid Range</TableHead>
                            <TableHead>Premium</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {auction.buyersPremium.map((tier, index) => (
                            <TableRow key={index}>
                                <TableCell>
                                    {formatPrice(tier.startRange)} - {tier.endRange ? formatPrice(tier.endRange) : "and above"}
                                </TableCell>
                                <TableCell>{tier.percentage}%</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Card>

            {/* Bid Increments */}
            <Card className="p-6">
                <h2 className="text-xl font-semibold text-foreground mb-4">Bid Increments</h2>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Bid Range</TableHead>
                            <TableHead>Increment</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {auction.bidIncrements.map((tier, index) => (
                            <TableRow key={index}>
                                <TableCell>
                                    {formatPrice(tier.startRange)} - {tier.endRange ? formatPrice(tier.endRange) : "and above"}
                                </TableCell>
                                <TableCell>{formatPrice(tier.increment)}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Card>

            {/* Shipping Info */}
            <Card className="p-6">
                <h2 className="text-xl font-semibold text-foreground mb-4">Shipping Information</h2>
                <p className="text-muted-foreground">{auction.shippingInfo}</p>
            </Card>

            {/* Terms & Conditions */}
            <Card className="p-6">
                <h2 className="text-xl font-semibold text-foreground mb-4">Terms & Conditions</h2>
                <div className="prose prose-sm max-w-none text-muted-foreground whitespace-pre-line">
                    {auction.termsAndConditions}
                </div>
            </Card>
        </div>
    );
};

export default AuctionInfo;