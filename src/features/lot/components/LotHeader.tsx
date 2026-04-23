import { useState, type MouseEvent } from "react";
import { Button } from "@/components/ui/button";
import { Share2, Heart } from "lucide-react";
import { toast } from "sonner";
import { useAuction } from "@/features/auction/hooks/useAuction";

interface LotHeaderProps {
    title: string;
    lotNumberLabel: string;
    lotId: string;
    isWatchlisted?: boolean;
}

const LotHeader = ({ title, lotNumberLabel, lotId, isWatchlisted = false }: LotHeaderProps) => {
    const { useAddToWatchlist, useRemoveFromWatchlist } = useAuction();
    const addToWatchlistMutation = useAddToWatchlist();
    const removeFromWatchlistMutation = useRemoveFromWatchlist();
    const [watchlistState, setWatchlistState] = useState(isWatchlisted);

    const handleShare = () => {
        navigator.clipboard.writeText(window.location.href);
        toast("Link copied!", {
            description: "Lot link has been copied to your clipboard.",
        });
    };

    const handleWatchlist = async (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        e.stopPropagation();

        try {
            if (watchlistState) {
                await removeFromWatchlistMutation.mutateAsync(lotId);
                setWatchlistState(false);
                toast("Removed from watchlist", {
                    description: "This lot has been removed from your watchlist.",
                });
            } else {
                await addToWatchlistMutation.mutateAsync(lotId);
                setWatchlistState(true);
                toast("Added to watchlist", {
                    description: "You'll be notified of updates on this lot.",
                });
            }
        } catch (error: any) {
            toast.error("Watchlist update failed", {
                description: error?.message || "Unable to update your watchlist right now.",
            });
        }
    };

    return (
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div>
                <p className="text-xs md:text-sm text-muted-foreground font-medium mb-1">
                    Lot ID: {lotNumberLabel}
                </p>
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground leading-tight">
                    {title}
                </h1>
            </div>

            <div className="flex items-center gap-3 shrink-0">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={handleShare}
                    className="gap-2 text-xs sm:text-sm"
                >
                    <Share2 className="h-3.5 w-3.5 md:h-4 md:w-4" />
                    Share
                </Button>
                <Button
                    variant={watchlistState ? "default" : "outline"}
                    size="sm"
                    onClick={handleWatchlist}
                    className="gap-2 text-xs sm:text-sm"
                >
                    <Heart className={`h-4 w-4 ${watchlistState ? "fill-current" : ""}`} />
                    {watchlistState ? "Watching" : "Watch"}
                </Button>
            </div>
        </div>
    );
};

export default LotHeader;
