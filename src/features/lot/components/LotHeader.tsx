import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Share2, Heart } from "lucide-react";
import { toast } from "sonner";

interface LotHeaderProps {
    title: string;
    lotId: string;
}

const LotHeader = ({ title, lotId }: LotHeaderProps) => {
    const [isWatchlisted, setIsWatchlisted] = useState(false);

    const handleShare = () => {
        navigator.clipboard.writeText(window.location.href);
        toast("Link copied!", {
            description: "Lot link has been copied to your clipboard.",
        });
    };

    const handleWatchlist = () => {
        setIsWatchlisted(!isWatchlisted);
        toast(isWatchlisted ? "Removed from watchlist" : "Added to watchlist", {
            description: isWatchlisted
                ? "This lot has been removed from your watchlist."
                : "You'll be notified of updates on this lot.",
        });
    };

    return (
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div>
                <p className="text-sm text-muted-foreground font-medium mb-1">
                    Lot ID: {lotId}
                </p>
                <h1 className="text-2xl md:text-3xl font-bold text-foreground leading-tight">
                    {title}
                </h1>
            </div>

            <div className="flex items-center gap-3 shrink-0">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={handleShare}
                    className="gap-2"
                >
                    <Share2 className="h-4 w-4" />
                    Share
                </Button>
                <Button
                    variant={isWatchlisted ? "default" : "outline"}
                    size="sm"
                    onClick={handleWatchlist}
                    className="gap-2"
                >
                    <Heart className={`h-4 w-4 ${isWatchlisted ? "fill-current" : ""}`} />
                    {isWatchlisted ? "Watching" : "Watch"}
                </Button>
            </div>
        </div>
    );
};

export default LotHeader;
