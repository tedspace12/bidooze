import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Share2, Bell, Calendar, CheckCircle, Clock, AlertTriangle, XCircle, Ban } from "lucide-react";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { AuctionLifecycle } from "@/lib/auctionLifecycle";
import { BUYER_AUCTION_LIFECYCLE_BADGES } from "@/lib/auctionLifecycle";

type RegistrationStatus = string | null;

interface AuctionHeaderProps {
    auction: {
        id?: string;
        title: string;
        status: AuctionLifecycle;
        auctioneer: {
            name: string;
            avatar: string;
        };
        startDate: string;
        endDate: string;
        description: string;
    };
    registrationStatus?: RegistrationStatus;
}

const statusConfig = BUYER_AUCTION_LIFECYCLE_BADGES;

const formatDateWithOrdinal = (date: Date) => {
    const day = date.getDate();
    const suffix = ["th", "st", "nd", "rd"][day % 10 > 3 ? 0 : (day % 100 - day % 10 !== 10 ? day % 10 : 0)];
    return `${day}${suffix} ${format(date, "MMMM yyyy")}`;
};

const RegistrationBadge = ({ status }: { status: string }) => {
    switch (status) {
        case "approved":
            return (
                <Badge className="gap-1.5 bg-emerald-500/10 text-emerald-600 border-emerald-300 dark:text-emerald-400 dark:border-emerald-800">
                    <CheckCircle className="h-3.5 w-3.5" />
                    Registered
                </Badge>
            );
        case "pending_approval":
            return (
                <Badge className="gap-1.5 bg-amber-500/10 text-amber-700 border-amber-300 dark:text-amber-400 dark:border-amber-800">
                    <Clock className="h-3.5 w-3.5" />
                    Pending Approval
                </Badge>
            );
        case "pending_deposit":
            return (
                <Badge className="gap-1.5 bg-blue-500/10 text-blue-700 border-blue-300 dark:text-blue-400 dark:border-blue-800">
                    <Clock className="h-3.5 w-3.5" />
                    Deposit Required
                </Badge>
            );
        case "rejected":
            return (
                <Badge className="gap-1.5 bg-destructive/10 text-destructive border-destructive/30">
                    <XCircle className="h-3.5 w-3.5" />
                    Registration Declined
                </Badge>
            );
        case "suspended":
            return (
                <Badge className="gap-1.5 bg-orange-500/10 text-orange-700 border-orange-300 dark:text-orange-400 dark:border-orange-800">
                    <Ban className="h-3.5 w-3.5" />
                    Registration Suspended
                </Badge>
            );
        default:
            return (
                <Badge variant="secondary" className="gap-1.5">
                    <AlertTriangle className="h-3.5 w-3.5" />
                    {status}
                </Badge>
            );
    }
};

const AuctionHeader = ({ auction, registrationStatus = null }: AuctionHeaderProps) => {
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
        router.push(`/auction/register?source=auction&id=${auction.id || "1"}`);
    };

    const handlePayDeposit = () => {
        router.push(`/auction/register?source=auction&id=${auction.id || "1"}`);
    };

    const renderRegistrationAction = () => {
        if (auction.status === "closed") return null;

        if (registrationStatus === null) {
            return (
                <Button className="gap-2" onClick={handleRegisterClick}>
                    Register to Bid
                </Button>
            );
        }

        return (
            <div className="flex flex-col gap-1.5">
                <Button className="gap-2" variant="outline" disabled>
                    <CheckCircle className="h-4 w-4 text-emerald-500" />
                    Registered
                </Button>
                <RegistrationBadge status={registrationStatus} />
            </div>
        );
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
                    {renderRegistrationAction()}
                    {/* <Button variant="outline" className="gap-2" onClick={handleSetReminder}>
                        <Bell className="h-4 w-4" />
                        Set Reminder
                    </Button> */}
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
