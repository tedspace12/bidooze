import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Share2, Bell, Calendar, CheckCircle } from "lucide-react";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type AuctionStatus = "live" | "upcoming" | "closing-soon" | "closed";

interface AuctionHeaderProps {
    auction: {
        id?: string;
        title: string;
        status: AuctionStatus;
        auctioneer: {
            name: string;
            avatar: string;
        };
        startDate: string;
        endDate: string;
        description: string;
    };
    isRegistered?: boolean;
}

const statusConfig: Record<AuctionStatus, { label: string; className: string }> = {
    live: { label: "Bidding Open", className: "bg-emerald-500 text-white" },
    upcoming: { label: "Upcoming", className: "bg-blue-500 text-white" },
    "closing-soon": { label: "Closing Soon", className: "bg-amber-500 text-white" },
    closed: { label: "Closed", className: "bg-muted text-muted-foreground" },
};

const formatDateWithOrdinal = (date: Date) => {
    const day = date.getDate();
    const suffix = ["th", "st", "nd", "rd"][day % 10 > 3 ? 0 : (day % 100 - day % 10 !== 10 ? day % 10 : 0)];
    return `${day}${suffix} ${format(date, "MMMM yyyy")}`;
};

const AuctionHeader = ({ auction, isRegistered = false }: AuctionHeaderProps) => {
    const router = useRouter();

    const handleShare = () => {
        navigator.clipboard.writeText(window.location.href);
        toast("Link copied!", {
            description: "Auction link has been copied to your clipboard.",
        });
    };

    const handleSetReminder = () => {
        toast("Reminder set!", {
            description: "You'll be notified before this auction starts.",
        });
    };

    const handleRegisterClick = () => {
        if (!isRegistered) {
            router.push(`/auction/register?source=auction&id=${auction.id || "1"}`);
        }
    };

    return (
        <div className="bg-card border border-border rounded-xl p-4 md:p-6">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 md:gap-6">
                <div className="flex-1">
                    {/* Status Badge */}
                    <Badge className={`mb-2 md:mb-3 ${statusConfig[auction.status].className} text-[10px] md:text-xs py-px md:px-0.5`}>
                        {statusConfig[auction.status].label}
                    </Badge>

                    {/* Title */}
                    <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                        {auction.title}
                    </h1>

                    {/* Auctioneer */}
                    <div className="flex items-center gap-3 mb-4">
                        <Avatar className="h-10 w-10">
                            <AvatarImage src={auction.auctioneer.avatar} />
                            <AvatarFallback>{auction.auctioneer.name[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="text-sm text-muted-foreground">Presented by</p>
                            <p className="font-medium text-foreground">{auction.auctioneer.name}</p>
                        </div>
                    </div>

                    {/* Date Range */}
                    <div className="flex items-center gap-2 text-muted-foreground mb-4">
                        <Calendar className="h-4 w-4" />
                        <span className="text-sm md:text-base">
                            {formatDateWithOrdinal(new Date(auction.startDate))} - {formatDateWithOrdinal(new Date(auction.endDate))}
                        </span>
                    </div>

                    {/* Description */}
                    <p className="text-sm md:text-base text-muted-foreground max-w-2xl">
                        {auction.description}
                    </p>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
                    {isRegistered ? (
                        <Button className="gap-2" variant="outline" disabled>
                            <CheckCircle className="h-4 w-4 text-emerald-500" />
                            Registered
                        </Button>
                    ) : (
                        <Button className="gap-2" onClick={handleRegisterClick}>
                            Register to Bid
                        </Button>
                    )}
                    <Button variant="outline" className="gap-2" onClick={handleSetReminder}>
                        <Bell className="h-4 w-4" />
                        Set Reminder
                    </Button>
                    <Button variant="ghost" className="gap-2" onClick={handleShare}>
                        <Share2 className="h-4 w-4" />
                        Share
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default AuctionHeader;