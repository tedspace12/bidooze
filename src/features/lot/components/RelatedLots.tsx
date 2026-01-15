import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, ArrowRight, Eye } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import SectionHeader from "@/components/shared/SectionHeader";

const relatedLots = [
    {
        id: 1,
        image: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400",
        title: "1969 Chevrolet Camaro Z/28",
        currentBid: 89000,
        endTime: "2d 5h",
    },
    {
        id: 2,
        image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400",
        title: "1970 Plymouth Cuda 440",
        currentBid: 145000,
        endTime: "1d 12h",
    },
    {
        id: 3,
        image: "https://images.unsplash.com/photo-1571607388263-1044f9ea01dd?w=400",
        title: "1967 Ford Mustang Fastback",
        currentBid: 67500,
        endTime: "3d 8h",
    },
    {
        id: 4,
        image: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=400",
        title: "1965 Shelby Cobra 427",
        currentBid: 285000,
        endTime: "5h 30m",
    },
];

const RelatedLots = () => {
    const router = useRouter();

    return (
        <section className="mt-12">
            <SectionHeader
                title="Other Lots in This Auction"
                description="Explore more items from this collection"
                actionElement={
                    <Button onClick={() => router.push('/auction/1')} variant="outline" className="gap-2">
                        View Full Catalog
                        <ArrowRight className="h-4 w-4" />
                    </Button>
                }
            />

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {relatedLots.map((lot) => (
                    <Link key={lot.id} href={`/lot/${lot.id}`}>
                        <Card className="group overflow-hidden border-border hover:border-primary/50 transition-all hover:shadow-lg">
                            <div className="relative aspect-6/3 md:aspect-4/3 overflow-hidden">
                                <Image
                                    src={lot.image}
                                    alt={lot.title}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                                <Badge className="absolute top-3 left-3 bg-background/90 text-foreground text-[10px] md:text-xs py-px md:py-0.5">
                                    <Clock className="h-3 w-3 mr-1" />
                                    {lot.endTime}
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
                                <p className="text-xs font-medium text-amber-600 mb-2">23 bids</p>
                                <p className="text-base md:text-lg font-bold text-primary">
                                    ${lot.currentBid.toLocaleString()}
                                </p>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>
        </section>
    );
};

export default RelatedLots;
