import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";
import Link from "next/link";

interface Lot {
    id: string;
    lotNumber: number;
    title: string;
    image: string;
    currentBid: number;
    estimateLow: number;
    estimateHigh: number;
    status: "open" | "closed";
    realizedPrice?: number;
}

interface FeaturedLotsSliderProps {
    lots: Lot[];
}

const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(price);
};

const FeaturedLotsSlider = ({ lots }: FeaturedLotsSliderProps) => {
    if (lots.length === 0) return null;

    return (
        <section className="mb-10">
            <h2 className="text-xl font-semibold text-foreground mb-4">Featured Lots</h2>

            <Carousel
                opts={{
                    align: "start",
                    loop: true,
                }}
                className="w-full"
            >
                <CarouselContent className="-ml-4">
                    {lots.map((lot) => (
                        <CarouselItem key={lot.id} className="pl-4 basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                            <Link href={`/lot/${lot.id}`}>
                                <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                                    <div className="relative aspect-4/3">
                                        <Image
                                            src={lot.image}
                                            alt={lot.title}
                                            width={500}
                                            height={500}
                                            className="w-full h-full object-cover"
                                        />
                                        <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground">
                                            Lot #{lot.lotNumber}
                                        </Badge>
                                    </div>
                                    <div className="p-4">
                                        <h3 className="font-medium text-foreground line-clamp-1 mb-2">
                                            {lot.title}
                                        </h3>
                                        <p className="font-medium text-xs text-amber-600 mb-2">23 Bids</p>
                                        {lot.status === "open" ? (
                                            <div>
                                                <p className="text-xs text-muted-foreground">Current Bid</p>
                                                <p className="text-lg font-semibold text-foreground">
                                                    {formatPrice(lot.currentBid)}
                                                </p>
                                            </div>
                                        ) : (
                                            <div>
                                                <p className="text-xs text-muted-foreground">Estimate</p>
                                                <p className="text-sm text-foreground">
                                                    {formatPrice(lot.estimateLow)} - {formatPrice(lot.estimateHigh)}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </Card>
                            </Link>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious className="-left-4 bg-background border-border" />
                <CarouselNext className="-right-4 bg-background border-border" />
            </Carousel>
        </section>
    );
};

export default FeaturedLotsSlider;